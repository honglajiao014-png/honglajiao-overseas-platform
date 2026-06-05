"use client";

import { useT } from "@/i18n/useT";
import { T } from "@/i18n/translations";

const iconSvgs: Record<string, React.ReactNode> = {
  check: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
    </svg>
  ),
  lightning: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  truck: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  ),
  shield: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  globe: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const serviceKeys = [
  { icon: "check",     title: T.services.s1_title, desc: T.services.s1_desc },
  { icon: "lightning", title: T.services.s2_title, desc: T.services.s2_desc },
  { icon: "truck",     title: T.services.s3_title, desc: T.services.s3_desc },
  { icon: "shield",    title: T.services.s4_title, desc: T.services.s4_desc },
  { icon: "globe",     title: T.services.s5_title, desc: T.services.s5_desc },
];

export function HomeServices() {
  const t = useT();

  return (
    <section className="bg-white py-16 md:py-20 border-b border-gray-100">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-brand text-xs font-bold uppercase tracking-widest bg-brand-light px-3 py-1 rounded-full">
            {t(T.services.subheading)}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-dark mt-4 mb-3">
            {t(T.services.heading)}
          </h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            Comprehensive vehicle sourcing services tailored for international buyers
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {serviceKeys.map((svc) => (
            <div
              key={t(svc.title)}
              className="group bg-gray-light rounded-2xl p-6 text-center border border-gray-100 hover:border-brand/20 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-brand-light flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-all duration-300">
                {iconSvgs[svc.icon]}
              </div>
              <h3 className="text-sm font-bold text-dark mb-2">{t(svc.title)}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{t(svc.desc)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
