import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export interface FavoriteItem {
  id: string; // listing id
  title: string;
  year: number;
  mileage: number;
  location: string;
  price: number;
  image: string;
  verified?: boolean;
}

export function useFavorites() {
  const { user } = useAuth();
  const storageKey = user ? `favorites_${user.id}` : 'favorites_guest';
  
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        setFavorites([]);
      }
    } else {
      setFavorites([]);
    }
  }, [storageKey]);

  const toggleFavorite = (item: FavoriteItem) => {
    setFavorites(prev => {
      const exists = prev.find(fav => fav.id === item.id);
      let updated;
      if (exists) {
        updated = prev.filter(fav => fav.id !== item.id);
      } else {
        updated = [...prev, item];
      }
      localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated;
    });
  };

  const removeFavorite = (id: string) => {
    setFavorites(prev => {
      const updated = prev.filter(fav => fav.id !== id);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated;
    });
  };

  const isFavorite = (id: string) => {
    return favorites.some(fav => fav.id === id);
  };

  return { favorites, toggleFavorite, removeFavorite, isFavorite };
}
