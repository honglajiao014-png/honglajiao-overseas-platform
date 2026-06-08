import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

// ⚠️ 此处使用内联翻译，不导入 @/i18n/useT（避免"use client"污染服务端组件）
type Lang = "en" | "fr" | "es" | "zh";
type Trans = Record<string, string>;
const T = (en: string, fr: string, es: string, zh: string): Trans => ({ en, fr, es, zh });

const I18N = {
  home: T("Home","Accueil","Inicio","首页"),
  allCars: T("Cars","Véhicules","Vehículos","车辆列表"),
  usedPassenger: T("Used Passenger Car","Voiture d'occasion","Auto usado","二手乘用车"),
  newEnergy: T("New Energy Vehicle","Véhicule électrique","Vehículo eléctrico","新能源车"),
  truck: T("Truck","Camion","Camión","卡车"),
  machinery: T("Construction Machinery","Engins","Maquinaria","工程机械"),
  motorcycle: T("Motorcycle","Moto","Motocicleta","摩托车"),
  parts: T("Auto Parts","Pièces auto","Repuestos","汽车配件"),
  basePrice: T("Base Price","Prix de base","Precio base","底价"),
  priceNote: T("* Base vehicle price only. Excludes shipping, insurance & duties.","* Prix de base hors expédition, assurance et droits.","* Precio base solamente. Excluye envío, seguro e impuestos.","* 仅裸车价格。不含运费、保险和关税。"),
  inquire: T("Inquire Now","Demander","Consultar ahora","立即询价"),

  year: T("Year","Année","Año","年份"),
  mileage: T("Mileage","Kilométrage","Kilometraje","里程"),
  trans: T("Transmission","Transmission","Transmisión","变速箱"),
  fuel: T("Fuel","Carburant","Combustible","燃料"),
  steering: T("Steering","Direction","Dirección","方向盘"),
  color: T("Color","Couleur","Color","颜色"),
  displacement: T("Displacement","Cylindrée","Cilindrada","排量"),
  bodyStyle: T("Body Style","Carrosserie","Carrocería","车身类型"),
  seats: T("Seats","Places","Asientos","座位"),
  engine: T("Engine","Moteur","Motor","发动机"),
  range: T("Range","Autonomie","Autonomía","续航"),
  battery: T("Battery","Batterie","Batería","电池"),
  hours: T("Hours","Heures","Horas","工作时长"),
  tonnage: T("Tonnage","Tonnage","Tonelaje","吨位"),
  load: T("Load","Charge","Carga","载重"),
  lhd: T("LHD","Conduite à gauche","Volante izquierdo","左舵"),
  rhd: T("RHD","Conduite à droite","Volante derecho","右舵"),
  km: T("km","km","km","公里"),
};

function tr(key: Trans, lang: Lang): string {
  return key[lang] || key.en || "";
}

async function detectLang(): Promise<Lang> {
  try {
    const hdrs = await headers();
    const c = hdrs.get("cookie") || "";
    const m = c.match(/hlj-lang=([^;]+)/);
    const v = m?.[1];
    if (v && ["en","fr","es","zh"].includes(v)) return v as Lang;
  } catch {}
  return "en";
}

