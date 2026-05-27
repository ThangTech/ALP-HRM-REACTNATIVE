import { LeaveRegistrationViewType } from 'common/enum/leave-registration-view-type';
import { OverTime } from 'common/model/over-time';
import { OptionItem } from 'components';

export class OverTimesState {
  offset?: number;
  triggerRefresh?: number;
  from?: Date;
  to?: Date;
  state?: OptionItem;
  employee?: OptionItem;
  stateOptions?: OptionItem[];
  items?: OverTime[];
  viewType?: LeaveRegistrationViewType;
}
