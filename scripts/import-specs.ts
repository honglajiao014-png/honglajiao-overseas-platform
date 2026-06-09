import { prisma } from "@/lib/prisma";

async function main() {
  const XLSX = (await import("xlsx")).default || (await import("xlsx"));
  const path = "/Users/mj/Desktop/全部车型数据_AI增强版.xlsx";

  console.log(`加载 ${path}...`);
  const workbook = XLSX.readFile(path);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, { defval: "" });
  console.log(`读取 ${rows.length} 行`);

  // 去重：按 brand+model 合并，保留最后一条
  const map = new Map<string, { brand: string; model: string; specs: string }>();
  let emptyCount = 0;
  for (const row of rows) {
    const brand = row["品牌"]?.trim() || "";
    const model = row["车系"]?.trim() || "";
    if (!brand || !model) {
      emptyCount++;
      continue;
    }
    const key = `${brand}|||${model}`;
    map.set(key, { brand, model, specs: JSON.stringify(row) });
  }
  console.log(`去重后 ${map.size} 条唯一记录 (跳过空行 ${emptyCount})`);

  const records = Array.from(map.values());
  const BATCH = 500;

  let imported = 0;
  let skipped = 0;

  for (let i = 0; i < records.length; i += BATCH) {
    const batch = records.slice(i, i + BATCH);

    // 先查哪些 brand+model 已存在
    const keys = batch.map(r => ({ brand: r.brand, model: r.model }));
    const existing = await prisma.vehicleSpec.findMany({
      where: { OR: keys },
      select: { id: true, brand: true, model: true },
    });
    const existingSet = new Set(existing.map(e => `${e.brand}|||${e.model}`));

    // 分离新增和更新
    const toCreate = batch.filter(r => !existingSet.has(`${r.brand}|||${r.model}`));
    const toUpdate = batch.filter(r => existingSet.has(`${r.brand}|||${r.model}`));

    // 批量创建
    if (toCreate.length > 0) {
      try {
        await prisma.vehicleSpec.createMany({
          data: toCreate,
          skipDuplicates: true,
        });
        imported += toCreate.length;
      } catch (err: any) {
        console.error(`批量创建失败 (${i}): ${err.message}`);
        skipped += toCreate.length;
      }
    }

    // 逐条更新（Prisma 不支持批量 upsert/updateMany 按复合键）
    for (const r of toUpdate) {
      try {
        await prisma.vehicleSpec.updateMany({
          where: { brand: r.brand, model: r.model },
          data: { specs: r.specs },
        });
        imported++;
      } catch {
        skipped++;
      }
    }

    console.log(`进度: ${Math.min(i + BATCH, records.length)}/${records.length} (已导入 ${imported}, 跳过 ${skipped})`);
  }

  console.log(`完成！导入 ${imported} 条，跳过 ${skipped} 条`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
