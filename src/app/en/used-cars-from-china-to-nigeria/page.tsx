import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer, ResourceSection } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Used Cars from China to Nigeria — Import Guide 2026 | Honglajiao Auto Export",
  description: "Customs duties, shipping routes, and best models for importing used cars from China to Nigeria. Complete guide for Nigerian buyers.",
};

export default function SEOPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-brand to-brand-dark text-white py-10">
          <div className="max-w-[1200px] mx-auto px-4">
            <h1 className="text-2xl md:text-3xl font-bold mb-3">Used Cars from China to Nigeria — Import Guide 2026</h1>
            <p className="text-white/80 text-sm md:text-base max-w-2xl">
              Customs duties, shipping routes, and best models for importing used cars from China to Nigeria. Complete guide for Nigerian buyers.
            </p>
          </div>
        </section>

        <article className="py-12 bg-white">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                Nigeria is Africa&apos;s largest economy and its biggest market for used car imports, with an estimated 300,000+ used vehicles imported annually. Chinese used cars offer excellent value for Nigerian buyers — typically 30-50% cheaper than equivalent models sourced from Europe or the US. Popular models include Toyota Corolla, Camry, RAV4, Honda CR-V, and increasingly Chinese brands like BYD and Geely.
              </p>

            <section>
              <h2 className="text-xl font-bold text-dark mb-3 mt-8">Shipping Routes & Ports</h2>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{`The primary destination port for vehicle imports is Lagos (Apapa Port and Tin Can Island Port). Secondary ports include Port Harcourt and Onne Port for eastern Nigeria.

Shipping from major Chinese ports (Shanghai, Ningbo, Tianjin, Guangzhou) to Lagos typically takes 30-45 days via container or RoRo (Roll-on/Roll-off) service. Container shipping is recommended for higher-value vehicles; RoRo is more economical for bulk shipments of running vehicles.

Estimated shipping costs: $1,500-$3,000 per vehicle depending on method and vehicle size.`}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-dark mb-3 mt-8">Import Regulations & Age Limits</h2>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{`Nigeria currently allows used vehicle imports up to 15 years old for cars, though this is subject to change. The Nigerian Customs Service (NCS) requires:

• SONCAP certification (Standards Organisation of Nigeria Conformity Assessment Programme)
• Pre-shipment inspection by an approved agent
• Clean title and export documentation from China
• Form M (import declaration) filed by the importer

Vehicles must meet minimum safety and emissions standards. Left-hand drive (LHD) vehicles from China are fully compatible with Nigerian roads.`}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-dark mb-3 mt-8">Customs Duties & Taxes</h2>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{`Import duties on used vehicles in Nigeria are calculated on the CIF (Cost, Insurance, Freight) value:

• Import Duty: 35% of CIF value
• VAT: 7.5% on (CIF + Import Duty)
• Surcharge: varies by vehicle type
• Port charges and clearing agent fees: typically $500-$1,500

Total landed cost is typically 50-70% above the vehicle purchase price. Working with an experienced clearing agent in Lagos is strongly recommended to navigate the process efficiently.`}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-dark mb-3 mt-8">Most Popular Models for Nigeria</h2>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{`Based on actual import data and market demand:

• Toyota Corolla (2010-2020) — the #1 imported car in Nigeria
• Toyota Camry — popular for business and family use
• Toyota RAV4 / Honda CR-V — high-demand SUVs
• Lexus RX 350 — premium SUV, strong resale value
• Hyundai Elantra / Kia Sportage — affordable alternatives
• BYD Qin / Song — growing demand for Chinese EVs

Nigerian buyers prioritize fuel efficiency, parts availability, and resale value. Toyota dominates due to extensive spare parts networks nationwide.`}</p>
            </section>
            </div>

            <div className="max-w-3xl mx-auto mt-12 pt-8 border-t text-center">
              <h2 className="text-lg font-bold text-dark mb-4">Ready to Source Vehicles for Nigeria?</h2>
              <div className="flex justify-center gap-4">
                <Link href="/inquiry" className="bg-brand text-white px-8 py-3 rounded-lg text-sm font-bold hover:bg-brand-dark transition-colors">
                  Submit Inquiry
                </Link>
                <Link href="/cars" className="border-2 border-brand text-brand px-8 py-3 rounded-lg text-sm font-bold hover:bg-brand-light transition-colors">
                  Browse Vehicles
                </Link>
              </div>
            </div>
          </div>
        </article>

        <ResourceSection />
      </main>
      <Footer />
    </>
  );
}
