# CARNA Project Structure

## المشروع الحالي (2026-06-01)

### المجلدات النشطة:

#### 1. **app_new_design/** ⭐ (الموقع الجديد - الحالي)
- الموقع الحالي قيد التطوير والنشر
- مرتبط بـ GitHub: `hameddw-arch/carna`
- مرتبط بـ Cloudflare Pages: `carna.online`
- البناء: `npm run build` → `dist/`
- الخادم المحلي: `npm run dev` → `http://localhost:5173`
- **الملفات الرئيسية:**
  - `src/` - React components
  - `src/pages/` - Page components
  - `src/components/` - Reusable components
  - `src/contexts/` - Auth context
  - `src/hooks/` - Custom hooks
  - `package.json` - Dependencies

#### 2. **supabase/** 
- Backend database configuration
- PostgreSQL schema
- Authentication setup
- Row Level Security (RLS) policies

#### 3. **Assets/**
- Brand assets (logos, images)
- Design files
- Carna logo variations

### المجلدات الأرشيفية:

#### 1. **app/** 
- الموقع القديم (لا يتم تحديثه حالياً)
- موجود للمرجعية فقط

#### 2. **app_old_backup/**
- نسخة احتياطية قديمة من الموقع
- للمرجعية والاستعادة إذا لزم الأمر

#### 3. **old_website_backup_20260601/**
- نسخة احتياطية من `app/` تم إنشاؤها في 2026-06-01
- للاحتفاظ بالملفات القديمة منعاً للمشاكل

### ملفات التوثيق والإعدادات:

```
.github/workflows/        - GitHub Actions CI/CD
.git/                     - Git repository
.gitignore               - Git ignore rules
wrangler.toml            - Cloudflare Pages config
```

## الوضع الحالي (2026-06-01)

### ✅ تم إكماله:
- [x] الموقع الجديد (`app_new_design/`) منظم ومستقل
- [x] GitHub مرتبط بـ `app_new_design/` فقط
- [x] Cloudflare Pages متصل ويقوم بـ auto-deploy
- [x] نسخة احتياطية من الموقع القديم (`old_website_backup_20260601/`)
- [x] آخر commit: `a3fdf64` (dark mode & Header fixes)

### 📊 إحصائيات الموقع الجديد:
- Build time: 483ms
- Main bundle: 640.11 kB (174.10 kB gzipped)
- Pages tracked by git: 50+
- Live URL: https://carna.online
- Dev server: http://localhost:5173

## أوامر مهمة:

### تطوير الموقع الجديد:
```bash
cd app_new_design
npm install          # تثبيت المكتبات
npm run dev         # خادم تطوير محلي
npm run build       # بناء للإنتاج
npm run preview     # معاينة الإصدار المبني
```

### Git:
```bash
git status                    # حالة المشروع
git log --oneline -10        # آخر 10 commits
git push origin main         # نشر على GitHub
```

### الموقع المباشر:
- Main: https://carna.online
- Cloudflare Pages auto-deploy مُفعل
- ينشر تلقائياً عند كل push على main

## ملاحظات المتطلبات:

1. **لا تحرر الموقع القديم (`app/`)** - موجود للمرجعية فقط
2. **كل التطوير يتم في `app_new_design/`** فقط
3. **البيانات الاحتياطية موجودة** في `old_website_backup_20260601/`
4. **GitHub و Cloudflare متصلان بـ `app_new_design/`** - لا تقلق بشأن الملفات القديمة

---
**آخر تحديث:** 2026-06-01
**الحالة:** جاهز للإنتاج ✅
