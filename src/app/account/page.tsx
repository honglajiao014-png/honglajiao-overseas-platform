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
  const [tab, setTab] = useState<"profile" | "avatar" | "password">("profile");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [country, setCountry] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Check URL for OAuth token
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");
    if (urlToken) {
      localStorage.setItem("hlj_token", urlToken);
      setToken(urlToken);
      // Clean URL without reload
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
        if (data.user) {
          setProfile(data.user);
          setName(data.user.name || "");
          setPhone(data.user.phone || "");
          setCompany(data.user.company || "");
          setCountry(data.user.country || "");
          setAvatarPreview(data.user.avatar || "");
        }
      })
      .catch(() => {});
  }, [token]);

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setMessage(""); setError("");
    const res = await fetch("/api/auth/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name, phone, company, country }),
    });
    const data = await res.json();
    if (data.user) { setProfile(data.user); setMessage(t(T.accountPage.saved)); }
    else setError(data.error || t(T.accountPage.updateError));
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (newPassword !== confirmPassword) { setError(t(T.accountPage.passwordsNoMatch)); return; }
    setMessage(""); setError("");
    const res = await fetch("/api/auth/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    if (data.success) { setMessage(t(T.accountPage.passwordChanged)); setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); }
    else setError(data.error || t(T.accountPage.passwordError));
  };

  const uploadAvatar = async () => {
    if (!token || !avatarFile) return;
    setMessage(""); setError("");
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ avatar: base64 }),
      });
      const data = await res.json();
      if (data.user) { setProfile(data.user); setAvatarPreview(data.user.avatar || ""); setMessage(t(T.accountPage.avatarUpdated)); }
      else setError(data.error || t(T.accountPage.updateError));
    };
    reader.readAsDataURL(avatarFile);
  };

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

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
        <div className="flex gap-8 flex-col lg:flex-row">
          {/* Sidebar */}
          <div className="w-full lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 mb-3">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl text-gray-400">
                      {profile?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-gray-900">{profile?.name || profile?.email}</h3>
                <p className="text-xs text-gray-500">{profile?.email}</p>
              </div>

              <nav className="space-y-1">
                {[
                  { key: "profile" as const, label: t(T.accountPage.profile), icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
                  { key: "avatar" as const, label: t(T.accountPage.avatar), icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
                  { key: "password" as const, label: t(T.accountPage.password), icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
                ].map(item => (
                  <button
                    key={item.key}
                    onClick={() => setTab(item.key)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      tab === item.key ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                    </svg>
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="border-t border-gray-100 mt-6 pt-4 space-y-2">
                <button onClick={() => { localStorage.removeItem("hlj_token"); setToken(null); }} className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-all flex items-center gap-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {t(T.accountPage.switchAccount)}
                </button>
                <button onClick={logout} className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all flex items-center gap-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  {t(T.accountPage.logout)}
                </button>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              {message && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium">{message}</div>}
              {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm font-medium">{error}</div>}

              {tab === "profile" && (
                <form onSubmit={updateProfile} className="max-w-lg space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">{t(T.accountPage.profileSettings)}</h2>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{t(T.accountPage.name)}</label>
                    <input value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{t(T.accountPage.email)}</label>
                    <input value={profile?.email || ""} disabled className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-gray-50 text-gray-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{t(T.accountPage.phone)}</label>
                    <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{t(T.accountPage.company)}</label>
                    <input value={company} onChange={e => setCompany(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{t(T.accountPage.country)}</label>
                    <input value={country} onChange={e => setCountry(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm" />
                  </div>
                  <button type="submit" className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-primary-dark transition-all">{t(T.accountPage.save)}</button>
                </form>
              )}

              {tab === "avatar" && (
                <div className="max-w-lg">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">{t(T.accountPage.avatarSettings)}</h2>
                  <div className="flex items-start gap-6 flex-col sm:flex-row">
                    <div className="w-32 h-32 rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200 shrink-0">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="avatar preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl text-gray-400">
                          {profile?.name?.[0]?.toUpperCase() || "U"}
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <label className="block">
                        <span className="inline-block px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 cursor-pointer transition-all">
                          {t(T.accountPage.chooseImage)}
                        </span>
                        <input type="file" accept="image/*" onChange={handleAvatarFile} className="hidden" />
                      </label>
                      <p className="text-xs text-gray-400">{t(T.accountPage.imageHint)}</p>
                      {avatarFile && (
                        <button onClick={uploadAvatar} className="block bg-primary text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-primary-dark transition-all">
                          {t(T.accountPage.upload)}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {tab === "password" && (
                <form onSubmit={changePassword} className="max-w-lg space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">{t(T.accountPage.passwordSettings)}</h2>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{t(T.accountPage.currentPassword)}</label>
                    <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{t(T.accountPage.newPassword)}</label>
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm" required minLength={6} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{t(T.accountPage.confirmPassword)}</label>
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm" required minLength={6} />
                  </div>
                  <button type="submit" className="bg-accent text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-accent-dark transition-all">{t(T.accountPage.changePassword)}</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
