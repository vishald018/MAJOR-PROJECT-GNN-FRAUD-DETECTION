import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Waypoints } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import AnalysisLoader, { AnalysisGraph } from '../components/analyzing/AnalysisLoader'
import { useClaim } from '../context/ClaimContext'

const STAGES = [
  'Processing beneficiary features',
  'Linking provider to graph',
  'Computing GNN embedding',
  'Calculating similarity risk',
  'Generating model signals',
]
const STAGE_DURATION = 650

export default function Analyzing() {
  const navigate = useNavigate()
  const { claimId, analysisResult } = useClaim()
  const [activeStage, setActiveStage] = useState(0)

  useEffect(() => {
    if (!claimId || !analysisResult) {
      navigate('/analyzer', { replace: true })
      return
    }
    const interval = setInterval(() => {
      setActiveStage((prev) => Math.min(prev + 1, STAGES.length))
    }, STAGE_DURATION)
    const done = setTimeout(() => navigate('/results', { replace: true }), STAGE_DURATION * STAGES.length + 250)
    return () => {
      clearInterval(interval)
      clearTimeout(done)
    }
  }, [claimId, analysisResult, navigate])

  const progressPct = Math.min((activeStage / STAGES.length) * 100, 100)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <section className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-16">
        <div className="grid-overlay pointer-events-none absolute inset-0 opacity-30" />
        <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center gap-10">
          <div className="text-center">
            <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-4 py-1.5">
              <Waypoints className="h-3.5 w-3.5 text-accent" strokeWidth={2} />
              <span className="text-[0.72rem] font-semibold tracking-wide text-accent">LIVE GNN ANALYSIS</span>
            </div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Graph Neural Network Processing</h1>
            <p className="mx-auto mt-3 max-w-md text-[0.9rem] text-slate-400">The submitted claim is being scored by the connected FastAPI backend and trained GAE model.</p>
          </div>
          <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <AnalysisGraph activeStage={activeStage} />
            <div className="flex flex-col gap-6">
              <AnalysisLoader stages={STAGES} activeStage={activeStage} />
              <div>
                <div className="mb-2 flex items-center justify-between text-[0.72rem] font-medium text-slate-500"><span>Progress</span><span className="font-mono text-cyan">{Math.round(progressPct)}%</span></div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-gradient-to-r from-accent to-cyan transition-[width] duration-500 ease-out" style={{ width: `${progressPct}%` }} /></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
