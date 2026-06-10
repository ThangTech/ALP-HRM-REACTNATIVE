import { ApprovalProgress } from 'common/model/approval_progress';
import { BaseResponse } from 'common/model/base-response';
import { CreationModel } from 'common/model/creation-model';
import { showToast } from 'components';
import api from 'hooks/api';
import useAppContext from 'hooks/useAppContext';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

type Props = {
  id?: number;
};

const useTimesheetExplanationDetail = (props: Props) => {
  const { id } = props;
  const app = useAppContext();

  const { data: explanationTypeList } = useSWR<ExplanationReasonType[]>(
    ['explanationTypeList'],
    async () => {
      const res = await api.POST({
        path: '/api/models/hr-attendance-explanation/execute/get_infor_explanation_reason',
        data: {},
      });
      if (res?.data) {
        return res.data;
      }
      return [];
    },
  );

  const { data: timesheetExplanationDetail, mutate: timesheetExplanationDetailMutate } =
    useSWR<TimesheetExplanationDetail>(id ? ['timesheetExplanationDetail', id] : null, async () => {
      const res = await api.POST({
        path: '/api/models/hr-attendance-explanation/execute/get_attendance_explanation_details',
        data: {
          kwargs: {
            explanation_id: id,
          },
        },
      });
      if (res?.data?.records) {
        return res.data.records[0];
      }
      return undefined;
    });

  const { data: histories } = useSWR(
    id ? ['get_attendance_explanation_approval_progress', id] : null,
    async (): Promise<BaseResponse<ApprovalProgress> | undefined> => {
      if (!id) {
        return;
      }
      const res = await api.POST<BaseResponse<ApprovalProgress>>({
        path: '/api/models/hr-attendance-explanation/execute/get_attendance_explanation_approval_progress',
        data: {
          kwargs: {
            id: id,
          },
        },
      });
      return res;
    },
  );

  const {
    data: calculateInformation,
    trigger: calculateInformationTrigger,
    isMutating: calculateInformationLoading,
  } = useSWRMutation(
    'calculateInformation',
    async (
      _,
      { arg }: { arg: Partial<TimesheetExplanationDetail> },
    ): Promise<CalculateInformation | undefined> => {
      try {
        const res = await api.POST({
          path: '/api/models/hr-attendance-explanation-wizard/execute/get_attendance_explanation',
          data: {
            kwargs: arg,
          },
        });
        if (res?.data) {
          return res.data;
        }
      } catch (error: any) {
        showToast('error', error.message);
        console.log(error, 'error');
      }
    },
  );

  const { data: workShiftList } = useSWR(['workShiftList', id], async () => {
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

  const { trigger: createUpdate, isMutating: createUpdateLoading } = useSWRMutation(
    ['createTimesheetExplanation'],
    async (_, { arg }: { arg: Partial<TimesheetExplanationDetail> }) => {
      try {
        const res = await api.POST({
          path: '/api/models/hr-attendance-explanation/execute/create_or_update_explanation',
          data: {
            kwargs: arg,
          },
        });
        if (res?.data) {
          return res.data;
        }
        return null;
      } catch (error: any) {
        console.log(error, 'error');
        showToast('error', error.message);
      }
    },
  );

  const { trigger: approvalSubmit, isMutating: approvalSubmitting } = useSWRMutation(
    ['createTimesheetExplanation'],
    async (_, { arg }: { arg: Partial<TimesheetExplanationDetail> }) => {
      try {
        const res = await api.POST({
          path: '/api/models/hr-attendance-explanation/execute/app_approval_submit',
          data: {
            kwargs: {
              id: arg.id,
            },
          },
        });
        if (res?.data) {
          return res.data;
        }
        return null;
      } catch (error: any) {
        console.log(error, 'error');
        showToast('error', error.message);
      }
    },
  );

  const { trigger: approve, isMutating: approveLoading } = useSWRMutation(
    ['approveTimesheetExplanation'],
    async (_, { arg }: { arg: { explanation_id: number } }) => {
      try {
        const res = await api.POST({
          path: '/api/models/hr-attendance-explanation/execute/app_approval_accept',
          data: {
            kwargs: {
              id: arg.explanation_id,
            },
          },
        });
        if (res?.data) {
          showToast('success', 'Phê duyệt thành công');
          timesheetExplanationDetailMutate();
          return res.data;
        }
        return null;
      } catch (error: any) {
        console.log(error, 'error');
        showToast('error', error.message || 'Phê duyệt thất bại');
        throw error;
      }
    },
  );

  const { trigger: reject, isMutating: rejectLoading } = useSWRMutation(
    ['rejectTimesheetExplanation'],
    async (_, { arg }: { arg: { explanation_id: number; reject_reason: string } }) => {
      try {
        await api.POST({
          path: '/api/models/hr-attendance-explanation/execute/create_or_update_explanation',
          data: {
            kwargs: {
              id: arg.explanation_id,
              reject_reason: arg.reject_reason,
            },
          },
        });
        const res = await api.POST({
          path: '/api/models/hr-attendance-explanation/execute/app_approval_reject',
          data: {
            kwargs: {
              id: arg.explanation_id,
            },
          },
        });
        if (res?.data) {
          await timesheetExplanationDetailMutate();
          return res.data;
        }
        return null;
      } catch (error: any) {
        console.log(error, 'error');
        showToast('error', error.message || 'Từ chối thất bại');
        throw error;
      }
    },
  );

  const { trigger: moveToDraft, isMutating: moveToDraftLoading } = useSWRMutation(
    ['moveToDraftTimesheetExplanation'],
    async (_, { arg }: { arg: { explanation_id: number } }) => {
      try {
        const res = await api.POST({
          path: '/api/models/hr-attendance-explanation/execute/app_draft',
          data: {
            kwargs: {
              id: arg.explanation_id,
            },
          },
        });
        if (res?.data) {
          await timesheetExplanationDetailMutate();
          return res.data;
        }
        return null;
      } catch (error: any) {
        console.log(error, 'error');
        showToast('error', error.message || 'Chuyển về nháp thất bại');
        throw error;
      }
    },
  );

  const { trigger: uploadFiles, isMutating: uploadFilesLoading } = useSWRMutation(
    ['uploadTimesheetExplanationFiles'],
    async (
      _,
      { arg }: { arg: { res_id: number; files: { uri: string; name: string; type: string }[] } },
    ) => {
      try {
        const formData = new FormData();
        formData.append('res_id', arg.res_id.toString());

        // Append multiple files
        arg.files.forEach((file) => {
          formData.append('files', {
            uri: file.uri,
            name: file.name,
            type: file.type,
          } as any);
        });

        const res = await api.POST({
          path: '/api/models/hr-attendance-explanation/upload_files/attach_files',
          data: formData,
          options: {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        });

        if (res?.data) {
          await timesheetExplanationDetailMutate();
          return res.data;
        }
        return null;
      } catch (error: any) {
        console.log(error, 'error');
        showToast('error', error.message || 'Upload file thất bại');
        throw error;
      }
    },
  );

  const { trigger: deleteFile, isMutating: deleteFileLoading } = useSWRMutation(
    ['deleteTimesheetExplanationFile'],
    async (_, { arg }: { arg: { explanation_id?: number; attachment_id?: number } }) => {
      try {
        const res = await api.POST({
          path: '/api/models/hr-attendance-explanation/execute/delete_explanation_file',
          data: {
            kwargs: {
              explanation_id: arg.explanation_id,
              attachment_id: arg.attachment_id,
            },
          },
        });
        if (res?.data?.success) {
          await timesheetExplanationDetailMutate();
          showToast('success', 'Xóa file thành công');
          return res.data;
        } else {
          throw new Error(res?.data.message || 'Xóa file thất bại');
        }
      } catch (error: any) {
        console.log(error, 'error');
        showToast('error', error.message || 'Xóa file thất bại');
        throw error;
      }
    },
  );

  const _fetchCreateDate = () => {
    return api.POST<BaseResponse<CreationModel>>({
      path: '/api/models/hr-attendance-explanation/execute/get_create_date_infor',
      data: {
        kwargs: {
          rec_id: id,
        },
      },
    });
  };

  const { data: createDateInfo } = useSWR(
    id ? ['hr-attendance-explanation/execute/get_create_date_infor', id] : null,
    _fetchCreateDate,
  );

  return [
    {
      get explanationTypeList() {
        return explanationTypeList;
      },
      get histories() {
        return histories;
      },
      get timesheetExplanationDetail() {
        return timesheetExplanationDetail;
      },
      get calculateInformation() {
        return calculateInformation;
      },
      get calculateInformationLoading() {
        return calculateInformationLoading;
      },
      get workShiftList() {
        return workShiftList;
      },
      get createUpdateLoading() {
        return createUpdateLoading;
      },
      get approvalSubmitting() {
        return approvalSubmitting;
      },
      get approveLoading() {
        return approveLoading;
      },
      get rejectLoading() {
        return rejectLoading;
      },
      get moveToDraftLoading() {
        return moveToDraftLoading;
      },
      get uploadFilesLoading() {
        return uploadFilesLoading;
      },
      get deleteFileLoading() {
        return deleteFileLoading;
      },
      get createDateInfo() {
        return createDateInfo;
      },
    },
    {
      calculateInformationTrigger,
      createUpdate,
      approvalSubmit,
      approve,
      reject,
      moveToDraft,
      uploadFiles,
      deleteFile,
    },
  ] as const;
};

export default useTimesheetExplanationDetail;
