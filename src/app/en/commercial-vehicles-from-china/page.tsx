import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer, ResourceSection } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Commercial Vehicles from China — Export Guide | Honglajiao Auto Export",
  robots: "noindex, nofollow", description: "Vans, minibuses, light trucks, and commercial fleet solutions for international markets. Source from China.",
};

export default function SEOPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-brand to-brand-dark text-white py-10">
          <div className="max-w-[1200px] mx-auto px-4">
            <h1 className="text-2xl md:text-3xl font-bold mb-3">Commercial Vehicles from China — Export Guide</h1>
            <p className="text-white/80 text-sm md:text-base max-w-2xl">
              Vans, minibuses, light trucks, and commercial fleet solutions for international markets. Source from China.
            </p>
          </div>
        </section>

        <article className="py-12 bg-white">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                From delivery vans to passenger minibuses, China offers a wide range of commercial vehicles suitable for African business needs.
              </p>
              
            <section>
              <h2 className="text-xl font-bold text-dark mb-3 mt-8">Vehicle Types</h2>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{`Light trucks (3-10 ton), minibuses (7-19 seats), cargo vans, refrigerated trucks, tanker trucks, special purpose vehicles.`}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-dark mb-3 mt-8">Popular Brands</h2>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{`Foton, JAC, Dongfeng, Jinbei, Changan, Wuling, Maxus, King Long, Yutong (buses).`}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-dark mb-3 mt-8">Bulk Ordering</h2>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{`Fleet discounts available for 5+ vehicles, customization options (RHD conversion, branding), consolidated shipping for cost savings.`}</p>
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
