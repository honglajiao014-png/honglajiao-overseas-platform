"use client";

import { useState, useMemo, useEffect } from "react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BrandLogo } from "@/components/BrandLogo";
import { useT, T } from "@/i18n/useT";
import { useLang } from "@/i18n/LangContext";
import { BRANDS, PRICE_RANGES, CAR_LEVELS, AGE_RANGES, SORT_OPTIONS } from "@/data/brands";

export default function Home() {
  const t = useT();
  const { lang } = useLang();

  // 从 API 获取车辆数据
  const [allVehicles, setAllVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    fetch("/api/vehicles?limit=100")
      .then(r => r.json())
      .then(data => {
        setAllVehicles(data.vehicles || []);
        setLoading(false);
      })
      .catch(e => {
        console.error("加载车辆失败:", e);
        setLoadError(e?.message || "加载失败");
        setLoading(false);
      });
  }, []);

  // 筛选状态
  const [brandFilter, setBrandFilter] = useState<string>("");
  const [priceRange, setPriceRange] = useState<number>(-1);
  const [levelFilter, setLevelFilter] = useState<string>("");
  const [ageRange, setAgeRange] = useState<number>(-1);
  const [sortBy, setSortBy] = useState<string>("default");
  const [customMinPrice, setCustomMinPrice] = useState("");
  const [customMaxPrice, setCustomMaxPrice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // 筛选逻辑
  const filtered = useMemo(() => {
    let result = [...allVehicles];

    // 品牌筛选
    if (brandFilter) {
      result = result.filter(v => v.brand === brandFilter);
    }

    // 价格筛选（API 返回 salePrice，单位 USD）
    if (priceRange >= 0 && PRICE_RANGES[priceRange]) {
      const range = PRICE_RANGES[priceRange];
      if (range.min !== undefined) result = result.filter(v => v.salePrice >= range.min!);
      if (range.max !== undefined) result = result.filter(v => v.salePrice <= range.max!);
    }

    // 自定义价格
    if (customMinPrice) result = result.filter(v => v.salePrice >= Number(customMinPrice) * 10000);
    if (customMaxPrice) result = result.filter(v => v.salePrice <= Number(customMaxPrice) * 10000);

    // 级别筛选（API 有 type 字段，如 "Used Passenger Car"）
    if (levelFilter) {
      result = result.filter(v => v.type === levelFilter);
    }

    // 车龄筛选
    if (ageRange >= 0 && AGE_RANGES[ageRange]) {
      const range = AGE_RANGES[ageRange];
      const currentYear = new Date().getFullYear();
      if (range.min !== undefined) result = result.filter(v => (currentYear - v.year) >= range.min!);
      if (range.max !== undefined) result = result.filter(v => (currentYear - v.year) <= range.max!);
    }

    // 搜索
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(v => (v.brand + ' ' + v.model).toLowerCase().includes(q) || v.brand.toLowerCase().includes(q));
    }

    // 排序
    switch (sortBy) {
      case "newest": result.sort((a, b) => b.createdAt.localeCompare(a.createdAt)); break;
      case "price_asc": result.sort((a, b) => (a.salePrice||0) - (b.salePrice||0)); break;
      case "price_desc": result.sort((a, b) => (b.salePrice||0) - (a.salePrice||0)); break;
      case "year_desc": result.sort((a, b) => b.year - a.year); break;
      case "mileage_asc": result.sort((a, b) => (a.mileageKm||0) - (b.mileageKm||0)); break;
    }

    return result;
  }, [allVehicles, brandFilter, priceRange, levelFilter, ageRange, sortBy, customMinPrice, customMaxPrice, searchQuery]);


  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-gray-50 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-500">Loading vehicles...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (loadError) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-gray-50 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-500 mb-2">Failed to load vehicles</p>
            <p className="text-gray-400 text-sm">{loadError}</p>
            <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm">Retry</button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50">
        {/* 🔍 搜索区域 — 全宽醒目 */}
        <div className="bg-gradient-to-r from-primary/90 to-primary shadow-lg">
          <div className="max-w-[1400px] mx-auto px-4 py-8">
            <div className="flex items-center gap-3 max-w-5xl mx-auto">
              <div className="relative flex-1">
                <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && setSearchQuery((e.target as HTMLInputElement).value)}
                  placeholder={t(T.homeFilter.searchVehicle)}
                  className="w-full pl-14 pr-6 py-5 rounded-2xl text-xl bg-white backdrop-blur-sm border-2 border-white focus:outline-none focus:border-white focus:bg-white focus:ring-4 focus:ring-white/30 placeholder-gray-400 shadow-lg"
                />
              </div>
              <button
                onClick={() => setSearchQuery(searchQuery)}
                className="px-10 py-5 bg-white text-primary font-extrabold text-xl rounded-2xl hover:bg-gray-100 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg border-2 border-white/50"
              >
                {t(T.homeFilter.searchBtn)}
              </button>
            </div>
          </div>
        </div>
        {/* Hero 数据条 — 三个统计卡片 */}
        <div className="bg-gray-100 border-b border-gray-200">
          <div className="max-w-[1400px] mx-auto px-4 py-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <div className="flex items-center gap-3 justify-center bg-white rounded-xl px-5 py-4 shadow-sm">
                <span className="text-2xl">🚗</span>
                <div>
                  <div className="text-lg font-bold text-gray-900">
                    {loading ? "..." : allVehicles.length.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">Verified Vehicles</div>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-center bg-white rounded-xl px-5 py-4 shadow-sm">
                <span className="text-2xl">🌍</span>
                <div>
                  <div className="text-lg font-bold text-gray-900">30+</div>
                  <div className="text-sm text-gray-500">Countries Served</div>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-center bg-white rounded-xl px-5 py-4 shadow-sm">
                <span className="text-2xl">✅</span>
                <div>
                  <div className="text-lg font-bold text-gray-900">Verified</div>
                  <div className="text-sm text-gray-500">Supplier Status</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 筛选条件区域 */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-[1400px] mx-auto px-4 py-6">
            <div className="mb-6">
              {/* 品牌Logo自动轮播 — 纯CSS无限滚动 */}
              <style jsx>{`
                @keyframes brandScroll {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
                .brand-scroll-track {
                  display: flex;
                  gap: 0.375rem;
                  width: max-content;
                  animation: brandScroll 40s linear infinite;
                }
                .brand-scroll-track:hover {
                  animation-play-state: paused;
                }
                .brand-scroll-wrapper {
                  overflow: hidden;
                }
              `}</style>
              <div className="brand-scroll-wrapper">
                <div className="brand-scroll-track">
                  {[...BRANDS, ...BRANDS].map((b, i) => (
                    <button
                      key={`${b.name}-${i}`}
                      onClick={() => setBrandFilter(b.name)}
                      className={`flex flex-col items-center gap-1 px-2.5 py-2 rounded-lg text-sm font-medium transition-all shrink-0 ${
                        brandFilter === b.name
                          ? "bg-white text-primary ring-2 ring-primary shadow-md scale-105"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:shadow-sm"
                      }`}
                    >
                      <BrandLogo brand={b} size={44} />
                      <span className={brandFilter === b.name ? "font-bold text-center" : "text-center"}>{lang === "zh" ? b.name : b.nameEn}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 价格筛选 */}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-base font-bold text-gray-700 shrink-0">{t(T.homeFilter.price)}：</span>
              <div className="flex flex-wrap gap-2 items-center">
                <button
                  onClick={() => setPriceRange(0)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    priceRange === 0 ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {t(T.homeFilter.priceAll)}
                </button>
                <button
                  onClick={() => setPriceRange(1)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    priceRange === 1 ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {t(T.homeFilter.priceUnder3)}
                </button>
                <button
                  onClick={() => setPriceRange(2)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    priceRange === 2 ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {t(T.homeFilter.price3to5)}
                </button>
                <button
                  onClick={() => setPriceRange(3)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    priceRange === 3 ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {t(T.homeFilter.price5to10)}
                </button>
                <button
                  onClick={() => setPriceRange(4)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    priceRange === 4 ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {t(T.homeFilter.price10to15)}
                </button>
                <button
                  onClick={() => setPriceRange(5)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    priceRange === 5 ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {t(T.homeFilter.price15to20)}
                </button>
                <button
                  onClick={() => setPriceRange(6)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    priceRange === 6 ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {t(T.homeFilter.priceOver20)}
                </button>
                <div className="flex items-center gap-1 ml-2">
                  <input
                    type="number"
                    placeholder={t(T.homeFilter.priceMin)}
                    value={customMinPrice}
                    onChange={e => { setCustomMinPrice(e.target.value); setPriceRange(-1); }}
                    className="w-16 px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-center"
                  />
                  <span className="text-sm text-gray-400">—</span>
                  <input
                    type="number"
                    placeholder={t(T.homeFilter.priceMax)}
                    value={customMaxPrice}
                    onChange={e => { setCustomMaxPrice(e.target.value); setPriceRange(-1); }}
                    className="w-16 px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-center"
                  />
                  <span className="text-sm text-gray-400">{t(T.homeFilter.priceUnit)}</span>
                </div>
              </div>
            </div>

            {/* 级别筛选 */}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-base font-bold text-gray-700 shrink-0">{t(T.homeFilter.level)}：</span>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setLevelFilter("All")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${levelFilter === "All" ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >{t(T.homeFilter.all)}</button>
                <button onClick={() => setLevelFilter("Sedan")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${levelFilter === "Sedan" ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >{t(T.homeFilter.levelSedan)}</button>
                <button onClick={() => setLevelFilter("SUV")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${levelFilter === "SUV" ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >{t(T.homeFilter.levelSUV)}</button>
                <button onClick={() => setLevelFilter("MPV")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${levelFilter === "MPV" ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >{t(T.homeFilter.levelMPV)}</button>
                <button onClick={() => setLevelFilter("Sports")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${levelFilter === "Sports" ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >{t(T.homeFilter.levelSports)}</button>
                <button onClick={() => setLevelFilter("Pickup")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${levelFilter === "Pickup" ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >{t(T.homeFilter.levelPickup)}</button>
                <button onClick={() => setLevelFilter("3-Box")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${levelFilter === "3-Box" ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >{t(T.homeFilter.levelSedan3)}</button>
                <button onClick={() => setLevelFilter("Hatchback")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${levelFilter === "Hatchback" ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >{t(T.homeFilter.levelHatchback)}</button>
                <button onClick={() => setLevelFilter("Wagon")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${levelFilter === "Wagon" ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >{t(T.homeFilter.levelWagon)}</button>
                <button onClick={() => setLevelFilter("Bus")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${levelFilter === "Bus" ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >{t(T.homeFilter.levelBus)}</button>
                <button onClick={() => setLevelFilter("Truck")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${levelFilter === "Truck" ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >{t(T.homeFilter.levelTruck)}</button>
              </div>
            </div>

            {/* 车龄筛选 */}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-base font-bold text-gray-700 shrink-0">{t(T.homeFilter.age)}：</span>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setAgeRange(0)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${ageRange === 0 ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >{t(T.homeFilter.ageAll)}</button>
                <button onClick={() => setAgeRange(1)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${ageRange === 1 ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >{t(T.homeFilter.ageWithin1)}</button>
                <button onClick={() => setAgeRange(2)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${ageRange === 2 ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >{t(T.homeFilter.age1to3)}</button>
                <button onClick={() => setAgeRange(3)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${ageRange === 3 ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >{t(T.homeFilter.age3to5)}</button>
                <button onClick={() => setAgeRange(4)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${ageRange === 4 ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >{t(T.homeFilter.age5to8)}</button>
                <button onClick={() => setAgeRange(5)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${ageRange === 5 ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >{t(T.homeFilter.ageOver8)}</button>
              </div>
            </div>

            {/* 排序 */}
            <div className="flex items-center gap-4">
              <span className="text-base font-bold text-gray-700 shrink-0">{t(T.homeFilter.sort)}：</span>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setSortBy("default")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${sortBy === "default" ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >{t(T.homeFilter.sortDefault)}</button>
                <button onClick={() => setSortBy("newest")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${sortBy === "newest" ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >{t(T.homeFilter.sortNewest)}</button>
                <button onClick={() => setSortBy("best")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${sortBy === "best" ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >{t(T.homeFilter.sortBest)}</button>
                <button onClick={() => setSortBy("price_asc")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${sortBy === "price_asc" ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >{t(T.homeFilter.sortPriceAsc)}</button>
                <button onClick={() => setSortBy("price_desc")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${sortBy === "price_desc" ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >{t(T.homeFilter.sortPriceDesc)}</button>
                <button onClick={() => setSortBy("year_desc")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${sortBy === "year_desc" ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >{t(T.homeFilter.sortYearDesc)}</button>
                <button onClick={() => setSortBy("mileage_asc")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${sortBy === "mileage_asc" ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >{t(T.homeFilter.sortMileageAsc)}</button>
              </div>
            </div>
          </div>
        </div>

        {/* 车源列表区域 */}
        <div className="max-w-[1400px] mx-auto px-4 py-6">
          {/* 结果统计 */}
          <div className="mb-6">
            <p className="text-base text-gray-500">
              <span>{t(T.homeFilter.foundTotal)}</span> <span className="font-bold text-gray-900">{filtered.length}</span> {t(T.homeFilter.results)}
            </p>
          </div>

          {/* 车辆卡片列表 */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <div className="text-6xl mb-4">🚗</div>
              <h3 className="text-xl font-bold text-gray-400 mb-2">{t(T.homeFilter.noResult)}</h3>
              <p className="text-base text-gray-400">{t(T.homeFilter.noResultDesc)}</p>
              <a href="/inquiry" className="inline-block mt-4 bg-primary text-white px-6 py-2.5 rounded-xl text-base font-bold hover:bg-primary-dark transition-all">
                {t(T.homeFilter.submitRequest)}
              </a>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map(v => (
                <a
                  key={v.slug}
                  href={`/cars/${v.slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col"
                >
                  {/* 图片 */}
                  <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                    {v.images && v.images[0] ? (
                      <img src={v.images[0]} alt={`${v.brand} ${v.model}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-7xl">🚘</div>
                    )}
                    {/* 标签 */}
                    {v.type && (
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        <span className="px-2 py-0.5 bg-primary/90 text-white text-xs font-medium rounded-md">
                          {t(T.homeFilter.tagVerified)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 信息 */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-base font-bold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors mb-3">
                      {v.brand} {v.model}
                    </h3>

                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-500 mb-4">
                      <span>{v.year}{t(T.homeFilter.yearSuffix)}</span>
                      <span className="text-gray-300">|</span>
                      <span>{v.mileageKm ? `${v.mileageKm.toLocaleString()} km` : '-'}</span>
                      <span className="text-gray-300">|</span>
                      <span>{v.location || 'China'}</span>
                      <span className="text-gray-300">|</span>
                      <span>{v.transmission || '-'}</span>
                    </div>

                    <div className="mt-auto flex items-end justify-between">
                      <div>
                        <span className="text-xl font-extrabold text-red-500">
                          ${v.salePrice.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-400 ml-1">USD</span>
                      </div>
                      <span className="text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        {t(T.homeFilter.viewDetail)}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* 底部CTA */}
          <div className="text-center mt-10">
            <a
              href="/cars"
              className="inline-flex items-center gap-2 bg-white border-2 border-primary text-primary px-8 py-3 rounded-xl text-base font-bold hover:bg-primary hover:text-white transition-all"
            >
              {t(T.homeFilter.viewAll)}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
