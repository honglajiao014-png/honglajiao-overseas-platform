import { NextRequest, NextResponse } from "next/server";

const AUTO_REPLIES: { keywords: string[]; reply: string }[] = [
  { keywords: ["price", "how much", "cost"], reply: "Our vehicle prices are competitive. Please tell me which vehicle you are interested in, and I will send you a detailed quotation within 2 hours." },
  { keywords: ["ship", "delivery", "transport", "shipping"], reply: "We coordinate shipping to major ports worldwide including Africa (Lagos, Mombasa, Dar es Salaam, Accra) and Middle East. Shipping cost depends on vehicle and destination." },
  { keywords: ["inspection", "check", "quality"], reply: "Every vehicle undergoes a 200+ point inspection before listing. We provide real photos, video walkthroughs, and inspection reports." },
  { keywords: ["register", "account", "sign up"], reply: "Welcome! You can register as a dealer at /register to access wholesale pricing. It is free to join." },
  { keywords: ["payment", "pay", "deposit"], reply: "We support T/T (wire transfer), L/C (Letter of Credit), and secure escrow. Standard terms: 30% deposit to start, 70% before shipping." },
  { keywords: ["hello", "hi", "hey"], reply: "Hello! Welcome to ChinaCarExport. How can I help you today? I assist with vehicle sourcing, pricing, shipping, and more." },
  { keywords: ["africa", "nigeria", "kenya", "ghana", "tanzania", "ethiopia"], reply: "Africa is our key market! We ship to Lagos, Mombasa, Dar es Salaam, Accra. Our team knows African import regulations and local preferences well." },
  { keywords: ["ev", "electric", "byd", "tesla"], reply: "Great choice! We source EVs including BYD, Tesla, NIO, XPeng. Chinese EVs offer excellent value for African and Middle Eastern markets." },
];

const FALLBACKS = [
  "Thank you! Our team will get back to you within 2 hours. For urgent matters, please use WhatsApp.",
  "Noted. A sourcing specialist will follow up shortly. Browse our inventory at /cars in the meantime.",
  "Great question! Let me connect you with our team. You can also reach us via WhatsApp for faster communication.",
];

function getReply(msg: string): string {
  const lower = msg.toLowerCase();
  for (const rule of AUTO_REPLIES) {
    if (rule.keywords.some(kw => lower.includes(kw.toLowerCase()))) return rule.reply;
  }
  return FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
}

export async function POST(req: NextRequest) {
  const { message } = await req.json();
  if (!message) return NextResponse.json({ error: "Message required" }, { status: 400 });
  await new Promise(r => setTimeout(r, Math.random() * 800 + 400));
  return NextResponse.json({ reply: getReply(message) });
}
