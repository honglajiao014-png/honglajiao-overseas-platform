"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { useT, T } from "@/i18n/useT";

interface UserProfile {
  id: string; email: string; name: string; role: string;
  phone?: string; company?: string; country?: string; avatar?: string;
}

export default function AccountPage() {
  const t = useT();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");
    if (urlToken) {
      localStorage.setItem("hlj_token", urlToken);
      setToken(urlToken);
      window.history.replaceState({}, "", window.location.pathname);
    } else {
      const saved = localStorage.getItem("hlj_token");
      if (saved) setToken(saved);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!token) return;
    fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        if (data.user) setProfile(data.user);
      })
      .catch(() => {});
  }, [token]);

  const logout = () => {
    localStorage.removeItem("hlj_token");
    router.push("/");
  };

  if (!loaded) return <main className="min-h-screen bg-gray-50"><Header /><div className="flex items-center justify-center pt-32"><p className="text-gray-400">{t(T.accountPage.loading)}</p></div></main>;

  if (!token) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <section className="flex items-center justify-center pt-32">
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center max-w-sm w-full mx-4 shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{t(T.accountPage.pleaseLogin)}</h2>
            <p className="text-gray-500 text-sm mb-6">{t(T.accountPage.pleaseLoginDesc)}</p>
            <a href="/login" className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-bold text-sm hover:bg-primary-dark transition-all">{t(T.accountPage.loginBtn)}</a>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <section className="max-w-[1400px] mx-auto px-4 pt-8 pb-16">
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            {/* 头像 — 优先显示 Google 同步头像 */}
            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 mb-4">
              {profile?.avatar ? (
                <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
                  {profile?.name?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </div>

            <h1 className="text-xl font-bold text-gray-900">{profile?.name || profile?.email}</h1>
            <p className="text-sm text-gray-500 mt-1">{profile?.email}</p>

            {profile?.role && (
              <p className="text-xs text-gray-400 mt-2">
                {profile.role === "admin" ? "管理员" : "用户"}
              </p>
            )}

            {/* 退出登录 */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <button onClick={logout} className="inline-flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-6 py-2.5 rounded-lg transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                退出登录
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
