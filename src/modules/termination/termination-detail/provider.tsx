import {
  Dispatch,
  ReactElement,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { TerminationDetailState } from './TerminationDetailState';
import { useTerminationDetailApi } from './hooks/useTerminationDetailApi';
import { Termination } from 'common/model/termination';
import { goBack } from 'navigators';
import { showToast } from 'components';
import { ApprovalProgress } from 'common/model/approval_progress';
import { BaseResponse } from 'common/model/base-response';
import { useUploadFile, UseUploadFileReturn } from 'components/file-upload/useUploadFile';

const TerminationDetailContext = createContext<TerminationDetailType>(null!);

interface TerminationDetailType {
  state: TerminationDetailState;
  setState: Dispatch<SetStateAction<TerminationDetailState>>;
  handleButton: (params: Partial<Termination>) => void;
  histories: BaseResponse<ApprovalProgress> | undefined;
  handleDeleteFile: (attachmentId: number) => Promise<void>;
  uploadFiles: UseUploadFileReturn;
  isUploading: boolean;
}

export function useTerminationDetailProvider() {
  return useContext(TerminationDetailContext);
}

export function TerminationDetailProvider({ children }: { children: ReactElement }) {
  const [state, setState] = useState<TerminationDetailState>({});
  const terminationApi = useTerminationDetailApi(state);
  const uploadFiles = useUploadFile();

  useEffect(() => {
    const id = state.id;
    if (!id || uploadFiles.uploadedFiles.length === 0) return;
    const upload = async () => {
      try {
        await terminationApi.uploadImageTerminationSwr.trigger({
          resId: id,
          files: uploadFiles.uploadedFiles,
        });
        uploadFiles.setUploadedFiles([]);
        showToast('success', 'Tải file lên thành công');
      } catch (error: any) {
        showToast('error', error.message ?? 'Tải file lên thất bại');
      }
    };
    upload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadFiles.uploadedFiles]);

  const handleButton = async (params: Partial<Termination>) => {
    setState((prev) => ({ ...prev, actionHandling: params.button }));
    try {
      await terminationApi.terminationActionSwr.trigger(params);
      goBack();
    } catch (error: any) {
      showToast('error', error.message ?? 'Thao tác thất bại');
    }
    setState((prev) => ({ ...prev, actionHandling: undefined }));
  };

  const handleDeleteFile = async (attachmentId: number) => {
    try {
      await terminationApi.deleteFileSwr.trigger({ attachment_id: attachmentId });
      showToast('success', 'Xóa file thành công');
    } catch (error: any) {
      showToast('error', error.message ?? 'Xóa file thất bại');
    }
  };

  useEffect(() => {
    setState((prev) => ({ ...prev, termination: terminationApi.terminationSwr.data }));
  }, [terminationApi.terminationSwr.data]);

  const value = {
    state,
    setState,
    handleButton,
    histories: terminationApi.histories,
    handleDeleteFile,
    uploadFiles,
    isUploading: terminationApi.uploadImageTerminationSwr.isMutating,
  };
  return (
    <TerminationDetailContext.Provider value={value}>{children}</TerminationDetailContext.Provider>
  );
}
