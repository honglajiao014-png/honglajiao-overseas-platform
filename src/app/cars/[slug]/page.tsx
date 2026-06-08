import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CarDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const vehicle = await prisma.vehicle.findUnique({
    where: { slug },
    select: {
      brand: true,
      model: true,
      year: true,
      type: true,
      mileage: true,
      transmission: true,
      fuel: true,
      steering: true,
      exteriorColor: true,
      interiorColor: true,
      condition: true,
      basePrice: true,
      salePrice: true,
      images: true,
      location: true,
      series: true,
      bodyStyle: true,
      description: true,
      equipmentType: true,
      workingHours: true,
      tonnage: true,
      loadCapacityTons: true,
      seatCount: true,
      engineModel: true,
      batteryType: true,
      rangeKm: true,
      displacement: true,
      motorcycleType: true,
      partCategory: true,
      partCondition: true,
    },
  });

  if (!vehicle) {
    notFound();
  }

  // 品类标签
  const categoryLabel = vehicle.equipmentType ? `Construction Machinery - ${vehicle.equipmentType}` :
    vehicle.motorcycleType ? `Motorcycle - ${vehicle.motorcycleType}` :
    vehicle.partCategory ? `Auto Parts - ${vehicle.partCategory}` :
    vehicle.loadCapacityTons ? "Truck" :
    vehicle.batteryType ? "New Energy Vehicle" : "Used Passenger Car";

  // 价格裸露提示
  const priceNote = "* Base vehicle price only. Excludes shipping, insurance & duties.";

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-[1200px] mx-auto px-4 py-6">
          {/* 面包屑 */}
          <div className="text-xs text-gray-400 mb-6">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/cars" className="hover:text-primary">Cars</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-600">{vehicle.brand} {vehicle.model}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* 图片区 */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                {vehicle.images && vehicle.images.length > 0 ? (
                  <div className="grid grid-cols-2 gap-1">
                    {vehicle.images.map((img: string, i: number) => (
                      <div key={i} className={`${i === 0 ? "col-span-2" : ""} bg-gray-100`}>
                        <img src={img} alt={`${vehicle.brand} ${vehicle.model} - ${i + 1}`}
                          className="w-full h-64 object-cover hover:scale-105 transition-transform" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-80 flex items-center justify-center text-8xl bg-gray-100">🚗</div>
                )}
              </div>
            </div>

            {/* 信息区 */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <span className="text-xs font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full">
                  {categoryLabel}
                </span>
                <h1 className="text-2xl font-extrabold text-gray-900 mt-3">
                  {vehicle.brand} {vehicle.model} {vehicle.year}
                </h1>

                {/* 价格 */}
                <div className="mt-6">
                  <div className="text-4xl font-extrabold text-danger">
                    ${vehicle.salePrice.toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{priceNote}</p>
                  <div className="flex gap-4 mt-2 text-xs text-gray-500">
                    <span>Base: ${vehicle.basePrice.toLocaleString()}</span>
                  </div>
                </div>

                {/* 规格表格 */}
                <div className="mt-6 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <Spec label="Year" value={String(vehicle.year)} />
                    <Spec label="Mileage" value={vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : "-"} />
                    <Spec label="Transmission" value={vehicle.transmission || "-"} />
                    <Spec label="Fuel" value={vehicle.fuel || "-"} />
                    <Spec label="Steering" value={vehicle.steering || "LHD"} />
                    <Spec label="Color" value={vehicle.exteriorColor || "-"} />
                    {vehicle.displacement && <Spec label="Displacement" value={`${vehicle.displacement}L`} />}
                    {vehicle.bodyStyle && <Spec label="Body Style" value={vehicle.bodyStyle} />}
                    {vehicle.seatCount && <Spec label="Seats" value={`${vehicle.seatCount}`} />}
                    {vehicle.engineModel && <Spec label="Engine" value={vehicle.engineModel} />}
                    {vehicle.rangeKm && <Spec label="Range" value={`${vehicle.rangeKm} km`} />}
                    {vehicle.batteryType && <Spec label="Battery" value={vehicle.batteryType} />}
                    {vehicle.workingHours && <Spec label="Hours" value={`${vehicle.workingHours} h`} />}
                    {vehicle.tonnage && <Spec label="Tonnage" value={`${vehicle.tonnage}t`} />}
                    {vehicle.loadCapacityTons && <Spec label="Load" value={`${vehicle.loadCapacityTons}t`} />}
                  </div>
                </div>

                {/* 描述 */}
                {vehicle.description && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl text-sm text-gray-600 whitespace-pre-wrap">
                    {vehicle.description}
                  </div>
                )}

                {/* CTA */}
                <div className="mt-6 space-y-3">
                  <a
                    href={`/inquiry?slug=${vehicle.brand}-${vehicle.model}-${vehicle.year}`}
                    className="block w-full text-center bg-accent text-white py-3 rounded-xl font-bold hover:bg-accent-dark transition-all"
                  >
                    Inquire Now
                  </a>
                  <a
                    href={`https://wa.me/861234567890?text=Hi%2C%20I%27m%20interested%20in%20${encodeURIComponent(vehicle.brand + " " + vehicle.model + " " + vehicle.year)}`}
                    target="_blank"
                    className="block w-full text-center bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition-all"
                  >
                    Contact via WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  );
}
