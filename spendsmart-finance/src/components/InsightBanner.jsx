// src/components/InsightBanner.jsx

export default function InsightBanner({ message }) {
  const text = message ?? "You're saving 28% of your income this month. Well above the 20% benchmark. Keep it up!";
  return (
    <div className="flex items-start gap-4 bg-primary-fixed/40 rounded-3xl p-5 border border-primary/10">
      <div className="w-9 h-9 rounded-2xl bg-primary-gradient flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="material-icons-round text-on-primary text-base">auto_awesome</span>
      </div>
      <div>
        <p className="text-xs font-label uppercase tracking-widest text-primary font-semibold mb-1">AI Insight</p>
        <p className="text-sm text-on-surface leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
