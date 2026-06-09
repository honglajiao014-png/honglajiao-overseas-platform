import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendLeadNotification, shouldNotifyLead } from "@/lib/leadNotify";
import { CHAT_TEMPLATES } from "@/data/chat-templates";
import { KEYWORD_ROUTES } from "@/data/chat-keywords";
import { extractCountry, extractVehicle, extractBudget, extractQuantity } from "@/data/chat-levels";

// ======================== Prompt 模版 ========================
function getSystemPrompt(lang: string): string {
  // 语言映射：zh → en（中文用户也用英文模板），fr/ar 用对应模板，其余默认 en
  const templateLang = (lang === "fr" || lang === "ar") ? lang : "en";
  return CHAT_TEMPLATES.systemRole[templateLang as "en" | "fr" | "ar"] + "\n\nCurrent conversation:";
}

function buildPrompt(
  history: { role: string; content: string }[],
  lang: string,
  profile?: { country?: string | null; vehicleReq?: string | null; budget?: string | null; quantity?: number | null },
): string {
  // 注入客户画像到 system prompt
  let system = getSystemPrompt(lang);
  const profileParts: string[] = [];
  if (profile?.country) profileParts.push(`Country=${profile.country}`);
  if (profile?.vehicleReq) profileParts.push(`Vehicle=${profile.vehicleReq}`);
  if (profile?.budget) profileParts.push(`Budget=${profile.budget}`);
  if (profile?.quantity != null) profileParts.push(`Quantity=${profile.quantity}`);
  if (profileParts.length > 0) {
    system = `Customer profile: ${profileParts.join(", ")}\n\n` + system;
  }

  const messages = [{ role: "system", content: system }];
  for (const m of history.slice(-10)) {
    if (m.role === "system") continue;
    messages.push({ role: m.role === "user" ? "user" : "assistant", content: m.content });
  }
  return messages.map(m => `${m.role === "user" ? "User" : m.role === "assistant" ? "Assistant" : "System"}: ${m.content}`).join("\n\n");
}

// ======================== 意向等级判断 ========================
const LEVEL_LABELS: Record<number, string> = {
  0: "访客",
  1: "潜客",
  2: "意向",
  3: "高意向",
  4: "准订单",
};

const INTENT_KEYWORDS: [number, string[]][] = [
  [1, ["country", "destination", "ship to", "africa", "middle east", "nigeria", "kenya", "ghana", "tanzania", "ethiopia", "market",
       "dubai", "uae", "saudi", "jordan", "iraq", "libya", "uganda", "rwanda", "congo", "angola", "mozambique",
       "zambia", "zimbabwe", "senegal", "cameroon", "togo", "benin", "ivory coast"]],
  [2, ["toyota", "bmw", "mercedes", "audi", "byd", "honda", "nissan", "volkswagen", "lexus", "land rover", "porsche",
       "model", "budget", "price", "cost", "dollar", "usd", "quantity", "container", "port", "shipping cost",
       "20", "30", "40", "50", "how many", "corolla", "rav4", "hilux", "camry", "civic", "accord", "cr-v", "crv",
       "hyundai", "kia", "ford", "chevrolet", "suzuki", "mitsubishi", "tesla", "range rover"]],
  [3, ["email", "@", "whatsapp", "phone", "call", "contact", "add", "form", "inquiry", "wechat"]],
  [4, ["order", "deposit", "l/c", "letter of credit", "contract", "invoice", "booking", "purchase order", "urgent", "asap"]],
];

interface IntentResult {
  level: number;
  label: string;
}

function detectIntent(history: { role: string; content: string }[]): IntentResult {
  const texts = history.map(m => m.content.toLowerCase()).join(" ");
  let maxLevel = 0;
  for (const [level, keywords] of INTENT_KEYWORDS) {
    if (keywords.some(kw => texts.includes(kw))) {
      if (maxLevel < level) maxLevel = level;
    }
  }
  return { level: maxLevel, label: LEVEL_LABELS[maxLevel] };
}

// ======================== 关键词路由匹配 ========================
interface KeywordMatch {
  route: typeof KEYWORD_ROUTES[number];
  matchedKeyword: string;
}

function matchKeywords(text: string): KeywordMatch[] {
  const lower = text.toLowerCase();
  const matches: KeywordMatch[] = [];
  for (const route of KEYWORD_ROUTES) {
    for (const kw of route.keywords) {
      if (lower.includes(kw.toLowerCase())) {
        matches.push({ route, matchedKeyword: kw });
        break; // 每个 route 只匹配一次
      }
    }
  }
  return matches;
}

