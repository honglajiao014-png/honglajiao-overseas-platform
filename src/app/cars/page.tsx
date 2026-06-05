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
  const typeFilter = sp.get("type") || "";
  const [filters, setFilters] = useState({ brand: "", type: typeFilter, transmission: "", fuel: "", minPrice: "", maxPrice: "", minYear: "", maxYear: "" });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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

  const brands = [...new Set(ALL_VEHICLES.map(v => v.brand))].sort();
  const types = [...new Set(ALL_VEHICLES.map(v => v.type))];

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-white";

  const FilterPanel = () => (
    <div className="space-y-5">
      <h3 className="font-extrabold text-gray-900 text-sm flex items-center gap-2">
        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filters
      </h3>

      <div>
        <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Brand</label>
        <select value={filters.brand} onChange={e => setFilters(f => ({ ...f, brand: e.target.value }))} className={inputClass}>
          <option value="">All Brands</option>
          {brands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Type</label>
        <select value={filters.type} onChange={e => setFilters(f => ({ ...f, type: e.target.value }))} className={inputClass}>
          <option value="">All Types</option>
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Transmission</label>
        <select value={filters.transmission} onChange={e => setFilters(f => ({ ...f, transmission: e.target.value }))} className={inputClass}>
          <option value="">All</option>
          <option value="Automatic">Automatic</option>
          <option value="Manual">Manual</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Fuel</label>
        <select value={filters.fuel} onChange={e => setFilters(f => ({ ...f, fuel: e.target.value }))} className={inputClass}>
          <option value="">All</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Electric">Electric</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Price Range ($)</label>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={filters.minPrice} onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))} className={inputClass} />
          <input type="number" placeholder="Max" value={filters.maxPrice} onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))} className={inputClass} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Year</label>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={filters.minYear} onChange={e => setFilters(f => ({ ...f, minYear: e.target.value }))} className={inputClass} />
          <input type="number" placeholder="Max" value={filters.maxYear} onChange={e => setFilters(f => ({ ...f, maxYear: e.target.value }))} className={inputClass} />
        </div>
      </div>

      <button
        onClick={() => setFilters({ brand: "", type: "", transmission: "", fuel: "", minPrice: "", maxPrice: "", minYear: "", maxYear: "" })}
        className="w-full text-xs font-semibold text-gray-500 hover:text-primary transition-colors py-2"
      >
        Clear All Filters
      </button>
    </div>
  );

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen">
        <div className="container-wide py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              {searchQuery ? <>Search results for &ldquo;{searchQuery}&rdquo;</> : "All Vehicles"}
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              {filtered.length} vehicle{filtered.length !== 1 ? "s" : ""} found — Real photos, real inspection, real prices
            </p>
          </div>

          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-72 shrink-0">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24 shadow-sm">
                <FilterPanel />
              </div>
            </aside>

            {/* Mobile Filters Toggle */}
            <div className="lg:hidden fixed bottom-6 left-4 z-40">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="btn btn-primary px-5 py-3 rounded-xl shadow-lg text-sm font-bold flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
                {Object.values(filters).some(v => v) && (
                  <span className="w-2 h-2 bg-accent rounded-full" />
                )}
              </button>
            </div>

            {/* Mobile Filters Drawer */}
            {mobileFiltersOpen && (
              <>
                <div className="lg:hidden fixed inset-0 z-50 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
                <div className="lg:hidden fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-white shadow-2xl overflow-y-auto animate-slide-in-right">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-extrabold text-gray-900">Filters</h3>
                      <button onClick={() => setMobileFiltersOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <FilterPanel />
                  </div>
                </div>
              </>
            )}

            {/* Vehicle Grid */}
            <div className="flex-1">
              {filtered.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-400">No vehicles found</h3>
                  <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search terms</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filtered.map((v) => (
                    <Link key={v.slug} href={`/cars/${v.slug}`}
                      className="card-hover group bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col shadow-sm"
                    >
                      {/* Image Placeholder */}
                      <div className="aspect-[16/10] img-placeholder relative overflow-hidden">
                        <div className="text-center">
                          <div className="text-4xl mb-2 opacity-20">🚘</div>
                          <div className="text-sm opacity-40 font-semibold">{v.brand}</div>
                        </div>
                        {/* Type Badge */}
                        <span className="absolute top-3 left-3 badge badge-primary text-[10px] shadow-sm">
                          {v.type}
                        </span>
                      </div>

                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors flex-1">
                          {v.title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 text-[11px] text-gray-500">
                          <span>{v.year}</span>
                          <span className="text-gray-300">·</span>
                          <span>{v.mileage}</span>
                          <span className="text-gray-300">·</span>
                          <span>{v.transmission}</span>
                          <span className="text-gray-300">·</span>
                          <span>{v.fuel}</span>
                        </div>

                        <div className="flex items-end justify-between mt-4 pt-4 border-t border-gray-50">
                          <div>
                            <div className="text-xl font-extrabold text-danger">${v.price.toLocaleString()}</div>
                            <div className="text-[10px] text-gray-400">FOB China</div>
                          </div>
                          <span className="text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                            Details
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function CarsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto mb-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading vehicles...</p>
        </div>
      </div>
    }>
      <CarsContent />
    </Suspense>
  );
}
