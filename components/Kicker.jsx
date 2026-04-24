export default function Kicker({ children }) {
  return (
    <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-[#E2E2D2]">
      {children}
    </div>
  );
}