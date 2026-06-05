"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Vehicle } from "@/data/vehicles-data";
import { useT } from "@/i18n/useT";
import { T } from "@/i18n/translations";

export function CarDetailContent({ vehicle: v }: { vehicle: Vehicle }) {
  const t = useT();
  const [currentIdx, setCurrentIdx] = useState(0);
  const currentImage = v.images[currentIdx] || v.main_image;
  const total = v.images.length;

  const goPrev = useCallback(() => setCurrentIdx(i => (i - 1 + total) % total), [total]);
  const goNext = useCallback(() => setCurrentIdx(i => (i + 1) % total), [total]);
  const goTo = useCallback((i: number) => setCurrentIdx(i), []);

  const specs: [string, string][] = [
    [t(T.vehicles.year), String(v.year)],
    [t(T.vehicles.mileage), `${v.mileage_km.toLocaleString()} km`],
    [t(T.vehicles.fuelType), v.fuel],
    [t(T.vehicles.transmission), v.transmission === "automatic" ? t(T.vehicles.auto) : t(T.vehicles.manual)],
    [t(T.cars.driveSide), v.driving_side],
    [t(T.cars.exterior), v.exterior_color],
    [t(T.cars.interior), v.interior_color],
    [t(T.cars.vin), `***${v.vin_last6}`],
    [t(T.vehicles.location), v.location],
  ];

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-dark border-b border-gray-800">
        <div className="max-w-[1100px] mx-auto px-4 py-3">
          <nav className="flex text-xs text-gray-500 gap-2">
            <Link href="/" className="hover:text-gold">{t(T.misc.backHome)}</Link><span>›</span>
            <Link href="/cars" className="hover:text-gold">{t(T.nav.vehicles)}</Link><span>›</span>
            <span className="text-gray-300">{v.brand} {v.model}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <section className="bg-dark-soft py-8">
        <div className="max-w-[1100px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
            {/* Image Gallery with Navigation */}
            <div>
              <div className="bg-dark rounded-xl overflow-hidden border border-gray-800 mb-3 relative group">
                {currentImage ? (
                  <>
                    <img src={currentImage} alt={`${v.brand} ${v.model}`} className="w-full aspect-[16/10] object-cover" />
                    {/* Prev/Next arrows */}
                    {total > 1 && (
                      <>
                        <button onClick={goPrev}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-opacity opacity-70 group-hover:opacity-100">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>
                        </button>
                        <button onClick={goNext}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-opacity opacity-70 group-hover:opacity-100">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>
                        </button>
                        {/* Counter */}
                        <span className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">{currentIdx + 1} / {total}</span>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full aspect-[16/10] flex items-center justify-center bg-dark-soft">
                    <svg className="w-16 h-16 text-gray-700" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/>
                    </svg>
                  </div>
                )}
              </div>
              {/* Thumbnails */}
              {total > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {v.images.map((img, i) => (
                    <button key={i} onClick={() => goTo(i)}
                      className={`shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        i === currentIdx ? "border-gold" : "border-gray-800 hover:border-gray-600"
                      }`}>
                      <img src={img} alt={`${v.brand} ${v.model} ${i+1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div>
              <div className="bg-dark rounded-xl border border-gray-800 p-6 mb-4 sticky top-4">
                <h1 className="text-xl font-extrabold text-white mb-1">{v.brand} {v.model}</h1>
                <p className="text-xs text-gray-600">{v.brand_cn} {v.model_cn}</p>
                <p className="text-gray-400 text-sm mt-1">{v.year} · {v.mileage_km.toLocaleString()} km</p>

                <div className="mt-4 p-4 bg-brand/10 border border-brand/30 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">{t(T.cars.basePrice)} ({t(T.cars.exWorks)})</p>
                  <p className="text-2xl font-extrabold text-gold">
                    ${v.price_usd.toLocaleString()}
                    <span className="text-sm font-normal text-gray-500 ml-2">{t(T.cars.exportCosts)}</span>
                  </p>
                  <p className="text-xs text-gray-600 mt-1">≈ ¥{v.price_cny.toLocaleString()} CNY</p>
                  <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">
                    {t(T.cars.priceDisclaimer)}
                  </p>
                </div>

                <div className="mt-5 space-y-2">
                  {specs.map(([k, val]) => (
                    <div key={k} className="flex justify-between py-1.5 border-b border-gray-800/50 last:border-0">
                      <span className="text-xs text-gray-500">{k}</span>
                      <span className="text-xs text-gray-200 font-medium">{val}</span>
                    </div>
                  ))}
                </div>

                <Link href={`/inquiry?vehicle=${v.id}`}
                  className="mt-5 w-full block text-center py-3 bg-brand text-white rounded-lg font-bold text-sm hover:bg-brand-dark transition-all">
                  {t(T.cars.inquire)}
                </Link>

                {v.description && v.description !== "无" && (
                  <div className="mt-4 p-4 bg-dark-soft rounded-lg border border-gray-800">
                    <p className="text-xs text-gray-500 mb-2">{t(T.cars.condition)}</p>
                    <p className="text-xs text-gray-300 leading-relaxed">{v.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
