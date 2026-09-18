import { Gauge, Activity, Network, Timer } from 'lucide-react'
import MetricCard from '../common/MetricCard'

export default function RiskSummary({ confidence, riskFactorCount, severity, inferenceTime, anomalyScore }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <MetricCard value={`${riskFactorCount}`} label="Backend Signals" icon={Network} accent="text-cyan" />
      <MetricCard value={`${anomalyScore?.toFixed?.(2) ?? '—'}`} label="Anomaly Z-Score" icon={Activity} accent="text-accent" />
      <MetricCard value={severity} label="Risk Band" icon={Gauge} accent="text-warning" />
      <MetricCard value={inferenceTime != null ? `${inferenceTime}ms` : '—'} label="API Latency" icon={Timer} accent="text-warning" />
    </div>
  )
}
