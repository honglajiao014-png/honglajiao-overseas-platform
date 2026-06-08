"use client";

import { useState, useRef, useEffect } from "react";
import { useLang } from "@/i18n/LangContext";

interface Message { role: "user" | "bot" | "system"; content: string }

export function ChatWidget() {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"chat" | "whatsapp" | "wechat" | "email">("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [sessionId] = useState(`sid-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  const bottomRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  // 初始化
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    setMessages([{
      role: "system",
      content: lang === "zh"
        ? "您好！欢迎来到 ChinaCarExport 🚗\n\n我们是一家专业的中国二手车出口平台。\n请问您需要发往哪个国家？寻找什么车型？"
        : "Hello! Welcome to ChinaCarExport 🚗\n\nWe are a professional China-based used car export platform.\nMay I know which country you are shipping to and what vehicles you are looking for?",
    }]);
  }, [lang]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [open]);

  const sendMessage = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setMessages(m => [...m, { role: "user" as const, content: msg }]);
    setInput("");
    setWaiting(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, sessionId, lang }),
      });
      const data = await res.json();
      setMessages(m => [...m, { role: "bot" as const, content: data.reply || "Thank you! Please contact us directly:\n📧 junmu783@gmail.com\n💬 WhatsApp: +1 (310) 290-1842" }]);
    } catch {
      setMessages(m => [...m, { role: "bot" as const, content: "Our AI assistant is offline. Please contact us directly:\n📧 junmu783@gmail.com\n💬 WhatsApp: +1 (310) 290-1842" }]);
    }
    setWaiting(false);
  };

  return (
    <>
      {open && <div className="fixed inset-0 z-50 bg-black/50 md:hidden backdrop-blur-sm" onClick={() => setOpen(false)} />}

      <div className={`fixed bottom-24 right-6 z-50 w-[calc(100vw-2rem)] max-w-[400px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden transition-all duration-300 ${
        open ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" : "opacity-0 translate-y-4 scale-95 pointer-events-none"
      }`}>

        {/* Header */}
        <div className="bg-[#1a1a1a] px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">🚗</div>
              <div>
                <h3 className="text-white font-bold text-sm">ChinaCarExport</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                  <span className="text-green-100 text-[11px]">Online</span>
                </div>
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
        <div className="flex bg-gray-50 border-b border-gray-100">
          {[
            { key: "chat" as const, icon: "💬", label: "Chat" },
            { key: "whatsapp" as const, icon: "📱", label: "WhatsApp" },
            { key: "wechat" as const, icon: "💚", label: "WeChat" },
            { key: "email" as const, icon: "📧", label: "Email" },
          ].map((tb) => (
            <button key={tb.key} onClick={() => setTab(tb.key)}
              className={`flex-1 py-3 text-xs font-bold transition-all ${
                tab === tb.key
                  ? "text-[#1a1a1a] bg-white border-b-2 border-[#1a1a1a]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <span className="mr-1">{tb.icon}</span>
              {tb.label}
            </button>
          ))}
        </div>

        {/* Chat Tab */}
        {tab === "chat" && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[320px] max-h-[55vh] bg-gradient-to-b from-gray-50 to-white">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-[#1a1a1a] text-white rounded-br-lg"
                      : msg.role === "system"
                        ? "bg-blue-50 text-gray-800 border border-blue-100 rounded-bl-lg"
                        : "bg-white text-gray-700 border border-gray-200 rounded-bl-lg shadow-sm"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {waiting && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-lg px-4 py-3 shadow-sm">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="p-3 border-t border-gray-100 bg-white flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a1a1a] focus:ring-2 focus:ring-gray-200 transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || waiting}
                className="bg-[#1a1a1a] text-white w-11 h-11 rounded-xl flex items-center justify-center hover:bg-gray-800 disabled:opacity-40 shrink-0 transition-all active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </>
        )}

        {/* WhatsApp Tab */}
        {tab === "whatsapp" && (
          <div className="p-8 text-center flex-1 flex flex-col items-center justify-center">
            <div className="w-20 h-20 mb-5 rounded-2xl bg-green-50 flex items-center justify-center">
              <svg className="w-10 h-10 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
              </svg>
            </div>
            <h4 className="text-gray-900 font-bold mb-1">WhatsApp</h4>
            <p className="text-gray-500 text-sm mb-4">Please add our WhatsApp number manually</p>
            <div className="flex items-center gap-3 px-6 py-3.5 bg-gray-50 border border-gray-200 rounded-xl">
              <span className="text-green-600 font-bold text-lg select-all">+1 (310) 290-1842</span>
              <button onClick={() => { navigator.clipboard.writeText("+1 (310) 290-1842"); alert("Copied!"); }} className="shrink-0 px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 transition-all active:scale-95">
                Copy
              </button>
            </div>
            <p className="text-gray-400 text-xs mt-4">Search this number in WhatsApp to contact us</p>
          </div>
        )}

        {/* WeChat Tab */}
        {tab === "wechat" && (
          <div className="p-8 text-center flex-1 flex flex-col items-center justify-center">
            <div className="w-20 h-20 mb-5 rounded-2xl bg-green-50 flex items-center justify-center">
              <svg className="w-10 h-10 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-2.1 6.083-2.114-.525-3.19-4.032-5.66-8.416-5.66zM5.309 5.99c.642 0 1.162.525 1.162 1.17a1.16 1.16 0 01-1.162 1.168A1.16 1.16 0 014.147 7.16c0-.645.52-1.17 1.162-1.17zm5.387 0c.642 0 1.162.525 1.162 1.17a1.16 1.16 0 01-1.162 1.168 1.16 1.16 0 01-1.162-1.168c0-.645.52-1.17 1.162-1.17zM15.309 9.91c-2.006 0-3.904.628-5.406 1.754-1.729 1.293-2.745 3.22-2.745 5.322 0 2.24 1.224 4.251 3.226 5.506.246.154.41.463.296.768l-.26.987c-.014.05-.032.098-.032.148 0 .112.087.203.194.203a.24.24 0 00.124-.04l1.475-.865a.711.711 0 01.547-.055 8.609 8.609 0 002.78.47c2.447 0 4.675-.91 6.248-2.39 1.392-1.31 2.182-2.99 2.182-4.8 0-1.82-.794-3.506-2.195-4.818-1.575-1.476-3.79-2.38-6.224-2.38h-.03zm-2.955 2.224c.493 0 .893.404.893.902a.897.897 0 01-.893.902.897.897 0 01-.893-.902c0-.498.4-.902.893-.902zm5.91 0c.493 0 .893.404.893.902a.897.897 0 01-.893.902.897.897 0 01-.893-.902c0-.498.4-.902.893-.902zm-2.99 2.278c1.242.149 2.47.585 3.445 1.279.959.68 1.831 1.653 1.831 2.764 0 .779-.472 1.552-1.177 2.12-.528.425-1.176.724-1.905.898" />
              </svg>
            </div>
            <h4 className="text-gray-900 font-bold mb-1">WeChat</h4>
            <p className="text-gray-500 text-sm mb-4">Add our WeChat for quick communication</p>
            <div className="flex items-center gap-3 px-6 py-3.5 bg-gray-50 border border-gray-200 rounded-xl">
              <span className="text-green-600 font-bold text-lg select-all">MJ9588666</span>
              <button onClick={() => { navigator.clipboard.writeText("MJ9588666"); alert("Copied!"); }} className="shrink-0 px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 transition-all active:scale-95">
                Copy
              </button>
            </div>
            <p className="text-gray-400 text-xs mt-4">Search this ID in WeChat to add us</p>
          </div>
        )}

        {/* Email Tab */}
        {tab === "email" && (
          <div className="p-8 text-center flex-1 flex flex-col items-center justify-center">
            <div className="w-20 h-20 mb-5 rounded-2xl bg-blue-50 flex items-center justify-center">
              <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="text-gray-900 font-bold mb-1">Email</h4>
            <p className="text-gray-500 text-sm mb-6">Send us an email and we will respond within 24 hours</p>
            <a
              href="mailto:junmu783@gmail.com"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1a1a1a] text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              📧 junmu783@gmail.com
            </a>
          </div>
        )}

        {/* Footer */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-center text-[10px] text-gray-400">
          ChinaCarExport — Professional Used Car Export from China
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`group fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl shadow-xl transition-all flex items-center justify-center hover:-translate-y-1 active:scale-95 ${
          open
            ? "bg-gray-800 text-white rotate-45 shadow-2xl"
            : "bg-[#1a1a1a] text-white hover:bg-gray-800"
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
