"use client";

import { useT, T } from "@/i18n/useT";

export function Footer() {
  const t = useT();

  return (
    <footer className="bg-[#1a1a1a] text-white">
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
    </footer>
  );
}

export function ResourceSection() {
  return null;
}
