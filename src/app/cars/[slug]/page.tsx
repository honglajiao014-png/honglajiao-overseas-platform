import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";

const vehicles: Record<string, any> = {
  "audiq3-2022-20260603": {
    title: "奥迪Q3 2022款 35 TFSI 进取动感型",
    brand: "奥迪",
    price: "$18,500",
    year: 2022,
    mileage: "35,000 km",
    transmission: "自动",
    fuel: "汽油",
    steering: "LHD",
    color: "白色",
    location: "成都",
    description: "车辆状况极佳，原版原漆，无事故记录。实车照片已拍摄，随时可安排第三方检测。",
    features: ["天窗", "倒车影像", "定速巡航", "电动座椅", "多功能方向盘", "自动空调"],
  },
  "wulinghongguangs3-2018-20260603": {
    title: "五菱宏光S3 2018款 1.5L 手动标准型 国V",
    brand: "五菱",
    price: "$4,200",
    year: 2018,
    mileage: "52,000 km",
    transmission: "手动",
    fuel: "汽油",
    steering: "LHD",
    color: "银色",
    location: "柳州",
    description: "家用一手车，定期保养，无大修记录。经济实惠，适合非洲及中亚市场。",
    features: ["7座", "空调", "ABS防抱死", "电动车窗", "中控锁"],
  },
};

export async function generateStaticParams() {
  return Object.keys(vehicles).map((slug) => ({ slug }));
}

export default async function CarDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vehicle = vehicles[slug];

  if (!vehicle) {
    return (
      <>
        <Header />
        <main className="max-w-[1600px] mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-guazi-dark mb-4">车辆未找到</h1>
          <Link href="/cars" className="text-guazi-green hover:underline">← 返回全部车源</Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="max-w-[1600px] mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-guazi-green">首页</Link>
          <span className="mx-2">/</span>
          <Link href="/cars" className="hover:text-guazi-green">全部车源</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-600">{vehicle.brand}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Images */}
          <div className="lg:col-span-2">
            <div className="aspect-[16/10] bg-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-lg">
              [{vehicle.brand} {vehicle.year}]
            </div>
          </div>

          {/* Info */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-20">
              <h1 className="text-lg font-bold text-guazi-dark leading-tight mb-3">{vehicle.title}</h1>
              <div className="text-2xl font-bold text-guazi-red mb-6">{vehicle.price}</div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">年份</span>
                  <span className="font-semibold">{vehicle.year}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">里程</span>
                  <span className="font-semibold">{vehicle.mileage}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">变速箱</span>
                  <span className="font-semibold">{vehicle.transmission}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">燃料</span>
                  <span className="font-semibold">{vehicle.fuel}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">方向盘</span>
                  <span className="font-semibold">{vehicle.steering}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">颜色</span>
                  <span className="font-semibold">{vehicle.color}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">所在地</span>
                  <span className="font-semibold">{vehicle.location}</span>
                </div>
              </div>

              <Link
                href={`/inquiry?vehicle=${slug}&brand=${vehicle.brand}&model=Q3&year=${vehicle.year}`}
                className="mt-6 w-full block text-center bg-guazi-green text-white py-3 rounded-lg font-bold text-sm hover:bg-guazi-green-dark transition-all"
              >
                咨询这辆车
              </Link>
            </div>
          </div>
        </div>

        {/* Description & Features */}
        <div className="mt-10 max-w-3xl">
          <h2 className="text-base font-bold text-guazi-dark mb-5">车辆描述</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">{vehicle.description}</p>

          <h2 className="text-base font-bold text-guazi-dark mb-4">车辆配置</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {vehicle.features.map((f: string) => (
              <span key={f} className="text-sm text-guazi-green bg-guazi-green-light px-3 py-2 rounded-lg text-center">
                {f}
              </span>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
