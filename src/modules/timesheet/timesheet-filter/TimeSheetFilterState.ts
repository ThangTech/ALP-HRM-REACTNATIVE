import { OptionItem } from 'components';

export class TimeSheetFilterState {
  from?: Date;
  to?: Date;
  employee?: OptionItem;
  job?: OptionItem;
  group?: OptionItem;
  department?: OptionItem;
  division?: OptionItem;
  parent?: OptionItem;

  employeeOptions?: OptionItem[];
}
