import Link from "next/link";
import { RESOURCE_LINKS } from "@/data/site";

export function HomeResources() {
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
              {RESOURCE_LINKS.marketGuides.map((l) => (
                <li key={l.href}><Link href={l.href} className="text-sm text-zinc-500 hover:text-white transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">Vehicle Categories</h4>
            <ul className="space-y-2">
              {RESOURCE_LINKS.vehicleCategories.map((l) => (
                <li key={l.href}><Link href={l.href} className="text-sm text-zinc-500 hover:text-white transition-colors">{l.label}</Link></li>
              ))}
            </ul>
            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3 mt-6">EV & Brand</h4>
            <ul className="space-y-2">
              {RESOURCE_LINKS.evBrand.map((l) => (
                <li key={l.href}><Link href={l.href} className="text-sm text-zinc-500 hover:text-white transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">Commercial & Heavy</h4>
            <ul className="space-y-2">
              {RESOURCE_LINKS.commercialHeavy.map((l) => (
                <li key={l.href}><Link href={l.href} className="text-sm text-zinc-500 hover:text-white transition-colors">{l.label}</Link></li>
              ))}
            </ul>
            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3 mt-6">Core Pages</h4>
            <ul className="space-y-2">
              {RESOURCE_LINKS.corePages.map((l) => (
                <li key={l.href}><Link href={l.href} className="text-sm text-zinc-500 hover:text-white transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">Procurement Services</h4>
            <ul className="space-y-2">
              <li><Link href="/cars" className="text-sm text-zinc-500 hover:text-white transition-colors">All Vehicles</Link></li>
              <li><Link href="/cars" className="text-sm text-zinc-500 hover:text-white transition-colors">Verified Vehicles</Link></li>
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
