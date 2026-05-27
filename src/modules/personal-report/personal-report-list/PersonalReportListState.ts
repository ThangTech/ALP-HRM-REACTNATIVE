import { PersonalReport } from 'common/model/personal-report';
import { OptionItem } from 'components';

export class PersonalReportListState {
  offset?: number;
  limit?: number;
  triggerRefresh?: number;
  type?: OptionItem;
  approveStaffTransfer?: boolean;
  state?: OptionItem;

  reportOptions?: OptionItem[];

  personalReports?: PersonalReport[];
}
