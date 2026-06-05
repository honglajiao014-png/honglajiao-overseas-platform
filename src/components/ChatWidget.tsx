"use client";

import { useState, useRef, useEffect } from "react";
import { useT } from "@/i18n/useT";
import { T } from "@/i18n/translations";
import { SITE } from "@/data/site";

interface Message { role: "user" | "bot" | "system"; content: string }

export function ChatWidget() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"chat" | "whatsapp" | "email">("chat");
  const [messages, setMessages] = useState<Message[]>([
    { role: "system", content: "👋 Welcome to Honglajiao Auto Export! I'm your 24/7 assistant. Ask me about vehicles, pricing, shipping, or anything else." }
  ]);
  const [input, setInput] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [sessionId] = useState(`sid-${Date.now()}`);
  const bottomRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

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
      setMessages(m => [...m, { role: "bot", content: data.reply || "I'll get back to you soon!" }]);
    } catch {
      setMessages(m => [...m, { role: "bot", content: "I'll get back to you soon! For urgent matters, please use WhatsApp." }]);
    }
    setWaiting(false);
  };

  const whatsappMsg = encodeURIComponent(t(T.whatsapp.default));
  const whatsappUrl = `https://wa.me/${SITE.whatsapp}?text=${whatsappMsg}`;

  const tabs = [
    { key: "chat" as const, icon: "💬", label: "Smart Chat", tag: "AI 24/7", desc: "Instant auto-reply, human during business hours" },
    { key: "whatsapp" as const, icon: "📱", label: "WhatsApp", tag: "Fastest", desc: "Direct message, instant reply" },
    { key: "email" as const, icon: "📧", label: "Email", tag: "Inquiry", desc: "Detailed inquiry, attachments welcome" },
  ];

  return (
    <>
      {open && <div className="fixed inset-0 z-50 bg-black/40 md:hidden" onClick={() => setOpen(false)} />}

      <div
        ref={panelRef}
        className={`fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] max-w-[380px] bg-white rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden transition-all duration-300 ${
          open ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" : "opacity-0 translate-y-4 scale-95 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-brand to-brand-dark px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold text-sm">Customer Service</h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-blue-200 text-xs">24/7 Smart Assistant</span>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-50 border-b border-border">
          {tabs.map((tb) => (
            <button
              key={tb.key}
              onClick={() => setTab(tb.key)}
              className={`flex-1 py-3 text-xs font-semibold transition-all text-center ${
                tab === tb.key ? "text-brand bg-white border-b-2 border-brand shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tb.icon} {tb.label}
            </button>
          ))}
        </div>

        {/* Smart Chat */}
        {tab === "chat" && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px] max-h-[55vh] bg-gray-50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-brand text-white rounded-br-md"
                      : msg.role === "system"
                        ? "bg-brand-light text-dark border border-brand/20 rounded-bl-md"
                        : "bg-white text-dark border border-gray-200 rounded-bl-md shadow-sm"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {waiting && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md shadow-sm px-4 py-3">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:"0ms"}} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:"150ms"}} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:"300ms"}} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
            <div className="p-3 border-t border-border bg-white">
              <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
                />
                <button type="submit" disabled={!input.trim() || waiting} className="bg-brand text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-brand-dark transition-all disabled:opacity-50 shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
              <p className="text-xs text-gray-400 text-center mt-2">Press Enter to send · Typically replies instantly</p>
            </div>
          </>
        )}

        {/* WhatsApp */}
        {tab === "whatsapp" && (
          <div className="p-5 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
              </svg>
            </div>
            <p className="text-dark font-bold text-sm mb-1">Chat on WhatsApp</p>
            <p className="text-gray-500 text-xs mb-5">Instant messaging — fastest response</p>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-bold text-sm hover:bg-green-600 transition-all">
              Open WhatsApp
            </a>
          </div>
        )}

        {/* Email */}
        {tab === "email" && (
          <div className="p-5 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brand-light flex items-center justify-center">
              <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-dark font-bold text-sm mb-1">Send us an Email</p>
            <p className="text-gray-500 text-xs mb-5">We reply within 24 hours</p>
            <a href="mailto:info@honglajiao1688.com" className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-xl font-bold text-sm hover:bg-brand-dark transition-all">
              info@honglajiao1688.com
            </a>
          </div>
        )}

        <div className="px-5 py-3 bg-gray-50 border-t border-border text-center text-xs text-gray-400">
          ⚡ {tabs.find(tb => tb.key === tab)?.tag} · {tabs.find(tb => tb.key === tab)?.desc}
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`group fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl shadow-lg transition-all flex items-center justify-center ${
          open ? "bg-gray-700 text-white rotate-45 hover:bg-gray-600" : "bg-brand text-white hover:bg-brand-dark hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/30"
        }`}
        aria-label={open ? "Close chat" : "Open chat"}
      >
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
