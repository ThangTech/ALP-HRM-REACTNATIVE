import { FileData } from './user-attachment';

export interface Tax {
  tax_employee: string;
  employee_name: string;
  count_child: number;
  list_child: TaxListRef[];
}

export interface TaxListRef {
  name: string;
  date: string;
  gender_dict: string;
  gender_label: string;
  tax_code: string;
  id_card: string;
  relationship: string;
  relationship_label: string;
  number_birth_cer: string;
  book: string;
  city_place_of_birth: number;
  city_place_of_birth_name: string;
  ward_place_of_birth: number;
  ward_place_of_birth_name: string;
  start_date: string;
  end_date: string;
  file_list: FileData[];
}
