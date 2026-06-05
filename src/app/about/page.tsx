import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "关于我们 | Honglajiao Auto Export",
  description: "Learn about Honglajiao Auto Export — your trusted China used car export partner for African LHD markets.",
};

const whyChooseUs = [
  { title: "China-Based Team", desc: "Direct access to the Chinese market. No middlemen, no markups — direct pricing." },
  { title: "Multilingual", desc: "Chinese, English, French communication. No language barriers in your export process." },
  { title: "Full Service", desc: "Sourcing, inspection, documentation, customs, shipping — one partner for everything." },
  { title: "Quality First", desc: "259-point inspection on every vehicle. Full transparency on vehicle condition." },
  { title: "African Focus", desc: "Specialized in African LHD markets — Nigeria, Ghana, Ethiopia, Kenya, Tanzania, and more." },
  { title: "Competitive Pricing", desc: "Direct market access means better prices for you. Save 20-40% vs local dealers." },
];

const markets = [
  "Nigeria", "Ghana", "Ethiopia", "Kenya", "Tanzania", "Egypt",
  "Algeria", "Morocco", "Ivory Coast", "Senegal", "Cameroon", "Angola",
  "DR Congo", "Sudan", "UAE", "Iraq", "Saudi Arabia",
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-brand to-brand-dark text-white py-10">
          <div className="max-w-[1200px] mx-auto px-4 text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-3">About Honglajiao Auto Export</h1>
            <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto">
              Your Trusted China Used Car Export Partner
            </p>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-xl font-bold text-dark mb-4">Who We Are</h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-8">
                Honglajiao Auto Export is a professional used car export service based in China, connecting international buyers with China&apos;s massive inventory of quality used vehicles. Our multilingual team (Chinese, English, French) provides end-to-end service — from vehicle sourcing and inspection to documentation, customs clearance, and international shipping.
              </p>

              <h2 className="text-xl font-bold text-dark mb-4">Our Mission</h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-8">
                We make China&apos;s used car market accessible to buyers worldwide. By handling the complexity of cross-border vehicle trade — language barriers, inspection, documentation, logistics — we enable our clients to access quality vehicles at competitive prices with complete peace of mind.
              </p>
            </div>

            <h2 className="text-xl font-bold text-dark mb-6 text-center mt-12">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto">
              {whyChooseUs.map((item) => (
                <div key={item.title} className="bg-brand-light/30 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-dark mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <h2 className="text-xl font-bold text-dark mb-6 text-center mt-12">Our Markets</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm max-w-2xl mx-auto">
              {markets.map((m) => (
                <div key={m} className="bg-gray-50 rounded-lg px-4 py-2 text-center text-dark font-medium">{m}</div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-sm text-gray-500 mb-6">
                Whether you&apos;re a dealer looking for bulk supply or an individual buyer, we&apos;re here to help. Contact us to discuss your requirements.
              </p>
              <Link href="/contact" className="bg-brand text-white px-8 py-3 rounded-lg text-sm font-bold hover:bg-brand-dark transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
