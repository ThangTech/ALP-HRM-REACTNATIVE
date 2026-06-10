import { UserAttachment } from 'common/model/user-attachment';
import api from 'hooks/api';
import useSWR from 'swr';

export const useCompanyProfileApi = (employeeId?: number) => {
  const employeeKwargs = employeeId ? { kwargs: { employee_id: employeeId } } : {};

  const fetchDocuments = async (): Promise<UserAttachment> => {
    try {
      const response = await api.POST({
        path: '/api/models/hr-employee/execute/get_company_profile_attachments',
        data: employeeKwargs,
      });
      const data = response.data as UserAttachment;
      return data;
    } catch (error: any) {
      throw error;
    }
  };

  const fetchDocumentSwr = useSWR(['get_company_profile_attachments', employeeId], fetchDocuments);

  return {
    fetchDocumentSwr,
  };
};
