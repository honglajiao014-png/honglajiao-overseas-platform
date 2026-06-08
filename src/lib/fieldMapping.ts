/**
 * Excel 车型数据 → Vehicle 表字段 + 上架表单字段 映射配置
 *
 * 数据源: 全部车型数据.xlsx (125 列)
 * 目标: Vehicle 表字段 + 前端表单展示
 *
 * 映射结构:
 *   excelField: Excel 列名（中文）
 *   vehicleField: Vehicle 表字段名（null = 仅表单展示，不存数据库）
 *   label: 表单显示标签
 *   type: 表单输入类型 (text/number/select/boolean)
 *   group: 分组 (basic/engine/drivetrain/body/chassis/safety/comfort/interior/exterior/light)
 *   transform?: 值转换函数（前端执行）
 *   options?: select 类型的选项列表
 */

export type FieldType = "text" | "number" | "select" | "boolean";

export interface FieldMapping {
  excelField: string;
  vehicleField: string | null;
  label: string;
  type: FieldType;
  group: string;
  /** 值转换：Excel 原始值 → 表单/数据库值 */
  transform?: (value: string) => any;
  /** select 类型的选项 */
  options?: string[];
  /** 是否在预览中显示 */
  preview?: boolean;
}

export interface FieldGroup {
  key: string;
  label: string;
  icon: string;
}

export const FIELD_GROUPS: FieldGroup[] = [
  { key: "basic", label: "基本信息", icon: "📋" },
  { key: "engine", label: "发动机/动力", icon: "⚡" },
  { key: "drivetrain", label: "变速箱/驱动", icon: "🔧" },
  { key: "body", label: "车身尺寸", icon: "📐" },
  { key: "chassis", label: "底盘/悬架", icon: "🛞" },
  { key: "safety", label: "安全配置", icon: "🛡️" },
  { key: "comfort", label: "舒适配置", icon: "🛋️" },
  { key: "interior", label: "内饰/座舱", icon: "🎮" },
  { key: "exterior", label: "外部配置", icon: "🚗" },
  { key: "light", label: "灯光配置", icon: "💡" },
];

/**
 * 完整字段映射表
 * 125 个 Excel 列 → Vehicle 字段 + 表单字段
 */