// ======================== POST Handler ========================
export async function POST(req: NextRequest) {
  try {
    const { message, sessionId, lang } = await req.json();
    if (!message) return NextResponse.json({ error: "Message required" }, { status: 400 });

    // 获取/创建 session
    let session = await prisma.chatSession.findUnique({ where: { id: sessionId }, include: { ChatMessage: { orderBy: { createdAt: "asc" } } } });
    if (!session) {
      session = await prisma.chatSession.create({ data: { id: sessionId }, include: { ChatMessage: { orderBy: { createdAt: "asc" } } } });
    }

    // 保存用户消息
    await prisma.chatMessage.create({
      data: { sessionId: session.id, role: "user", content: message },
    });

    // 构建对话历史
    const history = [...session.ChatMessage.map(m => ({ role: m.role, content: m.content })), { role: "user", content: message }];

    // ======================== 关键词路由匹配（千问之前） ========================
    const allText = history.map(m => m.content).join(" ");
    const keywordMatches = matchKeywords(allText);

    let escalateReply: string | null = null;
    let keywordContext = "";

    for (const match of keywordMatches) {
      if (match.route.action === "escalate") {
        // 不满情绪 → 直接返回模板回复，不调千问
        const templateLang = (lang === "fr" || lang === "ar" || lang === "zh") ? lang : "en";
        escalateReply = (match.route.reply as Record<string, string>)[templateLang] || match.route.reply.en;
        break; // escalate 优先级最高，直接跳出
      }
      if (match.route.action === "mark_urgent") {
        // 急单 → 提升 intentLevel 到 4
        await prisma.chatSession.update({ where: { id: session.id }, data: { intentLevel: 4 } });
      }
      // 收集匹配到的上下文（en fallback）
      const ctxLang = (lang === "fr" || lang === "ar" || lang === "zh") ? lang : "en";
      const ctx = (match.route.reply as Record<string, string>)[ctxLang] || match.route.reply.en;
      keywordContext += ctx + "\n\n";
    }

    // 如果触发 escalate，直接返回模板回复
    if (escalateReply) {
      await prisma.chatMessage.create({
        data: { sessionId: session.id, role: "bot", content: escalateReply },
      });
      return NextResponse.json({ reply: escalateReply });
    }

    // 把关键词上下文注入系统提示
    const prompt = buildPrompt(history, lang, {
      country: session.country,
      vehicleReq: session.vehicleReq,
      budget: session.budget,
      quantity: session.quantity,
    }) + (keywordContext ? "\n\n" + keywordContext : "");

    // 调用本地千问
    let reply = "";
    try {
      const res = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "qwen3-vl:30b-a3b-instruct-q4_K_M",
          prompt: prompt,
          stream: false,
          options: { num_predict: 300, temperature: 0.7 },
        }),
      });
      const data = await res.json();
      reply = (data.response || "").trim();
    } catch (e) {
      reply = CHAT_TEMPLATES.notAvailable.en;
    }

    if (!reply) {
      reply = CHAT_TEMPLATES.emptyReply.en;
    }

    // 保存 AI 回复
    await prisma.chatMessage.create({
      data: { sessionId: session.id, role: "bot", content: reply },
    });

    // 更新 intent level（只升不降）+ 提取客户字段
    const intentResult = detectIntent([...session.ChatMessage.map(m => ({ role: m.role, content: m.content })), { role: "user", content: message }, { role: "bot", content: reply }]);
    const newLevel = intentResult.level;

    // 提取客户字段（从完整对话文本中提取，含 AI 回复）
    const sessionUpdate: Record<string, unknown> = {};
    if (newLevel > (session?.intentLevel ?? 0)) {
      sessionUpdate.intentLevel = newLevel;
    }
    const extractText = allText + " " + reply.toLowerCase();
    const country = extractCountry(extractText);
    if (country && !session.country) sessionUpdate.country = country;
    const vehicle = extractVehicle(extractText);
    if (vehicle && !session.vehicleReq) sessionUpdate.vehicleReq = vehicle;
    const budget = extractBudget(extractText);
    if (budget && !session.budget) sessionUpdate.budget = budget;
    const quantity = extractQuantity(extractText);
    if (quantity && !session.quantity) sessionUpdate.quantity = quantity;

    if (Object.keys(sessionUpdate).length > 0) {
      await prisma.chatSession.update({ where: { id: session.id }, data: sessionUpdate });
    }

    // 检测到客户留了联系方式，记入 lead
    const leadText = history.map(m => m.content.toLowerCase()).concat(reply.toLowerCase()).join(" ");
    const emailMatch = leadText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch && newLevel >= 3) {
      const email = emailMatch[0];
      // Try to find or create a customer lead
      const existingLead = await prisma.customerLead.findFirst({ where: { email } });
      if (!existingLead) {
        await prisma.customerLead.create({
          data: {
            email,
            source: "chat",
            intentLevel: newLevel,
            notes: `From chat session: ${sessionId}`,
          },
        });
        // 新线索 → 发邮件通知
        if (shouldNotifyLead(email)) {
          sendLeadNotification({
            email,
            intentLevel: newLevel,
            chatSummary: history.slice(-3).map(m => `${m.role === "user" ? "客户" : "客服"}: ${m.content.substring(0, 100)}`).join("\n"),
          });
        }
      } else if (newLevel > existingLead.intentLevel) {
        await prisma.customerLead.update({ where: { id: existingLead.id }, data: { intentLevel: newLevel } });
      }
    }

    return NextResponse.json({ reply, intentLevel: newLevel, intentLabel: intentResult.label });
  } catch (e) {
    console.error("Chat API error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
