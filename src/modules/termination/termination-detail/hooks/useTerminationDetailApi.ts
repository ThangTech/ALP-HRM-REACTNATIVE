import { TerminationButtonType } from 'common/enum/termination-button-type';
import { Termination, UploadImageTerminationParams } from 'common/model/termination';
import api from 'hooks/api';
import { getRemoteFileType } from 'utils';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { TerminationDetailState } from '../TerminationDetailState';
import { ApprovalProgress } from 'common/model/approval_progress';
import { BaseResponse } from 'common/model/base-response';

export const useTerminationDetailApi = (state: TerminationDetailState) => {
  const terminationFetcher = async (): Promise<Termination | undefined> => {
    if (!state.id) {
      return;
    }
    const response = await api.POST({
      path: '/api/models/resignation-letter/execute/get_resignation_letter_details',
      data: {
        kwargs: {
          id: state.id,
        },
      },
    });
    return response.data.records[0];
  };

  const _fetchHistory = async (): Promise<BaseResponse<ApprovalProgress> | undefined> => {
    if (!state.id) {
      return;
    }
    try {
      const res = await api.POST<BaseResponse<ApprovalProgress>>({
        path: '/api/models/resignation-letter/execute/get_resignation_letter_approval_progress',
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

  const handleAction = async (_: any, { arg }: { arg: Partial<Termination> }) => {
    let endPoint = '';
    switch (arg.button) {
      case TerminationButtonType.APPROVE_SUBMIT:
        endPoint = 'app_approval_submit';
        break;
      case TerminationButtonType.APPROVE_ACCEPT:
        endPoint = 'app_approval_accept';
        break;

      case TerminationButtonType.BTN_TO_DRAFT:
        endPoint = 'app_btn_to_draft';
        break;

      case TerminationButtonType.BTN_CANCEL:
        endPoint = 'app_btn_cancel';
        break;

      case TerminationButtonType.APPROVE_REJECT:
        await api.POST<BaseResponse<Termination>>({
          path: '/api/models/resignation-letter/execute/create_or_update_resignation_letter',
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
      path: `/api/models/resignation-letter/execute/${endPoint}`,
      data: {
        kwargs: {
          id: state.id,
        },
      },
    });
  };

  const handleDeleteFile = async (_: any, { arg }: { arg: { attachment_id: number } }) => {
    return api.POST<BaseResponse<any>>({
      path: '/api/models/resignation-letter/execute/delete_attachment_file',
      data: {
        kwargs: {
          letter_id: state.id,
          attachment_id: arg.attachment_id,
        },
      },
    });
  };

  const uploadImageTerminationMutation = async (
    _: any,
    { arg }: { arg: UploadImageTerminationParams },
  ) => {
    const formData = new FormData();
    formData.append('res_id', arg.resId.toString());
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

  const terminationSwr = useSWR(['get_resignation_letter_details', state.id], terminationFetcher);

  const { data: histories } = useSWR(
    ['get_resignation_letter_approval_progress', state.id],
    _fetchHistory,
  );

  const terminationActionSwr = useSWRMutation(
    ['get_resignation_letter_details', state.id],
    handleAction,
  );

  const deleteFileSwr = useSWRMutation(
    ['get_resignation_letter_details', state.id],
    handleDeleteFile,
  );

  const uploadImageTerminationSwr = useSWRMutation(
    ['get_resignation_letter_details', state.id],
    uploadImageTerminationMutation,
  );

  return {
    terminationSwr,
    terminationActionSwr,
    histories,
    deleteFileSwr,
    uploadImageTerminationSwr,
  };
};
