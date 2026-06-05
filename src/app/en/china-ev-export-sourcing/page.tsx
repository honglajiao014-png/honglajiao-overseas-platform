import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer, ResourceSection } from "@/components/Footer";

export const metadata: Metadata = {
  title: "China EV Export Sourcing Guide | Honglajiao Auto Export",
  robots: "noindex, nofollow", description: "Electric vehicle sourcing from China: BYD, NIO, Xpeng, Geely, and more EV brands. Complete EV export guide.",
};

export default function SEOPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-brand to-brand-dark text-white py-10">
          <div className="max-w-[1200px] mx-auto px-4">
            <h1 className="text-2xl md:text-3xl font-bold mb-3">China EV Export Sourcing Guide</h1>
            <p className="text-white/80 text-sm md:text-base max-w-2xl">
              Electric vehicle sourcing from China: BYD, NIO, Xpeng, Geely, and more EV brands. Complete EV export guide.
            </p>
          </div>
        </section>

        <article className="py-12 bg-white">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                China is the world's largest EV market, producing over 60% of global electric vehicles. Source the best Chinese EVs for export to Africa and worldwide markets.
              </p>
              
            <section>
              <h2 className="text-xl font-bold text-dark mb-3 mt-8">Top Chinese EV Brands</h2>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{`BYD (market leader), NIO (premium EVs), Xpeng (tech-focused), Li Auto (extended-range), Geely/Zeekr (premium), AITO (Huawei partnership), Wuling (affordable).`}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-dark mb-3 mt-8">EV Export Considerations</h2>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{`Battery health certification, charging standard compatibility (GB/T vs CCS vs CHAdeMO), software/language settings, destination country EV incentives.`}</p>
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
