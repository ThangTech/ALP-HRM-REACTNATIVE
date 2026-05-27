import { LeaveRegistrationViewType } from 'common/enum/leave-registration-view-type';
import { LeaveRegistration } from 'common/model/leave-registration';
import { OptionItem } from 'components';

export class LeaveRegistrationState {
  viewType?: LeaveRegistrationViewType;
  fromDate?: Date;
  toDate?: Date;
  status?: OptionItem;
  employee?: OptionItem;
  offset?: number;
  limit?: number;
  total?: number;
  triggerRefresh?: number;
  items?: Partial<LeaveRegistration>[];
}
