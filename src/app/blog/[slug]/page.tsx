import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";

const posts: Record<string, any> = {
  "china-used-car-export-guide": {
    title: "China Used Car Export Guide 2026: Complete Step-by-Step",
    date: "2026-05-28",
    category: "市场指南",
    body: `中国二手车出口市场在2026年持续快速增长。本指南将帮助国际买家了解从中国采购二手车的完整流程。

## 第一步：确定需求

明确您需要的车型、年份、预算范围。中国二手车市场品牌众多，从经济型到豪华品牌应有尽有。

## 第二步：寻找可靠车源

通过专业采购平台（如 ChinaCarExport）寻找经过验证的车源。我们提供实车照片、检测报告和车辆历史记录。

## 第三步：车辆检测

在付款前，安排第三方检测机构进行实车检查。ChinaCarExport 提供200+项检测服务。

## 第四步：出口手续

包括车辆过户、出口许可证、海关申报等。我们协助办理全套出口手续。

## 第五步：物流运输

根据目的国选择海运或陆运。主要出口港口：天津、上海、广州、深圳。

## 第六步：目的国清关

了解目的国的进口关税、排放标准和注册要求。`,
  },
  "how-to-import-from-china-to-kazakhstan": {
    title: "How to Import Used Cars from China to Kazakhstan (2026)",
    date: "2026-05-25",
    category: "区域指南",
    body: `哈萨克斯坦是中国二手车出口的重要市场之一。本文详细介绍进口流程和注意事项。

## 关税政策

哈萨克斯坦对进口二手车征收关税，税率根据车辆年龄和排量而定。

## 运输路线

主要路线：霍尔果斯口岸陆运，或通过连云港-阿克套海运。

## 所需文件

- 原始车辆登记证
- 商业发票
- 装箱单
- 出口许可证
- 原产地证明`,
  },
  "best-used-cars-china-for-central-asia": {
    title: "Best Used Cars from China for Central Asia Markets (2026)",
    date: "2026-05-22",
    category: "市场分析",
    body: `中亚市场对中国二手车的需求持续增长。以下是2026年最受欢迎的车型分析。

## 经济型轿车

五菱、长安、吉利等品牌因价格实惠、配件充足而广受欢迎。

## SUV车型

哈弗、比亚迪、奇瑞SUV在中亚市场表现优异，适合当地路况。

## 商用车

东风、解放卡车，金龙客车在中亚基建项目中有大量需求。`,
  },
  "china-ev-export-sourcing-guide": {
    title: "China EV Export Sourcing Guide: BYD, NIO, Xpeng & More (2026)",
    date: "2026-05-20",
    category: "新能源车",
    body: `中国新能源汽车出口量在2026年继续领跑全球。本指南帮助您采购中国电动汽车。

## 热销品牌

- **比亚迪 (BYD)**: 全球最大的新能源车制造商，产品线覆盖乘用车到商用车
- **蔚来 (NIO)**: 高端智能电动汽车，电池换电技术领先
- **小鹏 (Xpeng)**: 智能驾驶技术突出，性价比高

## 出口注意事项

电动车出口需要特别关注电池运输规定、充电标准差异和目的地国家的新能源政策。`,
  },
  "commercial-vehicle-sourcing-from-china": {
    title: "Commercial Vehicle Sourcing from China: Trucks, Vans & Buses",
    date: "2026-05-18",
    category: "商用车",
    body: `中国是全球最大的商用车生产国。本指南介绍如何从中国采购卡车、厢式货车和大巴。

## 卡车品类

- 轻型卡车 (3.5-6吨)
- 中型卡车 (6-14吨)
- 重型卡车 (14吨以上)
- 牵引车

## 主要品牌

一汽解放、东风、中国重汽、陕汽、福田等品牌在海外市场享有良好口碑。

## 采购建议

商用车采购需重点关注排放标准（欧III/IV/V）、载重吨位和使用场景。`,
  },
};

export async function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts[slug];

  if (!post) {
    return (
      <>
        <Header />
        <main className="max-w-[1600px] mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-guazi-dark">文章未找到</h1>
          <Link href="/blog" className="text-guazi-green hover:underline mt-4 inline-block">← 返回博客</Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="max-w-[1600px] mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Link href="/blog" className="text-guazi-green text-sm hover:underline mb-4 inline-block">← 返回博客</Link>
          <span className="text-xs text-guazi-green bg-guazi-green-light px-2 py-0.5 rounded ml-4">{post.category}</span>
          <h1 className="text-2xl md:text-3xl font-bold text-guazi-dark mt-4 mb-2">{post.title}</h1>
          <p className="text-sm text-gray-400 mb-8">{post.date}</p>

          <div className="prose prose-sm max-w-none text-guazi-dark leading-relaxed">
            {post.body.split("\n\n").map((p: string, i: number) => {
              if (p.startsWith("##")) {
                return <h2 key={i} className="text-lg font-bold mt-8 mb-3">{p.replace("## ", "")}</h2>;
              }
              if (p.startsWith("- ")) {
                return (
                  <ul key={i} className="list-disc pl-5 my-3 space-y-1">
                    {p.split("\n").map((li, j) => (
                      <li key={j} className="text-sm text-gray-600">{li.replace("- ", "")}</li>
                    ))}
                  </ul>
                );
              }
              return <p key={i} className="text-sm text-gray-600 leading-relaxed mb-4">{p}</p>;
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
