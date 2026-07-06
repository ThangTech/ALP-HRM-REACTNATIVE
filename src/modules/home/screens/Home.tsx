import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Images } from 'assets';
import { LeaveRegistrationViewType } from 'common/enum/leave-registration-view-type';
import { TimeSheetViewType } from 'common/enum/time-sheet-view-type';
import { OptionItem, Pressable, Text } from 'components';
import OptionPickerModal2 from 'components/base/OptionPickerModal2';
import { RouteName } from 'configs/navigation';
import { HeaderHome } from 'home/components';
import { useHomeApi } from 'home/hooks/useHomeApi';
import useAppContext from 'hooks/useAppContext';
import api from 'hooks/api';
import { navigate } from 'navigators';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Image, PermissionsAndroid, StyleSheet } from 'react-native';
import { ScrollView, View } from 'tamagui';
import { useUser } from 'user/hooks';
import { scale, verticalScale } from 'utils';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, Notification } from '@notifee/react-native';
import { DEFAULT_CHANNEL_ID } from 'configs/contansts';
import { IcExplanation } from 'assets/svgs';

const Home = () => {
  const sheetLeaveRef = React.useRef<BottomSheetModal>(null);
  const terminationOptionRef = useRef<BottomSheetModal>(null);
  const personalReportOptionRef = useRef<BottomSheetModal>(null);
  const overTimesOptionRef = useRef<BottomSheetModal>(null);
  const timesheetExplanationOptionRef = useRef<BottomSheetModal>(null);
  const profileOptionRef = useRef<BottomSheetModal>(null);
  const timesheetOptionRef = useRef<BottomSheetModal>(null);
  const kysoOptionRef = useRef<BottomSheetModal>(null);
  const [isShowMore, setShowMore] = useState(false);
  const homeApi = useHomeApi();
  const { recentActivities } = homeApi;
  const { user, fcmToken, setFcmToken } = useAppContext();

  const [{ userApprovalInfor }] = useUser();
  const renderHeader = () => {
    return <HeaderHome />;
  };

  useEffect(() => {
    async function requestUserPermission() {
      await messaging().requestPermission();
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    }
    requestUserPermission();
  }, []);

  useEffect(() => {
    async function createChannelId() {
      await notifee.createChannel({
        id: DEFAULT_CHANNEL_ID,
        name: 'Default Channel',
        badge: true,
        description: 'Default channel for general notifications',
        importance: AndroidImportance.DEFAULT,
      });
    }
    createChannelId();

    async function onMessageReceived(message: FirebaseMessagingTypes.RemoteMessage) {
      if (!message.notification) return;
      await createChannelId();
      notifee.displayNotification({
        ...message.notification,
        android: {
          ...message.notification?.android,
          channelId: DEFAULT_CHANNEL_ID,
        },
      } as Notification);
    }

    messaging().onMessage(onMessageReceived);
  }, []);

  useEffect(() => {
    async function getFcmToken() {
      const token = await messaging().getToken();
      // nếu user đã logout trong lúc getToken() đang await,
      // api.getToken() sẽ rỗng → bỏ qua, tránh gọi API với token rỗng → 401.
      if (!api.getToken()) return;
      if (token && token !== fcmToken) {
        await setFcmToken(token);
        await homeApi.saveFcmToken({ token, employeeId: user?.employee_id });
      }
    }
    getFcmToken();
  }, [fcmToken, setFcmToken, homeApi, user?.employee_id]);

  const renderRecentActivities = () => {
    const records = recentActivities?.data?.records || [];

    if (records.length === 0) {
      return (
        <View f={1} jc={'center'} ai={'center'}>
          <Text fontSize={scale(14)} color={'$grey'} ta={'center'}>
            Chưa có dữ liệu
          </Text>
        </View>
      );
    }

    return (
      <View>
        {records.map((item, index) => (
          <View
            key={index}
            fd={'row'}
            p={scale(12)}
            bg={'$white'}
            br={scale(16)}
            borderWidth={1}
            borderColor={'#e0e0e0'}
            mb={index === records.length - 1 ? 0 : scale(12)}
          >
            <View mr={scale(12)} mt={scale(2)}>
              <IcExplanation size={scale(32)} />
            </View>
            <View f={1}>
              <View fd={'row'} jc={'space-between'} ai={'flex-start'} mb={scale(4)}>
                <Text fontSize={scale(15)} fontW={'600'} color={'$black'} f={1}>
                  {item.activity_type_name}
                </Text>
              </View>
              <Text fontSize={scale(13)} color={'$grey'} mb={scale(2)}>
                {item.res_name}
              </Text>
              <Text fontSize={scale(13)} color={'$grey'} mb={scale(2)}>
                Ngày đến hạn: {item.date_deadline}
              </Text>
              <Text fontSize={scale(13)} color={'$grey'} mb={scale(2)}>
                Loại: {item.model_display_name}
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderBody = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        f={1}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View f={1} jc={'flex-start'} bg={'$white'} pt={verticalScale(10)}>
          {renderMenu()}
          {!isShowMore && (
            <View f={1}>
              <View h={scale(8)} bg={'#f0f2f5'} w={'100%'} />
              <View p={scale(15)} f={1}>
                <Text fontSize={scale(18)} fontW={'bold'} color={'$black'} mb={scale(15)}>
                  Hoạt động gần đây
                </Text>
                {renderRecentActivities()}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    );
  };

  // Memoize menu items to prevent unnecessary re-renders
  const menuItems = useMemo(
    () => [
      {
        key: 'ho_so',
        label: 'Hồ sơ',
        icon: Images.ho_so,
        onPress: () => {
          profileOptionRef.current?.present();
        },
      },
      {
        key: 'bang_cong',
        label: 'Bảng công',
        icon: Images.bang_cong,
        onPress: () => {
          if (userApprovalInfor?.approve_hr_attendance_explanation) {
            timesheetOptionRef.current?.present();
          } else {
            navigate(RouteName.Timesheet);
          }
        },
      },
      {
        key: 'giai_trinh_cong',
        label: 'Giải trình công',
        icon: Images.giai_trinh_cong,
        onPress: () => {
          if (userApprovalInfor?.approve_hr_attendance_explanation) {
            timesheetExplanationOptionRef.current?.present();
          } else {
            navigate(RouteName.TimesheetExplanation, { viewType: LeaveRegistrationViewType.ME });
          }
        },
      },
      {
        key: 'dang_ky_nghi',
        label: 'Đăng ký nghỉ',
        icon: Images.dang_ky_nghi,
        onPress: () => {
          if (userApprovalInfor?.approve_hr_leave) {
            sheetLeaveRef.current?.present();
          } else {
            navigate(RouteName.LeaveRegistrations, { viewType: LeaveRegistrationViewType.ME });
          }
        },
      },
      {
        key: 'phieu_luong',
        label: 'Phiếu lương',
        icon: Images.phieu_luong,
        onPress: () => {
          navigate(RouteName.SalaryTicketList);
        },
      },
      {
        key: 'bao_hiem',
        label: 'Bảo hiểm',
        icon: Images.bao_hiem,
        onPress: () => {
          navigate(RouteName.InsuranceMenu);
        },
      },
      {
        key: 'nghi_viec',
        label: 'Nghỉ việc',
        icon: Images.nghi_viec,
        onPress: () => {
          if (userApprovalInfor?.approve_resignation_letter) {
            terminationOptionRef.current?.present();
          } else {
            navigate(RouteName.Terminations, { viewType: LeaveRegistrationViewType.ME });
          }
        },
      },
      // {
      //   key: 'de_xuat',
      //   label: 'Đề xuất',
      //   icon: Images.de_xuat,
      //   onPress: () => {
      //     navigate(RouteName.SuggestionList, { viewType: SuggestionViewType.SUGGESTION });
      //   },
      // },
      // {
      //   key: 'gop_y',
      //   label: 'Góp ý',
      //   icon: Images.gop_y,
      //   onPress: () => {
      //     navigate(RouteName.SuggestionList, { viewType: SuggestionViewType.COMMENT });
      //   },
      // },
      // ...(user?.access_staff_transfer
      //   ? [
      //       {
      //         key: 'to_trinh_ns',
      //         label: 'Tờ trình HCNS',
      //         icon: Images.to_trinh_ns,
      //         onPress: () => {
      //           onOptionPersonalReportSelected({ key: 2, value: '' });
      //         },
      //       },
      //     ]
      //   : []),
      ...(isShowMore
        ? [
            {
              key: 'thue',
              label: 'Thuế TNCN',
              icon: Images.thue,
              onPress: () => {
                navigate(RouteName.Tax);
              },
            },
            {
              key: 'ky_so',
              label: 'Ký số',
              icon: Images.ky_so,
              onPress: () => {
                kysoOptionRef.current?.present();
              },
            },
            {
              key: 'tai_lieu',
              label: 'Tài liệu',
              icon: Images.tai_lieu,
              onPress: () => {
                navigate(RouteName.DocumentList);
              },
            },
            ...(!user?.access_staff_transfer || (isShowMore && user?.access_staff_transfer)
              ? [
                  {
                    key: 'khen_thuong',
                    label: 'Khen thưởng\nKỷ luật',
                    icon: Images.khen_thuong,
                    onPress: () => {
                      navigate(RouteName.DisciplineList);
                    },
                  },
                ]
              : []),
            // {
            //   key: 'ot',
            //   label: 'Đăng ký\nOT',
            //   icon: Images.ot,
            //   onPress: () => {
            //     if (userApprovalInfor?.approve_hr_leave) {
            //       overTimesOptionRef.current?.present();
            //     } else {
            //       navigate(RouteName.Overtimes, { viewType: LeaveRegistrationViewType.ME });
            //     }
            //   },
            // },
          ]
        : []),
      {
        key: 'toggle_show_more',
        label: isShowMore ? 'Ẩn bớt' : 'Xem thêm',
        icon: isShowMore ? Images.an_bot : Images.xem_them,
        onPress: () => setShowMore(!isShowMore),
      },
    ],
    [
      userApprovalInfor?.approve_hr_attendance_explanation,
      userApprovalInfor?.approve_hr_leave,
      userApprovalInfor?.approve_resignation_letter,
      isShowMore,
      user?.access_staff_transfer,
    ],
  );

  const renderMenu = () => {
    return (
      <View p={scale(5)}>
        <View fd={'row'} fw={'wrap'} jc={'flex-start'}>
          {menuItems.map((item) => (
            <Pressable key={item.key} style={styles.menuItem} onPress={item.onPress}>
              <View ai={'center'} gap={scale(8)}>
                {item.icon && (
                  <Image source={item.icon} style={styles.menuIcon} resizeMode="contain" />
                )}
                <Text ta={'center'}>{item.label}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    );
  };

  function onProfileOptionSelected(item: OptionItem): void {
    if (item.key === 1) {
      navigate(RouteName.Profile);
    } else if (item.key === 2) {
      navigate(RouteName.EmployeeList);
    }
  }

  function onOptionSelected(item: OptionItem): void {
    if (item.key === 1) {
      navigate(RouteName.LeaveRegistrations, { viewType: LeaveRegistrationViewType.ME });
    } else if (item.key === 2) {
      navigate(RouteName.LeaveRegistrations, { viewType: LeaveRegistrationViewType.APPROVE });
    } else if (item.key === 3) {
      navigate(RouteName.LeaveReportRoot);
    }
  }

  function onOptionPersonalReportSelected(item: OptionItem): void {
    const viewType =
      item.key === 1 ? LeaveRegistrationViewType.ME : LeaveRegistrationViewType.APPROVE;
    navigate(RouteName.PersonalReportList, { viewType });
  }

  function onTerminationOptionSelected(item: OptionItem): void {
    if (item.key === 1) {
      navigate(RouteName.Terminations, { viewType: LeaveRegistrationViewType.ME });
    }
    if (item.key === 2) {
      navigate(RouteName.Terminations, { viewType: LeaveRegistrationViewType.APPROVE });
    }
  }

  function onOptionOverTimesSelected(item: OptionItem): void {
    if (item.key === 1) {
      navigate(RouteName.Overtimes, { viewType: LeaveRegistrationViewType.ME });
    }
    if (item.key === 2) {
      navigate(RouteName.Overtimes, { viewType: LeaveRegistrationViewType.APPROVE });
    }
  }

  function onTimesheetExplanationOptionSelected(item: OptionItem): void {
    if (item.key === 1) {
      navigate(RouteName.TimesheetExplanation, { viewType: LeaveRegistrationViewType.ME });
    }
    if (item.key === 2) {
      navigate(RouteName.TimesheetExplanation, { viewType: LeaveRegistrationViewType.APPROVE });
    }
  }

  function onTimesheetOptionSelected(item: OptionItem): void {
    if (item.key === 1) {
      navigate(RouteName.Timesheet);
    } else if (item.key === 2) {
      navigate(RouteName.Timesheet, { viewType: TimeSheetViewType.MANAGE_TIME_SHEET });
    }
  }
  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderBody()}
      <OptionPickerModal2
        bottomSheetRef={profileOptionRef}
        data={[
          { value: 'Thông tin của tôi', key: 1 },
          { value: 'Danh sách nhân viên', key: 2 },
        ]}
        onSelect={onProfileOptionSelected}
      />
      <OptionPickerModal2
        bottomSheetRef={sheetLeaveRef}
        data={[
          { value: 'Danh sách của tôi', key: 1 },
          { value: 'Danh sách phê duyệt', key: 2 },
          // { value: 'Nghỉ phép / Nghỉ bù', key: 3 },
        ]}
        onSelect={onOptionSelected}
      />
      <OptionPickerModal2
        bottomSheetRef={terminationOptionRef}
        data={[
          { value: 'Danh sách của tôi', key: 1 },
          { value: 'Danh sách phê duyệt', key: 2 },
          // { value: 'Nghỉ phép / Nghỉ bù', key: 3 },
        ]}
        onSelect={onTerminationOptionSelected}
      />
      <OptionPickerModal2
        bottomSheetRef={personalReportOptionRef}
        data={[
          { value: 'Danh sách của tôi', key: 1 },
          { value: 'Danh sách phê duyệt', key: 2 },
          // { value: 'Nghỉ phép / Nghỉ bù', key: 3 },
        ]}
        onSelect={onOptionPersonalReportSelected}
      />
      <OptionPickerModal2
        bottomSheetRef={overTimesOptionRef}
        data={[
          { value: 'Danh sách của tôi', key: 1 },
          { value: 'Danh sách phê duyệt', key: 2 },
          // { value: 'Nghỉ phép / Nghỉ bù', key: 3 },
        ]}
        onSelect={onOptionOverTimesSelected}
      />
      <OptionPickerModal2
        bottomSheetRef={timesheetExplanationOptionRef}
        data={[
          { value: 'Danh sách của tôi', key: 1 },
          { value: 'Danh sách phê duyệt', key: 2 },
        ]}
        onSelect={onTimesheetExplanationOptionSelected}
      />
      <OptionPickerModal2
        bottomSheetRef={timesheetOptionRef}
        data={[
          { value: 'Bảng công của tôi', key: 1 },
          { value: 'Bảng công nhân viên', key: 2 },
        ]}
        onSelect={onTimesheetOptionSelected}
      />
      <OptionPickerModal2
        bottomSheetRef={kysoOptionRef}
        title="Chọn loại tài liệu ký"
        data={[
          { value: 'Của tôi', key: 1 },
          { value: 'Tất cả', key: 2 },
        ]}
        onSelect={(item) => {
          const filterType = item.key === 1 ? 'my' : 'all';
          navigate(RouteName.SignRequestList, { filterType });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    backgroundColor: 'white',
  },
  menuItem: {
    width: '25%',
    marginBottom: scale(16),
    alignItems: 'center',
    marginTop: scale(10),
  },
  menuIcon: {
    width: scale(54),
    height: scale(54),
  },
});

export default Home;
