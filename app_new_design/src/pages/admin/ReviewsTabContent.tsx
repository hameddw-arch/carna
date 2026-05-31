interface ReviewsTabContentProps {
  reviews: any[];
  onDeleteReview: (id: string) => void;
}

export function ReviewsTabContent({ reviews, onDeleteReview }: ReviewsTabContentProps) {
  return (
    <div className="bg-surface-white border border-border-light rounded-xl overflow-hidden shadow-sm">
      <div className="p-md border-b border-border-light">
        <h2 className="font-headline-sm text-headline-sm">التقييمات ({reviews.length})</h2>
      </div>
      <div className="space-y-md p-md">
        {reviews.length === 0 ? (
          <div className="text-center text-tertiary py-lg">لا توجد تقييمات</div>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="p-md bg-surface-container-low rounded-lg border border-border-light">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-on-surface">{review.users?.name || 'مستخدم'}</p>
                  <p className="text-body-sm text-tertiary">
                    {review.listings?.title || review.listings?.make} {review.listings?.model}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`material-symbols-outlined text-sm ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                      star
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-body-sm text-on-surface mb-2">{review.comment}</p>
              <div className="flex justify-between items-center text-tertiary text-body-sm">
                <span>{new Date(review.created_at).toLocaleDateString('ar-EG')}</span>
                <button
                  onClick={() => onDeleteReview(review.id)}
                  className="p-1 text-tertiary hover:text-error transition-colors"
                  title="حذف"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
