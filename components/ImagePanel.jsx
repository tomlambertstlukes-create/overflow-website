export default function ImagePanel({ src, alt, caption = null }) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] p-3 shadow-2xl shadow-pink-950/30">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-pink-500/30 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="relative overflow-hidden rounded-[1.5rem]">
        <img src={src} alt={alt} className="h-[28rem] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-transparent" />
        {caption && (
          <div className="absolute bottom-0 left-0 right-0 p-6 text-sm font-semibold leading-6 text-white/90">
            {caption}
          </div>
        )}
      </div>
    </div>
  );
}