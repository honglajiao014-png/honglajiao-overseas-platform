"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { useT, T } from "@/i18n/useT";
import { COUNTRIES } from "@/data/countries";

export default function RegisterPage() {
  const t = useT();
  const [form, setForm] = useState({ email: "", password: "", name: "", phone: "", company: "", country: "", avatar: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  const register = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    // 验证电话号码
    const phone = form.phone?.trim();
    if (!phone) { setError("Phone number is required"); setStatus("error"); return; }
    if (phone.length < 7 || phone.length > 20) { setError("Invalid phone number — must be 7–20 digits"); setStatus("error"); return; }
    if (!/^\+?[0-9]+$/.test(phone)) { setError("Phone number can only contain digits and optional + prefix"); setStatus("error"); return; }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, phone, avatar: avatarPreview || undefined }),
    });
    const data = await res.json();
    if (data.error) { setError(data.error); setStatus("error"); }
    else { setStatus("success"); }
  };

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-md mx-auto px-6">
          {status === "success" ? (
            <div className="bg-white rounded-2xl border border-border p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-dark">{t(T.registerPage.success)}</h2>
              <p className="text-gray-500 text-sm mt-2">{t(T.registerPage.successDesc)}</p>
              <Link href="/login" className="mt-6 inline-block bg-brand text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-brand-dark transition-all">{t(T.registerPage.loginHere)}</Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-border p-8">
              <h2 className="text-2xl font-bold text-dark mb-2">{t(T.registerPage.heading)}</h2>
              <p className="text-gray-500 text-sm mb-6">{t(T.registerPage.subheading)}</p>
              {status === "error" && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}
              <form onSubmit={register} className="space-y-4">
                {/* Avatar upload — 放在最上面 */}
                <div className="flex flex-col items-center gap-3 pb-4 border-b border-gray-100 mb-2">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 border-2 border-gray-200">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <label className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-200 transition-all">
                      {avatarPreview ? t(T.registerPage.changeAvatar) : t(T.registerPage.uploadAvatar)}
                      <input type="file" accept="image/*" onChange={handleAvatarFile} className="hidden" />
                    </label>
                    {avatarPreview && (
                      <button type="button" onClick={() => {}} className="px-4 py-2 bg-brand text-white rounded-lg text-sm font-bold hover:bg-brand-dark transition-all">
                        {t(T.accountPage.save)}
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">{t(T.accountPage.imageHint)}</p>
                </div>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder={t(T.registerPage.name) + " *"} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" required />
                <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} type="email" placeholder={t(T.registerPage.email) + " *"} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" required />
                <input value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} type="password" placeholder={t(T.registerPage.password) + " *"} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" required />
                <input value={form.phone || ""} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder={t(T.registerPage.phone)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" />
                <input value={form.company || ""} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder={t(T.registerPage.company)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" />

                <select value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 cursor-pointer">
                  <option value="">{t(T.registerPage.country)}</option>
                  {COUNTRIES.map(c => (
                    <option key={c.value} value={c.value}>{t(c.label)}</option>
                  ))}
                </select>

                <button type="submit" disabled={status === "loading"} className="w-full bg-brand text-white py-3 rounded-xl font-bold text-sm hover:bg-brand-dark transition-all disabled:opacity-50">
                  {status === "loading" ? "..." : t(T.registerPage.registerBtn)}
                </button>

                <p className="text-xs text-gray-500 text-center">{t(T.registerPage.hasAccount)} <Link href="/login" className="text-brand font-semibold">{t(T.registerPage.loginHere)}</Link></p>
              </form>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
