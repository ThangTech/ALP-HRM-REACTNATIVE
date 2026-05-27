import { DisciplineObject } from 'common/enum/discipline-object';
import { DisciplineType } from 'common/enum/discipline-type';
import { FileData } from './user-attachment';

export class Discipline {
  id?: number;
  type?: DisciplineType;
  name?: string;
  state?: string;
  label_state?: string;
  label_type?: string;
  type_reward_id?: number;
  type_reward_name?: string;
  object?: DisciplineObject;
  label_object?: string;
  divide_id?: number;
  divide_name?: string;
  department_id?: number;
  department_name?: string;
  division?: number;
  division_name?: string;
  branch_id?: number;
  branch_name?: string;
  employee_id?: number;
  employee_name?: string;
  emp_job_id?: number;
  emp_job_name?: string;
  emp_group_id?: number;
  emp_group_name?: string;
  emp_department_id?: number;
  emp_department_name?: string;
  effective_date?: string;
  is_in_salary?: boolean;
  value?: number;
  content?: string;

  files?: Array<FileData>;

  static fromJson(json: Partial<Discipline>): Discipline {
    return Object.assign(new Discipline(), json);
  }

  getObjectDescription(): string {
    switch (this.object) {
      case DisciplineObject.PERSONAL:
        return this.employee_name || '';
      case DisciplineObject.COMPANY:
        return 'Công ty';
      case DisciplineObject.BRANCH:
        return this.branch_name || '';
      case DisciplineObject.DIVISION:
        return this.division_name || '';
      case DisciplineObject.DEPARTMENT:
        return this.department_name || '';
      default:
        return '';
    }
  }
}
