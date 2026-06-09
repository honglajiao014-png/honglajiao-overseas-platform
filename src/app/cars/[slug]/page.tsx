import React from "react";
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
  const { slug: rawSlug } = await params;
  // Next.js 对含中文的 URL 可能不解码 params，手动 decode
  const slug = decodeURIComponent(rawSlug);
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
      specId: true,
      VehicleSpec: { select: { specs: true } },
    },
  });

  console.log("[CarDetailPage] vehicle found:", !!vehicle);

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
  // 优先用 VehicleSpec.specs（结构化 JSON），fallback 到 vehicle.specsJson（原始 XLSX 行数据）
  let specsData: any = null;
  const rawSpecs = vehicle.VehicleSpec?.specs || vehicle.specsJson;
  if (rawSpecs) {
    try { specsData = typeof rawSpecs === "string" ? JSON.parse(rawSpecs) : rawSpecs; } catch {}
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

                {/* 规格参数分组折叠卡片 */}
                {specsData && <SpecsGroups specs={specsData} />}

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

      {/* Structured Data — Vehicle JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Vehicle",
            name: `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
            brand: { "@type": "Brand", name: vehicle.brand },
            model: vehicle.model,
            vehicleModelDate: String(vehicle.year),
            mileageFromOdometer: vehicle.mileage
              ? { "@type": "QuantitativeValue", value: vehicle.mileage, unitCode: "KMT" }
              : undefined,
            fuelType: vehicle.fuel || undefined,
            vehicleTransmission: vehicle.transmission || undefined,
            vehicleConfiguration: (() => {
              const parts: string[] = [];
              if (vehicle.displacement) parts.push(`${vehicle.displacement}L`);
              if (vehicle.motorPowerKw) parts.push(`${vehicle.motorPowerKw}kW`);
              if (vehicle.transmission) parts.push(vehicle.transmission);
              if (vehicle.steering) parts.push(vehicle.steering.toUpperCase());
              if (vehicle.bodyStyle) parts.push(vehicle.bodyStyle);
              return parts.length > 0 ? parts.join(", ") : undefined;
            })(),
            offers: {
              "@type": "Offer",
              price: vehicle.salePrice,
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              url: `https://honglajiao1688.com/cars/${slug}`,
            },
            image: vehicle.images?.length ? vehicle.images : undefined,
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

// ===== 规格参数分组展示 =====

/** VehicleSpec.specs 子对象 → fieldMapping group 映射 */
const SPECS_KEY_TO_GROUP: Record<string, string> = {
  engine: "engine",
  transmission: "drivetrain",
  body: "body",
  chassis: "chassis",
  safety: "safety",
  exterior: "exterior",
  interior: "interior",
  seats: "interior",
  media: "interior",
  lights: "light",
  mirrors: "exterior",
  wipers: "exterior",
  ac: "comfort",
};

/** 分组显示信息 */
const GROUP_META: Record<string, { label: string; icon: string }> = {
  basic: { label: "基本信息", icon: "📋" },
  engine: { label: "发动机/动力", icon: "⚡" },
  drivetrain: { label: "变速箱/驱动", icon: "🔧" },
  body: { label: "车身尺寸", icon: "📐" },
  chassis: { label: "底盘/悬架", icon: "🛞" },
  safety: { label: "安全配置", icon: "🛡️" },
  comfort: { label: "舒适配置", icon: "🛋️" },
  interior: { label: "内饰/座舱", icon: "🎮" },
  exterior: { label: "外部配置", icon: "🚗" },
  light: { label: "灯光配置", icon: "💡" },
};

/** 分组排序 */
const GROUP_ORDER = ["engine", "drivetrain", "body", "chassis", "safety", "comfort", "interior", "exterior", "light"];

/** specs 子对象 key → 显示标签 */
const SPECS_KEY_LABEL: Record<string, string> = {
  // engine
  model: "发动机型号", type: "动力类型", intake: "进气形式", displacement: "排量",
  layout: "气缸排列", cylinders: "气缸数", valvesPerCylinder: "每缸气门数",
  valveTrain: "配气机构", maxPowerKw: "最大功率(kW)", maxPowerPs: "最大马力(Ps)",
  maxPowerRpm: "最大功率转速", maxTorque: "最大扭矩(N·m)", maxTorqueRpm: "最大扭矩转速",
  fuelGrade: "燃油标号", fuelSupply: "供油方式", headMaterial: "缸盖材料",
  blockMaterial: "缸体材料", fuelEconomy: "油耗(L/100km)",
  motorPower: "电机功率(kW)", motorTorque: "电机扭矩(N·m)",
  batteryCapacity: "电池容量", batteryType: "电池类型", range: "续航里程",
  acceleration: "0-100加速", topSpeed: "最高时速", charging: "充电",
  energyConsumption: "能耗", rangeExtender: "增程器", mildHybrid: "轻混系统",
  // transmission
  description: "变速箱描述", gears: "挡位数",
  // body
  form: "车身形式", doors: "车门数", seats: "座位数", wheelbase: "轴距(mm)",
  length: "车长(mm)", width: "车宽(mm)", height: "车高(mm)",
  fuelTank: "油箱容积(L)", curbWeight: "整备质量(kg)", trunk: "行李厢(L)",
  frunk: "前���厢(L)", totalCargo: "总载货空间(L)", cargoBox: "货箱尺寸",
  payload: "载重(kg)", towCapacity: "牵引能力",
  // chassis
  drive: "驱动方式", frontSuspension: "前悬架", rearSuspension: "后悬架",
  frontBrake: "前制动器", rearBrake: "后制动器", steeringAssist: "转向助力",
  structure: "车体结构", parkingBrake: "驻车制动", frontTire: "前轮胎",
  rearTire: "后轮胎", spareTire: "备胎", warranty: "质保",
  lowRangeGear: "低速四驱", diffLock: "差速锁", airSuspension: "空气悬架",
  cdc: "CDC减震", pasm: "PASM", pdcc: "PDCC", rearAxleSteering: "后轮转向",
  kdss: "KDSS", gvc: "GVC", brembo: "Brembo刹车",
  // safety
  driverAirbag: "主驾安全气囊", frontSideAirbags: "前排侧气囊",
  headCurtainAirbags: "头部气帘", kneeAirbag: "膝部气囊",
  rearSideAirbags: "后排侧气囊", centerAirbag: "中央气囊",
  seatbeltReminder: "安全带未系提示", abs: "ABS防抱死",
  brakeAssist: "刹车辅助(EBA)", tractionControl: "牵引力控制(TCS)",
  stabilityControl: "车身稳定控制(ESP)", cruiseControl: "定速巡航",
  adaptiveCruise: "自适应巡航(ACC)", laneKeeping: "车道保持",
  laneDepartureWarning: "车道偏离预警", autonomousBraking: "主动刹车(AEB)",
  blindSpot: "并线辅助", frontRadar: "前雷达", rearRadar: "后雷达",
  panoramicCamera: "全景影像", hillAssist: "上坡辅助",
  hillDescent: "陡坡缓降", autoHold: "自动驻车", autoPark: "自动泊车",
  tpms: "胎压监测", runFlatTires: "防爆胎", vsc: "车身稳定(VSC)",
  rearCrossTraffic: "后方穿行预警", preSafe: "PRE-SAFE",
  attentionAssist: "注意力辅助", nightVision: "夜视系统",
  sentryMode: "哨兵模式", fsd: "FSD", offroadModes: "越野模式",
  // exterior
  sunroof: "天窗", panoramicRoof: "全景天窗", glassRoof: "玻璃车顶",
  wheels: "轮毂", roofRails: "车顶行李架", sideSteps: "脚踏板",
  engineImmobilizer: "发动机电子防盗", centralLocking: "车内中控锁",
  remoteKey: "遥控钥匙", powerLiftgate: "电动尾门",
  flushDoorHandles: "隐藏式门把手", framelessWindows: "无框车门",
  softCloseDoors: "电吸门", slidingDoors: "电动滑门",
  hiddenDoorHandles: "隐藏式门把手", activeRearSpoiler: "主动尾翼",
  poweredChargePort: "电动充电口", activeGrillShutters: "主动进气格栅",
  snorkel: "涉水喉", rollBar: "防滚架", bedLiner: "货箱宝",
  mSportPackage: "M运动套件", mSportBodykit: "M运动包围",
  sportDesignPackage: "Sport Design套件", amgBodykit: "AMG包围",
  adaptiveLed: "自适应LED", multibeamLed: "多光束LED",
  // interior
  multiFunctionSteering: "多功能方向盘", steeringHeating: "方向盘加热",
  gearShifter: "换挡形式", tripComputer: "行车电脑",
  fullLCDCluster: "全液晶仪表盘", hud: "HUD抬头显示",
  ambientLight: "氛围灯", wirelessCharging: "无线充电",
  analogClock: "模拟时钟", powerRearSunshade: "后风挡遮阳帘",
  refrigerator: "车载冰箱", rotatingScreen: "旋转屏",
  iDrive: "iDrive", mbux: "MBUX", touchpad: "触摸板",
  gestureControl: "手势控制", crystalShifter: "水晶挡把",
  nomi: "NOMI", campMode: "露营模式", dogMode: "宠物模式",
  bioDefenseMode: "生化防御模式", heatedSteering: "方向盘加热",
  // seats
  material: "座椅材质", heating: "座椅加热", ventilation: "座椅通风",
  massage: "座椅按摩", memory: "座椅记忆", driverElectric: "主驾电动调节",
  driverManual: "主驾手动调节", driverMemory: "驾驶座记忆",
  passengerElectric: "副驾电动调节", frontHeating: "前排加热",
  rearHeating: "后排加热", frontVentilation: "前排通风",
  rearCupHolder: "后排杯架", seatConfig: "座椅布局",
  thirdRowSeats: "第三排座椅", thirdRowFold: "第三排放倒",
  secondRowCaptain: "二排独立座椅", rearFoldRatio: "后排放倒比例",
  zeroGravitySeat: "零重力座椅", queenSeat: "女王副驾",
  bossSeatButton: "老板键", sportSeats: "运动座椅",
  foldFlat: "纯平放倒", rearSunshade: "后排遮阳帘",
  // media
  screen: "中控屏", bluetooth: "蓝牙", speakers: "扬声器",
  carplay: "CarPlay", androidAuto: "Android Auto",
  otaUpgrade: "OTA升级", voiceControl: "语音控制",
  rearEntertainment: "后排娱乐", passengerScreen: "副驾屏",
  netflix: "Netflix", youtube: "YouTube", steam: "Steam",
  karaoke: "K歌", dlinkSystem: "DiLink", nioOS: "NIO OS",
  xmartOS: "Xmart OS", hongmengOS: "鸿蒙OS",
  hondaConnect: "Honda Connect", hondaSensing: "Honda Sensing",
  nissanConnect: "Nissan Connect", mazdaConnect: "Mazda Connect",
  lexusRemoteTouch: "Remote Touch", lexusSafetySystem: "LSS+",
  sync: "SYNC", sync4: "SYNC 4", internetCar: "互联网汽车",
  dualChip: "芯片", maglink: "MagLink", arGlass: "AR眼镜",
  dannaMusicSeats: "丹拿音乐座椅",
  // lights
  ledHeadlights: "LED大灯", xenonHeadlights: "氙气大灯",
  halogenHeadlights: "卤素大灯", matrixLed: "矩阵LED",
  laserHeadlights: "激光大灯", autoHeadlights: "自动头灯",
  daytimeRunning: "日间行车灯", headlightAdjustable: "大灯高度可调",
  headlightWasher: "大灯清洗", adaptiveHighBeam: "自适应远光",
  adaptiveHeadlights: "自适应大灯", afs: "AFS随动转向",
  fogLights: "雾灯", welcomeLight: "迎宾灯",
  welcomeLightCarpet: "迎宾光毯", logoProjection: "徽标投影",
  // mirrors (use prefix to avoid duplicate keys with seats)
  mirror_adjustment: "后视镜调节", mirror_heating: "后视镜加热",
  mirror_folding: "后视镜折叠", mirror_memory: "后视镜记忆",
  mirror_autoDimming: "自动防眩目", sportDesignMirrors: "运动后视镜",
  // wipers
  rainSensing: "感应雨刷",
  // ac
  rearVents: "后座出风口", zoneControl: "温度分区控制",
  pm25Filter: "PM2.5过滤", ionizer: "负离子发生器",
  aromaDiffuser: "香氛系统", fragrance: "香氛",
  nanoeX: "nanoe X", heatPump: "热泵空调",
  rearAcControl: "后排独立空调", rearScreen: "后排屏幕",
  // 顶层字段
  vehicleType: "车型级别", releaseDate: "上市时间",
  yearRange: "年款范围", manufacturer: "厂商",
  energyType: "能源类型",
};

/** 判断值是否为空 */
function isEmpty(v: any): boolean {
  if (v === null || v === undefined) return true;
  if (typeof v === "string") return v === "" || v === "-" || v === "0";
  if (typeof v === "number") return v === 0;
  if (typeof v === "boolean") return false;
  return false;
}

/** 格式化值 */
function fmtSpecVal(v: any): string {
  if (typeof v === "boolean") return v ? "●" : "-";
  return String(v);
}

function SpecsGroups({ specs }: { specs: any }) {
  // 按 group 收集字段
  const groups: Record<string, { key: string; label: string; value: string }[]> = {};

  // 1. 处理顶层字段（vehicleType, manufacturer, energyType, releaseDate, yearRange）
  const topFields: { key: string; label: string; value: string }[] = [];
  for (const k of ["vehicleType", "manufacturer", "energyType", "releaseDate", "yearRange"]) {
    if (specs[k] && !isEmpty(specs[k])) {
      topFields.push({ key: k, label: SPECS_KEY_LABEL[k] || k, value: fmtSpecVal(specs[k]) });
    }
  }
  if (topFields.length > 0) {
    groups["basic"] = topFields;
  }

  // 2. 处理子对象（engine, transmission, body, chassis, safety, ...）
  for (const [sectionKey, sectionVal] of Object.entries(specs)) {
    if (typeof sectionVal !== "object" || sectionVal === null || Array.isArray(sectionVal)) continue;
    const groupKey = SPECS_KEY_TO_GROUP[sectionKey];
    if (!groupKey) continue;

    const fields: { key: string; label: string; value: string }[] = [];
    for (const [k, v] of Object.entries(sectionVal as Record<string, any>)) {
      if (isEmpty(v)) continue;
      // mirrors 子对象的 key 加前缀避免与 seats 重复
      const lookupKey = sectionKey === "mirrors" ? `mirror_${k}` : k;
      const label = SPECS_KEY_LABEL[lookupKey] || SPECS_KEY_LABEL[k] || k;
      fields.push({ key: k, label, value: fmtSpecVal(v) });
    }

    if (fields.length > 0) {
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(...fields);
    }
  }

  // 3. 按 GROUP_ORDER 排序
  const orderedGroups = GROUP_ORDER.filter(g => groups[g] && groups[g].length > 0);

  if (orderedGroups.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-sm font-bold text-gray-800 mb-3">📊 详细参数</h3>
      <div className="space-y-2">
        {orderedGroups.map((gKey, idx) => {
          const meta = GROUP_META[gKey] || { label: gKey, icon: "📋" };
          const fields = groups[gKey];
          return (
            <details key={gKey} className="bg-gray-50 rounded-xl border border-gray-100" open={idx < 3}>
              <summary className="px-4 py-2.5 cursor-pointer text-sm font-semibold text-gray-700 hover:text-gray-900 select-none">
                {meta.icon} {meta.label}
                <span className="text-xs text-gray-400 ml-2">({fields.length})</span>
              </summary>
              <div className="px-4 pb-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                {fields.map(f => (
                  <React.Fragment key={f.key}>
                    <span className="text-gray-400">{f.label}</span>
                    <span className="text-gray-700 truncate">{f.value}</span>
                  </React.Fragment>
                ))}
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
