"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer, ResourceSection } from "@/components/Footer";
import { useT, T } from "@/i18n/useT";

export default function ServicesPage() {
  const t = useT();

  const serviceItems = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: t(T.servicesPage.sourcing),
      desc: t(T.servicesPage.sourcingDesc),
      features: ["Access to nationwide inventory", "Price negotiation", "Multi-source comparison", "Real-time market pricing"],
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: t(T.servicesPage.inspection),
      desc: t(T.servicesPage.inspectionDesc),
      features: ["Professional third-party inspection", "Detailed inspection report", "Photo & video documentation", "Accident & flood damage check"],
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: t(T.servicesPage.documentation),
      desc: t(T.servicesPage.documentationDesc),
      features: ["Chinese export documentation", "Certificate of origin", "Bill of lading", "Destination country compliance"],
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v3a1 1 0 001 1h2l3 6h4z" />
        </svg>
      ),
      title: t(T.servicesPage.shipping),
      desc: t(T.servicesPage.shippingDesc),
      features: ["Container shipping", "RoRo shipping", "Rail freight", "Road transport to Africa"],
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      title: t(T.servicesPage.support),
      desc: t(T.servicesPage.supportDesc),
      features: ["Chinese (Mandarin)", "English", "French", "24-hour response time"],
    },
  ];

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-brand to-brand-dark text-white py-10">
          <div className="max-w-[1200px] mx-auto px-4 text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-3">{t(T.servicesPage.heading)}</h1>
            <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto">
              {t(T.servicesPage.subheading)}
            </p>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {serviceItems.map((svc) => (
                <div key={svc.title} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 rounded-full bg-brand-light flex items-center justify-center text-brand mb-4">
                    {svc.icon}
                  </div>
                  <h3 className="text-lg font-bold text-dark mb-2">{svc.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{svc.desc}</p>
                  <ul className="space-y-1.5">
                    {svc.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="text-brand font-bold">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center bg-brand-light rounded-xl p-8">
              <h2 className="text-xl font-bold text-dark mb-3">{t(T.homeInquiry.ctaTitle)}</h2>
              <p className="text-sm text-gray-500 mb-6">{t(T.homeInquiry.ctaDesc)}</p>
              <div className="flex justify-center gap-4">
                <Link href="/cars" className="bg-brand text-white px-8 py-3 rounded-lg text-sm font-bold hover:bg-brand-dark transition-colors">
                  {t(T.header.allVehicles)}
                </Link>
                <Link href="/contact" className="border-2 border-brand text-brand px-8 py-3 rounded-lg text-sm font-bold hover:bg-brand-light transition-colors">
                  {t(T.homeInquiry.ctaBtn)}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <ResourceSection />
      </main>
      <Footer />
    </>
  );
}
