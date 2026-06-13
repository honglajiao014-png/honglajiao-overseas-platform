// @ts-nocheck
/**
 * 从 VehicleSpec 表匹配并写入车辆扩展规格参数
 *
 * 用法: DATABASE_URL=postgresql://mj@localhost:5432/hlj_overseas_dev npx tsx scripts/enrich-specs-local.ts
 */

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const OVERSEAS_DB_URL = process.env.DATABASE_URL || "postgresql://mj@localhost:5432/hlj_overseas_dev";

// 字段映射：VehicleSpec specs JSON key → Vehicle 表字段
const SPEC_FIELD_MAP: Record<string, { field: string; type: "int" | "float" | "string" }> = {
  "驱动方式":     { field: "driveType", type: "string" },
  "车门数":       { field: "doorCount", type: "int" },
  "轴距(mm)":     { field: "wheelbase", type: "int" },
  "整备质量(kg)": { field: "curbWeight", type: "int" },
  "工信部综合油耗(L/100km)": { field: "fuelConsumption", type: "float" },
  "最大扭矩(N·m)": { field: "maxTorqueNm", type: "int" },
  "最大马力(Ps)":  { field: "maxHorsepower", type: "int" },
  "油箱容积(L)":  { field: "fuelTankCapacity", type: "int" },
  "燃油标号":     { field: "fuelGrade", type: "string" },
};

async function main() {
  console.log("=== 车辆规格参数填充 ===\n");

  const adapter = new PrismaPg({ connectionString: OVERSEAS_DB_URL });
  const prisma = new PrismaClient({ adapter }) as any;

  // 读取所有有 sourceId 的车辆
  const vehicles = await prisma.vehicle.findMany({
    where: { sourceId: { not: null } },
    select: { id: true, brand: true, model: true, year: true, specId: true, specsJson: true },
  });

  console.log(`📊 待处理车辆: ${vehicles.length} 台`);

  let enriched = 0;
  let skipped = 0;

  for (const v of vehicles) {
    let specs: Record<string, any> | null = null;

    // 优先用已有的 specsJson
    if (v.specsJson) {
      try { specs = JSON.parse(v.specsJson); } catch {}
    }

    // 否则去 VehicleSpec 表匹配
    if (!specs && v.brand && v.model) {
      const match = await prisma.vehicleSpec.findFirst({
        where: { brand: v.brand, model: v.model },
        select: { specs: true, id: true },
      });
      if (match) {
        try { specs = JSON.parse(match.specs); } catch {}
        // 回填 specId
        await prisma.vehicle.update({
          where: { id: v.id },
          data: { specId: match.id, specsJson: match.specs },
        });
      }
    }

    if (!specs) {
      console.log(`⏭️  跳过（无规格）: ${v.brand} ${v.model}`);
      skipped++;
      continue;
    }

    // 提取扩展字段
    const data: Record<string, any> = {};
    for (const [specKey, mapping] of Object.entries(SPEC_FIELD_MAP)) {
      const val = specs[specKey];
      if (val == null || val === "" || val === "-" || val === "0" || val === 0) continue;

      if (mapping.type === "int") {
        data[mapping.field] = parseInt(String(val)) || null;
      } else if (mapping.type === "float") {
        data[mapping.field] = parseFloat(String(val)) || null;
      } else {
        data[mapping.field] = String(val);
      }
    }

    // 座位数
    if (specs["座位数"] && specs["座位数"] !== "0") {
      data.seatCount = parseInt(String(specs["座位数"])) || null;
    }

    // 扩展描述
    if (specs["厂商"]) data.supplier = String(specs["厂商"]);
    if (specs["长度(mm)"] || specs["宽度(mm)"] || specs["高度(mm)"]) {
      data.location = [
        specs["长度(mm)"],
        specs["宽度(mm)"],
        specs["高度(mm)"],
      ].filter(Boolean).join("×") + "mm";
    }

    if (Object.keys(data).length > 0) {
      await prisma.vehicle.update({
        where: { id: v.id },
        data,
      });
      console.log(`✅ 已填充: ${v.brand} ${v.model} (${Object.keys(data).join(", ")})`);
      enriched++;
    } else {
      skipped++;
    }
  }

  console.log(`\n=== 完成 ===`);
  console.log(`填充: ${enriched}  跳过: ${skipped}`);

  await prisma.$disconnect();
}

main().catch(console.error);
