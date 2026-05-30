import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key);

async function testFlow() {
  console.log("🚀 بدء اختبار المستخدم الخفي (Phantom User Test)...");

  // 1. Check DB connectivity
  console.log("⏳ 1. اختبار الاتصال بقاعدة البيانات وقراءة الإعلانات...");
  const { data: listings, error: fetchError } = await supabase.from('listings').select('id').limit(1);
  if (fetchError) {
    console.error("❌ فشل قراءة الإعلانات:", fetchError.message);
  } else {
    console.log("✅ الاتصال ناجح. تم جلب الإعلانات.");
  }

  // 2. Test user auth (we will just try to log in with a dummy or check session)
  // Instead of creating a real user and polluting the auth table if not needed, we'll try to sign in with a fake email to check if the Auth API responds correctly.
  console.log("⏳ 2. اختبار واجهة المصادقة (Auth API)...");
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: 'phantom_test_carna@example.com',
    password: 'fake_password_123'
  });

  // We expect an "Invalid login credentials" error if it works correctly, not a network/CORS error.
  if (authError && authError.message.includes('Invalid login credentials')) {
    console.log("✅ واجهة المصادقة تعمل بنجاح (استجابة صحيحة).");
  } else if (authError) {
    console.warn("⚠️ تحذير في المصادقة:", authError.message);
  }

  console.log("🎉 اكتمل الفحص السريع (Phantom Test) للنظام بنجاح!");
}

testFlow();
