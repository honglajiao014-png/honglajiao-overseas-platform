import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

const vehicles: Record<string, any> = {
  "audiq3-2022-20260603": {
    title: "Audi Q3 2022 35 TFSI",
    brand: "Audi",
    model: "Q3",
    price: 18500,
    year: 2022,
    mileage: "35,000 km",
    transmission: "Automatic",
    fuel: "Petrol",
    steering: "LHD",
    color: "White",
    location: "Chengdu, China",
    description:
      "Excellent condition, original paint, no accident history. Real photos available. Third-party inspection can be arranged anytime. This Audi Q3 has been dealer-maintained with full service records.",
    features: [
      "Panoramic Sunroof",
      "Reverse Camera",
      "Cruise Control",
      "Power Seats",
      "Multi-function Steering",
      "Automatic Climate Control",
      "LED Headlights",
      "Parking Sensors",
    ],
  },
  "wulinghongguangs3-2018-20260603": {
    title: "Wuling Hongguang S3 2018 1.5L",
    brand: "Wuling",
    model: "Hongguang S3",
    price: 4200,
    year: 2018,
    mileage: "52,000 km",
    transmission: "Manual",
    fuel: "Petrol",
    steering: "LHD",
    color: "Silver",
    location: "Liuzhou, China",
    description:
      "One-owner vehicle, regularly serviced, no major repairs. Economical and practical — ideal for African and Central Asian markets. Seats 7 passengers.",
    features: ["7 Seats", "Air Conditioning", "ABS", "Power Windows", "Central Locking"],
  },
};

export async function generateStaticParams() {
  return Object.keys(vehicles).map((slug) => ({ slug }));
}

