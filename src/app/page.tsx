"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useT, T } from "@/i18n/useT";
import { HOT_BRANDS, BRANDS, PRICE_RANGES, CAR_LEVELS, AGE_RANGES, SORT_OPTIONS, type Brand } from "@/data/brands";

// 品牌Logo组件 — 加载官方logo图片，失败时fallback到品牌色首字母
function BrandLogo({ brand, size = 20 }: { brand: Brand; size?: number }) {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <span
        className="inline-flex items-center justify-center rounded-full text-[10px] font-bold text-white shrink-0"
        style={{ width: size, height: size, backgroundColor: brand.color }}
      >
        {brand.name.charAt(0)}
      </span>
    );
  }

  return (
    <Image
      src={brand.logo}
      alt={brand.name}
      width={size}
      height={size}
      className="rounded-sm object-contain shrink-0"
      onError={() => setImgError(true)}
      unoptimized
    />
  );
}

// 车源数据（后续可从API获取）
const ALL_VEHICLES = [
  {
    slug: "audiq3-2022-20260603",
    title: "奥迪Q3 2022款 35 TFSI 进取动感型",
    brand: "奥迪",
    year: 2022,
    mileage: "3.8万公里",
    location: "广西柳州",
    transmission: "自动",
    price: 134700,
    image: "/vehicles/audiq3-2022-20260603/front.jpg",
    tags: ["实拍车源", "中国车源"],
    level: "SUV",
    fuel: "汽油",
    createdAt: "2026-06-03",
  },
  {
    slug: "wulinghongguangs3-2018-20260603",
    title: "五菱宏光S3 2018款 1.5L 手动标准型 国V",
    brand: "五菱",
    year: 2018,
    mileage: "7.5万公里",
    location: "柳州",
    transmission: "手动",
    price: 38200,
    image: "/vehicles/wulinghongguangs3-2018-20260603/front.jpg",
    tags: ["实拍车源", "中国车源"],
    level: "SUV",
    fuel: "汽油",
    createdAt: "2026-06-03",
  },
];

