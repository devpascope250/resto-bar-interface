'use client'

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
  QueryKey,
  keepPreviousData,
} from '@tanstack/react-query'
import { getApiClient, ApiError } from '@/lib/api-client'

export const useApi = () => {
  const queryClient = useQueryClient()
  const api = getApiClient()

   const useApiQuery = <T>(
    key: QueryKey,
    url: string,
    options?: Omit<UseQueryOptions<T, ApiError>, 'queryKey' | 'queryFn'> & {
      fetchOptions?: RequestInit
    }
  ) => {
    const { fetchOptions, ...queryOptions } = options || {}
    
    return useQuery<T, ApiError>({
      queryKey: key,
      queryFn: () => api.get<T>(url, fetchOptions),
      ...queryOptions,
    })
  }

  const useApiPost = <T, V = any>(
    key: QueryKey,
    url: string,
    options?: Omit<UseMutationOptions<T, ApiError, V>, 'mutationKey' | 'mutationFn'>,
    fetchOptions?: RequestInit
  ) => {
    return useMutation<T, ApiError, V>({
      mutationKey: key,
      mutationFn: (data: V) => api.post<T, V>(url, data, fetchOptions),
      ...options,
    })
  }

  const useApiPut = <T, V = any>(
    key: QueryKey,
    url: string,
    options?: Omit<UseMutationOptions<T, ApiError, V>, 'mutationKey' | 'mutationFn'>,
    fetchOptions?: RequestInit
  ) => {
    return useMutation<T, ApiError, V>({
      mutationKey: key,
      mutationFn: (data: V) => api.put<T, V>(url, data, fetchOptions),
      ...options,
    })
  }

 const useApiDelete = <T, V extends { id: string }>(
  key: QueryKey,
  url: string | ((id: string) => string),
  options?: Omit<UseMutationOptions<T, ApiError, V>, 'mutationKey' | 'mutationFn'>,
  fetchOptions?: RequestInit
) => {
  return useMutation<T, ApiError, V>({
    mutationKey: key,
    mutationFn: (params: V) => {
      const finalUrl = typeof url === 'function' 
        ? url(params.id) 
        : `${url}/${params.id}`;
      return api.delete<T>(finalUrl, fetchOptions);
    },
    ...options,
  });
};

  // Additional utility hooks
  const useApiPatch = <T, V = any>(
    key: QueryKey,
    url: string,
    options?: Omit<UseMutationOptions<T, ApiError, V>, 'mutationKey' | 'mutationFn'>,
    fetchOptions?: RequestInit
  ) => {
    return useMutation<T, ApiError, V>({
      mutationKey: key,
      mutationFn: (data: V) => api.patch<T, V>(url, data, fetchOptions),
      ...options,
    })
  }

  const invalidateQueries = (queryKey: QueryKey) => {
    return queryClient.invalidateQueries({ queryKey })
  }

  const cancelQueries = (queryKey: QueryKey) => {
    return queryClient.cancelQueries({ queryKey })
  }

  return {
    api,
    queryClient,
    useApiQuery,
    useApiPost,
    useApiPut,
    useApiPatch,
    useApiDelete,
    invalidateQueries,
    cancelQueries,
    keepPreviousData
  }
}