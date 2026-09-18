import { Check } from 'lucide-react'

export default function ConditionCard({ label, active, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-[0.78rem] font-medium transition-all ${
        active
          ? 'border-accent/40 bg-accent/10 text-slate-100'
          : 'border-white/[0.07] bg-white/[0.02] text-slate-400 hover:border-white/[0.14] hover:text-slate-300'
      }`}
    >
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
          active ? 'border-cyan bg-cyan' : 'border-white/20'
        }`}
      >
        {active && <Check className="h-3 w-3 text-void" strokeWidth={3} />}
      </span>
      {label}
    </button>
  )
}
