"use client";

import { useT, T } from "@/i18n/useT";
import { useLang } from "@/i18n/LangContext";

const WHATSAPP_NUMBER = "+1 310-290-1842"; // TODO: 替换为实际 WhatsApp 号码
const EMAIL = "info@honglajiao1688.com";

export function Footer() {
  const t = useT();
  const { lang } = useLang();
  const isRtl = lang === "ar";

  const linkColumns = [
    {
      title: t(T.footer.vehicles),
      links: [
        { label: t(T.footer.allVehicles), href: "/cars" },
        { label: t(T.footer.usedCars), href: "/cars?type=Used+Passenger+Car" },
        { label: t(T.footer.evNewEnergy), href: "/cars?type=New+Energy+Vehicle" },
        { label: t(T.footer.commercialVehicles), href: "/cars?type=Truck+%2F+Van" },
      ],
    },
    {
      title: t(T.footer.machinery),
      links: [
        { label: t(T.footer.machinery), href: "/machinery" },
        { label: t(T.footer.africaMarkets), href: "/countries" },
        { label: t(T.footer.nigeria), href: "/countries/nigeria" },
        { label: t(T.footer.kenya), href: "/countries/kenya" },
        { label: t(T.footer.ghana), href: "/countries/ghana" },
      ],
    },
    {
      title: t(T.footer.services),
      links: [
        { label: t(T.footer.vehicleInspection), href: "/services" },
        { label: t(T.footer.exportProcess), href: "/services" },
        { label: t(T.footer.logisticsShipping), href: "/services" },
        { label: t(T.footer.dealerRegistration), href: "/register" },
      ],
    },
    {
      title: t(T.footer.company),
      links: [
        { label: t(T.nav.about), href: "/about" },
        { label: t(T.nav.contact), href: "/contact" },
        { label: t(T.nav.inquiry), href: "/inquiry" },
        { label: t(T.misc.blog), href: "/blog" },
      ],
    },
  ];

  return (
    <footer className="bg-[#1a1a1a] text-white">
      {/* 信任数字卡片 */}
      <div className="border-b border-gray-800">
        <div className="max-w-[1400px] mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 justify-center bg-white/5 rounded-xl px-6 py-4">
              <span className="text-2xl">🚗</span>
              <div>
                <div className="text-lg font-bold text-white">2,500+</div>
                <div className="text-sm text-gray-400">Verified Vehicles</div>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center bg-white/5 rounded-xl px-6 py-4">
              <span className="text-2xl">🌍</span>
              <div>
                <div className="text-lg font-bold text-white">30+</div>
                <div className="text-sm text-gray-400">Countries Served</div>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center bg-white/5 rounded-xl px-6 py-4">
              <span className="text-2xl">✅</span>
              <div>
                <div className="text-lg font-bold text-white">Verified</div>
                <div className="text-sm text-gray-400">Supplier Status</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 快速链接 + 联系方式 */}
      <div className="max-w-[1400px] mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {linkColumns.map((col, i) => (
            <div key={i} className={isRtl ? "text-right" : "text-left"}>
              <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link, j) => (
                  <li key={j}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 联系方式 */}
        <div className={`flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-gray-800 ${isRtl ? "sm:flex-row-reverse" : ""}`}>
          <a
            href={`mailto:${EMAIL}`}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <span>📧</span>
            <span>{EMAIL}</span>
          </a>
          <span className="flex items-center gap-2 text-sm text-gray-400">
            <span>💬</span>
            <span>WhatsApp: {WHATSAPP_NUMBER}</span>
          </span>
        </div>
      </div>

      {/* 现有 logo + 版权 */}
      <div className="border-t border-gray-800">
        <div className="max-w-[1400px] mx-auto px-4 py-8">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="ChinaCarExport"
                className="w-8 h-8 rounded-xl object-cover"
              />
              <div>
                <div className="text-sm font-bold text-white">ChinaCarExport</div>
                <div className="text-[10px] text-gray-500">FROM CHINA TO THE WORLD</div>
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center">{t(T.footer.copyright)}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function ResourceSection() {
  return null;
}
