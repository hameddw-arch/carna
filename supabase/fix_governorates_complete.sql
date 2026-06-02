-- ============================================
-- تشخيص وإصلاح مشكلة المحافظات الكاملة
-- ============================================

-- 1️⃣ التحقق من الجدول
SELECT
  schemaname, tablename
FROM pg_tables
WHERE tablename = 'governorates';

-- 2️⃣ التحقق من البيانات
SELECT
  id, name, is_active, created_at
FROM governorates
ORDER BY name;

-- 3️⃣ عد الصفوف
SELECT COUNT(*) as total_count FROM governorates;

-- 4️⃣ التحقق من RLS
SELECT
  schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'governorates';

-- 5️⃣ عرض RLS policies الحالية
SELECT
  schemaname, tablename, policyname, permissive, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'governorates';

-- ============================================
-- الإصلاح الكامل (شغّل هذا القسم)
-- ============================================

-- 6️⃣ حذف policies القديمة (if exist)
DROP POLICY IF EXISTS "Anyone can view active governorates" ON governorates;
DROP POLICY IF EXISTS "Anyone can view governorates" ON governorates;

-- 7️⃣ تفعيل RLS إذا لم يكن مفعلاً
ALTER TABLE governorates ENABLE ROW LEVEL SECURITY;

-- 8️⃣ إضافة policy للقراءة (SELECT) للجميع
CREATE POLICY "enable_read_governorates"
ON governorates
FOR SELECT
USING (true);

-- 9️⃣ تحديث البيانات (إذا كانت موجودة)
UPDATE governorates SET is_active = true WHERE is_active IS NULL;

-- 🔟 التحقق النهائي
SELECT
  COUNT(*) as total,
  COUNT(CASE WHEN is_active THEN 1 END) as active_count
FROM governorates;

-- 11️⃣ عرض البيانات
SELECT name, is_active FROM governorates ORDER BY name;
