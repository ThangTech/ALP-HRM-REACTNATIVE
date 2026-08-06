import { Button, Header, OptionItem, Text } from 'components';
import React, { useState, useMemo, useCallback } from 'react';
import { ScrollView, View } from 'tamagui';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { horizontalScale, scale, verticalScale } from 'utils';
import useTimeSheet from 'timesheet/hooks/useTimeSheet';
import { useAttendanceViolationPermission } from 'timesheet/hooks/useAttendanceViolation';
import dayjs from 'dayjs';
import { navigate } from 'navigators';
import { AppStackParamList, RouteName } from 'configs/navigation';
import { TimeSheetViewType } from 'common/enum/time-sheet-view-type';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import CardContainer from 'components/CardContainer';
import TimeSheetFilter from './components/TimeSheetFilter';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import { TimesheetState } from 'common/enum/timesheet-state';
import { IcInformation, IcCheck, IcClose } from 'assets/svgs';

// Config locale tiếng Việt cho Calendar
LocaleConfig.locales.vi = {
  monthNames: [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ],
  monthNamesShort: [
    'Th.1',
    'Th.2',
    'Th.3',
    'Th.4',
    'Th.5',
    'Th.6',
    'Th.7',
    'Th.8',
    'Th.9',
    'Th.10',
    'Th.11',
    'Th.12',
  ],
  dayNames: ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'],
  dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
  today: 'Hôm nay',
};
LocaleConfig.defaultLocale = 'vi';

/**
 * 1. Đủ công dựa trên dữ liệu in/out: màu xanh dương
+ Nếu số công ngày thường >= số công quy đổi theo ca thì đc tính đủ công
+ Với các ngày có cả nghỉ bù, phép ...và đi làm thực tế mà đủ công: -> xanh dương
2. Ngày nghỉ có hưởng lương (ngày lễ, ngày phép, ngày nghỉ chế độ đã được duyệt đơn):
Nghỉ bù chọn cả ngày
Ngày nghỉ >=1
-> màu cam
3. Ngày phải giải trình: Màu đỏ
- thiếu giờ in/out
- đi muộn/về sớm
- ko có dữ liệu chấm công (mà ko phải là ngày off)
4. Ngày off: màu xám
5. Ngày chưa đến: ko màu
6. Ngày CBNV chưa onboard: ko màu
7. Điều kiện: đã tạo giải trình công ở mọi trạng thái thì để màu tím
 */

// Constants
const STATUS_CONFIG = [
  { key: '1', label: 'Đủ công', color: '#3B82F6' },
  { key: '2', label: 'Ngày nghỉ có hưởng lương', color: '#F59E0B' },
  { key: '3', label: 'Ngày phải giải trình', color: '#DC2626' },
  { key: '4', label: 'Ngày off', color: '#9CA3AF' },
  { key: '5', label: 'Ngày công có giải trình', color: '#8c0cc7' },
] as const;

const DAY_OF_WEEK_NAMES = [
  'Chủ nhật',
  'Thứ hai',
  'Thứ ba',
  'Thứ tư',
  'Thứ năm',
  'Thứ sáu',
  'Thứ bảy',
] as const;

const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 4,
} as const;

// Utility Functions
const getDisplayStatus = (state: string) => {
  const stateMap: Record<string, number> = {
    '1': 0,
    [TimesheetState.HAS_REPORT]: 4,
    '2': 1,
    '3': 2,
    '4': 3,
  };
  return stateMap[state] !== undefined ? STATUS_CONFIG[stateMap[state]] : null;
};

const formatTime = (datetime: string) => {
  if (!datetime) {
    return '--:--';
  }
  return datetime.split(' ')[1]?.substring(0, 5) || '--:--';
};

const formatDate = (dateString: string) => {
  const dateObj = new Date(dateString);
  const dayOfWeek = DAY_OF_WEEK_NAMES[dateObj.getDay()];
  const formattedDate = dayjs(dateString).format('DD/MM/YYYY');
  return { dayOfWeek, formattedDate };
};

// Sub Components
const StatusLegend = React.memo(() => (
  <View fw="wrap" flexDirection="row" gap={horizontalScale(10)}>
    {STATUS_CONFIG.map((item) => (
      <View key={item.key} fd="row" ai="center" gap={horizontalScale(10)}>
        <View bg={item.color} br={scale(20)} w={horizontalScale(10)} h={verticalScale(10)} />
        <Text>{item.label}</Text>
      </View>
    ))}
  </View>
));

