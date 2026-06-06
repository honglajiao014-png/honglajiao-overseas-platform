import { Header } from "@/components/Header";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <section className="flex-1 max-w-3xl mx-auto px-4 py-12 w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">隐私政策</h1>
        <div className="prose prose-gray max-w-none space-y-4 text-sm leading-relaxed">
          <p><strong>最后更新日期：</strong>2026年6月6日</p>

          <h2 className="text-lg font-semibold mt-6">1. 信息收集</h2>
          <p>当您注册和使用红辣椒汽车出口平台时，我们可能会收集以下信息：</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>姓名、电子邮箱地址、电话号码</li>
            <li>公司名称和国家</li>
            <li>车辆搜索和浏览记录</li>
            <li>通过Google账号登录时，您的姓名和电子邮箱地址</li>
          </ul>

          <h2 className="text-lg font-semibold mt-6">2. 信息使用</h2>
          <p>我们收集的信息用于：</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>提供和维护平台服务</li>
            <li>处理车辆询价和订单</li>
            <li>与您沟通服务和更新</li>
            <li>改善用户体验</li>
          </ul>

          <h2 className="text-lg font-semibold mt-6">3. 信息共享</h2>
          <p>我们不会向第三方出售您的个人信息。在以下情况我们可能会共享信息：</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>得到您的明确同意</li>
            <li>根据法律要求</li>
            <li>为保护平台和用户权益</li>
          </ul>

          <h2 className="text-lg font-semibold mt-6">4. 数据安全</h2>
          <p>我们采用行业标准的安全措施保护您的个人信息，包括SSL加密传输和安全的服务器存储。</p>

          <h2 className="text-lg font-semibold mt-6">5. 您的权利</h2>
          <p>您有权：</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>访问和更新您的个人信息</li>
            <li>删除您的账号和数据</li>
            <li>选择不接收营销通讯</li>
          </ul>

          <h2 className="text-lg font-semibold mt-6">6. 联系我们</h2>
          <p>如有任何隐私相关问题，请通过以下方式联系我们：</p>
          <p>邮箱：honglajiao014@gmail.com</p>
          <p>电话：+86 152 0842 3621</p>
        </div>
      </section>
    </main>
  );
}
