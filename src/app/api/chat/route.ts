import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendLeadNotification, shouldNotifyLead } from "@/lib/leadNotify";
import { CHAT_TEMPLATES } from "@/data/chat-templates";

// ======================== Prompt 模版 ========================
function getSystemPrompt(lang: string): string {
  // 语言映射：zh → en（中文用户也用英文模板），fr/ar 用对应模板，其余默认 en
  const templateLang = (lang === "fr" || lang === "ar") ? lang : "en";
  return CHAT_TEMPLATES.systemRole[templateLang as "en" | "fr" | "ar"] + "\n\nCurrent conversation:";
}

function buildPrompt(history: { role: string; content: string }[], lang: string): string {
  const system = getSystemPrompt(lang);
  const messages = [{ role: "system", content: system }];
  for (const m of history.slice(-10)) {
    if (m.role === "system") continue;
    messages.push({ role: m.role === "user" ? "user" : "assistant", content: m.content });
  }
  return messages.map(m => `${m.role === "user" ? "User" : m.role === "assistant" ? "Assistant" : "System"}: ${m.content}`).join("\n\n");
}

// ======================== 意向等级判断 ========================
const INTENT_KEYWORDS: [number, string[]][] = [
  [1, ["country", "destination", "ship to", "africa", "middle east", "nigeria", "kenya", "ghana", "tanzania", "ethiopia", "market"]],
  [2, ["toyota", "bmw", "mercedes", "audi", "byd", "honda", "nissan", "volkswagen", "lexus", "land rover", "porsche",
       "model", "budget", "price", "cost", "dollar", "usd", "quantity", "container", "port", "shipping cost",
       "20", "30", "40", "50", "how many"]],
  [3, ["email", "@", "whatsapp", "phone", "call", "contact", "add", "form", "inquiry"]],
  [4, ["order", "deposit", "l/c", "letter of credit", "contract", "invoice", "booking", "purchase order"]],
];

function detectIntent(history: { role: string; content: string }[]): number {
  const texts = history.map(m => m.content.toLowerCase()).join(" ");
  let maxLevel = 0;
  for (const [level, keywords] of INTENT_KEYWORDS) {
    if (keywords.some(kw => texts.includes(kw))) {
      if (maxLevel < level) maxLevel = level; // only upgrade
    }
  }
  return maxLevel;
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
    const prompt = buildPrompt(history, lang);

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

    // 更新 intent level（只升不降）
    const newLevel = detectIntent([...session.ChatMessage.map(m => ({ role: m.role, content: m.content })), { role: "user", content: message }, { role: "bot", content: reply }]);
    if (newLevel > (session?.intentLevel ?? 0)) {
      await prisma.chatSession.update({ where: { id: session.id }, data: { intentLevel: newLevel } });
    }

    // 检测到客户留了联系方式，记入 lead
    const allText = history.map(m => m.content.toLowerCase()).concat(reply.toLowerCase()).join(" ");
    const emailMatch = allText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
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

    return NextResponse.json({ reply });
  } catch (e) {
    console.error("Chat API error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
