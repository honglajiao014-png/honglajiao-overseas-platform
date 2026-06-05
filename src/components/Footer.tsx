import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-guazi-dark text-white py-12">
      <div className="max-w-[1600px] mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-bold mb-4 text-white">Vehicles</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/cars" className="hover:text-guazi-green">All Vehicles</Link></li>
              <li><Link href="/cars?type=Used+Car" className="hover:text-guazi-green">Used Cars</Link></li>
              <li><Link href="/cars?type=New+Energy" className="hover:text-guazi-green">EV & New Energy</Link></li>
              <li><Link href="/cars?type=Commercial" className="hover:text-guazi-green">Commercial Vehicles</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold mb-4 text-white">Africa Markets</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><span className="text-gray-500">Nigeria — Lagos</span></li>
              <li><span className="text-gray-500">Kenya — Mombasa</span></li>
              <li><span className="text-gray-500">Ghana — Tema</span></li>
              <li><span className="text-gray-500">Tanzania — Dar es Salaam</span></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold mb-4 text-white">Services</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/blog/china-used-car-export-guide" className="hover:text-guazi-green">Vehicle Inspection</Link></li>
              <li><Link href="/blog/china-used-car-export-guide" className="hover:text-guazi-green">Export Process</Link></li>
              <li><Link href="/blog/china-ev-export-sourcing-guide" className="hover:text-guazi-green">Logistics & Shipping</Link></li>
              <li><Link href="/inquiry" className="hover:text-guazi-green">Submit Request</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold mb-4 text-white">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/blog" className="hover:text-guazi-green">Blog</Link></li>
              <li><Link href="/register" className="hover:text-guazi-green">Dealer Registration</Link></li>
              <li><Link href="/login" className="hover:text-guazi-green">Login</Link></li>
              <li><a href="tel:+8613877284681" className="hover:text-guazi-green">+86 138-7728-4681</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
          <p>Copyright 2015-2026 ChinaCarExport — From China to Africa</p>
        </div>
      </div>
    </footer>
  );
}

export function ResourceSection() {
  return null;
}
