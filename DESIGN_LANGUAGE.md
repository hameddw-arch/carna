# CARNA — لغة التصميم (Design Language)

> **الشخصية:** جريء · مسطح (Flat Pop) · قوي · بسيط · احترافي (Neo-Brutalism)

---

## المبادئ الستة

---

### 1. البساطة والوضوح — Less is More, But Louder

كل عنصر في الواجهة يجب أن يخدم غرضاً واحداً واضحاً.
التصميم يعتمد على الصراحة البصرية التامة. لا يوجد عمق وهمي (ظلال)، بل طبقات واضحة ومحددة بخطوط قاطعة.

**تطبيقاً:**
- لا يزيد عدد الـ actions في أي شاشة عن 3
- الـ whitespace هو جزء من التصميم لفصل الحاويات البيضاء
- كل صفحة لها هدف رئيسي واحد فقط (Hero action)
- الأيقونات خطية، صريحة وبدون حشو لوني

---

### 2. الوحشية الناعمة (Neo-Brutalism) — Sharp & Solid

التفاصيل تُستمد من قوة الخطوط والألوان المصمتة بدلاً من التدرجات والظلال الناعمة. التصميم يُشبه المجلات أو البوسترات الحديثة (Poster-like).

**تطبيقاً:**
- border-radius: `8px` أو `12px` لكسر الحدة قليلاً ولكن بحدود صلبة (Solid Borders)
- لا يوجد drop-shadows ناعمة؛ إن لزم الأمر تُستخدم ظلال صلبة بلون مصمت (Solid Color Offsets)
- المحاذاة دقيقة — Grid ثماني نقاط (8px base)
- الأيقونات من مجموعة واحدة متسقة خطية (مثل Lucide أو Phosphor) بوزن Stroke صريح `1.5px` أو `2px`.
- الصور دائماً بنسبة ثابتة `16:9` مع `object-fit: cover`

---

### 3. الألوان القوية والمصمتة — Bold, Flat & Solid

الأصفر `#FDB700` ليس مجرد نقطة جذب، بل هو **الخلفية الرئيسية** والواجهة المُميزة للموقع.
المحتوى يُعزل تماماً داخل حاويات بيضاء للحفاظ على المقروئية العالية. 

**قاعدة الألوان (Flat Pop):**
- **الخلفية الكلية:** أصفر `#FDB700` (يمنح الهوية الجريئة والمرحة).
- **حاويات المحتوى:** أبيض ناصع `#FFFFFF` (لعزل الصور والنصوص عن الأصفر).
- **الحدود والنصوص:** أسود قوي `#1A1A1A` أو رمادي فحمي لضمان أعلى تباين وتحديد (Solid Outlines).
- **نقاط التفاعل (CTAs):** أزرق ساطع `#1A73E8` للأزرار والروابط المهمة لخلق تباين بصري درامي.

**ممنوع:**
- التدرجات اللونية (Gradients) نهائياً.
- الوضع الليلي (الاعتماد الكلي على السطوع والتباين العالي).
- الألوان الباهتة للحدود أو النصوص الأساسية.

---

### 4. التفاعل الحركي المباشر — Snappy & Direct

كل حركة يجب أن تكون سريعة ومباشرة (Snappy)، خالية من البطء، لتعزيز طابع الجرأة.

**تطبيقاً:**
- الأزرار والبطاقات: عند الضغط أو الـ Hover تتحرك فوراً (Translate X/Y) بدلاً من توهج أو ظل تدريجي.
- تأثير Hover للبطاقات البيضاء على الخلفية الصفراء: تتحرك البطاقة `2px` للأعلى وتزداد سماكة الحد الأسود.

---

### 5. سهولة الاستخدام — Effortless UX

المستخدم العادي لا يقرأ التعليمات. الواجهة تقوده تلقائياً.

**تطبيقاً:**
- كل زر CTA: نص فعل واضح ("ابحث الآن"، "راسل البائع"، "أضف إعلانك")
- Touch targets: حد أدنى `44px × 44px`
- الـ Empty states تشرح ماذا تفعل
- Progress feedback: كل action يُظهر نتيجة فورية مرئية بوضوح (ألوان صريحة للنجاح/الخطأ)

---

### 6. اللمسات الفنية — Crafted Details

تفاصيل تُعزز طابع الـ Neo-Brutalism.

**تطبيقاً:**
- رقاقات المواصفات (Chips/Tags): مسطحة بخلفية رمادية خفيفة وحدود صلبة، وتتحول للون الأزرق أو الأصفر الصلب عند التفعيل.
- مؤشرات التحميل (Loaders): صلبة ومتحركة بخطوط واضحة بدلاً من الـ Spinners الخافتة.

---

## توكنز التصميم الكاملة

---

### المسافات (Spacing Scale) — Base 8px

```css
--space-1:   4px;
--space-2:   8px;
--space-3:   12px;
--space-4:   16px;
--space-5:   24px;
--space-6:   32px;
--space-8:   48px;
--space-10:  64px;
--space-12:  80px;
```

---

### الحواف والحدود (Borders & Radius)

التصميم يعتمد على الحدود الصلبة `borders` أكثر من الـ `box-shadow`.

```css
/* سماكة الحدود */
--border-width-sm: 1px;
--border-width-md: 2px;
--border-width-lg: 3px;

/* الحواف */
--radius-sm:   6px;
--radius-md:   8px;
--radius-lg:   12px;
--radius-xl:   16px;
--radius-full: 9999px;
```

