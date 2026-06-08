"use client";

import { useState, useRef, useCallback } from "react";
import {
  FIELD_MAPPING,
  FIELD_GROUPS,
  extractFields,
  type FieldMapping,
} from "@/lib/fieldMapping";

// ===== Types =====

interface MatchedSpec {
  brand: string;
  series: string;
  fullName: string;
  year: number | null;
  vehicleFields: Record<string, any>;
  formFields: Record<string, any>;
  matchedCount: number;
  totalCount: number;
  unmatchedFields: FieldMapping[];
}

interface AutoSpecFillProps {
  /** 当前表单的品牌值 */
  brand: string;
  /** 当前表单的车型值 */
  model: string;
  /** 当前表单的年份值 */
  year: number;
  /** 填充回调：将匹配到的 vehicleFields 和 formFields 传给父组件 */
  onFill: (data: { vehicleFields: Record<string, any>; formFields: Record<string, any> }) => void;
  /** 关闭回调 */
  onClose: () => void;
}

// ===== 品牌中英文映射（用于模糊匹配） =====
const BRAND_ALIASES: Record<string, string[]> = {
  "丰田": ["toyota"], "本田": ["honda"], "日产": ["nissan"],
  "奥迪": ["audi"], "宝马": ["bmw"], "奔驰": ["mercedes", "mercedes-benz", "benz"],
  "大众": ["volkswagen", "vw"], "比亚迪": ["byd"], "特斯拉": ["tesla"],
  "现代": ["hyundai"], "起亚": ["kia"], "福特": ["ford"],
  "别克": ["buick"], "雪佛兰": ["chevrolet", "chevy"], "马自达": ["mazda"],
  "三菱": ["mitsubishi"], "沃尔沃": ["volvo"], "路虎": ["land rover", "landrover"],
  "保时捷": ["porsche"], "法拉利": ["ferrari"], "兰博基尼": ["lamborghini"],
  "长城": ["great wall", "greatwall"], "哈弗": ["haval"],
  "吉利": ["geely"], "长安": ["changan"], "奇瑞": ["chery", "cherry"],
  "江淮": ["jac"], "福田": ["foton"], "东风": ["dongfeng"],
  "红旗": ["hongqi"], "荣威": ["roewe"], "广汽传祺": ["gac", "trumpchi"],
  "五菱": ["wuling"], "蔚来": ["nio"], "小鹏": ["xpeng"],
  "理想": ["li auto", "lixiang"], "极氪": ["zeekr"], "问界": ["aito"],
  "雷克萨斯": ["lexus"], "标致": ["peugeot"], "雪铁龙": ["citroen"],
  "捷豹": ["jaguar"], "路特斯": ["lotus"], "领克": ["lynk", "lynkco"],
  "埃安": ["aion", "gac aion"], "欧拉": ["ora"], "岚图": ["voyah"],
  "阿维塔": ["avatr"], "深蓝": ["deepal"], "方程豹": ["fangchengbao"],
  "仰望": ["yangwang"], "腾势": ["denza"], "极越": ["jiyue"],
  "小米": ["xiaomi"], "智己": ["im motors", "zhiji"],
};

// ===== 网络搜索 URL =====
const SEARCH_SITES = [
  { name: "汽车之家", url: (q: string) => `https://www.autohome.com.cn/grade/carhtml/${encodeURIComponent(q)}.html` },
  { name: "懂车帝", url: (q: string) => `https://www.dongchedi.com/search?keyword=${encodeURIComponent(q)}&type=car` },
  { name: "太平洋汽车", url: (q: string) => `https://price.pcauto.com.cn/sg_search.jsp?keyword=${encodeURIComponent(q)}` },
];