export default function Home() {
  const t = useT();

  // 筛选状态
  const [brandFilter, setBrandFilter] = useState<string>("");
  const [priceRange, setPriceRange] = useState<number>(-1);
  const [levelFilter, setLevelFilter] = useState<string>("不限");
  const [ageRange, setAgeRange] = useState<number>(-1);
  const [sortBy, setSortBy] = useState<string>("default");
  const [customMinPrice, setCustomMinPrice] = useState("");
  const [customMaxPrice, setCustomMaxPrice] = useState("");
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // 品牌搜索过滤
  const filteredBrands = useMemo(() => {
    if (!brandSearch.trim()) return BRANDS;
    const q = brandSearch.toLowerCase();
    return BRANDS.filter(b => b.name.toLowerCase().includes(q) || b.letter.toLowerCase().includes(q));
  }, [brandSearch]);

  // 筛选逻辑
  const filtered = useMemo(() => {
    let result = [...ALL_VEHICLES];

    // 品牌筛选
    if (brandFilter) {
      result = result.filter(v => v.brand === brandFilter);
    }

    // 价格筛选
    if (priceRange >= 0 && PRICE_RANGES[priceRange]) {
      const range = PRICE_RANGES[priceRange];
      if (range.min !== undefined) result = result.filter(v => v.price >= range.min!);
      if (range.max !== undefined) result = result.filter(v => v.price <= range.max!);
    }

    // 自定义价格
    if (customMinPrice) result = result.filter(v => v.price >= Number(customMinPrice) * 10000);
    if (customMaxPrice) result = result.filter(v => v.price <= Number(customMaxPrice) * 10000);

    // 级别筛选
    if (levelFilter !== "不限") {
      result = result.filter(v => v.level === levelFilter);
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
      result = result.filter(v => v.title.toLowerCase().includes(q) || v.brand.toLowerCase().includes(q));
    }

    // 排序
    switch (sortBy) {
      case "newest": result.sort((a, b) => b.createdAt.localeCompare(a.createdAt)); break;
      case "price_asc": result.sort((a, b) => a.price - b.price); break;
      case "price_desc": result.sort((a, b) => b.price - a.price); break;
      case "year_desc": result.sort((a, b) => b.year - a.year); break;
      case "mileage_asc": result.sort((a, b) => parseInt(a.mileage) - parseInt(b.mileage)); break;
    }

    return result;
  }, [brandFilter, priceRange, levelFilter, ageRange, sortBy, customMinPrice, customMaxPrice, searchQuery]);

  const displayBrands = showAllBrands ? BRANDS : HOT_BRANDS;

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50">
        {/* 筛选条件区域 */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-[1400px] mx-auto px-4 py-6">
            {/* 品牌筛选 — 官方Logo网格 + 搜索框 */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-bold text-gray-700 shrink-0">品牌：</span>
                {/* 品牌搜索框 */}
                <div className="relative w-56">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={brandSearch}
                    onChange={e => { setBrandSearch(e.target.value); setShowAllBrands(true); }}
                    placeholder="搜索品牌..."
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                {brandSearch && (
                  <span className="text-xs text-gray-400">
                    找到 {filteredBrands.length} 个品牌
                  </span>
                )}
              </div>
              {/* 品牌Logo网格 */}
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => { setBrandFilter(""); setBrandSearch(""); }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    !brandFilter ? "bg-primary text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  不限
                </button>
                {(brandSearch ? filteredBrands : displayBrands).map(b => (
                  <button
                    key={b.name}
                    onClick={() => setBrandFilter(b.name)}
                    className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                      brandFilter === b.name
                        ? "bg-white text-primary ring-2 ring-primary shadow-md scale-105"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:shadow-sm"
                    }`}
                  >
                    {/* 官方Logo图片 + fallback */}
                    <BrandLogo brand={b} size={20} />
                    <span className={brandFilter === b.name ? "font-bold" : ""}>{b.name}</span>
                  </button>
                ))}
                {!brandSearch && (
                  <button
                    onClick={() => setShowAllBrands(!showAllBrands)}
                    className="px-3 py-2 rounded-lg text-xs font-medium text-primary hover:bg-primary-light transition-all"
                  >
                    {showAllBrands ? "收起 ▲" : "展开 ▼"}
                  </button>
                )}
              </div>
            </div>

            {/* 价格筛选 */}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm font-bold text-gray-700 shrink-0">价格：</span>
              <div className="flex flex-wrap gap-2 items-center">
                {PRICE_RANGES.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => setPriceRange(i)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      priceRange === i ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
                <div className="flex items-center gap-1 ml-2">
                  <input
                    type="number"
                    placeholder="最低"
                    value={customMinPrice}
                    onChange={e => { setCustomMinPrice(e.target.value); setPriceRange(-1); }}
                    className="w-16 px-2 py-1.5 border border-gray-200 rounded-lg text-xs text-center"
                  />
                  <span className="text-xs text-gray-400">—</span>
                  <input
                    type="number"
                    placeholder="最高"
                    value={customMaxPrice}
                    onChange={e => { setCustomMaxPrice(e.target.value); setPriceRange(-1); }}
                    className="w-16 px-2 py-1.5 border border-gray-200 rounded-lg text-xs text-center"
                  />
                  <span className="text-xs text-gray-400">万</span>
                </div>
              </div>
            </div>

            {/* 级别筛选 */}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm font-bold text-gray-700 shrink-0">级别：</span>
              <div className="flex flex-wrap gap-2">
                {CAR_LEVELS.map(l => (
                  <button
                    key={l}
                    onClick={() => setLevelFilter(l)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      levelFilter === l ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* 车龄筛选 */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-gray-700 shrink-0">车龄：</span>
              <div className="flex flex-wrap gap-2">
                {AGE_RANGES.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => setAgeRange(i)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      ageRange === i ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 车源列表区域 */}
        <div className="max-w-[1400px] mx-auto px-4 py-6">
          {/* 结果统计 + 排序 */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">
              共找到 <span className="font-bold text-gray-900">{filtered.length}</span> 辆车源
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">排序：</span>
              {SORT_OPTIONS.map(o => (
                <button
                  key={o.value}
                  onClick={() => setSortBy(o.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    sortBy === o.value ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* 车辆卡片列表 */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <div className="text-5xl mb-4">🚗</div>
              <h3 className="text-lg font-bold text-gray-400 mb-2">暂无匹配车源</h3>
              <p className="text-sm text-gray-400">试试调整筛选条件，或提交采购需求让我们帮您找车</p>
              <Link href="/inquiry" prefetch={false} className="inline-block mt-4 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-primary-dark transition-all">
                提交采购需求
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map(v => (
                <Link
                  key={v.slug}
                  href={`/cars/${v.slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300 flex flex-col"
                >
                  {/* 图片 */}
                  <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      🚘
                    </div>
                    {/* 标签 */}
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      {v.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-primary/90 text-white text-[10px] font-medium rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 信息 */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors mb-3">
                      {v.title}
                    </h3>

                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 mb-4">
                      <span>{v.year}年</span>
                      <span className="text-gray-300">|</span>
                      <span>{v.mileage}</span>
                      <span className="text-gray-300">|</span>
                      <span>{v.location}</span>
                      <span className="text-gray-300">|</span>
                      <span>{v.transmission}</span>
                    </div>

                    <div className="mt-auto flex items-end justify-between">
                      <div>
                        <span className="text-lg font-extrabold text-red-500">
                          ¥{v.price.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-400 ml-1">CNY</span>
                      </div>
                      <span className="text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        查看详情 →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* 底部CTA */}
          <div className="text-center mt-10">
            <Link
              href="/cars"
              className="inline-flex items-center gap-2 bg-white border-2 border-primary text-primary px-8 py-3 rounded-xl text-sm font-bold hover:bg-primary hover:text-white transition-all"
            >
              查看全部车源
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