---

### الظلال (Neo-Brutalism Shadows)

بدلاً من الظلال الناعمة، نستخدم إزاحة صلبة أو لا نستخدم ظلالاً ونكتفي بالحدود.

```css
/* إزاحة صلبة (Solid Offset) للبطاقات الكبيرة أو الأزرار */
--shadow-solid-sm: 2px 2px 0px #1A1A1A;
--shadow-solid-md: 4px 4px 0px #1A1A1A;

/* أو ببساطة الاعتماد على الحدود الواضحة بدون ظلال للبطاقات العادية */
--shadow-none: none;
```

---

### المقياس الطباعي (Typography Scale)

```css
/* Arabic — Hacen Beirut Poster للعناوين المقتضبة والكبيرة */
--font-display: 'Hacen Beirut Poster', sans-serif;

/* Body — System Arabic Stack للمقروئية */
--font-body: 'IBM Plex Arabic', 'Noto Sans Arabic', 'Tahoma', sans-serif;

/* أحجام */
--text-xs:   12px;  /* line-height: 1.5 */
--text-sm:   14px;  /* line-height: 1.6 */
--text-base: 16px;  /* line-height: 1.7 */
--text-lg:   18px;  /* line-height: 1.6 */
--text-xl:   22px;  /* line-height: 1.4 */
--text-2xl:  28px;  /* line-height: 1.3 */
--text-3xl:  36px;  /* line-height: 1.2 */
--text-price: 24px; /* font-weight: 700, color: #1A1A1A */

/* أوزان */
--weight-regular: 400;
--weight-medium:  500;
--weight-bold:    700;
```

---

### الألوان الموسّعة (Flat Pop Color System)

```css
/* الأساسيات */
--color-yellow:  #FDB700;   /* لون الخلفية الرئيسي */
--color-black:   #1A1A1A;   /* لون النصوص والحدود الصلبة */
--color-white:   #FFFFFF;   /* لون حاويات المحتوى (البطاقات) */
--color-blue:    #1A73E8;   /* لون التفاعل (CTAs) Google Blue */
--color-red:     #D93025;   /* للأخطاء والتنبيهات */
--color-green:   #1E8E3E;   /* للنجاح */
--color-gray:    #F1F3F4;   /* لون رمادي مسطح للعناصر الثانوية */

/* الاستخدام */
--bg-page:       var(--color-yellow);
--bg-card:       var(--color-white);
--bg-subtle:     var(--color-gray);

--text-primary:  var(--color-black);
--text-secondary:#5F6368;
--text-inverse:  var(--color-white);

--border-primary:var(--color-black);
--border-subtle: #E0E0E0;
```

---

### مكوّنات رئيسية

#### زر أساسي (Primary CTA)
```css
background: var(--color-blue);
color: var(--color-white);
font-weight: 700;
border: 2px solid var(--color-black);
border-radius: var(--radius-md);
padding: 12px 24px;
box-shadow: var(--shadow-solid-sm);
transition: transform 150ms ease, box-shadow 150ms ease;

:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--shadow-solid-md);
}
:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}
```

#### بطاقة الإعلان (Ad Card)
```css
background: var(--bg-card);
border: 1px solid var(--border-subtle);
border-radius: var(--radius-lg);
box-shadow: none;
overflow: hidden;
transition: transform 150ms ease, border-color 150ms ease;

:hover {
  transform: translateY(-4px);
  border: 1px solid var(--color-blue);
}

/* الصورة */
aspect-ratio: 16/9;
object-fit: cover;
border-bottom: 1px solid var(--border-subtle);

/* السعر */
font-size: var(--text-price);
color: var(--text-primary);

/* العنوان */
font-size: var(--text-lg);
color: var(--text-primary);

/* Meta */
font-size: var(--text-sm);
color: var(--text-secondary);
```

#### Tag / وسم
```css
background: var(--bg-subtle);
color: var(--text-primary);
border: 1px solid var(--border-subtle);
border-radius: var(--radius-sm); /* ليس دائرياً تماماً بل Rounded */
padding: 6px 14px;
font-size: var(--text-sm);
font-weight: 500;
transition: all 150ms ease;

:hover {
  background: var(--color-blue);
  color: var(--color-white);
  border-color: var(--color-black);
}
:active {
  transform: translateY(2px);
}
```

#### Input / حقل بحث
```css
background: var(--bg-card);
border: 2px solid var(--color-black);
border-radius: var(--radius-md);
padding: 12px 16px;
font-size: var(--text-base);
color: var(--text-primary);
transition: border-color 150ms ease;

:focus {
  border-color: var(--color-blue);
  outline: none;
}
```

---

## قاموس المصطلحات البصرية (النسخة المحدثة)

| المصطلح | المعنى في CARNA |
| --- | --- |
| جريء (Bold) | الأصفر كلون رئيسي، حدود صريحة، نصوص سوداء قوية |
| مسطح (Flat Pop) | لا تدرجات (Gradients)، لا ظلال ناعمة (Soft Shadows) |
| واضح | المحتوى مفصول بحاويات بيضاء لضمان القراءة الممتازة |
| حاد واحترافي | زوايا متسقة، أيقونات خطية دقيقة |
| تفاعلي (Snappy) | حركات فورية عند الضغط أو المرور بدلاً من التلاشي البطيء |
