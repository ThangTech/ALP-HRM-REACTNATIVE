import { UserAttachment } from 'common/model/user-attachment';
import api from 'hooks/api';
import useSWR from 'swr';

export const useCompanyProfileApi = () => {
  const fetchDocuments = async (): Promise<UserAttachment> => {
    try {
      const response = await api.POST({
        path: '/api/models/hr-employee/execute/get_company_profile_attachments',
        data: {},
      });
      const data = response.data as UserAttachment;
      return data;
    } catch (error: any) {
      throw error;
    }
  };

  const fetchDocumentSwr = useSWR('get_company_profile_attachments', fetchDocuments);

  return {
    fetchDocumentSwr,
  };
};
