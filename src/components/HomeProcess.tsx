export function HomeProcess() {
  const steps = [
    { num: "1", title: "Submit Request", desc: "Tell us your vehicle needs, budget, and destination country", icon: "📋" },
    { num: "2", title: "Source & Match", desc: "We search China's largest auto markets for the best options", icon: "🔍" },
    { num: "3", title: "Inspect & Verify", desc: "Real photos, videos, and inspection reports provided", icon: "📸" },
    { num: "4", title: "Quote & Confirm", desc: "Complete pricing with vehicle, shipping, and export fees", icon: "💰" },
    { num: "5", title: "Ship & Deliver", desc: "Contract signing, payment, and logistics to your port", icon: "🚢" },
  ];

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-wide">
        <div className="text-center mb-12">
          <span className="badge badge-primary mb-3">How It Works</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Sourcing Process</h2>
          <p className="text-gray-500 text-sm mt-3 max-w-xl mx-auto">
            Simple 5-step process — from request to delivery
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {steps.map((s, i) => (
            <div key={s.num} className="relative group">
              {/* Connector line (desktop) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-gray-200 group-hover:bg-primary/30 transition-colors" />
              )}

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-2xl shadow-sm group-hover:shadow-md group-hover:border-primary/30 group-hover:scale-110 transition-all duration-300">
                  {s.icon}
                </div>
                <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-[10px] font-bold mb-2">
                  {s.num}
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">{s.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
