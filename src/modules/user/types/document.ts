import { UploadedFile } from 'components/file-upload/useUploadFile';

export interface DocumentCategory {
  id: string;
  api?: string;
  deleteApi?: string;
  title: string;
  files?: UploadedFile[];
  displayFiles?: UploadedFile[];
}

export type FilePickerType = 'image' | 'document';

export interface FilePickerResult {
  name: string;
  type: 'image' | 'pdf' | 'docx' | 'video';
  uri: string;
  size?: number;
}
