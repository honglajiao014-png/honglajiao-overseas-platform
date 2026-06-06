export interface Brand {
  name: string;
  letter: string;
  /** SVG logo URL or brand color for fallback */
  logo?: string;
  color?: string;
}

// 品牌logo使用品牌官方SVG/PNG，fallback为首字母圆形
// 来源：品牌官网、Wikimedia Commons、SimpleIcons
export const BRANDS: Brand[] = [
  { name: "宝马", letter: "B", color: "#0066B1" },
  { name: "奔驰", letter: "B", color: "#000000" },
  { name: "奥迪", letter: "A", color: "#000000" },
  { name: "大众", letter: "D", color: "#00386B" },
  { name: "丰田", letter: "F", color: "#EB0A1E" },
  { name: "本田", letter: "B", color: "#CC0000" },
  { name: "日产", letter: "R", color: "#C3002F" },
  { name: "特斯拉", letter: "T", color: "#CC0000" },
  { name: "比亚迪", letter: "B", color: "#294636" },
  { name: "理想", letter: "L", color: "#00A870" },
  { name: "别克", letter: "B", color: "#C8102E" },
  { name: "雪佛兰", letter: "X", color: "#CD9834" },
  { name: "福特", letter: "F", color: "#003478" },
  { name: "现代", letter: "X", color: "#003469" },
  { name: "起亚", letter: "Q", color: "#05141F" },
  { name: "马自达", letter: "M", color: "#101010" },
  { name: "雷克萨斯", letter: "L", color: "#333333" },
  { name: "沃尔沃", letter: "W", color: "#003057" },
  { name: "路虎", letter: "L", color: "#0A2E1F" },
  { name: "保时捷", letter: "B", color: "#B12B28" },
  { name: "五菱", letter: "W", color: "#C8102E" },
  { name: "长安", letter: "C", color: "#003DA5" },
  { name: "吉利", letter: "J", color: "#0066CC" },
  { name: "长城", letter: "C", color: "#CC0000" },
  { name: "奇瑞", letter: "Q", color: "#E60012" },
  { name: "传祺", letter: "C", color: "#C8102E" },
  { name: "荣威", letter: "R", color: "#C41230" },
  { name: "名爵", letter: "M", color: "#C41230" },
  { name: "领克", letter: "L", color: "#000000" },
  { name: "蔚来", letter: "W", color: "#000000" },
  { name: "小鹏", letter: "X", color: "#005AFF" },
  { name: "红旗", letter: "H", color: "#C8102E" },
  { name: "捷途", letter: "J", color: "#00A0E9" },
  { name: "东风", letter: "D", color: "#C8102E" },
  { name: "江淮", letter: "J", color: "#003DA5" },
  { name: "大通", letter: "D", color: "#003DA5" },
  { name: "福田", letter: "F", color: "#003DA5" },
  { name: "重汽", letter: "Z", color: "#C8102E" },
  { name: "解放", letter: "J", color: "#003DA5" },
  { name: "三一", letter: "S", color: "#C8102E" },
  { name: "徐工", letter: "X", color: "#E60012" },
  { name: "中联", letter: "Z", color: "#003DA5" },
  { name: "柳工", letter: "L", color: "#F7941D" },
  { name: "厦工", letter: "X", color: "#E60012" },
  { name: "龙工", letter: "L", color: "#003DA5" },
  { name: "临工", letter: "L", color: "#F7941D" },
  { name: "山河智能", letter: "S", color: "#003DA5" },
  { name: "雷沃", letter: "L", color: "#003DA5" },
  { name: "凯斯", letter: "K", color: "#C8102E" },
  { name: "卡特彼勒", letter: "K", color: "#FFC72C" },
  { name: "小松", letter: "X", color: "#003DA5" },
  { name: "日立", letter: "R", color: "#E60012" },
  { name: "斗山", letter: "D", color: "#003DA5" },
  { name: "现代重工", letter: "X", color: "#003469" },
];

export const HOT_BRANDS = BRANDS.slice(0, 10);

export const PRICE_RANGES = [
  { label: "不限", min: undefined, max: undefined },
  { label: "3万以下", min: 0, max: 30000 },
  { label: "3-5万", min: 30000, max: 50000 },
  { label: "5-10万", min: 50000, max: 100000 },
  { label: "10-15万", min: 100000, max: 150000 },
  { label: "15-20万", min: 150000, max: 200000 },
  { label: "20万以上", min: 200000, max: undefined },
];

export const CAR_LEVELS = [
  "不限", "轿车", "SUV", "MPV", "跑车", "皮卡", "三厢车", "两厢车", "旅行车", "客车", "货车",
];

export const AGE_RANGES = [
  { label: "不限", min: undefined, max: undefined },
  { label: "1年内", min: 0, max: 1 },
  { label: "1-3年", min: 1, max: 3 },
  { label: "3-5年", min: 3, max: 5 },
  { label: "5-8年", min: 5, max: 8 },
  { label: "8年以上", min: 8, max: undefined },
];

export const SORT_OPTIONS = [
  { value: "default", label: "默认排序" },
  { value: "newest", label: "最新上架" },
  { value: "best", label: "成色最好" },
  { value: "price_asc", label: "价格从低到高" },
  { value: "price_desc", label: "价格从高到低" },
  { value: "year_desc", label: "车龄从新到旧" },
  { value: "mileage_asc", label: "里程从少到多" },
];
