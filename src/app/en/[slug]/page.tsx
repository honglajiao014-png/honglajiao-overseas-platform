import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO_PAGES } from "@/data/seo-pages";
import { SITE } from "@/data/site";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = SEO_PAGES[slug];
  if (!data) return { title: "Not Found" };
  return {
    title: data.title,
    description: data.description,
    alternates: { canonical: `https://${SITE.domain}/en/${slug}` },
    openGraph: {
      title: data.title, description: data.description,
      url: `https://${SITE.domain}/en/${slug}`,
      siteName: SITE.name, type: "article",
    },
  };
}

export default async function SEOPage({ params }: Props) {
  const { slug } = await params;
  const data = SEO_PAGES[slug];
  if (!data) notFound();

  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="bg-dark py-16 border-b border-gray-800">
        <div className="max-w-[800px] mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-4 leading-tight">{data.h1}</h1>
          <p className="text-gray-400 text-sm max-w-2xl mx-auto leading-relaxed">{data.intro}</p>
        </div>
      </section>

      {/* Body */}
      <section className="bg-dark-soft py-12">
        <article className="max-w-[800px] mx-auto px-4">
          {data.sections.map((s, i) => (
            <div key={i} className="mb-10">
              <h2 className="text-lg font-bold text-white mb-3">{s.heading}</h2>
              <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">{s.body}</p>
            </div>
          ))}

          {/* FAQs */}
          {data.faqs.length > 0 && (
            <div className="mt-12 mb-10">
              <h2 className="text-lg font-bold text-white mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {data.faqs.map((faq, i) => (
                  <details key={i} className="bg-dark rounded-xl border border-gray-800 group">
                    <summary className="px-5 py-4 text-sm font-medium text-white cursor-pointer hover:text-gold transition-colors select-none">
                      {faq.q}
                    </summary>
                    <p className="px-5 pb-4 text-sm text-gray-400 leading-relaxed">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="bg-dark border border-brand/30 rounded-xl p-8 text-center my-10">
            <p className="text-sm text-gray-300 mb-5">{data.cta}</p>
            <Link href="/inquiry" className="inline-flex px-8 py-3 bg-brand text-white rounded-lg font-bold text-sm hover:bg-brand-dark transition-all">
              Submit Inquiry →
            </Link>
          </div>

          {/* Related */}
          {data.relatedLinks.length > 0 && (
            <div className="border-t border-gray-800 pt-8">
              <h3 className="text-sm font-bold text-gray-500 mb-4">Related Guides</h3>
              <div className="flex flex-wrap gap-3">
                {data.relatedLinks.map(l => (
                  <Link key={l.href} href={l.href}
                    className="px-4 py-2 bg-dark border border-gray-700 rounded-lg text-xs text-gray-300 hover:border-gold/50 hover:text-gold transition-all">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </section>

      <Footer />
    </main>
  );
}
