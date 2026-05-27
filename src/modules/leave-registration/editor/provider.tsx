import {
  LeaveRegistrationPeriod,
  LeaveRegistrationRequestTimeType,
} from 'common/enum/leave-registration-period';
import { LeaveRegistration } from 'common/model/leave-registration';
import { OptionItem, showToast } from 'components';
import dayjs from 'dayjs';
import React, { createContext, ReactElement, useContext, useEffect, useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { getLocaleDurationDisplay, timeToHours } from 'utils';
import { useLeaveRegistrationApi } from './hooks/useLeaveRegistrationApi';
import { LeaveRegistrationEditorState } from './LeaveRegistrationEditorState';
import { goBack } from 'navigators';

const LeaveRegistrationEditorContext = createContext<LeaveRegistrationEditorType>(null!);

interface LeaveRegistrationEditorType {
  state: LeaveRegistrationEditorState;
  form: UseFormReturn<LeaveRegistrationForm>;
  onSubmit: (data: LeaveRegistrationForm) => Promise<void>;
  leaveDetail?: LeaveRegistration;
  handleChangeStatus: (data: Partial<LeaveRegistration>) => Promise<void>;
}

export function useLeaveRegistrationEditorProvider() {
  return useContext(LeaveRegistrationEditorContext);
}

export interface LeaveRegistrationForm {
  id?: number;
  type?: string;
  requestType?: LeaveRegistrationRequestTimeType;
  dateFrom?: string;
  dateTo?: string;
  timeFrom?: string;
  timeTo?: string;
  leaveHours?: string;
  period?: LeaveRegistrationPeriod;
  reason?: string;
  durationDisplay?: string;
}

interface LeaveRegistrationEditorProviderProps {
  children: ReactElement;
  id?: number;
  date?: string;
}

export function LeaveRegistrationEditorProvider({
  children,
  id,
  date,
}: LeaveRegistrationEditorProviderProps) {
  const [state, setState] = useState<LeaveRegistrationEditorState>({
    requestTimeOptions: [
      { key: LeaveRegistrationRequestTimeType.DATE_EXACT, value: 'Ngày tuỳ chỉnh' },
      { key: LeaveRegistrationRequestTimeType.EXACT, value: 'Giờ tuỳ chỉnh' },
      { key: LeaveRegistrationRequestTimeType.PERIOD, value: 'Nửa ngày' },
    ],
    leaveRegistrationPeriodOptions: [
      { key: LeaveRegistrationPeriod.AM, value: 'Sáng' },
      { key: LeaveRegistrationPeriod.PM, value: 'Chiều' },
    ],
  });
  const form = useForm<LeaveRegistrationForm>({
    mode: 'onChange',
    defaultValues: {
      id: id,
      requestType: LeaveRegistrationRequestTimeType.DATE_EXACT,
      dateFrom: dayjs(date).subtract(2, 'hour').toDate().toString(),
      dateTo: dayjs(date).toDate().toString(),
      timeFrom: dayjs(date).subtract(2, 'hour').toDate().toString(),
      timeTo: dayjs(date).toDate().toString(),
      period: LeaveRegistrationPeriod.AM,
    },
  });
  const formValues = form.watch();
  const leaveRegistrationApi = useLeaveRegistrationApi(formValues);
  const records = leaveRegistrationApi.holidaySwr.data;

  const onSubmit = async (data: LeaveRegistrationForm): Promise<void> => {
    try {
      const response = await leaveRegistrationApi.createOrUpdaterSwr.trigger(data);
      form.setValue('id', response.data?.id);
    } catch (err: any) {
      showToast('error', err.message ?? 'Tạo đơn xin nghỉ phép thất bại');
      throw err;
    }
  };

  const handleChangeStatus = async (data: Partial<LeaveRegistration>): Promise<void> => {
    try {
      await leaveRegistrationApi.createOrUpdaterSwr.trigger(formValues);
      await leaveRegistrationApi.updateLeaveRegistrationSwr.trigger(data);
      goBack();
    } catch (err: any) {
      showToast('error', err.message ?? 'Tạo đơn xin nghỉ phép thất bại');
      throw err;
    }
  };

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      leaveRegistrationTypes: records?.map(
        (it) =>
          ({
            key: it.holiday_status_id.toString(),
            value: it.holiday_status_name,
            data: it,
          }) as OptionItem,
      ),
    }));
  }, [records]);

  useEffect(() => {
    const durationDisplay = leaveRegistrationApi.wizardLeaveDetail?.duration_display;

    if (durationDisplay) {
      const viDurationDisplay = getLocaleDurationDisplay(durationDisplay);
      const durationNumber = timeToHours(viDurationDisplay);

      form.setValue('durationDisplay', viDurationDisplay);
      form.setValue('leaveHours', durationNumber.toFixed(2));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leaveRegistrationApi.wizardLeaveDetail?.duration_display]);

  useEffect(() => {
    if (!leaveRegistrationApi.leaveDetail) {
      return;
    }
    const detail = leaveRegistrationApi.leaveDetail;
    let requestType = LeaveRegistrationRequestTimeType.DATE_EXACT;
    if (detail.request_unit_half) {
      requestType = LeaveRegistrationRequestTimeType.PERIOD;
    } else if (detail.request_unit_hours) {
      requestType = LeaveRegistrationRequestTimeType.EXACT;
    }

    form.reset({
      id: detail.id,
      type: detail.holiday_status_id.toString(),
      requestType: requestType,
      dateFrom: detail.date_from,
      dateTo: detail.date_to,
      timeFrom: detail.date_from ? detail.date_from : '',
      timeTo: detail.date_to ? detail.date_to : '',
      leaveHours: detail.leave_hours.toString(),
      period: detail.request_date_from_period,
      reason: detail.name || detail.reason,
      durationDisplay: getLocaleDurationDisplay(detail.duration_display),
    });
  }, [form, leaveRegistrationApi.leaveDetail]);

  const value = {
    form,
    state,
    onSubmit,
    wizardLeaveDetail: leaveRegistrationApi.wizardLeaveDetail,
    leaveDetail: leaveRegistrationApi.leaveDetail,
    handleChangeStatus,
  };
  return (
    <LeaveRegistrationEditorContext.Provider value={value}>
      {children}
    </LeaveRegistrationEditorContext.Provider>
  );
}
