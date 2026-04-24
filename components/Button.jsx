import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Button({ href, children, variant = "primary", className = "" }) {
  const styles =
    variant === "ghost"
      ? "border border-white/15 bg-white/5 text-white hover:bg-white/10"
      : "bg-gradient-to-r from-[#F300C5] via-[#C51F5D] to-[#E2E2D2] text-[#141D26] shadow-lg shadow-pink-500/20 hover:shadow-pink-500/30";

  return (
    <Link
      href={href}
      className={`group inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition hover:-translate-y-0.5 ${styles} ${className}`}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
    </Link>
  );
}