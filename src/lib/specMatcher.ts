/**
 * 从 xlsx 车型规格数据库中按品牌+车系+年份匹配详细规格
 *
 * 数据源: 全部车型数据.xlsx (39,734行 × 125列)
 * 匹配策略:
 *   1. 品牌 精确匹配
 *   2. 车系 精确匹配
 *   3. 年份 从「车款全称」中提取（如"2019款"）
 *   4. 取年份最接近的行
 */

import { openAsBlob } from "fs";

// 缓存 xlsx 数据到内存
const XLSX_PATH = process.env.XLSX_PATH || "/Users/mj/Desktop/全部车型数据.xlsx";

interface SpecRow {
  brand: string;
  series: string;
  fullName: string;
  year: number | null;
  data: Record<string, string>;
}

let specCache: SpecRow[] | null = null;

export async function loadXlsxSpecs(): Promise<SpecRow[]> {
  if (specCache) return specCache;

  console.log(`[SpecMatcher] 加载 xlsx: ${XLSX_PATH}`);
  const startTime = Date.now();

  // Dynamic import of xlsx library
  const XLSX = await import("xlsx");
  const workbook = XLSX.readFile(XLSX_PATH);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, { defval: "" });

  specCache = data.map((row) => {
    // 从车款全称提取年份
    const fullName = row["车款全称"] || "";
    const yearMatch = fullName.match(/(\d{4})款/);
    const year = yearMatch ? parseInt(yearMatch[1]) : null;

    return {
      brand: row["品牌"] || "",
      series: row["车系"] || "",
      fullName,
      year,
      data: row,
    };
  });

  console.log(`[SpecMatcher] 加载完成: ${specCache.length} 条, 耗时 ${Date.now() - startTime}ms`);
  return specCache;
}

/** 匹配规格，返回最匹配行的完整数据，找不到返回 null */
export async function matchSpecs(
  brand: string,
  series: string | null,
  year: number | null,
): Promise<Record<string, string> | null> {
  const cache = await loadXlsxSpecs();

  // Step 1: 按品牌过滤
  const brandMatch = brand.toLowerCase();
  let candidates = cache.filter((r) => r.brand.toLowerCase().includes(brandMatch) || brandMatch.includes(r.brand.toLowerCase()));

  if (candidates.length === 0) {
    // Try fuzzy brand match
    candidates = cache.filter((r) => {
      const b = r.brand.toLowerCase();
      const bm = brandMatch;
      return b.includes(bm) || bm.includes(b) || b.slice(0, 2) === bm.slice(0, 2);
    });
  }

  // Step 2: 按车系过滤
  if (series && candidates.length > 0) {
    const s = series.toLowerCase();
    const seriesMatch = candidates.filter((r) => r.series.toLowerCase().includes(s) || s.includes(r.series.toLowerCase()));
    if (seriesMatch.length > 0) candidates = seriesMatch;
  }

  if (candidates.length === 0) return null;

  // Step 3: 按年份选择最接近的
  if (year && candidates.length > 0) {
    // 找有精确年份匹配的
    const yearMatch = candidates.filter((r) => r.year === year);
    if (yearMatch.length > 0) {
      candidates = yearMatch;
    } else {
      // 找年份最接近的
      candidates.sort((a, b) => {
        const aDiff = a.year ? Math.abs(a.year - year) : Infinity;
        const bDiff = b.year ? Math.abs(b.year - year) : Infinity;
        return aDiff - bDiff;
      });
    }
  }

  // 返回最佳匹配（第一条）
  return candidates[0]?.data || null;
}

/** 从规格数据中提取关键字段用于生成 description */
export function extractKeySpecs(specs: Record<string, string>): string {
  const keyFields = [
    { key: "厂商", label: "Manufacturer" },
    { key: "能源形式", label: "Energy Type" },
    { key: "发动机型号", label: "Engine Model" },
    { key: "进气形式", label: "Aspiration" },
    { key: "排量(L)", label: "Displacement(L)" },
    { key: "最大马力(Ps)", label: "Max Power(HP)" },
    { key: "最大功率(kW)", label: "Max Power(kW)" },
    { key: "最大扭矩(N·m)", label: "Max Torque(N·m)" },
    { key: "变速箱类型", label: "Transmission Type" },
    { key: "挡位个数", label: "Gears" },
    { key: "驱动方式", label: "Drive Type" },
    { key: "车身形式", label: "Body Style" },
    { key: "轴距(mm)", label: "Wheelbase(mm)" },
    { key: "长度(mm)", label: "Length(mm)" },
    { key: "宽度(mm)", label: "Width(mm)" },
    { key: "高度(mm)", label: "Height(mm)" },
    { key: "整备质量(kg)", label: "Curb Weight(kg)" },
    { key: "前悬架类型", label: "Front Suspension" },
    { key: "后悬架类型", label: "Rear Suspension" },
    { key: "前轮胎规格", label: "Front Tire" },
    { key: "后轮胎规格", label: "Rear Tire" },
    { key: "工信部综合油耗(L/100km)", label: "Fuel Consumption(L/100km)" },
  ];

  const parts: string[] = [];
  for (const { key, label } of keyFields) {
    const val = specs[key];
    if (val && val !== "-" && val !== "" && val !== "0") {
      parts.push(`${label}: ${val}`);
    }
  }
  return parts.join("\n");
}
