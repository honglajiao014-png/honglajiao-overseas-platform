"use client";

import { useState, useMemo, useEffect } from "react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BrandLogo } from "@/components/BrandLogo";
import { useT, T } from "@/i18n/useT";
import { useLang } from "@/i18n/LangContext";
import { BRANDS, PRICE_RANGES, AGE_RANGES, MILEAGE_RANGES, TRANSMISSION_OPTIONS, FUEL_OPTIONS, BODY_TYPES, SORT_OPTIONS } from "@/data/brands";

interface VehicleBrief {
  slug: string; brand: string; model: string; year: number;
  mileage: number | null; location: string | null;
  transmission: string | null; fuel: string | null;
  bodyStyle: string | null; salePrice: number;
  images: string[]; createdAt: string;
}

// 品牌中文映射（用于展示）

export default function CarsPage() {
  const t = useT();
  const { lang } = useLang();

  // 从 API 获取车辆
  const [vehicles, setVehicles] = useState<VehicleBrief[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/vehicles")
      .then(r => r.json())
      .then(d => { setVehicles(d.vehicles || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

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
    let result = [...vehicles];

    if (brandFilter) result = result.filter(v => v.brand === brandFilter);

    if (priceRange >= 0 && PRICE_RANGES[priceRange]) {
      const r = PRICE_RANGES[priceRange];
      if (r.min !== undefined) result = result.filter(v => v.salePrice >= r.min!);
      if (r.max !== undefined) result = result.filter(v => v.salePrice <= r.max!);
    }

    if (ageRange >= 0 && AGE_RANGES[ageRange]) {
      const r = AGE_RANGES[ageRange];
      const cy = new Date().getFullYear();
      if (r.min !== undefined) result = result.filter(v => (cy - v.year) >= r.min!);
      if (r.max !== undefined) result = result.filter(v => (cy - v.year) <= r.max!);
    }

    if (mileageRange >= 0 && MILEAGE_RANGES[mileageRange]) {
      const r = MILEAGE_RANGES[mileageRange];
      if (r.min !== undefined) result = result.filter(v => (v.mileage || 0) >= r.min!);
      if (r.max !== undefined) result = result.filter(v => (v.mileage || 0) <= r.max!);
    }

    if (transmissionFilter !== "不限") result = result.filter(v => v.transmission === transmissionFilter);
    if (fuelFilter !== "不限") result = result.filter(v => v.fuel === fuelFilter);
    if (bodyTypeFilter !== "不限") result = result.filter(v => v.bodyStyle === bodyTypeFilter);

    switch (sortBy) {
      case "newest": result.sort((a, b) => b.createdAt.localeCompare(a.createdAt)); break;
      case "price_asc": result.sort((a, b) => a.salePrice - b.salePrice); break;
      case "price_desc": result.sort((a, b) => b.salePrice - a.salePrice); break;
      case "year_desc": result.sort((a, b) => b.year - a.year); break;
      case "mileage_asc": result.sort((a, b) => (a.mileage || 0) - (b.mileage || 0)); break;
    }

    return result;
  }, [brandFilter, priceRange, ageRange, mileageRange, transmissionFilter, fuelFilter, bodyTypeFilter, sortBy]);

  const resetFilters = () => {
    setBrandFilter(""); setPriceRange(-1); setAgeRange(-1); setMileageRange(-1);
    setTransmissionFilter("不限"); setFuelFilter("不限"); setBodyTypeFilter("不限");
    setSortBy("default"); setBrandSearch("");
  };

  const activeFilterCount = [brandFilter, priceRange >= 0, ageRange >= 0, mileageRange >= 0, transmissionFilter !== "不限", fuelFilter !== "不限", bodyTypeFilter !== "不限"].filter(Boolean).length;

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

                {/* 品牌 */}
                <div className="mb-5">
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text" value={brandSearch} onChange={e => setBrandSearch(e.target.value)}
                      placeholder={t(T.carsFilter.searchBrand)} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary"
                    />
                    <button
                      onClick={() => document.querySelector<HTMLInputElement>('input[type="text"]')?.focus()}
                      className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-dark transition-all shrink-0"
                    >
                      {t(T.homeFilter.searchBtn)}
                    </button>
                  </div>
                  <div className="max-h-60 overflow-y-auto flex flex-wrap gap-1.5">
                    {(brandSearch ? filteredBrands : BRANDS).map(b => (
                      <button
                        key={b.name}
                        onClick={() => setBrandFilter(b.name)}
                        className={`flex flex-col items-center gap-1 px-2.5 py-2 rounded-lg text-sm font-medium transition-all ${
                          brandFilter === b.name
                            ? "bg-white text-primary ring-2 ring-primary shadow-md scale-105"
                            : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:shadow-sm"
                        }`}
                      >
                        <BrandLogo brand={b} size={40} />
                        <span className={brandFilter === b.name ? "font-bold text-center" : "text-center"}>{b.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 价格下拉 */}
                <div className="mb-4">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">{t(T.carsFilter.price)}</label>
                  <select
                    value={priceRange}
                    onChange={e => setPriceRange(Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  >
                    <option value={-1}>不限</option>
                    {PRICE_RANGES.slice(1).map((r, i) => (
                      <option key={i} value={i+1}>{r.label}</option>
                    ))}
                  </select>
                </div>

                {/* 车龄下拉 */}
                <div className="mb-4">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">{t(T.carsFilter.age)}</label>
                  <select
                    value={ageRange}
                    onChange={e => setAgeRange(Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  >
                    <option value={-1}>不限</option>
                    {AGE_RANGES.slice(1).map((r, i) => (
                      <option key={i} value={i+1}>{r.label}</option>
                    ))}
                  </select>
                </div>

                {/* 里程下拉 */}
                <div className="mb-4">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">{t(T.carsFilter.mileage)}</label>
                  <select
                    value={mileageRange}
                    onChange={e => setMileageRange(Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  >
                    <option value={-1}>不限</option>
                    {MILEAGE_RANGES.slice(1).map((r, i) => (
                      <option key={i} value={i+1}>{r.label}</option>
                    ))}
                  </select>
                </div>

                {/* 变速箱下拉 */}
                <div className="mb-4">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">{t(T.carsFilter.transmission)}</label>
                  <select
                    value={transmissionFilter}
                    onChange={e => setTransmissionFilter(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  >
                    {TRANSMISSION_OPTIONS.map(o => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>

                {/* 燃料类型下拉 */}
                <div className="mb-4">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">{t(T.carsFilter.fuel)}</label>
                  <select
                    value={fuelFilter}
                    onChange={e => setFuelFilter(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  >
                    {FUEL_OPTIONS.map(o => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>

                {/* 车身类型下拉 */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">{t(T.carsFilter.bodyType)}</label>
                  <select
                    value={bodyTypeFilter}
                    onChange={e => setBodyTypeFilter(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  >
                    {BODY_TYPES.map(o => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
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
              {loading ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                  <div className="text-4xl mb-4 animate-pulse">⏳</div>
                  <p className="text-sm text-gray-400">加载中...</p>
                </div>
              ) : filtered.length === 0 ? (
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
                      <div className="w-48 h-36 bg-gray-100 shrink-0 flex items-center justify-center overflow-hidden">
                        {v.images && v.images[0] ? (
                          <img src={v.images[0]} alt={v.model} className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-5xl">🚘</div>
                        )}
                      </div>
                      {/* 信息 */}
                      <div className="flex-1 p-5 flex flex-col justify-between">
                        <div>
                          <h3 className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                            {v.brand} {v.model}{v.year ? ` ${v.year}` : ""}
                          </h3>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                            <span>{v.year}年</span>
                            <span>{v.mileage ? `${v.mileage.toLocaleString()}km` : "-"}</span>
                            <span>{v.location || "China"}</span>
                            <span>{v.transmission || "-"}</span>
                            <span>{v.fuel || "-"}</span>
                          </div>
                        </div>
                        <div className="flex items-end justify-between mt-3">
                          <span className="text-xl font-extrabold text-red-500">
                            ${v.salePrice.toLocaleString()} <span className="text-xs font-normal text-gray-400">USD</span>
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
