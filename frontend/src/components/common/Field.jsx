import { ChevronDown } from 'lucide-react'

export function TextField({ label, ...props }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[0.72rem] font-medium text-slate-400">{label}</span>
      <input
        {...props}
        className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-[0.85rem] text-slate-100 placeholder:text-slate-600 outline-none transition-colors focus:border-cyan/40 focus:bg-white/[0.05]"
      />
    </label>
  )
}

export function SelectField({ label, options, ...props }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[0.72rem] font-medium text-slate-400">{label}</span>
      <div className="relative">
        <select
          {...props}
          className="w-full appearance-none rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 pr-8 text-[0.85rem] text-slate-100 outline-none transition-colors focus:border-cyan/40 focus:bg-white/[0.05]"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-abyss text-slate-100">
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
      </div>
    </label>
  )
}
