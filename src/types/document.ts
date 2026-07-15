export enum DocumentType {
  FOLDER = 'FOLDER',
  PDF = 'PDF',
  WORD = 'WORD',
  EXCEL = 'EXCEL',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  LINK = 'LINK',
  UNKNOWN = 'UNKNOWN',
}

export interface BaseFileItem {
  id?: number | string;
  attachment_id?: number | string;
  name?: string;
  type?: DocumentType | string;
  mimetype?: string;
  url?: string;
  url_download?: string;
}

export interface DocumentItemModel extends BaseFileItem {
  id: number;
  name: string;
  type: DocumentType;
  folder_id?: number | false;
  owner_id?: number;
  owner_name?: string;
  partner_id?: number;
  partner_name?: string;
  file_size?: number;
  document_count?: number;
}
