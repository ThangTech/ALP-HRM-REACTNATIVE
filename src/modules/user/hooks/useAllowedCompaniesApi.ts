import api from 'hooks/api';
import useSWR from 'swr';

export interface AllowedCompany {
  id: number;
  name: string;
  code: string;
}

interface AllowedCompaniesData {
  default_company: AllowedCompany | null;
  allowed_companies: AllowedCompany[];
}

interface AllowedCompaniesResponse {
  data: AllowedCompaniesData;
}

export const useAllowedCompaniesApi = () => {
  const fetcher = async (): Promise<AllowedCompaniesData> => {
    const response = await api.POST<AllowedCompaniesResponse>({
      path: '/api/models/res-users/execute/app_get_allowed_companies',
      data: {},
    });
    return (
      response?.data ?? {
        default_company: null,
        allowed_companies: [],
      }
    );
  };

  const swr = useSWR('app_get_allowed_companies', fetcher, {
    revalidateOnFocus: false,
  });

  return {
    defaultCompany: swr.data?.default_company ?? null,
    allowedCompanies: swr.data?.allowed_companies ?? [],
    loading: swr.isLoading,
    error: swr.error,
    refetch: swr.mutate,
  };
};
