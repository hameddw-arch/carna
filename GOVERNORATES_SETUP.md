# إعداد المحافظات السورية - Governorates Setup

## 🐛 المشكلة

فلتر المحافظات في صفحة تصفح السيارات لا يظهر أي محافظات لأن جدول `governorates` في قاعدة البيانات **فارغ تماماً**.

### الملفات المتأثرة
- `src/pages/BrowseCarsPage.tsx` - فلتر المحافظات (السطر 164-168)
- `src/pages/PostAdPage.tsx` - عند إضافة إعلان
- `src/pages/EditAdPage.tsx` - عند تعديل إعلان
- `src/pages/WorkshopRegistrationPage.tsx` - عند تسجيل ورشة

---

## ✅ الحل

### الخطوة 1: إضافة البيانات يدويا (الخيار السريع)

قم بتسجيل الدخول إلى [Supabase Console](https://app.supabase.com/)، ثم:

1. اذهب إلى **SQL Editor**
2. انسخ والصق الأوامر التالية:

```sql
-- إضافة المحافظات السورية الـ 14
INSERT INTO governorates (name, is_active) VALUES
  ('دمشق', true),
  ('ريف دمشق', true),
  ('حلب', true),
  ('اللاذقية', true),
  ('طرطوس', true),
  ('حمص', true),
  ('حماة', true),
  ('إدلب', true),
  ('دير الزور', true),
  ('الرقة', true),
  ('الحسكة', true),
  ('درعا', true),
  ('السويداء', true),
  ('القنيطرة', true);
```

3. انقر **Run**

### الخطوة 2: إضافة البيانات برمجياً (الخيار الموثوق)

```bash
# من مجلد app_new_design
npx ts-node scripts/seed-governorates.ts
```

---

## 📋 المحافظات السورية الـ 14

| # | المحافظة | العاصمة |
|---|---------|--------|
| 1 | دمشق | دمشق (العاصمة) |
| 2 | ريف دمشق | دمشق |
| 3 | حلب | حلب |
| 4 | اللاذقية | اللاذقية |
| 5 | طرطوس | طرطوس |
| 6 | حمص | حمص |
| 7 | حماة | حماة |
| 8 | إدلب | إدلب |
| 9 | دير الزور | دير الزور |
| 10 | الرقة | الرقة |
| 11 | الحسكة | الحسكة |
| 12 | درعا | درعا |
| 13 | السويداء | السويداء |
| 14 | القنيطرة | القنيطرة |

---

## 🔍 كيف يعمل الفلتر

### كود السحب من قاعدة البيانات
```typescript
// BrowseCarsPage.tsx: السطر 29-31
useEffect(() => {
  fetchGovernorates().then(data => {
    setDbGovernorates(data.filter(g => g.is_active).map(g => g.name));
  }).catch(console.error);
}, []);
```

### عرض الفلتر
```typescript
// BrowseCarsPage.tsx: السطر 164-168
<select value={filters.city} onChange={(e) => handleFilterChange('city', e.target.value)} 
        className="...">
  <option>كل المحافظات</option>
  {dbGovernorates.map(gov => <option key={gov} value={gov}>{gov}</option>)}
</select>
```

---

## ✨ تحسينات مستقبلية

### إضافة البيانات الأخرى
```sql
-- إضافة معلومات إضافية للمحافظات
ALTER TABLE governorates ADD COLUMN region VARCHAR(100);
ALTER TABLE governorates ADD COLUMN population INTEGER;
ALTER TABLE governorates ADD COLUMN area FLOAT;
```

### دعم البحث والتصفية
```typescript
// تصفية سريعة حسب المنطقة
const filteredGovernorates = governorates.filter(
  g => g.region === selectedRegion && g.is_active
)
```

---

## 🚀 التحقق من النتيجة

بعد إضافة البيانات:

1. اذهب إلى [carna.online/browse](https://carna.online/browse)
2. انقر على فلتر **المحافظة**
3. يجب أن تظهر قائمة المحافظات الـ 14

### في حالة عدم الظهور

تحقق من:
- [ ] تم إضافة البيانات إلى جدول `governorates`
- [ ] جميع الفيليات لديها `is_active = true`
- [ ] تحديث الصفحة (Ctrl+Shift+R للتنظيف الكامل)
- [ ] فتح DevTools والتحقق من Console errors

---

## 📚 الملفات ذات الصلة

- `supabase/seed_governorates.sql` - SQL script
- `scripts/seed-governorates.ts` - TypeScript script
- `src/lib/queries/admin.ts` - دالة fetchGovernorates
- `src/pages/BrowseCarsPage.tsx` - استخدام الفلتر

---

## 💡 ملاحظة مهمة

في المستقبل، يجب إضافة بيانات المحافظات الافتراضية في:
1. عند إنشاء قاعدة البيانات (migrations)
2. أو عند التثبيت الأول للتطبيق (initialization)
3. أو في Supabase dashboard مباشرة

بحيث لا تعتمد على سكريبت منفصل.
