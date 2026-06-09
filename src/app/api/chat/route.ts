import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendLeadNotification, shouldNotifyLead } from "@/lib/leadNotify";

// ======================== Prompt 模版 ========================
function getSystemPrompt(lang: string): string {
  const zh = lang === "zh";
  if (zh) {
    return `你是一个专业的 B2B 二手车出口客服助手，属于 ChinaCarExport（honglajiao1688.com）。

重要规则：
1. 语言：用中文回复，语气专业、简洁、有帮助。
2. 范围：只讨论二手车出口。绝对不能提及汽车配件、机械、摩托车或其他品类。
3. 目的：
   - 先了解客户需求（目的国、车型、预算、数量）。
   - 绝不直接报价。解释："价格取决于数量和到港港口。10辆和20辆价格不同，达累斯萨拉姆和拉各斯港运费也不同。"
   - 引导客户在网站上填写询价表单。
   - 引导客户通过以下方式联系我们：
     📧 junmu783@gmail.com
     💬 WhatsApp：+1 (310) 290-1842
     💚 WeChat：MJ9588666
4. 语气：专业、简洁、有帮助。不要着急，不要过度推销。

当前对话：`;
  }
  return `You are a professional B2B auto export agent for ChinaCarExport (honglajiao1688.com).

IMPORTANT RULES:
1. Language: Always reply in ENGLISH.
2. Scope: ONLY talk about USED CAR EXPORT. NEVER mention auto parts, machinery, motorcycles, or any other product categories.
3. Purpose:
   - First: Understand customer needs (destination country, vehicle type, budget, quantity).
   - NEVER give a fixed price. Explain: \"Price depends on quantity and destination port. 10 cars vs 20 cars differ. Ports like Dar es Salaam vs Lagos have different shipping costs.\"
   - Guide customers to fill the inquiry form on the website.
   - Guide customers to contact us via:
     📧 junmu783@gmail.com
     💬 WhatsApp: +1 (310) 290-1842
     💚 WeChat: MJ9588666
4. Tone: Professional, concise, helpful. Don't rush. Don't oversell.

Current conversation:`;
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
      reply = "Sorry, our AI assistant is temporarily unavailable. Please contact us directly:\n📧 junmu783@gmail.com\n💬 WhatsApp: +1 (310) 290-1842";
    }

    if (!reply) {
      reply = "Thank you for your message. For a faster response, please contact us:\n📧 junmu783@gmail.com\n💬 WhatsApp: +1 (310) 290-1842";
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
