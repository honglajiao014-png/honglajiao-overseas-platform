export interface Brand {
  name: string;
  nameEn: string;
  letter: string;
  /** 官方logo图片URL */
  logo: string;
  /** fallback颜色 */
  color: string;
}

// 品牌按字母顺序排列，logo使用本地图片
// 优先 PNG，其次 SVG，都加载失败则 fallback 到品牌色首字母
const B = (name: string, nameEn: string, letter: string, _domain: string, color: string): Brand => ({
  name,
  nameEn,
  letter,
  logo: `/brands/${name}`,
  color,
});

export const BRANDS: Brand[] = [
  // A
  B("奥迪", "Audi", "A", "audi.com", "#000000"),
  // B
  B("宝马", "BMW", "B", "bmw.com", "#0066B1"),
  B("保时捷", "Porsche", "B", "porsche.com", "#B12B28"),
  B("奔驰", "Mercedes-Benz", "B", "mercedes-benz.com", "#000000"),
  B("本田", "Honda", "B", "honda.com", "#CC0000"),
  B("别克", "Buick", "B", "buick.com", "#C8102E"),
  B("比亚迪", "BYD", "B", "byd.com", "#294636"),
  // C
  B("长安", "Changan", "C", "changan.com.cn", "#003DA5"),
  B("长城", "Great Wall", "C", "gwm-global.com", "#CC0000"),
  // D
  B("大众", "Volkswagen", "D", "volkswagen.com", "#00386B"),
  B("东风", "Dongfeng", "D", "dfmc.com.cn", "#C8102E"),
  // F
  B("丰田", "Toyota", "F", "toyota.com", "#EB0A1E"),
  B("福特", "Ford", "F", "ford.com", "#003478"),
  // H
  B("红旗", "Hongqi", "H", "hongqi-auto.com", "#C8102E"),
  // J
  B("吉利", "Geely", "J", "geely.com", "#0066CC"),
  // L
  B("雷克萨斯", "Lexus", "L", "lexus.com", "#333333"),
  B("领克", "Lynk & Co", "L", "lynkco.com", "#000000"),
  B("理想", "Li Auto", "L", "lixiang.com", "#00A870"),
  B("路虎", "Land Rover", "L", "landrover.com", "#0A2E1F"),
  // M
  B("马自达", "Mazda", "M", "mazda.com", "#101010"),
  B("名爵", "MG", "M", "mgmotor.com", "#C41230"),
  // Q
  B("奇瑞", "Chery", "Q", "cheryinternational.com", "#E60012"),
  B("起亚", "Kia", "Q", "kia.com", "#05141F"),
  // R
  B("日产", "Nissan", "R", "nissan-global.com", "#C3002F"),
  B("荣威", "Roewe", "R", "roewe.com.cn", "#C41230"),
  // T
  B("特斯拉", "Tesla", "T", "tesla.com", "#CC0000"),
  // W
  B("蔚来", "NIO", "W", "nio.com", "#000000"),
  B("沃尔沃", "Volvo", "W", "volvocars.com", "#003057"),
  B("五菱", "Wuling", "W", "wuling.com", "#C8102E"),
  // X
  B("现代", "Hyundai", "X", "hyundai.com", "#003469"),
  B("小鹏", "XPeng", "X", "xiaopeng.com", "#005AFF"),
  B("雪佛兰", "Chevrolet", "X", "chevrolet.com", "#CD9834"),
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

export const MILEAGE_RANGES = [
  { label: "不限", min: undefined, max: undefined },
  { label: "1万公里以内", min: 0, max: 1 },
  { label: "1-3万公里", min: 1, max: 3 },
  { label: "3-6万公里", min: 3, max: 6 },
  { label: "6-10万公里", min: 6, max: 10 },
  { label: "10万公里以上", min: 10, max: undefined },
];

export const TRANSMISSION_OPTIONS = [
  "不限", "手动", "自动", "手自一体", "双离合", "CVT无级变速",
];

export const FUEL_OPTIONS = [
  "不限", "汽油", "柴油", "电动", "混动", "插电混动", "CNG", "LPG",
];

export const BODY_TYPES = [
  "不限", "轿车", "SUV", "MPV", "跑车", "皮卡", "三厢车", "两厢车", "旅行车", "客车", "货车",
];

export const VEHICLE_TYPES = [
  "请选择车辆类型",
  "二手乘用车",
  "SUV / 越野车",
  "卡车 / 厢式货车",
  "巴士 / 客车",
  "新能源汽车",
  "摩托车",
  "工程机械",
  "汽车配件",
  "其他",
];
