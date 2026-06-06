"use client";

import { useState } from "react";
import { useT, T } from "@/i18n/useT";

export function Newsletter() {
  const t = useT();
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  if (subscribed) {
    return (
      <div className="mt-12 max-w-xl mx-auto text-center bg-brand-light rounded-xl p-8">
        <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-brand/20 flex items-center justify-center">
          <svg className="w-7 h-7 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-dark mb-2">{t(T.newsletter.success)}</h2>
        <p className="text-sm text-gray-500">{t(T.newsletter.successDesc)}</p>
      </div>
    );
  }

  return (
    <div className="mt-12 max-w-xl mx-auto text-center bg-brand-light rounded-xl p-8">
      <h2 className="text-lg font-bold text-dark mb-2">{t(T.newsletter.heading)}</h2>
      <p className="text-sm text-gray-500 mb-4">{t(T.newsletter.desc)}</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          placeholder={t(T.newsletter.placeholder)}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand"
        />
        <button type="submit" className="bg-brand text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-brand-dark transition-colors">
          {t(T.newsletter.subscribeBtn)}
        </button>
      </form>
    </div>
  );
}
