import { Link } from 'react-router-dom';
import logoLight from '../assets/carna logo W.svg';

export default function Footer() {
  return (
    <footer className="bg-on-background dark:bg-on-tertiary-fixed">
      <div className="flex flex-col items-center justify-center w-full py-xl px-margin-desktop text-center space-y-md">
        <img alt="CARNA" className="h-12 mb-sm" src={logoLight} />
        <nav className="flex gap-lg flex-wrap justify-center mb-md">
          <Link className="text-white opacity-80 font-label-lg text-label-lg hover:text-primary transition-colors duration-200" to="/terms">شروط الاستخدام</Link>
          <Link className="text-white opacity-80 font-label-lg text-label-lg hover:text-primary transition-colors duration-200" to="/contact">اتصل بنا</Link>
          <Link className="text-white opacity-80 font-label-lg text-label-lg hover:text-primary transition-colors duration-200" to="/privacy">سياسة الخصوصية</Link>
          <Link className="text-white opacity-80 font-label-lg text-label-lg hover:text-primary transition-colors duration-200" to="/plans">باقات الورشات</Link>
        </nav>
        <div className="flex gap-md mb-md">
          <button className="text-white/60 hover:text-accent-yellow transition-colors"><span className="material-symbols-outlined">share</span></button>
          <button className="text-white/60 hover:text-accent-yellow transition-colors"><span className="material-symbols-outlined">notifications</span></button>
          <button className="text-white/60 hover:text-accent-yellow transition-colors"><span className="material-symbols-outlined">help</span></button>
        </div>
        <p className="font-body-md text-body-md text-white/60">© 2024 كارنا. جميع الحقوق محفوظة.</p>
      </div>
    </footer>
  );
}