// ===== 主组件 =====
export default function AutoSpecFill({ brand, model, year, onFill, onClose }: AutoSpecFillProps) {
  const [step, setStep] = useState<"select" | "preview" | "noMatch">("select");
  const [matchedSpec, setMatchedSpec] = useState<MatchedSpec | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState(`${brand} ${model}`);
  const [editedFields, setEditedFields] = useState<Record<string, any>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ===== 本地 xlsx 匹配 =====
  const matchFromXlsx = useCallback(async (file: File) => {
    setLoading(true);
    setError("");

    try {
      const XLSX = await import("xlsx");
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, { defval: "" });

      // 三级匹配
      const b = brand.trim().toLowerCase();
      const m = model.trim().toLowerCase();

      // 1. 品牌精确匹配
      let candidates = rows.filter(r => {
        const rb = (r["品牌"] || "").toLowerCase();
        return rb === b || rb.includes(b) || b.includes(rb);
      });

      // 品牌别名匹配
      if (candidates.length === 0) {
        const aliases = BRAND_ALIASES[brand.trim()] || [];
        if (aliases.length > 0) {
          candidates = rows.filter(r => {
            const rb = (r["品牌"] || "").toLowerCase();
            return aliases.some(a => rb.includes(a) || a.includes(rb));
          });
        }
        // 反向：输入英文，匹配中文品牌
        if (candidates.length === 0) {
          for (const [cn, ens] of Object.entries(BRAND_ALIASES)) {
            if (ens.some(e => e === b || b.includes(e))) {
              candidates = rows.filter(r => (r["品牌"] || "").toLowerCase() === cn.toLowerCase());
              if (candidates.length > 0) break;
            }
          }
        }
      }

      if (candidates.length === 0) {
        setStep("noMatch");
        setLoading(false);
        return;
      }

      // 2. 车系精确匹配
      let seriesMatch = candidates.filter(r => {
        const rs = (r["车系"] || "").toLowerCase();
        return rs === m || rs.includes(m) || m.includes(rs) ||
          rs.replace(/\s+/g, "") === m.replace(/\s+/g, "");
      });

      if (seriesMatch.length > 0) {
        candidates = seriesMatch;
      }

      // 3. 年份匹配（从车款全称提取）
      const withYear = candidates.map(r => {
        const fullName = r["车款全称"] || "";
        const ym = fullName.match(/(\d{4})款/);
        return { row: r, year: ym ? parseInt(ym[1]) : null };
      });

      // 按年份接近度排序
      withYear.sort((a, b) => {
        const aDiff = a.year ? Math.abs(a.year - year) : 999;
        const bDiff = b.year ? Math.abs(b.year - year) : 999;
        return aDiff - bDiff;
      });

      const best = withYear[0];
      if (!best) {
        setStep("noMatch");
        setLoading(false);
        return;
      }

      // 提取字段
      const extracted = extractFields(best.row);

      const spec: MatchedSpec = {
        brand: best.row["品牌"] || "",
        series: best.row["车系"] || "",
        fullName: best.row["车款全称"] || "",
        year: best.year,
        ...extracted,
      };

      setMatchedSpec(spec);
      setEditedFields({});
      setStep("preview");
    } catch (e: any) {
      setError(`文件解析失败: ${e.message || "未知错误"}`);
    }
    setLoading(false);
  }, [brand, model, year]);

  // ===== 文件选择处理 =====
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      setError("请选择 .xlsx 或 .xls 文件");
      return;
    }
    matchFromXlsx(file);
  }, [matchFromXlsx]);

  // ===== 确认填充 =====
  const handleConfirm = () => {
    if (!matchedSpec) return;
    const mergedFormFields = { ...matchedSpec.formFields, ...editedFields };
    // 重新计算 vehicleFields（考虑用户编辑）
    const vehicleFields: Record<string, any> = {};
    for (const mapping of FIELD_MAPPING) {
      const val = mergedFormFields[mapping.excelField];
      if (mapping.vehicleField && val !== undefined && val !== null && val !== "" && val !== "-") {
        vehicleFields[mapping.vehicleField] = val;
      }
    }
    onFill({ vehicleFields, formFields: mergedFormFields });
  };

  // ===== 编辑字段 =====
  const handleFieldEdit = (excelField: string, value: any) => {
    setEditedFields(prev => ({ ...prev, [excelField]: value }));
  };

  // ===== 渲染：选择数据源 =====
  if (step === "select") {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">🔍 自动填充配置</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>

        <div className="mb-4 p-3 bg-blue-50 rounded-xl text-sm text-blue-700">
          当前车辆：<strong>{brand} {model} ({year})</strong>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 rounded-xl text-sm text-red-600">{error}</div>
        )}

        <div className="space-y-3">
          {/* 方式1: 加载本地数据文件 */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-accent transition-colors">
            <p className="text-sm font-semibold text-gray-700 mb-2">📂 从本地数据文件匹配</p>
            <p className="text-xs text-gray-400 mb-3">选择桌面上的"全部车型数据.xlsx"</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-bold hover:bg-accent-dark disabled:opacity-50 transition-all"
            >
              {loading ? "匹配中..." : "选择文件并匹配"}
            </button>
          </div>

          {/* 方式2: 网络搜索 */}
          <div className="border border-gray-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">🌐 网络搜索配置</p>
            <p className="text-xs text-gray-400 mb-3">本地无数据时，从汽车网站搜索配置参数</p>
            <div className="flex gap-2">
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                placeholder="搜索关键词"
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {SEARCH_SITES.map(site => (
                <button
                  key={site.name}
                  onClick={() => window.open(site.url(searchQuery), "_blank")}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50 hover:border-accent transition-all"
                >
                  {site.name} →
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">搜索结果需手动对照填入</p>
          </div>
        </div>
      </div>
    );
  }

  // ===== 渲染：预览确认 =====
  if (step === "preview" && matchedSpec) {
    const fieldsByGroup: Record<string, FieldMapping[]> = {};
    for (const m of FIELD_MAPPING) {
      if (!fieldsByGroup[m.group]) fieldsByGroup[m.group] = [];
      fieldsByGroup[m.group].push(m);
    }

    return (
      <div className="bg-white rounded-2xl border border-gray-200 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
          <div>
            <h3 className="text-lg font-bold text-gray-900">✅ 配置匹配成功</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {matchedSpec.fullName} · 匹配 {matchedSpec.matchedCount}/{matchedSpec.totalCount} 项
              {matchedSpec.unmatchedFields.length > 0 && (
                <span className="text-amber-500 ml-2">
                  ⚠️ {matchedSpec.unmatchedFields.length} 项未匹配
                </span>
              )}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>

        {/* Body - 可滚动 */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {FIELD_GROUPS.map(group => {
            const mappings = fieldsByGroup[group.key];
            if (!mappings || mappings.length === 0) return null;

            const groupMatched = mappings.filter(m => {
              const val = editedFields[m.excelField] ?? matchedSpec.formFields[m.excelField];
              return val !== undefined && val !== null && val !== "" && val !== "-";
            });

            return (
              <details key={group.key} open={group.key === "basic" || group.key === "engine"} className="group">
                <summary className="cursor-pointer flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 select-none">
                  <span className="text-base">{group.icon}</span>
                  {group.label}
                  <span className="text-xs text-gray-400 font-normal">
                    ({groupMatched.length}/{mappings.length})
                  </span>
                  <span className="ml-auto text-xs text-gray-300 group-open:rotate-90 transition-transform">▶</span>
                </summary>

                <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                  {mappings.map(mapping => {
                    const rawValue = editedFields[mapping.excelField] ?? matchedSpec.formFields[mapping.excelField];
                    const isEmpty = rawValue === undefined || rawValue === null || rawValue === "" || rawValue === "-";
                    const displayValue = mapping.type === "boolean"
                      ? (rawValue === true || rawValue === "●" ? "✅ 有" : "—")
                      : String(rawValue ?? "");

                    return (
                      <div
                        key={mapping.excelField}
                        className={`rounded-lg border px-3 py-2 text-sm transition-all ${
                          isEmpty
                            ? "border-amber-200 bg-amber-50"
                            : "border-gray-100 bg-gray-50"
                        }`}
                      >
                        <div className="text-xs text-gray-400 mb-0.5">{mapping.label}</div>
                        {isEmpty ? (
                          <input
                            type={mapping.type === "number" ? "number" : "text"}
                            value={editedFields[mapping.excelField] ?? ""}
                            onChange={e => handleFieldEdit(mapping.excelField, mapping.type === "number" ? parseFloat(e.target.value) || "" : e.target.value)}
                            placeholder="需手动填写"
                            className="w-full bg-white border border-amber-300 rounded px-2 py-1 text-xs text-amber-700 placeholder:text-amber-400 focus:outline-none focus:border-accent"
                          />
                        ) : mapping.type === "select" && mapping.options ? (
                          <select
                            value={String(displayValue)}
                            onChange={e => handleFieldEdit(mapping.excelField, e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-xs text-gray-700 focus:outline-none focus:border-accent"
                          >
                            {mapping.options.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <div className="text-gray-700 font-medium truncate" title={displayValue}>
                            {displayValue}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </details>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 shrink-0 bg-gray-50 rounded-b-2xl">
          <div className="text-xs text-gray-400">
            💡 黄色高亮字段需手动填写，其他字段可编辑
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              取消
            </button>
            <button
              onClick={handleConfirm}
              className="px-6 py-2 bg-accent text-white rounded-lg text-sm font-bold hover:bg-accent-dark transition-all"
            >
              确认填充 ({matchedSpec.matchedCount} 项)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===== 渲染：无匹配 =====
  if (step === "noMatch") {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">⚠️ 未找到匹配</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>

        <div className="mb-4 p-4 bg-amber-50 rounded-xl text-sm text-amber-700">
          在本地数据文件中未找到 <strong>{brand} {model} ({year})</strong> 的配置信息。
        </div>

        <p className="text-sm text-gray-600 mb-3">🌐 尝试从以下网站搜索：</p>
        <div className="space-y-2 mb-4">
          {SEARCH_SITES.map(site => (
            <button
              key={site.name}
              onClick={() => window.open(site.url(searchQuery), "_blank")}
              className="block w-full text-left px-4 py-3 border border-gray-200 rounded-xl text-sm hover:bg-gray-50 hover:border-accent transition-all"
            >
              <span className="font-semibold text-gray-700">{site.name}</span>
              <span className="text-gray-400 ml-2">→ 打开新标签页搜索</span>
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setStep("select")}
            className="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            返回
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-accent text-white hover:bg-accent-dark"
          >
            手动填写
          </button>
        </div>
      </div>
    );
  }

  return null;
}
