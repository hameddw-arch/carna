import { useEffect, useState } from 'react';
import {
  fetchPopularListings,
  fetchSearchAnalytics,
  fetchUserEngagementMetrics,
  fetchFilterUsageAnalytics
} from '../../lib/queries/analytics';
import { TrendingUp, BarChart3, Users, Eye, Search, Sliders } from 'lucide-react';

interface Listing {
  id: string;
  title: string;
  make: string;
  model?: string;
  price: number;
  view_count: number;
}

interface SearchTerm {
  search_term: string;
  count: number;
}

interface FilterEvent {
  filter_type: string;
  filter_value: string;
  count: number;
}

export function AnalyticsTabContent() {
  const [popularListings, setPopularListings] = useState<Listing[]>([]);
  const [searchAnalytics, setSearchAnalytics] = useState<SearchTerm[]>([]);
  const [filterAnalytics, setFilterAnalytics] = useState<FilterEvent[]>([]);
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeListings: 0,
    totalViews: 0,
    avgViewsPerListing: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [popular, searches, filters, engagementMetrics] = await Promise.all([
          fetchPopularListings(10),
          fetchSearchAnalytics(10),
          fetchFilterUsageAnalytics(),
          fetchUserEngagementMetrics()
        ]);

        setPopularListings(popular);
        setSearchAnalytics(searches);
        setFilterAnalytics(filters);
        setMetrics(engagementMetrics);
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-semibold">المستخدمون</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{metrics.totalUsers}</p>
            </div>
            <Users className="w-10 h-10 text-blue-400 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-semibold">الإعلانات النشطة</p>
              <p className="text-3xl font-bold text-green-900 mt-2">{metrics.activeListings}</p>
            </div>
            <BarChart3 className="w-10 h-10 text-green-400 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-semibold">إجمالي المشاهدات</p>
              <p className="text-3xl font-bold text-purple-900 mt-2">{metrics.totalViews.toLocaleString()}</p>
            </div>
            <Eye className="w-10 h-10 text-purple-400 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-semibold">متوسط المشاهدات</p>
              <p className="text-3xl font-bold text-orange-900 mt-2">{metrics.avgViewsPerListing}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-orange-400 opacity-50" />
          </div>
        </div>
      </div>

      {/* Popular Listings */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5 text-blue-600" />
          الإعلانات الأكثر مشاهدة
        </h3>
        {loading ? (
          <p className="text-gray-500">جاري التحميل...</p>
        ) : popularListings.length === 0 ? (
          <p className="text-gray-500">لا توجد بيانات</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-right p-2">الاسم</th>
                  <th className="text-right p-2">الماركة</th>
                  <th className="text-right p-2">السعر</th>
                  <th className="text-center p-2">المشاهدات</th>
                </tr>
              </thead>
              <tbody>
                {popularListings.map(listing => (
                  <tr key={listing.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{listing.title}</td>
                    <td className="p-2">{listing.make}</td>
                    <td className="p-2">{listing.price} ل.س</td>
                    <td className="p-2 text-center">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                        {listing.view_count}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Search Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Search className="w-5 h-5 text-green-600" />
            أكثر المصطلحات البحثية
          </h3>
          {loading ? (
            <p className="text-gray-500">جاري التحميل...</p>
          ) : searchAnalytics.length === 0 ? (
            <p className="text-gray-500">لا توجد بيانات</p>
          ) : (
            <div className="space-y-2">
              {searchAnalytics.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium text-gray-700">{item.search_term}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${Math.min(100, (item.count / Math.max(...searchAnalytics.map(s => s.count), 1)) * 100)}%`
                        }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-gray-600 w-8 text-right">
                      {item.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filter Usage Analytics */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-orange-600" />
            استخدام المرشحات
          </h3>
          {loading ? (
            <p className="text-gray-500">جاري التحميل...</p>
          ) : filterAnalytics.length === 0 ? (
            <p className="text-gray-500">لا توجد بيانات</p>
          ) : (
            <div className="space-y-2">
              {filterAnalytics.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-700">{item.filter_type}</span>
                    <span className="text-xs text-gray-500">{item.filter_value}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full"
                        style={{
                          width: `${Math.min(100, (item.count / Math.max(...filterAnalytics.map(f => f.count), 1)) * 100)}%`
                        }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-gray-600 w-6 text-right">
                      {item.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">ملاحظات التحليلات</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• المشاهدات: تُحدَّث تلقائياً عند زيارة صفحة الإعلان</li>
          <li>• البحث: تُسجَّل جميع عمليات البحث والمصطلحات المستخدمة</li>
          <li>• المرشحات: تُتبع استخدام جميع خيارات التصفية (السعر، الماركة، إلخ)</li>
          <li>• يتم تحديث البيانات في الوقت الفعلي</li>
        </ul>
      </div>
    </div>
  );
}
