export default function MetricCard({ value, label, icon: Icon, accent = 'text-cyan' }) {
  return (
    <div className="glass-panel flex items-center gap-4 rounded-xl px-5 py-4">
      {Icon && (
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] ${accent}`}>
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
      )}
      <div>
        <div className={`font-display text-2xl font-bold tracking-tight text-white`}>{value}</div>
        <div className="text-[0.78rem] text-slate-400">{label}</div>
      </div>
    </div>
  )
}
