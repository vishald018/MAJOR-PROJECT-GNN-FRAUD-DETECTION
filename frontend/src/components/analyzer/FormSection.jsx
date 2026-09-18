export default function FormSection({ index, title, icon: Icon, children }) {
  return (
    <div className="border-b border-white/[0.06] py-6 first:pt-0 last:border-0 last:pb-0">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="font-mono text-[0.72rem] font-semibold text-cyan/70">{index}</span>
        {Icon && <Icon className="h-4 w-4 text-slate-500" strokeWidth={1.75} />}
        <h3 className="text-[0.9rem] font-semibold text-slate-200">{title}</h3>
      </div>
      {children}
    </div>
  )
}
