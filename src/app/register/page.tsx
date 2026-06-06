"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { useT, T } from "@/i18n/useT";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const t = useT();
  const router = useRouter();
  const [step, setStep] = useState<"email" | "code" | "profile" | "done">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);

  const sendCode = async () => {
    if (!email) { setError("请输入邮箱地址"); return; }
    setLoading(true); setError("");
    const res = await fetch("/api/auth/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.error) { setError(data.error); return; }
    setStep("code");
    setError("");
    // Start 60s countdown
    setCountdown(60);
    const timer = setInterval(() => setCountdown(c => { if (c <= 0) { clearInterval(timer); return 0; } return c - 1; }), 1000);
    // Auto-fill code
    if (data.code) {
      if (!data.emailSent) {
        setError(`验证码：${data.code}（邮件暂未配置，请使用此码）`);
      }
      setCode(data.code);
    }
  };

  const verifyCode = async () => {
    if (!code || code.length < 6) { setError("请输入6位验证码"); return; }
    setStep("profile");
    setError("");
  };

  const register = async () => {
    if (!name) { setError("请输入姓名"); return; }
    if (!password || password.length < 6) { setError("密码至少6位"); return; }
    setLoading(true); setError("");
    const res = await fetch("/api/auth/verify-register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code, name, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.error) { setError(data.error); return; }
    // Store token and redirect
    localStorage.setItem("hlj_token", data.token);
    setStep("done");
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 flex items-center justify-center py-16">
        <div className="max-w-sm w-full mx-auto px-4">
          <div className="bg-white rounded-2xl border border-border p-8">
            <h1 className="text-2xl font-bold text-dark text-center mb-1">创建账号</h1>
            <p className="text-gray-500 text-sm text-center mb-6">
              已有账号？<Link href="/login" className="text-brand font-semibold hover:underline">登录</Link>
            </p>

            {step === "done" ? (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-dark">注册成功！</h2>
                <p className="text-gray-500 text-sm mt-2">欢迎加入红辣椒汽车出口</p>
                <a href="/account" className="mt-6 block w-full bg-brand text-white py-3 rounded-xl font-bold text-sm hover:bg-brand-dark transition-all text-center">
                  进入账号
                </a>
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
                )}

                {/* Divider */}
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400">邮箱注册</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {step === "email" && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">电子邮箱 *</label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="请输入邮箱地址"
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                      />
                    </div>
                    <button
                      onClick={sendCode}
                      disabled={loading}
                      className="w-full py-2.5 bg-brand text-white rounded-lg text-sm font-bold hover:bg-brand-dark transition-all disabled:opacity-50"
                    >
                      {loading ? "发送中..." : "发送验证码"}
                    </button>
                  </div>
                )}

                {step === "code" && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-500">验证码已发送至 <span className="font-medium text-gray-700">{email}</span></p>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">验证码 *</label>
                      <input
                        type="text"
                        value={code}
                        onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="请输入6位验证码"
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 text-center tracking-[8px] font-mono"
                        maxLength={6}
                      />
                    </div>
                    <button
                      onClick={verifyCode}
                      className="w-full py-2.5 bg-brand text-white rounded-lg text-sm font-bold hover:bg-brand-dark transition-all"
                    >
                      验证
                    </button>
                    <div className="text-center">
                      {countdown > 0 ? (
                        <span className="text-xs text-gray-400">{countdown}s 后重新发送</span>
                      ) : (
                        <button onClick={sendCode} disabled={loading} className="text-xs text-brand hover:underline">
                          重新发送验证码
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {step === "profile" && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-500">验证成功，请完善账号信息</p>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">姓名 *</label>
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="请输入姓名"
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">密码 *</label>
                      <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="至少6位密码"
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                      />
                    </div>
                    <button
                      onClick={register}
                      disabled={loading}
                      className="w-full py-2.5 bg-brand text-white rounded-lg text-sm font-bold hover:bg-brand-dark transition-all disabled:opacity-50"
                    >
                      {loading ? "注册中..." : "完成注册"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
