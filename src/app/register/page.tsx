"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { useT, T } from "@/i18n/useT";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function RegisterForm() {
  const t = useT();
  const sp = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    const e = sp.get("error");
    if (e) {
      const map: Record<string, string> = {
        google_not_configured: "Google 注册暂未配置，请使用邮箱密码注册",
        token_exchange_failed: "Google 注册失败（令牌交换异常），请重试",
        userinfo_failed: "Google 注册失败（获取账户信息异常），请重试",
        no_email: "Google 账户未绑定邮箱，请使用邮箱密码注册",
        no_code: "Google 注册参数缺失，请重试",
      };
      setError(map[e] || e);
    }
  }, [sp]);

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <section className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center max-w-sm w-full shadow-sm">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900 mb-2">{t(T.registerPage.heading)}</h1>
            <p className="text-gray-500 text-sm">{t(T.registerPage.subheading)}</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
          )}

          <a
            href="/api/auth/oauth/google/start?next=/account"
            className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all mb-6"
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>{t(T.registerPage.googleBtn)}</span>
          </a>

          <p className="text-sm text-gray-500">
            {t(T.registerPage.hasAccount)} <Link href="/login" className="text-accent font-semibold hover:underline">{t(T.registerPage.loginHere)}</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
