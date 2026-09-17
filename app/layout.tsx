import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const description =
  "Kingdom Overflow builds relational infrastructure connecting schools, families, community projects, volunteers and specialist partners around young people.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kingdomoverflow.org"),
  title: {
    default: "Kingdom Overflow",
    template: "%s | Kingdom Overflow",
  },
  description,
  openGraph: {
    title: "Kingdom Overflow",
    description,
    url: "https://www.kingdomoverflow.org",
    siteName: "Kingdom Overflow",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-white antialiased">
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="absolute -top-28 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[#F300C5]/20 blur-3xl" />
          <div className="absolute top-1/3 -left-40 h-[30rem] w-[30rem] rounded-full bg-[#C51F5D]/15 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[30rem] w-[30rem] rounded-full bg-[#E2E2D2]/10 blur-3xl" />
        </div>
        <Navbar />
        <main className="relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
