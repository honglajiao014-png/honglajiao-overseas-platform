import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer, ResourceSection } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Used Cars from China to Tanzania — Import Guide 2026 | Honglajiao Auto Export",
  robots: "noindex, nofollow", description: "Import regulations, customs clearance, and vehicle sourcing for Tanzania buyers. Complete guide for importing from China.",
};

export default function SEOPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-brand to-brand-dark text-white py-10">
          <div className="max-w-[1200px] mx-auto px-4">
            <h1 className="text-2xl md:text-3xl font-bold mb-3">Used Cars from China to Tanzania — Import Guide 2026</h1>
            <p className="text-white/80 text-sm md:text-base max-w-2xl">
              Import regulations, customs clearance, and vehicle sourcing for Tanzania buyers. Complete guide for importing from China.
            </p>
          </div>
        </section>

        <article className="py-12 bg-white">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                Tanzania's Dar es Salaam port serves not only Tanzania but also landlocked countries including Zambia, Malawi, and DRC, making it a strategic entry point for Chinese used cars.
              </p>
              
            <section>
              <h2 className="text-xl font-bold text-dark mb-3 mt-8">Import Regulations</h2>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{`Higher demand for SUVs and 4x4 vehicles. Dar port also serves landlocked countries.`}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-dark mb-3 mt-8">Customs Duties</h2>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{`Approximately 25-40% total, varying by engine capacity. Import duty + VAT + excise duty.`}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-dark mb-3 mt-8">Popular Models</h2>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{`Toyota Land Cruiser, Hilux; Suzuki Escudo; Nissan Patrol; Toyota RAV4.`}</p>
            </section>
            </div>

            <div className="max-w-3xl mx-auto mt-12 pt-8 border-t text-center">
              <h2 className="text-lg font-bold text-dark mb-4">Ready to Start Sourcing?</h2>
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
