import { useT } from "@/i18n/useT";
import { T } from "@/i18n/translations";

export function HomeProcess() {
  const t = useT();
  const P = T.homeProcess;

  const steps = [
    { icon: "📋", title: P.step1Title, desc: P.step1Desc },
    { icon: "🔍", title: P.step2Title, desc: P.step2Desc },
    { icon: "📸", title: P.step3Title, desc: P.step3Desc },
    { icon: "💰", title: P.step4Title, desc: P.step4Desc },
    { icon: "🚢", title: P.step5Title, desc: P.step5Desc },
  ];

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-wide">
        <div className="text-center mb-12">
          <span className="badge badge-primary mb-3">{t(P.badge)}</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">{t(P.title)}</h2>
          <p className="text-gray-500 text-sm mt-3 max-w-xl mx-auto">{t(P.subtitle)}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {steps.map((s, i) => (
            <div key={i} className="relative group">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-gray-200 group-hover:bg-primary/30 transition-colors" />
              )}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-2xl shadow-sm group-hover:shadow-md group-hover:border-primary/30 group-hover:scale-110 transition-all duration-300">
                  {s.icon}
                </div>
                <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-[10px] font-bold mb-2">
                  {i + 1}
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">{t(s.title)}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{t(s.desc)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
