import { Header, Screen, Text } from 'components';
import React, { useCallback, useRef, useMemo } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ListRenderItem,
  ScrollView,
} from 'react-native';
import { View } from 'tamagui';
import { scale, verticalScale } from 'utils';
import { IcSearch } from 'assets/svgs';
import useAttendanceViolation, {
  ViolationEmployee,
  ViolationTabType,
} from '../hooks/useAttendanceViolation';
import { navigate } from 'navigators';
import { RouteName } from 'configs/navigation';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import OptionPickerModal2 from 'components/base/OptionPickerModal2';
import { OptionItem } from 'components';

const TABS: { key: ViolationTabType; label: string }[] = [
  { key: 'manager', label: 'Trưởng bộ phận' },
  { key: 'department', label: 'Phòng ban' },
  { key: 'group', label: 'Chi nhánh' },
  { key: 'job', label: 'Chức danh' },
  { key: 'employee', label: 'Nhân viên' },
];

const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 6,
  elevation: 3,
} as const;

const ViolationStatCard = ({
  label,
  count,
  bgColor,
  textColor,
}: {
  label: string;
  count: number;
  bgColor: string;
  textColor: string;
}) => (
  <View style={[styles.statCard, { backgroundColor: bgColor }]}>
    <Text fontSize={scale(12)} color={textColor} ta="center" mt={verticalScale(2)}>
      {label}
    </Text>
    <Text fontSize={scale(22)} fontW="700" color={textColor}>
      {count}
    </Text>
  </View>
);

