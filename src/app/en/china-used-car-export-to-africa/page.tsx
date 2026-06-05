import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer, ResourceSection } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Used Cars from China to Africa — Export Guide 2026 | Honglajiao Auto Export",
  robots: "noindex, nofollow", description: "Used car export from China to Nigeria, Kenya, Ghana, Ethiopia, Tanzania and across the African continent. Complete guide with duties, shipping routes, and popular models.",
};

export default function SEOPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-brand to-brand-dark text-white py-10">
          <div className="max-w-[1200px] mx-auto px-4">
            <h1 className="text-2xl md:text-3xl font-bold mb-3">Used Cars from China to Africa — Export Guide 2026</h1>
            <p className="text-white/80 text-sm md:text-base max-w-2xl">
              Used car export from China to Nigeria, Kenya, Ghana, Ethiopia, Tanzania and across the African continent. Complete guide with duties, shipping routes, and popular models.
            </p>
          </div>
        </section>

        <article className="py-12 bg-white">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                Africa is one of the fastest-growing markets for Chinese used car exports. Countries like Nigeria, Kenya, Ghana, and Tanzania import tens of thousands of used vehicles from China annually.
              </p>
              
            <section>
              <h2 className="text-xl font-bold text-dark mb-3 mt-8">Key African Markets</h2>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{`Nigeria (Lagos/Apapa), Kenya (Mombasa), Ghana (Tema), Tanzania (Dar es Salaam), Ethiopia (Djibouti transit). Each market has specific age restrictions, duty rates, and popular models.`}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-dark mb-3 mt-8">LHD Advantage</h2>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{`China is a Left-Hand Drive (LHD) market, making Chinese vehicles directly compatible with most African countries. Key LHD markets: Nigeria, Ghana, Ethiopia, Egypt, Algeria, Morocco, and many more.`}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-dark mb-3 mt-8">Shipping Routes</h2>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{`Shanghai → Lagos: 30-40 days, $1,800-2,500. Tianjin → Mombasa: 25-35 days, $1,500-2,200. Guangzhou → Tema: 28-38 days, $1,700-2,400. Qingdao → Dar es Salaam: 25-35 days, $1,600-2,300.`}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-dark mb-3 mt-8">Payment Methods</h2>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{`T/T (Telegraphic Transfer) — most common, 30-50% deposit + balance before shipping. L/C (Letter of Credit) — for larger orders. Western Union/MoneyGram — for small deposits.`}</p>
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
