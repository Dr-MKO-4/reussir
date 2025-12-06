import { useCallback } from 'react';
import api from '../services/api';
import { useToast } from './useToast';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  showNotification?: boolean;
}

/**
 * Hook personnalisé pour les appels API
 */
export const useApi = () => {
  const toast = useToast();

  const request = useCallback(
    async (
      method: 'get' | 'post' | 'put' | 'delete' | 'patch',
      url: string,
      data?: any,
      options?: UseApiOptions
    ) => {
      try {
        const response = await api[method](url, data);
        if (options?.showNotification) {
          toast.showToast('success', 'Succès', 'Opération réalisée avec succès');
        }
        options?.onSuccess?.(response.data);
        return response.data;
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Une erreur est survenue';
        toast.showToast('error', 'Erreur', errorMessage);
        options?.onError?.(error);
        throw error;
      }
    },
    [toast]
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
