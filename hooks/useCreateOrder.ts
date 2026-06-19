import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrder } from '../lib/api';
import { Order } from '../lib/data';

type OrderInput = Omit<Order, 'id' | 'status' | 'createdAt'>;

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation<Order, Error, OrderInput>({
    mutationFn: createOrder,
    onSuccess: () => {
      // Refresh order cache and profile cache
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });
}
