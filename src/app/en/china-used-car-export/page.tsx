import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer, ResourceSection } from "@/components/Footer";

export const metadata: Metadata = {
  title: "China Used Car Export Guide 2026 | Honglajiao Auto Export",
  robots: "noindex, nofollow", description: "Complete guide to exporting used cars from China — process, pricing, shipping, and popular models. Updated for 2026.",
};

export default function SEOPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-brand to-brand-dark text-white py-10">
          <div className="max-w-[1200px] mx-auto px-4">
            <h1 className="text-2xl md:text-3xl font-bold mb-3">China Used Car Export Guide 2026</h1>
            <p className="text-white/80 text-sm md:text-base max-w-2xl">
              Complete guide to exporting used cars from China — process, pricing, shipping, and popular models. Updated for 2026.
            </p>
          </div>
        </section>

        <article className="py-12 bg-white">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                China is the world's largest automotive market, with millions of used vehicles available for export each year. This guide covers everything you need to know about sourcing and exporting used cars from China to Africa and worldwide markets.
              </p>
              
            <section>
              <h2 className="text-xl font-bold text-dark mb-3 mt-8">Why Source from China?</h2>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{`China's used car market offers unmatched variety and competitive pricing. With over 20 million used cars traded annually, buyers can find vehicles at 30-50% below equivalent models in other markets.`}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-dark mb-3 mt-8">Popular Export Models</h2>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{`Toyota Corolla, Camry, RAV4; Honda CR-V, Civic; BMW 3 Series, 5 Series; Mercedes C-Class, E-Class; BYD Han, Tang, Atto 3; Volkswagen Passat, Tiguan.`}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-dark mb-3 mt-8">Export Process Overview</h2>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{`1. Vehicle sourcing and selection
2. Supplier verification
3. On-site inspection with photos/videos
4. Price negotiation and contract
5. Export documentation preparation
6. Customs clearance
7. International shipping
8. Destination port delivery`}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-dark mb-3 mt-8">Shipping Options</h2>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{`Container shipping (most secure, 2-4 vehicles per 40ft container), RoRo (Roll-on/Roll-off, most economical for running vehicles), Rail freight (to Central Asia and Europe), Road transport (to neighboring countries).`}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-dark mb-3 mt-8">Required Documents</h2>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{`Commercial Invoice, Packing List, Certificate of Origin, Export Declaration Form, Bill of Lading, Vehicle Registration Certificate, Purchase Contract.`}</p>
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
