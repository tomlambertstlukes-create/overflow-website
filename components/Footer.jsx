import Link from "next/link";
import { navItems } from "@/lib/data";

const secondaryLinks = [
  { href: "/support", label: "Support us" },
  { href: "/churches", label: "Church and faith" },
  { href: "/vacancies", label: "Work with us" },
];

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-slate-950 px-5 py-12 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="flex items-center gap-3">
            <img
              src="/brand/ko-logo-dark.png"
              alt=""
              className="h-12 w-12 rounded-full object-contain"
            />
            <div className="text-2xl font-black">Kingdom Overflow</div>
          </div>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/60">
            Building the relational infrastructure that connects schools,
            families, community opportunities, volunteers and specialist support
            around young people.
          </p>
          <p className="mt-4 text-xs leading-5 text-white/40">
            Kingdom Overflow operates as part of St Luke’s Cranham Park PCC,
            registered charity number 1128304.
          </p>
        </div>
        <div className="lg:text-right">
          <nav
            className="flex flex-wrap gap-3 lg:justify-end"
            aria-label="Footer navigation"
          >
            {[...navItems, ...secondaryLinks].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-white/60 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
