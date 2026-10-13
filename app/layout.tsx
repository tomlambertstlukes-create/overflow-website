import type { Metadata } from "next";
import "./globals.css";
import SiteShell from "@/components/SiteShell";

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
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
