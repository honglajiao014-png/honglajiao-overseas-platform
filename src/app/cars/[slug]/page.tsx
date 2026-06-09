import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CarGallery } from "@/components/CarGallery";
import { CarCard } from "@/components/CarCard";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

// ⚠️ 此处使用内联翻译，不导入 @/i18n/useT（避免"use client"污染服务端组件）
type Lang = "en" | "fr" | "ar" | "zh";
type Trans = Record<string, string>;
const T = (en: string, fr: string, ar: string, zh: string): Trans => ({ en, fr, ar, zh });

const I18N = {
  home: T("Home", "Accueil", "الرئيسية", "首页"),
  allCars: T("Cars", "Véhicules", "سيارات", "车辆列表"),
  usedPassenger: T("Used Passenger Car", "Voiture d'occasion", "سيارة مستعملة", "二手乘用车"),
  newEnergy: T("New Energy Vehicle", "Véhicule électrique", "سيارة كهربائية", "新能源车"),
  truck: T("Truck", "Camion", "شاحنة", "卡车"),
  machinery: T("Construction Machinery", "Engins", "آليات بناء", "工程机械"),
  motorcycle: T("Motorcycle", "Moto", "دراجة نارية", "摩托车"),
  parts: T("Auto Parts", "Pièces auto", "قطع غيار", "汽车配件"),
  basePrice: T("Base Price", "Prix de base", "السعر الأساسي", "底价"),
  priceNote: T("* Base vehicle price only. Excludes shipping, insurance & duties.", "* Prix de base hors expédition, assurance et droits.", "* السعر الأساسي فقط. باستثناء الشحن والتأمين والرسوم.", "* 仅裸车价格。不含运费、保险和关税。"),
  inquire: T("Inquire Now", "Demander", "استفسر الآن", "立即询价"),

  year: T("Year", "Année", "السنة", "年份"),
  mileage: T("Mileage", "Kilométrage", "Kilometraje", "里程"),
  trans: T("Transmission", "Transmission", "ناقل الحركة", "变速箱"),
  fuel: T("Fuel", "Carburant", "الوقود", "燃料"),
  steering: T("Steering", "Direction", "المقود", "方向盘"),
  color: T("Color", "Couleur", "اللون", "颜色"),
  displacement: T("Displacement", "Cylindrée", "سعة المحرك", "排量"),
  bodyStyle: T("Body Style", "Carrosserie", "نوع الهيكل", "车身类型"),
  seats: T("Seats", "Places", "المقاعد", "座位"),
  engine: T("Engine", "Moteur", "المحرك", "发动机"),
  range: T("Range", "Autonomie", "المدى", "续航"),
  battery: T("Battery", "Batterie", "البطارية", "电池"),
  hours: T("Hours", "Heures", "ساعات العمل", "工作时长"),
  tonnage: T("Tonnage", "Tonnage", "الحمولة", "吨位"),
  load: T("Load", "Charge", "الحمولة", "载重"),
  power: T("Power", "Puissance", "القوة", "功率"),
  length: T("Length", "Longueur", "الطول", "车长"),
  driveType: T("Drive", "Traction", "نظام الدفع", "驱动"),
  features: T("Features", "Équipements", "المميزات", "配置"),
  specs: T("Specifications", "Spécifications", "المواصفات", "详细参数"),
  lhd: T("LHD", "Conduite à gauche", "مقود يسار", "左舵"),
  rhd: T("RHD", "Conduite à droite", "مقود يمين", "右舵"),
  km: T("km", "km", "km", "公里"),
  doors: T("Doors", "Portes", "أبواب", "车门"),
  wheelbase: T("Wheelbase", "Empattement", "قاعدة العجلات", "轴距"),
  curbWeight: T("Curb Weight", "Poids à vide", "الوزن فارغ", "整备质量"),
  fuelConsumption: T("Fuel Consumption", "Consommation", "استهلاك الوقود", "油耗"),
  maxTorque: T("Max Torque", "Couple max", "عزم الدوران", "最大扭矩"),
  maxHp: T("Max HP", "Ch max", "قوة حصان", "最大马力"),
  fuelTank: T("Fuel Tank", "Réservoir", "خزان الوقود", "油箱"),
  fuelGrade: T("Fuel Grade", "Indice d'octane", "درجة الوقود", "燃油标号"),
  mm: T("mm", "mm", "mm", "毫米"),
  kg: T("kg", "kg", "kg", "公斤"),
  lPer100km: T("L/100km", "L/100km", "L/100km", "升/百公里"),
  nm: T("N·m", "N·m", "N·m", "牛·米"),
  ps: T("Ps", "Ch", "حصان", "匹"),
  l: T("L", "L", "L", "升"),
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
    if (v && ["en","fr","ar","zh"].includes(v)) return v as Lang;
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
    where: { slug, deleted: false },
    select: {
      brand: true, model: true, year: true, type: true, dealerId: true,
      mileage: true, transmission: true, fuel: true,
      steering: true, exteriorColor: true, interiorColor: true,
      condition: true, basePrice: true, salePrice: true,
      images: true, location: true, series: true,
      bodyStyle: true, description: true, equipmentType: true,
      workingHours: true, tonnage: true, loadCapacityTons: true,
      seatCount: true, engineModel: true, batteryType: true,
      rangeKm: true, displacement: true, motorcycleType: true,
      partCategory: true, partCondition: true,
      motorPowerKw: true, vehicleLengthM: true, specsJson: true,
      doorCount: true, driveType: true, maxHorsepower: true,
      maxTorqueNm: true, wheelbase: true, curbWeight: true,
      fuelConsumption: true, fuelTankCapacity: true, fuelGrade: true,
    },
  });

  if (!vehicle) notFound();

  // 同车商其他车辆
  const dealerVehicles = vehicle.dealerId
    ? await prisma.vehicle.findMany({
        where: {
          dealerId: vehicle.dealerId,
          slug: { not: slug },
          status: { in: ["available", "APPROVED", "PUBLISHED"] },
          published: true,
          deleted: false,
        },
        select: {
          slug: true, brand: true, model: true, year: true,
          mileage: true, location: true, transmission: true,
          fuel: true, salePrice: true, images: true,
        },
        orderBy: { createdAt: "desc" },
        take: 4,
      })
    : [];

  // 品类标签（翻译）
  const catLabel = vehicle.equipmentType ? `${d(I18N.machinery)} - ${vehicle.equipmentType}`
    : vehicle.motorcycleType ? `${d(I18N.motorcycle)} - ${vehicle.motorcycleType}`
    : vehicle.partCategory ? `${d(I18N.parts)} - ${vehicle.partCategory}`
    : vehicle.loadCapacityTons ? d(I18N.truck)
    : vehicle.batteryType ? d(I18N.newEnergy)
    : d(I18N.usedPassenger);

  const steer = vehicle.steering?.toUpperCase() === "RHD" ? d(I18N.rhd) : d(I18N.lhd);

  // 解析 specsJson 获取 features 和详细参数
  let specsData: any = null;
  if (vehicle.specsJson) {
    try { specsData = JSON.parse(vehicle.specsJson); } catch {}
  }

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
              <CarGallery images={vehicle.images} brand={vehicle.brand} model={vehicle.model} />
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

                {/* 基础参数 */}
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
                    {vehicle.doorCount && <Spec l={d(I18N.doors)} v={`${vehicle.doorCount}`} />}
                    {vehicle.seatCount && <Spec l={d(I18N.seats)} v={`${vehicle.seatCount}`} />}
                    {vehicle.driveType && <Spec l={d(I18N.driveType)} v={vehicle.driveType} />}
                    {vehicle.motorPowerKw && <Spec l={d(I18N.power)} v={`${vehicle.motorPowerKw} kW`} />}
                    {vehicle.maxHorsepower && <Spec l={d(I18N.maxHp)} v={`${vehicle.maxHorsepower} ${d(I18N.ps)}`} />}
                    {vehicle.maxTorqueNm && <Spec l={d(I18N.maxTorque)} v={`${vehicle.maxTorqueNm} ${d(I18N.nm)}`} />}
                    {vehicle.vehicleLengthM && <Spec l={d(I18N.length)} v={`${vehicle.vehicleLengthM} m`} />}
                    {vehicle.wheelbase && <Spec l={d(I18N.wheelbase)} v={`${vehicle.wheelbase} ${d(I18N.mm)}`} />}
                    {vehicle.curbWeight && <Spec l={d(I18N.curbWeight)} v={`${vehicle.curbWeight} ${d(I18N.kg)}`} />}
                    {vehicle.fuelConsumption && <Spec l={d(I18N.fuelConsumption)} v={`${vehicle.fuelConsumption} ${d(I18N.lPer100km)}`} />}
                    {vehicle.fuelTankCapacity && <Spec l={d(I18N.fuelTank)} v={`${vehicle.fuelTankCapacity} ${d(I18N.l)}`} />}
                    {vehicle.fuelGrade && <Spec l={d(I18N.fuelGrade)} v={vehicle.fuelGrade} />}
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

                {/* 配置亮点 Features */}
                {specsData?.features && Object.keys(specsData.features).length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-bold text-gray-800 mb-3">{d(I18N.features)}</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {Object.entries(specsData.features).map(([cat, items]: [string, any]) => (
                        <div key={cat} className="bg-gray-50 rounded-xl p-3">
                          <span className="text-xs font-semibold text-gray-700 block mb-1.5">{cat}</span>
                          <div className="flex flex-wrap gap-1.5">
                            {Array.isArray(items) ? items.map((item: string, i: number) => (
                              <span key={i} className="text-xs bg-white text-gray-600 px-2 py-0.5 rounded-full border border-gray-200">{item}</span>
                            )) : (
                              <span className="text-xs text-gray-500">{String(items)}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 详细参数 Specifications */}
                {specsData && (
                  <div className="mt-6">
                    <h3 className="text-sm font-bold text-gray-800 mb-3">{d(I18N.specs)}</h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                      {specsData.fullName && <SpecRow l="Model" v={specsData.fullName} />}
                      {specsData.manufacturer && <SpecRow l="Manufacturer" v={specsData.manufacturer} />}
                      {specsData.energyType && <SpecRow l="Energy" v={specsData.energyType} />}
                      {specsData.engineModel && <SpecRow l="Engine Model" v={specsData.engineModel} />}
                      {specsData.intakeType && <SpecRow l="Intake" v={specsData.intakeType} />}
                      {specsData.frontSuspension && <SpecRow l="Front Suspension" v={String(specsData.frontSuspension).replace(/:●/g, '')} />}
                      {specsData.rearSuspension && <SpecRow l="Rear Suspension" v={String(specsData.rearSuspension).replace(/:●/g, '')} />}
                      {specsData.frontBrake && <SpecRow l="Front Brake" v={String(specsData.frontBrake).replace(/:●/g, '')} />}
                      {specsData.rearBrake && <SpecRow l="Rear Brake" v={String(specsData.rearBrake).replace(/:●/g, '')} />}
                      {specsData.steeringAssist && <SpecRow l="Steering Assist" v={String(specsData.steeringAssist).replace(/:●/g, '')} />}
                      {specsData.bodyStructure && <SpecRow l="Body Structure" v={specsData.bodyStructure} />}
                      {specsData.frontTireSpec && <SpecRow l="Front Tire" v={String(specsData.frontTireSpec).replace(/:●/g, '')} />}
                      {specsData.rearTireSpec && <SpecRow l="Rear Tire" v={String(specsData.rearTireSpec).replace(/:●/g, '')} />}
                      {specsData.warranty && specsData.warranty !== '-' && <SpecRow l="Warranty" v={String(specsData.warranty).replace(/:●/g, '')} />}
                      {specsData.batteryType && <SpecRow l="Battery Type" v={specsData.batteryType} />}
                      {specsData.rangeKm && <SpecRow l="Range" v={`${specsData.rangeKm} km`} />}
                      {specsData.engineOptions && <SpecRow l="Engine Options" v={specsData.engineOptions.map((e: any) => e.type).join(' / ')} />}
                      {specsData.towingCapacity && <SpecRow l="Towing" v={specsData.towingCapacity} />}
                      {specsData.payloadCapacity && <SpecRow l="Payload" v={specsData.payloadCapacity} />}
                      {specsData.groundClearance && <SpecRow l="Ground Clearance" v={specsData.groundClearance} />}
                      {specsData.operatingWeight && <SpecRow l="Operating Weight" v={specsData.operatingWeight} />}
                      {specsData.bucketCapacity && <SpecRow l="Bucket Capacity" v={specsData.bucketCapacity} />}
                      {specsData.maxDiggingDepth && <SpecRow l="Max Digging Depth" v={specsData.maxDiggingDepth} />}
                      {specsData.compressionRatio && <SpecRow l="Compression Ratio" v={specsData.compressionRatio} />}
                      {specsData.seatHeight && <SpecRow l="Seat Height" v={specsData.seatHeight} />}
                      {specsData.curbWeight && !vehicle.curbWeight && <SpecRow l="Curb Weight" v={String(specsData.curbWeight)} />}
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <a href={`/inquiry?slug=${encodeURIComponent(vehicle.brand + "-" + vehicle.model + "-" + vehicle.year)}`}
                    className="block w-full text-center bg-accent text-white py-3 rounded-xl font-bold hover:bg-accent-dark transition-all">{d(I18N.inquire)}</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 该车商其他车辆 */}
        {dealerVehicles.length > 0 && (
          <div className="max-w-[1200px] mx-auto px-4 pb-12">
            <h2 className="text-xl font-extrabold text-gray-900 mb-6">
              {lang === "zh" ? "该车商其他车辆" : lang === "fr" ? "Autres véhicules de ce vendeur" : lang === "ar" ? "مركبات أخرى من هذا البائع" : "More from this dealer"}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {dealerVehicles.map(v => (
                <CarCard key={v.slug} variant="vertical" {...v} />
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />

      {/* Structured Data — Product + Vehicle JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": ["Product", "Vehicle"],
            name: `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
            brand: { "@type": "Brand", name: vehicle.brand },
            model: vehicle.model,
            productionDate: String(vehicle.year),
            vehicleConfiguration: vehicle.bodyStyle || undefined,
            offers: {
              "@type": "Offer",
              price: vehicle.salePrice,
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              url: `https://honglajiao1688.com/cars/${slug}`,
            },
            image: vehicle.images?.length ? vehicle.images : undefined,
            mileageFromOdometer: vehicle.mileage
              ? { "@type": "QuantitativeValue", value: vehicle.mileage, unitCode: "KMT" }
              : undefined,
            fuelType: vehicle.fuel || undefined,
            ...(vehicle.description ? { description: vehicle.description.slice(0, 5000) } : {}),
          }),
        }}
      />
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

function SpecRow({ l, v }: { l: string; v: string }) {
  return (
    <>
      <span className="text-gray-400">{l}</span>
      <span className="text-gray-700 truncate">{v}</span>
    </>
  );
}
