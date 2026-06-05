"use client";

import { useState } from "react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-brand-light rounded-xl p-8 text-center">
        <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-brand/20 flex items-center justify-center">
          <svg className="w-7 h-7 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-dark mb-1">Message Sent!</h3>
        <p className="text-sm text-gray-500">We will get back to you within 24 hours.</p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-4 text-sm text-brand hover:text-brand-dark transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-bold text-dark mb-1.5">Name *</label>
        <input type="text" required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand" />
      </div>
      <div>
        <label className="block text-sm font-bold text-dark mb-1.5">Email *</label>
        <input type="email" required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand" />
      </div>
      <div>
        <label className="block text-sm font-bold text-dark mb-1.5">Destination Country *</label>
        <input type="text" required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand" />
      </div>
      <div>
        <label className="block text-sm font-bold text-dark mb-1.5">Your Requirements</label>
        <textarea rows={4} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand resize-none" />
      </div>
      <button type="submit" className="w-full bg-brand text-white px-6 py-3 rounded-lg text-sm font-bold hover:bg-brand-dark transition-colors">
        Send Message
      </button>
    </form>
  );
}
