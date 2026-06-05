import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";

const vehicles = [
  {
    slug: "audiq3-2022-20260603",
    title: "奥迪Q3 2022款 35 TFSI 进取动感型",
    price: "$18,500",
    year: 2022,
    mileage: "35,000 km",
    brand: "奥迪",
    type: "二手车",
  },
  {
    slug: "wulinghongguangs3-2018-20260603",
    title: "五菱宏光S3 2018款 1.5L 手动标准型 国V",
    price: "$4,200",
    year: 2018,
    mileage: "52,000 km",
    brand: "五菱",
    type: "二手车",
  },
];

export default function CarsPage() {
  return (
    <>
      <Header />
      <main className="max-w-[1600px] mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-guazi-dark">全部车源</h1>
          <p className="text-gray-500 text-sm mt-2">真实车源 · 实车验车 · 价格透明</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <Link
              key={v.slug}
              href={`/cars/${v.slug}`}
              className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-guazi-green/30 transition-all duration-300"
            >
              <div className="aspect-[16/9] bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                [{v.brand} {v.year}]
              </div>
              <div className="p-4">
                <span className="text-xs text-guazi-green bg-guazi-green-light px-2 py-0.5 rounded">{v.type}</span>
                <h3 className="text-sm font-bold text-guazi-dark mt-2 line-clamp-2 group-hover:text-guazi-green transition-colors">
                  {v.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                  <span>{v.year}</span><span>·</span><span>{v.mileage}</span>
                </div>
                <div className="mt-3 text-lg font-bold text-guazi-red">{v.price}</div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
