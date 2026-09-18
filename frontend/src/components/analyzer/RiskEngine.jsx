import { BrainCircuit, ArrowRight, Loader2 } from 'lucide-react'
import GraphVisualization from './GraphVisualization'
import SectionLabel from '../common/SectionLabel'

export default function RiskEngine({ onAnalyze, submitting }) {
  return (
    <div className="glass-panel sticky top-24 flex flex-col gap-5 rounded-2xl p-6 sm:p-7">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-[0.95rem] font-bold tracking-tight text-white">
          <BrainCircuit className="h-4.5 w-4.5 text-cyan" strokeWidth={1.75} />
          AI RISK ENGINE
        </h2>
        <SectionLabel>GRAPH INTELLIGENCE</SectionLabel>
      </div>

      <p className="text-[0.82rem] leading-relaxed text-slate-400">
        Every claim is mapped into a beneficiary–provider–payment graph. The GNN engine
        propagates risk signals across the graph to surface anomalous relationships.
      </p>

      <GraphVisualization />

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] py-2.5">
          <div className="font-display text-sm font-bold text-white">395</div>
          <div className="text-[0.68rem] text-slate-500">Features</div>
        </div>
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] py-2.5">
          <div className="font-display text-sm font-bold text-white">GCN</div>
          <div className="text-[0.68rem] text-slate-500">Model</div>
        </div>
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] py-2.5">
          <div className="font-display text-sm font-bold text-white">2</div>
          <div className="text-[0.68rem] text-slate-500">GCN Layers</div>
        </div>
      </div>

      <button
        type="button"
        onClick={onAnalyze}
        disabled={submitting}
        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-cyan px-5 py-3.5 text-[0.88rem] font-bold tracking-wide text-white shadow-[0_8px_30px_rgba(37,99,235,0.35)] transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            SUBMITTING CLAIM…
          </>
        ) : (
          <>
            ANALYZE CLAIM
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </>
        )}
      </button>
    </div>
  )
}
