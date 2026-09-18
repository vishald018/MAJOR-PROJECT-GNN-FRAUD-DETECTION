export default function RiskSignals({ signals }) {
  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-7">
      <h3 className="mb-5 text-[0.95rem] font-bold tracking-tight text-white">RISK SIGNALS</h3>
      <div className="flex flex-col gap-4">
        {signals.map((signal) => (
          <div key={signal.id}>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-2 text-[0.82rem] font-medium text-slate-300">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    signal.active ? 'bg-danger' : 'bg-slate-600'
                  }`}
                />
                {signal.label}
              </span>
              <span className="font-mono text-[0.72rem] text-slate-500">{signal.weight}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className={`h-full rounded-full ${signal.active ? 'bg-danger' : 'bg-slate-600'}`}
                style={{ width: `${signal.weight}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
