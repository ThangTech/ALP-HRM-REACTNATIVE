import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Images } from 'assets';
import IcDoubleArrowDown from 'assets/svgs/IcDoubleArrowDown';
import { LeaveRegistrationViewType } from 'common/enum/leave-registration-view-type';
import { SuggestionViewType } from 'common/enum/suggestion-view-type';
import { TimeSheetViewType } from 'common/enum/time-sheet-view-type';
import { Banner } from 'common/model/company';
import { globalStyle } from 'common/styles/base';
import { OptionItem, Pressable, Text } from 'components';
import OptionPickerModal2 from 'components/base/OptionPickerModal2';
import { RouteName } from 'configs/navigation';
import { HeaderHome } from 'home/components';
import { useHomeApi } from 'home/hooks/useHomeApi';
import useAppContext from 'hooks/useAppContext';
import Divider from 'modules/leave-registration/leave-report/components/divider';
import { navigate } from 'navigators';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Image,
  ListRenderItemInfo,
  PermissionsAndroid,
  View as RNView,
  StyleSheet,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { getTokens, ScrollView, View } from 'tamagui';
import { useUser } from 'user/hooks';
import { scale, verticalScale, widthDevice } from 'utils';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, Notification } from '@notifee/react-native';
import { DEFAULT_CHANNEL_ID } from 'configs/contansts';

// Memoized carousel item component for better performance
const CarouselItem = ({ item }: { item: Banner }) => {
  if (!item) return null;
  return (
    <RNView>
      <Image source={{ uri: item.image_url }} style={styles.slideImage} resizeMode="cover" />
    </RNView>
  );
};

