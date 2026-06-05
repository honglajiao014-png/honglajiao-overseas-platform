import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer, ResourceSection } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Heavy Truck Export from China | Honglajiao Auto Export",
  robots: "noindex, nofollow", description: "Dump trucks, tractor heads, cargo trucks, and specialized heavy vehicles from Chinese manufacturers. Complete sourcing guide.",
};

export default function SEOPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-brand to-brand-dark text-white py-10">
          <div className="max-w-[1200px] mx-auto px-4">
            <h1 className="text-2xl md:text-3xl font-bold mb-3">Heavy Truck Export from China</h1>
            <p className="text-white/80 text-sm md:text-base max-w-2xl">
              Dump trucks, tractor heads, cargo trucks, and specialized heavy vehicles from Chinese manufacturers. Complete sourcing guide.
            </p>
          </div>
        </section>

        <article className="py-12 bg-white">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                China is the world's largest manufacturer of heavy trucks, with brands like HOWO, Shacman, Foton, and Dongfeng offering reliable vehicles at competitive prices for African markets.
              </p>
              
            <section>
              <h2 className="text-xl font-bold text-dark mb-3 mt-8">Major Manufacturers</h2>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{`HOWO (Sinotruk) — most popular export brand, Shacman — heavy-duty specialist, Foton — wide range, Dongfeng — reliable workhorses, XCMG — construction focus, SANY — heavy machinery.`}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-dark mb-3 mt-8">Popular Models</h2>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{`HOWO 371/375/420 tractor heads, Shacman X3000/F3000 dump trucks, Foton Auman series, Dongfeng Kinland/Tianlong.`}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-dark mb-3 mt-8">Export Considerations</h2>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{`Container vs RoRo shipping for trucks, destination country weight regulations, spare parts availability, left-hand drive compatibility with African markets.`}</p>
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
