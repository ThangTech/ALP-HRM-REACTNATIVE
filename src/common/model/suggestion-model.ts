import { FileData } from './user-attachment';

export interface SuggestionModel {
  id: number;
  name: string;
  employee_id: number;
  employee_name: string;
  employee_code: string;
  division_name: string;
  department_name: string;
  job_name: string;
  group_name: string;
  stage_id: number;
  stage_name: string;
  stage_code: string;
  type: string;
  label_type: string;
  create_date: string;
  description: string;
  response: string;
  team_name: string;
  priority: string;
  rate: string;
  attachments: FileData[];
}