const Home = () => {
  const CarouselCmp = Carousel as unknown as React.ComponentType<any>;
  const sheetLeaveRef = React.useRef<BottomSheetModal>(null);
  const terminationOptionRef = useRef<BottomSheetModal>(null);
  const personalReportOptionRef = useRef<BottomSheetModal>(null);
  const overTimesOptionRef = useRef<BottomSheetModal>(null);
  const [isShowMore, setShowMore] = useState(false);
  const homeApi = useHomeApi();
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
      if (token && token !== fcmToken) {
        await setFcmToken(token);
        await homeApi.saveFcmToken({ token, employeeId: user?.employee_id });
      }
    }
    getFcmToken();
  }, [fcmToken, setFcmToken, homeApi, user?.employee_id]);

  const renderBody = () => {
    return (
      <ScrollView showsVerticalScrollIndicator={false} f={1}>
        <View jc={'center'} bg={'$white'} pv={verticalScale(10)}>
          {renderMenu()}
          {renderImage()}
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
          navigate(RouteName.Profile);
        },
      },
      {
        key: 'bang_cong',
        label: 'Bảng công',
        icon: Images.bang_cong,
        onPress: () => {
          navigate(RouteName.Timesheet);
        },
      },
      {
        key: 'giai_trinh_cong',
        label: 'Giải trình công',
        icon: Images.giai_trinh_cong,
        onPress: () => {
          navigate(RouteName.TimesheetExplanation, {
            isAdmin: userApprovalInfor?.approve_hr_attendance_explanation,
          });
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
        key: 'de_xuat',
        label: 'Đề xuất',
        icon: Images.de_xuat,
        onPress: () => {
          navigate(RouteName.SuggestionList, { viewType: SuggestionViewType.SUGGESTION });
        },
      },
      {
        key: 'gop_y',
        label: 'Góp ý',
        icon: Images.gop_y,
        onPress: () => {
          navigate(RouteName.SuggestionList, { viewType: SuggestionViewType.COMMENT });
        },
      },
      ...(user?.access_staff_transfer
        ? [
            {
              key: 'to_trinh_ns',
              label: 'Tờ trình HCNS',
              icon: Images.to_trinh_ns,
              onPress: () => {
                onOptionPersonalReportSelected({ key: 2, value: '' });
              },
            },
          ]
        : []),
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
      ...(isShowMore
        ? [
            {
              key: 'bao_hiem',
              label: 'Bảo hiểm',
              icon: Images.bao_hiem,
              onPress: () => {
                navigate(RouteName.InsuranceMenu);
              },
            },
            {
              key: 'thue',
              label: 'Thuế TNCN',
              icon: Images.thue,
              onPress: () => {
                navigate(RouteName.Tax);
              },
            },
            {
              key: 'cham_cong',
              label: 'Chấm công\nGPS',
              icon: Images.cham_cong,
              onPress: () => {
                navigate(RouteName.GpsList);
              },
            },
            {
              key: 'time_sheet_manage',
              label: 'Bảng công\nnhân viên',
              icon: Images.time_sheet_manage,
              onPress: () => {
                navigate(RouteName.Timesheet, {
                  viewType: TimeSheetViewType.MANAGE_TIME_SHEET,
                });
              },
            },
            {
              key: 'ot',
              label: 'Đăng ký\nOT',
              icon: Images.ot,
              onPress: () => {
                if (userApprovalInfor?.approve_hr_leave) {
                  overTimesOptionRef.current?.present();
                } else {
                  navigate(RouteName.Overtimes, { viewType: LeaveRegistrationViewType.ME });
                }
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
            {
              key: '1',
            },
            ...(!user?.access_staff_transfer
              ? [
                  {
                    key: '2',
                  },
                ]
              : []),
          ]
        : []),
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
        <View fd={'row'} fw={'wrap'} jc={'space-between'}>
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
        <View position="relative" mv={scale(16)}>
          <Divider />
          <View
            bg={'white'}
            style={globalStyle.itemShadow}
            position="absolute"
            top={scale(-18)}
            left={widthDevice / 2 - scale(24)}
            br={100}
            rotate={isShowMore ? '180deg' : '0deg'}
          >
            <Pressable onPress={() => setShowMore(!isShowMore)}>
              <View p={scale(4)}>
                <IcDoubleArrowDown />
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  // Memoize carousel dimensions
  const carouselDimensions = useMemo(() => {
    const sliderWidth = widthDevice;
    const itemHorizontalPadding = scale(20);
    const itemWidth = sliderWidth - itemHorizontalPadding * 2;
    return { sliderWidth, itemWidth };
  }, []);

  // Memoized renderItem function
  const renderItem = useCallback((item: ListRenderItemInfo<Banner>) => {
    return <CarouselItem item={item.item} />;
  }, []);

  const renderImage = () => {
    return (
      <View ai={'center'}>
        <CarouselCmp
          data={homeApi.banners?.data?.banners ?? []}
          renderItem={renderItem}
          sliderWidth={carouselDimensions.sliderWidth}
          itemWidth={carouselDimensions.itemWidth}
          firstItem={0}
          loop
          autoplay
          autoplayDelay={1000}
          autoplayInterval={3000}
          inactiveSlideScale={0.94}
          inactiveSlideOpacity={0.9}
          containerCustomStyle={styles.carouselContainer}
          contentContainerCustomStyle={styles.carouselContent}
          removeClippedSubviews={true}
          windowSize={3}
          initialNumToRender={2}
          maxToRenderPerBatch={2}
        />
      </View>
    );
  };

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
  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderBody()}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    backgroundColor: getTokens().color.$backgroundHover.val,
  },
  carouselContainer: {
    marginTop: verticalScale(10),
  },
  carouselContent: {
    // keep default spacing minimal
  },
  slideImage: {
    width: '100%',
    height: verticalScale(400),
    borderRadius: scale(12),
  },
  paginationContainer: {
    paddingVertical: verticalScale(6),
  },
  dot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    marginHorizontal: scale(3),
    backgroundColor: getTokens().color.$blue.val,
  },
  menuItem: {
    width: '24%',
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
