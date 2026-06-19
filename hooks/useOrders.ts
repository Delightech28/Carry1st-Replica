import { useQuery } from '@tanstack/react-query';
import { fetchOrders } from '../lib/api';
import { Order } from '../lib/data';

export function useOrders() {
  return useQuery<Order[], Error>({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
