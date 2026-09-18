export default function SectionLabel({ icon: Icon, children, tone = 'default' }) {
  const toneClasses = {
    default: 'text-cyan bg-cyan/10 border-cyan/20',
    danger: 'text-danger bg-danger/10 border-danger/20',
  }

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[0.72rem] font-semibold tracking-wide ${toneClasses[tone]}`}
    >
      {Icon && <Icon className="h-3.5 w-3.5" strokeWidth={2} />}
      {children}
    </div>
  )
}
