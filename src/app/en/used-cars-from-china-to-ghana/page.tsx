import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer, ResourceSection } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Used Cars from China to Ghana — Import Guide 2026 | Honglajiao Auto Export",
  description: "Import regulations, customs clearance, and vehicle sourcing for Ghana buyers. Complete guide for importing from China to Ghana via Tema Port.",
};

export default function SEOPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-brand to-brand-dark text-white py-10">
          <div className="max-w-[1200px] mx-auto px-4">
            <h1 className="text-2xl md:text-3xl font-bold mb-3">Used Cars from China to Ghana — Import Guide 2026</h1>
            <p className="text-white/80 text-sm md:text-base max-w-2xl">
              Import regulations, customs clearance, and vehicle sourcing for Ghana buyers. Complete guide for importing from China to Ghana via Tema Port.
            </p>
          </div>
        </section>

        <article className="py-12 bg-white">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                Ghana is one of West Africa&apos;s most stable and growing markets for used car imports. With a well-regulated import system and the modern Tema Port, Ghanaian buyers are increasingly turning to China for affordable, quality used vehicles. Chinese used cars typically cost 25-40% less than equivalent models from Europe or Japan.
              </p>

            <section>
              <h2 className="text-xl font-bold text-dark mb-3 mt-8">Shipping & Port of Entry</h2>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{`The primary port of entry for vehicle imports is Tema Port, located 25km east of Accra. Tema is one of West Africa's most efficient container ports with dedicated vehicle handling facilities.

Shipping from Chinese ports (Shanghai, Ningbo, Guangzhou) to Tema typically takes 35-50 days. Both container and RoRo services are available. RoRo is generally preferred for Ghana due to lower costs and faster unloading at Tema.

Estimated shipping costs: $1,200-$2,800 per vehicle.`}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-dark mb-3 mt-8">Import Regulations & GSA Standards</h2>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{`The Ghana Standards Authority (GSA) regulates vehicle imports. Key requirements:

• Vehicles must not be more than 10 years old (strictly enforced)
• GSA conformity assessment required before shipment
• Certificate of Conformity (CoC) from an approved inspection agency
• Original title and export documents from China
• LHD vehicles only — RHD imports are restricted

Ghana's age limit is stricter than Nigeria's, which means newer, higher-quality vehicles are in demand. This aligns well with China's large supply of 3-8 year old used cars.`}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-dark mb-3 mt-8">Customs Duties & Tax Structure</h2>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{`Ghana uses a structured duty system based on engine capacity and vehicle age:

• Import Duty: 5-20% depending on engine size
• VAT: 12.5% on CIF + Duty
• NHIL (National Health Insurance Levy): 2.5%
• ECOWAS Levy: 0.5%
• Special Import Levy: varies by vehicle type

Smaller engine vehicles (under 1.5L) attract lower duties, making compact sedans and hatchbacks particularly attractive for the Ghanaian market. Total duties typically range from 30-50% of CIF value.`}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-dark mb-3 mt-8">Popular Models for Ghana</h2>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{`Ghanaian buyers prefer fuel-efficient, reliable vehicles with good parts availability:

• Toyota Corolla / Yaris — compact, fuel-efficient, easy to maintain
• Honda Civic / Fit — popular among urban buyers
• Hyundai Elantra / Accent — strong value proposition
• Kia Rio / Picanto — affordable city cars
• Toyota RAV4 / Honda CR-V — for families and business use
• BYD F3 / Qin — growing Chinese brand presence

Due to the 10-year age limit, Ghana imports newer vehicles than most African markets. Chinese vehicles aged 3-8 years are the sweet spot for this market.`}</p>
            </section>
            </div>

            <div className="max-w-3xl mx-auto mt-12 pt-8 border-t text-center">
              <h2 className="text-lg font-bold text-dark mb-4">Ready to Source Vehicles for Ghana?</h2>
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
