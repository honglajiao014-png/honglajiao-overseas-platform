import { useT } from "@/i18n/useT";
import { T } from "@/i18n/translations";

export function HomeDisclaimer() {
  const t = useT();

  return (
    <section className="bg-dark-soft py-10 border-t border-border-dark">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-gold shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-sm font-bold text-gray-300 mb-1">{t(T.disclaimer.heading)}</h4>
            <p className="text-xs text-gray-500 leading-relaxed max-w-3xl">{t(T.disclaimer.content)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
