/**
 * 导入全部车型数据到 Neon PostgreSQL VehicleSpec 表
 *
 * 用法:
 *   npx tsx scripts/import-vehicles.ts --dry-run    # 预览前5行映射
 *   npx tsx scripts/import-vehicles.ts               # 全量导入
 */

import dotenv from "dotenv";
import * as path from "path";

// 加载 .env.local（Neon 数据库连接串），覆盖默认 .env
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
dotenv.config(); // 再加载 .env 兜底

import { PrismaClient } from "@prisma/client";
import { PrismaNeonHttp } from "@prisma/adapter-neon";
import * as XLSX from "xlsx";

const adapter = new PrismaNeonHttp(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

// ─── 配置 ───────────────────────────────────────────────
const XLSX_PATH = "/Users/mj/Desktop/全部车型数据_AI增强版.xlsx";
const SHEET_NAME = "全部车型数据";
const BATCH_SIZE = 500;
const DRY_RUN = process.argv.includes("--dry-run");

// ─── 字段映射：xlsx 列名 → VehicleSpec 字段 ─────────────
// VehicleSpec 核心字段: brand, model, manufacturer, vehicleType, releaseDate, energyType
// 其余全部塞进 specs JSON

const CORE_MAP: Record<string, string> = {
  品牌: "brand",
  车系: "model",
  厂商: "manufacturer",
  车身形式: "vehicleType",
  上市时间: "releaseDate",
  能源形式: "energyType",
};

// 所有列（130列）都会进 specs JSON，核心字段也会保留一份在 specs 里

// ─── 工具函数 ───────────────────────────────────────────
function normalizeValue(v: any): any {
  if (v === undefined || v === null) return null;
  if (typeof v === "string" && v.trim() === "") return null;
  if (typeof v === "number" && isNaN(v)) return null;
  return v;
}

function mapRow(headers: string[], row: any[]) {
  const core: Record<string, any> = {};
  const specs: Record<string, any> = {};

  headers.forEach((col, idx) => {
    const val = normalizeValue(row[idx]);
    const mapped = CORE_MAP[col];
    if (mapped) {
      core[mapped] = val;
    }
    // 所有列都进 specs（用原始中文列名）
    if (val !== null) {
      specs[col] = val;
    }
  });

  return { core, specs };
}

// ─── 主流程 ─────────────────────────────────────────────
async function main() {
  console.log("📖 读取 xlsx 文件...");
  const wb = XLSX.readFile(XLSX_PATH);
  const sheet = wb.Sheets[SHEET_NAME];
  const raw = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
  const headers = raw[0] as string[];
  const rows = raw.slice(1);

  console.log(`   列数: ${headers.length}`);
  console.log(`   数据行数: ${rows.length}`);

  // ── Dry-run: 预览前5行 ──
  if (DRY_RUN) {
    console.log("\n🔍 DRY RUN — 预览前 5 行映射结果:\n");
    for (let i = 0; i < Math.min(5, rows.length); i++) {
      const { core, specs } = mapRow(headers, rows[i]);
      console.log(`─── 行 ${i + 1} ───`);
      console.log("  core:", JSON.stringify(core, null, 2));
      console.log(`  specs: ${Object.keys(specs).length} 个字段`);
      console.log("  specs 前5个 key:", Object.keys(specs).slice(0, 5));
      console.log();
    }

    // 统计唯一 brand+model 数量
    const pairs = new Set<string>();
    for (const row of rows) {
      const { core } = mapRow(headers, row);
      if (core.brand && core.model) {
        pairs.add(`${core.brand}|||${core.model}`);
      }
    }
    console.log(`📊 唯一 (brand, model) 组合: ${pairs.size} / ${rows.length} 行`);
    console.log("\n✅ Dry-run 完成。确认无误后运行: npx tsx scripts/import-vehicles.ts");
    return;
  }

  // ── 全量导入 ──
  console.log("\n🚀 开始全量导入...");

  // 按 (brand, model) 分组，同一车系的多行 specs 合并为数组
  const grouped = new Map<string, { core: Record<string, any>; specsList: Record<string, any>[] }>();
  for (const row of rows) {
    const { core, specs } = mapRow(headers, row);
    if (!core.brand || !core.model) continue;
    const key = `${core.brand}|||${core.model}`;
    if (!grouped.has(key)) {
      grouped.set(key, { core, specsList: [specs] });
    } else {
      grouped.get(key)!.specsList.push(specs);
    }
  }

  console.log(`   去重后 (brand, model): ${grouped.size} 条`);

  const entries = Array.from(grouped.entries());
  let imported = 0;
  let errors = 0;
  const errorSamples: string[] = [];

  // 串行逐条 upsert，避免 Neon HTTP 连接池耗尽
  for (let i = 0; i < entries.length; i++) {
    const [key, { core, specsList }] = entries[i];
    const specsJson = JSON.stringify(specsList.length === 1 ? specsList[0] : specsList);

    try {
      await prisma.vehicleSpec.upsert({
        where: { brand_model: { brand: core.brand, model: core.model } },
        create: {
          brand: core.brand,
          model: core.model,
          manufacturer: core.manufacturer || null,
          vehicleType: core.vehicleType || null,
          releaseDate: core.releaseDate ? String(core.releaseDate) : null,
          energyType: core.energyType || null,
          specs: specsJson,
        },
        update: {
          manufacturer: core.manufacturer || null,
          vehicleType: core.vehicleType || null,
          releaseDate: core.releaseDate ? String(core.releaseDate) : null,
          energyType: core.energyType || null,
          specs: specsJson,
        },
      });
      imported++;
    } catch (e: any) {
      errors++;
      if (errorSamples.length < 10) {
        errorSamples.push(`${core.brand}/${core.model}: ${e.message}`);
      }
    }

    // 每 500 条打印进度
    if ((i + 1) % 500 === 0 || i === entries.length - 1) {
      const pct = (((i + 1) / entries.length) * 100).toFixed(1);
      console.log(`   [${i + 1}/${entries.length}] ${pct}% — ✅ ${imported} ❌ ${errors}`);
    }
  }

  if (errorSamples.length > 0) {
    console.log(`\n⚠️  错误样本 (前10条):`);
    errorSamples.forEach((s) => console.log(`   - ${s}`));
  }

  console.log(`\n🏁 导入完成: ✅ ${imported} 条 | ❌ ${errors} 条`);
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error("💥 致命错误:", e);
  await prisma.$disconnect();
  process.exit(1);
});
