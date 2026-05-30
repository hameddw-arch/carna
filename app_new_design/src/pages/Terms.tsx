import SEO from '../components/SEO'
import { Link } from 'react-router-dom';

export default function Terms() {
  const terms = [
    { title: '1. قبول الشروط', body: 'باستخدامك لموقع كارنا (carna.online) فإنك توافق على هذه الشروط. إذا كنت لا توافق على أي بند من هذه الشروط، يرجى التوقف عن استخدام الموقع.' },
    { title: '2. طبيعة المنصة', body: 'كارنا هي منصة إعلانات مبوبة للسيارات — تتيح للأفراد والوكلاء عرض سياراتهم للبيع. كارنا لا تشارك في أي عملية بيع أو شراء ولا تتحمل أي مسؤولية عن صحة بيانات الإعلانات أو موثوقية البائعين.' },
    { title: '3. مسؤولية البائع', body: 'البائع وحده مسؤول عن دقة المعلومات المدخلة في إعلانه (السعر، الحالة، الصور، السنة، الكيلومتراج). كارنا تحتفظ بحق رفض أو حذف أي إعلان مخالف للشروط دون إشعار مسبق.' },
    { title: '4. مسؤولية المشتري', body: 'على المشتري التحقق من بيانات السيارة والتواصل المباشر مع البائع قبل إتمام أي صفقة. ننصح بشدة بإجراء فحص فني قبل الشراء عبر أحد مراكز الفحص المعتمدة المدرجة في الموقع.' },
    { title: '5. الإعلانات المحظورة', body: 'يُمنع نشر إعلانات لسيارات مسروقة أو مزورة الوثائق أو تحتوي على صور مضللة أو معلومات كاذبة. المخالفة تؤدي إلى الحظر الدائم.' },
    { title: '6. الخصوصية', body: 'رقم هاتفك المسجّل لا يُعرض للزوار مباشرة. قد يتم التواصل بين البائع والمشتري عبر قنوات خارجية بعد موافقة الطرفين.' },
    { title: '7. الإعلانات المدفوعة', body: 'الإعلانات المميزة (Featured) تُقدَّم مقابل رسوم من رصيد المحفظة. الرسوم غير قابلة للاسترداد بعد تفعيل الباقة.' },
    { title: '8. تعديل الشروط', body: 'تحتفظ كارنا بحق تعديل هذه الشروط في أي وقت. سيتم إشعار المستخدمين المسجلين بأي تغييرات جوهرية.' }
  ];

  return (
    <main className="bg-background text-on-surface min-h-screen rtl flex flex-col">
      <SEO title="شروط الاستخدام" url="/terms"/>
      
      {/* Header Pattern Background */}
      <div className="bg-surface-bright border-b border-border-light relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-16 relative z-10 text-center">
          <h1 className="font-display-lg text-display-lg font-black text-text-primary mb-sm">شروط الاستخدام</h1>
          <p className="font-body-lg text-body-lg text-text-muted">آخر تحديث: {new Date().toLocaleDateString('ar-SY')}</p>
        </div>
      </div>

      <div className="flex-1 max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-xl">
        <div className="flat-card p-lg space-y-xl">
          {terms.map((term) => (
            <div key={term.title}>
              <h2 className="font-headline-sm text-headline-sm font-bold text-text-primary mb-sm border-r-4 border-primary pr-sm">{term.title}</h2>
              <p className="font-body-md text-body-md text-text-muted leading-relaxed">{term.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-xl text-center pb-xl">
          <p className="font-body-md text-body-md text-text-muted mb-md">هل لديك استفسار حول الشروط؟</p>
          <Link to="/contact" className="inline-block bg-primary text-on-primary px-lg py-sm rounded-lg font-label-lg transition-all hover:brightness-110 active:scale-95">تواصل معنا</Link>
        </div>
      </div>
    </main>
  );
}
