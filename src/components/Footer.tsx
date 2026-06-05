import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-guazi-dark text-white py-12">
      <div className="max-w-[1600px] mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-bold mb-4 text-white">车源分类</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/cars" className="hover:text-guazi-green">全部车源</Link></li>
              <li><Link href="/blog/china-used-car-export-guide" className="hover:text-guazi-green">二手车出口</Link></li>
              <li><Link href="/blog/china-ev-export-sourcing-guide" className="hover:text-guazi-green">新能源车采购</Link></li>
              <li><Link href="/blog/commercial-vehicle-sourcing-from-china" className="hover:text-guazi-green">商用车采购</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold mb-4 text-white">市场指南</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/blog/how-to-import-from-china-to-kazakhstan" className="hover:text-guazi-green">出口哈萨克斯坦</Link></li>
              <li><Link href="/blog/best-used-cars-china-for-central-asia" className="hover:text-guazi-green">中亚市场分析</Link></li>
              <li><Link href="/blog/china-used-car-export-guide" className="hover:text-guazi-green">非洲市场指南</Link></li>
              <li><Link href="/blog/china-ev-export-sourcing-guide" className="hover:text-guazi-green">俄罗斯采购指南</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold mb-4 text-white">服务保障</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/blog/china-used-car-export-guide" className="hover:text-guazi-green">验车服务</Link></li>
              <li><Link href="/blog/china-used-car-export-guide" className="hover:text-guazi-green">出口流程</Link></li>
              <li><Link href="/blog/china-used-car-export-guide" className="hover:text-guazi-green">物流运输</Link></li>
              <li><Link href="/inquiry" className="hover:text-guazi-green">提交需求</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold mb-4 text-white">关于我们</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/blog" className="hover:text-guazi-green">博客</Link></li>
              <li><Link href="/inquiry" className="hover:text-guazi-green">联系我们</Link></li>
              <li><a href="tel:+8613877284681" className="hover:text-guazi-green">+86 138-7728-4681</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
          <p>Copyright 2015-2026 ChinaCarExport All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}

export function ResourceSection() {
  return null;
}
