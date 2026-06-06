"use client";

import { useState } from "react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useT, T } from "@/i18n/useT";
import { VEHICLE_TYPES } from "@/data/brands";

export default function InquiryPage() {
  const t = useT();
  const [form, setForm] = useState({
    name: "", country: "", email: "", phone: "", whatsapp: "", telegram: "",
    vehicleType: "", brand: "", model: "", budget: "", quantity: "",
    destinationPort: "", description: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setErrorMsg(t(T.inquiryPage.nameRequired)); setStatus("error"); return; }
    setStatus("loading");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.error) { setErrorMsg(data.error); setStatus("error"); }
      else { setStatus("success"); }
    } catch {
      setErrorMsg(t(T.inquiryPage.error));
      setStatus("error");
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-white";
  const labelClass = "block text-sm font-bold text-gray-700 mb-1.5";

  if (status === "success") {
    return (
      <>
        <Header />
        <main className="flex-1 bg-gray-50 flex items-center justify-center py-20">
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center max-w-md mx-4 shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{t(T.inquiryPage.success)}</h2>
            <p className="text-gray-500 text-sm mb-6">{t(T.inquiryPage.successDesc)}</p>
            <a href="/" className="inline-block bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-primary-dark transition-all">
              {t(T.inquiryPage.backHome)}
            </a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-10">
          {/* 面包屑 */}
          <div className="text-xs text-gray-400 mb-6">
            <a href="/" className="hover:text-primary">{t(T.inquiryPage.breadcrumbHome)}</a>
            <span className="mx-2">›</span>
            <span className="text-gray-600">{t(T.inquiryPage.breadcrumbInquiry)}</span>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <div className="mb-8">
              <h1 className="text-2xl font-extrabold text-gray-900">{t(T.inquiryPage.heading)}</h1>
              <p className="text-gray-500 text-sm mt-2">{t(T.inquiryPage.subheading)}</p>
            </div>

            {status === "error" && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{errorMsg}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>{t(T.inquiryPage.name)} <span className="text-red-500">*</span></label>
                  <input name="name" value={form.name} onChange={handleChange} className={inputClass} placeholder={t(T.inquiryPage.namePlaceholder)} required />
                </div>
                <div>
                  <label className={labelClass}>{t(T.inquiryPage.country)}</label>
                  <input name="country" value={form.country} onChange={handleChange} className={inputClass} placeholder="例如：Nigeria" />
                </div>
                <div>
                  <label className={labelClass}>{t(T.inquiryPage.email)}</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} placeholder="your@email.com" />
                </div>
                <div>
                  <label className={labelClass}>{t(T.inquiryPage.phone)}</label>
                  <input name="phone" type="tel" value={form.phone} onChange={handleChange} className={inputClass} placeholder="+86 138 0000 0000" />
                </div>
                <div>
                  <label className={labelClass}>{t(T.inquiryPage.whatsapp)}</label>
                  <input name="whatsapp" value={form.whatsapp} onChange={handleChange} className={inputClass} placeholder="WhatsApp号码" />
                </div>
                <div>
                  <label className={labelClass}>{t(T.inquiryPage.telegram)}</label>
                  <input name="telegram" value={form.telegram} onChange={handleChange} className={inputClass} placeholder="@username" />
                </div>
              </div>

              <div>
                <label className={labelClass}>{t(T.inquiryPage.vehicleType)}</label>
                <select name="vehicleType" value={form.vehicleType} onChange={handleChange} className={inputClass}>
                  {VEHICLE_TYPES.map(o => (
                    <option key={o} value={o === "请选择车辆类型" ? "" : o}>{o}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>{t(T.inquiryPage.brand)}</label>
                  <input name="brand" value={form.brand} onChange={handleChange} className={inputClass} placeholder="例如：Toyota, BMW" />
                </div>
                <div>
                  <label className={labelClass}>{t(T.inquiryPage.model)}</label>
                  <input name="model" value={form.model} onChange={handleChange} className={inputClass} placeholder="例如：Corolla, X5" />
                </div>
                <div>
                  <label className={labelClass}>{t(T.inquiryPage.budget)}</label>
                  <input name="budget" value={form.budget} onChange={handleChange} className={inputClass} placeholder="例如：$5,000 - $10,000" />
                </div>
                <div>
                  <label className={labelClass}>{t(T.inquiryPage.quantity)}</label>
                  <input name="quantity" type="number" value={form.quantity} onChange={handleChange} className={inputClass} placeholder="例如：5" />
                </div>
              </div>

              <div>
                <label className={labelClass}>{t(T.inquiryPage.destinationPort)}</label>
                <input name="destinationPort" value={form.destinationPort} onChange={handleChange} className={inputClass} placeholder="例如：Lagos, Nigeria" />
              </div>

              <div>
                <label className={labelClass}>{t(T.inquiryPage.description)}</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className={inputClass}
                  placeholder={t(T.inquiryPage.descriptionPlaceholder)}
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm hover:bg-primary-dark transition-all disabled:opacity-50 active:scale-[0.99]"
              >
                {status === "loading" ? t(T.inquiryPage.submitting) : t(T.inquiryPage.submit)}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
