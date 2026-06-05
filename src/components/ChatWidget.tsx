"use client";

import { useState, useRef, useEffect } from "react";

interface Message { role: "user" | "bot" | "system"; content: string }

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"chat" | "whatsapp" | "email">("chat");
  const [messages, setMessages] = useState<Message[]>([
    { role: "system", content: "👋 Welcome to ChinaCarExport! I'm your 24/7 assistant for vehicle sourcing from China to Africa and worldwide markets." }
  ]);
  const [input, setInput] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [sessionId] = useState(`sid-${Date.now()}`);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    setMessages(m => [...m, { role: "user", content: text }]);
    setInput("");
    setWaiting(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, sessionId }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages(m => [...m, { role: "bot", content: data.reply }]);
      } else {
        setMessages(m => [...m, { role: "bot", content: "Thanks for your message! Our team will get back to you shortly. For urgent inquiries, please use WhatsApp." }]);
      }
    } catch {
      setMessages(m => [...m, { role: "bot", content: "I'll connect you with our team. For urgent matters, WhatsApp is fastest." }]);
    }
    setWaiting(false);
  };

  const tabs = [
    { key: "chat" as const, icon: "💬", label: "Smart Chat", tag: "AI 24/7", desc: "Auto-reply, human during business hours" },
    { key: "whatsapp" as const, icon: "📱", label: "WhatsApp", tag: "Fastest", desc: "Direct message" },
    { key: "email" as const, icon: "📧", label: "Email", tag: "Inquiry", desc: "Detailed inquiries" },
  ];

  return (
    <>
      {open && <div className="fixed inset-0 z-50 bg-black/40 md:hidden" onClick={() => setOpen(false)} />}

      <div className={`fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] max-w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden transition-all duration-300 ${
        open ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" : "opacity-0 translate-y-4 scale-95 pointer-events-none"
      }`}>
        <div className="bg-gradient-to-r from-guazi-green to-guazi-green-dark px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold text-sm">Customer Service</h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                <span className="text-green-100 text-xs">24/7 Smart Assistant</span>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex bg-gray-50 border-b border-gray-200">
          {tabs.map((tb) => (
            <button key={tb.key} onClick={() => setTab(tb.key)}
              className={`flex-1 py-3 text-xs font-semibold transition-all text-center ${
                tab === tb.key ? "text-guazi-green bg-white border-b-2 border-guazi-green" : "text-gray-500 hover:text-gray-700"
              }`}>
              {tb.icon} {tb.label}
            </button>
          ))}
        </div>

        {tab === "chat" && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px] max-h-[55vh] bg-gray-50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${
                    msg.role === "user" ? "bg-guazi-green text-white rounded-br-md" :
                    msg.role === "system" ? "bg-guazi-green-light text-guazi-dark border border-guazi-green/20 rounded-bl-md" :
                    "bg-white text-guazi-dark border border-gray-200 rounded-bl-md shadow-sm"
                  }`}>{msg.content}</div>
                </div>
              ))}
              {waiting && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:"150ms"}} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:"300ms"}} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="p-3 border-t border-gray-200 bg-white flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask me anything..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-guazi-green" />
              <button type="submit" disabled={!input.trim() || waiting}
                className="bg-guazi-green text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-guazi-green-dark disabled:opacity-50 shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </>
        )}

        {tab === "whatsapp" && (
          <div className="p-5 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967..."/></svg>
            </div>
            <p className="text-guazi-dark font-bold text-sm">Chat on WhatsApp</p>
            <p className="text-gray-500 text-xs mb-5">Fastest response</p>
            <a href="https://wa.me/8613877284681" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-bold text-sm hover:bg-green-600 transition-all">
              Open WhatsApp
            </a>
          </div>
        )}

        {tab === "email" && (
          <div className="p-5 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-guazi-green-light flex items-center justify-center">
              <svg className="w-8 h-8 text-guazi-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-guazi-dark font-bold text-sm">Send us an Email</p>
            <p className="text-gray-500 text-xs mb-5">Reply within 24 hours</p>
            <a href="mailto:info@honglajiao1688.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-guazi-green text-white rounded-xl font-bold text-sm hover:bg-guazi-green-dark">
              info@honglajiao1688.com
            </a>
          </div>
        )}

        <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-400">
          ⚡ {tabs.find(tb => tb.key === tab)?.tag} · {tabs.find(tb => tb.key === tab)?.desc}
        </div>
      </div>

      <button onClick={() => setOpen(o => !o)}
        className={`group fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl shadow-lg transition-all flex items-center justify-center ${
          open ? "bg-gray-700 text-white rotate-45" : "bg-guazi-green text-white hover:bg-guazi-green-dark hover:-translate-y-1"
        }`}
        aria-label={open ? "Close" : "Open chat"}>
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
    </>
  );
}
