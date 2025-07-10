import useSWR from 'swr';
import { useState } from 'react';

interface Favorite {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
}

interface FavoritesResponse {
  favorites: Favorite[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useFavorites() {
  const [isToggling, setIsToggling] = useState(false);
  
  const { data, error, isLoading, mutate } = useSWR<FavoritesResponse>(
    '/api/favorites',
    fetcher
  );

  const toggleFavorite = async (productId: string) => {
    setIsToggling(true);
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle favorite');
      }

      // Optimistically update the cache
      await mutate();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsToggling(false);
    }
  };

  return {
    favorites: data?.favorites || [],
    isLoading,
    isError: error,
    toggleFavorite,
    isToggling,
    mutate,
  };
} 