import { BaseResponse } from 'common/model/base-response';
import { Termination, UploadImageTerminationParams } from 'common/model/termination';
import dayjs from 'dayjs';
import api from 'hooks/api';
import useSWRMutation from 'swr/mutation';
import { getRemoteFileType } from 'utils';
import { TerminationEditorState } from '../TerminationEditorState';
import useSWR from 'swr';
import { OptionItem } from 'components';

export const useTerminationEditorApi = () => {
  const employeeFetcher = async (): Promise<OptionItem[]> => {
    const response = await api.POST<BaseResponse<{ id: number; display_name: string }[]>>({
      path: '/api/models/hr-employee/execute/get_list_employee_infor',
      data: {},
    });
    return response.data?.map((it) => ({ key: it.id, value: it.display_name })) || [];
  };

  const createTerminationMutation = async (
    _: any,
    { arg }: { arg: TerminationEditorState },
  ): Promise<BaseResponse<Termination>> => {
    const response = await api.POST<BaseResponse<Termination>>({
      path: '/api/models/resignation-letter/execute/create_or_update_resignation_letter',
      data: {
        kwargs: {
          departure_reason_id: +(arg.departureReason?.key ?? 0),
          resignation_date: dayjs(arg.resignationDate).format('YYYY-MM-DD'),
          day_off: dayjs(arg.dayOff).format('YYYY-MM-DD'),
          content: arg.content,
          receiver_employee_id: +(arg.receiver?.key ?? 0),
          information: arg.information,
        },
      },
    });
    await api.POST({
      path: '/api/models/resignation-letter/execute/app_approval_submit',
      data: {
        kwargs: {
          id: response.data?.id ?? 0,
        },
      },
    });
    return response;
  };

  const uploadImageTerminationMutation = async (
    _: any,
    { arg }: { arg: UploadImageTerminationParams },
  ) => {
    const formData = new FormData();
    formData.append('res_id', arg.resId.toString());

    // Append multiple files
    arg.files.forEach((file) => {
      formData.append('files', {
        uri: file.uri,
        name: file.name,
        type: getRemoteFileType(file.type),
      } as any);
    });
    await api.POST({
      path: '/api/models/resignation-letter/upload_files/upload_attachment_file',
      data: formData,
    });
  };

  const reasonFetcher = async (): Promise<OptionItem[]> => {
    const response = await api.POST<BaseResponse<{ id: number; name: string }[]>>({
      path: '/api/models/hr-departure-reason/execute/get_infor_departure_reason',
      data: {},
    });
    return response.data?.map((it) => ({ key: it.id.toString(), value: it.name })) ?? [];
  };

  const reasonOptionsSwr = useSWR(['get_infor_departure_reason'], reasonFetcher);
  const employeeOptionsSwr = useSWR(['get_list_employee_infor'], employeeFetcher);

  const createTerminationSwr = useSWRMutation(
    ['get_resignation_letter'],
    createTerminationMutation,
  );

  const uploadImageTerminationSwr = useSWRMutation(
    ['get_resignation_letter'],
    uploadImageTerminationMutation,
  );
  return {
    reasonOptionsSwr,
    createTerminationSwr,
    uploadImageTerminationSwr,
    employeeOptionsSwr,
  };
};
