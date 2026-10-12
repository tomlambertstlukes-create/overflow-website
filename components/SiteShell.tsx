"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isKiosk = pathname === "/check-in" || pathname.startsWith("/check-in/");

  if (isKiosk) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-28 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[#F300C5]/20 blur-3xl" />
        <div className="absolute top-1/3 -left-40 h-[30rem] w-[30rem] rounded-full bg-[#C51F5D]/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[30rem] w-[30rem] rounded-full bg-[#E2E2D2]/10 blur-3xl" />
      </div>
      <Navbar />
      <main className="relative z-10">{children}</main>
      <Footer />
    </>
  );
}
