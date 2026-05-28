import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import ListingPage from './pages/ListingPage'
import PostAd from './pages/PostAd'
import Services from './pages/Services'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import './index.css'

export default function App() {
  return (
    <AuthProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Routes>
          <Route path="/"              element={<Home />} />
          <Route path="/listing/:id"   element={<ListingPage />} />
          <Route path="/services"      element={<Services />} />
          <Route path="/login"         element={<Login />} />
          <Route path="/dashboard"     element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/post"          element={<ProtectedRoute><PostAd /></ProtectedRoute>} />
          <Route path="*"              element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </AuthProvider>
  )
}
