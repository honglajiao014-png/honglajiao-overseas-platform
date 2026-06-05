import Link from "next/link";

const sampleVehicles = [
  {
    id: "audiq3-2022-20260603",
    slug: "audiq3-2022-20260603",
    title: "奥迪Q3 2022款 35 TFSI 进取动感型",
    price: "$18,500",
    image: "/uploads/vehicles/audiq3-2022-20260603/01-正前方.jpg",
    year: 2022,
    mileage: "35,000 km",
    brand: "奥迪",
  },
  {
    id: "wulinghongguangs3-2018-20260603",
    slug: "wulinghongguangs3-2018-20260603",
    title: "五菱宏光S3 2018款 1.5L 手动标准型 国V",
    price: "$4,200",
    image: "/uploads/vehicles/wulinghongguangs3-2018-20260603/01-正前方.jpg",
    year: 2018,
    mileage: "52,000 km",
    brand: "五菱",
  },
];

export function HomeVehicles() {
  return (
    <section className="max-w-[1600px] mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-guazi-dark">精选车源</h2>
          <p className="text-gray-500 text-sm mt-2">真实车源 · 实拍照片 · 价格可查</p>
        </div>
        <Link href="/cars" className="text-guazi-green text-sm font-semibold hover:underline">
          查看全部 →
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {sampleVehicles.map((v) => (
          <Link
            key={v.id}
            href={`/cars/${v.slug}`}
            className="group car-card bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-guazi-green/30 transition-all duration-300"
          >
            <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                [{v.brand} {v.year}]
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                <span>{v.year}</span>
                <span>·</span>
                <span>{v.mileage}</span>
              </div>
              <h3 className="text-sm md:text-base font-bold text-guazi-dark line-clamp-1 group-hover:text-guazi-green transition-colors">
                {v.title}
              </h3>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-lg font-bold text-guazi-red">{v.price}</span>
                <span className="text-xs text-guazi-green bg-guazi-green-light px-2 py-1 rounded-full">Available</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
