import { Check } from 'lucide-react'

const NODES = [
  { id: 'beneficiary', label: 'BENEFICIARY', x: 260, y: 60, color: '#06B6D4' },
  { id: 'provider', label: 'PROVIDER', x: 260, y: 180, color: '#2563EB' },
  { id: 'claim', label: 'CLAIM', x: 110, y: 300, color: '#2563EB' },
  { id: 'payment', label: 'PAYMENT', x: 410, y: 300, color: '#2563EB' },
  { id: 'risk', label: 'RISK', x: 260, y: 410, color: '#EF4444' },
]

const EDGES = [
  ['beneficiary', 'provider'],
  ['provider', 'claim'],
  ['provider', 'payment'],
  ['claim', 'risk'],
  ['payment', 'risk'],
]

function findNode(id) {
  return NODES.find((n) => n.id === id)
}

export function AnalysisGraph({ activeStage }) {
  return (
    <div className="relative mx-auto aspect-[520/500] w-full max-w-xl overflow-hidden rounded-2xl border border-white/[0.06] bg-void/40">
      <div className="grid-overlay absolute inset-0 opacity-50" />
      <svg viewBox="0 0 520 500" className="relative h-full w-full">
        <defs>
          <radialGradient id="analyzingGlow" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="260" cy="230" r="230" fill="url(#analyzingGlow)" />

        {EDGES.map(([from, to], i) => {
          const a = findNode(from)
          const b = findNode(to)
          return (
            <line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="#2563EB"
              strokeOpacity="0.5"
              strokeWidth="2"
              className="flow-line"
            />
          )
        })}

        {NODES.map((node, i) => {
          const lit = i <= activeStage
          return (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r="34"
                fill="#0B1F3A"
                stroke={lit ? node.color : '#1E3A5F'}
                strokeWidth="2"
                style={{ color: node.color }}
                className={lit ? 'node-glow' : ''}
              />
              <circle cx={node.x} cy={node.y} r="5" fill={lit ? node.color : '#2D4A6D'} />
              <text
                x={node.x}
                y={node.y + 52}
                textAnchor="middle"
                fill={lit ? '#CBD5E1' : '#475569'}
                fontSize="11"
                fontWeight="700"
                letterSpacing="0.06em"
                fontFamily="Manrope, sans-serif"
              >
                {node.label}
              </text>
            </g>
          )
        })}

        <circle
          cx="260"
          cy="230"
          r="200"
          fill="none"
          stroke="#06B6D4"
          strokeOpacity="0.15"
          strokeWidth="1"
          strokeDasharray="2 10"
          className="animate-spin-slow"
          style={{ transformOrigin: '260px 230px' }}
        />
      </svg>
    </div>
  )
}

export default function AnalysisLoader({ stages, activeStage }) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-3">
      {stages.map((stage, i) => {
        const done = i < activeStage
        const active = i === activeStage
        return (
          <div
            key={stage}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-500 ${
              done
                ? 'border-success/20 bg-success/[0.06]'
                : active
                ? 'border-cyan/30 bg-cyan/[0.07]'
                : 'border-white/[0.05] bg-white/[0.015]'
            }`}
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                done
                  ? 'border-success bg-success'
                  : active
                  ? 'border-cyan'
                  : 'border-slate-700'
              }`}
            >
              {done && <Check className="h-3 w-3 text-void" strokeWidth={3.5} />}
              {active && <span className="h-2 w-2 animate-pulse-dot rounded-full bg-cyan" />}
            </span>
            <span
              className={`text-[0.85rem] font-medium ${
                done ? 'text-success/90' : active ? 'text-slate-100' : 'text-slate-500'
              }`}
            >
              {stage}
            </span>
          </div>
        )
      })}
    </div>
  )
}
