import { Header } from "@/components/Header";

export default function TermsPage() {
  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <section className="flex-1 max-w-3xl mx-auto px-4 py-12 w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">服务条款</h1>
        <div className="prose prose-gray max-w-none space-y-4 text-sm leading-relaxed">
          <p><strong>最后更新日期：</strong>2026年6月6日</p>

          <h2 className="text-lg font-semibold mt-6">1. 接受条款</h2>
          <p>使用红辣椒汽车出口平台即表示您同意以下条款。如不同意，请勿使用本平台。</p>

          <h2 className="text-lg font-semibold mt-6">2. 服务描述</h2>
          <p>红辣椒汽车出口是一个连接中国车商与国际买家的平台，提供二手车、电动车及出口非洲车辆的展示、询价和交易撮合服务。</p>

          <h2 className="text-lg font-semibold mt-6">3. 用户责任</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>提供真实准确的注册信息</li>
            <li>妥善保管账号密码</li>
            <li>不得利用平台进行任何违法活动</li>
            <li>不得发布虚假车辆信息</li>
          </ul>

          <h2 className="text-lg font-semibold mt-6">4. 知识产权</h2>
          <p>平台上所有内容（包括但不限于文本、图片、标识）的知识产权归红辣椒汽车出口或其授权方所有。</p>

          <h2 className="text-lg font-semibold mt-6">5. 免责声明</h2>
          <p>本平台仅作为信息展示和对接平台，对车辆质量、交易纠纷不承担责任。买卖双方应自行核实车辆信息并签订正式合同。</p>

          <h2 className="text-lg font-semibold mt-6">6. 条款变更</h2>
          <p>我们保留随时修改服务条款的权利。重大变更将通过平台通知用户。</p>

          <h2 className="text-lg font-semibold mt-6">7. 联系我们</h2>
          <p>邮箱：honglajiao014@gmail.com</p>
          <p>电话：+86 152 0842 3621</p>
        </div>
      </section>
    </main>
  );
}
