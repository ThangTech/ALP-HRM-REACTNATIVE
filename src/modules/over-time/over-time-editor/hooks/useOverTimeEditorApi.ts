import { LeaveButtonType } from 'common/enum/leave-registration-status';
import { OverTimeRequestTime } from 'common/enum/over-time-request-time';
import { ApprovalProgress } from 'common/model/approval_progress';
import { BaseResponse, BaseResponsePagination } from 'common/model/base-response';
import { Holiday, LeaveRegistration } from 'common/model/leave-registration';
import { OverTime } from 'common/model/over-time';
import { OptionItem, showToast } from 'components';
import { UploadedFile } from 'components/file-upload/useUploadFile';
import dayjs from 'dayjs';
import api from 'hooks/api';
import useDebounce from 'hooks/useDebounce';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import useAppContext from 'hooks/useAppContext';
import { getRemoteFileType, timeToHours } from 'utils';
import { OverTimeEditorState } from '../OverTimeEditorState';
import { OverTimeEditorForm } from '../provider';

export const useOverTimeEditorApi = (
  state: OverTimeEditorState,
  formValues: OverTimeEditorForm,
  files: UploadedFile[],
) => {
  const app = useAppContext();
  const dependencyWizard = [
    'wizard-get_hr_leave_overtime_details',
    formValues.requestDate,
    formValues.requestFromTime,
    formValues.requestToTime,
    formValues.type,
    formValues.overtimeType,
    formValues.employee?.key,
    formValues.percent,
    formValues.timeRest,
    formValues.shift?.key,
  ];
  const debounceWizard = useDebounce(`${JSON.stringify(dependencyWizard)}`);
  const fetchEmployee = async (): Promise<OptionItem[]> => {
    const response = await api.POST<BaseResponse<{ id: number; display_name: string }[]>>({
      path: '/api/models/hr-employee/execute/get_list_employee_infor',
      data: {
        context: {
          company_id: app.current_company_id,
          allowed_company_ids: app.current_company_id ? [app.current_company_id] : [],
        },
      },
    });
    return response.data?.map((it) => ({ key: it.id, value: it.display_name })) || [];
  };

  const _fetchTypesOT = async (): Promise<OptionItem[]> => {
    const res = await api.POST({
      path: '/api/models/hr-leave/execute/get_overtime_holiday_status_id',
      data: {
        kwargs: {},
      },
    });
    const records = res.data?.records as Array<Holiday>;
    return records.map((it) => ({
      key: it.holiday_status_id.toString(),
      value: it.holiday_status_name,
    }));
  };

  const _fetchDetail = async (): Promise<OverTime | undefined> => {
    const res = await api.POST<BaseResponse<BaseResponsePagination<OverTime>>>({
      path: '/api/models/hr-leave/execute/get_overtime_register_details',
      data: {
        kwargs: {
          id: state.id,
        },
      },
    });
    const record = res.data?.records?.at(0);
    return record;
  };

  const _getKwargs = () => {
    const isTimeCustom = formValues.requestTimeType?.key === OverTimeRequestTime.TIME_CUSTOM;
    const _from = dayjs(formValues.requestFromTime);
    const _to = dayjs(formValues.requestToTime);
    const fromTime = isTimeCustom
      ? dayjs(formValues.requestDate)
          .set('hour', _from.get('hour'))
          .set('minute', _from.get('minute'))
      : _from;
    const toTime = isTimeCustom
      ? dayjs(formValues.requestDate).set('hour', _to.get('hour')).set('minute', _to.get('minute'))
      : _to;
    return {
      employee_id: formValues.employee?.key ? +formValues.employee.key : undefined,
      coefficient: formValues.percent ? +formValues.percent : undefined,
      holiday_status_id: formValues.type?.key ? +formValues.type.key : undefined,
      overtime_type: formValues.overtimeType?.key,
      request_date_from: fromTime.format('YYYY-MM-DD'),
      request_date_to: toTime.format('YYYY-MM-DD'),
      request_hour_from: isTimeCustom ? timeToHours(fromTime.format('HH:mm')) : undefined,
      request_hour_to: isTimeCustom ? timeToHours(toTime.format('HH:mm')) : undefined,
      hours_of_break: formValues.timeRest ? +formValues.timeRest : undefined,
      request_unit_hours: isTimeCustom,
      name: formValues.reason,
      resource_calendar_id: formValues.shift?.key ? +formValues.shift.key : undefined,
      id: state.id,
    };
  };

  const _wizardLeaveDetail = async (): Promise<OverTime | undefined> => {
    try {
      const response = await api.POST({
        path: '/api/models/hr-leave-wizard/execute/get_overtime_register_details',
        data: {
          kwargs: _getKwargs(),
        },
      });
      return response.data?.records?.at(0);
    } catch (err: any) {
      showToast('error', err.message || 'Đã có lỗi xảy ra');
      throw err;
    }
  };

  const _handleDeleteFile = async (
    _: any,
    { arg }: { arg: { id: number; attachment_id: number } },
  ) => {
    return api.POST<BaseResponse<any>>({
      path: '/api/models/hr-leave/execute/delete_att_file',
      data: {
        kwargs: {
          id: arg.id,
          attachment_id: arg.attachment_id,
        },
      },
    });
  };

  const _handleUpload = async (resId: number) => {
    if (!files.length) {
      return;
    }
    const form = new FormData();
    form.append('res_id', resId.toString());
    for (const it of files) {
      form.append('files', {
        uri: it.uri,
        name: it.name,
        type: getRemoteFileType(it.type),
      } as any);
    }
    await api.POST<{ data: any }>({
      path: '/api/models/hr-leave/upload_files/attach_files',
      data: form,
    });
  };

  const _handleCreateOrUpdate = async (_: any) => {
    const response = await api.POST({
      path: '/api/models/hr-leave/execute/create_or_update_overtime_register',
      data: {
        kwargs: _getKwargs(),
      },
    });
    const id = response.data?.id;
    if (id) {
      await _handleUpload(id);
    }
    return response;
  };

  const _handleAction = async (_: any, { arg }: { arg: Partial<LeaveRegistration> }) => {
    let endPoint = '';
    switch (arg.action) {
      case LeaveButtonType.APPROVAL_SUBMIT:
        await _handleCreateOrUpdate('');
        endPoint = 'app_approval_submit';
        break;
      case LeaveButtonType.APPROVAL_ACCEPT:
        await _handleCreateOrUpdate('');
        endPoint = 'app_approval_accept';
        break;

      case LeaveButtonType.APPROVAL_SET_TO_DRAFT:
        endPoint = 'app_approval_set_to_draft';
        break;

      case LeaveButtonType.ACTION_CANCEL:
        endPoint = 'app_approval_set_to_cancel';
        break;

      case LeaveButtonType.APPROVAL_REJECT:
        await api.POST({
          path: '/api/models/hr-leave/execute/create_or_update_overtime_register',
          data: {
            kwargs: {
              id: state.id,
              reject_reason: arg.reject_reason || undefined,
            },
          },
        });
        endPoint = 'app_approval_reject';
        break;
    }

    await api.POST({
      path: `/api/models/hr-leave/execute/${endPoint}`,
      data: {
        kwargs: {
          id: state.id,
        },
      },
    });
  };

  const { data: workShiftList } = useSWR(['workShiftList'], async (): Promise<OptionItem[]> => {
    const res = await api.POST({
      path: '/api/models/resource-calendar/execute/get_infor_calendar',
      data: {
        context: {
          company_id: app.current_company_id,
          allowed_company_ids: app.current_company_id ? [app.current_company_id] : [],
        },
      },
    });
    if (res?.data) {
      const temp = res.data.map((item: any) => ({
        key: item.id.toString(),
        value: item.display_name,
      }));
      return temp;
    }
    return [];
  });

  const _fetchHistory = async (): Promise<BaseResponse<ApprovalProgress> | undefined> => {
    if (!state.id) {
      return;
    }
    try {
      const res = await api.POST<BaseResponse<ApprovalProgress>>({
        path: '/api/models/hr-leave/execute/get_hr_leave_approval_progress',
        data: {
          kwargs: {
            id: state.id,
          },
        },
      });
      return res;
    } catch (err: any) {
      console.log('Error fetching timesheet explanation:', err);
      throw err;
    }
  };
  const { data: histories } = useSWR(['get_hr_leave_approval_progress', state.id], _fetchHistory);

  const { data: employeeOptions } = useSWR(
    ['get_list_employee_infor', app.current_company_id],
    fetchEmployee,
  );
  const { data: holidayOptions } = useSWR(['get_types_ot'], _fetchTypesOT);
  const { data: overTimeDetail } = useSWR(
    state.id ? ['get_over_time_detail', state.id] : null,
    _fetchDetail,
  );
  const { trigger: triggerUpdate, isMutating: isUpdating } = useSWRMutation(
    'update-over-time-detail',
    _handleAction,
  );
  const { trigger: createOrUpdate, isMutating: isCreateOrUpdating } = useSWRMutation(
    ['create-or-update-over-time-detail', formValues, state.id],
    _handleCreateOrUpdate,
  );

  const { trigger: deleteFile, isMutating: isDeletingFile } = useSWRMutation(
    ['delete-over-time-file', formValues, state.id],
    _handleDeleteFile,
  );

  const { data: wizardLeaveDetail, isLoading: isWizardLeaveDetailLoading } = useSWR(
    debounceWizard && (!state.id || (state.id && formValues?.id)) ? debounceWizard : null,
    _wizardLeaveDetail,
  );

  return {
    employeeOptions,
    holidayOptions: holidayOptions,
    wizardLeaveDetail: wizardLeaveDetail,
    isWizardLeaveDetailLoading,
    overTimeDetail,
    triggerUpdate,
    isUpdating,
    createOrUpdate,
    isCreateOrUpdating,
    deleteFile,
    isDeletingFile,
    workShiftList,
    histories,
  };
};
