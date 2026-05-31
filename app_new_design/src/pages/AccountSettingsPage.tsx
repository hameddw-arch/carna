import { useState, useEffect } from "react";
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { updateUserProfile, uploadAvatar } from '../lib/queries';
import { supabase } from '../lib/supabase';
import { useNavigate } from "react-router-dom";

export default function AccountSettingsPage() {
  const { user, setUser, loading, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    setIsUploadingAvatar(true);
    try {
      const newAvatarUrl = await uploadAvatar(user.id, file);
      if (newAvatarUrl) {
        setUser({ ...user, avatar_url: newAvatarUrl });
        setMessage('تم تحديث الصورة الشخصية بنجاح');
      }
    } catch (err: any) {
      setMessage('حدث خطأ أثناء رفع الصورة: ' + err.message);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSocialLink = async (provider: 'google' | 'facebook') => {
    try {
      await supabase.auth.signInWithOAuth({ provider });
    } catch (error: any) {
      alert('تعذر الاتصال بـ ' + provider);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    try {
      // For Supabase, complete deletion usually requires an edge function.
      // We will sign out and soft-delete or disable the user.
      await supabase.from('users').update({ verified: false, role: 'disabled' }).eq('id', user.id);
      await logout();
      navigate('/');
    } catch (error) {
      alert('حدث خطأ أثناء إغلاق الحساب');
    }
  };

  if (loading) return <div className="p-xl text-center">جاري التحميل...</div>;
  if (!user) return <div className="p-xl text-center">الرجاء تسجيل الدخول</div>;

  return (
    <DashboardLayout>
      {/* Main Content Canvas */}
      <main className="flex-grow px-margin-mobile md:px-margin-desktop py-lg max-w-4xl w-full">
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
                <div className="relative group w-32 h-32 flex-shrink-0 cursor-pointer">
                  {user?.avatar_url ? (
                    <img alt="صورة الملف الشخصي" className={`w-full h-full object-cover rounded-full border-2 border-border-light transition-opacity ${isUploadingAvatar ? 'opacity-50' : 'group-hover:opacity-75'}`} src={user.avatar_url} />
                  ) : (
                    <div className={`w-full h-full bg-surface-container rounded-full border-2 border-border-light flex items-center justify-center text-primary transition-opacity ${isUploadingAvatar ? 'opacity-50' : 'group-hover:opacity-75'}`}>
                      <span className="material-symbols-outlined text-[64px]">person</span>
                    </div>
                  )}
                  {isUploadingAvatar ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
                      <span className="material-symbols-outlined text-white animate-spin">progress_activity</span>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-full">
                      <span className="material-symbols-outlined text-white">edit</span>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isUploadingAvatar}
                  />
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
                  <button onClick={() => handleSocialLink('facebook')} className="text-secondary font-label-sm hover:underline">ربط الحساب</button>
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
                  <button onClick={() => handleSocialLink('google')} className="text-secondary font-label-sm hover:underline">ربط الحساب</button>
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
                <button onClick={() => setShowDeleteConfirm(true)} className="border border-error text-error px-md py-xs rounded-lg font-label-lg hover:bg-error hover:text-white transition-all">تعطيل الحساب مؤقتاً</button>
                <button onClick={() => setShowDeleteConfirm(true)} className="bg-error text-white px-md py-xs rounded-lg font-label-lg hover:brightness-90 transition-all">حذف الحساب نهائياً</button>
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

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-md">
            <div className="bg-surface-white rounded-2xl p-xl max-w-sm w-full">
              <div className="w-16 h-16 bg-error-container/20 text-error rounded-full flex items-center justify-center mx-auto mb-md">
                <span className="material-symbols-outlined text-[32px]">warning</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-center mb-sm">تأكيد إغلاق الحساب</h3>
              <p className="text-body-md text-tertiary text-center mb-lg">
                هل أنت متأكد من رغبتك في إغلاق حسابك؟ لن تتمكن من الوصول إلى إعلاناتك أو رصيدك بعد هذا الإجراء.
              </p>
              <div className="flex gap-md">
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-md py-3 border border-border-light rounded-lg font-bold text-tertiary hover:bg-surface-container transition-all"
                >
                  تراجع
                </button>
                <button 
                  onClick={handleDeleteAccount}
                  className="flex-1 px-md py-3 bg-error text-white rounded-lg font-bold hover:brightness-90 transition-all"
                >
                  نعم، أغلق الحساب
                </button>
              </div>
            </div>
          </div>
        )}
    </DashboardLayout>
  );
}
