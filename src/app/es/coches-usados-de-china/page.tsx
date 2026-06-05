import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer, ResourceSection } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Coches Usados desde China — Guía de Exportación | Honglajiao Auto Export",
  description: "Guía en español para importar coches usados desde China a Latinoamérica y África. Proceso, precios, envíos y modelos populares.",
  robots: "noindex, nofollow",
};

export default function SEOPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-brand to-brand-dark text-white py-10">
          <div className="max-w-[1200px] mx-auto px-4">
            <h1 className="text-2xl md:text-3xl font-bold mb-3">Coches Usados desde China</h1>
            <p className="text-white/80 text-sm md:text-base max-w-2xl">
              Guía en español para importar coches usados desde China a Latinoamérica y África. Proceso, precios, envíos y modelos populares.
            </p>
          </div>
        </section>

        <article className="py-12 bg-white">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                China es el mayor mercado automotriz del mundo, con millones de vehículos usados disponibles para exportación cada año. Esta guía cubre todo lo que necesita saber sobre la importación de coches usados desde China.
              </p>
              
            <section>
              <h2 className="text-xl font-bold text-dark mb-3 mt-8">¿Por qué importar desde China?</h2>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{`Precios 30-50% más bajos que en otros mercados, amplia variedad de marcas y modelos, vehículos con volante a la izquierda compatibles con Latinoamérica y África.`}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-dark mb-3 mt-8">Modelos Populares</h2>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{`Toyota Corolla, Camry, RAV4; Honda CR-V, Civic; BMW Serie 3, Serie 5; Mercedes Clase C, Clase E; BYD Han, Tang, Atto 3.`}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-dark mb-3 mt-8">Proceso de Exportaci��n</h2>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{`1. Selección del vehículo
2. Verificación del proveedor
3. Inspección con fotos/videos
4. Negociación y contrato
5. Documentación de exportación
6. Despacho de aduana
7. Envío internacional
8. Entrega en puerto de destino`}</p>
            </section>
            </div>

            <div className="max-w-3xl mx-auto mt-12 pt-8 border-t text-center">
              <h2 className="text-lg font-bold text-dark mb-4">Ready to Start Sourcing?</h2>
              <div className="flex justify-center gap-4">
                <Link href="/inquiry" className="bg-brand text-white px-8 py-3 rounded-lg text-sm font-bold hover:bg-brand-dark transition-colors">
                  Submit Inquiry
                </Link>
                <Link href="/cars" className="border-2 border-brand text-brand px-8 py-3 rounded-lg text-sm font-bold hover:bg-brand-light transition-colors">
                  Browse Vehicles
                </Link>
              </div>
            </div>
          </div>
        </article>

        <ResourceSection />
      </main>
      <Footer />
    </>
  );
}
