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
import { prisma } from "@/lib/prisma";

// 缓存 xlsx 数据到内存
const XLSX_PATH = process.env.XLSX_PATH || "/Users/mj/Desktop/全部车型数据.xlsx";

// ─── 数据库规格匹配（优先） ───

interface DbSpecMatch {
  specs: string;
  specId: string;
  brand: string;
  model: string;
}

let dbSpecCache: DbSpecMatch[] | null = null;
let dbSpecCacheTime = 0;
const DB_SPEC_CACHE_TTL = 5 * 60 * 1000; // 5分钟

/** 从 VehicleSpec 表加载规格到内存缓存 */
async function loadDbSpecs(): Promise<DbSpecMatch[]> {
  const now = Date.now();
  if (dbSpecCache && now - dbSpecCacheTime < DB_SPEC_CACHE_TTL) return dbSpecCache;

  const specs = await prisma.vehicleSpec.findMany({
    select: { id: true, brand: true, model: true, specs: true },
  });
  dbSpecCache = specs.map(s => ({
    specs: s.specs,
    specId: s.id,
    brand: s.brand,
    model: s.model,
  }));
  dbSpecCacheTime = now;
  console.log(`[SpecMatcher] DB规格缓存刷新: ${dbSpecCache.length} 条`);
  return dbSpecCache;
}

/** 清除数据库规格缓存（新增规格后调用） */
export function clearDbSpecCache() {
  dbSpecCache = null;
  dbSpecCacheTime = 0;
}

/**
 * 从 VehicleSpec 表匹配规格
 * 匹配策略：品牌精确匹配 + 车型精确匹配（忽略空格和大小写）
 * 返回 { specsJson, specId } 或 null
 */
export async function matchSpecsFromDb(
  brand: string,
  model: string,
): Promise<{ specsJson: string; specId: string } | null> {
  const cache = await loadDbSpecs();
  const b = brand.trim().toLowerCase();
  const m = model.trim().toLowerCase();

  // 精确匹配（VehicleSpec 用 model 字段存车系/车型）
  let match = cache.find(s => s.brand.toLowerCase() === b && s.model.toLowerCase() === m);

  // 品牌模糊匹配（中文品牌名 vs 英文品牌名）
  if (!match) {
    // 中文→英文映射
    const brandMap: Record<string, string[]> = {
      '丰田': ['toyota'], '本田': ['honda'], '日产': ['nissan'],
      '奥迪': ['audi'], '宝马': ['bmw'], '奔驰': ['mercedes', 'mercedes-benz'],
      '大众': ['volkswagen', 'vw'], '比亚迪': ['byd'], '特斯拉': ['tesla'],
      '现代': ['hyundai'], '起亚': ['kia'], '福特': ['ford'],
      '别克': ['buick'], '雪佛兰': ['chevrolet'], '马自达': ['mazda'],
      '三菱': ['mitsubishi'], '沃尔沃': ['volvo'], '路虎': ['land rover', 'landrover'],
      '保时捷': ['porsche'], '法拉利': ['ferrari'], '兰博基尼': ['lamborghini'],
      '长城': ['great wall', 'greatwall'], '哈弗': ['haval'],
      '吉利': ['geely'], '长安': ['changan'], '奇瑞': ['chery', 'cherry'],
      '江淮': ['jac'], '福田': ['foton'], '东风': ['dongfeng'],
      '红旗': ['hongqi'], '荣威': ['roewe'], '广汽传祺': ['gac', 'trumpchi'],
      '五菱': ['wuling'], '蔚来': ['nio'], '小鹏': ['xpeng'],
      '理想': ['li auto', 'lixiang'], '极氪': ['zeekr'], '问界': ['aito'],
      '雷克萨斯': ['lexus'], '标致': ['peugeot'], '雪铁龙': ['citroen'],
      '捷豹': ['jaguar'], '路特斯': ['lotus'],
    };

    const enBrands = brandMap[b] || [];
    if (enBrands.length > 0) {
      match = cache.find(s => enBrands.includes(s.brand.toLowerCase()) && s.model.toLowerCase() === m);
    }
    // 反向：数据库中文品牌 vs 输入英文品牌
    if (!match) {
      for (const [cn, ens] of Object.entries(brandMap)) {
        if (ens.includes(b)) {
          match = cache.find(s => s.brand === cn && s.model.toLowerCase() === m);
          if (match) break;
        }
      }
    }
  }

  // 车型模糊匹配（处理国内外命名差异，如 Corolla→卡罗拉, RAV4→RAV4荣放）
  if (!match) {
    match = cache.find(s => {
      const sm = s.model.toLowerCase();
      return s.brand.toLowerCase() === b && (
        sm.includes(m) || m.includes(sm) ||
        sm.replace(/\s+/g, '') === m.replace(/\s+/g, '')
      );
    });
  }

  if (match) {
    return { specsJson: match.specs, specId: match.specId };
  }
  return null;
}

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
