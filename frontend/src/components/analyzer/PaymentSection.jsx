const PAYMENT_FIELDS = [
  { key: 'inpatientMedicare', label: 'Inpatient Medicare' },
  { key: 'inpatientBeneficiary', label: 'Inpatient Beneficiary' },
  { key: 'inpatientPrimary', label: 'Inpatient Primary Payer' },
  { key: 'outpatientMedicare', label: 'Outpatient Medicare' },
  { key: 'outpatientBeneficiary', label: 'Outpatient Beneficiary' },
  { key: 'outpatientPrimary', label: 'Outpatient Primary Payer' },
  { key: 'carrierMedicare', label: 'Carrier Medicare' },
  { key: 'carrierBeneficiary', label: 'Carrier Beneficiary' },
  { key: 'carrierPrimary', label: 'Carrier Primary Payer' },
]

export default function PaymentSection({ values, onChange }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {PAYMENT_FIELDS.map(({ key, label }) => (
        <label key={key} className="flex flex-col gap-1.5">
          <span className="text-[0.72rem] font-medium text-slate-400">{label}</span>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[0.8rem] text-slate-500">$</span>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
              value={values[key] ?? ''}
              onChange={(e) => onChange(key, e.target.value)}
              className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] py-2 pl-6 pr-2 text-[0.85rem] text-slate-100 placeholder:text-slate-600 outline-none transition-colors focus:border-cyan/40 focus:bg-white/[0.05]"
            />
          </div>
        </label>
      ))}
    </div>
  )
}
