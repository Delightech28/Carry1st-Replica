import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUserProfile, updateUserProfile, fundWallet } from '../lib/api';
import { UserProfile } from '../lib/data';

export function useUserProfile() {
  return useQuery<UserProfile, Error>({
    queryKey: ['user-profile'],
    queryFn: fetchUserProfile,
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation<UserProfile, Error, Partial<UserProfile>>({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });
}

export function useFundWallet() {
  const queryClient = useQueryClient();

  return useMutation<UserProfile, Error, number>({
    mutationFn: fundWallet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });
}
