import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer, ResourceSection } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Used Cars from China to Kenya — Import Guide 2026 | Honglajiao Auto Export",
  description: "Complete guide for Kenyan buyers importing cars from China — duties, documents, shipping via Mombasa Port, and popular models.",
};

export default function SEOPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-brand to-brand-dark text-white py-10">
          <div className="max-w-[1200px] mx-auto px-4">
            <h1 className="text-2xl md:text-3xl font-bold mb-3">Used Cars from China to Kenya — Import Guide 2026</h1>
            <p className="text-white/80 text-sm md:text-base max-w-2xl">
              Complete guide for Kenyan buyers importing cars from China — duties, documents, shipping via Mombasa Port, and popular models.
            </p>
          </div>
        </section>

        <article className="py-12 bg-white">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                Kenya is East Africa&apos;s largest economy and a major hub for used car imports, serving not only its domestic market but also landlocked neighbors like Uganda, Rwanda, and South Sudan. Chinese used cars are increasingly popular in Kenya due to competitive pricing and improving quality perception.
              </p>

            <section>
              <h2 className="text-xl font-bold text-dark mb-3 mt-8">Shipping & Mombasa Port</h2>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{`The primary port of entry is Mombasa Port, East Africa's largest and busiest port. From Mombasa, vehicles are transported inland by road or rail to Nairobi and beyond.

Shipping from Chinese ports to Mombasa typically takes 25-35 days — faster than West African routes due to more direct shipping lanes. Both container and RoRo services are available.

Estimated shipping costs: $1,000-$2,500 per vehicle. Mombasa's efficiency and Kenya's well-developed logistics network make it one of the most cost-effective entry points in Africa.`}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-dark mb-3 mt-8">Import Regulations & KEBS Standards</h2>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{`The Kenya Bureau of Standards (KEBS) oversees vehicle imports. Key requirements:

• Vehicles must not be more than 8 years old (strictly enforced since 2019)
• Pre-shipment inspection by KEBS-approved agent (JEVIC, QISJ, or equivalent)
• Certificate of Roadworthiness (CRW) required
• Left-hand drive vehicles are permitted (Kenya drives on the left, but LHD vehicles are legal)
• Emission standards compliance check

Kenya's 8-year age limit is one of the strictest in Africa. This creates demand for newer Chinese used cars (1-7 years old), which China supplies in large volumes.`}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-dark mb-3 mt-8">Customs Duties & Tax Calculation</h2>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{`Kenya uses a unified customs system. Duties are calculated on the CIF value:

• Import Duty: 25% of CIF value
• Excise Duty: 20-30% depending on engine capacity
• VAT: 16% on (CIF + Import Duty + Excise Duty)
• IDF (Import Declaration Fee): 3.5%
• Railway Development Levy: 2%

Total duties typically range from 60-80% of the vehicle's CIF value. Smaller engine vehicles (under 1500cc) attract lower excise duty rates, making compact cars the most economical choice for Kenyan importers.`}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-dark mb-3 mt-8">Popular Models for Kenya</h2>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{`Kenyan buyers favor reliable, fuel-efficient vehicles suited to both urban and rural roads:

• Toyota Corolla / Axio — the most popular import, known for reliability
• Toyota RAV4 / Honda CR-V — ideal for varied Kenyan terrain
• Subaru Forester / Outback — strong following in Kenya
• Mazda CX-5 / Demio — growing popularity
• Nissan X-Trail — popular SUV choice
• BYD Song / Yuan — emerging Chinese EV options

Due to the 8-year age limit, Kenya imports newer vehicles than most African markets. Chinese vehicles aged 2-7 years are the optimal range for this market.`}</p>
            </section>
            </div>

            <div className="max-w-3xl mx-auto mt-12 pt-8 border-t text-center">
              <h2 className="text-lg font-bold text-dark mb-4">Ready to Source Vehicles for Kenya?</h2>
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
