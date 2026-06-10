import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList, RouteName } from 'configs/navigation';
import React, { ComponentProps, useEffect } from 'react';
// import DrawerNavigation from './DrawerNavigator';
import { navigationRef } from './navigationUtilities';
import BottomTabBar from './BottomTabBar';
import { IcHome, IcUser, IcNotificationBoard } from 'assets/svgs';
import { Home } from 'home/screens';
import {
  ChangePassword,
  CompanyProfile,
  ContractInformation,
  EmployeeInformation,
  EmployeeList,
  JobInformation,
  Login,
  PersonalInformation,
  PersonalProfile,
  ProfileMenu,
  User,
} from 'modules/user/screens';
import useAppContext from 'hooks/useAppContext';
import { Notification } from 'notification/screens';
import { Vps } from 'modules/vps/screens';
import { News, NewsDetail } from 'modules/news/screens';
import {
  Timesheet,
  TimesheetExplanation,
  TimesheetExplanationDetail,
  AttendanceViolation,
  AttendanceViolationDetail,
} from 'timesheet/screens';
import Suggestion from 'modules/suggestion/screens/Suggestion';
import CommentEditor from 'modules/comment/screens/CommentEditor';
import LeaveRegistrationsPage from 'modules/leave-registration/list';
import LeaveRegistrationDetailPage from 'modules/leave-registration/detail';
import LeaveRegistrationEditorPage from 'modules/leave-registration/editor';
import LeaveReportRootPage from 'modules/leave-registration/leave-report/root';
import RegisterPage from 'user/register';
import TerminationsPage from 'modules/termination/terminations';
import FullMenu from 'modules/menu/FullMenu';
import TerminationDetailPage from 'modules/termination/termination-detail';
import TimesheetFilterPage from 'timesheet/timesheet-filter';
import TerminationEditorPage from 'modules/termination/termination-editor';
import OverTimesPage from 'modules/over-time/over-times';
import OverTimeEditorPage from 'modules/over-time/over-time-editor';
import OverTimeDetailPage from 'modules/over-time/over-time-detail';
import DisciplineListPage from 'modules/discipline/discipline-list';
import DisciplineDetailPage from 'modules/discipline/discipline-detail';
import PersonalReportListPage from 'modules/personal-report/personal-report-list';
import ForgotPassword from 'user/screens/ForgotPassword';
import PersonalReportEditorPage from 'modules/personal-report/personal-report-editor';
import InsuranceMenu from 'modules/insurance/insurance-menu';
import InsuranceDetailPage from 'modules/insurance/insurance-detail';
import TaxPage from 'modules/tax';
import SalaryTicketListPage from 'modules/salary-ticket/salary-ticket-list';
import SalaryTicketDetailPage from 'modules/salary-ticket/salary-ticket-detail';
import GpsListPage from 'modules/gps/gps-list';
import GpsTrackingPage from 'modules/gps/gps-tracking';
import SuggestionList from 'modules/suggestion/screens/SuggestionList';

export type AppStackScreenProps<T extends RouteName> = NativeStackScreenProps<AppStackParamList, T>;
type BottomTabBarType = ComponentProps<any>['tabs'];

const bottomTabs: BottomTabBarType = [
  {
    icon: IcHome,
    title: 'common.home',
    routeName: RouteName.Home,
    component: Home,
  },
  {
    icon: IcNotificationBoard,
    title: 'Thông báo',
    routeName: RouteName.Notification,
    component: Notification,
  },
  {
    icon: IcUser,
    title: 'common.user',
    routeName: RouteName.Setting,
    component: User,
  },
];

type AppNavigatorProps = Partial<React.ComponentProps<typeof NavigationContainer>>;

const BottomBarStack = () => {
  return <BottomTabBar tabs={bottomTabs} />;
};

