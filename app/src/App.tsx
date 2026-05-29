import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import Home from './pages/Home'
import ListingPage from './pages/ListingPage'
import PostAd from './pages/PostAd'
import Services from './pages/Services'
import ServicePage from './pages/ServicePage'
import RegisterWorkshop from './pages/RegisterWorkshop'
import Packages from './pages/Packages'
import Wallet from './pages/Wallet'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AdminPanel from './pages/AdminPanel'
import NotFound from './pages/NotFound'
import InstallPrompt from './components/InstallPrompt'
import './index.css'

export default function App() {
  return (
    <AuthProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Routes>
          <Route path="/"                    element={<Home />} />
          <Route path="/listing/:id"         element={<ListingPage />} />
          <Route path="/services"            element={<Services />} />
          <Route path="/services/:id"        element={<ServicePage />} />
          <Route path="/register-workshop"   element={<ProtectedRoute><RegisterWorkshop /></ProtectedRoute>} />
          <Route path="/packages"            element={<Packages />} />
          <Route path="/wallet"              element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
          <Route path="/terms"               element={<Terms />} />
          <Route path="/privacy"             element={<Privacy />} />
          <Route path="/contact"             element={<Contact />} />
          <Route path="/login"               element={<Login />} />
          <Route path="/dashboard"           element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/post"                element={<ProtectedRoute><PostAd /></ProtectedRoute>} />
          <Route path="/admin"               element={<AdminRoute><AdminPanel /></AdminRoute>} />
          <Route path="*"                    element={<NotFound />} />
        </Routes>
        <Footer />
        <InstallPrompt />
      </div>
    </AuthProvider>
  )
}
