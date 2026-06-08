"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { useT, T } from "@/i18n/useT";

export default function LoginPage() {
  const t = useT();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError(t(T.loginPage.emailLabel) + " " + t(T.loginPage.passwordLabel) + " " + t(T.loginPage.loginBtn)); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      localStorage.setItem("hlj_token", data.token);
      window.location.href = "/";
    } catch {
      setError(t(T.loginPage.loginBtn) + " failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <section className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-sm w-full shadow-sm">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-900 mb-2">{t(T.loginPage.heading)}</h1>
            <p className="text-gray-500 text-sm">{t(T.loginPage.subheading)}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
          )}

          {/* Google OAuth 按钮 */}
          <a
            href="/api/auth/oauth/google/start?next=/"
            className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all mb-4"
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>{t(T.loginPage.googleBtn)}</span>
          </a>

          {/* 邮箱密码登录（小而轻的 fallback） */}
          <details className="group">
            <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 text-center list-none">
              <span className="group-open:hidden">▼ {t(T.loginPage.fallbackTitle)}</span>
              <span className="hidden group-open:inline">▲ {t(T.loginPage.fallbackTitle)}</span>
            </summary>
            <form onSubmit={handleEmailLogin} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">{t(T.loginPage.emailLabel)}</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">{t(T.loginPage.passwordLabel)}</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-accent-dark transition-all disabled:opacity-50"
              >
                {loading ? "..." : t(T.loginPage.loginBtn)}
              </button>
            </form>
          </details>

          <p className="text-center text-xs text-gray-500 mt-4">
            {t(T.loginPage.noAccount)} <Link href="/register" className="text-accent font-semibold hover:underline">{t(T.loginPage.registerHere)}</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
