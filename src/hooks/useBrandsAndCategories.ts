import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useBrands() {
  const { data, error, isLoading, mutate } = useSWR('/api/brands', fetcher);

  return {
    brands: data?.brands || [],
    isLoading,
    isError: error,
    mutate
  };
}

export function useCategories() {
  const { data, error, isLoading, mutate } = useSWR('/api/categories', fetcher);

  return {
    categories: data?.categories || [],
    isLoading,
    isError: error,
    mutate
  };
} 