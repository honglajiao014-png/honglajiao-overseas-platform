import Link from "next/link";

export function HomeHero() {
  return (
    <section className="hero-section relative bg-gradient-to-br from-guazi-dark via-gray-900 to-guazi-dark overflow-hidden">
      <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-r from-guazi-green/20 to-transparent" />

      <div className="relative max-w-[1600px] mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-guazi-green/20 border border-guazi-green/30 rounded-full px-4 py-1.5 text-sm text-guazi-green mb-6">
            <span className="w-2 h-2 bg-guazi-green rounded-full animate-pulse" />
            China Car Export Sourcing Platform
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
            Source Used Cars, EVs &amp; Commercial Vehicles<br />from China with Confidence
          </h1>
          <p className="text-gray-300 text-base md:text-lg mb-8 max-w-2xl leading-relaxed">
            ChinaCarExport — 从中国采购真实可核验的二手车、商用车、新能源车和工程机械。报价前提供真实照片、实车验车和出口流程支持。
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/inquiry"
              className="px-5 py-2.5 border-2 border-white/50 text-white text-sm font-semibold rounded-lg hover:bg-white/10 hover:border-white/80 transition-all duration-200 whitespace-nowrap"
            >
              提交采购需求
            </Link>
            <Link
              href="/cars"
              className="px-5 py-2.5 bg-white text-guazi-green text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap shadow-sm"
            >
              全部车源
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