// const DrawerNavigationStack = () => {
//   return <DrawerNavigation />;
// };

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStack = () => {
  const { user } = useAppContext();

  useEffect(() => {
    if (user?.employee_id) {
      // getPermissionByUserId();
    }
  }, [user?.employee_id]);

  const getInitRoute = () => {
    if (user?.employee_id) {
      return RouteName.BottomBarStack;
    }
    return RouteName.Login;
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={getInitRoute()}
    >
      <Stack.Screen name={RouteName.BottomBarStack} component={BottomBarStack} />
      <Stack.Screen name={RouteName.Login} component={Login} />
      <Stack.Screen name={RouteName.Vps} component={Vps} />
      <Stack.Screen name={RouteName.News} component={News} />
      <Stack.Screen name={RouteName.NewsDetail} component={NewsDetail} />
      <Stack.Screen name={RouteName.Notification} component={Notification} />
      <Stack.Screen name={RouteName.Timesheet} component={Timesheet} />
      <Stack.Screen name={RouteName.TimesheetFilter} component={TimesheetFilterPage} />
      <Stack.Screen name={RouteName.Profile} component={ProfileMenu} />
      <Stack.Screen name={RouteName.EmployeeList} component={EmployeeList} />
      <Stack.Screen name={RouteName.JobInformation} component={JobInformation} />
      <Stack.Screen name={RouteName.PersonalInformation} component={PersonalInformation} />
      <Stack.Screen name={RouteName.ContractInformation} component={ContractInformation} />
      <Stack.Screen name={RouteName.EmployeeInformation} component={EmployeeInformation} />
      <Stack.Screen name={RouteName.PersonalProfile} component={PersonalProfile} />
      <Stack.Screen name={RouteName.CompanyProfile} component={CompanyProfile} />
      <Stack.Screen name={RouteName.ChangePassword} component={ChangePassword} />
      <Stack.Screen name={RouteName.TimesheetExplanation} component={TimesheetExplanation} />
      <Stack.Screen name={RouteName.Suggestion} component={Suggestion} />
      <Stack.Screen name={RouteName.CommentEditor} component={CommentEditor} />
      <Stack.Screen name={RouteName.Register} component={RegisterPage} />
      <Stack.Screen name={RouteName.LeaveRegistrations} component={LeaveRegistrationsPage} />
      <Stack.Screen name={RouteName.FullMenu} component={FullMenu} />
      <Stack.Screen name={RouteName.Terminations} component={TerminationsPage} />
      <Stack.Screen name={RouteName.TerminationDetail} component={TerminationDetailPage} />
      <Stack.Screen name={RouteName.TerminationEditor} component={TerminationEditorPage} />
      <Stack.Screen name={RouteName.Overtimes} component={OverTimesPage} />
      <Stack.Screen name={RouteName.OvertimeEditor} component={OverTimeEditorPage} />
      <Stack.Screen name={RouteName.OvertimeDetail} component={OverTimeDetailPage} />
      <Stack.Screen name={RouteName.DisciplineList} component={DisciplineListPage} />
      <Stack.Screen name={RouteName.DisciplineDetail} component={DisciplineDetailPage} />
      <Stack.Screen name={RouteName.PersonalReportList} component={PersonalReportListPage} />
      <Stack.Screen name={RouteName.ForgotPassword} component={ForgotPassword} />
      <Stack.Screen name={RouteName.PersonalReportEditor} component={PersonalReportEditorPage} />
      <Stack.Screen name={RouteName.InsuranceMenu} component={InsuranceMenu} />
      <Stack.Screen name={RouteName.InsuranceDetailPage} component={InsuranceDetailPage} />
      <Stack.Screen name={RouteName.Tax} component={TaxPage} />
      <Stack.Screen name={RouteName.SalaryTicketList} component={SalaryTicketListPage} />
      <Stack.Screen name={RouteName.SalaryTicketDetail} component={SalaryTicketDetailPage} />
      <Stack.Screen name={RouteName.GpsList} component={GpsListPage} />
      <Stack.Screen name={RouteName.GpsTracking} component={GpsTrackingPage} />
      <Stack.Screen name={RouteName.SuggestionList} component={SuggestionList} />
      <Stack.Screen
        name={RouteName.LeaveRegistrationEditor}
        component={LeaveRegistrationEditorPage}
      />
      <Stack.Screen name={RouteName.LeaveReportRoot} component={LeaveReportRootPage} />
      <Stack.Screen
        name={RouteName.LeaveRegistrationsDetail}
        component={LeaveRegistrationDetailPage}
      />
      <Stack.Screen
        name={RouteName.TimesheetExplanationDetail}
        component={TimesheetExplanationDetail}
      />
      <Stack.Screen name={RouteName.AttendanceViolation} component={AttendanceViolation} />
      <Stack.Screen
        name={RouteName.AttendanceViolationDetail}
        component={AttendanceViolationDetail}
      />
    </Stack.Navigator>
  );
};

export const AppNavigator = (props: AppNavigatorProps) => {
  return (
    <NavigationContainer ref={navigationRef as any} {...props}>
      <AppStack />
    </NavigationContainer>
  );
};
