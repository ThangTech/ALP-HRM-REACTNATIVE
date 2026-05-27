import api from 'hooks/api';
import { SalaryTicketListState } from '../SalaryTicketListState';
import { BaseResponse, BaseResponsePagination } from 'common/model/base-response';
import { SalaryTicket } from 'common/model/salary-ticket';
import useSWR from 'swr';
import dayjs from 'dayjs';

export const useSalaryTicketsApi = (state: SalaryTicketListState) => {
  // Placeholder for future API logic related to salary tickets
  const _fetchSalaryTickets = async (): Promise<
    BaseResponse<BaseResponsePagination<SalaryTicket>>
  > => {
    return api.POST<BaseResponse<BaseResponsePagination<SalaryTicket>>>({
      path: '/api/models/salary-payslip-report-line/execute/get_list_payslip',
      data: {
        kwargs: {
          limit: state.limit,
          offset: state.offset,
          date_from: dayjs(state.dateFrom).format('YYYY-MM-DD'),
          date_to: dayjs(state.dateTo).format('YYYY-MM-DD'),
        },
      },
    });
  };
  const { data: salaryTicketsData, isLoading: salaryTicketsLoading } = useSWR(
    [
      'get_list_payslip',
      state.limit,
      state.offset,
      state.dateFrom,
      state.dateTo,
      state.triggerReload,
    ],
    _fetchSalaryTickets,
  );

  return {
    salaryTicketData: salaryTicketsData,
    salaryTicketsLoading,
  };
};
