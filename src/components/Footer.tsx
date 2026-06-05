import Link from "next/link";

const FOOTER_COLUMNS = [
  {
    title: "Vehicles",
    links: [
      { label: "All Vehicles", href: "/cars" },
      { label: "Used Cars", href: "/cars?type=Used+Car" },
      { label: "EV & New Energy", href: "/cars?type=New+Energy" },
      { label: "Commercial Vehicles", href: "/cars?type=Commercial" },
      { label: "Machinery", href: "/machinery" },
    ],
  },
  {
    title: "Africa Markets",
    links: [
      { label: "Nigeria — Lagos", href: "/en/used-cars-from-china-to-nigeria" },
      { label: "Kenya — Mombasa", href: "/en/used-cars-from-china-to-kenya" },
      { label: "Ghana — Tema", href: "/en/used-cars-from-china-to-ghana" },
      { label: "Tanzania — Dar es Salaam", href: "/en/used-cars-from-china-to-tanzania" },
      { label: "Ethiopia — Djibouti", href: "/en/used-cars-from-china-to-ethiopia" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Vehicle Inspection", href: "/blog/china-used-car-export-guide" },
      { label: "Export Process", href: "/blog/china-used-car-export-guide" },
      { label: "Logistics & Shipping", href: "/blog/china-ev-export-sourcing-guide" },
      { label: "Submit Request", href: "/inquiry" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Dealer Registration", href: "/register" },
      { label: "Login", href: "/login" },
      { label: "Contact Us", href: "/inquiry" },
      { label: "+86 138-7728-4681", href: "tel:+8613877284681" },
      { label: "info@honglajiao1688.com", href: "mailto:info@honglajiao1688.com" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-dark text-white">
      {/* Main Footer */}
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

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xs">CCE</div>
            <div>
              <div className="text-sm font-bold text-white">ChinaCarExport</div>
              <div className="text-[10px] text-gray-500">Reliable Vehicle Sourcing Since 2015</div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-xs text-gray-500">🇨🇳 China · 🇳🇬 Nigeria · 🇰🇪 Kenya · 🇬🇭 Ghana · 🇹🇿 Tanzania</span>
          </div>

          <p className="text-xs text-gray-600">
            &copy; 2015-2026 ChinaCarExport. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
