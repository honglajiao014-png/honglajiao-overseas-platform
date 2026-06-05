import Link from "next/link";

const sampleVehicles = [
  {
    id: "audiq3-2022-20260603",
    slug: "audiq3-2022-20260603",
    title: "Audi Q3 2022 35 TFSI",
    price: "$18,500",
    year: 2022,
    mileage: "35,000 km",
    brand: "Audi",
    fuel: "Petrol",
    transmission: "Automatic",
  },
  {
    id: "wulinghongguangs3-2018-20260603",
    slug: "wulinghongguangs3-2018-20260603",
    title: "Wuling Hongguang S3 2018 1.5L",
    price: "$4,200",
    year: 2018,
    mileage: "52,000 km",
    brand: "Wuling",
    fuel: "Petrol",
    transmission: "Manual",
  },
];

const CATEGORY_LINKS = [
  { label: "Used Cars", href: "/cars?type=Used+Car", icon: "🚗" },
  { label: "EV & New Energy", href: "/cars?type=New+Energy", icon: "⚡" },
  { label: "Commercial Vehicles", href: "/cars?type=Commercial", icon: "🚛" },
  { label: "Machinery", href: "/machinery", icon: "🏗️" },
];

export function HomeVehicles() {
  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <span className="badge badge-primary mb-3">Inventory</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Featured Vehicles</h2>
            <p className="text-gray-500 text-sm mt-2">Hand-picked vehicles with real photos and verified pricing</p>
          </div>
          <Link href="/cars" className="btn btn-outline px-4 py-2.5 rounded-lg text-sm">
            View All Vehicles
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Category Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {CATEGORY_LINKS.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-primary-light hover:text-primary transition-all group border border-transparent hover:border-primary/20"
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-primary">{cat.label}</span>
            </Link>
          ))}
        </div>

        {/* Vehicle Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {sampleVehicles.map((v) => (
            <Link
              key={v.id}
              href={`/cars/${v.slug}`}
              className="card-hover group bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col sm:flex-row"
            >
              {/* Image */}
              <div className="sm:w-56 aspect-[4/3] sm:aspect-auto img-placeholder flex-shrink-0">
                <div className="text-center">
                  <div className="text-3xl mb-1 opacity-30">🚘</div>
                  <div className="text-xs opacity-50">{v.brand}</div>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge badge-success text-[10px]">Available</span>
                    <span className="text-xs text-gray-400">{v.year}</span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                    {v.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {v.mileage}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                      {v.transmission}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>
                      {v.fuel}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                  <div>
                    <div className="text-2xl font-extrabold text-danger">{v.price}</div>
                    <div className="text-[10px] text-gray-400">FOB China</div>
                  </div>
                  <span className="btn btn-primary text-xs px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    View Details
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
