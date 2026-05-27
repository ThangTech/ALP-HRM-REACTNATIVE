import { LeaveRegistrationViewType } from 'common/enum/leave-registration-view-type';
import { OverTime } from 'common/model/over-time';

export class OverTimeDetailState {
  id?: number;
  viewType?: LeaveRegistrationViewType;
  detail?: OverTime;
}
