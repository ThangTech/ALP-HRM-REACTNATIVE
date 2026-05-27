import { useFocusEffect } from '@react-navigation/native';
import { getTokens } from '@tamagui/core';
import { IcCalendar, IcClock } from 'assets/svgs';
import IcNotification from 'assets/svgs/IcNotification';
import { Button, Text } from 'components';
import { RouteName } from 'configs/navigation';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useNotificationCountApi } from 'home/hooks/useNotificationCountApi';
import { useSafeArea } from 'hooks';
import useAppContext from 'hooks/useAppContext';
import { navigate } from 'navigators';
import React, { useEffect } from 'react';
import { Pressable, StatusBar, StyleSheet } from 'react-native';
import { HOST } from 'react-native-dotenv';
import { Image, View } from 'tamagui';
import useTimeSheet from 'timesheet/hooks/useTimeSheet';
import { horizontalScale, scale, verticalScale } from 'utils';
import notifee from '@notifee/react-native';

dayjs.extend(utc);
dayjs.extend(timezone);

const HeaderHome = () => {
  const { top } = useSafeArea();
  const { user } = useAppContext();
  const [{ timeKeeping }] = useTimeSheet({});
  const notificationCountApi = useNotificationCountApi();

  useFocusEffect(
    React.useCallback(() => {
      notificationCountApi.refresh();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  useEffect(() => {
    async function setBadgeCount(count: number) {
      await notifee.setBadgeCount(count);
    }
    setBadgeCount(notificationCountApi.notificationCount?.data?.total_all || 0);
  }, [notificationCountApi.notificationCount?.data?.total_all]);

  const renderTitle = () => {
    return (
      <View
        fd={'row'}
        ai={'center'}
        bg={'$blue'}
        jc={'space-between'}
        p={horizontalScale(15)}
        pt={top}
      >
        <StatusBar backgroundColor={getTokens().color.$blue.val} barStyle="dark-content" />
        <View fd={'row'} ai={'center'}>
          <Image
            source={{
              uri: `${HOST}${user?.image_url}?t=${Date.now()}`,
            }}
            w={40}
            h={40}
            br={100}
          />
          <Text pl={horizontalScale(10)} color={'white'} fontSize={scale(24)} fontW={'bold'}>
            {user?.name}
          </Text>
        </View>

        <Pressable onPress={() => navigate(RouteName.Notification)}>
          <View position="relative">
            <IcNotification tintColor="white" size={24} />
            {notificationCountApi.notificationCount?.data?.total_all ? (
              <View
                position="absolute"
                top={-5}
                right={-5}
                bg={'$d_red'}
                br={scale(10)}
                minW={scale(20)}
                h={scale(20)}
                ai={'center'}
                jc={'center'}
              >
                <Text color={'$white'} fontSize={scale(12)} fontW={'bold'}>
                  {notificationCountApi.notificationCount.data.total_all}
                </Text>
              </View>
            ) : null}
          </View>
        </Pressable>
      </View>
    );
  };

  const renderBody = () => {
    return (
      <View
        p={horizontalScale(15)}
        bg={'$white'}
        m={scale(5)}
        mb={verticalScale(10)}
        gap={scale(10)}
        br={scale(10)}
      >
        <View fd={'row'} ai={'center'} gap={scale(10)}>
          <IcCalendar size={scale(24)} />
          <Text fontSize={scale(24)} color={'$blue'} fontW={'bold'}>
            {dayjs().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY')}
          </Text>
        </View>
        <View fd={'row'} justifyContent="space-between">
          <CheckInTime
            title="Vào"
            time={timeKeeping?.check_in ? dayjs(timeKeeping.check_in).format('HH:mm') : '--:--'}
          />
          <CheckInTime
            title="Ra"
            time={timeKeeping?.check_out ? dayjs(timeKeeping.check_out).format('HH:mm') : '--:--'}
          />
          <WorkShift time={timeKeeping?.actual_resource_calendar_display_name || ''} />
        </View>
        <View fd={'row'}>
          <View fd={'row'} justifyContent="space-between" f={2}>
            <CheckInResult title="Công thực tế" result={timeKeeping?.work_normal || 0} />
            <CheckInResult title="Đi muộn" result={timeKeeping?.late_minutes || 0} />
            <CheckInResult title="Về sớm" result={timeKeeping?.early_leave_minutes || 0} />
          </View>
          <View f={1} marginLeft={horizontalScale(10)}>
            <Button
              style={styles.btn}
              onPress={() => navigate(RouteName.TimesheetExplanationDetail, { type: 'create' })}
            >
              <Button.Text fontSize={scale(16)}>Giải trình</Button.Text>
            </Button>
          </View>
        </View>
      </View>
    );
  };
  return (
    <View bg={'$blue'}>
      {renderTitle()}
      {renderBody()}
    </View>
  );
};

export default HeaderHome;

const styles = StyleSheet.create({
  btn: {
    // paddingHorizontal: horizontalScale(-15),
    marginHorizontal: horizontalScale(15),
  },
});

const WorkShift = ({ title, time }: { title?: string; time: string }) => {
  return (
    <View fd={'row'}>
      <Text marginRight={scale(5)}>{title}</Text>
      <Text fontW={'bold'}>{time}</Text>
    </View>
  );
};

const CheckInTime = ({ title, time }: { title: string; time: string }) => {
  return (
    <View fd={'row'} ai={'center'}>
      <Text>{title}</Text>
      <IcClock size={scale(17)} style={{ marginHorizontal: scale(5) }} />
      <Text color={'$blue'}>{time}</Text>
    </View>
  );
};

const CheckInResult = ({ title, result }: { title: string; result: number }) => {
  return (
    <View gap={scale(5)}>
      <Text>{title}</Text>
      <View fd={'row'} ai={'center'}>
        <IcClock size={scale(17)} style={{ marginRight: scale(5) }} />
        <Text color={'$d_red'} fontSize={scale(16)} fontW={'bold'}>
          {result}
        </Text>
      </View>
    </View>
  );
};
