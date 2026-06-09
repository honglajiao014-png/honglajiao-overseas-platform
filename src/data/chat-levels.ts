// ======================== 客户等级配置 ========================
// L0-L4 五级客户画像，含触发条件和自动动作

export interface CustomerLevel {
  level: number;
  label: string;
  trigger: string;
  autoAction: string;
}

export const CUSTOMER_LEVELS: Record<string, CustomerLevel> = {
  L0_VISITOR: {
    level: 0,
    label: "访客",
    trigger: "打开对话框30秒未说话",
    autoAction: "30秒后发欢迎语",
  },
  L1_LEAD: {
    level: 1,
    label: "潜客",
    trigger: "提到国家/目的港",
    autoAction: "记录国家 + 推送该国车源链接",
  },
  L2_INTERESTED: {
    level: 2,
    label: "意向",
    trigger: "提到车型/价格/数量",
    autoAction: "3分钟未回复自动追问",
  },
  L3_HOT: {
    level: 3,
    label: "高意向",
    trigger: "留邮箱/WhatsApp",
    autoAction: "自动入库 + 邮件通知 + 标记hot",
  },
  L4_ORDER: {
    level: 4,
    label: "准订单",
    trigger: "提订单/合同/定金",
    autoAction: "立即邮件 511972546@qq.com",
  },
};

// 等级对应的前端提示（L3/L4 显示）
export const LEVEL_NOTICE: Record<number, Record<string, string>> = {
  3: {
    en: "✅ We've noted your interest! Our team will contact you shortly at 511972546@qq.com",
    fr: "✅ Nous avons noté votre intérêt ! Notre équipe vous contactera bientôt au 511972546@qq.com",
    ar: "✅ لقد لاحظنا اهتمامك! سيتواصل فريقنا معك قريبًا على 511972546@qq.com",
    zh: "✅ 我们已记录您的意向！团队将很快通过 511972546@qq.com 联系您",
  },
  4: {
    en: "✅ High-priority lead! Our sales manager will reach out to you ASAP at 511972546@qq.com",
    fr: "✅ Prospect prioritaire ! Notre responsable commercial vous contactera dès que possible au 511972546@qq.com",
    ar: "✅ عميل ذو أولوية عالية! سيتواصل مدير المبيعات لدينا معك في أقرب وقت على 511972546@qq.com",
    zh: "✅ 高优先级线索！销售经理将通过 511972546@qq.com 尽快联系您",
  },
};

// ======================== 国家提取 ========================
const COUNTRY_PATTERNS: [string, string[]][] = [
  ["Nigeria", ["nigeria", "lagos", "abuja", "port harcourt"]],
  ["Kenya", ["kenya", "nairobi", "mombasa"]],
  ["Ghana", ["ghana", "accra", "kumasi"]],
  ["Tanzania", ["tanzania", "dar es salaam", "dodoma"]],
  ["Ethiopia", ["ethiopia", "addis ababa"]],
  ["Uganda", ["uganda", "kampala"]],
  ["Rwanda", ["rwanda", "kigali"]],
  ["Congo", ["congo", "kinshasa", "brazzaville"]],
  ["Angola", ["angola", "luanda"]],
  ["Mozambique", ["mozambique", "maputo"]],
  ["Zambia", ["zambia", "lusaka"]],
  ["Zimbabwe", ["zimbabwe", "harare"]],
  ["Senegal", ["senegal", "dakar"]],
  ["Ivory Coast", ["ivory coast", "abidjan"]],
  ["Cameroon", ["cameroon", "douala", "yaounde"]],
  ["Togo", ["togo", "lome"]],
  ["Benin", ["benin", "cotonou"]],
  ["UAE", ["uae", "dubai", "abu dhabi", "sharjah"]],
  ["Saudi Arabia", ["saudi arabia", "saudi", "riyadh", "jeddah"]],
  ["Jordan", ["jordan", "amman"]],
  ["Iraq", ["iraq", "baghdad"]],
  ["Libya", ["libya", "tripoli"]],
];

export function extractCountry(text: string): string | null {
  const lower = text.toLowerCase();
  for (const [country, patterns] of COUNTRY_PATTERNS) {
    if (patterns.some(p => lower.includes(p))) return country;
  }
  return null;
}

// ======================== 车型提取 ========================
const VEHICLE_PATTERNS: [string, string[]][] = [
  ["Toyota Corolla", ["corolla"]],
  ["Toyota RAV4", ["rav4", "rav 4"]],
  ["Toyota Hilux", ["hilux"]],
  ["Toyota Land Cruiser", ["land cruiser", "landcruiser"]],
  ["Toyota Prado", ["prado"]],
  ["Toyota Camry", ["camry"]],
  ["Honda Civic", ["civic"]],
  ["Honda Accord", ["accord"]],
  ["Honda CR-V", ["cr-v", "crv"]],
  ["BMW", ["bmw"]],
  ["Mercedes-Benz", ["mercedes", "benz"]],
  ["Audi", ["audi"]],
  ["Lexus", ["lexus"]],
  ["BYD", ["byd"]],
  ["Tesla", ["tesla"]],
  ["Nissan", ["nissan"]],
  ["Hyundai", ["hyundai"]],
  ["Kia", ["kia"]],
  ["Ford", ["ford"]],
  ["Chevrolet", ["chevrolet"]],
  ["Volkswagen", ["volkswagen", "vw"]],
  ["Mitsubishi", ["mitsubishi"]],
  ["Suzuki", ["suzuki"]],
  ["Range Rover", ["range rover"]],
  ["Porsche", ["porsche"]],
];

export function extractVehicle(text: string): string | null {
  const lower = text.toLowerCase();
  for (const [vehicle, patterns] of VEHICLE_PATTERNS) {
    if (patterns.some(p => lower.includes(p))) return vehicle;
  }
  return null;
}

// ======================== 预算提取 ========================
export function extractBudget(text: string): string | null {
  const lower = text.toLowerCase();
  // 匹配 $X,XXX 或 XXXX USD 等模式
  const priceMatch = lower.match(/\$?\s?(\d{1,3}[,\d]*)\s?(?:usd|dollars?|dollar|us\$)/i);
  if (priceMatch) return priceMatch[0].trim();

  // 匹配 under/below/around XXXX
  const rangeMatch = lower.match(/(?:under|below|around|about|approx)\s+\$?\s?(\d{1,3}[,\d]*)/i);
  if (rangeMatch) return rangeMatch[0].trim();

  // 匹配 budget: XXXX
  const budgetMatch = lower.match(/budget\s*(?:is|:)?\s*\$?\s?(\d{1,3}[,\d]*)/i);
  if (budgetMatch) return budgetMatch[0].trim();

  return null;
}

// ======================== 数量提取 ========================
export function extractQuantity(text: string): number | null {
  const lower = text.toLowerCase();
  // 匹配 "X units" / "X cars" / "X vehicles"
  const unitMatch = lower.match(/(\d+)\s*(?:units?|cars?|vehicles?|pieces?)/i);
  if (unitMatch) return parseInt(unitMatch[1]);

  // 匹配 "quantity: X" / "qty: X"
  const qtyMatch = lower.match(/(?:quantity|qty)\s*(?:is|:)?\s*(\d+)/i);
  if (qtyMatch) return parseInt(qtyMatch[1]);

  // 匹配 "need X" / "want X" / "looking for X" 后面跟数字
  const needMatch = lower.match(/(?:need|want|looking\s+for|order)\s+(\d+)/i);
  if (needMatch) return parseInt(needMatch[1]);

  return null;
}
