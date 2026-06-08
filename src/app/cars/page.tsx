import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { prisma } from "@/lib/prisma";

// 服务端取数
async function getVehicles() {
  const vehicles = await prisma.vehicle.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      slug: true, brand: true, model: true, year: true,
      mileage: true, transmission: true, fuel: true,
      basePrice: true, salePrice: true, images: true,
      location: true, createdAt: true, series: true,
    },
  });
  return vehicles;
}

export default async function CarsPage() {
  const vehicles = await getVehicles();

  const formatMileage = (km: number | null) => {
    if (!km) return "-";
    return km >= 10000 ? `${(km / 10000).toFixed(1)}万km` : `${km.toLocaleString()}km`;
  };

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-[1200px] mx-auto px-4 py-6">
          {/* 面包屑 */}
          <div className="text-xs text-gray-400 mb-4">
            <a href="/" className="hover:text-primary">Home</a>
            <span className="mx-2">›</span>
            <span className="text-gray-600">All Vehicles</span>
          </div>

          {/* 统计 */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">
              Found <span className="font-bold text-gray-900">{vehicles.length}</span> vehicles
            </p>
          </div>

          {/* 车辆列表 */}
          {vehicles.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <div className="text-5xl mb-4">🚗</div>
              <h3 className="text-lg font-bold text-gray-400 mb-2">No vehicles yet</h3>
              <p className="text-sm text-gray-400">Vehicles will appear here once synced from domestic platform</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehicles.map((v) => (
                <a
                  key={v.slug}
                  href={`/cars/${v.slug}`}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all group flex flex-col"
                >
                  {/* 图片 */}
                  <div className="h-48 bg-gray-100 overflow-hidden">
                    {v.images && v.images[0] ? (
                      <img src={v.images[0]} alt={`${v.brand} ${v.model}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">🚘</div>
                    )}
                  </div>

                  {/* 信息 */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-accent transition-colors line-clamp-1">
                        {v.brand} {v.model}
                      </h3>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-gray-500">
                        <span>{v.year}年</span>
                        <span>{formatMileage(v.mileage)}</span>
                        <span>{v.transmission || "-"}</span>
                        <span>{v.fuel || "-"}</span>
                        <span>{v.location || "China"}</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-xl font-extrabold text-danger">
                        ${v.salePrice.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-400 ml-1">USD</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
