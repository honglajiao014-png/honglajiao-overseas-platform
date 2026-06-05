import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "联系我们 | Honglajiao Auto Export",
  description: "Get in touch for used car export from China. We respond within 24 hours.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-brand to-brand-dark text-white py-10">
          <div className="max-w-[1200px] mx-auto px-4 text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-3">Contact Us</h1>
            <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto">
              Get in touch for used car export from China. We respond within 24 hours.
            </p>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div>
                <h2 className="text-xl font-bold text-dark mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-dark mb-1">Phone / WhatsApp</h3>
                    <p className="text-gray-500 text-sm">提交询价后获取专属顾问联系方式</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-dark mb-1">Email</h3>
                    <a href="mailto:export@honglajiao1688.com" className="text-brand hover:text-brand-dark">export@honglajiao1688.com</a>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-dark mb-1">Office Location</h3>
                    <p className="text-gray-500 text-sm">中国 · 四川省</p>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-dark mt-8 mb-3">Languages We Speak</h3>
                <div className="flex gap-4 text-sm">
                  <span className="bg-gray-100 px-3 py-1 rounded-full">中文</span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full">English</span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full">Français</span>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-dark mb-6">Send Us a Message</h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
