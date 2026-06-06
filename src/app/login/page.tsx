"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { useT, T } from "@/i18n/useT";

export default function LoginPage() {
  const t = useT();
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <main className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <section className="flex-1 flex items-center justify-center">
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center max-w-sm w-full mx-4 shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{t(T.loginPage.submitted)}</h2>
            <p className="text-gray-500 text-sm">{t(T.loginPage.submittedDesc)}</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <section className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-sm w-full shadow-sm">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-900">{t(T.loginPage.heading)}</h1>
            <p className="text-gray-500 text-sm mt-1">{t(T.loginPage.subheading)}</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">{t(T.loginPage.email)}</label>
              <input type="email" placeholder="your@email.com" className="w-full border border-gray-200 bg-white rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">{t(T.loginPage.password)}</label>
              <input type="password" placeholder="••••••••" className="w-full border border-gray-200 bg-white rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20" required />
            </div>
            <button type="submit" className="w-full bg-accent text-white py-3 rounded-lg font-bold text-sm hover:bg-accent-dark transition-all shadow-md">
              {t(T.loginPage.loginBtn)}
            </button>
          </form>
          <p className="text-center text-xs text-gray-500 mt-4">
            {t(T.loginPage.noAccount)} <Link href="/contact" className="text-accent hover:text-accent-dark font-medium">{t(T.footer.contactUs)}</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
