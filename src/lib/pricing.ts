/**
 * 海外站阶梯加价定价模版
 *
 * 底价区间 (USD)      │ 加价率
 * ────────────────────┼────────
 * $0       ~ $5,000   │  45%
 * $5,001   ~ $10,000  │  35%
 * $10,001  ~ $20,000  │  28%
 * $20,001  ~ $50,000  │  22%
 * $50,001  ~ $100,000 │  18%
 * $100,001+           │  15%
 */

export interface PriceResult {
  basePrice: number;      // 底价（USD，整车的裸成本价格）
  markup: number;         // 加价金额
  markupRate: number;     // 加价率（小数，如 0.45）
  salePrice: number;      // 售价 = basePrice × (1 + markupRate)
  profit: number;         // 利润 = markup = salePrice - basePrice
}

const TIERS: [number, number][] = [
  [5000, 0.45],    // $0 ~ $5,000       → 45%
  [10000, 0.35],   // $5,001 ~ $10,000  → 35%
  [20000, 0.28],   // $10,001 ~ $20,000 → 28%
  [50000, 0.22],   // $20,001 ~ $50,000 → 22%
  [100000, 0.18],  // $50,001 ~ $100,000 → 18%
  [Infinity, 0.15],// $100,001+          → 15%
];

export function calcPrice(basePrice: number): PriceResult {
  const rate = TIERS.find(([limit]) => basePrice <= limit)?.[1] ?? 0.15;
  const markup = Math.round(basePrice * rate);
  const salePrice = basePrice + markup;

  return {
    basePrice,
    markup,
    markupRate: rate,
    salePrice,
    profit: markup,
  };
}

/** 格式化 USD 价格显示 */
export function formatUSD(price: number): string {
  return `$${price.toLocaleString("en-US")}`;
}
