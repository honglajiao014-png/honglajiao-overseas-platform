"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";

export default function LoginPage() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <main className="min-h-screen flex flex-col bg-dark">
        <Header />
        <section className="flex-1 flex items-center justify-center">
          <div className="bg-dark-soft border border-gray-800 rounded-xl p-10 text-center max-w-sm w-full mx-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Login Request Submitted</h2>
            <p className="text-gray-400 text-sm">We will review your access request and contact you shortly.</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-dark">
      <Header />
      <section className="flex-1 flex items-center justify-center px-4">
        <div className="bg-dark-soft border border-gray-800 rounded-xl p-8 max-w-sm w-full">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-white">Dealer Access</h1>
            <p className="text-gray-400 text-sm mt-1">Sign in to manage your listings</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-1.5">Email</label>
              <input type="email" placeholder="your@email.com" className="w-full border border-gray-700 bg-dark rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-1.5">Password</label>
              <input type="password" placeholder="••••••••" className="w-full border border-gray-700 bg-dark rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold" required />
            </div>
            <button type="submit" className="w-full bg-brand text-white py-3 rounded-lg font-bold text-sm hover:bg-brand-dark transition-all">
              Request Access
            </button>
          </form>
          <p className="text-center text-xs text-gray-500 mt-4">
            Don&apos;t have an account? <Link href="/contact" className="text-gold hover:text-gold/80">Contact us</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
