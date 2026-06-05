"use client";

import Link from "next/link";
import { useT } from "@/i18n/useT";
import { T } from "@/i18n/translations";
import { SITE } from "@/data/site";

const FOOTER_COL_KEYS = [
  {
    title: T.footer.col1_title,
    links: [
      { href: "/cars",                              label: T.footer.fl_all },
      { href: "/en/china-used-car-export",          label: T.footer.fl_verified },
      { href: "/en/china-ev-export-sourcing",       label: T.footer.fl_sourcing },
      { href: "/en/commercial-vehicles-from-china", label: T.footer.fl_financing },
    ],
  },
  {
    title: T.footer.col2_title,
    links: [
      { href: "/services",                          label: T.footer.fl_onboarding },
      { href: "/en/china-used-car-export-to-africa", label: T.footer.fl_standards },
      { href: "/en/china-used-car-export",          label: T.footer.fl_onsite },
      { href: "/services",                          label: T.footer.fl_export },
    ],
  },
  {
    title: T.footer.col3_title,
    links: [
      { href: "/services", label: T.footer.fl_inspectProc },
      { href: "/services", label: T.footer.fl_risk },
      { href: "/services", label: T.footer.fl_delivery },
      { href: "/services", label: T.footer.fl_compliance },
    ],
  },
  {
    title: T.footer.col4_title,
    links: [
      { href: "/about",   label: T.footer.fl_company },
      { href: "/contact", label: T.footer.fl_contactUs },
      { href: "/inquiry", label: T.footer.fl_submit },
      { href: "/contact", label: T.footer.fl_support },
    ],
  },
];

export function Footer() {
  const t = useT();

  return (
    <footer className="bg-dark">
      <div className="max-w-[1280px] mx-auto px-6 py-14">
        {/* Logo + desc row */}
        <div className="flex flex-col lg:flex-row gap-10 mb-12">
          <div className="lg:w-1/3">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-white font-bold text-xl">Honglajiao</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Professional vehicle export sourcing from China. Serving Africa, Middle East and worldwide LHD markets.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-green-600 flex items-center justify-center hover:bg-green-500 transition-colors">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
                </svg>
              </a>
              <a href="mailto:info@honglajiao.com" className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          <div className="lg:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-8">
            {FOOTER_COL_KEYS.map((col) => (
              <div key={t(col.title)}>
                <h4 className="text-sm font-bold mb-4 text-white uppercase tracking-wider">{t(col.title)}</h4>
                <ul className="space-y-2.5 text-sm text-gray-400">
                  {col.links.map((l) => (
                    <li key={t(l.label)}>
                      <Link href={l.href} className="hover:text-white transition-colors">
                        {t(l.label)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>{t(T.site.copyright)}</p>
          <p>{t(T.site.footerTag)}</p>
        </div>
      </div>
    </footer>
  );
}

export function ResourceSection() {
  return null;
}
