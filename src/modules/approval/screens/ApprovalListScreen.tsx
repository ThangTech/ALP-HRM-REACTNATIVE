import React, { useRef, useState, useMemo, useEffect } from 'react';
import { View, getTokens } from 'tamagui';
import {
  Header,
  Pressable,
  Text,
  OptionPickerModal,
  OptionItem,
  DateTimePickerModal,
} from 'components';
import { IcPlus, IcDropdown, IcExplanation, IcCalendar } from 'assets/svgs';
import { scale, verticalScale, horizontalScale } from 'utils';
import { StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import dayjs from 'dayjs';
import { useIsFocused } from '@react-navigation/native';
import { navigate } from 'navigators';
import { RouteName } from 'configs/navigation';
import useApprovalList, { ApprovalItem } from '../hooks/useApprovalList';

const STATUS_OPTIONS: OptionItem[] = [
  { key: 'all', value: 'Tất cả' },
  { key: 'new', value: 'Cần nộp' },
  { key: 'pending', value: 'Đã gửi' },
  { key: 'approved', value: 'Đã phê duyệt' },
  { key: 'refused', value: 'Bị từ chối' },
  { key: 'cancel', value: 'Đã hủy' },
];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  new: {
    bg: getTokens().color.d_grey.val,
    text: getTokens().color.white.val,
  },
  pending: {
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

const DEFAULT_STATUS_COLOR = {
  bg: getTokens().color.d_grey.val,
  text: getTokens().color.white.val,
};

const ApprovalListScreen = () => {
  const [fromDate, setFromDate] = useState(dayjs().startOf('month').toDate());
  const [toDate, setToDate] = useState(dayjs().endOf('month').toDate());
  const [selectedStatus, setSelectedStatus] = useState<OptionItem>(STATUS_OPTIONS[0]!);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);

  const optionPickerRef = useRef<BottomSheet>(null);
  const dateTimePickerRef = useRef<BottomSheet>(null);
  const isFocused = useIsFocused();
  const isFirstMount = useRef(true);

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

  const filterParams = useMemo(
    () => ({
      request_status: selectedStatus.key as string,
      date_start: dayjs(fromDate).format('YYYY-MM-DD'),
      date_end: dayjs(toDate).format('YYYY-MM-DD'),
    }),
    [selectedStatus.key, fromDate, toDate],
  );

  const [{ approvalList, isLoadingMore, isReachingEnd }, { refresh, loadMore }] =
    useApprovalList(filterParams);

  useEffect(() => {
    if (isFocused) {
      if (isFirstMount.current) {
        isFirstMount.current = false;
      } else {
        refresh();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  const handleRefresh = async () => {
    setIsManualRefreshing(true);
    await refresh();
    setIsManualRefreshing(false);
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && !isReachingEnd) {
      loadMore();
    }
  };

  const renderHeader = () => (
    <Header
      title="Danh sách phê duyệt"
      rightAction={
        <Pressable onPress={() => navigate(RouteName.ApprovalCreate)}>
          <IcPlus tintColor="white" size={scale(15)} />
        </Pressable>
      }
    />
  );

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

  const renderStatusDropdown = () => (
    <View f={1} mv={verticalScale(12)}>
      <Text fontSize={scale(14)} fontWeight="500" mb={verticalScale(8)} color="$black">
        Trạng thái
      </Text>
      <TouchableOpacity activeOpacity={0.7} onPress={() => optionPickerRef.current?.expand()}>
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

  const renderItem = ({ item }: { item: ApprovalItem }) => {
    const statusColor = STATUS_COLORS[item.request_status] ?? DEFAULT_STATUS_COLOR;

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
        <Pressable onPress={() => navigate(RouteName.ApprovalDetail, { id: item.id })}>
          <View fd="row" ai="center" jc="space-between">
            <View fd="row" ai="center" f={1}>
              <IcExplanation size={scale(36)} />
              <View ml={horizontalScale(12)} f={1}>
                <Text fontSize={scale(14)} fontWeight="600" color="$black" numberOfLines={1}>
                  {item.name}
                </Text>
                <Text fontSize={scale(13)} color="$grey" mt={verticalScale(4)}>
                  {item.code}
                </Text>
                {item.employee_name ? (
                  <Text fontSize={scale(13)} color="$black" mt={verticalScale(2)}>
                    {item.employee_name}
                  </Text>
                ) : null}
              </View>
            </View>
            <View bg={statusColor.bg} br={scale(12)} ph={horizontalScale(12)} pv={verticalScale(6)}>
              <Text fontSize={scale(12)} fontWeight="500" color={statusColor.text}>
                {item.request_status_label}
              </Text>
            </View>
          </View>
        </Pressable>
      </View>
    );
  };

  const renderEmptyList = () => (
    <View ai="center" jc="center" pv={verticalScale(40)}>
      <Text color="$grey" fontSize={scale(14)}>
        Không có dữ liệu
      </Text>
    </View>
  );

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

  return (
    <View f={1} bg="$bg">
      {renderHeader()}

      <View f={1} ph={horizontalScale(16)} pt={verticalScale(20)}>
        <View fd="row" gap={horizontalScale(12)}>
          {renderDatePicker('Từ ngày', fromDate, setFromDate)}
          {renderDatePicker('Đến ngày', toDate, setToDate)}
        </View>

        <View fd="row" gap={horizontalScale(12)}>
          {renderStatusDropdown()}
        </View>

        <FlatList
          data={approvalList}
          renderItem={renderItem}
          keyExtractor={(item) => `approval-${item.id}`}
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

      <DateTimePickerModal
        bottomSheetRef={dateTimePickerRef}
        mode={dateTimeConfig.mode}
        initialValue={dateTimeConfig.initialValue}
        title={dateTimeConfig.title}
        onConfirm={dateTimeConfig.onConfirm}
      />
      <OptionPickerModal
        bottomSheetRef={optionPickerRef}
        data={STATUS_OPTIONS}
        selectedValue={selectedStatus.key}
        title="Trạng thái"
        onSelect={(status) => setSelectedStatus(status)}
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
});

export default ApprovalListScreen;
