"use client";

import { useState, useMemo } from "react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BrandLogo } from "@/components/BrandLogo";
import { useT, T } from "@/i18n/useT";
import { BRANDS, PRICE_RANGES, AGE_RANGES, MILEAGE_RANGES, TRANSMISSION_OPTIONS, FUEL_OPTIONS, BODY_TYPES, SORT_OPTIONS } from "@/data/brands";

const ALL_VEHICLES = [
  {
    slug: "audiq3-2022-20260603",
    title: "奥迪Q3 2022款 35 TFSI 进取动感型",
    brand: "奥迪", year: 2022, mileageKm: 3.8, location: "广西柳州",
    transmission: "自动", fuel: "汽油", bodyType: "SUV",
    price: 134700, image: "/vehicles/audiq3-2022-20260603/front.jpg",
    createdAt: "2026-06-03",
  },
  {
    slug: "wulinghongguangs3-2018-20260603",
    title: "五菱宏光S3 2018款 1.5L 手动标准型 国V",
    brand: "五菱", year: 2018, mileageKm: 7.5, location: "柳州",
    transmission: "手动", fuel: "汽油", bodyType: "SUV",
    price: 38200, image: "/vehicles/wulinghongguangs3-2018-20260603/front.jpg",
    createdAt: "2026-06-03",
  },
];