export default async function CarDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lang = await detectLang();
  const d = (k: Trans) => tr(k, lang);

  const kmU = d(I18N.km);
  const fmtKm = (km: number | null) => {
    if (!km) return "-";
    if (lang === "zh") return km >= 10000 ? `${(km / 10000).toFixed(1)}万${kmU}` : `${km.toLocaleString()}${kmU}`;
    return `${km.toLocaleString()} ${kmU}`;
  };

  const vehicle = await prisma.vehicle.findUnique({
    where: { slug },
    select: {
      brand: true, model: true, year: true, type: true,
      mileage: true, transmission: true, fuel: true,
      steering: true, exteriorColor: true, interiorColor: true,
      condition: true, basePrice: true, salePrice: true,
      images: true, location: true, series: true,
      bodyStyle: true, description: true, equipmentType: true,
      workingHours: true, tonnage: true, loadCapacityTons: true,
      seatCount: true, engineModel: true, batteryType: true,
      rangeKm: true, displacement: true, motorcycleType: true,
      partCategory: true, partCondition: true,
    },
  });

  if (!vehicle) notFound();

  // 品类标签（翻译）
  const catLabel = vehicle.equipmentType ? `${d(I18N.machinery)} - ${vehicle.equipmentType}`
    : vehicle.motorcycleType ? `${d(I18N.motorcycle)} - ${vehicle.motorcycleType}`
    : vehicle.partCategory ? `${d(I18N.parts)} - ${vehicle.partCategory}`
    : vehicle.loadCapacityTons ? d(I18N.truck)
    : vehicle.batteryType ? d(I18N.newEnergy)
    : d(I18N.usedPassenger);

  const steer = vehicle.steering?.toUpperCase() === "RHD" ? d(I18N.rhd) : d(I18N.lhd);

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-[1200px] mx-auto px-4 py-6">
          <div className="text-xs text-gray-400 mb-6">
            <Link href="/" className="hover:text-primary">{d(I18N.home)}</Link>
            <span className="mx-2">›</span>
            <Link href="/cars" className="hover:text-primary">{d(I18N.allCars)}</Link>
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
                        <img src={img} alt={`${vehicle.brand} ${vehicle.model}`}
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
                <span className="text-xs font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full">{catLabel}</span>
                <h1 className="text-2xl font-extrabold text-gray-900 mt-3">{vehicle.brand} {vehicle.model} {vehicle.year}</h1>

                <div className="mt-6">
                  <div className="text-4xl font-extrabold text-danger">${vehicle.salePrice.toLocaleString()}</div>
                  <p className="text-xs text-gray-400 mt-1">{d(I18N.priceNote)}</p>
                  <div className="flex gap-4 mt-2 text-xs text-gray-500">
                    <span>{d(I18N.basePrice)}: ${vehicle.basePrice.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <Spec l={d(I18N.year)} v={String(vehicle.year)} />
                    <Spec l={d(I18N.mileage)} v={fmtKm(vehicle.mileage)} />
                    <Spec l={d(I18N.trans)} v={vehicle.transmission || "-"} />
                    <Spec l={d(I18N.fuel)} v={vehicle.fuel || "-"} />
                    <Spec l={d(I18N.steering)} v={steer} />
                    <Spec l={d(I18N.color)} v={vehicle.exteriorColor || "-"} />
                    {vehicle.displacement && <Spec l={d(I18N.displacement)} v={`${vehicle.displacement}L`} />}
                    {vehicle.bodyStyle && <Spec l={d(I18N.bodyStyle)} v={vehicle.bodyStyle} />}
                    {vehicle.seatCount && <Spec l={d(I18N.seats)} v={`${vehicle.seatCount}`} />}
                    {vehicle.engineModel && <Spec l={d(I18N.engine)} v={vehicle.engineModel} />}
                    {vehicle.rangeKm && <Spec l={d(I18N.range)} v={`${vehicle.rangeKm} ${kmU}`} />}
                    {vehicle.batteryType && <Spec l={d(I18N.battery)} v={vehicle.batteryType} />}
                    {vehicle.workingHours && <Spec l={d(I18N.hours)} v={`${vehicle.workingHours} h`} />}
                    {vehicle.tonnage && <Spec l={d(I18N.tonnage)} v={`${vehicle.tonnage}t`} />}
                    {vehicle.loadCapacityTons && <Spec l={d(I18N.load)} v={`${vehicle.loadCapacityTons}t`} />}
                  </div>
                </div>

                {vehicle.description && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl text-sm text-gray-600 whitespace-pre-wrap">{vehicle.description}</div>
                )}

                <div className="mt-6">
                  <a href={`/inquiry?slug=${encodeURIComponent(vehicle.brand + "-" + vehicle.model + "-" + vehicle.year)}`}
                    className="block w-full text-center bg-accent text-white py-3 rounded-xl font-bold hover:bg-accent-dark transition-all">{d(I18N.inquire)}</a>
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

function Spec({ l, v }: { l: string; v: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-gray-400">{l}</span>
      <span className="font-medium text-gray-800">{v}</span>
    </div>
  );
}
