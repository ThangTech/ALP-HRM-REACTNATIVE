import BottomSheet, { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRef, useState } from 'react';
import { useFilePicker } from 'user/hooks/useFilePicker';

export interface UploadedFile {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'docx' | 'video';
  uri: string;
  size?: number;
  isFromAPI?: boolean; // Flag to distinguish API files from newly uploaded files
  download_url?: string;
  isDeleted?: boolean;
}

export interface UseUploadFileReturn {
  filePickerRef: React.RefObject<BottomSheet>;
  filePickerModalRef: React.RefObject<BottomSheetModal>;
  uploadedFiles: UploadedFile[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
  handleSelectImage: () => Promise<void>;
  handleSelectDocument: () => Promise<void>;
  handleSelectVideo: () => Promise<void>;
}

export const useUploadFile = (): UseUploadFileReturn => {
  const filePicker = useFilePicker();
  const filePickerRef = useRef<BottomSheet>(null);
  const filePickerModalRef = useRef<BottomSheetModal>(null);

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const handleSelectImage = async () => {
    filePickerRef.current?.close();
    filePickerModalRef.current?.dismiss();
    const result = await filePicker.pickImage();
    if (result) {
      const newFile: UploadedFile = {
        id: 'temp' + Date.now().toString(),
        name: result.name,
        type: result.type,
        uri: result.uri,
        size: result.size,
      };
      setUploadedFiles((prev) => [...prev, newFile]);
    }
  };

  const handleSelectDocument = async () => {
    filePickerRef.current?.close();
    filePickerModalRef.current?.dismiss();
    const result = await filePicker.pickDocument();
    if (result) {
      const newFile: UploadedFile = {
        id: 'temp' + Date.now().toString(),
        name: result.name,
        type: result.type,
        uri: result.uri,
        size: result.size,
      };
      setUploadedFiles((prev) => [...prev, newFile]);
    }
  };

  const handleSelectVideo = async () => {
    filePickerRef.current?.close();
    filePickerModalRef.current?.dismiss();
    const result = await filePicker.pickVideo();
    if (result) {
      const newFile: UploadedFile = {
        id: 'temp' + Date.now().toString(),
        name: result.name,
        type: result.type,
        uri: result.uri,
        size: result.size,
      };
      setUploadedFiles((prev) => [...prev, newFile]);
    }
  };
  return {
    filePickerRef,
    uploadedFiles,
    filePickerModalRef,
    setUploadedFiles,
    handleSelectImage,
    handleSelectDocument,
    handleSelectVideo,
  };
};
