"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContactForm } from "./ContactForm";
import { useT, T } from "@/i18n/useT";

export default function ContactPage() {
  const t = useT();

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-brand to-brand-dark text-white py-10">
          <div className="max-w-[1200px] mx-auto px-4 text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-3">{t(T.contact.heading)}</h1>
            <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto">
              {t(T.contact.subheading)}
            </p>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div>
                <h2 className="text-xl font-bold text-dark mb-6">{t(T.contact.contactInfo)}</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-dark mb-1">{t(T.contact.phone)} / WhatsApp</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-brand font-medium select-all">+1 (310) 290-1842</span>
                      <button onClick={() => { navigator.clipboard.writeText("+1 (310) 290-1842"); alert("Copied!"); }} className="text-xs px-2 py-0.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">Copy</button>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-dark mb-1">{t(T.contact.email)}</h3>
                    <a href="mailto:info@honglajiao1688.com" className="text-brand hover:text-brand-dark">info@honglajiao1688.com</a>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-dark mb-1">{t(T.contact.address)}</h3>
                    <p className="text-gray-500 text-sm">{t(T.contact.addressValue)}</p>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-dark mt-8 mb-3">Languages We Speak</h3>
                <div className="flex gap-4 text-sm">
                  <span className="bg-gray-100 px-3 py-1 rounded-full">中文</span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full">English</span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full">Français</span>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-dark mb-6">{t(T.contact.sendMessage)}</h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
