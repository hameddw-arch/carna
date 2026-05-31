import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const navItems = [
    { path: '/dashboard', icon: 'dashboard', label: 'لوحة التحكم', activePaths: ['/dashboard'] },
    { path: '/wallet', icon: 'account_balance_wallet', label: 'المحفظة', activePaths: ['/wallet'] },
    { path: '/messages', icon: 'chat', label: 'الرسائل', activePaths: ['/messages'] },
    { path: '/favorites', icon: 'favorite', label: 'المفضلة', activePaths: ['/favorites'] },
    { path: '/account-settings', icon: 'settings', label: 'الإعدادات', activePaths: ['/account-settings'] },
  ];

  const isActive = (paths: string[]) => paths.includes(location.pathname);

  return (
    <div className="flex flex-col md:flex-row max-w-container-max mx-auto md:px-margin-desktop min-h-screen rtl">
      
      {/* SideNavBar (Sticky & Hidden on Mobile) */}
      <aside className="hidden md:flex w-64 h-screen sticky top-20 flex-col py-md border-l border-border-light bg-surface-container-lowest dark:bg-surface-container shrink-0 z-20">
        <div className="px-md mb-lg">
          <div className="flex items-center gap-sm mb-xs">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-border-light bg-surface-container flex items-center justify-center text-primary font-bold">
              {user?.avatar_url ? (
                <img alt={user.name || 'مستخدم'} className="w-full h-full object-cover" src={user.avatar_url} />
              ) : (
                <span className="material-symbols-outlined text-[24px]">person</span>
              )}
            </div>
            <div>
              <h3 className="font-label-lg text-label-lg font-bold text-on-surface truncate max-w-[140px]">{user?.name || 'مستخدم'}</h3>
              <p className="font-body-sm text-[12px] text-tertiary">{user?.role === 'workshop' ? 'حساب ورشة/معرض' : 'عضو كارنا'}</p>
            </div>
          </div>
          <Link to="/subscription-plans" className="w-full mt-sm py-xs bg-secondary-container/10 text-secondary border border-secondary/20 rounded font-label-sm text-label-sm hover:bg-secondary-container/20 transition-all flex justify-center">
            ترقية الحساب
          </Link>
        </div>
        <nav className="flex flex-col flex-1">
          {navItems.map((item) => {
            const active = isActive(item.activePaths);
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`flex items-center gap-3 px-4 py-3 font-label-lg text-label-lg transition-all duration-200 ${
                  active 
                    ? 'text-primary bg-primary-container/10 border-r-4 border-primary font-bold' 
                    : 'text-tertiary hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined" style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
          <div className="mt-auto pt-sm border-t border-border-light">
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-3 text-error px-4 py-3 mt-4 font-label-lg text-label-lg hover:bg-error-container/50 transition-all duration-200 w-full text-right"
            >
              <span className="material-symbols-outlined">logout</span>
              تسجيل الخروج
            </button>
          </div>
        </nav>
      </aside>

      {/* Mobile Navigation Bar */}
      <nav className="md:hidden flex overflow-x-auto gap-2 py-4 px-4 bg-surface-white border-b border-border-light mb-4 sticky top-[60px] z-[50] hide-scrollbar shadow-sm" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
        <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
        {navItems.map((item) => {
          const active = isActive(item.activePaths);
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`whitespace-nowrap flex items-center gap-1 font-bold px-4 py-2 rounded-full border transition-colors ${
                active 
                  ? 'text-primary bg-primary-container/10 border-primary/20' 
                  : 'text-tertiary hover:bg-surface-container border-transparent'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]" style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={handleLogout}
          className="whitespace-nowrap flex items-center gap-1 text-error font-bold hover:bg-error-container/20 px-4 py-2 rounded-full border border-transparent transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          خروج
        </button>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  );
}
