/**
 * 导入国内站已审核车源数据到海外站
 *
 * 扫描 ~/Desktop/已审核车源/<vehicleId>/
 * 读取 vehicle.json + manifest.json
 * 复制 images/ 到 public/vehicles/<vehicleId>/
 * 生成 src/data/vehicles.ts
 *
 * 用法: npx tsx scripts/import_exported_vehicles.ts
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { execSync } from "node:child_process";

const SOURCE_DIR = path.join(
  process.env.HOME || "~",
  "Desktop/已审核车源"
);
const PUBLIC_IMAGES_DIR = path.join(process.cwd(), "public/vehicles");
const OUTPUT_FILE = path.join(process.cwd(), "src/data/vehicles.ts");

// ---- types ----

interface VehicleJson {
  id: string;
  brand: string;
  model: string;
  year: number;
  mileageKm: number;
  fuelType: string;
  transmission: string;
  steering: string;
  locationProvince?: string | null;
  locationCity?: string | null;
  detailAddress?: string | null;
  bodyStyle?: string;
  condition?: string;
  exteriorColor?: string | null;
  interiorColor?: string | null;
  displacement?: number;
  price?: number;
  currency?: string;
  contact?: {
    phone?: string;
    wechat?: string;
    qq?: string;
    email?: string;
  };
  images?: { fileName: string; angleType: string; isPrimary?: boolean }[];
  policyEligibility?: {
    countryCode: string;
    countryNameEn: string;
    eligible: boolean;
  }[];
}

interface ManifestJson {
  vehicleId: string;
  eligibleCountries?: string[];
}

interface OutputVehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  mileageKm: number;
  fuelType: string;
  transmission: string;
  steering: string;
  location: string;
  bodyStyle: string;
  condition: string;
  publicPriceLabel: string;
  images: string[];
  eligibleCountries: string[];
}

// ---- helpers ----

function fuelTypeLabel(raw: string): string {
  const map: Record<string, string> = {
    PETROL: "Petrol",
    DIESEL: "Diesel",
    ELECTRIC: "Electric",
    HYBRID: "Hybrid",
    PLUGIN_HYBRID: "Plug-in Hybrid",
  };
  return map[raw.toUpperCase()] || raw;
}

function transmissionLabel(raw: string): string {
  const map: Record<string, string> = {
    MANUAL: "Manual",
    AUTOMATIC: "Automatic",
    CVT: "CVT",
    DCT: "DCT",
  };
  return map[raw.toUpperCase()] || raw;
}

function brandLabel(raw: string): string {
  const map: Record<string, string> = {
    "五菱": "Wuling",
    "丰田": "Toyota",
    "比亚迪": "BYD",
    "本田": "Honda",
    "大众": "Volkswagen",
    "现代": "Hyundai",
    "起亚": "Kia",
    "日产": "Nissan",
    "长安": "Changan",
    "吉利": "Geely",
    "豪沃": "HOWO",
    "陕汽": "Shacman",
    "福田": "Foton",
    "东风": "Dongfeng",
    "徐工": "XCMG",
    "三一": "SANY",
    "柳工": "LiuGong",
    "金龙": "King Long",
    "宇通": "Yutong",
    "金杯": "Jinbei",
  };
  return map[raw] || raw;
}

function modelLabel(raw: string): string {
  const map: Record<string, string> = {
    "宏光S": "Hongguang S",
    "卡罗拉": "Corolla",
    "秦Plus": "Qin Plus",
    "宋": "Song",
    "汉": "Han",
    "海鸥": "Seagull",
    "海豚": "Dolphin",
  };
  return map[raw] || raw;
}

function buildLocation(v: VehicleJson): string {
  const parts = [v.locationProvince, v.locationCity].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") + ", China" : "China";
}

// ---- main ----

function main() {
  console.log("=== 海外站车源导入脚本 ===\n");
  console.log(`源目录: ${SOURCE_DIR}`);
  console.log(`图片目标: ${PUBLIC_IMAGES_DIR}`);
  console.log(`输出文件: ${OUTPUT_FILE}\n`);

  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`❌ 源目录不存在: ${SOURCE_DIR}`);
    console.log("将保留现有 mock 数据。");
    process.exit(0);
  }

  const entries = fs.readdirSync(SOURCE_DIR, { withFileTypes: true });
  const vehicleDirs = entries.filter(
    (e) => e.isDirectory() && !e.name.startsWith(".")
  );

  if (vehicleDirs.length === 0) {
    console.log("⚠️  没有找到车源目录，保留现有 mock 数据。");
    process.exit(0);
  }

  console.log(`发现 ${vehicleDirs.length} 个车源目录\n`);

  // 清空图片目标目录
  if (fs.existsSync(PUBLIC_IMAGES_DIR)) {
    fs.rmSync(PUBLIC_IMAGES_DIR, { recursive: true });
  }
  fs.mkdirSync(PUBLIC_IMAGES_DIR, { recursive: true });

  const outputVehicles: OutputVehicle[] = [];
  let totalImagesCopied = 0;

  for (const dir of vehicleDirs) {
    const vehicleDir = path.join(SOURCE_DIR, dir.name);
    const vehicleJsonPath = path.join(vehicleDir, "vehicle.json");
    const manifestJsonPath = path.join(vehicleDir, "manifest.json");
    const imagesDir = path.join(vehicleDir, "images");

    console.log(`--- 处理: ${dir.name} ---`);

    // 读取 vehicle.json
    if (!fs.existsSync(vehicleJsonPath)) {
      console.warn(`⚠️  跳过 ${dir.name}: 缺少 vehicle.json`);
      continue;
    }
    let vehicleData: VehicleJson;
    try {
      vehicleData = JSON.parse(fs.readFileSync(vehicleJsonPath, "utf-8"));
    } catch {
      console.warn(`⚠️  跳过 ${dir.name}: vehicle.json 解析失败`);
      continue;
    }

    // 读取 manifest.json
    let manifestData: ManifestJson | null = null;
    if (fs.existsSync(manifestJsonPath)) {
      try {
        manifestData = JSON.parse(fs.readFileSync(manifestJsonPath, "utf-8"));
      } catch {
        console.warn(`⚠️  ${dir.name}: manifest.json 解析失败，继续处理`);
      }
    } else {
      console.warn(`⚠️  ${dir.name}: 缺少 manifest.json，继续处理`);
    }

    // 复制图片
    const imageFiles: string[] = [];
    if (fs.existsSync(imagesDir)) {
      const destDir = path.join(PUBLIC_IMAGES_DIR, dir.name);
      fs.mkdirSync(destDir, { recursive: true });

      const images = fs.readdirSync(imagesDir);
      for (const img of images) {
        const src = path.join(imagesDir, img);
        const dest = path.join(destDir, img);
        if (fs.statSync(src).isFile()) {
          fs.copyFileSync(src, dest);
          imageFiles.push(`/vehicles/${dir.name}/${img}`);
          totalImagesCopied++;
        }
      }
      console.log(`  复制 ${images.length} 张图片`);
    } else {
      console.warn(`⚠️  ${dir.name}: 缺少 images/ 目录`);
    }

    // 构建输出数据
    const eligibleCountries =
      manifestData?.eligibleCountries ||
      vehicleData.policyEligibility
        ?.filter((p) => p.eligible)
        .map((p) => p.countryCode) ||
      [];

    const output: OutputVehicle = {
      id: vehicleData.id,
      brand: brandLabel(vehicleData.brand),
      model: modelLabel(vehicleData.model),
      year: vehicleData.year,
      mileageKm: vehicleData.mileageKm,
      fuelType: fuelTypeLabel(vehicleData.fuelType),
      transmission: transmissionLabel(vehicleData.transmission),
      steering: vehicleData.steering,
      location: buildLocation(vehicleData),
      bodyStyle: vehicleData.bodyStyle || "",
      condition: vehicleData.condition || "",
      publicPriceLabel: "Contact for price",
      images: imageFiles,
      eligibleCountries,
    };

    outputVehicles.push(output);
    console.log(`  ✓ ${output.brand} ${output.model} (${output.year})`);
  }

  // 生成 vehicles.ts
  const tsContent = `// Auto-generated by scripts/import_exported_vehicles.ts
// DO NOT EDIT MANUALLY
// Generated at: ${new Date().toISOString()}
// Source: ~/Desktop/已审核车源/

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  mileageKm: number;
  fuelType: string;
  transmission: string;
  steering: string;
  location: string;
  bodyStyle: string;
  condition: string;
  publicPriceLabel: string;
  images: string[];
  eligibleCountries: string[];
}

export const vehicles: Vehicle[] = ${JSON.stringify(outputVehicles, null, 2)};

export const filterOptions = {
  vehicleTypes: [
    "All Types",
    "Used Passenger Car",
    "EV / Hybrid Vehicle",
    "Commercial Truck",
    "Bus / Van",
    "Construction Machinery",
  ],
  brands: [
    "All Brands",
    ${[...new Set(outputVehicles.map((v) => v.brand))]
      .map((b) => `"${b}"`)
      .join(",\n    ")}
  ],
  years: [
    "All Years",
    ${[...new Set(outputVehicles.map((v) => String(v.year)))]
      .sort()
      .reverse()
      .map((y) => `"${y}"`)
      .join(",\n    ")}
  ],
  fuelTypes: [
    "All Fuel Types",
    ${[...new Set(outputVehicles.map((v) => v.fuelType))]
      .map((f) => `"${f}"`)
      .join(",\n    ")}
  ],
};
`;

  fs.writeFileSync(OUTPUT_FILE, tsContent, "utf-8");

  console.log(`\n=== 导入完成 ===`);
  console.log(`车辆数: ${outputVehicles.length}`);
  console.log(`图片数: ${totalImagesCopied}`);
  console.log(`输出: ${OUTPUT_FILE}`);
}

main();
