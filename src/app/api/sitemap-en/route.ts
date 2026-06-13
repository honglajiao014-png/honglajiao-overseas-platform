// @ts-nocheck
import { NextResponse } from "next/server";

const PAGES = [
  { loc: "/", changefreq: "daily", priority: "1.0" },
  { loc: "/cars", changefreq: "daily", priority: "0.9" },
  { loc: "/en/china-used-car-export", changefreq: "monthly", priority: "0.6" },
  { loc: "/en/china-ev-export-sourcing", changefreq: "monthly", priority: "0.6" },
  { loc: "/en/china-heavy-truck-export", changefreq: "monthly", priority: "0.6" },
  { loc: "/en/commercial-vehicles-from-china", changefreq: "monthly", priority: "0.5" },
  { loc: "/en/used-cars-from-china-to-nigeria", changefreq: "monthly", priority: "0.4" },
  { loc: "/en/used-cars-from-china-to-kenya", changefreq: "monthly", priority: "0.4" },
  { loc: "/en/used-cars-from-china-to-ghana", changefreq: "monthly", priority: "0.4" },
  { loc: "/en/used-cars-from-china-to-tanzania", changefreq: "monthly", priority: "0.4" },
  { loc: "/en/used-cars-from-china-to-ethiopia", changefreq: "monthly", priority: "0.4" },
  { loc: "/en/used-cars-from-china-to-middle-east", changefreq: "monthly", priority: "0.4" },
  { loc: "/en/china-used-car-export-to-africa", changefreq: "monthly", priority: "0.4" },
  { loc: "/en/byd-ev-export-sourcing", changefreq: "monthly", priority: "0.4" },
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
