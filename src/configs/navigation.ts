import { InsuranceType } from 'common/enum/insurance-type';
import { LeaveRegistrationViewType } from 'common/enum/leave-registration-view-type';
import { SuggestionViewType } from 'common/enum/suggestion-view-type';
import { TimeSheetViewType } from 'common/enum/time-sheet-view-type';

export enum RouteName {
  Login = 'Login',
  BottomBarStack = 'BottomBarStack',
  Home = 'Home',
  Setting = 'Setting',
  News = 'News',
  NewsDetail = 'NewsDetail',
  Notification = 'Notification',
  User = 'User',
  Vps = 'Vps',
  Timesheet = 'Timesheet',
  TimesheetFilter = 'TimesheetFilter',
  Profile = 'Profile',
  JobInformation = 'JobInformation',
  PersonalInformation = 'PersonalInformation',
  ContractInformation = 'ContractInformation',
  EmployeeInformation = 'EmployeeInformation',
  PersonalProfile = 'PersonalProfile',
  CompanyProfile = 'CompanyProfile',
  ChangePassword = 'ChangePassword',
  TimesheetExplanation = 'TimesheetExplanation',
  Register = 'Register',
  Suggestion = 'Suggestion',
  CommentEditor = 'CommentEditor',
  TimesheetExplanationDetail = 'TimesheetExplanationDetail',
  LeaveRegistrations = 'LeaveRegistrations',
  LeaveRegistrationEditor = 'LeaveRegistrationEditor',
  LeaveReportRoot = 'LeaveReportRoot',
  LeaveRegistrationsDetail = 'LeaveRegistrationsDetail',
  Terminations = 'Terminations',
  TerminationDetail = 'TerminationDetail',
  TerminationEditor = 'TerminationEditor',
  Overtimes = 'Overtimes',
  OvertimeEditor = 'OvertimeEditor',
  OvertimeDetail = 'OvertimeDetail',
  DisciplineList = 'DisciplineList',
  DisciplineDetail = 'DisciplineDetail',
  PersonalReportList = 'PersonalReportList',
  ForgotPassword = 'ForgotPassword',
  PersonalReportEditor = 'PersonalReportEditor',
  FullMenu = 'FullMenu',
  InsuranceMenu = 'InsuranceMenu',
  InsuranceDetailPage = 'InsuranceDetailPage',
  Tax = 'Tax',
  SalaryTicketList = 'SalaryTicketList',
  SalaryTicketDetail = 'SalaryTicketDetail',
  GpsList = 'GpsList',
  GpsTracking = 'GpsTracking',
  SuggestionList = 'SuggestionList',
  AttendanceViolation = 'AttendanceViolation',
  AttendanceViolationDetail = 'AttendanceViolationDetail',
  EmployeeList = 'EmployeeList',
}

type ParamList = Record<RouteName | string, any> & {
  NewsDetail: {
    id: string;
    title: string;
    image: string;
    content?: string;
  };
  [RouteName.Profile]: {
    employeeId?: number;
    employeeName?: string;
  };
  [RouteName.EmployeeList]: undefined;
  [RouteName.PersonalInformation]: {
    employeeId?: number;
  };
  [RouteName.JobInformation]: {
    employeeId?: number;
  };
  [RouteName.ContractInformation]: {
    employeeId?: number;
  };
  [RouteName.PersonalProfile]: {
    employeeId?: number;
  };
  [RouteName.CompanyProfile]: {
    employeeId?: number;
  };
  [RouteName.EmployeeInformation]: {
    employeeId?: number;
  };
  TimesheetExplanation: {
    isAdmin?: boolean;
    viewType?: LeaveRegistrationViewType;
  };
  TimesheetExplanationDetail: {
    type: 'create' | 'edit';
    id?: number;
    date?: string;
  };
  LeaveRegistrationDetail: {
    id?: number;
    viewType?: LeaveRegistrationViewType;
  };
  LeaveRegistrations: {
    viewType?: LeaveRegistrationViewType;
  };
  [RouteName.Terminations]: {
    viewType?: LeaveRegistrationViewType;
  };
  [RouteName.TerminationDetail]: {
    id?: number;
    viewType?: LeaveRegistrationViewType;
  };
  [RouteName.OvertimeDetail]: {
    id?: number;
    viewType?: LeaveRegistrationViewType;
  };
  [RouteName.DisciplineDetail]: {
    id?: number;
  };
  [RouteName.PersonalReportList]: {
    viewType?: LeaveRegistrationViewType;
  };
  [RouteName.PersonalReportEditor]: {
    id?: number;
    viewType?: LeaveRegistrationViewType;
  };
  [RouteName.InsuranceDetailPage]: {
    type?: InsuranceType;
  };
  [RouteName.Timesheet]: {
    viewType?: TimeSheetViewType;
  };
  [RouteName.LeaveRegistrationEditor]: {
    id?: number;
    date?: string;
  };
  [RouteName.LeaveRegistrationsDetail]: {
    id?: number;
    viewType?: LeaveRegistrationViewType;
  };
  [RouteName.SalaryTicketDetail]: {
    id?: number;
  };
  [RouteName.SuggestionList]: {
    viewType?: SuggestionViewType;
  };
  [RouteName.Suggestion]: {
    id?: number;
    viewType?: SuggestionViewType;
  };
  [RouteName.Overtimes]: {
    viewType?: LeaveRegistrationViewType;
  };
  [RouteName.OvertimeEditor]: {
    id?: number;
  };
  [RouteName.AttendanceViolationDetail]: {
    employeeId: number;
    employeeName: string;
    employeeCode?: string;
    department?: string;
    group?: string;
    month: number;
    year: number;
  };
};

export type AppStackParamList = Partial<ParamList>;
