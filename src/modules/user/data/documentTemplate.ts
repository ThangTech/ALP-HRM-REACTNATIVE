import { DocumentCategory } from '../types/document';

// Template data for document categories
export const documentCategoriesTemplate: DocumentCategory[] = [
  {
    id: 'cv_file',
    api: 'upload_cv_file',
    deleteApi: 'delete_cv_file_file',
    title: 'CV',
  },
  {
    id: 'citizen_id_card',
    api: 'upload_citizen_id',
    deleteApi: 'delete_citizen_id_card_file',
    title: 'CCCD',
  },
  {
    id: 'curriculum_vitae',
    api: 'upload_curriculum_vitae',
    deleteApi: 'delete_curriculum_vitae_file',
    title: 'Sơ yếu lý lịch',
  },
  {
    id: 'birth_certificate',
    api: 'upload_birth_certificate',
    deleteApi: 'delete_birth_certificate_file',
    title: 'Giấy khai sinh',
  },
  {
    id: 'health_check',
    api: 'upload_health_check',
    deleteApi: 'delete_health_check_file',
    title: 'Giấy khám sức khỏe',
  },
  {
    id: 'residence_certificate',
    api: 'upload_residence_certificate',
    deleteApi: 'delete_residence_certificate_file',
    title: 'Giấy xác nhận cư trú',
  },
  {
    id: 'diploma',
    api: 'upload_diploma',
    deleteApi: 'delete_diploma_file',
    title: 'Bằng cấp',
  },
  {
    id: 'staff_confirmation_letter',
    api: 'upload_staff_confirmation_letter',
    deleteApi: 'delete_staff_confirmation_letter_file',
    title: 'Giấy xác nhận nhân sự',
  },
  {
    id: 'personnel_guarantee_letter',
    api: 'upload_personnel_guarantee_letter',
    deleteApi: 'delete_personnel_guarantee_letter_file',
    title: 'Giấy bảo lãnh trách nhiệm nhân sự',
  },
  {
    id: 'employee_other_document',
    api: 'upload_employee_other_document',
    deleteApi: 'delete_employee_other_document_file',
    title: 'Giấy tờ khác',
  },
];
