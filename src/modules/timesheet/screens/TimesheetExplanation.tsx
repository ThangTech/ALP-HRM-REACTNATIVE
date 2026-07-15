import React, { useRef, useState, useMemo, useEffect } from 'react';
import { View, getTokens } from 'tamagui';
import {
  Header,
  Pressable,
  Text,
  DateTimePickerModal,
  OptionPickerModal,
  OptionItem,
} from 'components';
import { IcPlus, IcCalendar, IcExplanation, IcDropdown } from 'assets/svgs';
import { horizontalScale, scale, verticalScale } from 'utils';
import { StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import dayjs from 'dayjs';
import BottomSheet from '@gorhom/bottom-sheet';
import { navigate } from 'navigators';
import { AppStackParamList, RouteName } from 'configs/navigation';
import { useTimesheetExplanation } from 'timesheet/hooks';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useIsFocused } from '@react-navigation/native';
import { MAP_STATUS, WAITING_ME } from 'configs/contansts';
import NextStepText from 'components/NextStepText';
import OptionPicker from 'modules/leave-registration/list/components/OptionPicker';
import { LeaveRegistrationViewType } from 'common/enum/leave-registration-view-type';

type TimesheetExplanationProps = NativeStackScreenProps<AppStackParamList, 'TimesheetExplanation'>;

// Constants
const STATUS_OPTIONS: OptionItem[] = [
  { key: 'all', value: MAP_STATUS.get('all') ?? '' },
  { key: WAITING_ME, value: MAP_STATUS.get(WAITING_ME) ?? '' },
  { key: 'draft', value: MAP_STATUS.get('draft') ?? '' },
  { key: 'waiting', value: MAP_STATUS.get('waiting') ?? '' },
  { key: 'approved', value: MAP_STATUS.get('approved') ?? '' },
  { key: 'refused', value: MAP_STATUS.get('refused') ?? '' },
  { key: 'cancel', value: MAP_STATUS.get('cancel') ?? '' },
];

const STATUS_COLORS = {
  draft: {
    bg: getTokens().color.d_grey.val,
    text: getTokens().color.white.val,
  },
  waiting: {
    bg: getTokens().color.l_yellow.val,
    text: getTokens().color.d_yellow.val,
  },
  approved: {
    bg: getTokens().color.l_green.val,
    text: getTokens().color.forest.val,
  },
  refused: {
    bg: getTokens().color.l_red.val,
    text: getTokens().color.d_red.val,
  },
  cancel: {
    bg: getTokens().color.l_red.val,
    text: getTokens().color.d_red.val,
  },
};

