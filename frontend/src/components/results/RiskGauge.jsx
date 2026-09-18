const SIZE = 260
const STROKE = 16
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const ARC_FRACTION = 0.75 // 270-degree gauge
const ARC_LENGTH = CIRCUMFERENCE * ARC_FRACTION

const RISK_COLORS = {
  LOW: '#22C55E',
  MEDIUM: '#F59E0B',
  HIGH: '#EF4444',
}

export default function RiskGauge({ score, riskLevel }) {
  const color = RISK_COLORS[riskLevel] ?? '#EF4444'
  const filled = (score / 100) * ARC_LENGTH

  return (
    <div className="relative flex items-center justify-center">
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="-rotate-[225deg]">
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="#10233D"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={`${ARC_LENGTH} ${CIRCUMFERENCE}`}
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${CIRCUMFERENCE}`}
          style={{
            filter: `drop-shadow(0 0 10px ${color}80)`,
            transition: 'stroke-dasharray 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display text-6xl font-extrabold tracking-tight text-white">
          {score}
        </span>
        <span className="mt-1 text-[0.72rem] font-semibold tracking-wide text-slate-500">
          RISK SCORE
        </span>
        <span
          className="mt-2 rounded-full px-3 py-1 text-[0.72rem] font-bold tracking-wide"
          style={{ color, backgroundColor: `${color}1A`, border: `1px solid ${color}40` }}
        >
          {riskLevel} RISK
        </span>
      </div>
    </div>
  )
}