export const FIELD_MAPPING: FieldMapping[] = [
  // ===== 基本信息 =====
  { excelField: "品牌", vehicleField: "brand", label: "品牌", type: "text", group: "basic" },
  { excelField: "车系", vehicleField: "series", label: "车��", type: "text", group: "basic" },
  { excelField: "车款全称", vehicleField: null, label: "车款全称", type: "text", group: "basic" },
  { excelField: "厂商", vehicleField: null, label: "厂商", type: "text", group: "basic" },
  { excelField: "生产方式", vehicleField: null, label: "生产方式", type: "select", group: "basic", options: ["国产", "进口", "合资"] },
  { excelField: "上市时间", vehicleField: null, label: "上市时间", type: "text", group: "basic" },
  { excelField: "能源形式", vehicleField: "fuelType", label: "能源类型", type: "select", group: "basic",
    options: ["汽油", "柴油", "纯电动", "插电式混合动力", "油电混合", "增程式", "氢燃料电池"] },
  { excelField: "整车质保", vehicleField: null, label: "整车质保", type: "text", group: "basic" },

  // ===== 发动机/动力 =====
  { excelField: "发动机型号", vehicleField: "engineModel", label: "发动机型号", type: "text", group: "engine" },
  { excelField: "进气形式", vehicleField: null, label: "进气形式", type: "select", group: "engine",
    options: ["自然吸气", "涡轮增压", "机械增压", "双涡轮增压", "纯电动"] },
  { excelField: "排量(L)", vehicleField: "displacement", label: "排量(L)", type: "number", group: "engine" },
  { excelField: "气缸排列形式", vehicleField: null, label: "气缸排列", type: "select", group: "engine",
    options: ["直列", "V型", "W型", "水平对置", "转子"] },
  { excelField: "气缸数", vehicleField: null, label: "气缸数", type: "number", group: "engine" },
  { excelField: "每缸气门数", vehicleField: null, label: "每缸气门数", type: "number", group: "engine" },
  { excelField: "配气机构", vehicleField: null, label: "配气机构", type: "text", group: "engine" },
  { excelField: "最大马力(Ps)", vehicleField: null, label: "最大马力(Ps)", type: "number", group: "engine" },
  { excelField: "最大功率(kW)", vehicleField: "motorPowerKw", label: "最大功率(kW)", type: "number", group: "engine",
    transform: (v) => parseFloat(v) || null },
  { excelField: "最大功率转速(rpm)", vehicleField: null, label: "最大功率转速(rpm)", type: "text", group: "engine" },
  { excelField: "最大扭矩(N·m)", vehicleField: null, label: "最大扭矩(N·m)", type: "number", group: "engine" },
  { excelField: "最大扭矩转速(rpm)", vehicleField: null, label: "最大扭矩转速(rpm)", type: "text", group: "engine" },
  { excelField: "发动机特有技术", vehicleField: null, label: "发动机特有技术", type: "text", group: "engine" },
  { excelField: "燃油标号", vehicleField: null, label: "燃油标号", type: "select", group: "engine",
    options: ["92#", "95#", "98#", "0#"] },
  { excelField: "供油方式", vehicleField: null, label: "供油方式", type: "select", group: "engine",
    options: ["多点电喷", "直喷", "混合喷射", "缸内直喷"] },
  { excelField: "缸盖材料", vehicleField: null, label: "缸盖材料", type: "text", group: "engine" },
  { excelField: "缸体材料", vehicleField: null, label: "缸体材料", type: "text", group: "engine" },
  { excelField: "工信部综合油耗(L/100km)", vehicleField: null, label: "油耗(L/100km)", type: "number", group: "engine" },

  // ===== 变速箱/驱动 =====
  { excelField: "变速箱类型", vehicleField: "transmission", label: "变速箱类型", type: "select", group: "drivetrain",
    options: ["手动", "自动", "CVT无级变速", "双离合", "手自一体", "固定齿比"] },
  { excelField: "变速箱描述", vehicleField: null, label: "变速箱描述", type: "text", group: "drivetrain" },
  { excelField: "挡位个数", vehicleField: null, label: "挡位数", type: "number", group: "drivetrain" },
  { excelField: "驱动方式", vehicleField: null, label: "驱动方式", type: "select", group: "drivetrain",
    options: ["前置前驱", "前置后驱", "前置四驱", "中置后驱", "后置后驱", "双电机四驱", "三电机四驱", "四电机四驱"] },

  // ===== 车身尺寸 =====
  { excelField: "车身形式", vehicleField: "bodyStyle", label: "车身形式", type: "select", group: "body",
    options: ["轿车", "SUV", "MPV", "跑车", "皮卡", "微面", "轻客", "卡车", "客车", "旅行车", "掀背车", "敞篷车"] },
  { excelField: "车门数", vehicleField: null, label: "车门数", type: "number", group: "body" },
  { excelField: "座位数", vehicleField: "seatCount", label: "座位数", type: "number", group: "body",
    transform: (v) => parseInt(v) || null },
  { excelField: "轴距(mm)", vehicleField: null, label: "轴距(mm)", type: "number", group: "body" },
  { excelField: "长度(mm)", vehicleField: "vehicleLengthM", label: "车长(mm)", type: "number", group: "body",
    transform: (v) => { const n = parseFloat(v); return n ? n / 1000 : null; } },
  { excelField: "宽度(mm)", vehicleField: null, label: "车宽(mm)", type: "number", group: "body" },
  { excelField: "高度(mm)", vehicleField: null, label: "车高(mm)", type: "number", group: "body" },
  { excelField: "最小离地间隙(mm)", vehicleField: null, label: "离地间隙(mm)", type: "number", group: "body" },
  { excelField: "油箱容积(L)", vehicleField: null, label: "油箱容积(L)", type: "number", group: "body" },
  { excelField: "行李厢容积(L)", vehicleField: null, label: "行李厢容积(L)", type: "text", group: "body" },
  { excelField: "整备质量(kg)", vehicleField: null, label: "整备质量(kg)", type: "number", group: "body" },

  // ===== 底盘/悬架 =====
  { excelField: "前悬架类型", vehicleField: null, label: "前悬架类型", type: "text", group: "chassis" },
  { excelField: "后悬架类型", vehicleField: null, label: "后悬架类型", type: "text", group: "chassis" },
  { excelField: "前制动器类型", vehicleField: null, label: "前制动器", type: "text", group: "chassis" },
  { excelField: "后制动器类型", vehicleField: null, label: "后制动器", type: "text", group: "chassis" },
  { excelField: "转向助力类型", vehicleField: null, label: "转向助力", type: "text", group: "chassis" },
  { excelField: "车体结构", vehicleField: null, label: "车体结构", type: "text", group: "chassis" },
  { excelField: "驻车制动类型", vehicleField: null, label: "驻车制动", type: "text", group: "chassis" },
  { excelField: "前轮胎规格", vehicleField: null, label: "前轮胎规格", type: "text", group: "chassis" },
  { excelField: "后轮胎规格", vehicleField: null, label: "后轮胎规格", type: "text", group: "chassis" },
  { excelField: "备胎规格", vehicleField: null, label: "备胎规格", type: "text", group: "chassis" },

  // ===== 安全配置 =====
  { excelField: "驾驶座安全气囊", vehicleField: null, label: "主驾安全气囊", type: "boolean", group: "safety" },
  { excelField: "副驾驶安全气囊", vehicleField: null, label: "副驾安全气囊", type: "boolean", group: "safety" },
  { excelField: "前排侧气囊", vehicleField: null, label: "前排侧气囊", type: "boolean", group: "safety" },
  { excelField: "后排侧气囊", vehicleField: null, label: "后排侧气囊", type: "boolean", group: "safety" },
  { excelField: "前排头部气囊", vehicleField: null, label: "前排头部气囊", type: "boolean", group: "safety" },
  { excelField: "后排头部气囊", vehicleField: null, label: "后排头部气囊", type: "boolean", group: "safety" },
  { excelField: "胎压监测", vehicleField: null, label: "胎压监测", type: "boolean", group: "safety" },
  { excelField: "安全带未系提示", vehicleField: null, label: "安全带未系提示", type: "boolean", group: "safety" },
  { excelField: "ABS防抱死", vehicleField: null, label: "ABS防抱死", type: "boolean", group: "safety" },
  { excelField: "制动力分配", vehicleField: null, label: "制动力分配(EBD)", type: "boolean", group: "safety" },
  { excelField: "刹车辅助", vehicleField: null, label: "刹车辅助(EBA)", type: "boolean", group: "safety" },
  { excelField: "牵引力控制", vehicleField: null, label: "牵引力控制(TCS)", type: "boolean", group: "safety" },
  { excelField: "车身稳定控制", vehicleField: null, label: "车身稳定控制(ESP)", type: "boolean", group: "safety" },
  { excelField: "并线辅助", vehicleField: null, label: "并线辅助", type: "boolean", group: "safety" },
  { excelField: "车道偏离预警", vehicleField: null, label: "车道偏离预警", type: "boolean", group: "safety" },
  { excelField: "主动刹车", vehicleField: null, label: "主动刹车(AEB)", type: "boolean", group: "safety" },

  // ===== 舒适配置 =====
  { excelField: "定速巡航", vehicleField: null, label: "定速巡航", type: "boolean", group: "comfort" },
  { excelField: "自适应巡航", vehicleField: null, label: "自���应巡航(ACC)", type: "boolean", group: "comfort" },
  { excelField: "前雷达", vehicleField: null, label: "前雷达", type: "boolean", group: "comfort" },
  { excelField: "后雷达", vehicleField: null, label: "后雷达", type: "boolean", group: "comfort" },
  { excelField: "倒车影像", vehicleField: null, label: "倒车影像", type: "boolean", group: "comfort" },
  { excelField: "全景摄像头", vehicleField: null, label: "全景摄像头", type: "boolean", group: "comfort" },
  { excelField: "上坡辅助", vehicleField: null, label: "上坡辅助", type: "boolean", group: "comfort" },
  { excelField: "自动驻车", vehicleField: null, label: "自动驻车", type: "boolean", group: "comfort" },
  { excelField: "陡坡缓降", vehicleField: null, label: "陡坡缓降", type: "boolean", group: "comfort" },
  { excelField: "电动天窗", vehicleField: null, label: "电动天窗", type: "boolean", group: "comfort" },
  { excelField: "全景天窗", vehicleField: null, label: "全景天窗", type: "boolean", group: "comfort" },
  { excelField: "铝合金轮毂", vehicleField: null, label: "铝合金轮毂", type: "boolean", group: "comfort" },
  { excelField: "发动机电子防盗", vehicleField: null, label: "发动机电子防盗", type: "boolean", group: "comfort" },
  { excelField: "车内中控锁", vehicleField: null, label: "车内中控锁", type: "boolean", group: "comfort" },
  { excelField: "遥控钥匙", vehicleField: null, label: "遥控钥匙", type: "boolean", group: "comfort" },
  { excelField: "无钥匙启动", vehicleField: null, label: "无钥匙启动", type: "boolean", group: "comfort" },
  { excelField: "无钥匙进入", vehicleField: null, label: "无钥匙进入", type: "boolean", group: "comfort" },

  // ===== 内饰/座舱 =====
  { excelField: "多功能方向盘", vehicleField: null, label: "多功能方向盘", type: "boolean", group: "interior" },
  { excelField: "方向盘换挡", vehicleField: null, label: "方向盘换挡", type: "boolean", group: "interior" },
  { excelField: "方向盘加热", vehicleField: null, label: "方向盘加热", type: "boolean", group: "interior" },
  { excelField: "行车电脑显示屏", vehicleField: null, label: "行车电脑显示屏", type: "boolean", group: "interior" },
  { excelField: "全液晶仪表盘", vehicleField: null, label: "全液晶仪表盘", type: "boolean", group: "interior" },
  { excelField: "HUD抬头数字显示", vehicleField: null, label: "HUD抬头显示", type: "boolean", group: "interior" },
  { excelField: "座椅材质", vehicleField: null, label: "座椅材质", type: "select", group: "interior",
    options: ["织物", "仿皮", "真皮", "皮/织物混搭", "Alcantara", "Nappa真皮"] },
  { excelField: "主座椅电动调节", vehicleField: null, label: "主驾电动调节", type: "boolean", group: "interior" },
  { excelField: "副座椅电动调节", vehicleField: null, label: "副驾电动调节", type: "boolean", group: "interior" },
  { excelField: "前排座椅加热", vehicleField: null, label: "前排座椅加热", type: "boolean", group: "interior" },
  { excelField: "后排座椅加热", vehicleField: null, label: "后排座椅加热", type: "boolean", group: "interior" },
  { excelField: "座椅通风", vehicleField: null, label: "座椅通风", type: "boolean", group: "interior" },
  { excelField: "座椅按摩", vehicleField: null, label: "座椅按摩", type: "boolean", group: "interior" },
  { excelField: "后排杯架", vehicleField: null, label: "后排杯架", type: "boolean", group: "interior" },
  { excelField: "GPS导航系统", vehicleField: null, label: "GPS导航", type: "boolean", group: "interior" },
  { excelField: "中控台彩色大屏", vehicleField: null, label: "中控大屏", type: "boolean", group: "interior" },
  { excelField: "蓝牙/车载电话", vehicleField: null, label: "蓝牙/车载电话", type: "boolean", group: "interior" },
  { excelField: "外接音源接口", vehicleField: null, label: "外接音源接口", type: "text", group: "interior" },
  { excelField: "CD/DVD", vehicleField: null, label: "CD/DVD", type: "text", group: "interior" },
  { excelField: "扬声器数量", vehicleField: null, label: "扬声器数量", type: "text", group: "interior" },

  // ===== 外部配置 =====
  { excelField: "电动车窗", vehicleField: null, label: "电动车窗", type: "boolean", group: "exterior" },
  { excelField: "车窗防夹手功能", vehicleField: null, label: "车窗防夹手", type: "boolean", group: "exterior" },
  { excelField: "后视镜电动调节", vehicleField: null, label: "后视镜电动调节", type: "boolean", group: "exterior" },
  { excelField: "后视镜���热", vehicleField: null, label: "后视镜加热", type: "boolean", group: "exterior" },
  { excelField: "后视镜折叠", vehicleField: null, label: "后视镜折叠", type: "boolean", group: "exterior" },
  { excelField: "后视镜记忆", vehicleField: null, label: "后视镜记忆", type: "boolean", group: "exterior" },
  { excelField: "后风挡遮阳帘", vehicleField: null, label: "后风挡遮阳帘", type: "boolean", group: "exterior" },
  { excelField: "后排侧遮阳帘", vehicleField: null, label: "后排侧遮阳帘", type: "boolean", group: "exterior" },
  { excelField: "感应雨刷", vehicleField: null, label: "感应雨刷", type: "boolean", group: "exterior" },

  // ===== 灯光配置 =====
  { excelField: "近光灯类型", vehicleField: null, label: "近光灯", type: "select", group: "light",
    options: ["卤素", "氙气", "LED", "激光"] },
  { excelField: "远光灯类型", vehicleField: null, label: "远光灯", type: "select", group: "light",
    options: ["卤素", "氙气", "LED", "激光"] },
  { excelField: "日间行车灯", vehicleField: null, label: "日间行车灯", type: "boolean", group: "light" },
  { excelField: "自动头灯", vehicleField: null, label: "自动头灯", type: "boolean", group: "light" },
  { excelField: "转向头灯", vehicleField: null, label: "转向头灯", type: "boolean", group: "light" },
  { excelField: "前雾灯", vehicleField: null, label: "前雾灯", type: "boolean", group: "light" },
  { excelField: "大灯高度可调", vehicleField: null, label: "大灯高度可调", type: "boolean", group: "light" },
  { excelField: "大灯清洗装置", vehicleField: null, label: "大灯清洗", type: "boolean", group: "light" },

  // ===== 空调 =====
  { excelField: "自动空调", vehicleField: null, label: "自动空调", type: "boolean", group: "comfort" },
  { excelField: "后座出风口", vehicleField: null, label: "后座出风口", type: "boolean", group: "comfort" },
  { excelField: "温度分区控制", vehicleField: null, label: "温度分区控制", type: "boolean", group: "comfort" },
  { excelField: "车内空气调节/花粉过滤", vehicleField: null, label: "空气净化/花粉过滤", type: "boolean", group: "comfort" },
];

