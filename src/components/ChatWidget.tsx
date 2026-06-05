"use client";

import { useState, useRef, useEffect } from "react";
import { useT } from "@/i18n/useT";
import { T } from "@/i18n/translations";
import { SITE } from "@/data/site";

export function ChatWidget() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"chat" | "whatsapp" | "email">("chat");
  const [form, setForm] = useState({ name: "", contact: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [unread, setUnread] = useState(true);
  const panelRef = useRef<HTMLDivElement>(null);

  // Auto-open timer: show greeting after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => { setUnread(false); }, 8000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [open]);

  const whatsappMsg = encodeURIComponent(t(T.whatsapp.default));
  const whatsappUrl = `https://wa.me/${SITE.whatsapp}?text=${whatsappMsg}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.contact.trim() || !form.message.trim()) return;
    setSending(true);
    try {
      await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type: "chat", lang: document.documentElement.lang || "en" }),
      });
      setSent(true);
    } catch { setSent(true); }
    setSending(false);
  };

  const tabs = [
    { key: "chat" as const, icon: "💬", label: "Live Chat", tag: "AI + Human", desc: "Auto-response 24/7, agent during business hours" },
    { key: "whatsapp" as const, icon: "📱", label: "WhatsApp", tag: "Fastest", desc: "Direct message, instant reply" },
    { key: "email" as const, icon: "📧", label: "Email", tag: "Inquiry", desc: "Detailed inquiry, attachments welcome" },
  ];

  return (
    <>
      {open && <div className="fixed inset-0 z-50 bg-black/40 md:hidden" onClick={() => setOpen(false)} />}

      {/* Chat Panel */}
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
                <span className="text-blue-200 text-xs">24/7 Online</span>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-gray-50 border-b border-border">
          {tabs.map((tb) => (
            <button
              key={tb.key}
              onClick={() => { setTab(tb.key); setSent(false); }}
              className={`flex-1 py-3 text-xs font-semibold transition-all text-center ${
                tab === tb.key
                  ? "text-brand bg-white border-b-2 border-brand shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tb.icon} {tb.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-5 max-h-[55vh] overflow-y-auto">
          {tab === "chat" && (
            sent ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-dark font-bold text-sm">{t(T.inquiry.success)}</p>
                <p className="text-gray-500 text-xs mt-2">{t(T.inquiry.successDesc)}</p>
                <p className="text-gray-400 text-xs mt-3">We typically respond within 2 hours</p>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", contact: "", message: "" }); }}
                  className="mt-4 text-xs text-brand font-semibold hover:text-brand-dark"
                >
                  {t(T.inquiry.another)}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Your Name *</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-dark placeholder-gray-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email / WhatsApp *</label>
                  <input
                    type="text"
                    placeholder="you@example.com"
                    value={form.contact}
                    onChange={e => setForm(f => ({ ...f, contact: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-dark placeholder-gray-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Message *</label>
                  <textarea
                    rows={3}
                    placeholder={t(T.inquiry.additionalPlaceholder)}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-dark placeholder-gray-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all resize-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-brand text-white py-3 rounded-xl font-bold text-sm hover:bg-brand-dark transition-all disabled:opacity-50 shadow-sm shadow-brand/20 hover:shadow-md hover:shadow-brand/30"
                >
                  {sending ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </span>
                  ) : t(T.misc.submit)}
                </button>
              </form>
            )
          )}

          {tab === "whatsapp" && (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
                </svg>
              </div>
              <p className="text-dark font-bold text-sm mb-1">Chat on WhatsApp</p>
              <p className="text-gray-500 text-xs mb-5">Instant messaging — fastest response, 24/7</p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-bold text-sm hover:bg-green-600 transition-all shadow-sm shadow-green-500/20 hover:shadow-md hover:shadow-green-500/30"
              >
                Open WhatsApp
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4m-5-5l5 5m0 0l-5-5" />
                </svg>
              </a>
            </div>
          )}

          {tab === "email" && (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brand-light flex items-center justify-center">
                <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-dark font-bold text-sm mb-1">Send us an Email</p>
              <p className="text-gray-500 text-xs mb-5">We reply within 24 hours</p>
              <a
                href="mailto:info@honglajiao1688.com"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-xl font-bold text-sm hover:bg-brand-dark transition-all"
              >
                info@honglajiao1688.com
              </a>
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-5 py-3 bg-gray-50 border-t border-border text-center text-xs text-gray-400">
          ⚡ {tabs.find(tb => tb.key === tab)?.tag} · {tabs.find(tb => tb.key === tab)?.desc}
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => { setOpen(o => !o); setUnread(false); }}
        className={`group fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl shadow-lg transition-all flex items-center justify-center ${
          open
            ? "bg-gray-700 text-white rotate-45 hover:bg-gray-600"
            : "bg-brand text-white hover:bg-brand-dark hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/30"
        }`}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        ) : (
          <>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            {/* Notification dot */}
            {unread && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                <span className="sr-only">Online</span>
              </span>
            )}
          </>
        )}
      </button>
    </>
  );
}
