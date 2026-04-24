export default function Section({ children, className = "" }) {
  return (
    <section className={`mx-auto max-w-7xl px-5 py-20 lg:px-8 ${className}`}>
      {children}
    </section>
  );
}