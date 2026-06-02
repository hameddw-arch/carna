# Cloudflare R2 Setup Guide لـ CARNA

## 📋 المحتويات

1. [الإعداد الأساسي](#الإعداد-الأساسي)
2. [إعداد R2 Bucket](#إعداد-r2-bucket)
3. [إعداد Cloudflare Workers](#إعداد-cloudflare-workers)
4. [الاستخدام في الكود](#الاستخدام-في-الكود)
5. [Troubleshooting](#troubleshooting)

---

## 🚀 الإعداد الأساسي

### المتطلبات:
- ✅ حساب Cloudflare مع CARNA domain
- ✅ Wrangler CLI مثبت (تم التثبيت مسبقاً)
- ✅ Node.js 16+

### البنية الجديدة:

```
app_new_design/
├── workers/                    # Cloudflare Workers
│   ├── src/
│   │   └── index.ts           # Worker API
│   ├── wrangler.toml          # Wrangler config
│   └── package.json
├── src/
│   ├── lib/
│   │   └── imageUpload.ts    # Upload functions
│   └── components/
│       └── ImageUploader.tsx  # Upload component
└── .env.local                  # Environment variables
```

---

## 🪣 إعداد R2 Bucket

### الخطوة 1️⃣: إنشاء R2 Bucket

1. اذهب إلى **Cloudflare Dashboard**
2. اختر **R2** من القائمة الجانبية
3. انقر **Create bucket**
4. أدخل الاسم: `carna-images`
5. اختر المنطقة (Region): أقرب منطقة لك
6. انقر **Create bucket**

### الخطوة 2️⃣: إنشاء API Token

1. في لوحة R2، اضغط **Settings**
2. اذهب إلى **API Tokens**
3. انقر **Create API Token**
4. امنح الصلاحيات:
   - ✅ Object Read
   - ✅ Object Write
   - ✅ Object Delete
5. حدد الـ Bucket: `carna-images`
6. انقر **Create Token**

احفظ:
- `Access Key ID`
- `Secret Access Key`
- `Account ID` (من Cloudflare account settings)

---

## ⚙️ إعداد Cloudflare Workers

### الخطوة 1️⃣: تحديث `wrangler.toml`

```toml
# workers/wrangler.toml

[env.production]
vars = {
  R2_ACCOUNT_ID = "your_account_id",
  R2_PUBLIC_URL = "https://images.carna.online"
}

[[env.production.r2_buckets]]
binding = "R2_BUCKET"
bucket_name = "carna-images"
```

### الخطوة 2️⃣: إضافة Secrets

```bash
cd workers
wrangler secret put R2_ACCESS_KEY_ID
# اكتب: access_key_id_here

wrangler secret put R2_SECRET_ACCESS_KEY
# اكتب: secret_access_key_here
```

### الخطوة 3️⃣: نشر Worker

```bash
cd workers
npm install
wrangler deploy --env production
```

يجب أن ترى:
```
✓ Uploaded carna-api
✓ Published to https://carna-api.*.workers.dev
```

---

## 🌐 إعداد Domain المخصص

### الخطوة 1️⃣: إعداد Subdomain

1. في Cloudflare Dashboard، اذهب إلى **DNS**
2. انقر **Add record**
3. أضف CNAME record:

```
Type: CNAME
Name: images
Content: carna-api.<workers-dev-domain>
Proxy status: Proxied
```

### الخطوة 2️⃣: تحديث Worker Routes

في `wrangler.toml`:
```toml
routes = [
  { pattern = "images.carna.online/upload*", zone_name = "carna.online" },
  { pattern = "images.carna.online/delete*", zone_name = "carna.online" }
]
```

أعد النشر:
```bash
wrangler deploy --env production
```

---

## 💻 الاستخدام في الكود

### الخطوة 1️⃣: إضافة Environment Variable

في `app_new_design/.env.local`:
```
VITE_R2_API_URL=https://images.carna.online
```

### الخطوة 2️⃣: استخدام في Component

```typescript
import ImageUploader from '../components/ImageUploader'

export default function PostAdPage() {
  const handleImageUpload = (url: string) => {
    console.log('Image uploaded:', url)
    // حفظ الـ URL في قاعدة البيانات
  }

  return (
    <form>
      <ImageUploader
        onImageUpload={handleImageUpload}
        maxImages={5}
      />
      {/* باقي الـ form */}
    </form>
  )
}
```

### الخطوة 3️⃣: استخدام الدوال مباشرة

```typescript
import { uploadImage, deleteImage, validateImage } from '../lib/imageUpload'

// رفع صورة
const file = e.target.files[0]
const validation = validateImage(file)

if (validation.valid) {
  const url = await uploadImage(file)
  console.log('Image URL:', url)
}

// حذف صورة
await deleteImage('listings/2024/06/image-key.jpg')
```

---

## 🎯 استخدام في الصفحات الموجودة

### صفحة إضافة إعلان (PostAdPage)

```typescript
import ImageUploader from '../components/ImageUploader'

// في الـ component
const [images, setImages] = useState<string[]>([])

<ImageUploader
  onImageUpload={(url) => {
    setImages(prev => [...prev, url])
  }}
  onImageDelete={(url) => {
    setImages(prev => prev.filter(img => img !== url))
  }}
  maxImages={5}
/>

// عند الحفظ
const { error } = await supabase
  .from('listings')
  .insert({
    title,
    description,
    images, // الـ URLs من R2
    // ... باقي البيانات
  })
```

### صفحة تسجيل الورشة (WorkshopRegistrationPage)

```typescript
const [workshopImage, setWorkshopImage] = useState<string>('')

<ImageUploader
  onImageUpload={(url) => setWorkshopImage(url)}
  maxImages={1}
/>
```

---

## 📊 التكاليف المتوقعة

| الحالة | التكلفة الشهرية |
|--------|-----------------|
| 100 صورة (20MB) | ~$0.30 |
| 1000 صورة (200MB) | ~$3.00 |
| 10000 صورة (2GB) | ~$30.00 |
| نقل بيانات الداخل | مجاني |
| نقل بيانات الخارج | $0.02/GB |

**توفير مقابل Supabase:** 300-400% أرخص! 🎉

---

## 🔧 Troubleshooting

### المشكلة: CORS errors

**الحل:**
```typescript
// في workers/src/index.ts
const headers = {
  'Access-Control-Allow-Origin': 'https://carna.online',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
}
```

### المشكلة: Upload timeout

**الحل:**
- تقليل حجم الصورة (أقل من 10MB)
- استخدام تنسيق WebP بدلاً من JPEG الخام

### المشكلة: صور غير تظهر

**الحل:**
```bash
# تحقق من الـ Worker status
wrangler status

# شغّل الـ Worker محلياً
wrangler dev --env production
```

---

## 📚 المراجع

- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [R2 Pricing](https://www.cloudflare.com/pricing/r2/)

---

## ✅ Checklist

- [ ] R2 Bucket تم إنشاؤه
- [ ] API Token تم إنشاؤه
- [ ] Secrets تم إضافتها إلى Wrangler
- [ ] Worker تم نشره
- [ ] Domain custom تم إعداده
- [ ] Environment variables تم تحديثها
- [ ] ImageUploader component تم دمجه
- [ ] Test upload تم تنفيذه بنجاح

---

**آخر تحديث:** 2026-06-02
**حالة:** جاهز للإنتاج ✅
