import { useMemo } from 'react';
import api from 'hooks/api';
import useAppContext from 'hooks/useAppContext';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { showToast } from 'components';
import { OptionItem } from 'components';

export interface ApprovalCategory {
  id: number;
  name: string;
  code: string;
  description: string;
  requirer_document: 'optional' | 'required' | 'no';
  has_partner: 'optional' | 'required' | 'no';
  has_date: 'optional' | 'required' | 'no';
  has_period: 'optional' | 'required' | 'no';
  has_product: 'optional' | 'required' | 'no';
  has_quantity: 'optional' | 'required' | 'no';
  has_amount: 'optional' | 'required' | 'no';
  has_reference: 'optional' | 'required' | 'no';
  has_location: 'optional' | 'required' | 'no';
  has_reference_request: 'optional' | 'required' | 'no';
  has_refund_status: 'optional' | 'required' | 'no';
  company_id?: { id: number; name: string } | false;
}

export interface ApprovalUser {
  id: number;
  name: string;
}

export interface ApprovalApprover {
  user_id: number;
  required: boolean;
}

export interface CreateApprovalPayload {
  category_id: number;
  name: string;
  description?: string;
  approvers?: { user_id: number; required: boolean }[];
  documents?: {
    name: string;
    note?: string;
    attachment_ids: number[];
  }[];
  partner_name?: string;
  date?: string;
  date_start?: string;
  date_end?: string;
  location?: string;
  amount?: number;
  reference?: string;
  product?: string;
  quantity?: number;
  ref_request_name?: string;
  refund_status?: string;
}

export interface ApprovalFile {
  document_id: number;
  document_name: string;
  attachment_id: number;
  name: string;
  mimetype: string;
  file_size: number;
  download_url: string;
}

export interface ApprovalDetailApprover {
  id: number;
  user_id: number;
  user_name: string;
  status: string;
  status_label: string;
  required: boolean;
}

export interface ApprovalDetail {
  id: number;
  name: string;
  code: string;
  request_status: string;
  request_status_label: string;
  request_owner_name: string;
  employee_name: string;
  employee_code: string;
  department_name: string;
  job_name: string;
  category_id: number;
  category_name: string;
  company_name: string;
  amount: number;
  reference: string;
  date: string;
  date_start: string;
  date_end: string;
  location: string;
  partner_name: string;
  description: string;
  product?: string;
  quantity?: number;
  ref_request_name?: string;
  refund_status?: string;
  files: ApprovalFile[];
  approver_ids: ApprovalDetailApprover[];
  buttons: string[];
}

export const ACTION_LABELS: Record<string, string> = {
  action_confirm: 'Trình duyệt',
  action_approve: 'Phê duyệt',
  action_refuse: 'Từ chối',
  action_withdraw: 'Rút lại',
  action_cancel: 'Huỷ',
  action_draft: 'Về nháp',
};

export const ACTION_VARIANTS: Record<string, 'primary' | 'secondary' | 'detractive'> = {
  action_confirm: 'secondary',
  action_approve: 'secondary',
  action_refuse: 'detractive',
  action_withdraw: 'secondary',
  action_cancel: 'detractive',
  action_draft: 'secondary',
};

const ACTION_ENDPOINTS: Record<string, string> = {
  action_confirm: '/api/models/approval-request/execute/app_approval_submit',
  action_approve: '/api/models/approval-request/execute/app_approval_approve',
  action_refuse: '/api/models/approval-request/execute/app_approval_refuse',
  action_withdraw: '/api/models/approval-request/execute/app_approval_withdraw',
  action_cancel: '/api/models/approval-request/execute/app_approval_cancel',
  action_draft: '/api/models/approval-request/execute/app_approval_draft',
};

