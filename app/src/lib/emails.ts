import { supabase } from './supabase'

// استدعاء Supabase Edge Function لإرسال البريد عبر Resend
async function sendEmail(to: string, subject: string, html: string) {
  try {
    await supabase.functions.invoke('send-email', { body: { to, subject, html } })
  } catch (e) {
    console.error('[Email] failed:', e)
  }
}

export async function emailAdminNewListing(listing: { id: string; title: string; city: string; price: number }) {
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL
  if (!adminEmail) return
  await sendEmail(
    adminEmail,
    `🚗 إعلان جديد بانتظار المراجعة: ${listing.title}`,
    `<div dir="rtl" style="font-family:sans-serif;max-width:500px;margin:auto">
      <h2 style="color:#0d0d0d">إعلان جديد على كارنا</h2>
      <p><strong>${listing.title}</strong></p>
      <p>المدينة: ${listing.city} &nbsp;|&nbsp; السعر: ${listing.price?.toLocaleString()} ل.س</p>
      <a href="https://carna.online/admin" style="display:inline-block;background:#FDB700;color:#0d0d0d;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;margin-top:16px">
        راجع الإعلان الآن
      </a>
    </div>`
  )
}

export async function emailSellerListingApproved(to: string, listingTitle: string, listingId: string) {
  await sendEmail(
    to,
    `✅ تم قبول إعلانك: ${listingTitle}`,
    `<div dir="rtl" style="font-family:sans-serif;max-width:500px;margin:auto">
      <h2 style="color:#16A34A">إعلانك مقبول ومنشور!</h2>
      <p>تم مراجعة إعلان <strong>${listingTitle}</strong> والموافقة عليه.</p>
      <p>إعلانك الآن ظاهر لجميع المستخدمين على كارنا.</p>
      <a href="https://carna.online/listing/${listingId}" style="display:inline-block;background:#FDB700;color:#0d0d0d;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;margin-top:16px">
        شاهد إعلانك
      </a>
    </div>`
  )
}

export async function emailSellerListingRejected(to: string, listingTitle: string, reason: string) {
  await sendEmail(
    to,
    `❌ تم رفض إعلانك: ${listingTitle}`,
    `<div dir="rtl" style="font-family:sans-serif;max-width:500px;margin:auto">
      <h2 style="color:#DC2626">إعلانك لم يُقبل</h2>
      <p>للأسف تم رفض إعلان <strong>${listingTitle}</strong>.</p>
      <p><strong>السبب:</strong> ${reason}</p>
      <p>يمكنك تعديل الإعلان وإعادة نشره من لوحة التحكم.</p>
      <a href="https://carna.online/dashboard" style="display:inline-block;background:#0d0d0d;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;margin-top:16px">
        لوحة التحكم
      </a>
    </div>`
  )
}

export async function emailAdminTopupRequest(userPhone: string, amount: number, method: string) {
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL
  if (!adminEmail) return
  await sendEmail(
    adminEmail,
    `💰 طلب شحن محفظة: ${amount.toLocaleString()} ل.س`,
    `<div dir="rtl" style="font-family:sans-serif;max-width:500px;margin:auto">
      <h2>طلب شحن محفظة جديد</h2>
      <p>المستخدم: <strong>${userPhone}</strong></p>
      <p>المبلغ: <strong>${amount.toLocaleString()} ل.س</strong></p>
      <p>الطريقة: ${method}</p>
      <a href="https://carna.online/admin" style="display:inline-block;background:#FDB700;color:#0d0d0d;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;margin-top:16px">
        تأكيد الشحن من الإدارة
      </a>
    </div>`
  )
}
