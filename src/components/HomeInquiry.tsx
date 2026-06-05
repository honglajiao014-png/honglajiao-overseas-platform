import Link from "next/link";

export function HomeInquiry() {
  return (
    <section className="bg-guazi-dark py-16">
      <div className="max-w-[1600px] mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">准备好采购车辆了吗？</h2>
        <p className="text-gray-400 text-sm mb-8 max-w-xl mx-auto">
          告诉我们您的需求，我们为您匹配最优质的车辆资源。免费咨询，不成交不收费。
        </p>
        <Link
          href="/inquiry"
          className="inline-flex items-center gap-2 px-8 py-3 bg-guazi-green text-white rounded-lg font-bold text-sm hover:bg-guazi-green-dark transition-all shadow-lg shadow-guazi-green/25"
        >
          提交采购需求
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
