import { SuggestionViewType } from 'common/enum/suggestion-view-type';
import { BaseResponse, BaseResponsePagination } from 'common/model/base-response';
import { SuggestionModel } from 'common/model/suggestion-model';
import { OptionItem } from 'components';
import api from 'hooks/api';
import useAppContext from 'hooks/useAppContext';
import { goBack } from 'navigators';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { getLocalFileType, getRemoteFileType } from 'utils';
import { UploadedFile, useUploadFile } from './useUploadFile';

interface SuggestionFormData {
  employee: OptionItem;
  jobId?: OptionItem;
  groupId?: OptionItem;
  departmentId?: OptionItem;
  topic: string;
  description: string;
  response: string;
  rate?: number;
  files?: Array<UploadedFile>;
}

export const useSuggestion = (id: number, type: SuggestionViewType) => {
  const { user } = useAppContext();
  const uploadFile = useUploadFile();
  const form = useForm<SuggestionFormData>({
    defaultValues: {
      employee: { key: user?.employee_id, value: `[${user?.employee_code}] ${user?.name}` },
      jobId: { key: user?.job_id || 0, value: user?.job_name || '' },
      groupId: { key: user?.group_id || 0, value: user?.group_name || '' },
      departmentId: { key: user?.department_id || 0, value: user?.department_name || '' },
      response: '',
    },
  });

  const rateNumber = useMemo(() => {
    return new Map<string, number>([
      ['zero_star', 0],
      ['one_star', 1],
      ['two_star', 2],
      ['three_star', 3],
      ['four_star', 4],
      ['five_star', 5],
    ]);
  }, []);

  const rateString = useMemo(() => {
    return new Map<number, string>([
      [0, 'zero_star'],
      [1, 'one_star'],
      [2, 'two_star'],
      [3, 'three_star'],
      [4, 'four_star'],
      [5, 'five_star'],
    ]);
  }, []);

  const _uploadFiles = async (resId?: number) => {
    if (!resId) {
      return;
    }
    if (!uploadFile.uploadedFiles?.length) {
      return;
    }
    const formData = new FormData();
    formData.append('res_id', resId.toString());
    uploadFile.uploadedFiles.forEach((file) => {
      formData.append('files', {
        uri: file.uri,
        type: getRemoteFileType(file.type),
        name: file.name,
      } as any);
    });

    await api.POST<BaseResponse<any>>({
      path: '/api/models/helpdesk-ticket/upload_files/attach_files',
      data: formData,
    });
  };

  const _submitSuggestion = async (_: any, { arg }: { arg: SuggestionFormData }) => {
    const response = await api.POST<BaseResponse<SuggestionModel>>({
      path: '/api/models/helpdesk-ticket/execute/create_or_update_helpdesk_ticket',
      data: {
        kwargs: {
          id: id,
          type: type,
          name: arg.topic,
          description: arg.description,
          rate: arg.rate ? rateString.get(+arg.rate || 0) : undefined,
        },
      },
    });
    const resultId = response.data?.id;
    _uploadFiles(resultId);
    goBack();
  };

  const { trigger: submitSuggestion } = useSWRMutation(
    ['create-suggestion', type],
    _submitSuggestion,
  );

  const onSubmit = async (data: SuggestionFormData) => {
    await submitSuggestion(data);
  };

  const _fetchDetail = async () => {
    const response = await api.POST<BaseResponse<BaseResponsePagination<SuggestionModel>>>({
      path: '/api/models/helpdesk-ticket/execute/get_helpdesk_ticket_details',
      data: {
        kwargs: {
          id: id,
        },
      },
    });
    return response.data?.records?.at(0);
  };
  const { data: suggestion } = useSWR(id ? ['suggestion-detail', id] : null, _fetchDetail);

  useEffect(() => {
    if (!suggestion) {
      return;
    }
    form.reset({
      employee: {
        key: suggestion?.employee_id,
        value: `[${suggestion?.employee_code}] ${suggestion?.employee_name}`,
      },
      jobId: {
        key: 0,
        value: suggestion?.job_name || '',
      },
      groupId: {
        key: 0,
        value: suggestion?.group_name || '',
      },
      departmentId: {
        key: 0,
        value: suggestion?.department_name || '',
      },
      topic: suggestion?.name || '',
      description: suggestion?.description || '',
      response: suggestion?.response || '',
      rate: rateNumber.get(suggestion?.rate || '0'),
    });
    uploadFile.setUploadedFiles(
      suggestion?.attachments.map((file) => ({
        id: file.id.toString(),
        name: file.name,
        type: getLocalFileType(file.mimetype),
        uri: file.download_url || '',
      })) || [],
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, suggestion]);

  return {
    form,
    uploadFile,
    onSubmit,
    suggestion,
  };
};
