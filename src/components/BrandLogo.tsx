"use client";

import { useState } from "react";
import type { Brand } from "@/data/brands";

/**
 * 品牌 Logo 组件
 * 加载顺序: PNG → SVG → 品牌色首字母 fallback
 * 默认尺寸 36px，适合品牌筛选网格展示
 */
export function BrandLogo({ brand, size = 36 }: { brand: Brand; size?: number }) {
  const [ext, setExt] = useState<"png" | "svg" | "fallback">("png");

  if (ext === "fallback") {
    return (
      <span
        className="inline-flex items-center justify-center rounded-lg text-white font-bold shrink-0 select-none"
        style={{
          width: size,
          height: size,
          backgroundColor: brand.color,
          fontSize: size * 0.45,
        }}
      >
        {brand.name.charAt(0)}
      </span>
    );
  }

  return (
    <img
      src={`${brand.logo}.${ext}`}
      alt={brand.name}
      width={size}
      height={size}
      className="object-contain shrink-0 select-none"
      style={{ minWidth: size, minHeight: size }}
      onError={() => {
        if (ext === "png") {
          setExt("svg");
        } else {
          setExt("fallback");
        }
      }}
    />
  );
}
