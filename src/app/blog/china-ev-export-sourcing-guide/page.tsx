import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer, ResourceSection } from "@/components/Footer";

export const metadata: Metadata = {
  title: "China EV Export Sourcing Guide: BYD, NIO, Xpeng & More (2026) | Honglajiao Auto Export",
  robots: "noindex, nofollow", description: "Complete guide to sourcing Chinese electric vehicles for export. BYD vs NIO vs Xpeng comparison, battery health checks, export regulations for EVs.",
};

const relatedPosts = [
  { slug: "/blog/china-used-car-export-guide", title: "China Used Car Export Guide 2026", desc: "Complete guide to exporting used cars from China." },
  { slug: "/blog/commercial-vehicle-sourcing-from-china", title: "Commercial Vehicle Sourcing from China", desc: "How to source commercial vehicles from China." },
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
              <span className="inline-block px-2 py-0.5 bg-brand-light text-brand text-xs font-medium rounded mb-3">EV Guide</span>
              <h1 className="text-2xl md:text-3xl font-bold text-dark mb-4">China EV Export Sourcing Guide: BYD, NIO, Xpeng & More (2026)</h1>
              <p className="text-sm text-gray-400 mb-6">Published: 2026-05-08 | Honglajiao Auto Export Team</p>
              <p className="text-sm text-gray-500 leading-relaxed mb-8">Complete guide to sourcing Chinese electric vehicles for export. BYD vs NIO vs Xpeng comparison, battery health checks, export regulations for EVs.</p>
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
