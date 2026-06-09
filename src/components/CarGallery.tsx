"use client";

import { useState, useCallback } from "react";

interface CarGalleryProps {
  images: string[];
  brand: string;
  model: string;
}

export function CarGallery({ images, brand, model }: CarGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set());

  const hasImages = images && images.length > 0;
  const total = hasImages ? images.length : 0;
  const isSingle = total <= 1;

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i === 0 ? total - 1 : i - 1));
  }, [total]);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i === total - 1 ? 0 : i + 1));
  }, [total]);

  const handleImgError = useCallback((index: number) => {
    setImgErrors((prev) => new Set(prev).add(index));
  }, []);

  // 无图片：占位符
  if (!hasImages) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="aspect-[4/3] flex items-center justify-center text-8xl bg-gray-100">
          🚗
        </div>
      </div>
    );
  }

  const currentSrc = images[activeIndex];
  const currentErrored = imgErrors.has(activeIndex);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* 大图区域 */}
      <div className="relative bg-gray-100 aspect-[4/3] group">
        {currentErrored ? (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            🚗
          </div>
        ) : (
          <img
            src={currentSrc}
            alt={`${brand} ${model} - ${activeIndex + 1}`}
            className="w-full h-full object-cover"
            onError={() => handleImgError(activeIndex)}
          />
        )}

        {/* 左右翻页箭头（多于1张时显示） */}
        {!isSingle && (
          <>
            <button
              onClick={goPrev}
              aria-label="上一张"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={goNext}
              aria-label="下一张"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {/* 图片计数器 */}
        {!isSingle && (
          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            {activeIndex + 1} / {total}
          </div>
        )}
      </div>

      {/* 缩略图区域（多于1张时显示） */}
      {!isSingle && (
        <div className="flex gap-2 p-3 overflow-x-auto">
          {images.map((src, i) => {
            const isActive = i === activeIndex;
            const errored = imgErrors.has(i);
            return (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  isActive
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-gray-200 opacity-70 hover:opacity-100"
                }`}
              >
                {errored ? (
                  <div className="w-full h-full flex items-center justify-center text-2xl bg-gray-100">
                    🚗
                  </div>
                ) : (
                  <img
                    src={src}
                    alt={`${brand} ${model} - ${i + 1}`}
                    className="w-full h-full object-cover"
                    onError={() => handleImgError(i)}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
