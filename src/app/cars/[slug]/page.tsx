import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { tServer } from "@/i18n/useT";
import { T } from "@/i18n/translations";

export const dynamic = "force-dynamic";

// 服务端读取语言
async function getLang(): Promise<"en" | "fr" | "es" | "zh"> {
  try {
    const ck = await cookies();
    const v = ck.get("hlj-lang");
    if (v && ["en", "fr", "es", "zh"].includes(v.value)) return v.value as "en" | "fr" | "es" | "zh";
  } catch {}
  return "en";
}

export default async function CarDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lang = await getLang();
  const t = tServer(lang);

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
  const categoryLabel = vehicle.equipmentType
    ? `${t(T.details.machinery)} - ${vehicle.equipmentType}`
    : vehicle.motorcycleType
    ? `${t(T.details.motorcycle)} - ${vehicle.motorcycleType}`
    : vehicle.partCategory
    ? `${t(T.details.autoParts)} - ${vehicle.partCategory}`
    : vehicle.loadCapacityTons
    ? t(T.details.truck)
    : vehicle.batteryType
    ? t(T.details.newEnergy)
    : t(T.details.usedPassengerCar);

  const formatMileage = (km: number | null) => {
    if (!km) return "-";
    if (lang === "zh") return km >= 10000 ? `${(km / 10000).toFixed(1)}万${t(T.details.km)}` : `${km.toLocaleString()}${t(T.details.km)}`;
    return `${km.toLocaleString()} ${t(T.details.km)}`;
  };

  const steeringLabel = vehicle.steering?.toUpperCase() === "RHD" ? t(T.details.rhd) : t(T.details.lhd);

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-[1200px] mx-auto px-4 py-6">
          <div className="text-xs text-gray-400 mb-6">
            <Link href="/" className="hover:text-primary">{t(T.details.breadcrumbHome)}</Link>
            <span className="mx-2">›</span>
            <Link href="/cars" className="hover:text-primary">{t(T.details.breadcrumbCars)}</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-600">{vehicle.brand} {vehicle.model}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
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

            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <span className="text-xs font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full">
                  {categoryLabel}
                </span>
                <h1 className="text-2xl font-extrabold text-gray-900 mt-3">
                  {vehicle.brand} {vehicle.model} {vehicle.year}
                </h1>

                <div className="mt-6">
                  <div className="text-4xl font-extrabold text-danger">
                    ${vehicle.salePrice.toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{t(T.details.priceNote)}</p>
                  <div className="flex gap-4 mt-2 text-xs text-gray-500">
                    <span>{t(T.details.basePrice)}: ${vehicle.basePrice.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <Spec label={t(T.details.specYear)} value={String(vehicle.year)} />
                    <Spec label={t(T.details.specMileage)} value={formatMileage(vehicle.mileage)} />
                    <Spec label={t(T.details.specTransmission)} value={vehicle.transmission || "-"} />
                    <Spec label={t(T.details.specFuel)} value={vehicle.fuel || "-"} />
                    <Spec label={t(T.details.specSteering)} value={steeringLabel} />
                    <Spec label={t(T.details.specColor)} value={vehicle.exteriorColor || "-"} />
                    {vehicle.displacement && <Spec label={t(T.details.specDisplacement)} value={`${vehicle.displacement}L`} />}
                    {vehicle.bodyStyle && <Spec label={t(T.details.specBodyStyle)} value={vehicle.bodyStyle} />}
                    {vehicle.seatCount && <Spec label={t(T.details.specSeats)} value={`${vehicle.seatCount}`} />}
                    {vehicle.engineModel && <Spec label={t(T.details.specEngine)} value={vehicle.engineModel} />}
                    {vehicle.rangeKm && <Spec label={t(T.details.specRange)} value={`${vehicle.rangeKm} ${t(T.details.km)}`} />}
                    {vehicle.batteryType && <Spec label={t(T.details.specBattery)} value={vehicle.batteryType} />}
                    {vehicle.workingHours && <Spec label={t(T.details.specHours)} value={`${vehicle.workingHours} h`} />}
                    {vehicle.tonnage && <Spec label={t(T.details.specTonnage)} value={`${vehicle.tonnage}t`} />}
                    {vehicle.loadCapacityTons && <Spec label={t(T.details.specLoad)} value={`${vehicle.loadCapacityTons}t`} />}
                  </div>
                </div>

                {vehicle.description && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl text-sm text-gray-600 whitespace-pre-wrap">
                    {vehicle.description}
                  </div>
                )}

                <div className="mt-6 space-y-3">
                  <a
                    href={`/inquiry?slug=${vehicle.brand}-${vehicle.model}-${vehicle.year}`}
                    className="block w-full text-center bg-accent text-white py-3 rounded-xl font-bold hover:bg-accent-dark transition-all"
                  >
                    {t(T.details.inquireNow)}
                  </a>
                  <a
                    href={`https://wa.me/861234567890?text=Hi%2C%20I%27m%20interested%20in%20${encodeURIComponent(vehicle.brand + " " + vehicle.model + " " + vehicle.year)}`}
                    target="_blank"
                    className="block w-full text-center bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition-all"
                  >
                    {t(T.details.contactWhatsApp)}
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
