const NODES = [
  { id: 'beneficiary', label: 'BENEFICIARY', x: 200, y: 40, color: '#06B6D4' },
  { id: 'provider', label: 'PROVIDER', x: 200, y: 130, color: '#2563EB' },
  { id: 'claim', label: 'CLAIM', x: 100, y: 220, color: '#2563EB' },
  { id: 'payment', label: 'PAYMENT', x: 300, y: 220, color: '#2563EB' },
  { id: 'risk', label: 'RISK', x: 200, y: 300, color: '#EF4444' },
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

export default function GraphVisualization() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-void/40">
      <div className="grid-overlay absolute inset-0 opacity-60" />
      <svg viewBox="0 0 400 340" className="relative h-[320px] w-full">
        <defs>
          <radialGradient id="nodeGlowBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="200" cy="170" r="180" fill="url(#nodeGlowBg)" />

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
              strokeOpacity="0.45"
              strokeWidth="1.5"
              className="flow-line"
            />
          )
        })}

        {NODES.map((node) => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r="26"
              fill="#0B1F3A"
              stroke={node.color}
              strokeWidth="1.5"
              style={{ color: node.color }}
              className="node-glow"
            />
            <circle cx={node.x} cy={node.y} r="4" fill={node.color} />
            <text
              x={node.x}
              y={node.y + 42}
              textAnchor="middle"
              fill="#94A3B8"
              fontSize="10"
              fontWeight="600"
              letterSpacing="0.05em"
              fontFamily="Manrope, sans-serif"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
