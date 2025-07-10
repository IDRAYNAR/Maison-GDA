import useSWR from 'swr';
import { Product, Brand, Category } from '@/generated/prisma';

interface ProductWithRelations extends Product {
  brand: Brand;
  category: Category;
  favorites: { userId: string }[];
  _count: { favorites: number };
}

interface ProductResponse {
  product: ProductWithRelations;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useProduct(slug: string) {
  const { data, error, isLoading, mutate } = useSWR<ProductResponse>(
    slug ? `/api/products/${slug}` : null,
    fetcher
  );

  return {
    product: data?.product,
    isLoading,
    error,
    mutate,
  };
} 