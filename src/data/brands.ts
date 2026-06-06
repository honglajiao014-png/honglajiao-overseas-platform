export interface Brand {
  name: string;
  logo?: string;
  letter: string;
}

export const BRANDS: Brand[] = [
  { name: "宝马", letter: "B" },
  { name: "奔驰", letter: "B" },
  { name: "奥迪", letter: "A" },
  { name: "大众", letter: "D" },
  { name: "丰田", letter: "F" },
  { name: "本田", letter: "B" },
  { name: "日产", letter: "R" },
  { name: "特斯拉", letter: "T" },
  { name: "比亚迪", letter: "B" },
  { name: "理想", letter: "L" },
  { name: "别克", letter: "B" },
  { name: "雪佛兰", letter: "X" },
  { name: "福特", letter: "F" },
  { name: "现代", letter: "X" },
  { name: "起亚", letter: "Q" },
  { name: "马自达", letter: "M" },
  { name: "雷克萨斯", letter: "L" },
  { name: "沃尔沃", letter: "W" },
  { name: "路虎", letter: "L" },
  { name: "保时捷", letter: "B" },
  { name: "五菱", letter: "W" },
  { name: "长安", letter: "C" },
  { name: "吉利", letter: "J" },
  { name: "长城", letter: "C" },
  { name: "奇瑞", letter: "Q" },
  { name: "传祺", letter: "C" },
  { name: "荣威", letter: "R" },
  { name: "名爵", letter: "M" },
  { name: "领克", letter: "L" },
  { name: "蔚来", letter: "W" },
  { name: "小鹏", letter: "X" },
  { name: "红旗", letter: "H" },
  { name: "捷途", letter: "J" },
  { name: "东风", letter: "D" },
  { name: "江淮", letter: "J" },
  { name: "大通", letter: "D" },
  { name: "福田", letter: "F" },
  { name: "重汽", letter: "Z" },
  { name: "解放", letter: "J" },
  { name: "三一", letter: "S" },
  { name: "徐工", letter: "X" },
  { name: "中联", letter: "Z" },
  { name: "柳工", letter: "L" },
  { name: "厦工", letter: "X" },
  { name: "龙工", letter: "L" },
  { name: "临工", letter: "L" },
  { name: "山河智能", letter: "S" },
  { name: "雷沃", letter: "L" },
  { name: "凯斯", letter: "K" },
  { name: "卡特彼勒", letter: "K" },
  { name: "小松", letter: "X" },
  { name: "日立", letter: "R" },
  { name: "斗山", letter: "D" },
  { name: "现代重工", letter: "X" },
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
