import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const TOPUP_METHODS = [
  { id: 'syriatel', name: 'سيريتل كاش', icon: '📱', instructions: 'حوّل المبلغ على الرقم: 0991000000\nاكتب في الملاحظة: CARNA + رقمك المسجّل' },
  { id: 'mtn', name: 'إم تي إن كاش', icon: '💚', instructions: 'حوّل المبلغ على الرقم: 0961000000\nاكتب في الملاحظة: CARNA + رقمك المسجّل' },
  { id: 'bank', name: 'تحويل بنكي', icon: '🏦', instructions: 'البنك التجاري السوري\nرقم الحساب: 000-000-000\nباسم: إدارة موقع كارنا' },
];

export default function WalletPage() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [txs, setTxs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('syriatel');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from('users').select('wallet_balance').eq('id', user.id).single(),
      supabase.from('wallet_transactions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
    ]).then(([bal, t]) => {
      setBalance(bal.data?.wallet_balance ?? 0);
      setTxs(t.data ?? []);
      setLoading(false);
    });
  }, [user]);

  async function requestTopup() {
    if (!amount || Number(amount) < 1000) return alert('الحد الأدنى للشحن 1000 ل.س');
    if (!user) return;
    
    setSending(true);
    await supabase.from('wallet_transactions').insert({
      user_id: user.id,
      amount: Number(amount),
      type: 'pending',
      method,
      ref: `طلب شحن ${method} — بانتظار التأكيد`,
    });
    setSending(false);
    setSent(true);
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const selectedMethod = TOPUP_METHODS.find(m => m.id === method)!;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;
  }

  return (
    <DashboardLayout>
      <div className="bg-background min-h-screen text-on-surface w-full">
      {/* Page Header */}
      <div className="bg-surface-container-lowest dark:bg-surface-container py-xl border-b border-border-light">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex items-center gap-xs text-tertiary mb-sm font-label-sm">
            <Link to="/dashboard" className="hover:text-primary transition-colors">حسابي</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_left</span>
            <span className="text-on-surface">محفظتي</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg font-black text-on-surface mb-sm">المحفظة الإلكترونية</h1>
          <div className="flex items-end gap-xs">
            <span className="font-display-md text-display-md font-black text-accent-yellow leading-none">{balance.toLocaleString()}</span>
            <span className="font-headline-sm text-headline-sm text-tertiary font-bold pb-1">ل.س</span>
          </div>
        </div>
      </div>

      <main className="py-xl px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-12 gap-lg">
        
        {/* Transactions List */}
        <div className="lg:col-span-8 flex flex-col gap-md">
          
          {/* Information Banner */}
          <div className="bg-primary-container/10 border border-primary-container/30 rounded-xl p-md flex gap-md items-start">
            <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined">lightbulb</span>
            </div>
            <div>
              <h3 className="font-label-lg font-bold text-on-surface mb-xs">ما هي فائدة رصيد المحفظة؟</h3>
              <p className="text-body-sm text-tertiary leading-relaxed">
                لا يُستخدم هذا الرصيد في عمليات بيع وشراء السيارات (حيث تتم خارج الموقع)، بل يُستخدم لشراء <strong>الخدمات المدفوعة</strong> داخل منصة كارنا مثل: تمييز إعلانك ليظهر في القمة، إعادة تحديث الإعلان، شراء باقات للمعارض والورشات، وزيادة الحد المسموح للإعلانات.
              </p>
            </div>
          </div>

          <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-sm mt-2">سجل المعاملات</h2>
          {txs.length === 0 ? (
            <div className="bg-surface-white border border-border-light rounded-xl p-xl text-center text-tertiary font-body-md">
              لا توجد معاملات بعد في محفظتك.
            </div>
          ) : (
            <div className="flex flex-col gap-sm">
              {txs.map(tx => (
                <div key={tx.id} className="bg-surface-white border border-border-light rounded-xl p-md flex items-center justify-between gap-md transition-all hover:border-accent-yellow">
                  <div className="flex items-center gap-md">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      tx.type === 'credit' ? 'bg-green-50 text-green-600' :
                      tx.type === 'pending' ? 'bg-orange-50 text-orange-500' : 'bg-red-50 text-red-600'
                    }`}>
                      <span className="material-symbols-outlined">
                        {tx.type === 'credit' ? 'call_received' : tx.type === 'pending' ? 'hourglass_empty' : 'call_made'}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-label-lg text-label-lg font-bold text-on-surface">{tx.ref ?? tx.method}</h4>
                      <div className="flex items-center gap-xs mt-1 text-tertiary font-body-sm text-[12px]">
                        <span>{new Date(tx.created_at).toLocaleDateString('ar-EG')}</span>
                        {tx.type === 'pending' && <span className="text-orange-500 font-bold bg-orange-50 px-2 py-0.5 rounded">بانتظار التأكيد</span>}
                      </div>
                    </div>
                  </div>
                  <div className={`font-headline-sm text-headline-sm font-black ${
                      tx.type === 'credit' ? 'text-green-600' :
                      tx.type === 'pending' ? 'text-orange-500' : 'text-red-600'
                    }`}>
                    <span dir="ltr">{tx.type === 'credit' ? '+' : tx.type === 'debit' ? '-' : ''}{Math.abs(tx.amount).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top-up Sidebar */}
        <aside className="lg:col-span-4">
          <div className="sticky top-24 bg-surface-white border border-border-light rounded-xl p-lg flex flex-col gap-md shadow-sm">
            {sent ? (
              <div className="text-center py-lg flex flex-col items-center gap-md">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                  <span className="material-symbols-outlined text-[32px]">check_circle</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-xs">تم إرسال طلب الشحن بنجاح</h3>
                  <p className="font-body-md text-body-md text-tertiary">سيتم تأكيد الشحن وإضافة الرصيد إلى محفظتك خلال 24 ساعة بعد التحقق من الحوالة.</p>
                </div>
                <button onClick={() => setSent(false)} className="mt-sm px-lg py-sm border border-border-light rounded-lg font-label-md text-tertiary hover:bg-surface-container transition-all">طلب شحن جديد</button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-xs text-primary mb-xs">
                  <span className="material-symbols-outlined">add_circle</span>
                  <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">شحن المحفظة</h2>
                </div>

                <div className="flex flex-col gap-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant font-bold">طريقة الدفع</label>
                  <div className="flex flex-col gap-xs">
                    {TOPUP_METHODS.map(m => (
                      <button key={m.id} onClick={() => setMethod(m.id)} className={`flex items-center justify-between p-sm rounded-lg border transition-all ${method === m.id ? 'border-accent-yellow bg-accent-yellow/10' : 'border-border-light hover:border-accent-yellow/50'}`}>
                        <div className="flex items-center gap-sm">
                          <span className="text-[20px]">{m.icon}</span>
                          <span className={`font-label-md text-label-md ${method === m.id ? 'font-bold text-on-surface' : 'text-tertiary'}`}>{m.name}</span>
                        </div>
                        {method === m.id && <span className="material-symbols-outlined text-accent-yellow text-[18px]">check_circle</span>}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-surface-container-low p-sm rounded-lg border border-border-light">
                  <div className="font-label-sm text-label-sm font-bold text-tertiary mb-xs">تعليمات التحويل:</div>
                  <pre className="font-body-sm text-body-sm text-on-surface whitespace-pre-wrap font-sans">{selectedMethod.instructions}</pre>
                  <button onClick={() => copy(selectedMethod.instructions)} className="mt-sm flex items-center gap-xs text-primary font-label-sm hover:underline">
                    <span className="material-symbols-outlined text-[16px]">{copied ? 'done' : 'content_copy'}</span>
                    {copied ? 'تم نسخ التعليمات' : 'نسخ التعليمات'}
                  </button>
                </div>

                <div className="flex flex-col gap-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant font-bold">المبلغ المحول (ل.س)</label>
                  <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="أدخل المبلغ (مثل: 15000)" className="w-full bg-surface border border-border-light rounded-lg p-sm font-body-md text-body-md focus:border-accent-yellow outline-none transition-all text-center" />
                  <div className="flex flex-wrap gap-xs mt-xs">
                    {[5000, 10000, 25000, 50000].map(n => (
                      <button key={n} onClick={() => setAmount(String(n))} className="flex-1 bg-surface-container-low border border-border-light py-xs rounded text-tertiary font-label-sm hover:bg-surface-container hover:text-primary transition-all">
                        {n.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={requestTopup} disabled={sending} className="w-full bg-accent-yellow text-black font-label-lg text-label-lg font-bold py-md rounded-lg shadow-sm hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-sm disabled:opacity-70">
                  {sending ? <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span> : <span className="material-symbols-outlined text-[20px]">send</span>}
                  إرسال طلب الشحن
                </button>
                <p className="text-[12px] text-tertiary text-center leading-relaxed">
                  سيتم مراجعة طلبك وإضافة الرصيد مباشرة بعد تأكيد استلام الحوالة من قبل الإدارة.
                </p>
              </>
            )}
          </div>
        </aside>
      </main>
    </div>
    </DashboardLayout>
  );
}
