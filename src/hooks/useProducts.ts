import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface ProductsParams {
  page?: number;
  limit?: number;
  gender?: string;
  concentration?: string;
  brandId?: string;
  categoryId?: string;
  featured?: boolean;
  inStock?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export function useProducts(params: ProductsParams = {}) {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value.toString());
    }
  });

  const url = `/api/products?${searchParams.toString()}`;
  
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  return {
    products: data?.products || [],
    pagination: data?.pagination,
    isLoading,
    isError: error,
    mutate
  };
}

export function useProduct(slug: string) {
  const { data, error, isLoading, mutate } = useSWR(
    slug ? `/api/products/${slug}` : null,
    fetcher
  );

  return {
    product: data?.product,
    isLoading,
    isError: error,
    mutate
  };
}

export function useFeaturedProducts() {
  return useProducts({ featured: true, limit: 8 });
} 