/**
 * 从 Excel 行数据中提取匹配到的字段值
 * @param excelRow Excel 行数据（key 为中文列名）
 * @returns { vehicleFields: 可直接写入 Vehicle 表的字段, formFields: 所有表单字段 }
 */
export function extractFields(excelRow: Record<string, string>): {
  vehicleFields: Record<string, any>;
  formFields: Record<string, any>;
  matchedCount: number;
  totalCount: number;
  unmatchedFields: FieldMapping[];
} {
  const vehicleFields: Record<string, any> = {};
  const formFields: Record<string, any> = {};
  const unmatchedFields: FieldMapping[] = [];

  for (const mapping of FIELD_MAPPING) {
    const rawValue = excelRow[mapping.excelField];
    const isEmpty = rawValue === undefined || rawValue === null || rawValue === "" || rawValue === "-";

    if (isEmpty) {
      unmatchedFields.push(mapping);
      continue;
    }

    let value: any = rawValue;

    // 应用转换函数
    if (mapping.transform) {
      try {
        value = mapping.transform(rawValue);
      } catch {
        value = rawValue;
      }
    }

    // boolean 类型转换
    if (mapping.type === "boolean") {
      const v = String(rawValue).trim();
      value = v === "●" || v === "有" || v === "是" || v === "标配" || v === "✓" || v === "true" || v === "1";
    }

    formFields[mapping.excelField] = value;

    // 有对应 Vehicle 字段的才写入
    if (mapping.vehicleField) {
      vehicleFields[mapping.vehicleField] = value;
    }
  }

  return {
    vehicleFields,
    formFields,
    matchedCount: FIELD_MAPPING.length - unmatchedFields.length,
    totalCount: FIELD_MAPPING.length,
    unmatchedFields,
  };
}

/**
 * 获取所有会写入 Vehicle 表的字段映射
 */
export function getVehicleFieldMappings(): FieldMapping[] {
  return FIELD_MAPPING.filter(m => m.vehicleField !== null);
}

/**
 * 按分组获取字段映射
 */
export function getFieldsByGroup(): Record<string, FieldMapping[]> {
  const groups: Record<string, FieldMapping[]> = {};
  for (const m of FIELD_MAPPING) {
    if (!groups[m.group]) groups[m.group] = [];
    groups[m.group].push(m);
  }
  return groups;
}
