import { Cpu, Layers, Boxes, Radar, Zap } from 'lucide-react'

export default function ModelIntelligence({ model }) {
  const rows = [
    { icon: Cpu, label: 'Model', value: model.name },
    { icon: Layers, label: 'Model Type', value: model.variants.join(' / ') },
    { icon: Boxes, label: 'Features', value: model.features },
    { icon: Radar, label: 'Detection', value: model.detection },
    { icon: Zap, label: 'Inference', value: model.inference },
  ]

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-7">
      <h3 className="mb-5 text-[0.95rem] font-bold tracking-tight text-white">
        MODEL INTELLIGENCE
      </h3>
      <div className="flex flex-col divide-y divide-white/[0.06]">
        {rows.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
            <span className="flex items-center gap-2.5 text-[0.82rem] text-slate-400">
              <Icon className="h-4 w-4 text-slate-500" strokeWidth={1.75} />
              {label}
            </span>
            <span className="text-right text-[0.82rem] font-semibold text-slate-100">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
