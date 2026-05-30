
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logoDark from '../assets/carna logo.svg';

export default function Header() {
  const { user } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const linkClass = (path: string) => 
    isActive(path)
      ? "text-primary font-bold border-b-2 border-primary pb-1 font-label-lg text-label-lg transition-all"
      : "text-on-surface-variant font-label-lg text-label-lg hover:text-primary transition-colors duration-200 pb-1 border-b-2 border-transparent";


  return (
    <header className="bg-surface-white border-b border-border-light sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-margin-desktop max-w-container-max mx-auto h-16">
        <div className="flex items-center gap-md">
          <Link to="/">
            <img alt="CARNA" className="h-8" src={logoDark} />
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-lg">
          <Link className={linkClass('/')} to="/">السيارات</Link>
          <Link className={linkClass('/workshops')} to="/workshops">الورشات</Link>
          <Link className={linkClass('/about')} to="/about">حول كارنا</Link>
        </nav>
        <div className="flex items-center gap-sm">
          {user ? (
            <>
              <Link to="/post-ad" className="hidden md:flex bg-primary-container text-on-primary-container px-sm py-xs rounded-lg font-label-lg text-label-lg hover:bg-inverse-primary transition-all active:scale-95">
                + أضف إعلانك
              </Link>
              <Link to="/user/dashboard" className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center p-2 rounded-full hover:bg-surface-container active:scale-95">
                <span className="material-symbols-outlined text-[28px]">account_circle</span>
              </Link>
            </>
          ) : (
            <Link to="/login" className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center p-2 rounded-full hover:bg-surface-container active:scale-95" title="تسجيل الدخول / حساب جديد">
              <span className="material-symbols-outlined text-[28px]">account_circle</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
