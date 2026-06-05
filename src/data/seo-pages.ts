// SEO landing page data — driven by slugs in /en/[slug]
// Language-specific versions: just add fr/es/zh field variants

export interface SEOPageData {
  title: string; description: string;
  h1: string; intro: string;
  sections: { heading: string; body: string }[];
  faqs: { q: string; a: string }[];
  cta: string;
  relatedLinks: { label: string; href: string }[];
}

// Dynamic SEO page template for /en/[slug]
// Most SEO pages are individual files (created by Claude Code) that take priority.
// This dynamic template serves as a fallback for new topics added here.
export const SEO_PAGES: Record<string, SEOPageData> = {};
