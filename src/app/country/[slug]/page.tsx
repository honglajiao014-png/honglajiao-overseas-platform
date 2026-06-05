"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useT } from "@/i18n/useT";
import { useLang } from "@/i18n/LangContext";
import { T } from "@/i18n/translations";

const COUNTRY_DATA: Record<string, {
  name: { en: string; fr: string; es: string; zh: string };
  capital: string; port: string; currency: string;
  drivingSide: string; ageLimit: string;
  dutyBreakdown: { category: string; rate: string }[];
  dutySummary: string;
  shippingTime: string; shippingRoute: string; shippingCost: string;
  popularModels: { brand: string; models: string }[];
  marketInsight: string;
  importProcess: { title: string; desc: string }[];
  importNotes: string[];
  evPolicy: string;
}> = {
  ethiopia: {
    name: { en: "Ethiopia", fr: "Éthiopie", es: "Etiopía", zh: "埃塞俄比亚" },
    capital: "Addis Ababa",
    port: "Djibouti (transit corridor)",
    currency: "ETB (Birr) — ~55 ETB = 1 USD",
    drivingSide: "Left-hand drive (LHD)",
    ageLimit: "≤ 7 years — strictly enforced",
    dutyBreakdown: [
      { category: "Engine < 1300cc", rate: "~35% CIF" },
      { category: "Engine 1300–1800cc", rate: "45–50% CIF" },
      { category: "Engine > 1800cc", rate: "50–55% CIF" },
      { category: "Luxury SUVs (>3000cc)", rate: "55–60% + surtax" },
      { category: "VAT (all vehicles)", rate: "15% on (CIF + duty)" },
      { category: "Excise Tax", rate: "5–10% (varies by type)" },
      { category: "Electric Vehicles", rate: "0% duty (incentive)" },
    ],
    dutySummary: "Total landed cost ≈ CIF × 1.6–2.0× for ICE vehicles. EVs exempt from duty and surtax, only 15% VAT applies — making them highly competitive.",
    shippingTime: "30–45 days (Shanghai → Djibouti → Addis Ababa)",
    shippingRoute: "Sea freight from Shanghai/Ningbo to Djibouti Port (~21 days), then truck/rail to Addis Ababa via the Ethio-Djibouti corridor (~3–5 days road, ~2 days rail).",
    shippingCost: "Container (2–4 vehicles): $2,500–$4,500. Ro-Ro: $800–$1,200/vehicle. Inland transport Djibouti→Addis: $400–$800/vehicle.",
    popularModels: [
      { brand: "Toyota", models: "Corolla, Hilux, Land Cruiser Prado, Vitz, RAV4" },
      { brand: "Hyundai", models: "Tucson, Santa Fe, Elantra, Accent" },
      { brand: "Kia", models: "Sportage, Sorento, Rio" },
      { brand: "Suzuki", models: "Alto, Swift, Vitara" },
      { brand: "BYD", models: "Atto 3, Dolphin, Song Plus (EV)" },
      { brand: "Sinotruk", models: "HOWO trucks (construction/commercial)" },
      { brand: "Nissan", models: "Sunny, X-Trail, Patrol" },
      { brand: "Honda", models: "Civic, CR-V, Fit" },
    ],
    marketInsight: "Ethiopia is Africa's 2nd most populous country (120M+). Used Toyota sedans dominate 70%+ of imports. Growing middle class in Addis Ababa drives SUV demand. Chinese brands (BYD, Sinotruk) growing rapidly. EV imports surged 300% in 2024 due to duty exemption. Key buyer segments: taxi fleets, government, NGO/embassy, and individual buyers.",
    importProcess: [
      { title: "Vehicle Selection & Inspection", desc: "Choose vehicle in China, provide VIN last 6 digits for history check. On-site inspection with photos/video before payment." },
      { title: "Document Preparation", desc: "Commercial invoice, packing list, Certificate of Origin (China-COMESA), bill of lading, proof of vehicle age < 7 years." },
      { title: "Shipping to Djibouti", desc: "Container or Ro-Ro from Shanghai/Ningbo/Tianjin. Transit insurance recommended." },
      { title: "Customs Clearance in Djibouti", desc: "Ethiopian customs has a dedicated office at Djibouti port. Duties assessed on CIF value per Ethiopian Customs Commission tariff book." },
      { title: "Inland Transport to Addis", desc: "Ethio-Djibouti Railway or truck convoy via Mille corridor. MODJO Dry Port near Addis is main customs clearance terminal." },
      { title: "Registration in Ethiopia", desc: "Obtain roadworthiness certificate from Transport Authority, pay annual vehicle tax (ETB 500–3,000 based on CC), register plates." },
    ],
    importNotes: [
      "Vehicle must be ≤ 7 years from date of manufacture, not just from registration year",
      "Right-hand drive (RHD) vehicles are banned — only LHD allowed",
      "Used vehicle inspection certificate required from exporting country",
      "COMESA Certificate of Origin reduces some duties for Chinese vehicles imported via Ethiopian trade agreements",
      "Bank letter of credit (LC) or Telegraphic Transfer (TT) advance payment required",
    ],
    evPolicy: "Ethiopia has Africa's most aggressive EV policy: zero import duty on EVs, 0% excise, only 15% VAT. Government targets 500,000 EVs by 2030. BYD and Geely assembly plants planned. EV charging infrastructure developing in Addis Ababa.",
  },
  nigeria: {
    name: { en: "Nigeria", fr: "Nigeria", es: "Nigeria", zh: "尼日利亚" },
    capital: "Abuja", port: "Lagos (Apapa / Tin Can)", currency: "NGN (Naira) — ~1,550 NGN = 1 USD",
    drivingSide: "Right-hand drive (RHD) — NOTE: Only RHD allowed!", ageLimit: "≤ 15 years — banned for vehicles older than 15 years",
    dutyBreakdown: [
      { category: "Import Duty", rate: "35% CIF" },
      { category: "Levy", rate: "15% CIF" },
      { category: "VAT", rate: "7.5% on (CIF + duty)" },
      { category: "Port Charges", rate: "~$200–500" },
      { category: "SONCAP (clearance cert)", rate: "~$150" },
    ],
    dutySummary: "Total landed cost ≈ CIF × 1.6–1.7×. Nigeria is the largest used car market in Africa importing ~300,000 units/year. Most cars sold at Ladipo and Berger markets in Lagos.",
    shippingTime: "35–50 days (Shanghai → Lagos Apapa)",
    shippingRoute: "Direct shipping from Shanghai/Ningbo to Lagos Apapa port. Container or Ro-Ro. Lagos port congestion can add 1–2 weeks.",
    shippingCost: "Ro-Ro: $1,500–2,200/vehicle. Container: $3,000–4,500 (2–4 vehicles).",
    popularModels: [
      { brand: "Toyota", models: "Corolla, Camry, RAV4, Highlander, Sienna" },
      { brand: "Honda", models: "Accord, CR-V, Pilot" },
      { brand: "Lexus", models: "RX 350, ES 350, GX 460" },
      { brand: "Hyundai", models: "Elantra, Tucson, Santa Fe" },
      { brand: "Kia", models: "Optima, Sorento, Sportage" },
      { brand: "Mercedes-Benz", models: "C-Class, E-Class, GLE" },
    ],
    marketInsight: "Nigeria is Africa's largest economy and biggest used car market (300K+ units/year). RHD-only regulation means cars must come from RHD sources. Major ports: Lagos Apapa and Tin Can Island. Cleared vehicles are sold at Ladipo (largest spare parts/used car market in West Africa). Heavy demand for Toyota (especially Camry and Corolla), Honda, and luxury SUVs.",
    importProcess: [
      { title: "SONCAP Certificate", desc: "Mandatory pre-shipment document. Vehicle must pass SON (Standards Organization of Nigeria) conformity assessment before shipping." },
      { title: "Shipping to Lagos", desc: "Ro-Ro or container from Chinese ports to Lagos Apapa or Tin Can Island. Expect 5–7 weeks total." },
      { title: "Customs Clearance", desc: "Submit Form M, Bill of Lading, SONCAP, invoice. Duties calculated on CIF by Nigeria Customs Service portal." },
      { title: "Destination Inspection", desc: "Physical inspection at port by Nigeria Customs. Vehicle value verified against market database." },
      { title: "Clearance & Registration", desc: "Pay duties + levy + VAT, obtain customs release, register with FRSC (Federal Road Safety Corps) for Nigerian plates." },
    ],
    importNotes: [
      "Nigeria is RHD — vehicles from China must be RHD specification (Japan/UK-style interior layout)",
      "16-year-old ban: vehicles older than 15 years from date of manufacture are prohibited",
      "SONCAP certificate mandatory before shipment — no exceptions",
      "Customs valuation uses own database, not invoice value — may assess higher than declared",
      "Chassis number (full VIN) verification required; tampered VIN = seizure & penalty",
      "Port demurrage is expensive after 14 free days — clear quickly",
    ],
    evPolicy: "EVs emerging slowly. Nigerian government removed import duty on EVs in 2024. However, charging infrastructure is minimal outside Lagos and Abuja. Market still dominated by ICE vehicles.",
  },
  ghana: {
    name: { en: "Ghana", fr: "Ghana", es: "Ghana", zh: "加纳" },
    capital: "Accra", port: "Tema", currency: "GHS (Cedi) — ~15.5 GHS = 1 USD",
    drivingSide: "Right-hand drive (RHD) — RHD only", ageLimit: "≤ 10 years — strict ban on vehicles older than 10 years",
    dutyBreakdown: [
      { category: "Import Duty", rate: "5–20% CIF" },
      { category: "VAT", rate: "15% on (CIF + duty)" },
      { category: "NHIL (Health Levy)", rate: "2.5%" },
      { category: "GETFund Levy", rate: "2.5%" },
      { category: "Processing Fee", rate: "1%" },
      { category: "ECOWAS Levy", rate: "0.5%" },
    ],
    dutySummary: "Total landed ≈ CIF × 1.3–1.5×. Ghana has relatively low duties compared to neighbors. Tema port is efficient with modern clearing systems.",
    shippingTime: "30–40 days (Shanghai → Tema)",
    shippingRoute: "Direct sea freight from Shanghai/Ningbo/Guangzhou to Tema port. Tema is the largest port in Ghana with good RO-RO facilities.",
    shippingCost: "Ro-Ro: $1,200–1,800/vehicle. Container: $2,500–3,800 (2–4 vehicles).",
    popularModels: [
      { brand: "Toyota", models: "Corolla, Camry, RAV4, Highlander, Vitz" },
      { brand: "Honda", models: "Accord, CR-V, Civic" },
      { brand: "Hyundai", models: "Elantra, Tucson, Santa Fe" },
      { brand: "Kia", models: "Sportage, Sorento, Rio" },
      { brand: "Nissan", models: "Altima, Qashqai, X-Trail" },
      { brand: "Ford", models: "Escape, Explorer, Ranger" },
    ],
    marketInsight: "Ghana is a stable, growing West African market with strong demand for used cars. After Nigeria's 2023 import ban on some used vehicles, Ghana became an alternative entry point. Toyota dominates, followed by Honda and Hyundai. The 10-year age limit makes 2016+ vehicles most desirable. Tema port is well-organized with bonded warehouse clearance option.",
    importProcess: [
      { title: "Vehicle Selection", desc: "Choose RHD vehicles ≤ 10 years old with clean VIN history. Pre-inspection recommended." },
      { title: "Pre-Shipment Inspection", desc: "Vehicle examined by GSA-approved inspector in China (or recognized equivalent) before loading." },
      { title: "Bill of Lading & Docs", desc: "Original B/L, commercial invoice, packing list, proof of age (deregistration cert)." },
      { title: "Customs Clearance at Tema", desc: "Use GCNet/ICUMS system for electronic declaration. Duties auto-calculated based on CC and year." },
      { title: "DVLA Registration", desc: "After customs release, register at Driver and Vehicle Licensing Authority (DVLA) for Ghanaian plates." },
    ],
    importNotes: [
      "RHD only — no exceptions for LHD vehicles even for diplomatic use",
      "10-year age limit strictly enforced — vehicle manufactured >10 years ago will be rejected",
      "Duty calculator available on ICUMS (Ghana Customs portal) — use it before importing to confirm landed cost",
      "ECOWAS Certificate of Origin reduces import duty for vehicles from ECOWAS member states",
      "Air conditioning highly desirable in Ghana market — non-A/C vehicles sell poorly",
    ],
    evPolicy: "Ghana government exempts EVs from import duty (2024 policy). Only VAT + levies apply (~20%). Charging stations are limited to Accra and Kumasi. EV market is small but growing rapidly.",
  },
  algeria: {
    name: { en: "Algeria", fr: "Algérie", es: "Argelia", zh: "阿尔及利亚" },
    capital: "Algiers", port: "Algiers (Alger), Oran, Skikda", currency: "DZD (Algerian Dinar) — ~135 DZD = 1 USD",
    drivingSide: "Left-hand drive (LHD)", ageLimit: "≤ 3 years — very strict! Only vehicles less than 3 years old can be imported",
    dutyBreakdown: [
      { category: "Customs Duty", rate: "15–30% CIF" },
      { category: "VAT", rate: "19% on (CIF + duty)" },
      { category: "Additional Tax", rate: "2%" },
      { category: "Vehicle Tax Card (vignette)", rate: "Annual: DZD 3,000–12,000" },
    ],
    dutySummary: "Total landed ≈ CIF × 1.4–1.6×. 3-year age limit is Africa's strictest — only near-new vehicles qualify. This makes sourcing expensive but yields high-margin deals on quality vehicles.",
    shippingTime: "28–35 days (Shanghai → Algiers)",
    shippingRoute: "Direct sea freight from Shanghai/Ningbo to Algiers port. RO-RO vessels available. Mediterranean route is relatively fast.",
    shippingCost: "Ro-Ro: $1,000–1,600/vehicle. Container: $2,000–3,200 (2–4 vehicles).",
    popularModels: [
      { brand: "Toyota", models: "Hilux, Corolla, RAV4, Land Cruiser Prado" },
      { brand: "Hyundai", models: "Tucson, Santa Fe, Elantra, i30" },
      { brand: "Volkswagen", models: "Golf, Tiguan, Passat" },
      { brand: "Renault", models: "Clio, Duster, Symbol" },
      { brand: "Peugeot", models: "208, 3008, 508" },
      { brand: "Chery", models: "Tiggo 4, Tiggo 7, Tiggo 8" },
      { brand: "BYD", models: "Atto 3, Dolphin, Seal" },
    ],
    marketInsight: "Algeria has a unique import policy: private individuals were banned from importing cars from 2014–2023. New regulations (2024+) now allow limited imports. The 3-year age limit is Africa's strictest, making nearly-new vehicles the only option. French brands (Renault, Peugeot) popular due to colonial history. Chinese brands (Chery, BYD, Geely) gaining market share rapidly since 2023. Government encourages local assembly — Chery and Geely have assembly plants in Algeria.",
    importProcess: [
      { title: "Vehicle Eligibility", desc: "Must be ≤ 3 years old. Electric and hybrid vehicles also allowed. Commercial vehicles have separate quota system." },
      { title: "Import License", desc: "Dealers need Ministry of Commerce import authorization. Individual imports require justification and bank letter." },
      { title: "Pre-Inspection", desc: "Vehicle must be inspected in China by an approved inspection agency before shipment." },
      { title: "Customs Clearance", desc: "Algerian Customs uses Sijilcom electronic system. Domiciliation bancaire required (bank guarantees import)." },
      { title: "Registration", desc: "Register at Wilaya (province) level, obtain 'carte grise' plates. Technical inspection (contrôle technique) every 2 years." },
    ],
    importNotes: [
      "3-year age limit — if the vehicle's manufacture date is even 3 years + 1 day ago, it will be rejected",
      "Domiciliation bancaire (bank guarantee letter) mandatory before shipping",
      "French-language documentation required (invoices, manuals, certifications)",
      "Import quotas exist — certain vehicle categories have annual limits",
      "Algerian ports (especially Algiers) have strict inspection — ensure all documents are in perfect order",
    ],
    evPolicy: "Algeria exempts EVs from the 3-year age limit? No — EVs must also be ≤ 3 years old. However, EV import duties are reduced (5% customs + 9% VAT = ~14% total). Government plans 15,000 charging stations by 2030.",
  },
  egypt: {
    name: { en: "Egypt", fr: "Égypte", es: "Egipto", zh: "埃及" },
    capital: "Cairo", port: "Alexandria, Port Said, Damietta", currency: "EGP (Egyptian Pound) — ~50 EGP = 1 USD",
    drivingSide: "Left-hand drive (LHD)", ageLimit: "No age limit for used cars — but must pass roadworthiness test",
    dutyBreakdown: [
      { category: "Customs Duty", rate: "40–135% (varies by CC)" },
      { category: "< 1600cc", rate: "~40%" },
      { category: "1600–2000cc", rate: "~80–100%" },
      { category: "> 2000cc", rate: "~135%" },
      { category: "VAT", rate: "14% on (CIF + duty)" },
      { category: "Development Fee", rate: "3%" },
    ],
    dutySummary: "Total landed ≈ CIF × 1.7–2.8× (huge range). Small-engine vehicles (under 1600cc) are most economical. Large-engine luxury cars face punitive duties. EV duties are significantly lower.",
    shippingTime: "25–35 days (Shanghai → Alexandria / Port Said)",
    shippingRoute: "Direct sea freight from Shanghai/Ningbo to Alexandria or Port Said. Suez Canal proximity ensures reliable routes. Port Said is a major RO-RO hub.",
    shippingCost: "Ro-Ro: $900–1,400/vehicle. Container: $1,800–2,800 (2–4 vehicles).",
    popularModels: [
      { brand: "Hyundai", models: "Elantra, Accent, Tucson, Santa Fe" },
      { brand: "Kia", models: "Cerato, Sportage, Seltos" },
      { brand: "Toyota", models: "Corolla, Yaris, Fortuner" },
      { brand: "Nissan", models: "Sunny, Sentra, Qashqai" },
      { brand: "Chery", models: "Tiggo 4, Tiggo 7, Arrizo 5" },
      { brand: "BYD", models: "Atto 3, Dolphin, F3" },
      { brand: "MG", models: "ZS, RX5, MG5" },
    ],
    marketInsight: "Egypt is the 2nd largest African car market. Government assembly programs (GB Auto, Nissan, Chery) mean many 'Egyptian' cars are actually CKD units from China. Massive population (110M+) drives continuous demand. Small-engine cars (≤1600cc) dominate due to lower duties. Chinese brands (Chery, BYD, MG) are growing extremely fast — Chery is now a top-5 brand in Egypt. Alexandria and Port Said ports are well-equipped for vehicle imports.",
    importProcess: [
      { title: "Vehicle Selection", desc: "Focus on ≤1600cc vehicles for best duty rates. LHD mandatory. Vehicle must be under importer's name in exporting country first." },
      { title: "CargoX / ACI Registration", desc: "Egypt's mandatory Advanced Cargo Information (ACI) system — register shipment on Nafeza platform before loading. CargoX blockchain seal required." },
      { title: "Pre-Shipment Documents", desc: "ACI number, commercial invoice with CargoX seal, packing list, CoO (Certificate of Origin) legalized by Egyptian embassy in China." },
      { title: "Customs Clearance", desc: "Egypt Customs uses Nafeza single-window system. Duties calculated on CIF. Inspection at port confirms vehicle matches ACI declaration." },
      { title: "Registration", desc: "Vehicle registered at Traffic Department (Morour). Requires customs release, insurance, technical inspection certificate." },
    ],
    importNotes: [
      "ACI (Advanced Cargo Information) system mandatory since 2022 — shipment without ACI number will be rejected at origin",
      "Certificate of Origin must be legalized/authenticated by Egyptian embassy or consulate in China",
      "CargoX blockchain digital seal required on all commercial documents",
      "Duty structure penalizes large engines — 1600cc is the key threshold",
      "Currency (EGP) has been volatile — quote prices in USD when possible",
    ],
    evPolicy: "Egypt offers reduced customs duties for EVs: 0% for fully electric vehicles under 2024 incentive program. Government targets 20% of new vehicles to be EVs by 2030. BYD, MG, and Geely are investing in Egyptian assembly and charging infrastructure.",
  },
  senegal: {
    name: { en: "Senegal", fr: "Sénégal", es: "Senegal", zh: "塞内加尔" },
    capital: "Dakar", port: "Dakar", currency: "XOF (CFA Franc) — ~600 XOF = 1 USD",
    drivingSide: "Left-hand drive (LHD)", ageLimit: "≤ 8 years — vehicles older than 8 years banned from import",
    dutyBreakdown: [
      { category: "Customs Duty", rate: "20% CIF" },
      { category: "VAT", rate: "18% on (CIF + duty)" },
      { category: "Statistical Tax", rate: "1%" },
      { category: "Community Levy (CEDEAO)", rate: "1%" },
      { category: "Registration Tax", rate: "~$50–200" },
    ],
    dutySummary: "Total landed ≈ CIF × 1.45×. Moderate duties make Senegal an attractive West African market. Dakar port is one of West Africa's best — efficient clearance, deep-water access.",
    shippingTime: "28–35 days (Shanghai → Dakar)",
    shippingRoute: "Direct sea freight from Shanghai/Guangzhou to Dakar port. Dakar is West Africa's westernmost major port, making transit fast from China. Some shipments go via Las Palmas transshipment.",
    shippingCost: "Ro-Ro: $1,100–1,700/vehicle. Container: $2,200–3,500 (2–4 vehicles).",
    popularModels: [
      { brand: "Toyota", models: "Corolla, Hilux, RAV4, Land Cruiser" },
      { brand: "Renault", models: "Clio, Duster, Megane, Kangoo" },
      { brand: "Peugeot", models: "208, 3008, Partner" },
      { brand: "Hyundai", models: "Tucson, Santa Fe, i10" },
      { brand: "Nissan", models: "Qashqai, X-Trail" },
      { brand: "Dongfeng", models: "Rich (pickup), SX6" },
    ],
    marketInsight: "Senegal is West Africa's most stable democracy and a key Francophone auto market. Toyota dominates, but French brands (Renault, Peugeot) have strong brand loyalty. Chinese brands growing — Dongfeng, Chery, and Sinotruk have dealerships. Dakar port serves as a re-export hub for Mali, Guinea-Bissau, and Gambia — many cars imported to Senegal get re-exported inland.",
    importProcess: [
      { title: "Vehicle Selection & Documents", desc: "Choose LHD vehicles ≤ 8 years old. Prepare invoice, packing list, Certificate of Origin, and deregistration certificate from China." },
      { title: "Shipping to Dakar", desc: "Ro-Ro or container from Shanghai/Guangzhou/Ningbo to Port Autonome de Dakar." },
      { title: "Customs Declaration", desc: "Use GAINDE (Senegalese Customs electronic system). Submit BSC (Bordereau de Suivi des Cargaisons) at origin before loading." },
      { title: "Physical Inspection", desc: "Customs inspection at Dakar port. Vehicle inspected for condition, age verification." },
      { title: "Registration", desc: "Register at DTT (Direction des Transports Terrestres). Technical inspection required for 'carte grise'." },
    ],
    importNotes: [
      "BSC (Bordereau de Suivi des Cargaisons) mandatory — filed online before vessel departure",
      "8-year age limit — vehicle manufactured >8 years ago will be rejected",
      "Dakar port efficient — average clearance 3–7 days (much faster than Lagos or Douala)",
      "CFA Franc pegged to EUR — exchange rate stable, good for long-term pricing",
      "French-language documents preferred — invoices in English may require translation",
    ],
    evPolicy: "Senegal has no specific EV duty reduction yet. Same duty rates apply (20% customs + 18% VAT). Government exploring EV incentives under new transport policy (2025-2030).",
  },
};

