import { LeaveRegistrationRequestTimeType } from 'common/enum/leave-registration-period';
import { Holiday, LeaveRegistration } from 'common/model/leave-registration';
import { showToast } from 'components';
import dayjs from 'dayjs';
import api from 'hooks/api';
import useSWR, { mutate } from 'swr';
import useSWRMutation from 'swr/mutation';
import { formatDateTimeForOdoo2 } from 'utils';
import { LeaveRegistrationForm } from '../provider';
import { BaseResponse } from 'common/model/base-response';
import { LeaveButtonType } from 'common/enum/leave-registration-status';

export const useLeaveRegistrationApi = (formValues: LeaveRegistrationForm) => {
  const getKargs = (arg: LeaveRegistrationForm) => {
    const data = arg;
    const dateFrom = dayjs(data.dateFrom)
      .set('hour', dayjs(data.timeFrom).get('hour'))
      .set('minute', dayjs(data.timeFrom).get('minute'))
      .toDate();
    const dateTo = dayjs(data.dateFrom)
      .set('hour', dayjs(data.timeTo).get('hour'))
      .set('minute', dayjs(data.timeTo).get('minute'))
      .toDate();
    return {
      id: formValues.id,
      holiday_status_id: +(data.type ?? 0),
      request_date_from: data.dateFrom ? dayjs(data.dateFrom).format('YYYY-MM-DD') : undefined,
      request_date_to: data.dateTo ? dayjs(data.dateTo).format('YYYY-MM-DD') : undefined,
      date_from: data.timeFrom ? formatDateTimeForOdoo2(dateFrom.toString()) : undefined,
      date_to: data.timeTo ? formatDateTimeForOdoo2(dateTo.toString()) : undefined,
      request_hour_from: data.timeFrom
        ? dateFrom.getHours() + dateFrom.getMinutes() / 60
        : undefined,
      request_hour_to: data.timeTo ? dateTo.getHours() + dateTo.getMinutes() / 60 : undefined,
      request_date_from_period: data.period,
      request_unit_half: arg.requestType === LeaveRegistrationRequestTimeType.PERIOD,
      request_unit_hours: arg.requestType === LeaveRegistrationRequestTimeType.EXACT,
      leave_hours: +(data.leaveHours ?? 0),
      name: data.reason,
    };
  };

  const requestData = (data: LeaveRegistrationForm) => {
    const actualData = { ...data };

    if (data.requestType === LeaveRegistrationRequestTimeType.PERIOD) {
      actualData.dateTo = actualData.dateFrom;
      actualData.timeFrom = undefined;
      actualData.timeTo = undefined;
    }
    if (data.requestType === LeaveRegistrationRequestTimeType.EXACT) {
      actualData.dateTo = actualData.dateFrom;
      actualData.period = undefined;
    }
    if (data.requestType === LeaveRegistrationRequestTimeType.DATE_EXACT) {
      actualData.period = undefined;
      actualData.timeFrom = undefined;
      actualData.timeTo = undefined;
    }

    return actualData;
  };

  const createOrUpdateMutation = async (
    _: any,
    { arg }: { arg: LeaveRegistrationForm },
  ): Promise<BaseResponse<LeaveRegistration>> => {
    try {
      const response = await api.POST<BaseResponse<LeaveRegistration>>({
        path: '/api/models/hr-leave/execute/create_or_update_hr_leave',
        data: {
          kwargs: getKargs(requestData(arg)),
        },
      });
      return response;
    } catch (err: any) {
      showToast('error', err.message ?? 'Tạo đơn xin nghỉ phép thất bại');
      throw err;
    }
  };
  const createOrUpdaterSwr = useSWRMutation('get_hr_leave_details', createOrUpdateMutation);
  const _wizardLeaveDetail = async (): Promise<LeaveRegistration> => {
    try {
      const response = await api.POST({
        path: '/api/models/hr-leave-wizard/execute/get_hr_leave_details',
        data: {
          kwargs: getKargs(requestData(formValues)),
        },
      });
      return response.data?.records?.at(0);
    } catch (err: any) {
      showToast('error', err.message ?? 'Tạo đơn xin nghỉ phép thất bại');
      throw err;
    }
  };
  const { data: wizardLeaveDetail } = useSWR(
    formValues.type
      ? [
          'wizard-get_hr_leave_details',
          formValues.dateFrom,
          formValues.dateTo,
          formValues.timeFrom,
          formValues.timeTo,
          formValues.type,
          formValues.requestType,
        ]
      : null,
    _wizardLeaveDetail,
  );

  const fetchHoliday = async (): Promise<Array<Holiday>> => {
    try {
      const res = await api.POST({
        path: '/api/models/hr-leave/execute/get_holiday_status_id_and_days',
        data: {
          kwargs: {},
        },
      });
      const records = res.data?.records as Array<Holiday>;
      return records;
    } catch (err: any) {
      showToast('error', err.message ?? 'Tạo đơn xin nghỉ phép thất bại');
      throw err;
    }
  };

  const holidaySwr = useSWR(['get_holiday_status_id_and_days'], fetchHoliday);

  const fetchLeaveDetail = async (): Promise<LeaveRegistration | undefined> => {
    if (!formValues.id) {
      return;
    }
    try {
      const res = await api.POST({
        path: '/api/models/hr-leave/execute/get_hr_leave_details',
        data: {
          kwargs: {
            id: formValues.id,
          },
        },
      });
      return res.data.records[0];
    } catch (err: any) {
      console.log('Error fetching timesheet explanation:', err);
      throw err;
    }
  };

  const { data: leaveDetail, isLoading: isLeaveDetailLoading } = useSWR(
    formValues.id ? ['get_hr_leave_details', formValues.id] : null,
    fetchLeaveDetail,
  );

  const handleConfirmCancel = async () => {
    try {
      await api.POST({
        path: '/api/models/hr-leave/execute/app_approval_set_to_cancel',
        data: {
          kwargs: {
            id: formValues.id,
          },
        },
      });
    } catch (err: any) {
      console.log('Error fetching timesheet explanation:', err);
      throw err;
    }
  };

  const handleConfirmSubmit = async () => {
    try {
      await api.POST({
        path: '/api/models/hr-leave/execute/app_approval_submit',
        data: {
          kwargs: {
            id: formValues.id,
          },
        },
      });
    } catch (err: any) {
      console.log('Error fetching timesheet explanation:', err);
      throw err;
    }
  };

  const handleChangeStatus = async (_: string, { arg }: { arg: Partial<LeaveRegistration> }) => {
    if (arg.action === LeaveButtonType.ACTION_CANCEL) {
      await handleConfirmCancel();
    } else if (arg.action === LeaveButtonType.APPROVAL_SUBMIT) {
      await handleConfirmSubmit();
    }
    mutate((key) => Array.isArray(key) && key[0] === 'get_list_leaves');
  };

  const updateLeaveRegistrationSwr = useSWRMutation('get_hr_leave_details', handleChangeStatus);

  return {
    holidaySwr,
    createOrUpdaterSwr,
    wizardLeaveDetail,
    leaveDetail,
    isLeaveDetailLoading,
    updateLeaveRegistrationSwr,
  };
};
