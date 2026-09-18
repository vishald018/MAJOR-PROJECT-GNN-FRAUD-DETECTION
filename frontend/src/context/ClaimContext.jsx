import { createContext, useContext, useMemo, useState } from 'react'

const ClaimContext = createContext(null)

const STORAGE_KEY = 'frauddetect.session'

function loadSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function persistSession(data) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // ignore storage errors (private mode, quota, etc.)
  }
}

export function ClaimProvider({ children }) {
  const [session, setSession] = useState(loadSession)

  const value = useMemo(
    () => ({
      claimForm: session.claimForm ?? null,
      claimId: session.claimId ?? null,
      analysisResult: session.analysisResult ?? null,
      setClaimForm: (claimForm) =>
        setSession((prev) => {
          const next = { ...prev, claimForm }
          persistSession(next)
          return next
        }),
      setClaimId: (claimId) =>
        setSession((prev) => {
          const next = { ...prev, claimId }
          persistSession(next)
          return next
        }),
      setAnalysisResult: (analysisResult) =>
        setSession((prev) => {
          const next = { ...prev, analysisResult }
          persistSession(next)
          return next
        }),
      reset: () => {
        setSession({})
        persistSession({})
      },
    }),
    [session]
  )

  return <ClaimContext.Provider value={value}>{children}</ClaimContext.Provider>
}

export function useClaim() {
  const ctx = useContext(ClaimContext)
  if (!ctx) throw new Error('useClaim must be used within a ClaimProvider')
  return ctx
}
