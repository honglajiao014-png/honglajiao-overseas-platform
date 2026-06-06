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

export function ResourceSection() {
  return (
    <section className="py-16 bg-[#1a1a1a]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h3 className="text-lg font-semibold text-white mb-8">
          Explore China Car Export Resources
        </h3>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">Market Guides</h4>
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
            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">Vehicle Categories</h4>
            <ul className="space-y-2">
              <li><Link href="/en/china-used-car-export" className="text-sm text-zinc-500 hover:text-white transition-colors">Used Cars from China</Link></li>
              <li><Link href="/en/commercial-vehicles-from-china" className="text-sm text-zinc-500 hover:text-white transition-colors">Commercial Vehicles</Link></li>
              <li><Link href="/en/china-heavy-truck-export" className="text-sm text-zinc-500 hover:text-white transition-colors">Heavy Truck Export</Link></li>
              <li><Link href="/cars" className="text-sm text-zinc-500 hover:text-white transition-colors">Browse Vehicle Listings</Link></li>
            </ul>
            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3 mt-6">EV & Brand</h4>
            <ul className="space-y-2">
              <li><Link href="/en/byd-ev-export-sourcing" className="text-sm text-zinc-500 hover:text-white transition-colors">BYD EV Export</Link></li>
              <li><Link href="/en/china-ev-export-sourcing" className="text-sm text-zinc-500 hover:text-white transition-colors">China EV Export</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">Commercial & Heavy</h4>
            <ul className="space-y-2">
              <li><Link href="/en/china-heavy-truck-export" className="text-sm text-zinc-500 hover:text-white transition-colors">Heavy Trucks</Link></li>
              <li><Link href="/en/commercial-vehicles-from-china" className="text-sm text-zinc-500 hover:text-white transition-colors">Commercial Vehicles</Link></li>
            </ul>
            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3 mt-6">Core Pages</h4>
            <ul className="space-y-2">
              <li><Link href="/services" className="text-sm text-zinc-500 hover:text-white transition-colors">Our Services</Link></li>
              <li><Link href="/inquiry" className="text-sm text-zinc-500 hover:text-white transition-colors">Submit Inquiry</Link></li>
              <li><Link href="/about" className="text-sm text-zinc-500 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-zinc-500 hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">Procurement Services</h4>
            <ul className="space-y-2">
              <li><Link href="/cars" className="text-sm text-zinc-500 hover:text-white transition-colors">All Vehicles</Link></li>
              <li><Link href="/en/china-used-car-export" className="text-sm text-zinc-500 hover:text-white transition-colors">Verified Vehicles</Link></li>
              <li><Link href="/services" className="text-sm text-zinc-500 hover:text-white transition-colors">China-Wide Sourcing</Link></li>
              <li><Link href="/inquiry" className="text-sm text-zinc-500 hover:text-white transition-colors">Financial Support</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">About Us</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-zinc-500 hover:text-white transition-colors">Company Profile</Link></li>
              <li><Link href="/contact" className="text-sm text-zinc-500 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/contact" className="text-sm text-zinc-500 hover:text-white transition-colors">Consultation Hotline</Link></li>
              <li><Link href="/contact" className="text-sm text-zinc-500 hover:text-white transition-colors">Join Us</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
