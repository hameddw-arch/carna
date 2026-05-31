import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchFavoritesDb, addFavoriteDb, removeFavoriteDb } from '../lib/queries/index';

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
    const loadFavorites = async () => {
      // First load from local storage
      const saved = localStorage.getItem(storageKey);
      let localFavs: FavoriteItem[] = [];
      if (saved) {
        try {
          localFavs = JSON.parse(saved);
        } catch (e) {
          localFavs = [];
        }
      }
      setFavorites(localFavs);

      // Then sync with DB if logged in
      if (user) {
        await fetchFavoritesDb(user.id);
        // Note: we might need to fetch the full listing details for these IDs if they aren't in localFavs
        // But for simplicity, we assume localFavs has the details, or we just rely on local storage for details and DB for backup
      }
    };
    loadFavorites();
  }, [storageKey, user]);

  const toggleFavorite = (item: FavoriteItem) => {
    setFavorites(prev => {
      const exists = prev.find(fav => fav.id === item.id);
      let updated;
      if (exists) {
        updated = prev.filter(fav => fav.id !== item.id);
        if (user) removeFavoriteDb(user.id, item.id);
      } else {
        updated = [...prev, item];
        if (user) addFavoriteDb(user.id, item.id);
      }
      localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated;
    });
  };

  const removeFavorite = (id: string) => {
    setFavorites(prev => {
      const updated = prev.filter(fav => fav.id !== id);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      if (user) removeFavoriteDb(user.id, id);
      return updated;
    });
  };

  const isFavorite = (id: string) => {
    return favorites.some(fav => fav.id === id);
  };

  return { favorites, toggleFavorite, removeFavorite, isFavorite };
}
