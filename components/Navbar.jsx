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

  const isActive = (href) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Kingdom Overflow home">
          <img
            src={brand.logo}
            alt=""
            className="h-12 w-12 rounded-full object-contain"
          />
          <div>
            <div className="text-lg font-black tracking-tight text-[var(--cream)]">
              Kingdom Overflow
            </div>
            <div className="max-w-[10rem] text-[0.62rem] uppercase leading-4 tracking-[0.14em] text-white/50 sm:max-w-none sm:text-xs sm:tracking-[0.18em]">
              Belonging • Opportunity • Wellbeing
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                isActive(item.href)
                  ? "bg-[var(--cream)] text-[#141D26]"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button href="/schools" variant="ghost">
            Partner
          </Button>
          <Button href="/support">Support us</Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="rounded-xl border border-white/10 p-2 xl:hidden"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div
          id="mobile-navigation"
          className="border-t border-white/10 bg-slate-950 px-5 py-4 xl:hidden"
        >
          <nav className="grid gap-2" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`rounded-xl px-4 py-3 font-semibold ${
                  isActive(item.href)
                    ? "bg-[var(--cream)] text-[#141D26]"
                    : "bg-white/5 text-white/80"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Button
            href="/support"
            className="mt-3 w-full"
            onClick={() => setOpen(false)}
          >
            Support us
          </Button>
        </div>
      )}
    </header>
  );
}
