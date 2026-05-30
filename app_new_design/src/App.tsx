
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BrowseCarsPage from './pages/BrowseCarsPage';
import CarDetailPage from './pages/CarDetailPage';
import WorkshopsDirectoryPage from './pages/WorkshopsDirectoryPage';
import CarComparisonPage from './pages/CarComparisonPage';
import PostAdPage from './pages/PostAdPage';
import EditAdPage from './pages/EditAdPage';
import UserDashboard from './pages/UserDashboard';
import WalletPage from './pages/WalletPage';
import WorkshopRegistrationPage from './pages/WorkshopRegistrationPage';
import MessagesPage from './pages/MessagesPage';
import FavoritesPage from './pages/FavoritesPage';
import WorkshopDetailsPage from './pages/WorkshopDetailsPage';
import SubscriptionManagementPage from './pages/SubscriptionManagementPage';
import AccountSettingsPage from './pages/AccountSettingsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import WorkshopDashboardPage from './pages/WorkshopDashboardPage';
import SubscriptionPlansPage from './pages/SubscriptionPlansPage';
import AboutPage from './pages/AboutPage';
import Login from './pages/Login';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import './App.css';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  return <>{children}</>;
}

export default function App() {
  const location = useLocation();
  const hideHeaderFooter = location.pathname.startsWith('/admin') || location.pathname.startsWith('/workshop-admin');

  return (
    <div dir="rtl" className="bg-surface-white font-body-md text-body-md text-on-surface">
      
      {!hideHeaderFooter && <Header />}
      
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/browse" element={<BrowseCarsPage />} />
          <Route path="/car/:id" element={<CarDetailPage />} />
          <Route path="/workshops" element={<WorkshopsDirectoryPage />} />
          <Route path="/compare" element={<CarComparisonPage />} />
          <Route path="/post-ad" element={<ProtectedRoute><PostAdPage /></ProtectedRoute>} />
          <Route path="/edit-ad/:id" element={<ProtectedRoute><EditAdPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          <Route path="/wallet" element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
          <Route path="/workshop/:id" element={<WorkshopDetailsPage />} />
          <Route path="/workshop-registration" element={<WorkshopRegistrationPage />} />
          <Route path="/subscription" element={<ProtectedRoute><SubscriptionManagementPage /></ProtectedRoute>} />
          <Route path="/account-settings" element={<ProtectedRoute><AccountSettingsPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
          <Route path="/workshop-admin" element={<ProtectedRoute><WorkshopDashboardPage /></ProtectedRoute>} />
          <Route path="/plans" element={<SubscriptionPlansPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </main>

      {!hideHeaderFooter && <Footer />}
    </div>
  );
}

