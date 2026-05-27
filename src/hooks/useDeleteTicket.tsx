import { TicketType } from 'common/enum/ticket-type';
import { DeleteTicketArg } from 'common/model/delete-ticket-arg';
import { showToast } from 'components';
import api from 'hooks/api';
import { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';

export const useDeleteTicket = () => {
  const swrConfig = useSWRConfig();
  const _deleteTicket = async (_: any, { arg }: { arg: DeleteTicketArg }) => {
    const { type, ticketId } = arg;
    if (!ticketId) {
      return;
    }
    let apiPath = '',
      cacheKey = '';
    switch (type) {
      case TicketType.TIME_SHEET_EXPLANATION:
        apiPath =
          '/api/models/hr-attendance-explanation/execute/app_delete_hr_attendance_explanation';
        cacheKey = 'timesheetExplanationList';
        break;
      case TicketType.LEAVE_REGISTRATION:
        apiPath = '/api/models/hr-leave/execute/app_delete_hr_leave';
        cacheKey = 'get_list_leaves';
        break;
      case TicketType.TERMINATION:
        apiPath = '/api/models/resignation-letter/execute/app_delete_resignation_letter';
        cacheKey = 'get_resignation_letter';
        break;
      case TicketType.PERSONAL_REPORT:
        apiPath = '/api/models/staff-transfer/execute/app_delete_staff_transfer';
        cacheKey = 'get_staff_transfer';
        break;
    }
    try {
      const response = await api.POST({
        path: apiPath,
        data: {
          kwargs: { id: ticketId },
        },
      });
      swrConfig.mutate((key) => {
        const keyString = Array.isArray(key) ? key.join(' ') : String(key);
        return keyString.includes(cacheKey);
      });
      return response;
    } catch (error: any) {
      showToast('error', error.message || 'Đã có lỗi xảy ra khi xoá phiếu');
      throw error;
    }
  };

  const { trigger: handleDelete } = useSWRMutation('/delete-ticket', _deleteTicket);
  return {
    handleDelete,
  };
};
