export interface UserAttachment {
  employee_id: number;
  employee_name: string;
  attachments: Attachments;
}

export interface Attachments {
  citizen_id_card: FileAttachment;
  curriculum_vitae: FileAttachment;
  birth_certificate: FileAttachment;
  health_check: FileAttachment;
  residence_certificate: FileAttachment;
  diploma: FileAttachment;
  staff_confirmation_letter: FileAttachment;
  personnel_guarantee_letter: FileAttachment;
  employee_other_document: FileAttachment;
}

export interface FileAttachment {
  label: string;
  files: FileData[];
}

export interface FileData {
  id: number;
  name: string;
  mimetype: string;
  file_size: number;
  url: string;
  download_url: string;
}
