import { UserAttachment } from 'common/model/user-attachment';
import { UploadedFile } from 'components/file-upload/useUploadFile';
import api from 'hooks/api';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { DocumentCategory } from 'user/types/document';

export interface HandleFileActionParams {
  document: DocumentCategory;
  file: UploadedFile;
  files: UploadedFile[];
  employeeId: number;
  action: 'upload' | 'delete';
}

export const usePersonalProfileApi = () => {
  async function handleApiDeleteFile(params: Partial<HandleFileActionParams>) {
    try {
      await api.POST({
        path: `/api/models/hr-employee/execute/${params.document?.deleteApi}`,
        data: {
          kwargs: {
            attachment_id: +(params.file?.id ?? 0),
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async function handleApiUploadFiles(params: Partial<HandleFileActionParams>) {
    try {
      const formData = new FormData();
      formData.append('res_id', params?.employeeId?.toString());

      // Append multiple files
      params?.files?.forEach((file) => {
        let mimeType = 'application/octet-stream';
        if (file.type === 'image') {
          mimeType = 'image/jpeg';
        } else if (file.type === 'pdf') {
          mimeType = 'application/pdf';
        } else if (file.type === 'docx') {
          mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        }
        formData.append('files', {
          uri: file.uri,
          name: file.name,
          type: mimeType,
        } as any);
      });
      await api.POST({
        path: `/api/models/hr-employee/upload_files/${params.document?.api}`,
        data: formData,
        options: {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  const handleFileAction = async (_: any, { arg }: { arg: Partial<HandleFileActionParams> }) => {
    if (arg.action === 'upload') {
      await handleApiUploadFiles(arg);
    } else if (arg.action === 'delete') {
      await handleApiDeleteFile(arg);
    }
  };

  const fetchDocuments = async (): Promise<UserAttachment> => {
    try {
      const response = await api.POST({
        path: '/api/models/hr-employee/execute/get_employee_profile_attachments',
        data: {},
      });
      const data = response.data as UserAttachment;
      return data;
    } catch (error: any) {
      throw error;
    }
  };

  const fetchDocumentsSwr = useSWR('get_employee_profile_attachments', fetchDocuments);

  const handleFileActionSwr = useSWRMutation('get_employee_profile_attachments', handleFileAction);

  return {
    handleFileActionSwr,
    fetchDocumentsSwr,
  };
};
