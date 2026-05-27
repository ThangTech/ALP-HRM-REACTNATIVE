import { InsuranceStatus } from 'common/enum/insurance-status';

export interface Insurance {
  id: number;
  insurance_status: InsuranceStatus;
  insurance_status_label: string;
  employee_name: string;
  insurance_code: string;
  insurance_join_date?: string | number;
  registered_hospital_name?: string;
  end: string;
}

export interface InsuranceOther {
  insurance_other_status: string;
  insurance_other_status_label: string;
  employee_name: string;
  insurance_other_name: string;
  insurance_other_package_int: number;
  insurance_other_start: string;
  insurance_other_end: string;
  insurance_other_object: string;
  insurance_other_object_label: string;
  relative_ids: RelativeId[];
}

export interface RelativeId {
  name: string;
  identify_number: string;
  birth_date: string;
  gender: string;
  gender_label: string;
  relationship: string;
  relationship_label: string;
  start_date: string;
  end_date: string;
  object: string;
  object_label: string;
  phone: string;
  package_int: number;
}
