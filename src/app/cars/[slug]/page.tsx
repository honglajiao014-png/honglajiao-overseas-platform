import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

const vehicles: Record<string, any> = {
  "audiq3-2022-20260603": {
    title: "奥迪Q3 2022款 35 TFSI 进取动感型",
    brand: "奥迪", model: "Q3",
    price: 18500, year: 2022, mileage: "35,000 km",
    transmission: "自动", fuel: "汽油", steering: "LHD", color: "白色", location: "成都",
    description: "车辆状况极佳，原版原漆，无事故记录。实车照片已拍摄，随时可安排第三方检测。",
    features: ["天窗", "倒车影像", "定速巡航", "电动座椅", "多功能方向盘", "自动空调"],
  },
  "wulinghongguangs3-2018-20260603": {
    title: "五菱宏光S3 2018款 1.5L 手动标准型 国V",
    brand: "五菱", model: "宏光S3",
    price: 4200, year: 2018, mileage: "52,000 km",
    transmission: "手动", fuel: "汽油", steering: "LHD", color: "银色", location: "柳州",
    description: "家用一手车，定期保养，无大修记录。经济实惠，适合非洲及中亚市场。",
    features: ["7座", "空调", "ABS防抱死", "电动车窗", "中控锁"],
  },
};

export async function generateStaticParams() {
  return Object.keys(vehicles).map((slug) => ({ slug }));
}

// Parse spec JSON into categorized key-value pairs for display
function parseSpecToKV(specJson: any): { category: string; items: { label: string; value: string }[] }[] {
  if (!specJson || typeof specJson !== "object") return [];
  const categories: { category: string; items: { label: string; value: string }[] }[] = [];
  const catNames: Record<string, string> = {
    engine: "发动机", transmission: "变速箱", body: "车身尺寸",
    chassis: "底盘转向", safety: "安全配置", exterior: "外部配置",
    interior: "内部配置", seats: "座椅配置", media: "多媒体",
    lights: "灯光配置", mirrors: "后视镜", wipers: "雨刷",
    ac: "空调系统",
  };
  const labelMap: Record<string, string> = {
    model: "发动机型号", intake: "进气形式", displacement: "排量(L)", layout: "气缸排列", cylinders: "气缸数",
    maxPowerKw: "最大功率(kW)", maxPowerPs: "最大马力(Ps)", maxTorque: "最大扭矩(N·m)",
    maxPowerRpm: "最大功率转速", maxTorqueRpm: "最大扭矩转速", fuelGrade: "燃油标号", fuelSupply: "供油方式",
    headMaterial: "缸盖材料", blockMaterial: "缸体材料", valvesPerCylinder: "每缸气门数", valveTrain: "配气机构",
    type: "变速箱类型", description: "变速箱描述", gears: "挡位个数",
    form: "车身形式", doors: "车门数", seats: "座位数", wheelbase: "轴距(mm)",
    length: "长度(mm)", width: "宽度(mm)", height: "高度(mm)",
    fuelTank: "油箱容积(L)", curbWeight: "整备质量(kg)", fuelEconomy: "油耗(L/100km)",
    drive: "驱动方式", frontSuspension: "前悬架", rearSuspension: "后悬架",
    frontBrake: "前制动器", rearBrake: "后制动器", steeringAssist: "转向助力",
    structure: "车体结构", parkingBrake: "驻车制动", frontTire: "前轮胎", rearTire: "后轮胎",
    spareTire: "备胎", warranty: "整车质保",
    driverAirbag: "驾驶座安全气囊", frontSideAirbags: "前排侧气囊", abs: "ABS防抱死",
    cruiseControl: "定速巡航", adaptiveCruise: "自适应巡航", rearRadar: "后雷达", frontRadar: "前雷达",
    panoramicCamera: "全景摄像头", hillAssist: "上坡辅助", autoHold: "自动驻车",
    sunroof: "电动天窗", panoramicRoof: "全景天窗", wheels: "铝合金轮毂",
    multiFunctionSteering: "多功能方向盘", fullLCDCluster: "全液晶仪表盘",
    material: "座椅材质", heating: "座椅加热", ventilation: "座椅通风",
    screen: "中控屏", bluetooth: "蓝牙", speakers: "扬声器",
    daytimeRunning: "日间行车灯", autoHeadlights: "自动头灯", headlightAdjustable: "大灯高度可调", ledHeadlights: "LED大灯",
    adjustment: "后视镜电动调节", folding: "锁车自动折叠", autoDimming: "自动防眩目", memory: "后视镜记忆",
    type_: "空调", rearVents: "后座出风口", zoneControl: "温度分区控制",
    motorPower: "电机功率(kW)", motorTorque: "电机扭矩(N·m)", batteryCapacity: "电池容量", range: "续航里程",
    acceleration: "0-100加速", energyType: "能源形式",
  };

  for (const [catKey, items] of Object.entries(specJson)) {
    const catName = catNames[catKey] || catKey;
    const kvItems: { label: string; value: string }[] = [];
    if (typeof items === "object") {
      for (const [key, val] of Object.entries(items as object)) {
        const label = labelMap[key] || key;
        let displayVal = "";
        if (typeof val === "boolean") displayVal = val ? "●" : "○";
        else if (val === "可选") displayVal = "○";
        else displayVal = String(val);
        kvItems.push({ label, value: displayVal });
      }
    }
    if (kvItems.length > 0) categories.push({ category: catName, items: kvItems });
  }
  return categories;
}

