// @ts-nocheck
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
  console.log("[CarDetailPage] rawSlug:", rawSlug, "decoded:", slug);
  const lang = await detectLang();
  const d = (k: Trans) => tr(k, lang);

  const kmU = d(I18N.km);
  const fmtKm = (km: number | null) => {
    if (!km) return "-";
    if (lang === "zh") return km >= 10000 ? `${(km / 10000).toFixed(1)}万${kmU}` : `${km.toLocaleString()}${kmU}`;
    return `${km.toLocaleString()} ${kmU}`;
  };

  // 先单独查 vehicle，不带 VehicleSpec 关联（避免 PrismaNeon adapter 兼容问题）
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
      specId: true, soldAt: true,
    },
  });

  console.log("[CarDetailPage] vehicle found:", !!vehicle);

  if (!vehicle) notFound();

  // 单独查 VehicleSpec（避免关联查询在 PrismaNeon adapter 下返回 null）
  let vehicleSpec: { specs: any } | null = null;
  if (vehicle.specId) {
    vehicleSpec = await prisma.vehicleSpec.findUnique({
      where: { id: vehicle.specId },
      select: { specs: true },
    });
    console.log("[CarDetailPage] vehicleSpec found:", !!vehicleSpec);
  }

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
          fuel: true, salePrice: true, images: true, soldAt: true,
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
  const rawSpecs = vehicleSpec?.specs || vehicle.specsJson;
  if (rawSpecs) {
    try {
      const parsed = typeof rawSpecs === "string" ? JSON.parse(rawSpecs) : rawSpecs;
      specsData = Array.isArray(parsed)
        ? parsed.reduce((best, cur) => {
            const curYear = parseInt(String(cur?.releaseDate || cur?.["上市时间"] || "").match(/\d{4}/)?.[0] || "0");
            const bestYear = parseInt(String(best?.releaseDate || best?.["上市时间"] || "").match(/\d{4}/)?.[0] || "0");
            return Math.abs(curYear - (vehicle.year || 0)) < Math.abs(bestYear - (vehicle.year || 0)) ? cur : best;
          }, parsed[0])
        : parsed;
    } catch {}

    // 用 vehicle 手动填写字段覆盖 XLSX 值
    if (specsData && typeof specsData === "object" && !Array.isArray(specsData)) {
      // 检测是否为中文扁平 JSON（XLSX 导入格式）
      const specKeys = Object.keys(specsData);
      const isFlat = specKeys.length > 0 && specKeys.some(k => /[一-鿿]/.test(k));

      if (isFlat) {
        // 1. 黑名单过滤：先删除不需要显示的字段
        const BLACKLIST = [
          "数据版本号", "匹配置信度", "最后更新时间", "补充次数", "搜索关键词",
          "生产方式", "车款全称", "整车质保",
          "发动机电子防盗", "车内中控锁", "遥控钥匙",
          "ABS防抱死", "安全带未系提示", "行车电脑显示屏",
          "蓝牙/车载电话", "日间行车灯", "铝合金轮毂",
          "制动力分配(EBD)", "刹车辅助(EBA)", "牵引力控制(TCS)", "车身稳定控制(ESP)",
        ];
        for (const k of specKeys) {
          if (BLACKLIST.includes(k) || k.includes("质保") || k.includes("保修")) {
            delete specsData[k];
          }
        }

        // 2. 配置类字段值统一为 "●"（安全气囊/天窗等布尔型配置）
        const CONFIG_KEYS = [
          "驾驶座安全气囊", "副驾驶安全气囊", "前排侧气囊", "后排侧气囊", "头部气帘",
          "膝部气囊", "并线辅助", "车道偏离预警", "车道保持",
          "主动刹车", "前雷达", "后雷达", "倒车影像", "全景影像", "定速巡航", "自适应巡航",
          "上坡辅助", "陡坡缓降", "自动驻车", "胎压监测", "夜视系统", "疲劳驾驶提示",
          "电动天窗", "全景天窗", "运动外观套件", "电动后备厢", "感应后备厢",
          "车顶行李架", "远程启动", "无钥匙启动", "无钥匙进入", "多功能方向盘", "方向盘换挡",
          "方向盘加热", "全液晶仪表盘", "HUD抬头显示", "手机无线充电", "座椅加热", "座椅通风",
          "座椅按摩", "电动座椅记忆", "后排杯架", "手机互联/映射", "语音识别",
          "车联网", "OTA升级", "车内氛围灯", "后座出风口", "温度分区控制", "PM2.5过滤",
          "车载冰箱", "自适应远近光", "自动头灯", "转向辅助灯", "前雾灯",
          "大灯高度可调", "大灯清洗", "LED大灯", "氙气大灯", "矩阵LED", "激光大灯",
          "感应雨刷", "防爆胎", "空气悬架", "后轮转向", "低速四驱", "差速锁",
        ];
        for (const k of CONFIG_KEYS) {
          if (specsData[k] !== undefined && specsData[k] !== null && specsData[k] !== "" && specsData[k] !== "-" && specsData[k] !== "无") {
            specsData[k] = "●";
          }
        }

        // 3. 车辆字段覆盖规格库（最后执行，确保 vehicle 实际值优先）
        const OVERRIDE_MAP: Record<string, string> = {
          displacement: "排量(L)",
          engineModel: "发动机型号",
          transmission: "变速箱类型",
          fuel: "能源形式",
          bodyStyle: "车身形式",
          seatCount: "座位数",
          driveType: "驱动方式",
          batteryType: "电池类型",
          rangeKm: "续航里程(km)",
          motorPowerKw: "电机功率(kW)",
        };

        for (const [vehKey, xlsxKey] of Object.entries(OVERRIDE_MAP)) {
          const val = (vehicle as any)[vehKey];
          if (val !== null && val !== undefined && val !== "" && val !== 0) {
            specsData[xlsxKey] = typeof val === "number" ? val : String(val);
          }
        }
      }
    }
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
                  {vehicle.soldAt ? (
                    <div className="text-4xl font-extrabold text-gray-400">
                      <span className="inline-block bg-gray-200 text-gray-500 px-4 py-1 rounded-full text-lg font-bold">Sold</span>
                    </div>
                  ) : (
                    <>
                      <div className="text-4xl font-extrabold text-danger">${vehicle.salePrice.toLocaleString()}</div>
                      <p className="text-xs text-gray-400 mt-1">{d(I18N.priceNote)}</p>
                      <div className="flex gap-4 mt-2 text-xs text-gray-500">
                        <span>{d(I18N.basePrice)}: ${vehicle.basePrice.toLocaleString()}</span>
                      </div>
                    </>
                  )}
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

                {!vehicle.soldAt && (
                  <div className="mt-6">
                    <a href={`/inquiry?slug=${encodeURIComponent(vehicle.brand + "-" + vehicle.model + "-" + vehicle.year)}`}
                      className="block w-full text-center bg-accent text-white py-3 rounded-xl font-bold hover:bg-accent-dark transition-all">{d(I18N.inquire)}</a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 规格参数 — 全宽展示 */}
          {specsData && <SpecsGroups specs={specsData} vehicleYear={vehicle.year} />}
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

/** 判断值是否为空（兼容中英文） */
function isEmpty(v: any): boolean {
  if (v === null || v === undefined) return true;
  if (typeof v === "string") return v === "" || v === "-" || v === "0" || v === "无" || v === "暂无";
  if (typeof v === "number") return v === 0;
  if (typeof v === "boolean") return false;
  return false;
}

/** 判断值是否为配置型（●/○/标配/选配/有/无 等） */
function isConfigStyle(v: any): boolean {
  if (typeof v === "boolean") return true;
  if (typeof v === "string") {
    const s = v.trim();
    if (["●", "○", "标配", "选配", "可选", "有", "无", "是", "否"].includes(s)) return true;
    if (/^[●○]$/.test(s)) return true;
  }
  return false;
}

/** 格式化值（兼容中英文） */
function fmtSpecVal(v: any): string {
  if (typeof v === "boolean") return v ? "●" : "-";
  if (typeof v === "string") {
    if (v === "标配" || v === "●") return "●";
    if (v === "选配" || v === "可选" || v === "○") return "○";
    // 处理 "值:●" / "值:○" 混合格式 → "值 ●" / "值 ○"
    const m = v.match(/^(.+):([●○])$/);
    if (m) return `${m[1]} ${m[2]}`;
    // 处理纯 ":●" / ":○" → "●" / "○"
    if (v === ":●") return "●";
    if (v === ":○") return "○";
  }
  return String(v);
}

/** 清洗参数型值：去掉 XLSX 里的多余文字，只保留数值+单位 */
function cleanParamVal(raw: string): string {
  // 去掉前导 "约"、尾随说明文字（括号内容保留，但去掉 "左右" "以上" "以下" 等）
  let s = raw.trim();
  // 去掉前导修饰词
  s = s.replace(/^(约|大约|大概|近|接近)\s*/i, "");
  // 去掉尾随模糊词
  s = s.replace(/\s*(左右|以上|以下|以内|以外|不到|出头)\s*$/g, "");
  // 如果整个值就是 "●" 或 "○"，原样返回
  if (s === "●" || s === "○") return s;
  return s;
}

/** 中文扁平 JSON 的分组定义 */
const CN_GROUPS: { name: string; icon: string; keys: string[] }[] = [
  { name: "基本信息", icon: "📋", keys: ["品牌", "车系", "厂商", "上市时间", "能源形式", "级别", "年款", "环保标准"] },
  { name: "发动机/动力", icon: "⚡", keys: ["进气形式", "排量(L)", "气缸排列形式", "气缸数", "每缸气门数", "配气机构", "最大马力(Ps)", "最大功率(kW)", "最大功率转速(rpm)", "最大扭矩(N·m)", "最大扭矩转速(rpm)", "燃油标号", "供油方式", "缸盖材料", "缸体材料", "工信部综合油耗(L/100km)", "电机类型", "电机功率(kW)", "电机扭矩(N·m)", "电池容量(kWh)", "电池类型", "续航里程(km)", "快充时间", "慢充时间"] },
  { name: "变速箱/驱动", icon: "🔧", keys: ["变速箱类型", "变速箱描述", "挡位个数", "驱动方式", "前悬架类型", "后悬架类型", "转向助力类型", "车体结构", "驻车制动类型", "前制动器类型", "后制动器类型", "前轮胎规格", "后轮胎规格", "备胎规格"] },
  { name: "车身尺寸", icon: "📐", keys: ["车身形式", "车门数", "座位数", "轴距(mm)", "长度(mm)", "宽度(mm)", "高度(mm)", "油箱容积(L)", "整备质量(kg)", "行李厢容积(L)", "货箱尺寸"] },
  { name: "安全配置", icon: "🛡️", keys: ["驾驶座安全气囊", "副驾驶安全气囊", "前排侧气囊", "后排侧气囊", "头部气帘", "膝部气囊", "并线辅助", "车道偏离预警", "车道保持", "主动刹车", "前雷达", "后雷达", "倒车影像", "全��影像", "定速巡航", "自适应巡航", "上坡辅助", "陡坡缓降", "自动驻车", "胎压监测", "夜视系统", "疲劳驾驶提示"] },
  { name: "外部配置", icon: "🚗", keys: ["天窗类型", "电动天窗", "全景天窗", "运动外观套件", "电动后备厢", "感应后备厢", "车顶行李架", "远程启动", "无钥匙启动", "无钥匙进入"] },
  { name: "内部配置", icon: "🎮", keys: ["方向盘材质", "方向盘调节", "多功能方向盘", "方向盘换挡", "方向盘加热", "全液晶仪表盘", "HUD抬头显示", "行车电脑", "手机无线充电", "座椅材质", "座椅调节", "座椅加热", "座椅通风", "座椅按摩", "电动座椅记忆", "后排座椅放倒", "前/后中央扶手", "后排杯架", "中控屏尺寸", "手机互联/映射", "语音识别", "车联网", "OTA升级", "扬声器数量", "车内氛围灯", "后座出风口", "温度分区控制", "PM2.5过滤", "车载冰箱"] },
  { name: "灯光配置", icon: "💡", keys: ["近光灯", "远光灯", "自适应远近光", "自动头灯", "转向辅助灯", "前雾灯", "大灯高度可调", "大灯清洗", "车内氛围灯"] },
];

function SpecsGroups({ specs, vehicleYear }: { specs: any; vehicleYear?: number }) {
  // 检测是否为中文扁平 JSON（XLSX 导入格式，键如 "品牌"、"排量(L)"）
  const keys = Object.keys(specs || {});
  const isChineseFlat = keys.length > 0 && keys.some(k => /[一-鿿]/.test(k));

  if (isChineseFlat) {
    // 中文扁平 JSON：按分组折叠渲染
    const fields = keys
      .filter(k => !isEmpty(specs[k]))
      .map(k => {
        const raw = specs[k];
        const formatted = fmtSpecVal(raw);
        // 配置型字段保留 ●/○，参数型字段清洗 XLSX 多余文字
        const value = isConfigStyle(raw) ? formatted : cleanParamVal(formatted);
        return { key: k, label: k, value };
      });

    if (fields.length === 0) return null;

    // 将字段按 CN_GROUPS 分组，未匹配的归入"其他"
    const grouped: Record<string, { icon: string; fields: typeof fields }> = {};
    const unmatched: typeof fields = [];
    for (const f of fields) {
      const g = CN_GROUPS.find(g => g.keys.includes(f.key));
      if (g) {
        if (!grouped[g.name]) grouped[g.name] = { icon: g.icon, fields: [] };
        grouped[g.name].fields.push(f);
      } else {
        unmatched.push(f);
      }
    }
    if (unmatched.length > 0) grouped["其他"] = { icon: "📋", fields: unmatched };

    const groupEntries = Object.entries(grouped);

    return (
      <div className="mt-6">
        <h3 className="text-sm font-bold text-gray-800 mb-3">📊 详细参数</h3>
        <div className="space-y-2">
          {groupEntries.map(([gName, g], idx) => (
            <details key={gName} className="bg-gray-50 rounded-xl border border-gray-100" open={idx < 1}>
              <summary className="px-4 py-2.5 cursor-pointer text-sm font-semibold text-gray-700 hover:text-gray-900 select-none">
                {g.icon} {gName}
                <span className="text-xs text-gray-400 ml-2">({g.fields.length})</span>
              </summary>
              <div className="px-4 pb-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                {g.fields.map(f => (
                  <React.Fragment key={f.key}>
                    <span className="text-gray-400">{f.label}</span>
                    <span className="text-gray-700 truncate">{f.value}</span>
                  </React.Fragment>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>
    );
  }

  // 按 group 收集字段
  const groups: Record<string, { key: string; label: string; value: string }[]> = {};

  // 1. 处理顶层字段（vehicleType, manufacturer, energyType, releaseDate, yearRange）
  const topFields: { key: string; label: string; value: string }[] = [];
  for (const k of ["vehicleType", "manufacturer", "energyType", "releaseDate", "yearRange"]) {
    if (specs[k] && !isEmpty(specs[k])) {
      const formatted = fmtSpecVal(specs[k]);
      const value = isConfigStyle(specs[k]) ? formatted : cleanParamVal(formatted);
      topFields.push({ key: k, label: SPECS_KEY_LABEL[k] || k, value });
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
      const formatted = fmtSpecVal(v);
      const value = isConfigStyle(v) ? formatted : cleanParamVal(formatted);
      fields.push({ key: k, label, value });
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
            <details key={gKey} className="bg-gray-50 rounded-xl border border-gray-100" open={idx < 1}>
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
