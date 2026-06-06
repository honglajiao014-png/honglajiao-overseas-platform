"use client";

import { useT, T } from "@/i18n/useT";

export function Footer() {
  const t = useT();

  return (
    <footer className="bg-[#1a1a1a] text-white">
      <div className="max-w-[1400px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo + 描述 */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/logo.png"
                alt="ChinaCarExport"
                className="w-10 h-10 rounded-xl object-cover"
              />
              <div>
                <div className="text-sm font-bold text-white">ChinaCarExport</div>
                <div className="text-[10px] text-gray-500">FROM CHINA TO THE WORLD</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t(T.footer.bottomTag)}
            </p>
          </div>

          {/* 全部车源 */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">{t(T.footer.vehicles)}</h3>
            <ul className="space-y-2.5">
              <li><a href="/cars" className="text-sm text-gray-400 hover:text-primary transition-colors">{t(T.footer.allVehicles)}</a></li>
              <li><a href="/inquiry" className="text-sm text-gray-400 hover:text-primary transition-colors">{t(T.footer.contactUs)}</a></li>
              <li><a href="/blog" className="text-sm text-gray-400 hover:text-primary transition-colors">{t(T.header.blog)}</a></li>
            </ul>
          </div>

          {/* 咨询热线 */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">{t(T.footer.contactUs)}</h3>
            <ul className="space-y-2.5">
              <li>
                <a href="tel:+8615208423621" className="text-sm text-gray-400 hover:text-primary transition-colors">
                  +86 152 0842 3621
                </a>
              </li>
              <li>
                <a href="mailto:info@honglajiao1688.com" className="text-sm text-gray-400 hover:text-primary transition-colors">
                  info@honglajiao1688.com
                </a>
              </li>
            </ul>
          </div>

          {/* 关于我们 */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">{t(T.footer.company)}</h3>
            <ul className="space-y-2.5">
              <li><a href="/about" className="text-sm text-gray-400 hover:text-primary transition-colors">{t(T.resources.aboutUs)}</a></li>
              <li><a href="/contact" className="text-sm text-gray-400 hover:text-primary transition-colors">{t(T.footer.contactUs)}</a></li>
              <li><a href="/services" className="text-sm text-gray-400 hover:text-primary transition-colors">{t(T.footer.exportProcess)}</a></li>
            </ul>
          </div>
        </div>

        {/* 底部版权 */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">{t(T.footer.copyright)}</p>
          <div className="flex items-center gap-4">
            <a href="/blog" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">{t(T.header.blog)}</a>
            <a href="/about" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">{t(T.resources.aboutUs)}</a>
            <a href="/contact" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">{t(T.footer.contactUs)}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function ResourceSection() {
  return null;
}
