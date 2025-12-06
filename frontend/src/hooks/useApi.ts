import { useCallback } from 'react';
import api from '../services/api';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

/**
 * Hook personnalisé pour les appels API
 */
export const useApi = () => {
  const request = useCallback(
    async (
      method: 'get' | 'post' | 'put' | 'delete' | 'patch',
      url: string,
      data?: any,
      options?: UseApiOptions
    ) => {
      try {
        const response = await api[method](url, data);
        options?.onSuccess?.(response.data);
        return response.data;
      } catch (error: any) {
        console.error(`API Error [${method.toUpperCase()} ${url}]:`, error);
        options?.onError?.(error);
        throw error;
      }
    },
    []
  );

  return {
    get: (url: string, options?: UseApiOptions) => request('get', url, undefined, options),
    post: (url: string, data: any, options?: UseApiOptions) => request('post', url, data, options),
    put: (url: string, data: any, options?: UseApiOptions) => request('put', url, data, options),
    delete: (url: string, options?: UseApiOptions) => request('delete', url, undefined, options),
    patch: (url: string, data: any, options?: UseApiOptions) => request('patch', url, data, options),
  };
};

export default useApi;
