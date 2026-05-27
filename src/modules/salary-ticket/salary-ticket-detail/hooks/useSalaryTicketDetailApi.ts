import { BaseResponse, BaseResponsePagination } from 'common/model/base-response';
import { SalaryTicket } from 'common/model/salary-ticket';
import api from 'hooks/api';
import useSWR from 'swr';

export const useSalaryTicketDetailApi = (id: number) => {
  // Implement API calls related to salary ticket detail here
  const _fetchDetail = async () => {
    const response = await api.POST<BaseResponse<BaseResponsePagination<SalaryTicket>>>({
      path: '/api/models/salary-payslip-report-line/execute/get_salary_payslip_details',
      data: {
        kwargs: {
          id: id,
        },
      },
    });
    return response.data?.records?.at(0);
  };

  const { data: salaryTicketDetail, isLoading: salaryTicketDetailLoading } = useSWR(
    id ? ['get_salary_payslip_details', id] : null,
    _fetchDetail,
    {
      revalidateOnFocus: false,
    },
  );

  return {
    salaryTicketDetail,
    salaryTicketDetailLoading,
  };
};
