import { LeaveRegistrationViewType } from 'common/enum/leave-registration-view-type';
import { TerminationButtonType } from 'common/enum/termination-button-type';
import { PersonalReport } from 'common/model/personal-report';
import { OptionItem } from 'components';

export class PersonalReportEditorState {
  id?: number;

  detail?: PersonalReport;
  actionHandling?: TerminationButtonType;
  viewType?: LeaveRegistrationViewType;
  departmentId?: number;
  // Loại tờ trình
  typeOptions?: OptionItem[];
  // Nhân viên
  employeeOptions?: OptionItem[];
  // Khu vực
  areaOptions?: OptionItem[];
  // Khối
  divisionOptions?: OptionItem[];
  // Phòng ban
  departmentOptions?: OptionItem[];
  // Chi nhánh
  groupOptions?: OptionItem[];

  // Chức danh
  jobOptions?: OptionItem[];

  // Chức vụ
  positionOptions?: OptionItem[];

  // Cấp bậc
  rankOptions?: OptionItem[];

  // Quản lý trực tiếp
  directorOptions?: OptionItem[];

  // Quản lý cấp trên
  managerOptions?: OptionItem[];
}
