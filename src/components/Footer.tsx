"use client";

import Link from "next/link";
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
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-extrabold text-sm">
                CCE
              </div>
              <div>
                <div className="text-sm font-bold text-white">ChinaCarExport</div>
                <div className="text-[10px] text-gray-500">FROM CHINA TO THE WORLD</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              ChinaCarExport — 从中国采购真实可核验的二手车、商用车、新能源车和工程机械。报价前提供真实照片、实车验车和出口流程支持。
            </p>
          </div>

          {/* 全部车源 */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">全部车源</h3>
            <ul className="space-y-2.5">
              <li><Link href="/cars" className="text-sm text-gray-400 hover:text-primary transition-colors">全部车源</Link></li>
              <li><Link href="/inquiry" className="text-sm text-gray-400 hover:text-primary transition-colors">提交需求</Link></li>
              <li><Link href="/blog" className="text-sm text-gray-400 hover:text-primary transition-colors">博客</Link></li>
            </ul>
          </div>

          {/* 咨询热线 */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">咨询热线</h3>
            <ul className="space-y-2.5">
              <li>
                <a href="tel:+8613877284681" className="text-sm text-gray-400 hover:text-primary transition-colors">
                  +86 138 7728 4681
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
            <h3 className="text-sm font-bold text-white mb-4">关于我们</h3>
            <ul className="space-y-2.5">
              <li><Link href="/about" className="text-sm text-gray-400 hover:text-primary transition-colors">公司简介</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-400 hover:text-primary transition-colors">联系我们</Link></li>
              <li><Link href="/services" className="text-sm text-gray-400 hover:text-primary transition-colors">服务保障</Link></li>
            </ul>
          </div>
        </div>

        {/* 底部版权 */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            ChinaCarExport | Copyright 2015-2026 ChinaCarExport All Rights Reserved
          </p>
          <div className="flex items-center gap-4">
            <Link href="/blog" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">博客</Link>
            <Link href="/about" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">关于我们</Link>
            <Link href="/contact" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">联系我们</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function ResourceSection() {
  return null;
}
