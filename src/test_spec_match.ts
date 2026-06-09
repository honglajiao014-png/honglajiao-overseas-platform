// 绕过 Prisma Neon adapter，直接用 pg 测试
import { matchSpecs, loadXlsxSpecs } from "@/lib/specMatcher";

async function main() {
  // 测试 XLSX 匹配
  console.log("=== 测试 XLSX 匹配: 标致 408 ===");
  const xlsxResult = await matchSpecs("标致", "408", null);
  if (xlsxResult) {
    const keys = Object.keys(xlsxResult);
    console.log(`✅ XLSX 命中！字段数: ${keys.length}`);
    console.log("前 10 个字段:", keys.slice(0, 10));
    console.log("品牌:", xlsxResult["品牌"]);
    console.log("车系:", xlsxResult["车系"]);
    console.log("车款全称:", xlsxResult["车款全称"]);
  } else {
    console.log("❌ XLSX 也未命中标致 408");
  }

  // 再测几个
  console.log("\n=== 测试 XLSX 匹配: 丰田 卡罗拉 ===");
  const r2 = await matchSpecs("丰田", "卡罗拉", null);
  console.log(r2 ? `✅ 命中，字段数: ${Object.keys(r2).length}` : "❌ 未命中");

  console.log("\n=== 测试 XLSX 匹配: 比亚迪 汉 ===");
  const r3 = await matchSpecs("比亚迪", "汉", null);
  console.log(r3 ? `✅ 命中，字段数: ${Object.keys(r3).length}` : "❌ 未命中");
}

main().catch(e => console.error("FATAL:", e));
