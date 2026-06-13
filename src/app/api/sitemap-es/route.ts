// @ts-nocheck
import { NextResponse } from "next/server";

const PAGES = [
  { loc: "/es", changefreq: "daily", priority: "0.8" },
  { loc: "/es/coches-usados-de-china", changefreq: "monthly", priority: "0.5" },
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
