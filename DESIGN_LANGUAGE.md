# CARNA — لغة التصميم (Design Language)

> **الشخصية:** بسيط · أنيق · قوي · ناعم · سهل · فني

---

## المبادئ الستة

---

### 1. البساطة — Less is More

كل عنصر في الواجهة يجب أن يخدم غرضاً واحداً واضحاً.
إذا كان يمكن حذفه دون أن يُلاحظه المستخدم — احذفه.

**تطبيقاً:**
- لا يزيد عدد الـ actions في أي شاشة عن 3
- الـ whitespace هو جزء من التصميم وليس فراغاً
- كل صفحة لها هدف رئيسي واحد فقط (Hero action)
- لا icons تزيينية — الأيقونة إما تعني شيئاً أو لا تكون

---

### 2. الأناقة — Refined Details

التفاصيل الصغيرة هي الفارق بين موقع عادي وموقع يُشعر بالاحترافية.

**تطبيقاً:**
- border-radius: `12px` على البطاقات، `8px` على الأزرار، `6px` على حقول الإدخال
- shadows ناعمة وليست قاسية (راجع توكنز الظلال أدناه)
- المحاذاة دقيقة — Grid ثماني نقاط (8px base)
- الأيقونات من مجموعة واحدة متسقة (Lucide أو Phosphor)
- الصور دائماً بنسبة ثابتة `16:9` مع `object-fit: cover`

---

### 3. الألوان القوية والنظيفة — Bold but Clean

الأصفر `#FDB700` يُستخدم بجرأة في أماكن محدودة وليس في كل مكان.
الأبيض والأسود يحملان معظم الواجهة — الأصفر يُضيء النقاط المهمة فقط.

**قاعدة الألوان 60-30-10:**
- **60%** أبيض `#FFFFFF` — الخلفيات، المساحات
- **30%** رمادي `#F5F5F5` + نص داكن `#1A1A1A`
- **10%** أصفر `#FDB700` — الـ CTAs، الـ highlights، الـ active states

**ممنوع:**
- استخدام الأصفر خلفية لمحتوى نصي طويل (يتعب العين)
- ألوان إضافية خارج النظام المعتمد في الـ UI
- الـ gradients إلا في الـ Hero overlay

---

### 4. النعومة — Smooth Experience

كل حركة وانتقال يجب أن يُشعر المستخدم بأن الواجهة تستجيب له بلطف.

**توكنز الحركة:**
```css
--transition-fast:   150ms ease;      /* hover states */
--transition-base:   250ms ease;      /* show/hide elements */
--transition-slow:   400ms ease-out;  /* page transitions, modals */
--easing-bounce:     cubic-bezier(0.34, 1.56, 0.64, 1); /* للعناصر المرحة */
```

**تطبيقاً:**
- كل زر: `transform: scale(0.97)` عند الضغط (يشعر بالنقر)
- البطاقات: `translateY(-4px) + shadow أعمق` عند hover
- القوائم المنسدلة: تنزل بـ `opacity 0→1 + translateY(-8px→0)`
- Skeleton loaders بدلاً من spinners

---

### 5. سهولة الاستخدام — Effortless UX

المستخدم العادي لا يقرأ التعليمات. الواجهة تقوده تلقائياً.

**تطبيقاً:**
- كل زر CTA: نص فعل واضح ("ابحث الآن"، "راسل البائع"، "أضف إعلانك")
- Touch targets: حد أدنى `44px × 44px`
- الـ Empty states تشرح ماذا تفعل (لا رسائل خطأ تقنية)
- الـ Error messages بالعربية الواضحة وليس رسائل تقنية
- Progress feedback: كل action يُظهر نتيجة فورية

---

### 6. اللمسات الفنية — Crafted Details

تفاصيل تُفاجئ المستخدم بطريقة إيجابية دون أن تلفت الانتباه لنفسها.

**تطبيقاً:**
- شعار CARNA كـ favicon متحرك عند loading
- الـ Tag `#FDB700` يضيء بـ glow خفيف عند الضغط
- عدد الصور في البطاقة: `📷 5` يظهر بـ animation عند hover
- زر "راسل البائع" يهتز بـ micro-animation عند أول مرة يراه المستخدم
- الـ Success states: checkmark يُرسم بـ stroke animation
- خلفية الـ Hero: صورة سيارة بـ parallax خفيف جداً عند الـ scroll

---

## توكنز التصميم الكاملة

---

### المسافات (Spacing Scale) — Base 8px

```
--space-1:   4px    /* فجوات داخلية صغيرة */
--space-2:   8px    /* padding داخل chips/badges */
--space-3:   12px   /* padding أزرار صغيرة */
--space-4:   16px   /* padding أزرار كبيرة، gaps بين عناصر */
--space-5:   24px   /* padding بطاقات */
--space-6:   32px   /* sections داخلية */
--space-8:   48px   /* فواصل بين sections */
--space-10:  64px   /* هوامش الصفحة الرئيسية */
--space-12:  80px   /* Hero padding */
```

---

### الحواف الدائرية (Border Radius)

```
--radius-sm:   6px   /* inputs, chips صغيرة */
--radius-md:   10px  /* أزرار */
--radius-lg:   14px  /* بطاقات الإعلانات */
--radius-xl:   20px  /* Modal, Hero search box */
--radius-full: 9999px /* Tags, Badges, avatars دائرية */
```

---

### الظلال (Shadows)

