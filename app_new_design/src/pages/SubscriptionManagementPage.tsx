

export default function SubscriptionManagementPage() {
  return (
    <div className="bg-surface-container-low min-h-screen py-lg">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop space-y-md">
        
        <div className="flex items-center justify-between">
          <h1 className="font-headline-lg text-headline-lg text-text-primary">إدارة الاشتراك</h1>
          <button className="text-secondary font-label-lg hover:underline">مركز المساعدة</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
          {/* Current Plan Overview */}
          <div className="lg:col-span-2 space-y-md">
            
            <div className="bg-surface-white border-2 border-secondary rounded-xl p-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-full bg-secondary"></div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-sm mb-lg">
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-secondary mb-xs">الباقة الحالية: الباقة المتوسطة</h2>
                  <p className="font-body-sm text-text-muted">مخصصة للمعارض والورش المتوسطة التي ترغب في تعزيز حضورها الرقمي.</p>
                </div>
                <div className="text-right sm:text-left">
                  <p className="font-display-lg text-text-primary">$49</p>
                  <p className="font-body-sm text-text-muted">تجدد شهرياً</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-sm mb-lg border-t border-b border-border-light py-md">
                <div className="text-center">
                  <p className="font-label-sm text-text-muted mb-xs">السيارات المعروضة</p>
                  <p className="font-headline-sm text-primary">12 / 15</p>
                </div>
                <div className="text-center border-r border-border-light">
                  <p className="font-label-sm text-text-muted mb-xs">الإعلانات المميزة</p>
                  <p className="font-headline-sm text-primary">2 / 3</p>
                </div>
                <div className="text-center border-r border-border-light">
                  <p className="font-label-sm text-text-muted mb-xs">مدة الاشتراك المتبقية</p>
                  <p className="font-headline-sm text-text-primary">14 يوم</p>
                </div>
                <div className="text-center border-r border-border-light">
                  <p className="font-label-sm text-text-muted mb-xs">المشاهدات الكلية</p>
                  <p className="font-headline-sm text-text-primary">+3,200</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-sm">
                <button className="flex-1 bg-secondary text-on-secondary py-sm rounded-lg font-label-lg hover:brightness-110 transition-all">
                  ترقية الباقة
                </button>
                <button className="flex-1 bg-surface-container text-text-primary py-sm rounded-lg font-label-lg hover:bg-surface-dim transition-all">
                  تعديل تفاصيل الدفع
                </button>
              </div>
            </div>

            {/* Invoices History */}
            <div className="bg-surface-white border border-border-light rounded-xl p-md">
              <h3 className="font-headline-sm text-headline-sm text-text-primary mb-md">سجل الفواتير والدفع</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="border-b border-border-light text-text-muted font-label-sm">
                      <th className="pb-sm pr-xs">رقم الفاتورة</th>
                      <th className="pb-sm pr-xs">التاريخ</th>
                      <th className="pb-sm pr-xs">المبلغ</th>
                      <th className="pb-sm pr-xs">الحالة</th>
                      <th className="pb-sm pr-xs">إجراء</th>
                    </tr>
                  </thead>
                  <tbody className="font-body-sm text-text-primary">
                    <tr className="border-b border-border-light hover:bg-surface-container-low transition-colors">
                      <td className="py-sm pr-xs">#INV-2024-009</td>
                      <td className="py-sm pr-xs">1 مايو 2024</td>
                      <td className="py-sm pr-xs font-bold">$49.00</td>
                      <td className="py-sm pr-xs">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">مدفوع</span>
                      </td>
                      <td className="py-sm pr-xs">
                        <button className="text-secondary hover:underline">تحميل PDF</button>
                      </td>
                    </tr>
                    <tr className="border-b border-border-light hover:bg-surface-container-low transition-colors">
                      <td className="py-sm pr-xs">#INV-2024-008</td>
                      <td className="py-sm pr-xs">1 أبريل 2024</td>
                      <td className="py-sm pr-xs font-bold">$49.00</td>
                      <td className="py-sm pr-xs">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">مدفوع</span>
                      </td>
                      <td className="py-sm pr-xs">
                        <button className="text-secondary hover:underline">تحميل PDF</button>
                      </td>
                    </tr>
                    <tr className="border-b border-border-light hover:bg-surface-container-low transition-colors">
                      <td className="py-sm pr-xs">#INV-2024-007</td>
                      <td className="py-sm pr-xs">1 مارس 2024</td>
                      <td className="py-sm pr-xs font-bold">$49.00</td>
                      <td className="py-sm pr-xs">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">مدفوع</span>
                      </td>
                      <td className="py-sm pr-xs">
                        <button className="text-secondary hover:underline">تحميل PDF</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Sidebar Offers */}
          <div className="space-y-md">
            <div className="bg-surface-white border border-border-light rounded-xl p-md">
              <h3 className="font-headline-sm text-headline-sm text-text-primary mb-sm">ترقية إلى الباقة المميزة</h3>
              <p className="font-body-sm text-text-muted mb-md">احصل على إعلانات غير محدودة وتحكم كامل في صفحة معرضك بتصميم مخصص.</p>
              
              <ul className="space-y-xs mb-lg">
                <li className="flex items-center gap-xs font-body-sm">
                  <span className="material-symbols-outlined text-[16px] text-verification-blue">check_circle</span>
                  إعلانات سيارات غير محدودة
                </li>
                <li className="flex items-center gap-xs font-body-sm">
                  <span className="material-symbols-outlined text-[16px] text-verification-blue">check_circle</span>
                  10 إعلانات مميزة شهرياً
                </li>
                <li className="flex items-center gap-xs font-body-sm">
                  <span className="material-symbols-outlined text-[16px] text-verification-blue">check_circle</span>
                  بانر إعلاني للصفحة
                </li>
              </ul>
              
              <div className="text-center bg-surface-container rounded-lg p-sm mb-md">
                <span className="text-text-muted text-sm line-through block">$149/شهرياً</span>
                <span className="text-xl font-bold text-primary block">$99/شهرياً</span>
                <span className="text-xs text-text-muted">خصم 33% لأول 3 أشهر</span>
              </div>
              
              <button className="w-full bg-primary text-on-primary py-sm rounded-lg font-label-lg hover:brightness-110 transition-all">
                ترقية الآن
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