export default async function CarDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vehicle = vehicles[slug];
  if (!vehicle) {
    return (
      <>
        <Header />
        <main className="max-w-[1600px] mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-guazi-dark mb-4">Vehicle Not Found</h1>
          <Link href="/cars" className="text-guazi-green hover:underline">← Back to All Vehicles</Link>
        </main>
        <Footer />
      </>
    );
  }

  // Try to get spec from DB
  let specJson: any = null;
  try {
    const spec = await prisma.vehicleSpec.findFirst({
      where: { brand: vehicle.brand, model: vehicle.model },
    });
    if (spec) specJson = JSON.parse(spec.specs);
  } catch { /* no DB connection */ }

  const specCategories = parseSpecToKV(specJson);
  const infoItems = [
    { label: "厂商", value: specJson ? (specJson.engine?.model ? "一汽奥迪" : vehicle.brand) : vehicle.brand },
    { label: "生产方式", value: vehicle.type || "乘用车" },
    { label: "上市时间", value: `${vehicle.year}` },
    { label: "能源形式", value: vehicle.fuel || "汽油" },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen flex flex-col">
        <div className="flex-1 max-w-[1600px] mx-auto px-4 py-8 w-full">
          {/* Breadcrumb */}
          <div className="text-xs text-gray-400 mb-5">
            <Link href="/" className="hover:text-guazi-green">Home</Link>
            <span className="mx-1.5">/</span>
            <Link href="/cars" className="hover:text-guazi-green">All Vehicles</Link>
            <span className="mx-1.5">/</span>
            <span className="text-gray-600">{vehicle.brand}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Images */}
            <div className="lg:col-span-2">
              <div className="aspect-[16/10] bg-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-lg mb-3">
                [{vehicle.brand} {vehicle.model} {vehicle.year}]
              </div>
              <div className="flex gap-2 p-3 overflow-x-auto">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-20 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-xs text-gray-400">Photo {i}</div>
                ))}
              </div>
            </div>

            {/* Right: Info Card */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-20">
                <h1 className="text-lg font-bold text-guazi-dark leading-tight mb-3">{vehicle.title}</h1>

                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-2xl font-bold text-guazi-red">${vehicle.price.toLocaleString()}</span>
                  <span className="text-xs text-gray-400">FOB China</span>
                </div>
                <p className="text-xs text-gray-500 mb-4">Price excludes shipping & destination charges</p>

                {/* Info grid */}
                <div className="info-grid mb-5 bg-gray-50 rounded-xl p-4">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { k: "Year", v: vehicle.year },
                      { k: "Mileage", v: vehicle.mileage },
                      { k: "Transmission", v: vehicle.transmission },
                      { k: "Fuel", v: vehicle.fuel },
                      { k: "Steering", v: vehicle.steering },
                      { k: "Color", v: vehicle.color },
                      { k: "Location", v: vehicle.location },
                    ].map(({ k, v }) => (
                      <div key={k} className="flex justify-between py-1.5 border-b border-gray-100 last:border-0">
                        <span className="text-gray-500">{k}</span>
                        <span className="font-semibold text-gray-800">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/inquiry?vehicle=${slug}&brand=${vehicle.brand}&model=${vehicle.model}&year=${vehicle.year}`}
                  className="block w-full text-center bg-guazi-green text-white py-3 rounded-lg font-bold text-sm hover:bg-guazi-green-dark transition-all mb-3"
                >
                  Submit Inquiry
                </Link>

                <a href="tel:+8613877284681"
                  className="block w-full text-center border border-guazi-green text-guazi-green py-2.5 rounded-lg text-sm font-bold hover:bg-guazi-green-light transition-all">
                  +86 138 7728 4681
                </a>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-8 max-w-3xl">
            <h2 className="text-base font-bold text-guazi-dark mb-4">Vehicle Description</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-8">{vehicle.description}</p>

            {vehicle.features?.length > 0 && (
              <>
                <h2 className="text-base font-bold text-guazi-dark mb-3">Features</h2>
                <div className="flex flex-wrap gap-2 mb-8">
                  {vehicle.features.map((f: string) => (
                    <span key={f} className="text-sm text-guazi-green bg-guazi-green-light px-3 py-2 rounded-lg">{f}</span>
                  ))}
                </div>
              </>
            )}

            {/* Vehicle Specs from DB - liangboss style */}
            {specCategories.length > 0 && (
              <div className="mb-8">
                <h2 className="text-base font-bold text-guazi-dark mb-4">Vehicle Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {specCategories.map((cat) => (
                    <div key={cat.category} className="bg-gray-50 rounded-xl p-4">
                      <h3 className="text-xs font-bold text-guazi-dark uppercase tracking-wider mb-3 pb-2 border-b border-gray-200">
                        {cat.category}
                      </h3>
                      <div className="space-y-1.5">
                        {cat.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs">
                            <span className="text-gray-500">{item.label}</span>
                            <span className={`font-semibold ${item.value === "●" ? "text-guazi-green" : item.value === "○" ? "text-gray-300" : "text-gray-800"}`}>
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
