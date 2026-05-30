import { Mail, MessageCircle, Clock, MapPin } from 'lucide-react'
import SEO from '../components/SEO'

export default function Contact() {
  return (
    <main className="bg-background text-on-surface min-h-screen rtl flex flex-col">
      <SEO title="اتصل بنا" url="/contact"/>
      
      {/* Header Pattern Background */}
      <div className="bg-surface-bright border-b border-border-light relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2"></div>
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 relative z-10 text-center">
          <h1 className="font-display-lg text-display-lg font-black text-text-primary mb-sm">اتصل بنا</h1>
          <p className="font-body-lg text-body-lg text-text-muted max-w-2xl mx-auto">
            فريق كارنا جاهز للمساعدة — سواء كان لديك استفسار، مشكلة تقنية، أو ترغب في تسجيل ورشتك في الدليل المعتمد.
          </p>
        </div>
      </div>

      <div className="flex-1 max-w-5xl mx-auto px-margin-mobile md:px-margin-desktop py-xl grid grid-cols-1 md:grid-cols-2 gap-xl">
        
        {/* Contact Methods */}
        <div className="space-y-md">
          <h2 className="font-headline-sm text-headline-sm font-bold text-text-primary mb-lg">قنوات التواصل</h2>
          
          <a href="mailto:info@carna.online" className="flex items-center gap-md bg-surface-white border border-border-light rounded-xl p-md transition-all hover:border-primary hover:shadow-sm group">
            <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Mail size={24} />
            </div>
            <div>
              <div className="font-label-sm text-label-sm text-text-muted mb-1">البريد الإلكتروني للشكاوي والاقتراحات</div>
              <div className="font-headline-sm text-headline-sm font-bold text-text-primary" dir="ltr">info@carna.online</div>
            </div>
          </a>

          <a href="https://wa.me/963000000000" target="_blank" rel="noopener noreferrer" className="flex items-center gap-md bg-surface-white border border-border-light rounded-xl p-md transition-all hover:border-green-500 hover:shadow-sm group">
            <div className="w-12 h-12 rounded-lg bg-green-50 text-green-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <MessageCircle size={24} />
            </div>
            <div>
              <div className="font-label-sm text-label-sm text-text-muted mb-1">واتساب (للورشات والاستفسارات التجارية)</div>
              <div className="font-headline-sm text-headline-sm font-bold text-text-primary">تواصل عبر واتساب</div>
            </div>
          </a>
        </div>

        {/* Working Hours & Info */}
        <div className="space-y-md">
          <div className="flat-card p-lg">
            <div className="flex items-center gap-sm mb-md text-text-primary">
              <Clock className="text-primary" />
              <h2 className="font-headline-sm text-headline-sm font-bold">أوقات الدعم الفني</h2>
            </div>
            <div className="space-y-sm font-body-md text-text-muted">
              <div className="flex justify-between items-center py-xs border-b border-border-light">
                <span>السبت — الخميس</span>
                <span className="font-bold text-text-primary">9:00 ص — 9:00 م</span>
              </div>
              <div className="flex justify-between items-center py-xs">
                <span>الجمعة</span>
                <span className="font-bold text-error">مغلق</span>
              </div>
            </div>
          </div>

          <div className="bg-accent-yellow/10 border border-accent-yellow/30 rounded-xl p-lg relative overflow-hidden">
            <div className="absolute top-4 left-4 text-accent-yellow opacity-20"><MapPin size={64} /></div>
            <h2 className="font-label-lg text-label-lg font-bold text-text-primary mb-xs">هل ترغب بتسجيل مركز خدمة؟</h2>
            <p className="font-body-sm text-body-sm text-text-muted leading-relaxed relative z-10">
              أرسل بريداً إلى <span className="font-bold text-text-primary" dir="ltr">info@carna.online</span> يتضمن اسم الورشة، المدينة، ورقم التواصل — وسيقوم فريقنا بالتواصل معك وتحديد موعد لزيارة المركز خلال 24 ساعة لتوثيقه وإدراجه.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