```
/* خفيف جداً — عناصر على الخلفية */
--shadow-xs: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);

/* الافتراضي — بطاقات ومدخلات */
--shadow-sm: 0 2px 8px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05);

/* Hover state للبطاقات */
--shadow-md: 0 8px 24px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06);

/* Modals و Dropdowns */
--shadow-lg: 0 16px 48px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.08);

/* الشعار / CTA buttons */
--shadow-brand: 0 4px 16px rgba(253,183,0,0.35);
```

---

### المقياس الطباعي (Typography Scale)

```
/* Arabic — Hacen Beirut Poster */
--font-display: 'Hacen Beirut Poster', sans-serif;

/* Body — System Arabic Stack */
--font-body: 'IBM Plex Arabic', 'Noto Sans Arabic', 'Tahoma', sans-serif;

/* أحجام */
--text-xs:   12px  / line-height: 1.5   /* timestamps, labels صغيرة */
--text-sm:   14px  / line-height: 1.6   /* meta info, captions */
--text-base: 16px  / line-height: 1.7   /* نص عادي */
--text-lg:   18px  / line-height: 1.6   /* عناوين بطاقات */
--text-xl:   22px  / line-height: 1.4   /* عناوين sections */
--text-2xl:  28px  / line-height: 1.3   /* عنوان الصفحة */
--text-3xl:  36px  / line-height: 1.2   /* Hero headline */
--text-price: 24px / font-weight: 700   /* السعر دائماً هكذا */

/* أوزان */
--weight-regular: 400
--weight-medium:  500
--weight-bold:    700
```

---

### الألوان الموسّعة (Extended Color System)

```
/* الأساسيات (من brand.css) */
--color-yellow:  #FDB700
--color-black:   #000000
--color-white:   #FFFFFF
--color-blue:    #0053FA
--color-gray:    #ADADAD

/* الخلفيات */
--bg-base:       #FFFFFF   /* الصفحة */
--bg-subtle:     #F7F7F7   /* خلفية الـ sidebar والـ sections */
--bg-muted:      #EFEFEF   /* skeleton loaders */

/* النصوص */
--text-primary:  #1A1A1A   /* العناوين والنصوص الأساسية */
--text-secondary:#555555   /* meta info، التفاصيل الثانوية */
--text-muted:    #999999   /* timestamps، labels خافتة */
--text-inverse:  #FFFFFF   /* نص على خلفية داكنة */

/* الحدود */
--border-light:  #EBEBEB   /* حدود خفيفة جداً */
--border-base:   #DEDEDE   /* حدود inputs افتراضية */
--border-focus:  #FDB700   /* حدود عند focus */

/* الحالات */
--color-success: #16A34A   /* تأكيد إعلان، رسالة نجاح */
--color-error:   #DC2626   /* أخطاء */
--color-warning: #D97706   /* تحذيرات */

/* Yellow Tints */
--yellow-50:     #FFFBEB   /* خلفيات تحذيرات خفيفة */
--yellow-100:    #FEF3C7   /* highlighted sections */
--yellow-500:    #FDB700   /* الأساسي */
--yellow-600:    #D97706   /* hover على أزرار صفراء */

/* Blue Tints */
--blue-50:       #EFF6FF   /* خلفيات خفيفة */
--blue-500:      #0053FA   /* الأساسي */
--blue-600:      #0043CC   /* hover */
```

---

### مكوّنات رئيسية

#### زر أساسي (CTA)
```
background: #FDB700
color: #000000
font-weight: 700
border-radius: var(--radius-md)
padding: 12px 24px
box-shadow: var(--shadow-brand)
transition: var(--transition-fast)

:hover  → background: #D97706, translateY(-1px)
:active → scale(0.97)
```

#### بطاقة الإعلان
```
background: #FFFFFF
border-radius: var(--radius-lg)
box-shadow: var(--shadow-sm)
overflow: hidden
transition: var(--transition-base)

:hover → box-shadow: var(--shadow-md), translateY(-4px)

الصورة   → aspect-ratio: 16/9, object-fit: cover
السعر    → --text-price, color: #1A1A1A
العنوان  → --text-lg, color: #1A1A1A
Meta     → --text-sm, color: var(--text-secondary)
```

#### Tag / وسم
```
background: var(--bg-subtle)
color: var(--text-secondary)
border: 1px solid var(--border-light)
border-radius: var(--radius-full)
padding: 6px 14px
font-size: var(--text-sm)
transition: var(--transition-fast)

:hover  → background: var(--yellow-50), border-color: #FDB700, color: #1A1A1A
:active → background: #FDB700, color: #000, box-shadow: 0 0 0 3px rgba(253,183,0,0.2)
```

#### Input / حقل بحث
```
background: #FFFFFF
border: 1.5px solid var(--border-base)
border-radius: var(--radius-sm)
padding: 12px 16px
font-size: var(--text-base)
transition: border-color var(--transition-fast)

:focus → border-color: #FDB700, box-shadow: 0 0 0 3px rgba(253,183,0,0.15)
```

---

## قاموس المصطلحات البصرية

| المصطلح | المعنى في CARNA |
| --- | --- |
| بساطة | لا زخرفة، كل عنصر له هدف |
| أناقة | تفاصيل محسوبة: radius، shadow، spacing متسق |
| قوي | الأصفر بجرأة في CTA، نص أسود بوزن 700 |
| نظيف | خلفية بيضاء، margins كافية، لا ازدحام |
| ناعم | transitions، hover states، rounded corners |
| سهل | CTAs واضحة، لا أكثر من 3 خيارات في أي شاشة |
| فني | micro-animations، SVG animations، glow effects خفيفة |
