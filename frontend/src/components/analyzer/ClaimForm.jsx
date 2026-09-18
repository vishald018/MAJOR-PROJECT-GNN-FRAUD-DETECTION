import { UserRound, Stethoscope, Wallet } from 'lucide-react'
import FormSection from './FormSection'
import ConditionCard from './ConditionCard'
import PaymentSection from './PaymentSection'
import { TextField, SelectField } from '../common/Field'
import { SEX_OPTIONS, RACE_OPTIONS, ESRD_OPTIONS, STATE_OPTIONS, MEDICAL_CONDITIONS } from '../../data/formOptions'

export default function ClaimForm({ formData, onBeneficiaryChange, onToggleCondition, onPaymentChange }) {
  return (
    <div className="glass-panel rounded-2xl px-6 py-2 sm:px-7">
      <div className="flex items-center justify-between border-b border-white/[0.06] py-5">
        <h2 className="text-[0.95rem] font-bold tracking-tight text-white">CLAIM INFORMATION</h2>
        <span className="font-mono text-[0.7rem] text-slate-500">3 sections</span>
      </div>

      <FormSection index="01" title="Beneficiary Information" icon={UserRound}>
        <div className="grid grid-cols-2 gap-3.5">
          <TextField
            label="Provider ID (must exist in graph)"
            placeholder="e.g. 4900NA"
            value={formData.beneficiary.providerId}
            onChange={(e) => onBeneficiaryChange('providerId', e.target.value)}
          />
          <SelectField
            label="Sex"
            options={SEX_OPTIONS}
            value={formData.beneficiary.sex}
            onChange={(e) => onBeneficiaryChange('sex', e.target.value)}
          />
          <SelectField
            label="Race Code"
            options={RACE_OPTIONS}
            value={formData.beneficiary.race}
            onChange={(e) => onBeneficiaryChange('race', e.target.value)}
          />
          <SelectField
            label="ESRD Indicator"
            options={ESRD_OPTIONS}
            value={formData.beneficiary.esrd}
            onChange={(e) => onBeneficiaryChange('esrd', e.target.value)}
          />
          <SelectField
            label="State Code"
            options={STATE_OPTIONS}
            value={formData.beneficiary.state}
            onChange={(e) => onBeneficiaryChange('state', e.target.value)}
          />
          <TextField
            label="County Code (0–999)"
            placeholder="e.g. 060"
            value={formData.beneficiary.county}
            onChange={(e) => onBeneficiaryChange('county', e.target.value)}
          />
        </div>
      </FormSection>

      <FormSection index="02" title="Medical Conditions" icon={Stethoscope}>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {MEDICAL_CONDITIONS.map((condition) => (
            <ConditionCard
              key={condition.id}
              label={condition.label}
              active={formData.conditions.includes(condition.id)}
              onToggle={() => onToggleCondition(condition.id)}
            />
          ))}
        </div>
      </FormSection>

      <FormSection index="03" title="Payment Details" icon={Wallet}>
        <PaymentSection values={formData.payment} onChange={onPaymentChange} />
      </FormSection>
    </div>
  )
}
