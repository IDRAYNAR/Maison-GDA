import useSWR from 'swr';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Favorite {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
}

interface FavoritesResponse {
  favorites: Favorite[];
}

const fetcher = (url: string) => fetch(url).then((res) => {
  if (res.status === 401) {
    return { favorites: [] }; // Retourner un tableau vide pour les non-connectés
  }
  return res.json();
});

export function useFavorites() {
  const { status } = useSession();
  const router = useRouter();
  const [isToggling, setIsToggling] = useState(false);
  
  const { data, error, isLoading, mutate } = useSWR<FavoritesResponse>(
    status === 'authenticated' ? '/api/favorites' : null, // Ne fetch que si authentifié
    fetcher
  );

  const toggleFavorite = async (productId: string) => {
    if (status !== 'authenticated') {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(window.location.pathname));
      return;
    }

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
      await mutate();
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // On pourrait vouloir afficher une notification à l'utilisateur ici
    } finally {
      setIsToggling(false);
    }
  };

  return {
    favorites: data?.favorites || [],
    isLoading: status === 'loading' || isLoading,
    isError: error,
    toggleFavorite,
    isToggling,
    mutate,
    isAuthenticated: status === 'authenticated',
  };
} 