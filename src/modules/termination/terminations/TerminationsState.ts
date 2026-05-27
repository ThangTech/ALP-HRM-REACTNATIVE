import { LeaveRegistrationViewType } from 'common/enum/leave-registration-view-type';
import { Termination } from 'common/model/termination';
import { OptionItem } from 'components';

export class TerminationsState {
  requestDate?: Date;
  requestDateTo?: Date;
  group?: OptionItem;
  department?: OptionItem;
  status?: OptionItem;
  employee?: OptionItem;
  offset?: number;
  viewType?: LeaveRegistrationViewType;
  triggerRefresh?: number;

  groupOptions?: OptionItem[];
  departmentOptions?: OptionItem[];
  statusOptions?: OptionItem[];
  terminations?: Termination[];
}
