"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { brand, navItems } from "@/lib/data";
import Button from "@/components/Button";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <img src={brand.logo} alt="Overflow Wellbeing" className="h-12 w-12 rounded-full object-contain" />
          <div>
            <div className="text-lg font-black tracking-tight text-[var(--cream)]">Overflow</div>
            <div className="text-xs uppercase tracking-[0.28em] text-white/50">Wellbeing</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
               key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                  active ? "bg-[var(--cream)] text-[#141D26]" : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button href="/schools" variant="ghost">Partner</Button>
          <Button href="/funders">Fund this work</Button>
        </div>

        <button onClick={() => setOpen(!open)} className="rounded-xl border border-white/10 p-2 xl:hidden">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-slate-950 px-5 py-4 xl:hidden">
          <div className="grid gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-xl px-4 py-3 font-semibold ${
                  pathname === item.href ? "bg-[var(--cream)] text-[#141D26]" : "bg-white/5 text-white/80"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}