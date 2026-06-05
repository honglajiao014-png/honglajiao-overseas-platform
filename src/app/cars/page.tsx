"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

const ALL_VEHICLES = [
  { slug: "audiq3-2022-20260603", title: "Audi Q3 2022 35 TFSI", price: 18500, year: 2022, mileage: "35,000 km", brand: "Audi", type: "Used Car", transmission: "Automatic", fuel: "Petrol" },
  { slug: "wulinghongguangs3-2018-20260603", title: "Wuling Hongguang S3 2018 1.5L", price: 4200, year: 2018, mileage: "52,000 km", brand: "Wuling", type: "Used Car", transmission: "Manual", fuel: "Petrol" },
];

function CarsContent() {
  const sp = useSearchParams();
  const searchQuery = sp.get("search") || "";
  const [filters, setFilters] = useState({ brand: "", type: "", transmission: "", fuel: "", minPrice: "", maxPrice: "", minYear: "", maxYear: "" });

  let filtered = ALL_VEHICLES;
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(v => v.title.toLowerCase().includes(q) || v.brand.toLowerCase().includes(q) || v.type.toLowerCase().includes(q));
  }
  if (filters.brand) filtered = filtered.filter(v => v.brand.toLowerCase() === filters.brand.toLowerCase());
  if (filters.type) filtered = filtered.filter(v => v.type === filters.type);
  if (filters.transmission) filtered = filtered.filter(v => v.transmission === filters.transmission);
  if (filters.fuel) filtered = filtered.filter(v => v.fuel === filters.fuel);
  if (filters.minPrice) filtered = filtered.filter(v => v.price >= Number(filters.minPrice));
  if (filters.maxPrice) filtered = filtered.filter(v => v.price <= Number(filters.maxPrice));
  if (filters.minYear) filtered = filtered.filter(v => v.year >= Number(filters.minYear));
  if (filters.maxYear) filtered = filtered.filter(v => v.year <= Number(filters.maxYear));

  const brands = [...new Set(ALL_VEHICLES.map(v => v.brand))];
  const types = [...new Set(ALL_VEHICLES.map(v => v.type))];

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-guazi-green";

  return (
    <>
      <Header />
      <main className="max-w-[1600px] mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-guazi-dark">
            {searchQuery ? `Search results for "${searchQuery}"` : "All Vehicles"}
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            {filtered.length} vehicle{filtered.length !== 1 ? "s" : ""} found — Real photos, real inspection, real prices
          </p>
        </div>

        <div className="flex gap-6">
          {/* Left sidebar filters */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white border border-gray-200 rounded-xl p-5 sticky top-20 space-y-5">
              <h3 className="font-bold text-guazi-dark text-sm">Filters</h3>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Brand</label>
                <select value={filters.brand} onChange={e => setFilters(f => ({ ...f, brand: e.target.value }))} className={inputClass}>
                  <option value="">All Brands</option>
                  {brands.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Type</label>
                <select value={filters.type} onChange={e => setFilters(f => ({ ...f, type: e.target.value }))} className={inputClass}>
                  <option value="">All Types</option>
                  {types.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Transmission</label>
                <select value={filters.transmission} onChange={e => setFilters(f => ({ ...f, transmission: e.target.value }))} className={inputClass}>
                  <option value="">All</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Fuel</label>
                <select value={filters.fuel} onChange={e => setFilters(f => ({ ...f, fuel: e.target.value }))} className={inputClass}>
                  <option value="">All</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Price Range ($)</label>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min" value={filters.minPrice} onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))} className={inputClass} />
                  <input type="number" placeholder="Max" value={filters.maxPrice} onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))} className={inputClass} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Year</label>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min" value={filters.minYear} onChange={e => setFilters(f => ({ ...f, minYear: e.target.value }))} className={inputClass} />
                  <input type="number" placeholder="Max" value={filters.maxYear} onChange={e => setFilters(f => ({ ...f, maxYear: e.target.value }))} className={inputClass} />
                </div>
              </div>

              <button onClick={() => setFilters({ brand: "", type: "", transmission: "", fuel: "", minPrice: "", maxPrice: "", minYear: "", maxYear: "" })}
                className="w-full text-xs text-gray-500 hover:text-guazi-green">
                Clear All Filters
              </button>
            </div>
          </aside>

          {/* Vehicle grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-lg font-bold text-gray-400">No vehicles found</h3>
                <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((v) => (
                  <Link key={v.slug} href={`/cars/${v.slug}`}
                    className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-guazi-green/30 transition-all duration-300">
                    <div className="aspect-[16/9] bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                      [{v.brand} {v.year}]
                    </div>
                    <div className="p-4">
                      <span className="text-xs text-guazi-green bg-guazi-green-light px-2 py-0.5 rounded">{v.type}</span>
                      <h3 className="text-sm font-bold text-guazi-dark mt-2 line-clamp-2 group-hover:text-guazi-green transition-colors">
                        {v.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                        <span>{v.year}</span><span>·</span><span>{v.mileage}</span><span>·</span><span>{v.transmission}</span>
                      </div>
                      <div className="mt-3 text-lg font-bold text-guazi-red">${v.price.toLocaleString()}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function CarsPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-guazi-green border-t-transparent rounded-full" /></div>}>
    <CarsContent />
  </Suspense>;
}
