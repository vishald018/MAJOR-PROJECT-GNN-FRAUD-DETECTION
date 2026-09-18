import { useMemo, useState } from 'react'

const COLORS = {
  claim: '#EF4444',
  provider: '#2563EB',
  neighbor: '#06B6D4',
}

export default function ClaimNetworkGraph({ graph }) {
  const [hovered, setHovered] = useState(null)

  const positions = useMemo(() => {
    const neighbors = graph.nodes.filter((n) => n.type === 'neighbor')
    const map = {
      claim: { x: 310, y: 200 },
      provider: { x: 130, y: 200 },
    }
    neighbors.forEach((node, index) => {
      const angle = -Math.PI / 2 + (index / Math.max(1, neighbors.length - 1)) * Math.PI
      map[node.id] = { x: 310 + Math.cos(angle) * 190, y: 200 + Math.sin(angle) * 140 }
    })
    return map
  }, [graph.nodes])

  const descriptions = {
    claim: 'The newly submitted claim represented by the request.',
    provider: 'The existing provider node used for graph context injection.',
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-void/40">
      <div className="grid-overlay absolute inset-0 opacity-50" />
      <div className="absolute right-4 top-4 z-10 rounded-lg border border-white/10 bg-abyss/90 px-3 py-2 text-[0.7rem] text-slate-400">
        Cyan links = embedding similarity
      </div>
      <svg viewBox="0 0 620 400" className="relative h-[400px] w-full">
        <defs>
          <radialGradient id="networkGlowReal" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="310" cy="200" r="260" fill="url(#networkGlowReal)" />

        {graph.edges.map((edge, i) => {
          const a = positions[edge.source]
          const b = positions[edge.target]
          if (!a || !b) return null
          const active = hovered === edge.source || hovered === edge.target
          return (
            <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={edge.kind === 'provider' ? '#2563EB' : '#06B6D4'}
              strokeOpacity={active ? 0.95 : 0.45}
              strokeWidth={1.2 + edge.weight * 2.2}
              className={active ? '' : 'flow-line'}
            />
          )
        })}

        {graph.nodes.map((node) => {
          const pos = positions[node.id]
          if (!pos) return null
          const color = COLORS[node.type] || '#06B6D4'
          const isHovered = hovered === node.id
          return (
            <g key={node.id} onMouseEnter={() => setHovered(node.id)} onMouseLeave={() => setHovered(null)} style={{ cursor: 'pointer' }}>
              <circle cx={pos.x} cy={pos.y} r={isHovered ? 34 : 30} fill="#0B1F3A" stroke={color} strokeWidth={isHovered ? 2.5 : 1.5} className="node-glow" />
              <circle cx={pos.x} cy={pos.y} r="5" fill={color} />
              <text x={pos.x} y={pos.y + 50} textAnchor="middle" fill={isHovered ? '#E2E8F0' : '#94A3B8'} fontSize="10" fontWeight="700" letterSpacing="0.04em" fontFamily="Manrope, sans-serif">
                {node.label.toUpperCase()}
              </text>
            </g>
          )
        })}
      </svg>

      {hovered && (
        <div className="pointer-events-none absolute left-4 top-4 max-w-[250px] rounded-lg border border-white/10 bg-abyss/95 px-3.5 py-2.5 shadow-xl">
          <div className="mb-1 text-[0.78rem] font-bold text-white">{graph.nodes.find((n) => n.id === hovered)?.label}</div>
          <div className="text-[0.72rem] leading-relaxed text-slate-400">{descriptions[hovered] || 'A node selected from the GNN embedding similarity results.'}</div>
        </div>
      )}
    </div>
  )
}
