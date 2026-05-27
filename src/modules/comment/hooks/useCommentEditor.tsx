import BottomSheet from '@gorhom/bottom-sheet';
import { OptionItem } from 'components';
import api from 'hooks/api';
import { UploadedFile, useUploadFile } from 'modules/suggestion/hooks/useUploadFile';
import { useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';

interface CommentEditorFormData {
  departmentId: string;
  groupId: string;
  content: string;
  files?: Array<UploadedFile>;
}

export const useCommentEditor = () => {
  const uploadFile = useUploadFile();
  const form = useForm<CommentEditorFormData>();
  const optionPickerRef = useRef<BottomSheet>(null);
  const groupPickerRef = useRef<BottomSheet>(null);
  const departmentId = form.watch('departmentId');
  const groupId = form.watch('groupId');

  const { data: departmentOptions } = useSWR(
    ['departments'],
    async (): Promise<Array<OptionItem>> => {
      const res = await api.POST({
        path: '/models/hr-department/execute/get_infor_employee_department',
        data: {},
      });

      if (res?.data) {
        const temp = res.data.map(
          (item: any) =>
            ({
              key: item.id.toString(),
              value: item.name,
            }) as OptionItem,
        );
        return temp;
      }
      return [];
    },
  );

  const selectedDepartment = useMemo(() => {
    return departmentOptions?.find((option) => option.key === departmentId);
  }, [departmentId, departmentOptions]);

  const { data: groupOptions } = useSWR(
    ['workLocationList'],
    async (): Promise<Array<OptionItem>> => {
      const res = await api.POST({
        path: '/models/sv-employee-group/execute/get_infor_employee_group',
        data: {},
      });
      if (res?.data) {
        const temp = res.data.map(
          (item: any) =>
            ({
              key: item.id.toString(),
              value: item.name,
            }) as OptionItem,
        );
        return temp;
      }
      return [];
    },
  );

  const selectedGroup = useMemo(() => {
    return departmentOptions?.find((option) => option.key === groupId);
  }, [groupId, departmentOptions]);

  const errors = form.formState.errors;

  const onSubmit = async (data: CommentEditorFormData) => {
    console.log(data);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  };

  return {
    uploadFile,
    form,
    errors,
    optionPickerRef,
    groupPickerRef,
    departmentOptions,
    selectedDepartment,
    groupOptions,
    selectedGroup,
    onSubmit,
  };
};
