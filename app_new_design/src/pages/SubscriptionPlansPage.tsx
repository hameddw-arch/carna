import { Link } from 'react-router-dom';

export default function SubscriptionPlansPage() {
  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col relative overflow-x-hidden">
      
      {/* Visual Background Element */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] z-0">
        <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYMByKYWVuJ7QJluAXE4vqECBHl84k0rpG2xqp2O-JOhqMqS3JKlO8XN-meEh4U-CWjvq5oHlRltamW7z7IQOCKt2PUrx3gTN8MXQJOlqG6DhQGMfg5iVW-Qem7KLyfmSO-F9IiR-GElRswpjg0DUxpMsS3JUPgVQMZLpVIvAruC4_HMufI1mWlCsUr8DFwKr-2-Xtpriwcscy3G6a_Zvo-3BKPIrm68cX8Rs0k4rs2N4jSW-yF5DUzk3FgRt6g2fEGiw4nOeWlzOo" alt="Background" />
      </div>



      <div className="flex min-h-screen rtl w-full flex-grow z-10">
        {/* SideNavBar */}
        <aside className="flex flex-col h-[calc(100vh-64px)] p-sm fixed right-0 top-16 z-40 bg-surface-bright border-l border-border-light w-64 hidden md:flex">
          <div className="flex items-center gap-sm mb-lg px-xs">
            <div className="w-12 h-12 bg-primary-container flex items-center justify-center rounded-xl text-on-primary-container">
              <span className="material-symbols-outlined">person</span>
            </div>
            <div>
              <h3 className="font-label-lg text-label-lg font-bold">أهلاً بك</h3>
              <p className="font-label-sm text-label-sm text-text-muted">إدارة حسابك</p>
            </div>
          </div>
          <nav className="flex-1 space-y-base">
            <a className="flex items-center gap-sm px-sm py-md text-text-primary hover:bg-surface-container-high rounded-lg transition-all duration-150 active:scale-95" href="#">
              <span className="material-symbols-outlined">dashboard</span>
              <span className="font-label-lg text-label-lg">لوحة القيادة</span>
            </a>
            <a className="flex items-center gap-sm px-sm py-md text-text-primary hover:bg-surface-container-high rounded-lg transition-all duration-150 active:scale-95" href="#">
              <span className="material-symbols-outlined">directions_car</span>
              <span className="font-label-lg text-label-lg">إعلاناتي</span>
            </a>
            <a className="flex items-center gap-sm px-sm py-md text-text-primary hover:bg-surface-container-high rounded-lg transition-all duration-150 active:scale-95" href="#">
              <span className="material-symbols-outlined">mail</span>
              <span className="font-label-lg text-label-lg">الرسائل</span>
            </a>
            <a className="flex items-center gap-sm px-sm py-md text-text-primary hover:bg-surface-container-high rounded-lg transition-all duration-150 active:scale-95" href="#">
              <span className="material-symbols-outlined">favorite</span>
              <span className="font-label-lg text-label-lg">المفضلة</span>
            </a>
            <a className="flex items-center gap-sm px-sm py-md text-on-primary-container bg-primary-container rounded-lg font-bold transition-all duration-150 active:scale-95" href="#">
              <span className="material-symbols-outlined">settings</span>
              <span className="font-label-lg text-label-lg">الإعدادات</span>
            </a>
          </nav>
          <div className="mt-auto border-t border-border-light pt-sm">
            <button className="flex items-center gap-sm px-sm py-md w-full text-error hover:bg-error-container rounded-lg transition-all active:scale-95">
              <span className="material-symbols-outlined">logout</span>
              <span className="font-label-lg text-label-lg">تسجيل الخروج</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 mr-0 md:mr-64 p-margin-mobile md:p-margin-desktop overflow-x-hidden">
          <div className="max-w-5xl mx-auto">
            {/* Page Title */}
            <div className="mb-lg">
              <h1 className="font-headline-lg text-headline-lg text-text-primary mb-xs">إدارة باقات الاشتراك</h1>
              <p className="font-body-md text-body-md text-text-muted">اختر الباقة المناسبة لاحتياجاتك في سوق السيارات السوري</p>
            </div>

            {/* Current Plan Status Card */}
            <section className="bg-surface-white border border-border-light rounded-xl p-md mb-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-full bg-accent-yellow"></div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
                <div className="flex items-center gap-md">
                  <div className="w-16 h-16 bg-surface-container flex items-center justify-center rounded-full">
                    <span className="material-symbols-outlined text-4xl text-primary">workspace_premium</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-xs">
                      <h2 className="font-headline-sm text-headline-sm text-text-primary">الباقة الأساسية</h2>
                      <span className="bg-verification-blue/10 text-verification-blue px-xs py-base rounded-full text-[10px] font-bold">نشطة حالياً</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-text-muted">تنتهي الصلاحية في: <span className="text-text-primary font-bold">15 حزيران 2024</span></p>
                  </div>
                </div>
                <div className="flex flex-col md:items-end gap-xs">
                  <div className="w-full md:w-48 bg-surface-container h-2 rounded-full overflow-hidden">
                    <div className="bg-accent-yellow h-full w-2/3"></div>
                  </div>
                  <p className="font-label-sm text-label-sm text-text-muted">استهلاك الإعلانات: <span className="text-text-primary font-bold">6 من أصل 10 إعلانات</span></p>
                </div>
                <button className="bg-primary text-on-primary font-label-lg text-label-lg px-lg py-sm rounded-lg hover:brightness-110 transition-all active:scale-95">
                  تجديد الاشتراك
                </button>
              </div>
            </section>

            {/* Subscription Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-xl">
              {/* Free Plan */}
              <div className="bg-surface-white border border-border-light rounded-xl p-md flex flex-col plan-card-hover transition-all duration-200">
                <div className="mb-md">
                  <h3 className="font-headline-sm text-headline-sm text-text-primary mb-xs">الباقة المجانية</h3>
                  <div className="flex items-baseline gap-xs">
                    <span className="font-headline-lg text-headline-lg text-text-primary">0</span>
                    <span className="font-label-lg text-label-lg text-text-muted">ل.س / شهر</span>
                  </div>
                </div>
                <ul className="space-y-sm flex-1 mb-lg">
                  <li className="flex items-center gap-sm font-body-sm text-body-sm text-text-primary">
                    <span className="material-symbols-outlined text-verification-blue fill">check_circle</span>
                    إعلان واحد فعال
                  </li>
                  <li className="flex items-center gap-sm font-body-sm text-body-sm text-text-primary">
                    <span className="material-symbols-outlined text-verification-blue fill">check_circle</span>
                    ظهور قياسي في نتائج البحث
                  </li>
                  <li className="flex items-center gap-sm font-body-sm text-body-sm text-text-muted">
                    <span className="material-symbols-outlined">cancel</span>
                    لا تتوفر إحصائيات
                  </li>
                  <li className="flex items-center gap-sm font-body-sm text-body-sm text-text-muted">
                    <span className="material-symbols-outlined">cancel</span>
                    دعم فني عبر البريد
                  </li>
                </ul>
                <Link to="/workshop-registration?tier=عادي" className="block text-center w-full border font-label-lg text-label-lg py-sm rounded-lg hover:bg-surface-container-high transition-colors border-primary text-primary active:scale-95">التحويل لهذه الباقة</Link>
              </div>

              {/* Basic Plan */}
              <div className="bg-surface-white border-2 border-accent-yellow rounded-xl p-md flex flex-col relative shadow-lg scale-105 z-10">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent-yellow text-on-primary-container px-md py-base rounded-full font-bold text-xs uppercase tracking-wider">الأكثر طلباً</div>
                <div className="mb-md">
                  <h3 className="font-headline-sm text-headline-sm text-text-primary mb-xs">الباقة الأساسية</h3>
                  <div className="flex items-baseline gap-xs">
                    <span className="font-headline-lg text-headline-lg text-text-primary">25,000</span>
                    <span className="font-label-lg text-label-lg text-text-muted">ل.س / شهر</span>
                  </div>
                </div>
                <ul className="space-y-sm flex-1 mb-lg">
                  <li className="flex items-center gap-sm font-body-sm text-body-sm text-text-primary">
                    <span className="material-symbols-outlined text-verification-blue fill">check_circle</span>
                    10 إعلانات فعالة
                  </li>
                  <li className="flex items-center gap-sm font-body-sm text-body-sm text-text-primary">
                    <span className="material-symbols-outlined text-verification-blue fill">check_circle</span>
                    ظهور محسّن في الفئات
                  </li>
                  <li className="flex items-center gap-sm font-body-sm text-body-sm text-text-primary">
                    <span className="material-symbols-outlined text-verification-blue fill">check_circle</span>
                    إحصائيات وصول أساسية
                  </li>
                  <li className="flex items-center gap-sm font-body-sm text-body-sm text-text-primary">
                    <span className="material-symbols-outlined text-verification-blue fill">check_circle</span>
                    دعم فني خلال 24 ساعة
                  </li>
                </ul>
                <Link to="/workshop-registration?tier=مميز" className="block text-center w-full font-label-lg text-label-lg py-sm rounded-lg hover:brightness-95 transition-all bg-accent-yellow text-black">اشترك الآن</Link>
              </div>

              {/* Premium Plan */}
              <div className="bg-surface-white border border-border-light rounded-xl p-md flex flex-col plan-card-hover transition-all duration-200">
                <div className="mb-md">
                  <h3 className="font-headline-sm text-headline-sm text-text-primary mb-xs">الباقة المميزة</h3>
                  <div className="flex items-baseline gap-xs">
                    <span className="font-headline-lg text-headline-lg text-text-primary">75,000</span>
                    <span className="font-label-lg text-label-lg text-text-muted">ل.س / شهر</span>
                  </div>
                </div>
                <ul className="space-y-sm flex-1 mb-lg">
                  <li className="flex items-center gap-sm font-body-sm text-body-sm text-text-primary">
                    <span className="material-symbols-outlined text-verification-blue fill">check_circle</span>
                    إعلانات غير محدودة
                  </li>
                  <li className="flex items-center gap-sm font-body-sm text-body-sm text-text-primary">
                    <span className="material-symbols-outlined text-verification-blue fill">check_circle</span>
                    تثبيت الإعلانات في الصدارة
                  </li>
                  <li className="flex items-center gap-sm font-body-sm text-body-sm text-text-primary">
                    <span className="material-symbols-outlined text-verification-blue fill">check_circle</span>
                    تحليلات سوق متقدمة
                  </li>
                  <li className="flex items-center gap-sm font-body-sm text-body-sm text-text-primary">
                    <span className="material-symbols-outlined text-verification-blue fill">check_circle</span>
                    مدير حساب خاص (أولوية)
                  </li>
                </ul>
                <Link to="/workshop-registration?tier=حصري" className="block text-center w-full bg-on-background text-on-primary font-label-lg text-label-lg py-sm rounded-lg hover:bg-tertiary transition-all active:scale-95">
                  انضم للمحترفين
                </Link>
              </div>
            </div>

            {/* Payment Methods Section */}
            <section className="bg-surface-container/50 border border-border-light rounded-xl p-lg z-10 relative">
              <h2 className="font-headline-sm text-headline-sm text-text-primary mb-md">طرق الدفع المتاحة في سوريا</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-sm">
                <div className="bg-surface-white p-sm rounded-lg border border-border-light flex items-center gap-sm hover:shadow-sm transition-shadow">
                  <div className="w-10 h-10 bg-[#E21F26]/10 flex items-center justify-center rounded">
                    <span className="material-symbols-outlined text-[#E21F26]">payments</span>
                  </div>
                  <div>
                    <p className="font-label-lg text-label-lg font-bold">سيريتل كاش</p>
                    <p className="font-label-sm text-label-sm text-text-muted">تحويل رقمي سريع</p>
                  </div>
                </div>
                <div className="bg-surface-white p-sm rounded-lg border border-border-light flex items-center gap-sm hover:shadow-sm transition-shadow">
                  <div className="w-10 h-10 bg-[#FFD400]/10 flex items-center justify-center rounded">
                    <span className="material-symbols-outlined text-primary">wallet</span>
                  </div>
                  <div>
                    <p className="font-label-lg text-label-lg font-bold">MTN كاش</p>
                    <p className="font-label-sm text-label-sm text-text-muted">محفظة إلكترونية</p>
                  </div>
                </div>
                <div className="bg-surface-white p-sm rounded-lg border border-border-light flex items-center gap-sm hover:shadow-sm transition-shadow">
                  <div className="w-10 h-10 bg-verification-blue/10 flex items-center justify-center rounded">
                    <span className="material-symbols-outlined text-verification-blue">account_balance</span>
                  </div>
                  <div>
                    <p className="font-label-lg text-label-lg font-bold">حوالة بنكية</p>
                    <p className="font-label-sm text-label-sm text-text-muted">بيمو / البركة</p>
                  </div>
                </div>
                <div className="bg-surface-white p-sm rounded-lg border border-border-light flex items-center gap-sm hover:shadow-sm transition-shadow">
                  <div className="w-10 h-10 bg-tertiary/10 flex items-center justify-center rounded">
                    <span className="material-symbols-outlined text-tertiary">support_agent</span>
                  </div>
                  <div>
                    <p className="font-label-lg text-label-lg font-bold">تواصل مباشر</p>
                    <p className="font-label-sm text-label-sm text-text-muted">عبر مندوبينا</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-lg flex flex-col md:flex-row md:items-center justify-between gap-sm p-sm bg-primary-container/20 rounded-lg">
                <div className="flex items-center gap-sm">
                  <span className="material-symbols-outlined text-primary">info</span>
                  <p className="font-body-sm text-body-sm text-on-primary-container">للمزيد من الاستفسارات حول طرق الدفع في المحافظات (حلب، حمص، اللاذقية)، يرجى التواصل مع الدعم الفني.</p>
                </div>
                <a className="font-label-lg text-label-lg text-primary font-bold hover:underline" href="tel:0119999">اتصل بنا: 0119999</a>
              </div>
            </section>

            {/* FAQ or Help Section */}
            <div className="mt-xl text-center mb-xl z-10 relative">
              <p className="font-body-md text-body-md text-text-muted mb-sm">تحتاج مساعدة في اختيار الباقة؟</p>
              <div className="flex justify-center gap-md">
                <button className="flex items-center gap-xs text-primary font-bold hover:gap-sm transition-all active:scale-95 group">
                  <span className="font-label-lg text-label-lg">تحدث مع مستشار كارنا</span>
                  <span className="material-symbols-outlined rotate-180 group-hover:-translate-x-1 transition-transform">arrow_back</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>


    </div>
  );
}
