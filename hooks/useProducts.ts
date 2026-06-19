import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../lib/api';
import { Product } from '../lib/data';

export function useProducts(category?: string) {
  return useQuery<Product[], Error>({
    queryKey: ['products', category || 'all'],
    queryFn: () => fetchProducts(category),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,    // 10 minutes
  });
}
