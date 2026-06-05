"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useT } from "@/i18n/useT";
import { T } from "@/i18n/translations";
import Link from "next/link";

const inputClass =
  "w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm text-dark placeholder-gray-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all";

function InquiryForm() {
  const t = useT();
  const sp = useSearchParams();
  const vehicle = sp.get("vehicle");
  const brand = sp.get("brand");
  const model = sp.get("model");
  const year = sp.get("year");

  const prefilledVehicle = vehicle && brand && model && year
    ? { vehicle, brand, model, year }
    : null;

  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const fd = new FormData(e.currentTarget);
    try {
      await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(fd)),
      });
      setSent(true);
    } catch { setSent(true); }
    setSending(false);
  };

  if (sent) {
    return (
      <section id="inquiry-form" className="bg-white py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="bg-brand-light border border-brand/20 rounded-2xl p-10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brand/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-dark mb-2">{t(T.inquiry.success)}</h2>
            <p className="text-gray-500 text-sm">{t(T.inquiry.successDesc)}</p>
            <button
              onClick={() => setSent(false)}
              className="mt-6 text-sm text-brand font-semibold hover:text-brand-dark transition-colors"
            >
              {t(T.inquiry.another)}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="inquiry-form" className="bg-gray-light py-16 md:py-20">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-10">
          <span className="text-brand text-xs font-bold uppercase tracking-widest bg-brand-light px-3 py-1 rounded-full">
            {t(T.inquiry.heading)}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-dark mt-4">
            Tell Us What You Need
          </h2>
          <p className="text-gray-500 text-sm mt-2 max-w-lg mx-auto">
            Fill in the details and our team will get back to you within 2 hours
          </p>
        </div>

        <form className="bg-white rounded-2xl shadow-sm border border-border p-6 md:p-8" onSubmit={handleSubmit}>
          {prefilledVehicle && (
            <div className="mb-6 p-4 bg-brand-light border border-brand/20 rounded-xl">
              <p className="text-xs text-brand font-bold uppercase mb-2">{t(T.inquiry.selectedVehicle)}</p>
              <div className="flex items-center justify-between">
                <p className="text-dark font-bold text-sm">
                  {prefilledVehicle.brand} {prefilledVehicle.model} ({prefilledVehicle.year})
                </p>
                <Link href="/inquiry" className="text-xs text-gray-400 hover:text-brand transition-colors">
                  ← Clear
                </Link>
              </div>
              <input type="hidden" name="vehicle" value={prefilledVehicle.vehicle} />
              <input type="hidden" name="brand" value={prefilledVehicle.brand} />
              <input type="hidden" name="model" value={prefilledVehicle.model} />
              <input type="hidden" name="year" value={prefilledVehicle.year} />
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Name *</label>
              <input name="name" placeholder="Full name" className={inputClass} required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email / WhatsApp *</label>
              <input name="contact" type="text" placeholder="you@email.com" className={inputClass} required />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Target Country</label>
              <input name="country" placeholder="e.g. Nigeria" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Vehicle Type</label>
              <select name="vehicleType" className={inputClass} defaultValue={prefilledVehicle ? "Used Passenger Car" : ""}>
                <option value="">Select type</option>
                <option>Used Passenger Car</option>
                <option>New Energy Vehicle (EV)</option>
                <option>Commercial Truck</option>
                <option>Construction Machinery</option>
                <option>Motorcycle</option>
                <option>Auto Parts</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Budget / Quantity / Details</label>
            <textarea
              name="message"
              rows={3}
              placeholder={t(T.inquiry.additionalPlaceholder)}
              className={`${inputClass} resize-none`}
              required
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="w-full bg-brand text-white py-3.5 rounded-xl text-sm font-bold hover:bg-brand-dark transition-all shadow-sm shadow-brand/20 hover:shadow-md hover:shadow-brand/30 disabled:opacity-60"
          >
            {sending ? "Submitting..." : t(T.misc.submit)}
          </button>
        </form>
      </div>
    </section>
  );
}

export function HomeInquiry() {
  return (
    <Suspense fallback={
      <div className="bg-gray-light py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-gray-400">Loading inquiry form...</p>
        </div>
      </div>
    }>
      <InquiryForm />
    </Suspense>
  );
}
