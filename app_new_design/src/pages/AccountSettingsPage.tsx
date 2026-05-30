import { useState, useEffect } from "react";
import { useAuth } from '../contexts/AuthContext';
import { updateUserProfile } from '../lib/queries';
import { supabase } from '../lib/supabase';

export default function AccountSettingsPage() {
  const { user, setUser, loading } = useAuth();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [passwordData, setPasswordData] = useState({
    new: '',
    confirm: ''
  });
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
      });
      // Try to load notifications if they exist on the user object, else default
      if (user.email_notifications !== undefined) setEmailNotifications(user.email_notifications);
      if (user.sms_notifications !== undefined) setSmsNotifications(user.sms_notifications);
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    setMessage('');
    try {
      const updatedUser = await updateUserProfile(user.id, {
        name: formData.name,
        phone: formData.phone,
        email_notifications: emailNotifications,
        sms_notifications: smsNotifications
      });
      setUser({ 
        ...user, 
        name: updatedUser.name, 
        phone: updatedUser.phone, 
        email_notifications: updatedUser.email_notifications,
        sms_notifications: updatedUser.sms_notifications 
      });
      setMessage('تم حفظ التغييرات بنجاح');
    } catch (err: any) {
      setMessage('حدث خطأ: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (passwordData.new !== passwordData.confirm) {
      setPasswordMessage('كلمات المرور غير متطابقة');
      return;
    }
    if (passwordData.new.length < 6) {
      setPasswordMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    
    setIsSavingPassword(true);
    setPasswordMessage('');
    try {
      const { error } = await supabase.auth.updateUser({ password: passwordData.new });
      if (error) throw error;
      setPasswordMessage('تم تحديث كلمة المرور بنجاح');
      setPasswordData({ new: '', confirm: '' });
    } catch (err: any) {
      setPasswordMessage('حدث خطأ: ' + err.message);
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (loading) return <div className="p-xl text-center">جاري التحميل...</div>;
  if (!user) return <div className="p-xl text-center">الرجاء تسجيل الدخول</div>;

  return (
    <div className="bg-background text-text-primary antialiased min-h-screen flex flex-col rtl">
      


      <div className="flex min-h-screen">
        {/* SideNavBar (Right Side for RTL) */}
        <aside className="hidden md:flex flex-col h-[calc(100vh-64px)] p-sm fixed right-0 top-16 z-40 w-64 bg-surface-bright dark:bg-surface-container border-l border-border-light">
          <div className="flex flex-col items-center py-md border-b border-border-light mb-sm">
            <div className="w-16 h-16 rounded-full overflow-hidden mb-xs border-2 border-primary-container">
              <img alt="مستخدم كارنا" className="w-full h-full object-cover" data-alt="A close-up headshot of a smiling professional individual, reflecting warmth and reliability. The environment is a brightly lit, modern office setting with a minimalist vibe. The color temperature is slightly warm, aligning with the primary brand colors of a high-end automotive service platform." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAU8bdBmnbV0VqJBwnhzXuKsygdRODejV_wnep-XfF0pV7bUaF5Ui7R7jz-SMSKlRGJDm8MCRno3H_1KKDtyf_TWwDP2yWex_UH4tG3DyLfjJUN1420n4pKggr5UQAL94XVwt99vP8Z1AwtMr3v3p2RLvfQVP6QIxYazP2hgIjcd2juOoYlOBU21HDHgaFu2opUThpRxLjiw89r81m8tX4GSjs8xTavOEVOQU7eLEuzW66PV-_EWim8qdZPfkB5HoPMBRN_FD52aPMi" />
            </div>
            <h3 className="font-headline-sm text-headline-sm text-primary">أهلاً بك</h3>
            <p className="font-label-sm text-label-sm text-text-muted">إدارة حسابك</p>
          </div>
          <nav className="flex-grow space-y-xs">
            <a className="flex items-center gap-sm px-sm py-md text-text-primary dark:text-on-surface hover:bg-surface-container-high rounded-lg transition-all active:scale-95 duration-150" href="#">
              <span className="material-symbols-outlined">dashboard</span>
              <span className="font-label-lg text-label-lg">لوحة القيادة</span>
            </a>
            <a className="flex items-center gap-sm px-sm py-md text-text-primary dark:text-on-surface hover:bg-surface-container-high rounded-lg transition-all active:scale-95 duration-150" href="#">
              <span className="material-symbols-outlined">directions_car</span>
              <span className="font-label-lg text-label-lg">إعلاناتي</span>
            </a>
            <a className="flex items-center gap-sm px-sm py-md text-text-primary dark:text-on-surface hover:bg-surface-container-high rounded-lg transition-all active:scale-95 duration-150" href="#">
              <span className="material-symbols-outlined">mail</span>
              <span className="font-label-lg text-label-lg">الرسائل</span>
            </a>
            <a className="flex items-center gap-sm px-sm py-md text-text-primary dark:text-on-surface hover:bg-surface-container-high rounded-lg transition-all active:scale-95 duration-150" href="#">
              <span className="material-symbols-outlined">favorite</span>
              <span className="font-label-lg text-label-lg">المفضلة</span>
            </a>
            <a className="flex items-center gap-sm px-sm py-md text-on-primary-container bg-primary-container rounded-lg font-bold transition-all active:scale-95 duration-150" href="#">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>settings</span>
              <span className="font-label-lg text-label-lg">الإعدادات</span>
            </a>
          </nav>
          <div className="mt-auto pt-sm border-t border-border-light">
            <button className="w-full flex items-center gap-sm px-sm py-md text-error hover:bg-error-container rounded-lg transition-all active:scale-95 duration-150">
              <span className="material-symbols-outlined">logout</span>
              <span className="font-label-lg text-label-lg">تسجيل الخروج</span>
            </button>
          </div>
        </aside>

        {/* Main Content Canvas */}
        <main className="flex-grow mr-0 md:mr-64 px-margin-mobile md:px-margin-desktop py-lg max-w-4xl">
          <header className="mb-lg">
            <h1 className="font-headline-lg text-headline-lg mb-xs">إعدادات الحساب</h1>
            <p className="font-body-md text-body-md text-text-muted">قم بإدارة معلوماتك الشخصية والأمان وتفضيلات التنبيهات.</p>
          </header>

          <div className="space-y-lg">
            {/* 1. Profile Section */}
            <section className="bg-surface-white border border-border-light rounded-xl p-md">
              <div className="flex items-center gap-md mb-lg">
                <span className="material-symbols-outlined text-primary text-3xl">account_circle</span>
                <h2 className="font-headline-sm text-headline-sm">الملف الشخصي</h2>
              </div>
              <div className="flex flex-col md:flex-row gap-lg">
                <div className="relative group w-32 h-32 flex-shrink-0">
                  <img alt="صورة الملف الشخصي" className="w-full h-full object-cover rounded-full border-2 border-border-light group-hover:opacity-75 transition-opacity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxpojTVLaOkwdQdkWLYeJHM1XHkDew9vSm-HZshLyt-JvXw5nVkObC97IYPOueDiW8GSsFSKYR93p3gMLAKAWEqcaMFJ6hVXdU0feR-eQpttU-IY56wTjWQ0blaYI3Q9AwGEEPEdyPWwKs5T1TDdJHMH16dmj6bbwdYgT3mABT08JQHLxroDIlt5L8JuEbH0z1NCNNtyY9oyjeR_VcQ5aC8M7Ah2LSzbceYpnzv2xoflQDGgRu6zW9lGdQUDzmJaNmt-IbJgSCypbs" />
                  <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-full">
                    <span className="material-symbols-outlined text-white">edit</span>
                  </button>
                </div>
                <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-md">
                  <div className="flex flex-col gap-xs group">
                    <label className="font-label-lg text-label-lg text-text-muted">الاسم الكامل</label>
                    <input 
                      className="border border-border-light rounded-lg px-sm py-xs font-body-md transition-transform duration-200 focus-within:scale-[1.01]" 
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-xs group">
                    <label className="font-label-lg text-label-lg text-text-muted">البريد الإلكتروني</label>
                    <div className="relative transition-transform duration-200 focus-within:scale-[1.01]">
                      <input className="w-full border border-border-light bg-surface-container-low rounded-lg px-sm py-xs font-body-md text-text-muted cursor-not-allowed" disabled type="email" value={user.email || ''} />
                      <span className="absolute left-3 top-2.5 material-symbols-outlined text-verification-blue text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-xs group">
                    <label className="font-label-lg text-label-lg text-text-muted">رقم الهاتف</label>
                    <input 
                      className="border border-border-light rounded-lg px-sm py-xs font-body-md transition-transform duration-200 focus-within:scale-[1.01]" 
                      dir="ltr" 
                      type="tel" 
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-md flex items-center justify-between">
                <span className={`font-label-sm ${message.includes('خطأ') ? 'text-error' : 'text-green-600'}`}>{message}</span>
                <button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="bg-primary text-on-primary px-lg py-xs rounded-lg font-label-lg font-bold hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </button>
              </div>
            </section>

            {/* 2. Security Section */}
            <section className="bg-surface-white border border-border-light rounded-xl p-md">
              <div className="flex items-center gap-md mb-lg">
                <span className="material-symbols-outlined text-primary text-3xl">security</span>
                <h2 className="font-headline-sm text-headline-sm">الأمان وكلمة المرور</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div className="flex flex-col gap-xs group">
                  <label className="font-label-lg text-label-lg text-text-muted">كلمة المرور الجديدة</label>
                  <input 
                    className="border border-border-light rounded-lg px-sm py-xs font-body-md transition-transform duration-200 focus-within:scale-[1.01]" 
                    placeholder="••••••••" 
                    type="password" 
                    value={passwordData.new}
                    onChange={e => setPasswordData({...passwordData, new: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-xs group">
                  <label className="font-label-lg text-label-lg text-text-muted">تأكيد كلمة المرور</label>
                  <input 
                    className="border border-border-light rounded-lg px-sm py-xs font-body-md transition-transform duration-200 focus-within:scale-[1.01]" 
                    placeholder="••••••••" 
                    type="password" 
                    value={passwordData.confirm}
                    onChange={e => setPasswordData({...passwordData, confirm: e.target.value})}
                  />
                </div>
              </div>
              <div className="mt-md flex items-center justify-between">
                <span className={`font-label-sm ${passwordMessage.includes('نجاح') ? 'text-green-600' : 'text-error'}`}>{passwordMessage}</span>
                <button 
                  onClick={handleUpdatePassword}
                  disabled={isSavingPassword || !passwordData.new || !passwordData.confirm}
                  className="bg-accent-yellow text-on-primary-fixed px-lg py-xs rounded-lg font-label-lg font-bold hover:brightness-95 transition-all disabled:opacity-50"
                >
                  {isSavingPassword ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
                </button>
              </div>
            </section>

            {/* 3. Notifications Section */}
            <section className="bg-surface-white border border-border-light rounded-xl p-md">
              <div className="flex items-center gap-md mb-lg">
                <span className="material-symbols-outlined text-primary text-3xl">notifications_active</span>
                <h2 className="font-headline-sm text-headline-sm">التنبيهات</h2>
              </div>
              <div className="divide-y divide-border-light">
                <div className="py-md flex items-center justify-between">
                  <div>
                    <h4 className="font-label-lg text-label-lg font-bold">تنبيهات البريد الإلكتروني</h4>
                    <p className="font-body-sm text-body-sm text-text-muted">استلام ملخصات أسبوعية وعروض حصرية</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      checked={emailNotifications} 
                      onChange={(e) => setEmailNotifications(e.target.checked)} 
                      className="sr-only peer custom-toggle" 
                      type="checkbox" 
                    />
                    <div className="w-11 h-6 bg-surface-container rounded-full peer peer-checked:after:translate-x-[-100%] after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-yellow toggle-dot"></div>
                  </label>
                </div>
                <div className="py-md flex items-center justify-between">
                  <div>
                    <h4 className="font-label-lg text-label-lg font-bold">رسائل SMS</h4>
                    <p className="font-body-sm text-body-sm text-text-muted">تنبيهات فورية عند وصول رسالة جديدة أو تحديث لإعلانك</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      checked={smsNotifications} 
                      onChange={(e) => setSmsNotifications(e.target.checked)} 
                      className="sr-only peer custom-toggle" 
                      type="checkbox" 
                    />
                    <div className="w-11 h-6 bg-surface-container rounded-full peer peer-checked:after:translate-x-[-100%] after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-yellow toggle-dot"></div>
                  </label>
                </div>
              </div>
            </section>

            {/* 4. Social Accounts */}
            <section className="bg-surface-white border border-border-light rounded-xl p-md">
              <div className="flex items-center gap-md mb-lg">
                <span className="material-symbols-outlined text-primary text-3xl">share</span>
                <h2 className="font-headline-sm text-headline-sm">الحسابات المرتبطة</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div className="flex items-center justify-between p-sm border border-border-light rounded-lg">
                  <div className="flex items-center gap-sm">
                    <div className="w-10 h-10 bg-blue-50 flex items-center justify-center rounded-lg">
                      <span className="material-symbols-outlined text-blue-600">social_leaderboard</span>
                    </div>
                    <div>
                      <p className="font-label-lg text-label-lg font-bold">فيسبوك</p>
                      <p className="font-label-sm text-label-sm text-verification-blue">متصل</p>
                    </div>
                  </div>
                  <button className="text-error font-label-sm hover:underline">إلغاء الربط</button>
                </div>
                <div className="flex items-center justify-between p-sm border border-border-light rounded-lg">
                  <div className="flex items-center gap-sm">
                    <div className="w-10 h-10 bg-red-50 flex items-center justify-center rounded-lg">
                      <span className="material-symbols-outlined text-red-600">mail</span>
                    </div>
                    <div>
                      <p className="font-label-lg text-label-lg font-bold">جوجل</p>
                      <p className="font-label-sm text-label-sm text-text-muted">غير متصل</p>
                    </div>
                  </div>
                  <button className="text-secondary font-label-sm hover:underline">ربط الحساب</button>
                </div>
              </div>
            </section>

            {/* 5. Account Management */}
            <section className="bg-surface-white border border-error/20 rounded-xl p-md">
              <div className="flex items-center gap-md mb-lg">
                <span className="material-symbols-outlined text-error text-3xl">no_accounts</span>
                <h2 className="font-headline-sm text-headline-sm text-error">إدارة الحساب</h2>
              </div>
              <div className="bg-error-container/20 p-md rounded-lg mb-md">
                <p className="font-body-md text-body-md text-on-error-container">
                  تنبيه: حذف الحساب سيؤدي إلى مسح جميع إعلاناتك وبياناتك بشكل نهائي ولا يمكن التراجع عن هذا الإجراء.
                </p>
              </div>
              <div className="flex flex-wrap gap-md">
                <button className="border border-error text-error px-md py-xs rounded-lg font-label-lg hover:bg-error hover:text-white transition-all">تعطيل الحساب مؤقتاً</button>
                <button className="bg-error text-white px-md py-xs rounded-lg font-label-lg hover:brightness-90 transition-all">حذف الحساب نهائياً</button>
              </div>
            </section>

            <div className="flex justify-start pt-md gap-4 items-center">
              <button 
                onClick={handleSave} 
                disabled={isSaving}
                className="bg-on-background text-white px-xl py-md rounded-lg font-label-lg font-bold shadow-sm hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
              >
                {isSaving ? 'جاري الحفظ...' : 'حفظ جميع التغييرات'}
              </button>
              {message && <span className="text-primary font-bold">{message}</span>}
            </div>
          </div>
        </main>
      </div>


    </div>
  );
}
