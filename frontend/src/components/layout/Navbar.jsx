import { ShieldHalf, Network, BarChart3, Radio } from 'lucide-react'

const NAV_LINKS = [
  { label: 'GNN Engine', icon: Network },
  { label: 'Analytics', icon: BarChart3 },
  { label: 'System Status', icon: Radio },
]

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-void/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 lg:px-10">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-cyan shadow-[0_0_20px_rgba(37,99,235,0.35)]">
            <ShieldHalf className="h-5 w-5 text-white" strokeWidth={2.25} />
          </div>
          <span className="font-display text-[1.05rem] font-bold tracking-tight text-white">
            FraudDetect <span className="text-cyan">AI</span>
          </span>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              className="flex items-center gap-1.5 text-[0.83rem] font-medium text-slate-400 transition-colors hover:text-slate-100"
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={2} />
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 rounded-full border border-success/25 bg-success/10 px-3.5 py-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-success" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
          </span>
          <span className="text-[0.72rem] font-semibold tracking-wide text-success">
            AI ENGINE ONLINE
          </span>
        </div>
      </div>
    </header>
  )
}
