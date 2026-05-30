# CARNA — خطة تحسين التصميم

> الهدف: مظهر احترافي متّسق مع لغة تصميم CARNA المعتمدة — **ليس** قالباً مولّداً بالـ AI.

## السياق

المنصة مكتملة وظيفياً (المراحل 0-3). هذه الخطة تخصّ **جودة التصميم البصري** فقط، لا الوظائف.

لغة تصميم CARNA المعتمدة: **بسيط · أنيق · قوي · ناعم · سهل · فني**
- الأصفر `#FDB700` للـ CTA وactive وfocus فقط
- أيقونات من **مجموعة واحدة** (lucide-react مستورد أصلاً)
- grid ثماني نقاط · radius/shadow/spacing محسوبة من `brand.css`
- لا gradients إلا في Hero overlay

## أدوات التصميم المتاحة (MCP)

- `open-design` ✓ Connected (user scope) — design system + skills + artifacts
- `Figma` ✓ Connected — تصميم بصري ثم تنفيذ
- `stitch` ✓ Connected — Google UI design AI
- `Adobe for creativity` ✓ Connected

> أدوات Open Design تظهر فقط بعد إعادة تشغيل Claude Code (جلسة جديدة).

## المشاكل المرصودة (لماذا يبدو "قالب AI")

| # | المشكلة | يخالف المبدأ |
|---|---|---|
| 1 | **الإيموجي كأيقونات وظيفية** 🏆🔍📍🚗💬🔒 في كل البطاقات | "أيقونات من مجموعة واحدة" |
| 2 | **inline styles متناثرة** — radius 14/16/18/20 مختلفة | "radius/shadow/spacing محسوبة" + `brand.css` غير مستخدم |
| 3 | **صورة Unsplash مكررة** (صحراء + SUV) `photo-1533473359331` | يكشف أنه demo |
| 4 | **رتابة البطاقات** — كل شيء بطاقة بيضاء بنفس الظل | "لمسات فنية" غائبة |
| 5 | **تماثل ومركزية مفرطة** | تنوّع تحريري غائب |

## خطة التنفيذ (مرتّبة بالأثر)

### 1. توحيد الأيقونات (الأعلى أثراً، الأسرع)
- استبدال كل إيموجي وظيفي بأيقونات lucide-react متّسقة
- إبقاء الإيموجي في empty-states المرحة فقط
- ملفات متأثرة: Home.tsx, ServicePage.tsx, RegisterWorkshop.tsx, Dashboard.tsx, Packages.tsx, AdminPanel.tsx, NotificationBell.tsx

### 2. فرض الـ design tokens
- مراجعة `brand.css` / index.css والتأكد من اكتمال التوكنز
- استبدال القيم الصلبة (borderRadius/boxShadow/padding) بمتغيّرات CSS
- توحيد: radius البطاقات، نظام الظلال، سلّم المسافات (8pt)

### 3. الصور الحقيقية
- إزالة Unsplash placeholder من الإعلانات التجريبية
- Hero: صورة بسياق سوري + معالجة لونية موحّدة

### 4. تنويع تحريري
- كسر شبكة البطاقات: أقسام بفواصل بدل بطاقات، كثافة متغيّرة، عدم تناظر مقصود

### 5. توقيع بصري
- موتيف متكرّر من شعار CARNA
- رسوم empty-state مخصّصة
- micro-interactions أدقّ (مبدأ "لمسات فنية")

## القرار المعلّق

في الجلسة الجديدة: استكشاف ما يقدّمه Open Design فعلياً (`skills list` + `design-systems list`)
ومقارنته بالعمل المباشر، ثم اختيار الأنسب. **البدء المقترح: البند #1 (توحيد الأيقونات).**

## ملاحظات تقنية

- Stack: Vite + React + TypeScript + inline styles + index.css (لا Tailwind)
- مهارات `tailwind-design-system` و`ui-design-system` **لا تناسب** الـ stack الحالي (تفترض Tailwind/shadcn)
- آخر commit: `d9799f5` (A11y: name attributes)
- المنصة منشورة على carna.online عبر Cloudflare Pages
