import { OverTimeRequestTime } from 'common/enum/over-time-request-time';
import { OverTimeType } from 'common/enum/over-time-type';
import { ApprovalProgress } from 'common/model/approval_progress';
import { BaseResponse } from 'common/model/base-response';
import { LeaveRegistration } from 'common/model/leave-registration';
import { OverTime } from 'common/model/over-time';
import { OptionItem, showToast } from 'components';
import {
  UploadedFile,
  UseUploadFileReturn,
  useUploadFile,
} from 'components/file-upload/useUploadFile';
import dayjs from 'dayjs';
import useAppContext from 'hooks/useAppContext';
import { goBack } from 'navigators';
import React, { ReactElement, createContext, useContext, useEffect, useState } from 'react';
import { UseFormReturn, useForm } from 'react-hook-form';
import { getLocalFileType, getLocaleDurationDisplay } from 'utils';
import { OverTimeEditorState } from './OverTimeEditorState';
import { useOverTimeEditorApi } from './hooks/useOverTimeEditorApi';

const OverTimeEditorContext = createContext<OverTimeEditorType>(null!);

interface OverTimeEditorType {
  form: UseFormReturn<OverTimeEditorForm>;
  onSubmit: (data: OverTimeEditorForm) => Promise<void>;
  employeeOptions?: OptionItem[];
  holidayOptions?: OptionItem[];
  state: OverTimeEditorState;
  setState: (state: OverTimeEditorState) => void;
  uploadFile: UseUploadFileReturn;
  triggerUpdate: (data: Partial<LeaveRegistration>) => Promise<void>;
  deleteFile: (file: UploadedFile) => Promise<void>;
  isDeletingFile: boolean;
  createOrUpdate: () => Promise<void>;
  isCreateOrUpdating: boolean;
  workShiftList?: OptionItem[];
  overTimeDetail?: OverTime;
  histories?: BaseResponse<ApprovalProgress>;
  isUpdating: boolean;
}

export interface OverTimeEditorForm {
  id?: number;
  title?: string;
  shift?: OptionItem;
  employee?: OptionItem;
  requestTimeType?: OptionItem;
  type?: OptionItem;
  overtimeType?: OptionItem;
  requestDate?: Date;
  requestFromTime?: Date;
  requestToTime?: Date;
  totalTimeRegistered?: string;
  timeRest: string;
  totalTimeOverTime?: string;
  percent?: string;
  reason?: string;
  autoFillCoefficient?: boolean;
}

export function useOverTimeEditorProvider() {
  return useContext(OverTimeEditorContext);
}

