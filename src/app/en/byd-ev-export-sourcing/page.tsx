import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer, ResourceSection } from "@/components/Footer";

export const metadata: Metadata = {
  title: "BYD EV Export Sourcing from China | Honglajiao Auto Export",
  robots: "noindex, nofollow", description: "Source BYD electric vehicles — Han, Tang, Seal, Atto 3, Dolphin — for export worldwide. Complete BYD EV sourcing guide.",
};

export default function SEOPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-brand to-brand-dark text-white py-10">
          <div className="max-w-[1200px] mx-auto px-4">
            <h1 className="text-2xl md:text-3xl font-bold mb-3">BYD EV Export Sourcing from China</h1>
            <p className="text-white/80 text-sm md:text-base max-w-2xl">
              Source BYD electric vehicles — Han, Tang, Seal, Atto 3, Dolphin — for export worldwide. Complete BYD EV sourcing guide.
            </p>
          </div>
        </section>

        <article className="py-12 bg-white">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                BYD is China's largest EV manufacturer and a global leader in electric vehicles. We help international buyers source new and used BYD vehicles for export.
              </p>
              
            <section>
              <h2 className="text-xl font-bold text-dark mb-3 mt-8">Popular BYD Models</h2>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{`BYD Han (luxury sedan), BYD Tang (SUV), BYD Seal (sports sedan), BYD Atto 3 (compact SUV), BYD Dolphin (hatchback), BYD Seagull (city car).`}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-dark mb-3 mt-8">Why BYD?</h2>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{`Blade Battery technology for superior safety, competitive pricing vs Tesla, extensive model range, strong after-sales support network.`}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-dark mb-3 mt-8">Export Process for EVs</h2>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{`Battery certification (UN38.3), shipping requirements for lithium batteries, destination country EV import regulations, charging compatibility.`}</p>
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