const InfoCard = React.memo(
  ({
    label,
    value,
    bgColor,
    textColor,
    flex = 1,
  }: {
    label: string;
    value: string | number;
    bgColor: string;
    textColor: string;
    flex?: number;
  }) => (
    <View f={flex} bg={bgColor} br={scale(12)} p={scale(12)}>
      <Text fontSize={scale(12)} color={textColor} mb={verticalScale(4)}>
        {label}
      </Text>
      <Text fontSize={scale(14)} fontW="600" color={textColor}>
        {value}
      </Text>
    </View>
  ),
);

const EmptyState = React.memo(() => (
  <View bg="$white" br={scale(16)} p={scale(20)} mt={verticalScale(20)} style={CARD_SHADOW}>
    <Text fontSize={scale(18)} fontW="bold" mb={verticalScale(12)} color="$black">
      Chi tiết ngày công
    </Text>
    <View ai="center" paddingVertical={verticalScale(40)}>
      <Text color="$grey" fontSize={scale(14)}>
        Không có dữ liệu
      </Text>
    </View>
  </View>
));
type TimeSheetProps = NativeStackScreenProps<AppStackParamList, RouteName.Timesheet>;

// Main Component
const Timesheet = (props: TimeSheetProps) => {
  const { viewType = TimeSheetViewType.MY_TIME_SHEET } = props.route.params || {};
  const [selected, setSelected] = useState(dayjs().format('YYYY-MM-DD'));
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
  const { hasPermission } = useAttendanceViolationPermission();
  const [selectedEmployee, setSelectedEmployee] = useState<OptionItem | undefined>(undefined);
  const [{ attendanceList, isLoadingAttendanceList, attendanceSummary }, { mutateAttendanceList }] =
    useTimeSheet({
      date,
      viewType,
      employeeId: selectedEmployee?.key ? Number(selectedEmployee.key) : undefined,
    });

  useFocusEffect(
    useCallback(() => {
      if (mutateAttendanceList) mutateAttendanceList();
    }, [mutateAttendanceList]),
  );

  // Memoize marked dates để tránh re-calculate không cần thiết
  const markedDates = useMemo(() => {
    if (!attendanceList) {
      return selected
        ? {
            [selected]: {
              customStyles: {
                container: {
                  borderWidth: 2,
                  borderColor: '#3B82F6',
                  borderRadius: 8,
                  width: '90%',
                },
                text: {
                  color: '#3B82F6',
                  fontWeight: 'bold',
                },
              },
            },
          }
        : {};
    }

    const marked: any = {};

    Object.entries(attendanceList).forEach(([dateKey, attendance]) => {
      const displayStatus = getDisplayStatus(attendance.state);

      if (displayStatus) {
        marked[dateKey] = {
          customStyles: {
            container: {
              backgroundColor: displayStatus.color,
              borderRadius: 8,
              width: '90%',
              ...(selected === dateKey && {
                borderWidth: 2,
                borderColor: '#000',
              }),
            },
            text: {
              color: 'white',
              fontWeight: 'bold',
            },
          },
        };
      }
    });

    // Nếu ngày được chọn không có trong markedDates, thêm highlight
    if (selected && !marked[selected]) {
      marked[selected] = {
        customStyles: {
          container: {
            borderWidth: 2,
            borderColor: '#3B82F6',
            borderRadius: 8,
            width: '90%',
          },
          text: {
            color: '#3B82F6',
            fontWeight: 'bold',
          },
        },
      };
    }

    return marked;
  }, [attendanceList, selected]);

  // Memoize day data
  const dayData = useMemo(
    () => (selected && attendanceList ? attendanceList[selected] : null),
    [selected, attendanceList],
  );

  const handleMonthChange = useCallback((month: any) => {
    setDate(month.dateString);
  }, []);

  const handleDayPress = useCallback((day: any) => {
    setSelected(day.dateString);
  }, []);

  // Render timesheet details
  const renderTimesheetDetails = useMemo(() => {
    if (!selected || !dayData) {
      return selected ? <EmptyState /> : null;
    }

    const displayStatus = getDisplayStatus(dayData.state);
    const statusColor = displayStatus?.color || '#9CA3AF';
    const statusLabel = displayStatus?.label || 'Không xác định';
    const { dayOfWeek, formattedDate } = formatDate(selected);

    return (
      <View bg="$white" br={scale(16)} p={scale(20)} mv={verticalScale(20)} style={CARD_SHADOW}>
        {/* Header */}
        <View fd="row" jc="space-between" ai="center" mb={verticalScale(20)}>
          <Text fontSize={scale(18)} fontW="bold" color="$black">
            Chi tiết ngày công
          </Text>
          <View fd="row" ai="center" gap={horizontalScale(8)}>
            <View bg={statusColor} br={scale(12)} w={horizontalScale(12)} h={verticalScale(12)} />
            <Text fontSize={scale(12)} fontW="500" color="$grey">
              {statusLabel}
            </Text>
          </View>
        </View>

        {/* Date Info */}
        <View bg="$blue50" br={scale(12)} p={scale(16)} mb={verticalScale(16)}>
          <Text fontSize={scale(16)} fontW="600" color="$blue700" textAlign="center">
            {dayOfWeek}, {formattedDate}
          </Text>
        </View>

        {/* Explanation Info */}
        {!!(dayData.exp_reason_label || dayData.exp_state_label) && (
          <View gap={verticalScale(12)} mb={verticalScale(16)}>
            {!!dayData.exp_reason_label && (
              <View bg="$white" br={scale(12)} p={scale(12)} borderWidth={1} borderColor="$border">
                <Text fontSize={scale(12)} color="$grey" mb={verticalScale(12)}>
                  Loại giải trình
                </Text>
                <Text fontSize={scale(14)} fontW="600" color="$black">
                  {dayData.exp_reason_label}
                </Text>
              </View>
            )}
            {!!dayData.exp_state_label && (
              <View bg="$white" br={scale(12)} p={scale(12)} borderWidth={1} borderColor="$border">
                <Text fontSize={scale(12)} color="$grey" mb={verticalScale(12)}>
                  Trạng thái phiếu
                </Text>
                <Text fontSize={scale(14)} fontW="600" color="$black">
                  {dayData.exp_state_label}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Main Info Grid */}
        <View gap={verticalScale(12)}>
          {/* Shift Info */}
          {dayData.actual_resource_calendar_display_name && (
            <InfoCard
              label="Ca làm việc"
              value={dayData.actual_resource_calendar_display_name}
              bgColor="$l_green"
              textColor="$d_green"
              flex={0}
            />
          )}

          {/* Check In/Out Times */}
          <View fd="row" gap={horizontalScale(12)}>
            <InfoCard
              label="Giờ vào"
              value={formatTime(dayData.check_in)}
              bgColor="$l_green"
              textColor="$d_green"
            />
            <InfoCard
              label="Giờ ra"
              value={formatTime(dayData.check_out)}
              bgColor="$blue50"
              textColor="$blue"
            />
          </View>

          {/* Work Info */}
          <View fd="row" gap={horizontalScale(12)}>
            <InfoCard
              label="Công thực tế"
              value={dayData.work_normal}
              bgColor="$border"
              textColor="$grey"
            />
            <InfoCard
              label="Đi muộn (phút)"
              value={dayData.late_minutes}
              bgColor="$l_yellow"
              textColor="$d_yellow"
            />
            <InfoCard
              label="Về sớm (phút)"
              value={dayData.early_leave_minutes}
              bgColor="$l_red"
              textColor="$d_red"
            />
          </View>

          {dayData?.state === TimesheetState.HAS_REPORT &&
            !dayData?.exp_id &&
            viewType === TimeSheetViewType.MY_TIME_SHEET && (
              <Text
                mt={scale(-6)}
                fontSize={scale(14)}
                fontW="400"
                fontStyle="italic"
                color="$detractive"
              >
                Đã tạo giải trình công
              </Text>
            )}
          {viewType === TimeSheetViewType.MY_TIME_SHEET && (
            <View fd={'row'} gap={scale(16)} mt={scale(10)}>
              <View f={1}>
                <Button
                  onPress={() =>
                    navigate(RouteName.LeaveRegistrationEditor, {
                      date: dayjs(selected, { utc: true }).toDate().toString(),
                    })
                  }
                >
                  <Button.Text>Tạo đơn xin nghỉ</Button.Text>
                </Button>
              </View>
              <View f={1}>
                <Button
                  disabled={!dayData?.exp_id && dayData?.state === TimesheetState.HAS_REPORT}
                  onPress={() => {
                    if (dayData?.exp_id) {
                      navigate(RouteName.TimesheetExplanationDetail, {
                        id: dayData.exp_id,
                        type: 'edit',
                      });
                    } else {
                      navigate(RouteName.TimesheetExplanationDetail, {
                        type: 'create',
                        date: selected,
                      });
                    }
                  }}
                >
                  <Button.Text>
                    {dayData?.exp_id ? 'Xem giải trình' : 'Tạo phiếu giải trình'}
                  </Button.Text>
                </Button>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  }, [selected, dayData, viewType]);

  return (
    <View f={1}>
      <Header
        title={
          viewType === TimeSheetViewType.MY_TIME_SHEET ? 'Lịch của tôi' : 'Bảng công nhân viên'
        }
        rightAction={
          hasPermission ? (
            <TouchableOpacity
              onPress={() => navigate(RouteName.AttendanceViolation)}
              activeOpacity={0.7}
            >
              <IcInformation size={scale(24)} />
            </TouchableOpacity>
          ) : undefined
        }
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {viewType === TimeSheetViewType.MANAGE_TIME_SHEET && (
          <View p={horizontalScale(15)} mt={verticalScale(10)}>
            <TimeSheetFilter selectedEmployee={selectedEmployee} onChange={setSelectedEmployee} />
          </View>
        )}
        {isLoadingAttendanceList && <ActivityIndicator />}
        {!!(!isLoadingAttendanceList && !attendanceList) && (
          <View ai="center" paddingVertical={verticalScale(40)}>
            <Text color="$grey" fontSize={scale(14)}>
              Không có dữ liệu
            </Text>
          </View>
        )}
        <View gap={scale(10)} p={horizontalScale(15)} display={attendanceList ? 'block' : 'none'}>
          <CardContainer>
            <View p={scale(8)}>
              <StatusLegend />

              <View
                mt={verticalScale(12)}
                pt={verticalScale(12)}
                borderTopWidth={1}
                borderTopColor="$border"
              >
                <View fd="row" jc="space-between" ai="center" mb={verticalScale(4)}>
                  <Text fontSize={scale(13)} color="$grey">
                    Công chuẩn trên tháng:
                  </Text>
                  <Text fontSize={scale(14)} fontW="600">
                    {attendanceSummary?.standard_work} công
                  </Text>
                </View>
                <View fd="row" jc="space-between" ai="center">
                  <Text fontSize={scale(13)} color="$grey">
                    Công thực tế trên tháng:
                  </Text>
                  <Text fontSize={scale(14)} fontW="600" color="$blue700">
                    {attendanceSummary?.total_work ?? 0} công
                  </Text>
                </View>
              </View>
            </View>
            <Calendar
              onMonthChange={handleMonthChange}
              onDayPress={handleDayPress}
              markingType="custom"
              markedDates={markedDates}
              dayComponent={({ date, state }: any) => {
                const marking = markedDates[date.dateString];
                const expState = attendanceList?.[date.dateString]?.exp_state;
                const isCheck = expState === 'draft' || expState === 'waiting';
                const isClose = expState === 'refused' || expState === 'cancel';

                return (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handleDayPress(date)}
                    style={[
                      { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
                      marking?.customStyles?.container,
                    ]}
                  >
                    <Text
                      style={[
                        { fontSize: 14, color: state === 'disabled' ? '#d9e1e8' : '#2d4150' },
                        marking?.customStyles?.text,
                      ]}
                    >
                      {date.day}
                    </Text>
                    {(isCheck || isClose) && (
                      <View
                        style={{
                          position: 'absolute',
                          top: -4,
                          right: -4,
                          backgroundColor: 'white',
                          borderRadius: 10,
                        }}
                      >
                        {isCheck ? (
                          <IcCheck size={scale(12)} tintColor="#10B981" />
                        ) : (
                          <IcClose size={scale(12)} tintColor="#EF4444" />
                        )}
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </CardContainer>
          {renderTimesheetDetails}
        </View>
      </ScrollView>
    </View>
  );
};

export default Timesheet;