const EmployeeViolationItem = ({
  item,
  onPress,
}: {
  item: ViolationEmployee;
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
    <View style={styles.employeeItem}>
      <View style={styles.employeeInitial}>
        <Text fontSize={scale(16)} fontW="700" color="$white">
          {item.employee_name.charAt(0)}
        </Text>
      </View>
      <View style={styles.employeeInfo}>
        <Text fontSize={scale(14)} fontW="600" color="$black" numberOfLines={1}>
          {item.employee_name}
        </Text>
        <Text fontSize={scale(12)} color="$grey" mt={verticalScale(2)}>
          {item.employee_code} • {item.department}
          {item.group ? ` • ${item.group}` : ''}
        </Text>
        <View style={styles.violationBadgeRow}>
          {item.total_late > 0 && (
            <View style={styles.violationBadge} bg="#FFECEC">
              <Text fontSize={scale(12)} color="#92400E">
                Đi muộn: {item.total_late}
              </Text>
            </View>
          )}
          {item.total_early > 0 && (
            <View style={styles.violationBadge} bg="#FFF4DB">
              <Text fontSize={scale(12)} color="#816116ff">
                Về sớm: {item.total_early}
              </Text>
            </View>
          )}
          {item.total_missing > 0 && (
            <View style={styles.violationBadge} bg="#D1E3FF">
              <Text fontSize={scale(12)} color="#5B21B6">
                Quên chấm: {item.total_missing}
              </Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.totalBadge}>
        <Text fontSize={scale(18)} fontW="700" color="#DC2626">
          {item.total_violations}
        </Text>
        <Text fontSize={scale(12)} color="#DC2626">
          lần
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

const AttendanceViolation = () => {
  const {
    month,
    year,
    setMonth,
    setYear,
    activeTab,
    handleTabChange,
    selectedIds,
    setSelectedIds,
    searchText,
    setSearchText,
    departmentOptions,
    groupOptions,
    jobOptions,
    employeeOptions,

    filteredEmployees,
    isLoadingViolationList,
    violationListAccessError,
  } = useAttendanceViolation();

  const dropdownRef = useRef<BottomSheetModal>(null);

  const getDropdownOptions = () => {
    if (activeTab === 'department') return departmentOptions;
    if (activeTab === 'group') return groupOptions;
    if (activeTab === 'job') return jobOptions;
    return employeeOptions;
  };

  const getDropdownLabel = () => {
    const options = getDropdownOptions();
    if (selectedIds.length === 0) {
      if (activeTab === 'department') return 'Chọn phòng ban';
      if (activeTab === 'group') return 'Chọn chi nhánh';
      if (activeTab === 'job') return 'Chọn chức danh';
      return 'Chọn nhân viên';
    }
    if (selectedIds.length === 1) {
      return options.find((o) => o.key === selectedIds[0]?.toString())?.value || 'Đã chọn 1';
    }
    return `Đã chọn ${selectedIds.length}`;
  };

  const handleDropdownSelect = (item: OptionItem) => {
    setSelectedIds([Number(item.key)]);
  };

  const handleNavigateDetail = useCallback(
    (item: ViolationEmployee) => {
      navigate(RouteName.AttendanceViolationDetail, {
        employeeId: item.employee_id,
        employeeName: item.employee_name,
        employeeCode: item.employee_code,
        department: item.department,
        group: item.group,
        month,
        year,
      });
    },
    [month, year],
  );

  // Month navigation
  const goToPrevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    const today = new Date();
    if (
      year < today.getFullYear() ||
      (year === today.getFullYear() && month < today.getMonth() + 1)
    ) {
      if (month === 12) {
        setMonth(1);
        setYear((y) => y + 1);
      } else {
        setMonth((m) => m + 1);
      }
    }
  };

  const stats = useMemo(() => {
    return {
      totalLate: filteredEmployees.reduce((s: number, e: ViolationEmployee) => s + e.total_late, 0),
      totalEarly: filteredEmployees.reduce(
        (s: number, e: ViolationEmployee) => s + e.total_early,
        0,
      ),
      totalMissing: filteredEmployees.reduce(
        (s: number, e: ViolationEmployee) => s + e.total_missing,
        0,
      ),
    };
  }, [filteredEmployees]);

  const renderHeader = () => <Header title="Vi phạm chấm công" />;

  const renderMonthPicker = () => (
    <TouchableOpacity activeOpacity={1} style={[styles.monthPicker]}>
      <TouchableOpacity onPress={goToPrevMonth} style={styles.monthArrow}>
        <Text fontSize={scale(18)} color="$black">
          {'<'}
        </Text>
      </TouchableOpacity>
      <Text fontSize={scale(15)} fontW="500" color="$black">
        Tháng {month}/{year}
      </Text>
      <TouchableOpacity onPress={goToNextMonth} style={styles.monthArrow}>
        <Text fontSize={scale(18)} color="$black">
          {'>'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderTabsAndDropdown = () => (
    <TouchableOpacity activeOpacity={1}>
      <View style={styles.tabRowWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabRowContent}
        >
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabItem, activeTab === tab.key && styles.tabItemActive]}
              onPress={() => handleTabChange(tab.key)}
              activeOpacity={0.8}
            >
              <Text
                fontSize={scale(13)}
                fontW={activeTab === tab.key ? '600' : '500'}
                color={activeTab === tab.key ? '$white' : '$black'}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View ph={scale(4)}>
        {activeTab !== 'manager' && (
          <>
            <Text fontSize={scale(14)} fontW="400" color="$black" mb={scale(8)}>
              {TABS.find((t) => t.key === activeTab)?.label}
            </Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => dropdownRef.current?.present()}
              activeOpacity={0.8}
            >
              <Text fontSize={scale(14)} color={selectedIds.length > 0 ? '$black' : '$grey'} f={1}>
                {getDropdownLabel()}
              </Text>
              <Text fontSize={scale(12)} color="$grey">
                ▼
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderStats = () => {
    if ((selectedIds.length === 0 && activeTab !== 'manager') || filteredEmployees.length === 0)
      return null;
    return (
      <View style={styles.statsRow}>
        <ViolationStatCard
          label="Số người vi phạm"
          count={filteredEmployees.length}
          bgColor="#F3F4F6"
          textColor="#000000"
        />
        <ViolationStatCard
          label="Đi muộn"
          count={stats.totalLate}
          bgColor="#FFECEC"
          textColor="#000000"
        />
        <ViolationStatCard
          label="Về sớm"
          count={stats.totalEarly}
          bgColor="#FFF4DB"
          textColor="#000000"
        />
        <ViolationStatCard
          label="Quên chấm"
          count={stats.totalMissing}
          bgColor="#D1E3FF"
          textColor="#000000"
        />
      </View>
    );
  };

  const renderSearch = () => {
    if (activeTab === 'employee' || activeTab === 'manager') return null;
    return (
      <View style={[styles.card, styles.searchContainer]}>
        <IcSearch />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm nhân viên vi phạm..."
          placeholderTextColor="#9CA3AF"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
    );
  };

  const renderListHeader = () => {
    return (
      <TouchableOpacity activeOpacity={1} style={styles.headerContainer}>
        {renderMonthPicker()}
        {renderTabsAndDropdown()}

        {isLoadingViolationList ? (
          <View f={1} ai="center" jc="center" mt={verticalScale(60)}>
            <ActivityIndicator size="large" color="#005BAB" />
            <Text fontSize={scale(13)} color="$grey" mt={scale(12)}>
              Đang tải dữ liệu...
            </Text>
          </View>
        ) : (
          <>
            {renderStats()}

            {renderSearch()}

            {!isLoadingViolationList && selectedIds.length === 0 && activeTab !== 'manager' && (
              <View style={[styles.card, CARD_SHADOW, styles.emptyHint, { marginTop: scale(12) }]}>
                <Text fontSize={scale(13)} color="$grey" ta="center">
                  Vui lòng chọn phòng ban / chi nhánh / nhân viên để xem danh sách
                </Text>
              </View>
            )}
            {!isLoadingViolationList &&
            (selectedIds.length > 0 || activeTab === 'manager') &&
            violationListAccessError ? (
              <View style={[styles.card, CARD_SHADOW, styles.emptyHint, { marginTop: scale(12) }]}>
                <Text fontSize={scale(13)} color="$grey" ta="center">
                  {violationListAccessError}
                </Text>
              </View>
            ) : null}
            {!isLoadingViolationList &&
            (selectedIds.length > 0 || activeTab === 'manager') &&
            !violationListAccessError &&
            filteredEmployees.length === 0 ? (
              <View style={[styles.card, CARD_SHADOW, styles.emptyHint, { marginTop: scale(12) }]}>
                <Text fontSize={scale(14)} fontW="700" color="$black" mb={verticalScale(8)}>
                  Danh sách vi phạm (0)
                </Text>
                <Text fontSize={scale(13)} color="$grey" ta="center">
                  Không có nhân viên vi phạm trong tháng này
                </Text>
              </View>
            ) : null}

            {!isLoadingViolationList &&
              (selectedIds.length > 0 || activeTab === 'manager') &&
              !violationListAccessError &&
              filteredEmployees.length > 0 && (
                <View style={styles.violationListHeader}>
                  <Text fontSize={scale(14)} fontW="700" color="$black">
                    Danh sách vi phạm ({filteredEmployees.length})
                  </Text>
                </View>
              )}
          </>
        )}
      </TouchableOpacity>
    );
  };

  const renderItem: ListRenderItem<ViolationEmployee> = useCallback(
    ({ item, index }) => {
      const isLast = index === filteredEmployees.length - 1;
      return (
        <View style={[styles.itemContainer, isLast && styles.lastItemContainer]}>
          <EmployeeViolationItem item={item} onPress={() => handleNavigateDetail(item)} />
        </View>
      );
    },
    [filteredEmployees.length, handleNavigateDetail],
  );

  const renderBody = () => {
    return (
      <FlatList
        data={
          !isLoadingViolationList &&
          (selectedIds.length > 0 || activeTab === 'manager') &&
          !violationListAccessError
            ? filteredEmployees
            : []
        }
        keyExtractor={(item) => item.employee_id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={renderListHeader()}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: scale(16), paddingBottom: verticalScale(30) }}
        initialNumToRender={10}
        windowSize={5}
        maxToRenderPerBatch={10}
      />
    );
  };

  return (
    <Screen scrollEnabled={false} style={styles.flex1}>
      {renderHeader()}

      {renderBody()}

      <OptionPickerModal2
        bottomSheetRef={dropdownRef}
        data={getDropdownOptions()}
        onSelect={handleDropdownSelect}
        searchable
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: scale(16),
    gap: scale(12),
    paddingBottom: verticalScale(30),
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: scale(16),
    padding: scale(16),
    marginBottom: scale(4),
  },
  monthPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  monthArrow: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: scale(10),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    width: scale(36),
    height: scale(36),
  },
  tabRowWrapper: {
    backgroundColor: '#ebebeb97',
    borderRadius: scale(14),
    marginBottom: scale(12),
  },
  tabRowContent: {
    padding: scale(4),
    flexDirection: 'row',
  },
  tabItem: {
    paddingVertical: scale(8),
    paddingHorizontal: scale(16),
    alignItems: 'center',
    borderRadius: scale(8),
  },
  tabItemActive: {
    backgroundColor: '#005BAB',
  },
  dropdownSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: scale(16),
    paddingHorizontal: scale(16),
    paddingTop: scale(14),
    paddingBottom: scale(14),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: scale(4),
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: scale(14),
    paddingHorizontal: scale(12),
    paddingVertical: scale(10),
    backgroundColor: '#FFFFFF',
  },
  statsRow: {
    flexDirection: 'row',
    gap: scale(15),
    padding: scale(12),
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(12),
    paddingVertical: scale(14),
    paddingHorizontal: scale(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(10),
    gap: scale(8),
  },
  searchIcon: {
    fontSize: scale(18),
  },
  searchInput: {
    flex: 1,
    fontSize: scale(14),
    color: '#111827',
    padding: 0,
  },
  employeeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: scale(12),
  },
  employeeInitial: {
    width: scale(42),
    height: scale(42),
    borderRadius: scale(21),
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  employeeInfo: {
    flex: 1,
  },
  violationBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(4),
    marginTop: scale(4),
  },
  violationBadge: {
    paddingHorizontal: scale(6),
    paddingVertical: scale(2),
    borderRadius: scale(4),
  },
  totalBadge: {
    alignItems: 'center',
    minWidth: scale(36),
  },
  accessError: {
    paddingVertical: scale(20),
  },
  emptyHint: {
    paddingVertical: scale(24),
  },
  itemContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: scale(16),
  },
  lastItemContainer: {
    paddingBottom: scale(16),
    borderBottomLeftRadius: scale(16),
    borderBottomRightRadius: scale(16),
    marginBottom: scale(4),
  },
  headerContainer: {
    gap: scale(12),
    paddingBottom: 0,
  },
  violationListHeader: {
    backgroundColor: '#FFFFFF',
    padding: scale(16),
    paddingBottom: 0,
    borderTopLeftRadius: scale(16),
    borderTopRightRadius: scale(16),
    marginTop: scale(12),
  },
  flex1: {
    flex: 1,
  },
});

export default AttendanceViolation;
