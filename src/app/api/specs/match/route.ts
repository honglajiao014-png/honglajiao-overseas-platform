import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ============================================================
// GET /api/specs/match?brand=X&model=Y&displacement=Z&transmission=W
// 公开接口，供国内站调用，按品牌+车系+排量(±0.1L)+变速箱匹配规格
// ============================================================

/** 需要排除的字段名关键词 */
const EXCLUDE_KEYWORDS = [
  "质保",
  "数据版本号",
  "匹配置信度",
  "最后更新时间",
  "补充次数",
  "搜索关键词",
  "生产方式",
];

function shouldExcludeKey(key: string): boolean {
  return EXCLUDE_KEYWORDS.some((kw) => key.includes(kw));
}

function shouldDropValue(val: unknown): boolean {
  if (val === null || val === undefined) return true;
  if (typeof val === "string") {
    const trimmed = val.trim();
    return trimmed === "" || trimmed === "0" || trimmed === "-";
  }
  if (typeof val === "number") return val === 0;
  return false;
}

function formatValue(val: unknown): string {
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (trimmed === "标配") return "●";
    if (trimmed === "选配") return "○";
    return trimmed;
  }
  return String(val);
}

function formatSpecs(raw: Record<string, unknown>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, val] of Object.entries(raw)) {
    if (shouldExcludeKey(key)) continue;
    if (shouldDropValue(val)) continue;
    result[key] = formatValue(val);
  }
  return result;
}

function extractDisplacement(specs: Record<string, unknown>): number | null {
  const candidates = ["排量(L)", "排量", "排量（L）", "发动机排量"];
  for (const key of candidates) {
    const raw = specs[key];
    if (raw !== undefined && raw !== null) {
      const num = typeof raw === "string" ? parseFloat(raw) : Number(raw);
      if (!isNaN(num) && num > 0) return num;
    }
  }
  return null;
}

function extractTransmission(specs: Record<string, unknown>): string | null {
  const candidates = ["变速箱类型", "变速箱", "变速器类型", "变速器"];
  for (const key of candidates) {
    const raw = specs[key];
    if (raw !== undefined && raw !== null) {
      const str = typeof raw === "string" ? raw.trim() : String(raw).trim();
      if (str.length > 0) return str;
    }
  }
  return null;
}

function transmissionMatches(input: string, specValue: string): boolean {
  const a = input.toLowerCase();
  const b = specValue.toLowerCase();
  return a.includes(b) || b.includes(a);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const brand = searchParams.get("brand");
    const model = searchParams.get("model");
    const displacementStr = searchParams.get("displacement");
    const transmission = searchParams.get("transmission");

    if (!brand || !model) {
      return NextResponse.json({ error: "brand and model required" }, { status: 400 });
    }

    const displacement = displacementStr ? parseFloat(displacementStr) : undefined;

    // 1. 查 VehicleSpec 表
    const rows = await prisma.vehicleSpec.findMany({
      where: { brand, model },
      select: { id: true, specs: true },
    });

    if (rows.length === 0) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    // 2. 解析所有行的 specs（specs 列是 JSON 数组 [{中文键:值,...}]）
    const parsed: Array<{ id: string; specs: Record<string, unknown> }> = [];
    for (const row of rows) {
      let specsArr: unknown[];
      if (typeof row.specs === "string") {
        try {
          specsArr = JSON.parse(row.specs);
        } catch {
          continue;
        }
      } else if (Array.isArray(row.specs)) {
        specsArr = row.specs;
      } else {
        continue;
      }

      if (specsArr.length > 0 && typeof specsArr[0] === "object" && specsArr[0] !== null) {
        parsed.push({
          id: row.id,
          specs: specsArr[0] as Record<string, unknown>,
        });
      }
    }

    if (parsed.length === 0) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    // 3. 排量匹配（±0.1L）
    let best: (typeof parsed)[number] | null = null;
    let conflict = false;

    if (displacement !== undefined && !isNaN(displacement) && displacement > 0) {
      let bestDiff = Infinity;
      for (const item of parsed) {
        const specDisp = extractDisplacement(item.specs);
        if (specDisp === null) continue;
        const diff = Math.abs(specDisp - displacement);
        if (diff <= 0.1 && diff < bestDiff) {
          bestDiff = diff;
          best = item;
        }
      }
      if (!best) {
        best = parsed[0];
        conflict = true;
      }
    } else {
      best = parsed[0];
    }

    // 4. 变速箱二次过滤
    if (transmission && best) {
      const specTrans = extractTransmission(best.specs);
      if (specTrans && !transmissionMatches(transmission, specTrans)) {
        conflict = true;
      }
    }

    // 5. 格式化并返回
    const formatted = formatSpecs(best!.specs);

    return NextResponse.json({
      specId: best!.id,
      specsJson: JSON.stringify(formatted),
      conflict,
    });
  } catch (err: any) {
    console.error("[specs/match] Error:", err?.message || err);
    return NextResponse.json({ error: "internal server error" }, { status: 500 });
  }
}
