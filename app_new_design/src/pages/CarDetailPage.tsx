import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchListing, incrementListingViews, getOrCreateChat } from '../lib/queries';
import { useAuth } from '../contexts/AuthContext';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';

export default function CarDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchListing(id)
      .then(data => {
        setListing(data);
        incrementListingViews(id).catch(err => console.warn('View count update failed:', err));
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStartChat = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/car/${id}` } });
      return;
    }
    if (!listing || user.id === listing.user_id) return;
    setChatLoading(true);
    try {
      await getOrCreateChat(user.id, listing.user_id, listing.id);
      navigate('/messages');
    } catch (err) {
      console.error('Failed to start chat:', err);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-on-surface">
        جاري التحميل...
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-on-surface gap-4">
        <p>السيارة غير موجودة أو حدث خطأ.</p>
        <button onClick={() => navigate('/browse')} className="bg-primary text-on-primary px-4 py-2 rounded">
          العودة لتصفح السيارات
        </button>
      </div>
    );
  }

  const title = listing.title || `${listing.make} ${listing.model} ${listing.year}`;
  const images = listing.images || [];
  const description = `${listing.make} ${listing.model} سنة ${listing.year} - ${listing.price?.toLocaleString()} ل.س - ${listing.city}. ${listing.mileage} كم، ${listing.condition || 'مستعمل'}. شاهد صور وتفاصيل السيارة على كارنا.`;
  const imageUrl = images[0] || '/placeholder-car.svg';

  const vehicleSchema = {
    "@context": "https://schema.org/",
    "@type": "Vehicle",
    "name": title,
    "description": listing.description || description,
    "image": images,
    "brand": {
      "@type": "Brand",
      "name": listing.make
    },
    "model": listing.model,
    "productionDate": `${listing.year}`,
    "mileageFromOdometer": {
      "@type": "QuantitativeValue",
      "value": listing.mileage || 0,
      "unitCode": "KMT"
    },
    "offers": {
      "@type": "Offer",
      "price": listing.price,
      "priceCurrency": "SYP",
      "availability": "https://schema.org/InStock"
    },
    "vehicleCondition": listing.condition === 'جديدة' ? "New" : "Used",
    "bodyType": listing.body_type,
    "fuelType": listing.fuel_type || listing.fuel,
    "transmission": listing.transmission,
    "seller": {
      "@type": "Person",
      "name": listing.users?.name || "بائع",
      "aggregateRating": listing.users?.rating ? {
        "@type": "AggregateRating",
        "ratingValue": listing.users.rating,
        "reviewCount": listing.users.rating_count || 0
      } : undefined
    }
  };

  return (
    <div className="bg-background text-on-surface">
      <SEO
        title={`${listing.make} ${listing.model} ${listing.year}`}
        description={description}
        image={imageUrl}
        url={`/car/${id}`}
        type="article"
        jsonLd={vehicleSchema}
      />
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-lg">
        <Breadcrumb items={[
          { label: 'الرئيسية', href: '/' },
          { label: 'السيارات', href: '/browse' },
          { label: title }
        ]} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
          {/* Left Column in LTR, Right Column in RTL: Image Gallery & Details */}
          <div className="lg:col-span-8 space-y-lg">
            {/* Gallery */}
            <section className="space-y-sm">
              <div className="w-full aspect-video rounded-lg overflow-hidden border border-border-light bg-surface-container">
                <img
                  alt={title}
                  className="w-full h-full object-cover"
                  src={images[activeImg] || '/placeholder-car.svg'}
                  decoding="async"
                />
              </div>
              <div className="grid grid-cols-4 gap-sm">
                {images.slice(0, 4).map((img: string, idx: number) => (
                  <div
                    key={idx}
                    className={`aspect-square rounded-lg overflow-hidden border ${activeImg === idx ? 'border-primary' : 'border-border-light'} bg-surface-container cursor-pointer hover:border-primary transition-colors relative`}
                    onClick={() => setActiveImg(idx)}
                  >
                    <img
                      alt={`${title} - صورة ${idx + 1}`}
                      className="w-full h-full object-cover"
                      src={img}
                      loading="lazy"
                      decoding="async"
                    />
                    {idx === 3 && images.length > 4 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-headline-sm text-headline-sm">
                        +{images.length - 4}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
            
            {/* Specs Grid */}
            <section className="bg-surface-white border border-border-light rounded-lg p-md">
              <h3 className="font-headline-sm text-headline-sm mb-md border-b border-border-light pb-xs">المواصفات الأساسية</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-lg gap-x-md">
                <div className="flex flex-col gap-base">
                  <span className="font-label-sm text-label-sm text-text-muted">المحرك / نوع السيارة</span>
                  <span className="font-body-md text-body-md font-bold">{listing.body_type || 'غير محدد'}</span>
                </div>
                <div className="flex flex-col gap-base">
                  <span className="font-label-sm text-label-sm text-text-muted">نوع الوقود</span>
                  <span className="font-body-md text-body-md font-bold">{listing.fuel || 'غير محدد'}</span>
                </div>
                <div className="flex flex-col gap-base">
                  <span className="font-label-sm text-label-sm text-text-muted">ناقل الحركة</span>
                  <span className="font-body-md text-body-md font-bold">{listing.transmission || 'غير محدد'}</span>
                </div>
                <div className="flex flex-col gap-base">
                  <span className="font-label-sm text-label-sm text-text-muted">المسافة المقطوعة</span>
                  <span className="font-body-md text-body-md font-bold">
                    {listing.km ? `${Number(listing.km).toLocaleString()} كم` : 'غير محدد'}
                  </span>
                </div>
                <div className="flex flex-col gap-base">
                  <span className="font-label-sm text-label-sm text-text-muted">الموقع</span>
                  <span className="font-body-md text-body-md font-bold">{listing.city || 'غير محدد'}</span>
                </div>
                <div className="flex flex-col gap-base">
                  <span className="font-label-sm text-label-sm text-text-muted">اللون الخارجي</span>
                  <span className="font-body-md text-body-md font-bold">{listing.color || 'غير محدد'}</span>
                </div>
              </div>
            </section>
            
            {listing.description && (
              <section className="bg-surface-white border border-border-light rounded-lg p-md">
                <h3 className="font-headline-sm text-headline-sm mb-md border-b border-border-light pb-xs">الوصف</h3>
                <p className="font-body-md text-body-md whitespace-pre-line leading-relaxed text-on-surface-variant">
                  {listing.description}
                </p>
              </section>
            )}

            {/* Safety Tips */}
            <section className="bg-surface-container-low border border-border-light rounded-lg p-md">
              <div className="flex items-center gap-xs mb-sm">
                <span className="material-symbols-outlined text-verification-blue">shield</span>
                <h3 className="font-headline-sm text-headline-sm">نصائح الأمان</h3>
              </div>
              <ul className="space-y-xs list-disc pr-md font-body-sm text-body-sm text-on-surface-variant">
                <li>لا تقم بتحويل أي مبالغ مالية قبل معاينة السيارة وفحصها.</li>
                <li>قابل البائع في مكان عام وآمن للقيام بالمعاينة.</li>
                <li>تأكد من فحص أوراق السيارة الثبوتية بشكل قانوني.</li>
                <li>استخدم مراكز الصيانة المعتمدة في كارنا لإجراء الفحص الفني.</li>
              </ul>
            </section>
          </div>

          {/* Right Column in LTR, Left Column in RTL: Info, Seller, Actions */}
          <div className="lg:col-span-4 space-y-lg">
            
            {/* Main Info Card */}
            <section className="bg-surface-white border border-border-light rounded-lg p-md">
              <div className="flex justify-between items-start mb-sm">
                <span className="bg-secondary-container text-on-secondary-container px-xs py-1 rounded font-label-sm text-label-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  مفحوصة ومضمونة
                </span>
                <button className="text-text-muted hover:text-error transition-colors flex items-center gap-1 font-label-sm text-label-sm">
                  <span className="material-symbols-outlined text-[18px]">report</span>
                  تبليغ عن الإعلان
                </button>
              </div>
              
              <h2 className="font-headline-md text-headline-md font-bold mb-xs">{title}</h2>
              <div className="flex items-baseline gap-xs mb-lg">
                <span className="font-display-lg text-display-lg font-bold text-primary">
                  {listing.price ? Number(listing.price).toLocaleString() : 'غير محدد'}
                </span>
                <span className="font-headline-sm text-headline-sm text-on-surface-variant">ل.س</span>
              </div>
              <div className="flex items-center gap-xs mb-lg text-text-muted font-body-sm text-body-sm">
                <span className="material-symbols-outlined text-[16px]">visibility</span>
                <span>{listing.view_count || 0} عرض</span>
              </div>
              
              <div className="flex flex-col gap-sm">
                <button className="w-full bg-primary-container text-on-primary-container py-md rounded-lg font-headline-sm text-headline-sm font-bold flex justify-center items-center gap-xs hover:opacity-90 transition-opacity">
                  <span className="material-symbols-outlined">call</span>
                  اتصال بالبائع
                </button>
                <button className="w-full border-2 border-whatsapp-green text-whatsapp-green py-md rounded-lg font-headline-sm text-headline-sm font-bold flex justify-center items-center gap-xs hover:bg-whatsapp-green/5 transition-colors">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"></path>
                  </svg>
                  تواصل عبر واتساب
                </button>
                {/* CARNA In-App Chat */}
                {listing.user_id !== user?.id && (
                  <button
                    onClick={handleStartChat}
                    disabled={chatLoading}
                    className="w-full bg-primary text-on-primary py-md rounded-lg font-headline-sm text-headline-sm font-bold flex justify-center items-center gap-xs hover:opacity-90 transition-opacity shadow-md disabled:opacity-60"
                  >
                    {chatLoading ? (
                      <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                    ) : (
                      <span className="material-symbols-outlined">chat</span>
                    )}
                    {user ? 'أرسل رسالة عبر كارنا' : 'سجّل دخولك للمراسلة'}
                  </button>
                )}
                {/* Inspection Call to Action */}
                <button className="w-full bg-secondary text-on-secondary py-md rounded-lg font-headline-sm text-headline-sm font-bold flex justify-center items-center gap-xs hover:opacity-90 transition-opacity mt-2 shadow-sm">
                  <span className="material-symbols-outlined">car_repair</span>
                  اطلب فحص السيارة في ورشة
                </button>
              </div>
            </section>

            {/* Seller Info */}
            <section className="bg-surface-white border border-border-light rounded-lg p-md">
              <h3 className="font-label-sm text-label-sm text-text-muted mb-md">معلومات البائع</h3>
              <div className="flex items-center gap-md mb-md">
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant">person</span>
                </div>
                <div>
                  <p className="font-headline-sm text-headline-sm font-bold">{listing.users?.name || 'بائع غير معروف'}</p>
                  <span className="bg-surface-variant px-xs py-0.5 rounded font-label-sm text-label-sm">
                    {listing.seller_type === 'dealer' ? 'معرض سيارات' : 'مالك'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-xs text-text-muted font-body-sm text-body-sm">
                <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                عضو منذ 2021
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}
