export type SignFilterType = 'my' | 'all';
export type StateFilter = 'sent' | 'signed';
export type SignRequestState = 'sent' | 'signed' | 'canceled';

export interface SignRequestItem {
  id: number;
  partner_name: string;
  state: SignRequestState;
}

export interface SignAttachment {
  attachment_id: number;
  name: string;
  mimetype: string;
  url: string;
  url_download: string;
}

export interface SignAttachedDocument {
  id: number;
  name: string;
  note: string;
  request_id: number;
  attachments: SignAttachment[];
}

export interface SignRequest {
  id: number;
  reference: string;
  state: SignRequestState;
  progress: number;
  create_date: string;
  sign_url: string;
  request_item_ids: SignRequestItem[];
  attached_documents: SignAttachedDocument[];
}

export interface SignRequestSummary {
  filter_type: SignFilterType;
  state: string;
  total_count: number;
  count_waiting: number;
  count_signed: number;
  count_canceled: number;
  limit: number;
  offset: number;
  current_page_items_count: number;
}

export interface SignRequestApiResponse {
  data: {
    summary: SignRequestSummary;
    sign_requests: SignRequest[];
  };
}
