import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer, ResourceSection } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Best Used Cars from China for African Markets (2026) | Honglajiao Auto Export",
  robots: "noindex, nofollow", description: "Top 10 used car models from China that offer best value for African buyers. Toyota, BMW, Mercedes, Hyundai, and Chinese brands compared.",
};

const relatedPosts = [
  { slug: "/blog/china-used-car-export-guide", title: "China Used Car Export Guide 2026", desc: "Complete guide to exporting used cars from China." },
  { slug: "/blog/how-to-import-from-china-to-africa", title: "How to Import Used Cars from China to Africa (2026)", desc: "Step-by-step guide for African buyers." },
];

export default function BlogPostPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-[1200px] mx-auto px-4 py-3">
            <Link href="/blog" className="text-sm text-brand hover:text-brand-dark">← Back to Blog</Link>
          </div>
        </div>
        <article className="py-12 bg-white">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <span className="inline-block px-2 py-0.5 bg-brand-light text-brand text-xs font-medium rounded mb-3">Buying Guide</span>
              <h1 className="text-2xl md:text-3xl font-bold text-dark mb-4">Best Used Cars from China for African Markets (2026)</h1>
              <p className="text-sm text-gray-400 mb-6">Published: 2026-05-10 | Honglajiao Auto Export Team</p>
              <p className="text-sm text-gray-500 leading-relaxed mb-8">Top 10 used car models from China that offer best value for African buyers. Toyota, BMW, Mercedes, Hyundai, and Chinese brands compared.</p>
              <div className="prose prose-sm max-w-none text-gray-600">
                <p>Full article content coming soon. Contact us for detailed information on this topic.</p>
              </div>
            </div>

            <div className="max-w-3xl mx-auto mt-12 pt-8 border-t">
              <h2 className="text-lg font-bold text-dark mb-4">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {relatedPosts.map((p) => (
                  <Link key={p.slug} href={p.slug} className="block p-4 border rounded-lg hover:border-brand transition-colors">
                    <h3 className="text-sm font-bold text-dark hover:text-brand">{p.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">{p.desc}</p>
                  </Link>
                ))}
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
