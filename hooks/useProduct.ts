import { useQuery } from '@tanstack/react-query';
import { fetchProductById } from '../lib/api';
import { Product } from '../lib/data';

export function useProduct(productId: string) {
  return useQuery<Product | null, Error>({
    queryKey: ['product', productId],
    queryFn: () => {
      if (!productId) return null;
      return fetchProductById(productId);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!productId,
  });
}