export default function CarsPage() {
  const t = useT();

  // 筛选状态
  const [brandFilter, setBrandFilter] = useState<string>("");
  const [priceRange, setPriceRange] = useState<number>(-1);
  const [ageRange, setAgeRange] = useState<number>(-1);
  const [mileageRange, setMileageRange] = useState<number>(-1);
  const [transmissionFilter, setTransmissionFilter] = useState<string>("不限");
  const [fuelFilter, setFuelFilter] = useState<string>("不限");
  const [bodyTypeFilter, setBodyTypeFilter] = useState<string>("不限");
  const [sortBy, setSortBy] = useState<string>("default");
  const [brandSearch, setBrandSearch] = useState("");

  // 品牌搜索过滤
  const filteredBrands = useMemo(() => {
    if (!brandSearch.trim()) return BRANDS;
    const q = brandSearch.toLowerCase();
    return BRANDS.filter(b => b.name.toLowerCase().includes(q) || b.letter.toLowerCase().includes(q));
  }, [brandSearch]);

  // 车辆筛选
  const filtered = useMemo(() => {
    let result = [...ALL_VEHICLES];

    if (brandFilter) result = result.filter(v => v.brand === brandFilter);

    if (priceRange >= 0 && PRICE_RANGES[priceRange]) {
      const r = PRICE_RANGES[priceRange];
      if (r.min !== undefined) result = result.filter(v => v.price >= r.min!);
      if (r.max !== undefined) result = result.filter(v => v.price <= r.max!);
    }

    if (ageRange >= 0 && AGE_RANGES[ageRange]) {
      const r = AGE_RANGES[ageRange];
      const cy = new Date().getFullYear();
      if (r.min !== undefined) result = result.filter(v => (cy - v.year) >= r.min!);
      if (r.max !== undefined) result = result.filter(v => (cy - v.year) <= r.max!);
    }

    if (mileageRange >= 0 && MILEAGE_RANGES[mileageRange]) {
      const r = MILEAGE_RANGES[mileageRange];
      if (r.min !== undefined) result = result.filter(v => v.mileageKm >= r.min!);
      if (r.max !== undefined) result = result.filter(v => v.mileageKm <= r.max!);
    }

    if (transmissionFilter !== "不限") result = result.filter(v => v.transmission === transmissionFilter);
    if (fuelFilter !== "不限") result = result.filter(v => v.fuel === fuelFilter);
    if (bodyTypeFilter !== "不限") result = result.filter(v => v.bodyType === bodyTypeFilter);

    switch (sortBy) {
      case "newest": result.sort((a, b) => b.createdAt.localeCompare(a.createdAt)); break;
      case "price_asc": result.sort((a, b) => a.price - b.price); break;
      case "price_desc": result.sort((a, b) => b.price - a.price); break;
      case "year_desc": result.sort((a, b) => b.year - a.year); break;
      case "mileage_asc": result.sort((a, b) => a.mileageKm - b.mileageKm); break;
    }

    return result;
  }, [brandFilter, priceRange, ageRange, mileageRange, transmissionFilter, fuelFilter, bodyTypeFilter, sortBy]);

  const resetFilters = () => {
    setBrandFilter(""); setPriceRange(-1); setAgeRange(-1); setMileageRange(-1);
    setTransmissionFilter("不限"); setFuelFilter("不限"); setBodyTypeFilter("不限");
    setSortBy("default"); setBrandSearch("");
  };

  const activeFilterCount = [brandFilter, priceRange >= 0, ageRange >= 0, mileageRange >= 0, transmissionFilter !== "不限", fuelFilter !== "不限", bodyTypeFilter !== "不限"].filter(Boolean).length;

  const FilterBtn = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button onClick={onClick} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${active ? "bg-primary text-white font-bold" : "text-gray-600 hover:bg-gray-100"}`}>
      {children}
    </button>
  );

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 py-6">
          {/* 面包屑 */}
          <div className="text-xs text-gray-400 mb-4">
            <a href="/" className="hover:text-primary">{t(T.carsFilter.breadcrumbHome)}</a>
            <span className="mx-2">›</span>
            <span className="text-gray-600">{t(T.carsFilter.breadcrumbCars)}</span>
          </div>

          <div className="flex gap-6">
            {/* 侧边栏筛选器 */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-extrabold text-gray-900 text-sm">
                    {t(T.carsFilter.filter)} {activeFilterCount > 0 && `(${activeFilterCount})`}
                  </h3>
                  {activeFilterCount > 0 && (
                    <button onClick={resetFilters} className="text-xs text-primary hover:underline">{t(T.carsFilter.reset)}</button>
                  )}
                </div>

                {/* 品牌 */}
                <div className="mb-5">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t(T.carsFilter.brand)}</h4>
                  <input
                    type="text" value={brandSearch} onChange={e => setBrandSearch(e.target.value)}
                    placeholder={t(T.carsFilter.searchBrand)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs mb-2 focus:outline-none focus:border-primary"
                  />
                  <div className="max-h-48 overflow-y-auto space-y-0.5">
                    <FilterBtn active={!brandFilter} onClick={() => setBrandFilter("")}>{t(T.carsFilter.allBrands)}</FilterBtn>
                    {(brandSearch ? filteredBrands : BRANDS).map(b => (
                      <FilterBtn key={b.name} active={brandFilter === b.name} onClick={() => setBrandFilter(b.name)}>
                        <span className="flex flex-col items-center gap-1">
                          <BrandLogo brand={b} size={40} />
                          {b.name}
                        </span>
                      </FilterBtn>
                    ))}
                  </div>
                </div>

                {/* 价格 */}
                <div className="mb-5">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t(T.carsFilter.price)}</h4>
                  <div className="space-y-0.5">
                    {PRICE_RANGES.map((r, i) => (
                      <FilterBtn key={i} active={priceRange === i} onClick={() => setPriceRange(i)}>{r.label}</FilterBtn>
                    ))}
                  </div>
                </div>

                {/* 车龄 */}
                <div className="mb-5">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t(T.carsFilter.age)}</h4>
                  <div className="space-y-0.5">
                    {AGE_RANGES.map((r, i) => (
                      <FilterBtn key={i} active={ageRange === i} onClick={() => setAgeRange(i)}>{r.label}</FilterBtn>
                    ))}
                  </div>
                </div>

                {/* 里程 */}
                <div className="mb-5">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t(T.carsFilter.mileage)}</h4>
                  <div className="space-y-0.5">
                    {MILEAGE_RANGES.map((r, i) => (
                      <FilterBtn key={i} active={mileageRange === i} onClick={() => setMileageRange(i)}>{r.label}</FilterBtn>
                    ))}
                  </div>
                </div>

                {/* 变速箱 */}
                <div className="mb-5">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t(T.carsFilter.transmission)}</h4>
                  <div className="space-y-0.5">
                    {TRANSMISSION_OPTIONS.map(o => (
                      <FilterBtn key={o} active={transmissionFilter === o} onClick={() => setTransmissionFilter(o)}>{o}</FilterBtn>
                    ))}
                  </div>
                </div>

                {/* 燃料类型 */}
                <div className="mb-5">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t(T.carsFilter.fuel)}</h4>
                  <div className="space-y-0.5">
                    {FUEL_OPTIONS.map(o => (
                      <FilterBtn key={o} active={fuelFilter === o} onClick={() => setFuelFilter(o)}>{o}</FilterBtn>
                    ))}
                  </div>
                </div>

                {/* 车身类型 */}
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t(T.carsFilter.bodyType)}</h4>
                  <div className="space-y-0.5">
                    {BODY_TYPES.map(o => (
                      <FilterBtn key={o} active={bodyTypeFilter === o} onClick={() => setBodyTypeFilter(o)}>{o}</FilterBtn>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* 右侧结果区 */}
            <div className="flex-1 min-w-0">
              {/* 结果统计 + 排序 */}
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-gray-500">
                  {t(T.carsFilter.foundTotal)} <span className="font-bold text-gray-900">{filtered.length}</span> {t(T.carsFilter.results)}
                </p>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary"
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {/* 车辆列表 */}
              {filtered.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                  <div className="text-5xl mb-4">🚗</div>
                  <h3 className="text-lg font-bold text-gray-400 mb-2">{t(T.carsFilter.noResult)}</h3>
                  <p className="text-sm text-gray-400 mb-4">{t(T.carsFilter.noResultDesc)}</p>
                  <button onClick={resetFilters} className="text-primary text-sm font-bold hover:underline">{t(T.carsFilter.reset)}</button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filtered.map(v => (
                    <a
                      key={v.slug}
                      href={`/cars/${v.slug}`}
                      className="flex bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all group"
                    >
                      {/* 缩略图 */}
                      <div className="w-48 h-36 bg-gray-100 shrink-0 flex items-center justify-center text-5xl">
                        🚘
                      </div>
                      {/* 信息 */}
                      <div className="flex-1 p-5 flex flex-col justify-between">
                        <div>
                          <h3 className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                            {v.title}
                          </h3>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                            <span>{v.year}年</span>
                            <span>{v.mileageKm}万公里</span>
                            <span>{v.location}</span>
                            <span>{v.transmission}</span>
                            <span>{v.fuel}</span>
                          </div>
                        </div>
                        <div className="flex items-end justify-between mt-3">
                          <span className="text-xl font-extrabold text-red-500">
                            ¥{v.price.toLocaleString()} <span className="text-xs font-normal text-gray-400">CNY</span>
                          </span>
                          <span className="text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            {t(T.carsFilter.viewDetail)}
                          </span>
                        </div>
                      </div>
                    </a>
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
