import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import logoDark from '../assets/carna logo.svg';
import logoLight from '../assets/carna logo W.svg';
import NotificationBell from './NotificationBell';

export default function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    html.classList.toggle('dark');
    setIsDark(!isDark);
    localStorage.setItem('theme', !isDark ? 'dark' : 'light');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const linkClass = (path: string) =>
    isActive(path)
      ? "text-primary dark:text-yellow-400 font-bold border-b-2 border-primary dark:border-yellow-400 pb-1 px-md font-label-lg text-label-lg transition-all whitespace-nowrap flex-shrink-0"
      : "text-on-surface-variant dark:text-on-surface-variant font-label-lg text-label-lg hover:text-primary dark:hover:text-yellow-400 transition-colors duration-200 pb-1 border-b-2 border-transparent whitespace-nowrap flex-shrink-0 px-md";


  return (
    <header className="bg-surface-white dark:bg-background border-b border-border-light dark:border-border-light sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-16">
        <div className="flex items-center gap-md">
          <button
            className="md:hidden flex items-center justify-center p-2 rounded-full hover:bg-surface-container dark:hover:bg-surface active:scale-95 dark:text-on-surface"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={isMobileMenuOpen}
          >
            <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
          <Link to="/">
            <img alt="CARNA" className="h-8" src={isDark ? logoLight : logoDark} />
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-xl flex-nowrap justify-center flex-1">
          <Link className={linkClass('/')} to="/">السيارات</Link>
          <Link className={linkClass('/workshops')} to="/workshops">الورشات</Link>
          <Link className={linkClass('/about')} to="/about">حول كارنا</Link>
        </nav>
        <div className="flex items-center gap-sm ml-auto">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="text-on-surface-variant dark:text-on-surface-variant hover:text-primary dark:hover:text-yellow-400 transition-colors flex items-center justify-center p-2 rounded-full hover:bg-surface-container dark:hover:bg-surface active:scale-95"
            title={isDark ? "الوضع الفاتح" : "الوضع الليلي"}
            aria-label={isDark ? "تبديل إلى الوضع الفاتح" : "تبديل إلى الوضع الليلي"}
          >
            <span className="material-symbols-outlined text-[24px]">
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {user ? (
            <>
              <Link to="/post-ad" className="bg-primary-container dark:bg-yellow-500 text-on-primary-container dark:text-black px-sm py-xs rounded-lg font-label-lg text-label-lg hover:bg-inverse-primary dark:hover:bg-yellow-400 transition-all active:scale-95 text-xs md:text-base">
                + أضف إعلانك
              </Link>
              {/* Messages icon */}
              <Link
                to="/messages"
                className="text-on-surface-variant dark:text-on-surface-variant hover:text-primary dark:hover:text-yellow-400 transition-colors flex items-center justify-center p-2 rounded-full hover:bg-surface-container dark:hover:bg-surface active:scale-95"
                title="الرسائل"
              >
                <span className="material-symbols-outlined text-[24px]">chat</span>
              </Link>
              {/* Notification Bell */}
              <NotificationBell />
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-error dark:text-red-400 hover:bg-error-container/30 dark:hover:bg-red-900/30 px-2 md:px-3 py-1.5 rounded-lg transition-colors font-bold text-xs md:text-label-md"
                title="تسجيل الخروج"
                aria-label="تسجيل الخروج"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                <span className="hidden md:inline">خروج</span>
              </button>
              <Link to="/dashboard" className="text-on-surface-variant dark:text-on-surface-variant hover:text-primary dark:hover:text-yellow-400 transition-colors flex items-center justify-center p-2 rounded-full hover:bg-surface-container dark:hover:bg-surface active:scale-95" title="لوحة التحكم">
                <span className="material-symbols-outlined text-[28px]">account_circle</span>
              </Link>
            </>
          ) : (
            <Link to="/login" className="text-on-surface-variant dark:text-on-surface-variant hover:text-primary dark:hover:text-yellow-400 transition-colors flex items-center justify-center p-2 rounded-full hover:bg-surface-container dark:hover:bg-surface active:scale-95" title="تسجيل الدخول / حساب جديد">
              <span className="material-symbols-outlined text-[28px]">account_circle</span>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-surface-white dark:bg-background border-b border-border-light dark:border-border-light shadow-lg">
          <nav className="flex flex-col p-md gap-4">
            <Link onClick={() => setIsMobileMenuOpen(false)} className={linkClass('/')} to="/">السيارات</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} className={linkClass('/workshops')} to="/workshops">الورشات</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} className={linkClass('/about')} to="/about">حول كارنا</Link>
            {user && (
              <>
                <Link onClick={() => setIsMobileMenuOpen(false)} to="/messages" className="text-center bg-surface-container-low dark:bg-surface text-on-surface dark:text-on-surface px-sm py-xs rounded-lg font-label-lg hover:bg-surface-container dark:hover:bg-surface transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  الرسائل
                </Link>
                <Link onClick={() => setIsMobileMenuOpen(false)} to="/post-ad" className="text-center bg-primary-container dark:bg-yellow-500 text-on-primary-container dark:text-black px-sm py-xs rounded-lg font-label-lg hover:bg-inverse-primary dark:hover:bg-yellow-400 transition-all">
                  + أضف إعلانك
                </Link>
                <button
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  className="flex items-center justify-center gap-2 bg-error-container/20 dark:bg-red-900/30 text-error dark:text-red-400 px-sm py-xs rounded-lg font-label-lg hover:bg-error-container/40 dark:hover:bg-red-900/50 transition-all mt-2"
                >
                  <span className="material-symbols-outlined">logout</span>
                  تسجيل الخروج
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
