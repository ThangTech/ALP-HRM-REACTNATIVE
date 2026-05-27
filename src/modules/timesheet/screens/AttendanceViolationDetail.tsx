import { Header, Text } from 'components';
import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { View, ScrollView } from 'tamagui';
import { scale, verticalScale } from 'utils';
import { AppStackScreenProps } from 'navigators/AppNavigator';
import { RouteName } from 'configs/navigation';
import { useAttendanceViolationDetail, ViolationDetail } from '../hooks/useAttendanceViolation';

type Props = AppStackScreenProps<RouteName.AttendanceViolationDetail>;

const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 6,
  elevation: 3,
} as const;

const VIOLATION_COLORS: Record<string, { bg: string; text: string }> = {
  'Đi muộn': { bg: '#FFECEC', text: '#92400E' },
  'Về sớm': { bg: '#FFF4DB', text: '#816116ff' },
  'Quên chấm': { bg: '#D1E3FF', text: '#5B21B6' },
};

const getViolationTypes = (item: ViolationDetail): string[] => {
  const types: string[] = [];
  if (item.late) types.push('Đi muộn');
  if (item.early) types.push('Về sớm');
  if (item.is_missing_check) types.push('Quên chấm');
  return types;
};

const SummaryCard = ({
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
  <View style={[styles.summaryCard, { backgroundColor: bgColor }]}>
    <Text fontSize={scale(24)} fontW="700" color={textColor}>
      {count}
    </Text>
    <Text fontSize={scale(11)} color={textColor} ta="center">
      {label}
    </Text>
  </View>
);

const ViolationDetailItem = ({ item, index }: { item: ViolationDetail; index: number }) => {
  const violationTypes = getViolationTypes(item);

  return (
    <View style={styles.detailItem}>
      <View style={styles.indexBadge}>
        <Text fontSize={scale(12)} fontW="700" color="$white">
          {index + 1}
        </Text>
      </View>
      <View style={styles.detailContent}>
        <View style={styles.detailHeader}>
          <Text fontSize={scale(14)} fontW="600" color="$black">
            {item.attendance_date}
          </Text>
          <View style={styles.badgeRow}>
            {violationTypes.map((t) => (
              <View
                key={t}
                style={[styles.badge, { backgroundColor: VIOLATION_COLORS[t]?.bg || '#F3F4F6' }]}
              >
                <Text
                  fontSize={scale(10)}
                  fontW="600"
                  color={VIOLATION_COLORS[t]?.text || '#374151'}
                >
                  {t}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.timeRow}>
          <View style={styles.timeBlock}>
            <Text fontSize={scale(11)} color="$grey">
              Giờ vào
            </Text>
            <Text fontSize={scale(13)} fontW="600" color="#059669">
              {item.check_in || '--:--'}
            </Text>
          </View>
          <View style={styles.timeSeparator} />
          <View style={styles.timeBlock}>
            <Text fontSize={scale(11)} color="$grey">
              Giờ ra
            </Text>
            <Text fontSize={scale(13)} fontW="600" color="#DC2626">
              {item.check_out || '--:--'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const AttendanceViolationDetail = ({ route }: Props) => {
  const {
    employeeId = 0,
    employeeName = '',
    employeeCode,
    department,
    group,
    month = 0,
    year = 0,
  } = route.params || {};

  const { violations, accessError, isLoadingDetail, totalLate, totalEarly, totalMissing } =
    useAttendanceViolationDetail({ employeeId, month, year });

  const renderHeader = () => <Header title="Chi tiết vi phạm" />;

  const renderEmployeeInfo = () => (
    <View style={[styles.card, CARD_SHADOW]}>
      <View style={styles.avatarRow}>
        <View style={styles.avatar}>
          <Text fontSize={scale(22)} fontW="700" color="$white">
            {employeeName?.charAt(0) || '?'}
          </Text>
        </View>
        <View style={styles.employeeInfoBlock}>
          <Text fontSize={scale(16)} fontW="700" color="$black">
            {employeeName}
          </Text>
          <Text fontSize={scale(12)} color="$grey" mt={verticalScale(2)}>
            {employeeCode}
          </Text>
          {department ? (
            <Text fontSize={scale(12)} color="$grey">
              {department}
              {group ? ` • ${group}` : ''}
            </Text>
          ) : null}
        </View>
      </View>
      <View style={styles.periodRow}>
        <Text fontSize={scale(12)} color="$grey">
          Tháng {month}/{year}
        </Text>
      </View>
    </View>
  );

  const renderSummary = () => {
    if (isLoadingDetail || violations.length === 0) return null;
    return (
      <View style={[styles.card, CARD_SHADOW]}>
        <Text fontSize={scale(14)} fontW="700" color="$black" mb={verticalScale(12)}>
          Tổng hợp vi phạm
        </Text>
        <View style={styles.summaryRow}>
          <SummaryCard label="Đi muộn" count={totalLate} bgColor="#FFECEC" textColor="#92400E" />
          <SummaryCard label="Về sớm" count={totalEarly} bgColor="#FFF4DB" textColor="#816116" />
          <SummaryCard
            label="Quên chấm"
            count={totalMissing}
            bgColor="#D1E3FF"
            textColor="#5B21B6"
          />
        </View>
        <View style={styles.totalRow}>
          <Text fontSize={scale(13)} color="$grey">
            Tổng vi phạm:
          </Text>
          <Text fontSize={scale(16)} fontW="700" color="#DC2626">
            {violations.length} lần
          </Text>
        </View>
      </View>
    );
  };

  const renderDetailList = () => (
    <View style={[styles.card, CARD_SHADOW]}>
      <Text fontSize={scale(14)} fontW="700" color="$black" mb={verticalScale(12)}>
        Chi tiết từng vi phạm
      </Text>
      {isLoadingDetail ? (
        <ActivityIndicator style={{ marginVertical: scale(20) }} />
      ) : accessError ? (
        <Text fontSize={scale(13)} color="$grey" ta="center" pv={scale(20)}>
          {accessError}
        </Text>
      ) : violations.length === 0 ? (
        <Text fontSize={scale(13)} color="$grey" ta="center" pv={scale(20)}>
          Không có dữ liệu vi phạm
        </Text>
      ) : (
        violations.map((item: ViolationDetail, index: number) => (
          <ViolationDetailItem key={`${item.attendance_date}-${index}`} item={item} index={index} />
        ))
      )}
    </View>
  );

  const renderBody = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      {renderEmployeeInfo()}
      {renderSummary()}
      {renderDetailList()}
    </ScrollView>
  );

  return (
    <View f={1} bg="$backgroundHover">
      {renderHeader()}
      {renderBody()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: scale(16),
    paddingBottom: verticalScale(30),
    gap: scale(12),
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: scale(16),
    padding: scale(16),
    marginBottom: scale(4),
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  avatar: {
    width: scale(54),
    height: scale(54),
    borderRadius: scale(27),
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  employeeInfoBlock: {
    flex: 1,
  },
  periodRow: {
    marginTop: scale(12),
    paddingTop: scale(12),
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: scale(8),
    marginBottom: scale(12),
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(12),
    paddingVertical: scale(16),
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: scale(12),
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: scale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: scale(10),
  },
  indexBadge: {
    width: scale(26),
    height: scale(26),
    borderRadius: scale(13),
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: scale(2),
  },
  detailContent: {
    flex: 1,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(8),
    flexWrap: 'wrap',
    gap: scale(4),
  },
  badgeRow: {
    flexDirection: 'row',
    gap: scale(4),
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: scale(6),
    paddingVertical: scale(3),
    borderRadius: scale(4),
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    backgroundColor: '#F9FAFB',
    borderRadius: scale(8),
    padding: scale(8),
  },
  timeBlock: {
    alignItems: 'center',
  },
  timeSeparator: {
    width: 1,
    height: scale(28),
    backgroundColor: '#E5E7EB',
  },
});

export default AttendanceViolationDetail;
