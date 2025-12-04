import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import EditStudent from './pages/EditStudent'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/edit/:id" element={<EditStudent />} />
      {/* Redirect any unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
