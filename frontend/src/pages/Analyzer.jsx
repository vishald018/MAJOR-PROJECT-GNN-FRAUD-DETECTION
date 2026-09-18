import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, FileCheck2, Gauge, Timer } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import MetricCard from '../components/common/MetricCard'
import ClaimForm from '../components/analyzer/ClaimForm'
import RiskEngine from '../components/analyzer/RiskEngine'
import { useClaim } from '../context/ClaimContext'
import { submitClaim } from '../services/api'

const INITIAL_FORM = {
  beneficiary: {
    providerId: '',
    sex: '1',
    race: '1',
    esrd: 'N',
    state: '49',
    county: '60',
  },
  conditions: [],
  payment: {
    inpatientMedicare: '0',
    inpatientBeneficiary: '0',
    inpatientPrimary: '0',
    outpatientMedicare: '0',
    outpatientBeneficiary: '0',
    outpatientPrimary: '0',
    carrierMedicare: '0',
    carrierBeneficiary: '0',
    carrierPrimary: '0',
  },
}

export default function Analyzer() {
  const navigate = useNavigate()
  const { setClaimForm, setClaimId, setAnalysisResult } = useClaim()
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)

  const handleBeneficiaryChange = (key, value) =>
    setFormData((prev) => ({ ...prev, beneficiary: { ...prev.beneficiary, [key]: value } }))

  const handleToggleCondition = (id) =>
    setFormData((prev) => ({
      ...prev,
      conditions: prev.conditions.includes(id)
        ? prev.conditions.filter((c) => c !== id)
        : [...prev.conditions, id],
    }))

  const handlePaymentChange = (key, value) =>
    setFormData((prev) => ({ ...prev, payment: { ...prev.payment, [key]: value } }))

  const handleAnalyze = async () => {
    setSubmitting(true)
    setClaimForm(formData)
    setAnalysisResult(null)
    try {
      const { claimId, analysis } = await submitClaim(formData)
      setClaimId(claimId)
      setAnalysisResult(analysis)
      navigate('/analyzing')
    } catch (error) {
      window.alert(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/[0.06] px-6 pb-16 pt-16 lg:px-10 lg:pt-20">
        <div className="grid-overlay pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
        <div className="relative mx-auto max-w-[1400px] text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-cyan/20 bg-cyan/10 px-4 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-cyan" strokeWidth={2} />
            <span className="text-[0.72rem] font-semibold tracking-wide text-cyan">
              NEXT-GEN FRAUD DETECTION
            </span>
          </div>

          <h1 className="mx-auto max-w-3xl font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            AI-Powered Fraud Detection
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-lg font-semibold text-slate-300">
            Insurance Claim Risk Analyzer
          </p>
          <p className="mx-auto mt-5 max-w-xl text-[0.95rem] leading-relaxed text-slate-400">
            Detect high-risk healthcare claims and anomalous patterns using Graph Neural
            Networks and AI-powered analysis.
          </p>

          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
            <MetricCard value="REAL" label="Backend Inference" icon={FileCheck2} />
            <MetricCard value="395" label="Graph Features" icon={Gauge} accent="text-success" />
            <MetricCard value="LIVE" label="FastAPI Endpoint" icon={Timer} accent="text-warning" />
          </div>
        </div>
      </section>

      {/* Main two-column layout */}
      <section className="mx-auto max-w-[1400px] px-6 py-14 lg:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <ClaimForm
            formData={formData}
            onBeneficiaryChange={handleBeneficiaryChange}
            onToggleCondition={handleToggleCondition}
            onPaymentChange={handlePaymentChange}
          />
          <RiskEngine onAnalyze={handleAnalyze} submitting={submitting} />
        </div>
      </section>
    </div>
  )
}
