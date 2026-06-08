/**
 * 导入全部车型数据到 VehicleSpec 表
 *
 * 用法: npx tsx scripts/import-car-specs.ts
 *
 * 数据源: ~/Desktop/全部车型数据_AI增强版.xlsx (39,733 条车款, 130 列)
 * 目标: VehicleSpec 表 (brand + series + year + specsJson)
 *
 * 策略:
 *   - 每个车款一行，specsJson 存完整 125 项配置
 *   - 品牌+车系+年款建立索引，供匹配查询
 *   - 跳过无效行（品牌为空）
 */
import { PrismaClient } from "@prisma/client";
import * as XLSX from "xlsx";
import * as path from "path";
import * as os from "os";

const prisma = new PrismaClient();

// Excel → VehicleSpec 字段映射
const SPEC_FIELDS = [
  "品牌", "车系", "车款全称", "厂商", "生产方式", "上市时间", "能源形式",
  "发动机型号", "进气形式", "排量(L)", "气缸排列形式", "气缸数", "每缸气门数",
  "配气机构", "最大马力(Ps)", "最大功率(kW)", "最大功率转速(rpm)",
  "最大扭矩(N·m)", "最大扭矩转速(rpm)", "发动机特有技术", "燃油标号",
  "供油方式", "缸盖材料", "缸体材料", "变速箱类型", "变速箱描述", "挡位个数",
  "车身形式", "车门数", "座位数", "轴距(mm)", "长度(mm)", "宽度(mm)",
  "高度(mm)", "最小离地间隙(mm)", "油箱容积(L)", "行李厢容积(L)",
  "整备质量(kg)", "驱动方式", "前悬架类型", "后悬架类型", "前制动器类型",
  "后制动器类型", "转向助力类型", "车体结构", "驻车制动类型", "前轮胎规格",
  "后轮胎规格", "备胎规格", "整车质保", "工信部综合油耗(L/100km)",
  "驾驶座安全气囊", "副驾驶安全气囊", "前排侧气囊", "后排侧气囊",
  "前排头部气囊", "后排头部气囊", "胎压监测", "安全带未系提示", "ABS防抱死",
  "制动力分配", "刹车辅助", "牵引力控制", "车身稳定控制", "并线辅助",
  "车道偏离预警", "主动刹车", "定速巡航", "自��应巡航", "前雷达", "后雷达",
  "倒车影像", "全景摄像头", "上坡辅助", "自动驻车", "陡坡缓降", "电动天窗",
  "全景天窗", "铝合金轮毂", "发动机电子防盗", "车内中控锁", "遥控钥匙",
  "无钥匙启动", "无钥匙进入", "多功能方向盘", "方向盘换挡", "方向盘加热",
  "行车电脑显示屏", "全液晶仪表盘", "HUD抬头数字显示", "座椅材质",
  "主座椅电动调节", "副座椅电动调节", "前排座椅加热", "后排座椅加热",
  "座椅通风", "座椅按摩", "后排杯架", "GPS导航系统", "中控台彩色大屏",
  "蓝牙/车载电话", "外接音源接口", "CD/DVD", "扬声器数量", "近光灯类型",
  "远光灯类型", "日间行车灯", "自动头灯", "转向头灯", "前雾灯",
  "大灯高度可调", "大灯清洗装置", "电动车窗", "车窗防夹手功能",
  "后视镜电动调节", "后视镜加热", "后视镜折叠", "后视镜记忆",
  "后风挡遮阳帘", "后排侧遮阳帘", "感应雨刷", "自动空调", "后座出风口",
  "温度分区控制", "车内空气调节/花粉过滤",
];

function extractYear(launchDate: any): number | null {
  if (!launchDate) return null;
  const s = String(launchDate);
  // 格式可能是 "2020.10" 或 "2020-06-18" 或 "2020"
  const match = s.match(/^(\d{4})/);
  return match ? parseInt(match[1]) : null;
}

function cleanValue(v: any): any {
  if (v === undefined || v === null) return null;
  if (typeof v === "string" && v.trim() === "") return null;
  // 去掉 ● 后缀
  if (typeof v === "string") return v.replace(/:●$/, "").trim();
  return v;
}

async function main() {
  const filePath = path.join(os.homedir(), "Desktop", "全部车型数据_AI增强版.xlsx");
  console.log(`📂 读取: ${filePath}`);

  const wb = XLSX.readFile(filePath);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });

  if (rows.length < 2) {
    console.error("❌ 文件为空或只有表头");
    process.exit(1);
  }

  const headers = rows[0] as string[];
  console.log(`📊 ${rows.length - 1} 条数据, ${headers.length} 列`);

  // 清空旧数据
  console.log("🗑️  清空 VehicleSpec 表...");
  await prisma.vehicleSpec.deleteMany();

  // 批量插入
  const BATCH_SIZE = 500;
  let total = 0;
  let skipped = 0;
  let batch: any[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const brand = cleanValue(row[0]);
    const series = cleanValue(row[1]);

    if (!brand || !series) {
      skipped++;
      continue;
    }

    const fullName = cleanValue(row[2]);
    const year = extractYear(row[5]);
    const manufacturer = cleanValue(row[3]);
    const energyType = cleanValue(row[6]);
    const displacement = parseFloat(row[9]) || null;
    const transmission = cleanValue(row[24]);
    const bodyStyle = cleanValue(row[27]);
    const seatCount = parseInt(row[29]) || null;

    // 构建完整 specsJson
    const specsObj: Record<string, any> = {};
    for (const field of SPEC_FIELDS) {
      const idx = headers.indexOf(field);
      if (idx >= 0) {
        specsObj[field] = cleanValue(row[idx]);
      }
    }

    batch.push({
      brand,
      series,
      fullName,
      year,
      manufacturer,
      energyType,
      displacement,
      transmission,
      bodyStyle,
      seatCount,
      specsJson: JSON.stringify(specsObj),
    });

    if (batch.length >= BATCH_SIZE) {
      await prisma.vehicleSpec.createMany({ data: batch });
      total += batch.length;
      console.log(`  已导入 ${total} 条...`);
      batch = [];
    }
  }

  // 剩余批次
  if (batch.length > 0) {
    await prisma.vehicleSpec.createMany({ data: batch });
    total += batch.length;
  }

  console.log(`\n✅ 导入完成: ${total} 条, 跳过 ${skipped} 条`);

  // 验证
  const count = await prisma.vehicleSpec.count();
  const brands = await prisma.vehicleSpec.groupBy({ by: ["brand"], _count: true });
  console.log(`📋 数据库共 ${count} 条, ${brands.length} 个品牌`);

  // 测试匹配
  console.log("\n🔍 测试匹配: 标致 标致408 2020");
  const match = await prisma.vehicleSpec.findMany({
    where: { brand: "标致", series: "标致408", year: 2020 },
    select: { fullName: true, displacement: true, transmission: true, seatCount: true },
  });
  console.log(`  命中 ${match.length} 个车款:`);
  for (const m of match) {
    console.log(`    - ${m.fullName} | ${m.displacement}L | ${m.transmission} | ${m.seatCount}座`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
