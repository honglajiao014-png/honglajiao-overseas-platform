import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HomeHero } from "@/components/HomeHero";
import { HomeVehicles } from "@/components/HomeVehicles";
import { HomeProcess } from "@/components/HomeProcess";
import { HomeInquiry } from "@/components/HomeInquiry";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <HomeHero />
        <HomeVehicles />
        <HomeProcess />
        <HomeInquiry />
      </main>
      <Footer />
    </>
  );
}
