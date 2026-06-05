export function HomeProcess() {
  const steps = [
    { num: "01", title: "提交需求", desc: "告诉我们您需要的车型、预算、目的国" },
    { num: "02", title: "精准匹配", desc: "我们根据需求筛选优质车源供应商" },
    { num: "03", title: "实车验车", desc: "提供真实照片、视频和检测报告" },
    { num: "04", title: "报价确认", desc: "包含车辆、物流、出口手续的完整报价" },
    { num: "05", title: "付款发货", desc: "签署合同，安排付款和物流运输" },
  ];

  return (
    <section className="bg-gray-light py-16">
      <div className="max-w-[1600px] mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-guazi-dark">采购流程</h2>
          <p className="text-gray-500 text-sm mt-2">简单五步，从中国采购车辆</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {steps.map((s) => (
            <div key={s.num} className="text-center group">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-guazi-green-light flex items-center justify-center text-guazi-green font-bold text-lg group-hover:bg-guazi-green group-hover:text-white transition-all">
                {s.num}
              </div>
              <h3 className="text-sm font-bold text-guazi-dark mb-1">{s.title}</h3>
              <p className="text-xs text-gray-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
