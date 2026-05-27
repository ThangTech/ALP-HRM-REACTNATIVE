import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { TerminationEditorState } from './TerminationEditorState';
import { useUploadFile, UseUploadFileReturn } from 'components/file-upload/useUploadFile';
import { showToast } from 'components';
import { useTerminationEditorApi } from './hooks/useTerminationEditorApi';
import { goBack } from 'navigators';

const TerminationEditorContext = createContext<TerminationEditorType>(null!);

interface TerminationEditorType {
  uploadFiles: UseUploadFileReturn;
  handleSubmit: () => Promise<void>;
  state: TerminationEditorState;
  setState: Dispatch<SetStateAction<TerminationEditorState>>;
}

export function useTerminationEditorProvider() {
  return useContext(TerminationEditorContext);
}

export function TerminationEditorProvider({ children }: { children: ReactElement }) {
  const terminationEditorApi = useTerminationEditorApi();
  const uploadFiles = useUploadFile();
  const [state, setState] = useState<TerminationEditorState>({
    resignationDate: new Date(),
    dayOff: new Date(),
  });

  const handleSubmit = async () => {
    if (!state.content?.trim()) {
      setState((prev) => ({ ...prev, showError: true }));
      showToast('error', 'Vui lòng nhập nội dung đơn nghỉ');
      return;
    }
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await terminationEditorApi.createTerminationSwr.trigger(state);
      if (uploadFiles.uploadedFiles.length) {
        await terminationEditorApi.uploadImageTerminationSwr.trigger({
          resId: response.data?.id ?? 0,
          files: uploadFiles.uploadedFiles,
        });
      }
      goBack();
    } catch (error: any) {
      console.error(error);
      showToast('error', error.message ?? 'Thao tác thất bại');
    }
    setState((prev) => ({ ...prev, isLoading: false }));
  };

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      departureReasonOptions: terminationEditorApi.reasonOptionsSwr.data,
    }));
  }, [terminationEditorApi.reasonOptionsSwr.data]);

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      employeeOptions: terminationEditorApi.employeeOptionsSwr.data,
    }));
  }, [terminationEditorApi.employeeOptionsSwr.data]);

  const value = {
    state,
    uploadFiles,
    setState,
    handleSubmit,
  };
  return (
    <TerminationEditorContext.Provider value={value}>{children}</TerminationEditorContext.Provider>
  );
}
