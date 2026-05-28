import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import ListingPage from './pages/ListingPage'
import PostAd from './pages/PostAd'
import Services from './pages/Services'
import NotFound from './pages/NotFound'
import './index.css'

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/"              element={<Home />} />
        <Route path="/listing/:id"   element={<ListingPage />} />
        <Route path="/post"          element={<PostAd />} />
        <Route path="/services"      element={<Services />} />
        <Route path="*"              element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  )
}
