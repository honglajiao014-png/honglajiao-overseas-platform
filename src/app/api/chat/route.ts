import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 自动回复规则库
const AUTO_REPLIES: { keywords: string[]; reply: string }[] = [
  {
    keywords: ["price", "how much", "cost", "价格", "多少钱"],
    reply: "Our vehicle prices are competitive and include verified sourcing, inspection, and logistics consultation. Please tell me which vehicle you're interested in, and I'll send you a detailed quotation within 2 hours. You can also browse our inventory at /cars."
  },
  {
    keywords: ["ship", "delivery", "transport", "shipping", "运输", "物流", "运到"],
    reply: "We coordinate shipping to major ports worldwide, including Africa (Lagos, Mombasa, Dar es Salaam, Accra), Middle East (Jebel Ali, Dammam), and more. Shipping cost depends on the vehicle and destination. Share your target country and I'll provide an estimate."
  },
  {
    keywords: ["inspection", "check", "quality", "condition", "检验", "检测", "质量"],
    reply: "Every vehicle undergoes a 200+ point inspection before listing. We provide real photos, video walkthroughs, and inspection reports. You can also request a third-party inspection (SGS, Bureau Veritas) at your cost."
  },
  {
    keywords: ["register", "account", "sign up", "注册", "开户"],
    reply: "Welcome! You can register as a dealer at /register to access wholesale pricing, manage your orders, and get priority support. It's free to join."
  },
  {
    keywords: ["warranty", "guarantee", "guarantee", "保障", "保修"],
    reply: "We offer supplier verification and trade assurance. While we don't provide direct warranty, we vet all suppliers thoroughly and mediate any disputes. We recommend independent inspection before purchase."
  },
  {
    keywords: ["payment", "pay", "deposit", "付款", "支付"],
    reply: "We support T/T (wire transfer), L/C (Letter of Credit), and secure escrow. Standard terms are 30% deposit to start sourcing, 70% before shipping. All payments are made directly to verified suppliers."
  },
  {
    keywords: ["hello", "hi", "hey", "你好", "您好", "在吗"],
    reply: "Hello! 👋 Welcome to Honglajiao Auto Export. How can I help you today? I can assist with vehicle sourcing, pricing, shipping, or any questions about our services. Feel free to ask!"
  },
  {
    keywords: ["thank", "谢谢", "thanks", "appreciate"],
    reply: "You're welcome! 😊 If you need anything else, just ask. You can also reach us on WhatsApp for instant support. Have a great day!"
  },
  {
    keywords: ["ev", "electric", "电动车", "新能源", "byd", "tesla"],
    reply: "Great choice! We source popular EVs including BYD, Tesla, NIO, XPeng, and more. Chinese EVs offer excellent value. Check our /cars page for current EV inventory or tell me your budget and I'll find the best options."
  },
];

const FALLBACK_REPLIES = [
  "Thank you for your message! Our team will review this and get back to you within 2 hours. For urgent inquiries, please contact us on WhatsApp.\n\nIs there anything else I can help with?",
  "I've noted your inquiry. A sourcing specialist will follow up shortly with detailed information. In the meantime, feel free to browse our vehicle inventory.\n\nWhat else would you like to know?",
  "Great question! Let me connect you with our team for a detailed response. You can also reach us directly via WhatsApp for faster communication.\n\nCan I help with anything else?",
];

function getAutoReply(message: string): string {
  const lowerMsg = message.toLowerCase();
  for (const rule of AUTO_REPLIES) {
    if (rule.keywords.some(kw => lowerMsg.includes(kw.toLowerCase()))) {
      return rule.reply;
    }
  }
  return FALLBACK_REPLIES[Math.floor(Math.random() * FALLBACK_REPLIES.length)];
}

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId } = await req.json();
    if (!message) return NextResponse.json({ error: "Message required" }, { status: 400 });
    const sid = sessionId || `session-${Date.now()}`;

    // Save user message
    await prisma.chatMessage.create({
      data: { sessionId: sid, role: "user", content: message },
    });

    // Generate auto-reply
    const reply = getAutoReply(message);

    // Simulate typing delay (500-1500ms)
    await new Promise(r => setTimeout(r, Math.random() * 1000 + 500));

    // Save bot reply
    await prisma.chatMessage.create({
      data: { sessionId: sid, role: "bot", content: reply },
    });

    return NextResponse.json({ reply, sessionId: sid });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