export function OverTimeEditorProvider({ children, id }: { children: ReactElement; id?: number }) {
  const { user } = useAppContext();
  const uploadFile = useUploadFile();
  const [state, setState] = useState<OverTimeEditorState>({
    id: id,
    overTimeTypes: [
      { key: OverTimeType.OPENING, value: 'Khai trương' },
      { key: OverTimeType.PROMOTION, value: 'Khuyến mãi' },
      { key: OverTimeType.INVENTORY, value: 'Kiểm kê' },
      { key: OverTimeType.OVERTIME, value: 'Tăng ca' },
    ],
    requestTimeTypes: [
      { key: OverTimeRequestTime.DATE_CUSTOM, value: 'Ngày tùy chỉnh' },
      { key: OverTimeRequestTime.TIME_CUSTOM, value: 'Giờ tùy chỉnh' },
    ],
  });
  const form = useForm<OverTimeEditorForm>({
    mode: 'onChange',
    defaultValues: {
      employee: {
        value: `[${user?.employee_code}] ${user?.name || ''}`,
        key: user?.employee_id || '',
      },
      requestTimeType: state.requestTimeTypes?.[0],
      requestDate: new Date(),
      requestFromTime: new Date(),
      requestToTime: new Date(),
      autoFillCoefficient: false,
    },
  });
  const values = form.watch();
  const overTimeEditorApi = useOverTimeEditorApi(state, values, uploadFile.uploadedFiles);

  const onSubmit = async (_data: OverTimeEditorForm): Promise<void> => {
    try {
      await overTimeEditorApi.createOrUpdate();
      goBack();
    } catch (err: any) {
      showToast('error', err.message || 'Đã có lỗi xảy ra');
    }
  };

  const triggerUpdate = async (data: Partial<LeaveRegistration>) => {
    try {
      await overTimeEditorApi.triggerUpdate(data);
      goBack();
    } catch (err: any) {
      showToast('error', err.message || 'Đã có lỗi xảy ra');
    }
  };

  const handleDeleteFile = async (file: UploadedFile) => {
    try {
      const response = await overTimeEditorApi.deleteFile({
        id: state.id!,
        attachment_id: +file.id,
      });
      if (!response.data.success) {
        showToast('error', response.data?.message || 'Đã có lỗi xảy ra');
      }
      console.log(response);
    } catch (err: any) {
      showToast('error', err.message || 'Đã có lỗi xảy ra');
    }
  };

  useEffect(() => {
    if (!overTimeEditorApi.holidayOptions?.length) {
      return;
    }
    form.setValue('type', overTimeEditorApi.holidayOptions?.[0]);
  }, [form, overTimeEditorApi.holidayOptions]);

  useEffect(() => {
    if (!overTimeEditorApi.wizardLeaveDetail) {
      return;
    }
    if (!form.getValues('timeRest')?.length) {
      form.setValue('timeRest', overTimeEditorApi.wizardLeaveDetail.hours_of_break.toString());
    }

    if (form.getValues('autoFillCoefficient')) {
      form.setValue('percent', overTimeEditorApi.wizardLeaveDetail.coefficient.toString());
    }

    form.setValue(
      'totalTimeRegistered',
      getLocaleDurationDisplay(overTimeEditorApi.wizardLeaveDetail.duration_display ?? ''),
    );

    form.setValue(
      'totalTimeOverTime',
      overTimeEditorApi.wizardLeaveDetail.hours_overtime.toFixed(2),
    );
  }, [form, overTimeEditorApi.wizardLeaveDetail]);

  useEffect(() => {
    const detail = overTimeEditorApi.overTimeDetail;
    if (!detail) {
      return;
    }
    form.reset({
      id: detail.id,
      employee: {
        key: detail.employee_id,
        value: `[${detail.employee_code}] ${detail.employee_name}`,
      },
      type: { key: detail.holiday_status_id, value: detail.holiday_status_name },
      overtimeType: { key: detail.overtime_type, value: detail.label_overtime_type || '' },
      requestDate: dayjs(detail.date_from).toDate(),
      requestFromTime: dayjs(detail.date_from).toDate(),
      requestToTime: dayjs(detail.date_to).toDate(),
      percent: detail.coefficient?.toString(),
      timeRest: detail.hours_of_break?.toString(),
      requestTimeType: detail.request_unit_hours
        ? state.requestTimeTypes?.at(1)
        : state.requestTimeTypes?.at(0),
      totalTimeOverTime: detail.hours_overtime?.toString(),
      totalTimeRegistered: getLocaleDurationDisplay(detail.duration_display || ''),
      reason: detail.name,
      autoFillCoefficient: false,
    });
    uploadFile.setUploadedFiles(
      detail.result_files?.map((file) => ({
        id: file.id.toString(),
        name: file.name,
        uri: file.download_url,
        type: getLocalFileType(file.mimetype),
      })) ?? [],
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overTimeEditorApi.overTimeDetail]);

  useEffect(() => {
    const resourceCalendarId = overTimeEditorApi.overTimeDetail?.resource_calendar_id;
    if (!resourceCalendarId) {
      return;
    }
    const shift = overTimeEditorApi.workShiftList?.find(
      (item) => +item.key === resourceCalendarId,
    ) ?? {
      key: resourceCalendarId.toString(),
      value: overTimeEditorApi.overTimeDetail?.resource_calendar_name || '',
    };
    form.setValue('shift', shift);
  }, [
    overTimeEditorApi.overTimeDetail?.resource_calendar_id,
    overTimeEditorApi.workShiftList,
    overTimeEditorApi.overTimeDetail,
    form,
  ]);
  const value = {
    form,
    onSubmit,
    employeeOptions: overTimeEditorApi.employeeOptions,
    holidayOptions: overTimeEditorApi.holidayOptions,
    state,
    setState,
    uploadFile,
    triggerUpdate,
    deleteFile: handleDeleteFile,
    isDeletingFile: overTimeEditorApi.isDeletingFile,
    createOrUpdate: overTimeEditorApi.createOrUpdate,
    isCreateOrUpdating: overTimeEditorApi.isCreateOrUpdating,
    workShiftList: overTimeEditorApi.workShiftList,
    overTimeDetail: overTimeEditorApi.overTimeDetail,
    histories: overTimeEditorApi.histories,
    isUpdating: overTimeEditorApi.isWizardLeaveDetailLoading,
  };
  return <OverTimeEditorContext.Provider value={value}>{children}</OverTimeEditorContext.Provider>;
}