const useApprovalDetail = (id: number) => {
  const app = useAppContext();

  const {
    data: detail,
    isLoading,
    mutate: refetch,
  } = useSWR<ApprovalDetail>(
    id > 0 ? ['approvalDetail', id] : null,
    async () => {
      const res = await api.POST({
        path: '/api/models/approval-request/execute/get_approval_request_details',
        data: { kwargs: { id } },
      });
      const record = res?.data?.records?.[0];
      if (!record) throw new Error('Không tìm thấy phiếu');
      return record as ApprovalDetail;
    },
    {
      onError: (err: any) => {
        showToast('error', err?.message || 'Có lỗi xảy ra khi tải chi tiết');
      },
    },
  );

  const { data: categories } = useSWR<ApprovalCategory[]>(
    app.current_company_id ? ['approvalCategories', app.current_company_id] : null,
    async () => {
      const res = await api.POST({
        path: '/api/models/approval-category/execute/get_info_category',
        data: {
          context: {
            company_id: app.current_company_id,
            allowed_company_ids: app.current_company_id ? [app.current_company_id] : [],
          },
        },
      });
      return (res?.data as ApprovalCategory[]) || [];
    },
    {
      onError: (err: any) => {
        showToast('error', err?.message || 'Có lỗi xảy ra khi lấy danh mục');
      },
    },
  );

  const { data: users } = useSWR<ApprovalUser[]>(
    app.current_company_id ? ['approvalUsers', app.current_company_id] : null,
    async () => {
      const res = await api.POST({
        path: '/api/models/approval-request/execute/app_get_users_by_company',
        data: {
          kwargs: {},
          context: {
            company_id: app.current_company_id,
            allowed_company_ids: app.current_company_id ? [app.current_company_id] : [],
          },
        },
      });
      return (res?.data as ApprovalUser[]) || [];
    },
    {
      onError: (err: any) => {
        showToast('error', err?.message || 'Có lỗi xảy ra khi lấy danh sách người phê duyệt');
      },
    },
  );

  const categoryOptions: OptionItem[] = useMemo(
    () => (categories || []).map((c) => ({ key: c.id.toString(), value: c.name })),
    [categories],
  );

  const userOptions: OptionItem[] = useMemo(
    () => (users || []).map((u) => ({ key: u.id.toString(), value: u.name })),
    [users],
  );

  const { trigger: createApproval, isMutating: createLoading } = useSWRMutation(
    ['createApproval'],
    async (_, { arg }: { arg: CreateApprovalPayload }) => {
      try {
        const res = await api.POST({
          path: '/api/models/approval-request/execute/create_or_update_approval_request',
          data: { kwargs: arg },
        });
        return res?.data
          ? (res.data as { id: number; request_status: string; name: string })
          : null;
      } catch (error: any) {
        showToast('error', error.message || 'Tạo phiếu thất bại');
        return null;
      }
    },
  );

  const { trigger: submitApproval, isMutating: submitLoading } = useSWRMutation(
    ['submitApproval'],
    async (_, { arg }: { arg: { id: number } }) => {
      try {
        const res = await api.POST({
          path: '/api/models/approval-request/execute/app_approval_submit',
          data: { kwargs: { id: arg.id } },
        });
        return res?.data
          ? (res.data as { id: number; request_status: string; name: string })
          : null;
      } catch (error: any) {
        showToast('error', error.message || 'Trình duyệt thất bại');
        return null;
      }
    },
  );

  const { trigger: updateApproval, isMutating: updateLoading } = useSWRMutation(
    ['updateApproval', id],
    async (_, { arg }: { arg: CreateApprovalPayload & { id: number } }) => {
      try {
        const res = await api.POST({
          path: '/api/models/approval-request/execute/create_or_update_approval_request',
          data: { kwargs: arg },
        });
        return res?.data
          ? (res.data as { id: number; request_status: string; name: string })
          : null;
      } catch (error: any) {
        showToast('error', error.message || 'Cập nhật thất bại');
        return null;
      }
    },
  );

  const { trigger: performAction, isMutating: actionLoading } = useSWRMutation(
    ['approvalAction', id],
    async (_, { arg }: { arg: { action: string } }) => {
      const endpoint = ACTION_ENDPOINTS[arg.action];
      if (!endpoint) return null;
      try {
        const res = await api.POST({
          path: endpoint,
          data: { kwargs: { id } },
        });
        return res?.data ? (res.data as { id: number; request_status: string }) : null;
      } catch (error: any) {
        showToast('error', error.message || 'Thao tác thất bại');
        return null;
      }
    },
  );

  const { trigger: uploadFiles, isMutating: uploadLoading } = useSWRMutation(
    ['uploadApprovalFiles', id],
    async (
      _,
      { arg }: { arg: { files: { uri: string; name: string; type: string }[] } },
    ): Promise<number[] | null> => {
      try {
        const formData = new FormData();
        formData.append('res_id', '0');
        arg.files.forEach((file) => {
          formData.append('files', { uri: file.uri, name: file.name, type: file.type } as any);
        });
        const res = await api.POST({
          path: '/api/models/approval-request/upload_files/upload_approval_attachments',
          data: formData,
          options: { headers: { 'Content-Type': 'multipart/form-data' } },
        });
        return res?.data ? (res.data as number[]) : null;
      } catch (error: any) {
        showToast('error', error.message || 'Upload file thất bại');
        return null;
      }
    },
  );

  return [
    {
      detail,
      isLoading,
      categories,
      users,
      categoryOptions,
      userOptions,
      createLoading,
      submitLoading,
      updateLoading,
      actionLoading,
      uploadLoading,
    },
    { createApproval, submitApproval, updateApproval, performAction, uploadFiles, refetch },
  ] as const;
};

export default useApprovalDetail;