// Map slug to display name
const SLUG_MAP: Record<string, Record<string, string>> = {
  ethiopia: { en: "Ethiopia", fr: "Éthiopie", es: "Etiopía", zh: "埃塞俄比亚" },
};

export default function CountryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const t = useT();
  const { lang } = useLang();
  const data = COUNTRY_DATA[slug];

  if (!data) {
    return (
      <main className="min-h-screen flex flex-col">
        <Header />
        <section className="bg-dark py-20 flex-1 text-center">
          <h1 className="text-2xl font-bold text-white">{t(T.country.notFound)}</h1>
          <Link href="/" className="text-gold mt-4 inline-block">{t(T.misc.backHome)}</Link>
        </section>
        <Footer />
      </main>
    );
  }

  const name = (data.name as Record<string,string>)[lang] || data.name.en;

  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="bg-dark py-14 border-b border-gray-800">
        <div className="max-w-[1000px] mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            {t(T.country.heading)} {name}
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {t(T.country.contactUs)}
          </p>
          <Link href="/inquiry" className="inline-flex mt-6 px-8 py-3 bg-brand text-white rounded-lg font-bold text-sm hover:bg-brand-dark transition-all">
            {t(T.hero.submitBtn)}
          </Link>
        </div>
      </section>

      {/* Quick Facts */}
      <section className="bg-dark-soft py-8">
        <div className="max-w-[1000px] mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              [t(T.country.capital), data.capital],
              [t(T.country.port), data.port],
              [t(T.country.currency), data.currency],
              [t(T.country.driving), data.drivingSide],
              [t(T.country.ageLimit), data.ageLimit],
            ].map(([l, v]) => (
              <div key={l} className="bg-dark rounded-xl p-4 border border-gray-800">
                <p className="text-xs text-gray-500 mb-1">{l}</p>
                <p className="text-sm font-bold text-white leading-snug">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Market Insight */}
      <section className="bg-dark py-8">
        <div className="max-w-[1000px] mx-auto px-4">
          <div className="bg-dark-soft border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <span>📊</span> {t(T.country.marketOverview)}
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">{data.marketInsight}</p>
          </div>
        </div>
      </section>

      {/* Duty Breakdown */}
      <section className="bg-dark-soft py-8">
        <div className="max-w-[1000px] mx-auto px-4">
          <h2 className="text-xl font-extrabold text-white mb-6 text-center">{t(T.country.customsDuties)}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-dark rounded-xl border border-gray-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left px-4 py-3 text-xs text-gray-500 font-normal">{t(T.country.vehicleCategories)}</th>
                    <th className="text-right px-4 py-3 text-xs text-gray-500 font-normal">{t(T.country.dutyRate)}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.dutyBreakdown.map((d, i) => (
                    <tr key={i} className={i < data.dutyBreakdown.length - 1 ? "border-b border-gray-800/50" : ""}>
                      <td className="px-4 py-3 text-gray-300">{d.category}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={d.rate.includes("0%") ? "text-green-400 font-bold" : "text-gold font-bold"}>
                          {d.rate}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="space-y-4">
              <div className="bg-dark rounded-xl p-5 border border-gray-800">
                <p className="text-sm text-gray-400 leading-relaxed italic">"{data.dutySummary}"</p>
              </div>
              <div className="bg-brand/10 border border-brand/30 rounded-xl p-5">
                <h3 className="text-sm font-bold text-gold mb-2">⚡ {t(T.country.evPolicy)}</h3>
                <p className="text-xs text-gray-300 leading-relaxed">{data.evPolicy}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shipping */}
      <section className="bg-dark py-8">
        <div className="max-w-[1000px] mx-auto px-4">
          <h2 className="text-xl font-extrabold text-white mb-6 text-center">{t(T.country.shippingInfo)}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-dark-soft rounded-xl p-5 border border-gray-800">
              <p className="text-xs text-gray-500 mb-2">{t(T.country.transitTime)}</p>
              <p className="text-sm font-bold text-white">{data.shippingTime}</p>
            </div>
            <div className="bg-dark-soft rounded-xl p-5 border border-gray-800 md:col-span-2">
              <p className="text-xs text-gray-500 mb-2">{t(T.country.route)}</p>
              <p className="text-sm text-gray-300 leading-relaxed">{data.shippingRoute}</p>
            </div>
          </div>
          <div className="mt-4 bg-dark-soft rounded-xl p-5 border border-gray-800">
            <p className="text-xs text-gray-500 mb-2">{t(T.country.estimatedCost)}</p>
            <p className="text-sm text-gray-300 leading-relaxed">{data.shippingCost}</p>
          </div>
        </div>
      </section>

      {/* Import Process */}
      <section className="bg-dark-soft py-8">
        <div className="max-w-[1000px] mx-auto px-4">
          <h2 className="text-xl font-extrabold text-white mb-6 text-center">{t(T.country.importProcess)}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.importProcess.map((step, i) => (
              <div key={i} className="bg-dark rounded-xl p-5 border border-gray-800 relative">
                <span className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-brand text-white text-xs flex items-center justify-center font-bold">
                  {i + 1}
                </span>
                <h3 className="text-sm font-bold text-white mb-2 mt-1">{step.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-dark rounded-xl border border-yellow-900/50 p-5">
            <h3 className="text-sm font-bold text-gold mb-3">📋 {t(T.country.importantNotes)}</h3>
            <ul className="space-y-1.5">
              {data.importNotes.map((n, i) => (
                <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
                  <span className="text-gold shrink-0 mt-0.5">•</span>
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Popular Models */}
      <section className="bg-dark py-10">
        <div className="max-w-[1000px] mx-auto px-4">
          <h2 className="text-xl font-extrabold text-white mb-6 text-center">{t(T.country.popularModels)} in {name}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.popularModels.map((b) => (
              <div key={b.brand} className="bg-dark-soft rounded-xl p-4 border border-gray-800 hover:border-gold/30 transition-all">
                <p className="text-sm font-bold text-gold mb-2">{b.brand}</p>
                <p className="text-xs text-gray-400 leading-relaxed">{b.models}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-dark-soft py-12 border-t border-gray-800">
        <div className="max-w-[600px] mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-white mb-3">{t(T.country.readyToImport)} {name}?</h2>
          <p className="text-gray-400 text-sm mb-6">{t(T.country.contactUs)}</p>
          <Link href="/inquiry" className="inline-flex px-10 py-3 bg-brand text-white rounded-lg font-bold text-sm hover:bg-brand-dark transition-all shadow-lg shadow-brand/20">{t(T.hero.submitBtn)}</Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
