import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer, ResourceSection } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Used Cars from China to Middle East — Export Guide 2026 | Honglajiao Auto Export",
  robots: "noindex, nofollow", description: "Luxury and family vehicles from China to UAE, Iraq, Saudi Arabia, and the Gulf region. Complete export guide.",
};

export default function SEOPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-brand to-brand-dark text-white py-10">
          <div className="max-w-[1200px] mx-auto px-4">
            <h1 className="text-2xl md:text-3xl font-bold mb-3">Used Cars from China to Middle East — Export Guide 2026</h1>
            <p className="text-white/80 text-sm md:text-base max-w-2xl">
              Luxury and family vehicles from China to UAE, Iraq, Saudi Arabia, and the Gulf region. Complete export guide.
            </p>
          </div>
        </section>

        <article className="py-12 bg-white">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                The Middle East is a significant market for Chinese used car exports, with demand spanning luxury vehicles, family cars, and commercial vehicles.
              </p>
              
            <section>
              <h2 className="text-xl font-bold text-dark mb-3 mt-8">Key Markets</h2>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{`UAE (Dubai re-export hub), Iraq (largest volume market), Saudi Arabia (growing demand), Jordan, Kuwait.`}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-dark mb-3 mt-8">Popular Models</h2>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{`Toyota Land Cruiser, Prado; Lexus LX, RX; Mercedes S-Class, G-Class; BMW X5, X6; Nissan Patrol.`}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-dark mb-3 mt-8">Shipping Routes</h2>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{`Shanghai → Jebel Ali: 18-25 days. Tianjin → Umm Qasr: 20-28 days. Guangzhou → Dammam: 18-25 days.`}</p>
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