function parseSpecToKV(specJson: any): { category: string; items: { label: string; value: string }[] }[] {
  if (!specJson || typeof specJson !== "object") return [];
  const categories: { category: string; items: { label: string; value: string }[] }[] = [];
  const catNames: Record<string, string> = {
    engine: "Engine", transmission: "Transmission", body: "Dimensions",
    chassis: "Chassis & Steering", safety: "Safety", exterior: "Exterior",
    interior: "Interior", seats: "Seats", media: "Multimedia",
    lights: "Lights", mirrors: "Mirrors", wipers: "Wipers",
    ac: "Climate Control",
  };
  const labelMap: Record<string, string> = {
    model: "Engine Model", intake: "Intake", displacement: "Displacement (L)", layout: "Cylinder Layout", cylinders: "Cylinders",
    maxPowerKw: "Max Power (kW)", maxPowerPs: "Max Power (Ps)", maxTorque: "Max Torque (N·m)",
    maxPowerRpm: "Power RPM", maxTorqueRpm: "Torque RPM", fuelGrade: "Fuel Grade", fuelSupply: "Fuel Supply",
    headMaterial: "Head Material", blockMaterial: "Block Material", valvesPerCylinder: "Valves per Cylinder", valveTrain: "Valve Train",
    type: "Type", description: "Description", gears: "Gears",
    form: "Body Type", doors: "Doors", seats: "Seats", wheelbase: "Wheelbase (mm)",
    length: "Length (mm)", width: "Width (mm)", height: "Height (mm)",
    fuelTank: "Fuel Tank (L)", curbWeight: "Curb Weight (kg)", fuelEconomy: "Fuel Economy (L/100km)",
    drive: "Drive", frontSuspension: "Front Suspension", rearSuspension: "Rear Suspension",
    frontBrake: "Front Brakes", rearBrake: "Rear Brakes", steeringAssist: "Steering Assist",
    structure: "Structure", parkingBrake: "Parking Brake", frontTire: "Front Tires", rearTire: "Rear Tires",
    spareTire: "Spare Tire", warranty: "Warranty",
    driverAirbag: "Driver Airbag", frontSideAirbags: "Side Airbags", abs: "ABS",
    cruiseControl: "Cruise Control", adaptiveCruise: "Adaptive Cruise", rearRadar: "Rear Radar", frontRadar: "Front Radar",
    panoramicCamera: "360° Camera", hillAssist: "Hill Assist", autoHold: "Auto Hold",
    sunroof: "Sunroof", panoramicRoof: "Panoramic Roof", wheels: "Wheels",
    multiFunctionSteering: "Multi-function Steering", fullLCDCluster: "Digital Cluster",
    material: "Material", heating: "Heating", ventilation: "Ventilation",
    screen: "Display", bluetooth: "Bluetooth", speakers: "Speakers",
    daytimeRunning: "Daytime Running", autoHeadlights: "Auto Headlights", headlightAdjustable: "Headlight Adjustable", ledHeadlights: "LED Headlights",
    adjustment: "Power Adjustment", folding: "Auto Folding", autoDimming: "Auto Dimming", memory: "Memory",
    type_: "Type", rearVents: "Rear Vents", zoneControl: "Zone Control",
    motorPower: "Motor Power (kW)", motorTorque: "Motor Torque (N·m)", batteryCapacity: "Battery", range: "Range",
    acceleration: "0-100 km/h", energyType: "Energy Type",
  };

  for (const [catKey, items] of Object.entries(specJson)) {
    const catName = catNames[catKey] || catKey;
    const kvItems: { label: string; value: string }[] = [];
    if (typeof items === "object") {
      for (const [key, val] of Object.entries(items as object)) {
        const label = labelMap[key] || key;
        let displayVal = "";
        if (typeof val === "boolean") displayVal = val ? "●" : "—";
        else if (val === "可选") displayVal = "Optional";
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
        <main className="container-wide py-32 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-400 mb-2">Vehicle Not Found</h1>
          <Link href="/cars" className="btn btn-primary px-6 py-3 rounded-xl text-sm mt-4">Back to Vehicles</Link>
        </main>
        <Footer />
      </>
    );
  }

  // Fetch spec from DB
  let specJson: any = null;
  try {
    const specId = `${vehicle.brand}-${vehicle.model}-${vehicle.year}-${vehicle.year}`.toLowerCase().replace(/\s+/g, "-");
    const spec = await prisma.vehicleSpec.findUnique({ where: { id: specId } });
    if (spec?.specs && typeof spec.specs === "string") {
      specJson = JSON.parse(spec.specs);
    }
  } catch {}

  const specCategories = parseSpecToKV(specJson);

  return (
    <>
      <Header />
      <main className="bg-gray-50">
        {/* Breadcrumb */}
        <div className="container-wide py-4">
          <nav className="flex items-center gap-2 text-xs text-gray-400">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/cars" className="hover:text-primary transition-colors">Vehicles</Link>
            <span>/</span>
            <span className="text-gray-600 font-semibold">{vehicle.brand} {vehicle.model} {vehicle.year}</span>
          </nav>
        </div>

        <div className="container-wide pb-16">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Photos + Specs */}
            <div className="lg:col-span-2 space-y-8">
              {/* Photo Gallery */}
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="aspect-[16/9] img-placeholder">
                  <div className="text-center">
                    <div className="text-6xl mb-3 opacity-15">🚘</div>
                    <div className="text-lg font-semibold opacity-40">{vehicle.brand} {vehicle.model}</div>
                    <div className="text-sm opacity-25 mt-1">{vehicle.year} · Photo Gallery</div>
                  </div>
                </div>
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="w-24 h-20 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-xs text-gray-400 border-2 border-transparent hover:border-primary/30 cursor-pointer transition-colors">
                      View {i}
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-lg font-extrabold text-gray-900 mb-4">Vehicle Description</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{vehicle.description}</p>

                {vehicle.features?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-bold text-gray-900 mb-3">Key Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {vehicle.features.map((f: string) => (
                        <span key={f} className="badge badge-success text-xs">{f}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Vehicle Specs */}
              {specCategories.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <h2 className="text-lg font-extrabold text-gray-900 mb-6">Technical Specifications</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {specCategories.map((cat) => (
                      <div key={cat.category} className="bg-gray-50 rounded-xl p-4 hover:shadow-sm transition-shadow">
                        <h3 className="text-[11px] font-extrabold text-gray-900 uppercase tracking-wider mb-3 pb-2 border-b border-gray-200">
                          {cat.category}
                        </h3>
                        <div className="space-y-2">
                          {cat.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-xs gap-3">
                              <span className="text-gray-500 min-w-0">{item.label}</span>
                              <span className={`font-semibold text-right whitespace-nowrap ${
                                item.value === "●" ? "text-success" :
                                item.value === "Optional" ? "text-gray-400" :
                                "text-gray-800"
                              }`}>{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Info & Actions Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-24">
                <h1 className="text-xl font-extrabold text-gray-900 leading-tight mb-4">
                  {vehicle.title}
                </h1>

                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-extrabold text-danger">${vehicle.price.toLocaleString()}</span>
                  <span className="text-xs text-gray-400">FOB</span>
                </div>
                <p className="text-[11px] text-gray-400 mb-6">Price excludes shipping &amp; destination charges</p>

                {/* Quick Info Grid */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {[
                      { k: "Year", v: vehicle.year },
                      { k: "Mileage", v: vehicle.mileage },
                      { k: "Transmission", v: vehicle.transmission },
                      { k: "Fuel", v: vehicle.fuel },
                      { k: "Steering", v: vehicle.steering },
                      { k: "Color", v: vehicle.color },
                      { k: "Location", v: vehicle.location },
                    ].map(({ k, v }) => (
                      <div key={k} className="flex flex-col gap-0.5 py-2 px-2 bg-white rounded-lg">
                        <span className="text-gray-400 text-[10px] uppercase tracking-wider">{k}</span>
                        <span className="font-bold text-gray-800">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <Link
                    href={`/inquiry?vehicle=${slug}&brand=${vehicle.brand}&model=${vehicle.model}&year=${vehicle.year}`}
                    className="btn btn-accent w-full py-3.5 rounded-xl text-sm font-bold"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Submit Inquiry
                  </Link>

                  <a
                    href="https://wa.me/8615208423621"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold border-2 border-green-500 text-green-600 hover:bg-green-50 transition-all"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    WhatsApp
                  </a>

                  <a
                    href="tel:+8615208423621"
                    className="btn btn-outline w-full py-3 rounded-xl text-sm font-bold"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    +86 152 0842 3621
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
