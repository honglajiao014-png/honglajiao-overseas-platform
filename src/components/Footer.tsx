"use client";

import Link from "next/link";
import { useT, T } from "@/i18n/useT";

export function Footer() {
  const t = useT();

  const FOOTER_COLUMNS = [
    {
      title: t(T.footer.vehicles),
      links: [
        { label: t(T.footer.allVehicles), href: "/cars" },
        { label: t(T.footer.usedCars), href: "/cars?type=Used+Car" },
        { label: t(T.footer.evNewEnergy), href: "/cars?type=New+Energy" },
        { label: t(T.footer.commercialVehicles), href: "/cars?type=Commercial" },
        { label: t(T.footer.machinery), href: "/machinery" },
      ],
    },
    {
      title: t(T.footer.africaMarkets),
      links: [
        { label: t(T.footer.nigeria), href: "/en/used-cars-from-china-to-nigeria" },
        { label: t(T.footer.kenya), href: "/en/used-cars-from-china-to-kenya" },
        { label: t(T.footer.ghana), href: "/en/used-cars-from-china-to-ghana" },
        { label: t(T.footer.tanzania), href: "/en/used-cars-from-china-to-tanzania" },
        { label: t(T.footer.ethiopia), href: "/en/used-cars-from-china-to-ethiopia" },
      ],
    },
    {
      title: t(T.footer.services),
      links: [
        { label: t(T.footer.vehicleInspection), href: "/blog/china-used-car-export-guide" },
        { label: t(T.footer.exportProcess), href: "/blog/china-used-car-export-guide" },
        { label: t(T.footer.logisticsShipping), href: "/blog/china-ev-export-sourcing-guide" },
        { label: t(T.header.submitRequest), href: "/inquiry" },
        { label: t(T.header.blog), href: "/blog" },
      ],
    },
    {
      title: t(T.footer.company),
      links: [
        { label: t(T.footer.dealerRegistration), href: "/register" },
        { label: t(T.header.login), href: "/login" },
        { label: t(T.footer.contactUs), href: "/inquiry" },
        { label: "+86 138-7728-4681", href: "tel:+8613877284681" },
        { label: "info@honglajiao1688.com", href: "mailto:info@honglajiao1688.com" },
      ],
    },
  ];

  return (
    <footer className="bg-dark text-white">
      <div className="container-wide py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-5">{col.title}</h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("tel:") || link.href.startsWith("mailto:") ? (
                      <a href={link.href} className="text-sm text-gray-400 hover:text-primary transition-colors">
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className="text-sm text-gray-400 hover:text-primary transition-colors">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xs">CCE</div>
            <div>
              <div className="text-sm font-bold text-white">ChinaCarExport</div>
              <div className="text-[10px] text-gray-500">{t(T.footer.bottomTag)}</div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-xs text-gray-500">🇨🇳 China · 🇳🇬 Nigeria · 🇰🇪 Kenya · 🇬🇭 Ghana · 🇹🇿 Tanzania</span>
          </div>

          <p className="text-xs text-gray-600">
            {t(T.footer.copyright)}
          </p>
        </div>
      </div>
    </footer>
  );
}

export function ResourceSection() {
  const t = useT();

  return (
    <section className="py-16 bg-[#1a1a1a]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h3 className="text-lg font-semibold text-white mb-8">
          {t(T.resources.heading)}
        </h3>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">{t(T.resources.marketGuides)}</h4>
            <ul className="space-y-2">
              <li><Link href="/en/china-used-car-export" className="text-sm text-zinc-500 hover:text-white transition-colors">China Used Car Export</Link></li>
              <li><Link href="/en/china-used-car-export-to-africa" className="text-sm text-zinc-500 hover:text-white transition-colors">China to Africa Export</Link></li>
              <li><Link href="/en/used-cars-from-china-to-nigeria" className="text-sm text-zinc-500 hover:text-white transition-colors">Used Cars to Nigeria</Link></li>
              <li><Link href="/en/used-cars-from-china-to-ghana" className="text-sm text-zinc-500 hover:text-white transition-colors">Used Cars to Ghana</Link></li>
              <li><Link href="/en/used-cars-from-china-to-kenya" className="text-sm text-zinc-500 hover:text-white transition-colors">Used Cars to Kenya</Link></li>
              <li><Link href="/en/used-cars-from-china-to-tanzania" className="text-sm text-zinc-500 hover:text-white transition-colors">Used Cars to Tanzania</Link></li>
              <li><Link href="/en/used-cars-from-china-to-ethiopia" className="text-sm text-zinc-500 hover:text-white transition-colors">Used Cars to Ethiopia</Link></li>
              <li><Link href="/en/used-cars-from-china-to-middle-east" className="text-sm text-zinc-500 hover:text-white transition-colors">China to Middle East</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">{t(T.resources.vehicleCategories)}</h4>
            <ul className="space-y-2">
              <li><Link href="/en/china-used-car-export" className="text-sm text-zinc-500 hover:text-white transition-colors">Used Cars from China</Link></li>
              <li><Link href="/en/commercial-vehicles-from-china" className="text-sm text-zinc-500 hover:text-white transition-colors">Commercial Vehicles</Link></li>
              <li><Link href="/en/china-heavy-truck-export" className="text-sm text-zinc-500 hover:text-white transition-colors">Heavy Truck Export</Link></li>
              <li><Link href="/cars" className="text-sm text-zinc-500 hover:text-white transition-colors">Browse Vehicle Listings</Link></li>
            </ul>
            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3 mt-6">{t(T.resources.evBrand)}</h4>
            <ul className="space-y-2">
              <li><Link href="/en/byd-ev-export-sourcing" className="text-sm text-zinc-500 hover:text-white transition-colors">BYD EV Export</Link></li>
              <li><Link href="/en/china-ev-export-sourcing" className="text-sm text-zinc-500 hover:text-white transition-colors">China EV Export</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">{t(T.resources.commercialHeavy)}</h4>
            <ul className="space-y-2">
              <li><Link href="/en/china-heavy-truck-export" className="text-sm text-zinc-500 hover:text-white transition-colors">Heavy Trucks</Link></li>
              <li><Link href="/en/commercial-vehicles-from-china" className="text-sm text-zinc-500 hover:text-white transition-colors">Commercial Vehicles</Link></li>
            </ul>
            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3 mt-6">{t(T.resources.corePages)}</h4>
            <ul className="space-y-2">
              <li><Link href="/services" className="text-sm text-zinc-500 hover:text-white transition-colors">Our Services</Link></li>
              <li><Link href="/inquiry" className="text-sm text-zinc-500 hover:text-white transition-colors">Submit Inquiry</Link></li>
              <li><Link href="/about" className="text-sm text-zinc-500 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-zinc-500 hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">{t(T.resources.procurementServices)}</h4>
            <ul className="space-y-2">
              <li><Link href="/cars" className="text-sm text-zinc-500 hover:text-white transition-colors">{t(T.resources.allVehiclesLink)}</Link></li>
              <li><Link href="/en/china-used-car-export" className="text-sm text-zinc-500 hover:text-white transition-colors">{t(T.resources.verifiedVehicles)}</Link></li>
              <li><Link href="/services" className="text-sm text-zinc-500 hover:text-white transition-colors">{t(T.resources.chinaWideSourcing)}</Link></li>
              <li><Link href="/inquiry" className="text-sm text-zinc-500 hover:text-white transition-colors">{t(T.resources.financialSupport)}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">{t(T.resources.aboutUs)}</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-zinc-500 hover:text-white transition-colors">{t(T.resources.companyProfile)}</Link></li>
              <li><Link href="/contact" className="text-sm text-zinc-500 hover:text-white transition-colors">{t(T.footer.contactUs)}</Link></li>
              <li><Link href="/contact" className="text-sm text-zinc-500 hover:text-white transition-colors">{t(T.resources.consultationHotline)}</Link></li>
              <li><Link href="/contact" className="text-sm text-zinc-500 hover:text-white transition-colors">{t(T.resources.joinUs)}</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
