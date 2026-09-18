import { Navigate, Route, Routes } from 'react-router-dom'
import { ClaimProvider } from './context/ClaimContext'
import Analyzer from './pages/Analyzer'
import Analyzing from './pages/Analyzing'
import Results from './pages/Results'

export default function App() {
  return (
    <ClaimProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/analyzer" replace />} />
        <Route path="/analyzer" element={<Analyzer />} />
        <Route path="/analyzing" element={<Analyzing />} />
        <Route path="/results" element={<Results />} />
        <Route path="*" element={<Navigate to="/analyzer" replace />} />
      </Routes>
    </ClaimProvider>
  )
}
