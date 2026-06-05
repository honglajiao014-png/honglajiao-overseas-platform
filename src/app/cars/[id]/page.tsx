import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getVehicleById, vehicles } from "@/data/vehicles";
import { CarDetailContent } from "./CarDetailContent";

export async function generateStaticParams() {
  return vehicles.flatMap(v => [{ id: v.id }, { id: v.slug }]);
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const v = await getVehicleById(id);
  if (!v) return { title: "Not Found" };
  return {
    title: `${v.brand} ${v.model} ${v.year} — $${v.price_usd.toLocaleString()} | Honglajiao Auto Export`,
    description: `${v.brand} ${v.model}, ${v.year}, ${v.mileage_km.toLocaleString()}km, ${v.fuel}, ${v.transmission}. Base price: $${v.price_usd.toLocaleString()}. Located in ${v.location}, China.`,
    openGraph: {
      title: `${v.brand} ${v.model} ${v.year} — $${v.price_usd.toLocaleString()}`,
      description: `${v.mileage_km.toLocaleString()}km · ${v.transmission} · ${v.fuel} · ${v.exterior_color}`,
      images: v.main_image ? [{ url: v.main_image }] : [],
    },
  };
}

export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const v = await getVehicleById(id);
  if (!v) notFound();

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <CarDetailContent vehicle={v} />
      <Footer />
    </main>
  );
}
