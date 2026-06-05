"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

function InquiryForm() {
  const sp = useSearchParams();
  const vehicle = sp.get("vehicle");
  const brand = sp.get("brand");
  const model = sp.get("model");
  const year = sp.get("year");

  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const fd = new FormData(e.currentTarget);
    await fetch("/api/inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(fd)) });
    setSent(true);
    setSending(false);
  };

  if (sent) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-guazi-green-light flex items-center justify-center">
          <svg className="w-8 h-8 text-guazi-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-guazi-dark mb-2">提交成功！</h2>
        <p className="text-gray-500 text-sm">我们将在24小时内与您联系。</p>
      </div>
    );
  }

  const inputClass = "w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-guazi-dark placeholder-gray-400 focus:outline-none focus:border-guazi-green focus:ring-1 focus:ring-guazi-green/30 transition-all";

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-5">
      <div>
        <label className="block text-sm font-semibold text-guazi-dark mb-1.5">姓名 *</label>
        <input name="name" placeholder="请输入您的姓名" className={inputClass} required />
      </div>
      <div>
        <label className="block text-sm font-semibold text-guazi-dark mb-1.5">国家/地区 *</label>
        <input name="country" placeholder="请输入您所在的国家或地区" className={inputClass} required />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-guazi-dark mb-1.5">电子邮箱 *</label>
          <input name="email" type="email" placeholder="请输入您的电子邮箱" className={inputClass} required />
        </div>
        <div>
          <label className="block text-sm font-semibold text-guazi-dark mb-1.5">手机号码 *</label>
          <input name="phone" placeholder="请输入您的手机号码" className={inputClass} required />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-guazi-dark mb-1.5">WhatsApp</label>
          <input name="whatsapp" placeholder="请输入您的WhatsApp号码" className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-guazi-dark mb-1.5">Telegram</label>
          <input name="telegram" placeholder="请输入您的Telegram用户名" className={inputClass} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-guazi-dark mb-1.5">车辆类型</label>
        <select name="vehicleType" className={inputClass}>
          <option value="">请选择</option>
          <option>二手车</option>
          <option>新能源车</option>
          <option>商用车</option>
          <option>工程机械</option>
        </select>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-guazi-dark mb-1.5">品牌</label>
          <input name="brand" placeholder="例如：丰田、比亚迪" defaultValue={brand || ""} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-guazi-dark mb-1.5">型号</label>
          <input name="model" placeholder="例如：凯美瑞、汉" defaultValue={model || ""} className={inputClass} />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-guazi-dark mb-1.5">预算范围</label>
          <input name="budget" placeholder="例如：$5,000 - $15,000" className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-guazi-dark mb-1.5">采购数量</label>
          <input name="quantity" type="number" placeholder="请输入采购数量" className={inputClass} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-guazi-dark mb-1.5">目的港口/城市</label>
        <input name="destination" placeholder="请输入目的港口或城市" className={inputClass} />
      </div>
      <div>
        <label className="block text-sm font-semibold text-guazi-dark mb-1.5">详细需求</label>
        <textarea name="message" rows={4} placeholder="请描述您的具体需求（车型、年份、预算等）" className={`${inputClass} resize-none`} required />
      </div>
      {vehicle && <input type="hidden" name="vehicle" value={vehicle} />}
      <button type="submit" disabled={sending} className="w-full bg-guazi-green text-white py-3.5 rounded-lg font-bold text-sm hover:bg-guazi-green-dark transition-all disabled:opacity-50">
        {sending ? "提交中..." : "提交采购需求"}
      </button>
    </form>
  );
}

export default function InquiryPage() {
  return (
    <>
      <Header />
      <main className="max-w-[1600px] mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-guazi-dark mb-2 text-center">提交采购需求</h1>
        <p className="text-gray-500 text-sm mb-10 text-center">填写以下表单，我们将为您寻找最优质的车源</p>
        <Suspense fallback={<div className="text-center"><div className="animate-spin w-6 h-6 border-2 border-guazi-green border-t-transparent rounded-full mx-auto" /></div>}>
          <InquiryForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
