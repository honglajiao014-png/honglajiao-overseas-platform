import { NextResponse } from "next/server";

const PAGES = [
  { loc: "/", changefreq: "daily", priority: "1.0" },
  { loc: "/cars", changefreq: "daily", priority: "0.9" },
  { loc: "/machinery", changefreq: "weekly", priority: "0.7" },
  { loc: "/services", changefreq: "monthly", priority: "0.7" },
  { loc: "/about", changefreq: "monthly", priority: "0.6" },
  { loc: "/contact", changefreq: "monthly", priority: "0.5" },
  { loc: "/blog", changefreq: "weekly", priority: "0.6" },
  { loc: "/login", changefreq: "monthly", priority: "0.4" },
  { loc: "/inquiry", changefreq: "weekly", priority: "0.7" },
];

export function GET() {
  const urls = PAGES.map(
    (p) => `  <url>
    <loc>https://honglajiao1688.com${p.loc}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  ).join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new NextResponse(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