const TimesheetExplanation = ({ route }: TimesheetExplanationProps) => {
  const { viewType } = route.params || {};
  const activeTab = viewType === LeaveRegistrationViewType.APPROVE ? 'approval' : 'my';
  const [fromDate, setFromDate] = useState(dayjs().startOf('month').toDate());
  const [toDate, setToDate] = useState(dayjs().endOf('month').toDate());
  const [selectedStatus, setSelectedStatus] = useState<OptionItem>(
    STATUS_OPTIONS[0] || { key: 'all', value: 'Tất cả' },
  );
  const [employee, setEmployee] = useState<OptionItem>({ key: 'all', value: 'Tất cả' });
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  // Prepare params based on active tab
  const params = useMemo(
    () => ({
      dateFrom: dayjs(fromDate).format('YYYY-MM-DD'),
      dateTo: dayjs(toDate).format('YYYY-MM-DD'),
      state: selectedStatus.key.toString(),
      limit: 15,
      // Chỉ thêm flag này khi ở tab "Cần duyệt"
      ...(activeTab === 'approval' && { approve_hr_attendance_explanation: true }),
      ...(activeTab === 'approval' && { employee_id: employee.key.toString() }),
    }),
    [fromDate, toDate, selectedStatus.key, activeTab, employee],
  );

  // Single hook instance - switch params based on active tab
  const [
    { timesheetExplanationList, isLoadingMore, isReachingEnd, employeeOptions },
    { refresh, loadMore },
  ] = useTimesheetExplanation(params);

  // Refs
  const dateTimePickerRef = useRef<BottomSheet>(null);
  const optionPickerRef = useRef<BottomSheet>(null);

  // Config động cho DateTimePickerModal
  const [dateTimeConfig, setDateTimeConfig] = useState<{
    mode: 'date' | 'time' | 'datetime';
    initialValue?: Date;
    title: string;
    onConfirm: (date: Date) => void;
  }>({
    mode: 'date',
    initialValue: undefined,
    title: '',
    onConfirm: () => {},
  });

  // Handlers
  const handleStatusSelect = (status: OptionItem) => {
    setSelectedStatus(status);
  };

  const getStatusLabel = (status: string) => {
    return STATUS_OPTIONS.find((s) => s.key === status)?.value || '';
  };

  // Render Functions
  const renderHeader = () => {
    return (
      <Header
        title="Giải trình công"
        rightAction={
          <Pressable
            onPress={() => navigate(RouteName.TimesheetExplanationDetail, { type: 'create' })}
          >
            <IcPlus tintColor="white" size={scale(15)} />
          </Pressable>
        }
      />
    );
  };

  const renderDatePicker = (label: string, date: Date, onConfirm: (date: Date) => void) => {
    return (
      <View f={1}>
        <Text fontSize={scale(14)} fontWeight="500" mb={verticalScale(8)} color="$black">
          {label}
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            setDateTimeConfig({
              mode: 'date',
              initialValue: date,
              title: label,
              onConfirm: onConfirm,
            });
            dateTimePickerRef.current?.expand();
          }}
        >
          <View
            fd="row"
            ai="center"
            jc="space-between"
            bg="$white"
            br={scale(8)}
            ph={horizontalScale(12)}
            pv={verticalScale(12)}
            borderWidth={1}
            borderColor="$border"
          >
            <Text fontSize={scale(14)} color="$black">
              {dayjs(date).format('DD/MM/YYYY')}
            </Text>
            <IcCalendar size={scale(20)} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderStatusDropdown = () => {
    return (
      <View f={1} mv={verticalScale(16)}>
        <Text fontSize={scale(14)} fontWeight="500" mb={verticalScale(8)} color="$black">
          Trạng thái
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            optionPickerRef.current?.expand();
          }}
        >
          <View
            fd="row"
            ai="center"
            jc="space-between"
            bg="$white"
            br={scale(8)}
            ph={horizontalScale(12)}
            pv={verticalScale(12)}
            borderWidth={1}
            borderColor="$border"
          >
            <Text fontSize={scale(14)} color="$black">
              {selectedStatus.value}
            </Text>
            <IcDropdown size={scale(20)} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmployeeOptionPicker = () => {
    if (activeTab !== 'approval') {
      return null;
    }
    return (
      <View f={1} mv={verticalScale(16)}>
        <OptionPicker
          value={employee}
          label="Nhân viên"
          placeholder="Tất cả"
          numberOfLines={1}
          searchable
          options={employeeOptions ?? []}
          onChange={(item) => setEmployee(item)}
        />
      </View>
    );
  };

  const renderItem = ({ item }: { item: TimesheetExplanationList }) => {
    const statusColor = STATUS_COLORS[item.state as keyof typeof STATUS_COLORS];
    const isApprovalTab = activeTab === 'approval';

    return (
      <View
        bg="$white"
        br={scale(12)}
        p={scale(16)}
        mb={verticalScale(12)}
        borderWidth={1}
        borderColor="$border"
        style={styles.itemShadow}
      >
        <Pressable
          onPress={() =>
            navigate(RouteName.TimesheetExplanationDetail, { id: item.id, type: 'edit' })
          }
        >
          <View fd="row" ai="center" jc="space-between">
            <View fd="row" ai="center" f={1}>
              <IcExplanation size={scale(36)} />
              <View ml={horizontalScale(12)} f={1}>
                <Text fontSize={scale(14)} fontWeight="600" color="$black" numberOfLines={1}>
                  {item.explanation_reason_label}
                </Text>
                {isApprovalTab && (
                  <Text fontSize={scale(14)} color="$black" mt={verticalScale(2)}>
                    {item.employee_name} ({item.employee_code})
                  </Text>
                )}
                <NextStepText next_step_name={item.next_step_data?.next_step_name} />
                <Text fontSize={scale(12)} color="$grey" mt={verticalScale(4)}>
                  {dayjs(item.explanation_date).format('DD/MM/YYYY')}
                </Text>
              </View>
            </View>
            <View bg={statusColor.bg} br={scale(12)} ph={horizontalScale(12)} pv={verticalScale(6)}>
              <Text fontSize={scale(12)} fontWeight="500" color={statusColor.text}>
                {getStatusLabel(item.state)}
              </Text>
            </View>
          </View>
        </Pressable>
      </View>
    );
  };

  const renderEmptyList = () => {
    return (
      <View ai="center" jc="center" pv={verticalScale(40)}>
        <Text color="$grey" fontSize={scale(14)}>
          Không có dữ liệu
        </Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (!isLoadingMore || isReachingEnd) {
      return null;
    }
    return (
      <View pv={verticalScale(20)} ai="center">
        <Text color="$grey" fontSize={scale(12)}>
          Đang tải...
        </Text>
      </View>
    );
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && !isReachingEnd) {
      loadMore();
    }
  };

  const handleRefresh = async () => {
    setIsManualRefreshing(true);
    await refresh();
    setIsManualRefreshing(false);
  };

  return (
    <View f={1} bg="$bg">
      {renderHeader()}

      <View f={1} ph={horizontalScale(16)} pt={verticalScale(16)}>
        {/* Date Filters */}
        <View fd="row" gap={horizontalScale(12)}>
          {renderDatePicker('Từ ngày', fromDate, setFromDate)}
          {renderDatePicker('Đến ngày', toDate, setToDate)}
        </View>

        {/* Status Dropdown */}
        <View fd="row" gap={horizontalScale(12)}>
          {renderEmployeeOptionPicker()}
          {renderStatusDropdown()}
        </View>

        {/* List */}
        <FlatList
          data={timesheetExplanationList || []}
          renderItem={renderItem}
          keyExtractor={(item) => `${activeTab}-${item.id}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyList}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl refreshing={isManualRefreshing} onRefresh={handleRefresh} />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
        />
      </View>

      {/* Modal dùng chung cho DateTimePicker */}
      <DateTimePickerModal
        bottomSheetRef={dateTimePickerRef}
        mode={dateTimeConfig.mode}
        initialValue={dateTimeConfig.initialValue}
        title={dateTimeConfig.title}
        onConfirm={dateTimeConfig.onConfirm}
      />
      {/* Modal dùng chung cho OptionPicker */}
      <OptionPickerModal
        bottomSheetRef={optionPickerRef}
        data={
          activeTab === 'approval'
            ? STATUS_OPTIONS
            : STATUS_OPTIONS.filter((it) => it.key !== WAITING_ME)
        }
        selectedValue={selectedStatus.key}
        title="Trạng thái"
        onSelect={handleStatusSelect}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: verticalScale(20),
  },
  itemShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  actionBtn: {
    paddingVertical: verticalScale(8),
  },
});

export default TimesheetExplanation;
