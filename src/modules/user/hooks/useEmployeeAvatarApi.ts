import api from 'hooks/api';
import { HandleFileActionParams } from './usePersonalProfileApi';
import useSWRMutation from 'swr/mutation';

export const useEmployeeAvatarApi = () => {
  const _updateEmployeeAvatar = async (
    _: any,
    { arg }: { arg: Partial<HandleFileActionParams> },
  ) => {
    const formData = new FormData();
    formData.append('res_id', arg?.employeeId?.toString());
    const file = arg.file;
    if (!file) {
      return;
    }
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
    await api.POST({
      path: '/api/models/hr-employee/upload_files/change_avatar',
      data: formData,
      options: {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    });
  };
  const { trigger: update } = useSWRMutation(['change_avatar'], _updateEmployeeAvatar);
  return {
    update,
  };
};
