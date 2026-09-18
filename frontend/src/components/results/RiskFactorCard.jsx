import { Activity, Network } from 'lucide-react'

const ICONS = {
  graph_similarity: Network,
  embedding_anomaly: Activity,
}

const SEVERITY_STYLE = {
  high: { color: '#EF4444', label: 'High' },
  medium: { color: '#F59E0B', label: 'Medium' },
  low: { color: '#22C55E', label: 'Low' },
}

export default function RiskFactorCard({ factor }) {
  const Icon = ICONS[factor.id] ?? Activity
  const severity = SEVERITY_STYLE[factor.severity] ?? SEVERITY_STYLE.medium

  return (
    <div className="glass-panel flex flex-col gap-3 rounded-xl p-5">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: `${severity.color}1A`, color: severity.color }}>
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <span className="rounded-full px-2.5 py-1 text-[0.68rem] font-bold tracking-wide" style={{ color: severity.color, backgroundColor: `${severity.color}14` }}>
          {severity.label.toUpperCase()}
        </span>
      </div>
      <h4 className="text-[0.9rem] font-bold text-white">{factor.title}</h4>
      <p className="text-[0.8rem] leading-relaxed text-slate-400">{factor.description}</p>
      <div className="mt-1">
        <div className="mb-1.5 flex items-center justify-between text-[0.68rem] text-slate-500"><span>Signal magnitude</span><span className="font-mono">{Math.round(factor.contribution * 100)}%</span></div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full rounded-full" style={{ width: `${factor.contribution * 100}%`, backgroundColor: severity.color }} /></div>
      </div>
    </div>
  )
}
