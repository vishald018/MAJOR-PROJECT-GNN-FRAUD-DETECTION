import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CircleCheckBig, RotateCcw, Network, ShieldQuestion } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import RiskGauge from '../components/results/RiskGauge'
import RiskSummary from '../components/results/RiskSummary'
import ClaimNetworkGraph from '../components/results/ClaimNetworkGraph'
import RiskFactorCard from '../components/results/RiskFactorCard'
import ModelIntelligence from '../components/results/ModelIntelligence'
import RiskSignals from '../components/results/RiskSignals'
import { useClaim } from '../context/ClaimContext'

export default function Results() {
  const navigate = useNavigate()
  const { analysisResult, claimId, reset } = useClaim()

  useEffect(() => {
    if (!analysisResult) {
      navigate('/analyzer', { replace: true })
    }
  }, [analysisResult, navigate])

  if (!analysisResult) return null

  const handleNewAnalysis = () => {
    reset()
    navigate('/analyzer')
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="mx-auto max-w-[1400px] px-6 py-10 lg:px-10">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-5 border-b border-white/[0.06] pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[0.72rem] font-semibold tracking-wide text-slate-500">
              <ShieldQuestion className="h-3.5 w-3.5" />
              CLAIM ANALYSIS
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-mono text-xl font-bold tracking-tight text-white">
                {claimId}
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-success/25 bg-success/10 px-3 py-1 text-[0.7rem] font-semibold tracking-wide text-success">
                <CircleCheckBig className="h-3 w-3" strokeWidth={2.5} />
                ANALYSIS COMPLETED
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleNewAnalysis}
            className="flex items-center justify-center gap-2 self-start rounded-xl border border-white/[0.1] bg-white/[0.03] px-5 py-2.5 text-[0.82rem] font-semibold text-slate-200 transition-colors hover:bg-white/[0.07] sm:self-auto"
          >
            <RotateCcw className="h-4 w-4" strokeWidth={2} />
            NEW ANALYSIS
          </button>
        </div>

        {/* Gauge + summary */}
        <div className="mb-14 grid grid-cols-1 gap-10 lg:grid-cols-[auto_1fr] lg:items-center">
          <div className="flex justify-center lg:justify-start">
            <RiskGauge score={analysisResult.fraudScore} riskLevel={analysisResult.riskLevel} />
          </div>
          <RiskSummary
            confidence={analysisResult.confidence}
            riskFactorCount={analysisResult.riskFactors.length}
            severity={analysisResult.riskLevel}
            inferenceTime={analysisResult.inferenceTime}
            anomalyScore={analysisResult.anomalyScore}
          />
        </div>

        {/* Claim network */}
        <div className="mb-14">
          <h2 className="mb-4 flex items-center gap-2 text-[0.95rem] font-bold tracking-tight text-white">
            <Network className="h-4.5 w-4.5 text-cyan" strokeWidth={1.75} />
            GNN SIMILARITY NETWORK
          </h2>
          <ClaimNetworkGraph graph={analysisResult.graph} />
        </div>

        {/* Why flagged */}
        <div className="mb-14">
          <h2 className="mb-4 text-[0.95rem] font-bold tracking-tight text-white">
            MODEL SIGNALS
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {analysisResult.riskFactors.map((factor) => (
              <RiskFactorCard key={factor.id} factor={factor} />
            ))}
          </div>
        </div>

        {/* Model intelligence + signals */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ModelIntelligence model={analysisResult.model} />
          <RiskSignals signals={analysisResult.signals} />
        </div>
      </section>
    </div>
  )
}
