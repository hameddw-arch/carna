import { useState } from 'react';
import SEO from '../components/SEO';

export default function CarComparisonPage() {
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);

  const schemaData = {
    "@context": "https://schema.org/",
    "@type": "WebApplication",
    "name": "أداة مقارنة السيارات - كارنا",
    "description": "قارن بين مواصفات السيارات والأسعار لاتخاذ قرار شرائي أفضل",
    "url": "https://carna.sy/compare",
    "applicationCategory": "UtilityApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "SYP"
    }
  };

  return (
    <>
      <SEO
        title="مقارنة السيارات"
        description="قارن بين مواصفات السيارات والأسعار لاتخاذ قرار شرائي أفضل. أداة مقارنة مجانية وسهلة على منصة كارنا"
        url="/compare"
        type="website"
        jsonLd={schemaData}
      />
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-lg rtl">
            
      {/* Page Header */}
      <div className="mb-lg flex flex-col md:flex-row md:items-end justify-between gap-md">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary mb-xs">مقارنة السيارات</h1>
          <p className="font-body-md text-body-md text-tertiary">قارن بين المواصفات والأسعار لاتخاذ القرار الأفضل لمشتراك القادم.</p>
        </div>
        <button className="flex items-center gap-xs bg-surface-white border border-border-light px-md py-sm rounded-lg hover:bg-surface-container-low transition-colors font-label-lg text-label-lg group">
          <span className="material-symbols-outlined text-primary group-hover:rotate-90 transition-transform">add</span>
          <span>إضافة سيارة أخرى</span>
        </button>
      </div>

      {/* Comparison Tool */}
      <div className="bg-surface-white border border-border-light rounded-xl overflow-hidden">
        <div className="comparison-scroll overflow-x-auto">
          <table className="w-full border-collapse min-w-[800px]">
            <thead>
              <tr>
                {/* Empty corner cell for headers */}
                <th className="w-1/4 p-md bg-surface-container-low border-b border-l border-border-light text-right font-headline-sm text-headline-sm text-primary">المواصفات الفنية</th>
                
                {/* Car 1 Header */}
                <th 
                  className={`w-1/4 p-md border-b border-border-light relative group transition-colors ${hoveredCol === 1 ? 'bg-primary-container/5' : ''}`}
                  onMouseEnter={() => setHoveredCol(1)}
                  onMouseLeave={() => setHoveredCol(null)}
                >
                  <button className="absolute top-2 left-2 p-1 text-tertiary hover:text-error transition-colors bg-surface-white rounded-full border border-border-light shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                  <div className="flex flex-col items-center gap-sm">
                    <div className="w-full aspect-video rounded-lg overflow-hidden bg-surface-container">
                      <img alt="BMW 5 Series" className="w-full h-full object-cover" data-alt="A side-profile shot of a sleek, dark metallic BMW sedan parked in a high-contrast, modern architectural setting. The lighting is crisp and professional, highlighting the car's aerodynamic lines and premium finish. The overall aesthetic is corporate, minimalist, and luxury-focused, aligning with a high-end marketplace style." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQ6knr97aZElRAKD0Fh3ZR2BV3rqHMdFw1sVf5DcunouVq0CvtjME0rwq-RIMyAWH0anCw2ZhGd9QG7TDI74o019rkRYA7QVAOnL_ubQYnR6fcioIyt1wdMxANEdK0zNg_RJwAVRFA6Na9Kg-irsSjZV0uFmiV-5_xSa_TbcECR1L1akfPN2E9p0G06wgq9GzKaa0j836aI9wHQIv2SJSVtA9TfiZok5l8b5mDmFo_hdA1FeB8AKTqSiAbDx_OrsjNXg7Df2gds_UO" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-headline-sm text-headline-sm">بي إم دبليو الفئة الخامسة</h3>
                      <p className="font-headline-md text-headline-md text-primary mt-1">245,000 ر.س</p>
                    </div>
                  </div>
                </th>
                
                {/* Car 2 Header */}
                <th 
                  className={`w-1/4 p-md border-b border-border-light relative group transition-colors ${hoveredCol === 2 ? 'bg-primary-container/5' : ''}`}
                  onMouseEnter={() => setHoveredCol(2)}
                  onMouseLeave={() => setHoveredCol(null)}
                >
                  <button className="absolute top-2 left-2 p-1 text-tertiary hover:text-error transition-colors bg-surface-white rounded-full border border-border-light shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                  <div className="flex flex-col items-center gap-sm">
                    <div className="w-full aspect-video rounded-lg overflow-hidden bg-surface-container">
                      <img alt="Mercedes E-Class" className="w-full h-full object-cover" data-alt="A front-three-quarter view of a silver Mercedes-Benz E-Class in a bright, clean studio lighting setup. The image exudes reliability and high-tech precision with sharp details on the grille and headlights. The background is a soft, neutral grey to keep focus entirely on the vehicle's professional design." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOJRTPHNPLdDEZPBp7pWji4xTeE2CBpmZVjfWgOKjib7bWv06VzPBqWPUkF_2X3rZ9YlTUgXLcd4dN-L30snPoFgdwPjlY5KVymBj7xeqx11gc6sivBtiAMhdTGM76U7jlSnhSmur0xAtThMTitq881o4F3REAgtnntIC6_-ICwEbdDP4Ief_G8LYmx96GUznCHg5T-XlVe4IRqfaWO-FofMvFskuoj3SRGxiRjTqNRGbqgvkbNDIOiS5XKSmdBKLDR-lBgAKpeOjT" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-headline-sm text-headline-sm">مرسيدس بنز E-Class</h3>
                      <p className="font-headline-md text-headline-md text-primary mt-1">260,000 ر.س</p>
                    </div>
                  </div>
                </th>
                
                {/* Car 3 Header (Optional/Dynamic) */}
                <th 
                  className={`w-1/4 p-md border-b border-border-light relative group transition-colors ${hoveredCol === 3 ? 'bg-primary-container/5' : ''}`}
                  onMouseEnter={() => setHoveredCol(3)}
                  onMouseLeave={() => setHoveredCol(null)}
                >
                  <button className="absolute top-2 left-2 p-1 text-tertiary hover:text-error transition-colors bg-surface-white rounded-full border border-border-light shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                  <div className="flex flex-col items-center gap-sm">
                    <div className="w-full aspect-video rounded-lg overflow-hidden bg-surface-container">
                      <img alt="Audi A6" className="w-full h-full object-cover" data-alt="A sophisticated Audi A6 in a deep navy blue finish, captured during the golden hour in an urban environment. The soft, warm light glints off the polished surfaces, suggesting master craftsmanship and urban elegance. The composition is clean, with the car taking center stage in a minimalist, modern streetscape." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOpw98gBUjEH5n7KT8KvDWQs25-rgd1SfqG2L06pjCapNTYsYJcUOEkvWA86nhCBPWW1p9z3uBP5yzkMjsx56G8fkaVI8dYmktMs7uW_QX_Yhe3jaSr8Qgm43NAQb_j0CwSN1cviLMofGIolM4oBGcKDuqKZPERjwCVBnPM5vEaX4_ZglXmvZdFJVv3bTNpIyUJPwuBH6VohBrLPidMF4TaFrbDkgh5GMV1AhcOK-Ga2USIJW31p0b55dqb2ro84yh9oGtNwwQH2O8" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-headline-sm text-headline-sm">أودي A6</h3>
                      <p className="font-headline-md text-headline-md text-primary mt-1">235,000 ر.س</p>
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            
            <tbody className="font-body-md text-body-md">
              {/* Brand */}
              <tr className="hover:bg-surface-container-lowest transition-colors">
                <td className="p-md font-bold text-tertiary border-l border-border-light bg-surface-container-low">ماركة السيارة</td>
                <td className={`p-md text-center border-b border-border-light transition-colors ${hoveredCol === 1 ? 'bg-primary-container/5' : ''}`} onMouseEnter={() => setHoveredCol(1)} onMouseLeave={() => setHoveredCol(null)}>بي إم دبليو</td>
                <td className={`p-md text-center border-b border-border-light transition-colors ${hoveredCol === 2 ? 'bg-primary-container/5' : ''}`} onMouseEnter={() => setHoveredCol(2)} onMouseLeave={() => setHoveredCol(null)}>مرسيدس بنز</td>
                <td className={`p-md text-center border-b border-border-light transition-colors ${hoveredCol === 3 ? 'bg-primary-container/5' : ''}`} onMouseEnter={() => setHoveredCol(3)} onMouseLeave={() => setHoveredCol(null)}>أودي</td>
              </tr>
              {/* Model */}
              <tr className="hover:bg-surface-container-lowest transition-colors">
                <td className="p-md font-bold text-tertiary border-l border-border-light bg-surface-container-low">الموديل</td>
                <td className={`p-md text-center border-b border-border-light transition-colors ${hoveredCol === 1 ? 'bg-primary-container/5' : ''}`} onMouseEnter={() => setHoveredCol(1)} onMouseLeave={() => setHoveredCol(null)}>520i</td>
                <td className={`p-md text-center border-b border-border-light transition-colors ${hoveredCol === 2 ? 'bg-primary-container/5' : ''}`} onMouseEnter={() => setHoveredCol(2)} onMouseLeave={() => setHoveredCol(null)}>E200</td>
                <td className={`p-md text-center border-b border-border-light transition-colors ${hoveredCol === 3 ? 'bg-primary-container/5' : ''}`} onMouseEnter={() => setHoveredCol(3)} onMouseLeave={() => setHoveredCol(null)}>40 TFSI</td>
              </tr>
              {/* Price */}
              <tr className="hover:bg-surface-container-lowest transition-colors">
                <td className="p-md font-bold text-tertiary border-l border-border-light bg-surface-container-low">السعر</td>
                <td className={`p-md text-center border-b border-border-light font-bold text-primary transition-colors ${hoveredCol === 1 ? 'bg-primary-container/5' : ''}`} onMouseEnter={() => setHoveredCol(1)} onMouseLeave={() => setHoveredCol(null)}>245,000 ر.س</td>
                <td className={`p-md text-center border-b border-border-light font-bold text-primary transition-colors ${hoveredCol === 2 ? 'bg-primary-container/5' : ''}`} onMouseEnter={() => setHoveredCol(2)} onMouseLeave={() => setHoveredCol(null)}>260,000 ر.س</td>
                <td className={`p-md text-center border-b border-border-light font-bold text-primary transition-colors ${hoveredCol === 3 ? 'bg-primary-container/5' : ''}`} onMouseEnter={() => setHoveredCol(3)} onMouseLeave={() => setHoveredCol(null)}>235,000 ر.س</td>
              </tr>
              {/* Year */}
              <tr className="hover:bg-surface-container-lowest transition-colors">
                <td className="p-md font-bold text-tertiary border-l border-border-light bg-surface-container-low">سنة الصنع</td>
                <td className={`p-md text-center border-b border-border-light transition-colors ${hoveredCol === 1 ? 'bg-primary-container/5' : ''}`} onMouseEnter={() => setHoveredCol(1)} onMouseLeave={() => setHoveredCol(null)}>2024</td>
                <td className={`p-md text-center border-b border-border-light font-bold text-primary bg-primary-fixed/10 transition-colors ${hoveredCol === 2 ? 'bg-primary-container/5' : ''}`} onMouseEnter={() => setHoveredCol(2)} onMouseLeave={() => setHoveredCol(null)}>2023</td>
                <td className={`p-md text-center border-b border-border-light transition-colors ${hoveredCol === 3 ? 'bg-primary-container/5' : ''}`} onMouseEnter={() => setHoveredCol(3)} onMouseLeave={() => setHoveredCol(null)}>2024</td>
              </tr>
              {/* Fuel Type */}
              <tr className="hover:bg-surface-container-lowest transition-colors">
                <td className="p-md font-bold text-tertiary border-l border-border-light bg-surface-container-low">نوع الوقود</td>
                <td className={`p-md text-center border-b border-border-light transition-colors ${hoveredCol === 1 ? 'bg-primary-container/5' : ''}`} onMouseEnter={() => setHoveredCol(1)} onMouseLeave={() => setHoveredCol(null)}>بنزين</td>
                <td className={`p-md text-center border-b border-border-light transition-colors ${hoveredCol === 2 ? 'bg-primary-container/5' : ''}`} onMouseEnter={() => setHoveredCol(2)} onMouseLeave={() => setHoveredCol(null)}>بنزين (هجين مخفف)</td>
                <td className={`p-md text-center border-b border-border-light transition-colors ${hoveredCol === 3 ? 'bg-primary-container/5' : ''}`} onMouseEnter={() => setHoveredCol(3)} onMouseLeave={() => setHoveredCol(null)}>بنزين</td>
              </tr>
              {/* Transmission */}
              <tr className="hover:bg-surface-container-lowest transition-colors">
                <td className="p-md font-bold text-tertiary border-l border-border-light bg-surface-container-low">ناقل الحركة</td>
                <td className={`p-md text-center border-b border-border-light transition-colors ${hoveredCol === 1 ? 'bg-primary-container/5' : ''}`} onMouseEnter={() => setHoveredCol(1)} onMouseLeave={() => setHoveredCol(null)}>أوتوماتيك</td>
                <td className={`p-md text-center border-b border-border-light transition-colors ${hoveredCol === 2 ? 'bg-primary-container/5' : ''}`} onMouseEnter={() => setHoveredCol(2)} onMouseLeave={() => setHoveredCol(null)}>أوتوماتيك 9G-Tronic</td>
                <td className={`p-md text-center border-b border-border-light transition-colors ${hoveredCol === 3 ? 'bg-primary-container/5' : ''}`} onMouseEnter={() => setHoveredCol(3)} onMouseLeave={() => setHoveredCol(null)}>أوتوماتيك S-Tronic</td>
              </tr>
              {/* Mileage */}
              <tr className="hover:bg-surface-container-lowest transition-colors">
                <td className="p-md font-bold text-tertiary border-l border-border-light bg-surface-container-low">المسافة المقطوعة</td>
                <td className={`p-md text-center border-b border-border-light transition-colors ${hoveredCol === 1 ? 'bg-primary-container/5' : ''}`} onMouseEnter={() => setHoveredCol(1)} onMouseLeave={() => setHoveredCol(null)}>0 كم</td>
                <td className={`p-md text-center border-b border-border-light transition-colors ${hoveredCol === 2 ? 'bg-primary-container/5' : ''}`} onMouseEnter={() => setHoveredCol(2)} onMouseLeave={() => setHoveredCol(null)}>5,200 كم</td>
                <td className={`p-md text-center border-b border-border-light transition-colors ${hoveredCol === 3 ? 'bg-primary-container/5' : ''}`} onMouseEnter={() => setHoveredCol(3)} onMouseLeave={() => setHoveredCol(null)}>0 كم</td>
              </tr>
              {/* City */}
              <tr className="hover:bg-surface-container-lowest transition-colors">
                <td className="p-md font-bold text-tertiary border-l border-border-light bg-surface-container-low">المدينة</td>
                <td className={`p-md text-center border-b border-border-light transition-colors ${hoveredCol === 1 ? 'bg-primary-container/5' : ''}`} onMouseEnter={() => setHoveredCol(1)} onMouseLeave={() => setHoveredCol(null)}>الرياض</td>
                <td className={`p-md text-center border-b border-border-light transition-colors ${hoveredCol === 2 ? 'bg-primary-container/5' : ''}`} onMouseEnter={() => setHoveredCol(2)} onMouseLeave={() => setHoveredCol(null)}>جدة</td>
                <td className={`p-md text-center border-b border-border-light transition-colors ${hoveredCol === 3 ? 'bg-primary-container/5' : ''}`} onMouseEnter={() => setHoveredCol(3)} onMouseLeave={() => setHoveredCol(null)}>الدمام</td>
              </tr>
              {/* Price Badge Row */}
              <tr className="hover:bg-surface-container-lowest transition-colors">
                <td className="p-md font-bold text-tertiary border-l border-border-light bg-surface-container-low">التوفر والحالة</td>
                <td className={`p-md text-center border-b border-border-light transition-colors ${hoveredCol === 1 ? 'bg-primary-container/5' : ''}`} onMouseEnter={() => setHoveredCol(1)} onMouseLeave={() => setHoveredCol(null)}>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-label-sm font-bold">متاح فوراً</span>
                </td>
                <td className={`p-md text-center border-b border-border-light transition-colors ${hoveredCol === 2 ? 'bg-primary-container/5' : ''}`} onMouseEnter={() => setHoveredCol(2)} onMouseLeave={() => setHoveredCol(null)}>
                  <span className="bg-verification-blue/10 text-verification-blue px-3 py-1 rounded-full text-label-sm font-bold">معتمد</span>
                </td>
                <td className={`p-md text-center border-b border-border-light transition-colors ${hoveredCol === 3 ? 'bg-primary-container/5' : ''}`} onMouseEnter={() => setHoveredCol(3)} onMouseLeave={() => setHoveredCol(null)}>
                  <span className="bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full text-label-sm font-bold">عرض خاص</span>
                </td>
              </tr>
              {/* Actions */}
              <tr>
                <td className="p-md border-l border-border-light bg-surface-container-low"></td>
                <td className={`p-md border-b border-border-light text-center transition-colors ${hoveredCol === 1 ? 'bg-primary-container/5' : ''}`} onMouseEnter={() => setHoveredCol(1)} onMouseLeave={() => setHoveredCol(null)}>
                  <button className="w-full bg-primary-container text-on-primary-container py-3 rounded-lg font-bold hover:brightness-105 active:scale-95 transition-all">تواصل مع البائع</button>
                </td>
                <td className={`p-md border-b border-border-light text-center transition-colors ${hoveredCol === 2 ? 'bg-primary-container/5' : ''}`} onMouseEnter={() => setHoveredCol(2)} onMouseLeave={() => setHoveredCol(null)}>
                  <button className="w-full bg-primary-container text-on-primary-container py-3 rounded-lg font-bold hover:brightness-105 active:scale-95 transition-all">تواصل مع البائع</button>
                </td>
                <td className={`p-md border-b border-border-light text-center transition-colors ${hoveredCol === 3 ? 'bg-primary-container/5' : ''}`} onMouseEnter={() => setHoveredCol(3)} onMouseLeave={() => setHoveredCol(null)}>
                  <button className="w-full bg-primary-container text-on-primary-container py-3 rounded-lg font-bold hover:brightness-105 active:scale-95 transition-all">تواصل مع البائع</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Suggestions/Quick Add Section */}
      <section className="mt-xl">
        <h2 className="font-headline-md text-headline-md mb-md">سيارات قد تهمك للمقارنة</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-md">
          {/* Suggestion Card 1 */}
          <div className="bg-surface-white border border-border-light rounded-lg overflow-hidden hover:border-primary transition-colors cursor-pointer group">
            <div className="relative aspect-video">
              <img alt="Porsche Taycan" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="A minimalist overhead shot of a classic sports car in a high-key white studio. The image focus is on the geometric symmetry of the vehicle's roof and hood. The aesthetic is clean and professional, matching the CARNA brand's focus on mastery and high-performance trading." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6rZUj-eFAtiWBKttY1MWo2rEJmf85LctR0C-m1IPG8nvcW3TjHc9cXi2uia08HT2u26zf6tYHP2Tx8HrfpzvlhoIDQPEowQikYo54mB2dJ2keaO5OUMlCyBuX60NaJUBYCt_P2mpp-mnJiBlXFudg6jP1QvddjqrKnpheLoDhnM8alKE7PCKjerjal0N7Z1tVam94p0bC11BPGeyBG-DsLfhEN1SRxjmtXw_8xH1Ha9LNEr8oLhKVcO-SOq2c_aNAKY-aN6aFVSu-" />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors"></div>
            </div>
            <div className="p-sm">
              <h4 className="font-label-lg text-label-lg font-bold">بورشه تايكان 2024</h4>
              <div className="flex justify-between items-center mt-2">
                <span className="text-primary font-bold">480,000 ر.س</span>
                <button className="text-primary hover:bg-primary-fixed/20 p-1 rounded-full transition-colors">
                  <span className="material-symbols-outlined">add_circle</span>
                </button>
              </div>
            </div>
          </div>

          {/* Suggestion Card 2 */}
          <div className="bg-surface-white border border-border-light rounded-lg overflow-hidden hover:border-primary transition-colors cursor-pointer group">
            <div className="relative aspect-video">
              <img alt="Tesla Model S" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="A detailed side view of a white Tesla Model S in a brightly lit, modern environment with glass reflections. The shot emphasizes the futuristic and clean aesthetic of the electric car, with a focus on its smooth panels and minimalist door handles. The atmosphere is high-tech and premium." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkZve5YsUytu5l6MwOWbrHmU1EsEGaRSNvwjSpgCXFM-4EzXzDZOQfP7oqlttv7sPt4qa_21hxc2-tj9Wcuj8CpWuLx7jDzyLeCjLxARL7zqXgeOU7ZQjciNvPgWNwIY3R78Al-zRlIKHDbwXBFTba8LbMQosQOBARLlyEu54PbMY0y_ATYuyrkQxlooe33YCdwAfpJIFOvEd5GCF6Ys7seVuIWHyKaKd5MdMYjOLecwEi1nGV7T4I7ah9zscMoURAyS8xbV2v8Vr8" />
            </div>
            <div className="p-sm">
              <h4 className="font-label-lg text-label-lg font-bold">تسلا موديل S 2023</h4>
              <div className="flex justify-between items-center mt-2">
                <span className="text-primary font-bold">390,000 ر.س</span>
                <button className="text-primary hover:bg-primary-fixed/20 p-1 rounded-full transition-colors">
                  <span className="material-symbols-outlined">add_circle</span>
                </button>
              </div>
            </div>
          </div>

          {/* Add New Slot */}
          <div className="border-2 border-dashed border-border-light rounded-lg flex flex-col items-center justify-center p-md bg-surface-container-lowest hover:bg-surface-container-low transition-all cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-primary mb-sm group-hover:bg-primary group-hover:text-surface-white transition-colors">
              <span className="material-symbols-outlined">add</span>
            </div>
            <p className="font-label-lg text-label-lg font-bold text-tertiary">أضف سيارة للمقارنة</p>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
