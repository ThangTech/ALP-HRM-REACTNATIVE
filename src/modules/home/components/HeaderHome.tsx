import { useFocusEffect } from '@react-navigation/native';
import { getTokens } from '@tamagui/core';
import { IcCalendar, IcClock } from 'assets/svgs';
import { Button, Text } from 'components';
import { RouteName } from 'configs/navigation';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useNotificationCountApi } from 'home/hooks/useNotificationCountApi';
import { useSafeArea } from 'hooks';
import useAppContext from 'hooks/useAppContext';
import { navigate } from 'navigators';
import React, { useEffect, useMemo } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
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

  const avatarUri = useMemo(() => `${HOST}${user?.image_url}?t=${Date.now()}`, [user?.image_url]);
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
        bg={'$white'}
        jc={'space-between'}
        ph={horizontalScale(15)}
        pt={verticalScale(15)}
        pb={verticalScale(10)}
      >
        <StatusBar backgroundColor={getTokens().color.$d_red.val} barStyle="light-content" />
        <View fd={'row'} ai={'center'} gap={scale(12)}>
          <Image
            source={{
              uri: avatarUri,
            }}
            w={scale(42)}
            h={scale(42)}
            br={100}
          />
          <Text color={'$d_red'} fontSize={scale(18)} fontW={'bold'}>
            {user?.name}
          </Text>
        </View>
      </View>
    );
  };

  const renderBody = () => {
    return (
      <View ph={horizontalScale(15)} bg={'$white'} pb={verticalScale(15)} gap={scale(14)}>
        <View fd={'row'} ai={'center'} gap={scale(8)}>
          <IcCalendar size={scale(20)} />
          <Text fontSize={scale(16)} color={'$d_red'} fontW={'bold'}>
            {dayjs().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY')}
          </Text>
        </View>

        <View fd={'row'} justifyContent="space-between" ai={'center'} fw={'wrap'} gap={scale(6)}>
          <WorkShift
            title="Ca làm việc:"
            time={timeKeeping?.actual_resource_calendar_display_name || ''}
          />
          <View fd={'row'} gap={scale(8)}>
            <CheckInTime
              title="Vào"
              time={timeKeeping?.check_in ? dayjs(timeKeeping.check_in).format('HH:mm') : '--:--'}
            />
            <CheckInTime
              title="Ra"
              time={timeKeeping?.check_out ? dayjs(timeKeeping.check_out).format('HH:mm') : '--:--'}
            />
          </View>
        </View>

        <View fd={'row'} ai={'center'}>
          <View fd={'row'} justifyContent="space-between" f={1} mr={scale(15)}>
            <CheckInResult title="Công thực tế" result={timeKeeping?.work_normal || 0} />
            <CheckInResult title="Đi muộn" result={timeKeeping?.late_minutes || 0} />
            <CheckInResult title="Về sớm" result={timeKeeping?.early_leave_minutes || 0} />
          </View>
          <Button
            style={styles.btn}
            onPress={() => navigate(RouteName.TimesheetExplanationDetail, { type: 'create' })}
          >
            <Button.Text fontSize={12} fontWeight={'600'}>
              Giải trình
            </Button.Text>
          </Button>
        </View>
      </View>
    );
  };
  return (
    <View bg={'$white'}>
      <View h={top} bg={'$d_red'} w="100%" />
      {renderTitle()}
      {renderBody()}
    </View>
  );
};

export default HeaderHome;

const styles = StyleSheet.create({
  btn: {
    backgroundColor: getTokens().color.$d_red.val,
    height: scale(24),
    borderRadius: scale(15),
    paddingHorizontal: horizontalScale(14),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const WorkShift = ({ title, time }: { title?: string; time: string }) => {
  return (
    <View fd={'row'} ai={'center'} gap={scale(4)}>
      {title && (
        <Text fontSize={scale(12)} color={'$black'}>
          {title}
        </Text>
      )}
      <Text fontSize={scale(12)} fontW={'bold'} color={'$black'}>
        {time}
      </Text>
    </View>
  );
};

const CheckInTime = ({ title, time }: { title: string; time: string }) => {
  return (
    <View fd={'row'} ai={'center'} gap={scale(2)}>
      <Text fontSize={scale(12)} color={'$black'}>
        {title}
      </Text>
      <View marginHorizontal={scale(2)}>
        <IcClock size={scale(12)} />
      </View>
      <Text fontSize={scale(12)} color={'$d_red'} fontW={'bold'}>
        {time}
      </Text>
    </View>
  );
};

const CheckInResult = ({ title, result }: { title: string; result: number | string }) => {
  return (
    <View gap={scale(4)}>
      <Text fontSize={scale(12)} fontW={'600'} color={'$black'}>
        {title}
      </Text>
      <View fd={'row'} ai={'center'} gap={scale(4)}>
        <IcClock size={scale(12)} />
        <Text color={'$d_red'} fontSize={scale(12)} fontW={'bold'}>
          {result}
        </Text>
      </View>
    </View>
  );
};
