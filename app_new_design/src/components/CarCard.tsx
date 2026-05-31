import { Link } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';

export interface Car {
  id?: string | number;
  title: string;
  price: string;
  location: string;
  year?: string | number | null;
  mileage: string;
  image: string;
  urgent?: boolean;
  viewCount?: number;
}

export default function CarCard({ car, urgent }: { car: Car; urgent?: boolean }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(String(car.id));

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite({
      id: String(car.id),
      title: car.title,
      year: Number(car.year) || 0,
      mileage: parseInt(car.mileage.replace(/\D/g, '')) || 0,
      location: car.location,
      price: parseInt(car.price.replace(/\D/g, '')) || 0,
      image: car.image,
    });
  };

  return (
    <div className="bg-surface-white border border-border-light rounded-lg overflow-hidden relative group hover:border-accent-yellow transition-all">

      {urgent && (
        <div className="absolute top-0 right-0 z-10">
          <div className="bg-accent-yellow text-text-primary px-sm py-1 font-label-sm text-label-sm shadow-sm">مستعجل</div>
        </div>
      )}
      <button 
        onClick={handleFavoriteClick}
        className="absolute top-2 left-2 z-10 w-8 h-8 bg-surface-white/80 backdrop-blur rounded-full flex items-center justify-center text-on-surface hover:text-primary transition-colors shadow-sm"
      >
        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: fav ? "'FILL' 1" : "'FILL' 0" }}>
          favorite
        </span>
      </button>
      <Link to={`/car/${car.id}`} className="block h-48 overflow-hidden relative">
        <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={car.image} alt={car.title} />
      </Link>
      <div className="p-sm">
        <Link to={`/car/${car.id}`} className="block mb-xs hover:opacity-80 transition-opacity">
          <h3 className="font-headline-sm text-headline-sm text-text-primary">{car.title}</h3>
        </Link>
        <p className="font-headline-sm text-headline-sm text-primary mb-sm font-bold">{car.price}</p>
        <div className="flex flex-wrap items-center gap-sm text-secondary">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px]">location_on</span>
            <span className="font-body-sm text-body-sm text-text-muted">{car.location}</span>
          </div>
          {car.year && (
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              <span className="font-body-sm text-body-sm text-text-muted">{car.year}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px]">speed</span>
            <span className="font-body-sm text-body-sm text-text-muted">{car.mileage}</span>
          </div>
          {car.viewCount !== undefined && (
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">visibility</span>
              <span className="font-body-sm text-body-sm text-text-muted">{car.viewCount.toLocaleString('ar-SA')} عرض</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
