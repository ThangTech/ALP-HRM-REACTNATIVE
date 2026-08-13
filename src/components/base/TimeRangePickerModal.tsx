import React, { useCallback, useState, useEffect } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Button, Text } from 'components';
import { ButtonText, View } from 'tamagui';
import { StyleSheet } from 'react-native';
import { verticalScale, scale } from 'utils';
import DatePicker from 'react-native-date-picker';
import SmartBackdrop from './SmartBackdrop';

interface TimeRangePickerModalProps {
  bottomSheetRef: React.RefObject<BottomSheet>;
  initialFromValue?: Date;
  initialToValue?: Date;
  onConfirm: (fromDate: Date, toDate: Date) => void;
  onCancel?: () => void;
  onDelete?: () => Promise<void> | void;
  title?: string;
}

const TimeRangePickerModal: React.FC<TimeRangePickerModalProps> = ({
  bottomSheetRef,
  initialFromValue,
  initialToValue,
  onDelete,
  onConfirm,
  onCancel,
  title = 'Chọn thời gian',
}) => {
  const [fromTime, setFromTime] = useState<Date>(initialFromValue || new Date());
  const [toTime, setToTime] = useState<Date>(initialToValue || new Date());

  // Update selected time when initial values change
  useEffect(() => {
    if (initialFromValue) {
      setFromTime(initialFromValue);
    }
    if (initialToValue) {
      setToTime(initialToValue);
    }
  }, [initialFromValue, initialToValue]);

  const renderBackdrop = useCallback(
    (props: any) => <SmartBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />,
    [],
  );

  const handleConfirm = () => {
    onConfirm(fromTime, toTime);
    bottomSheetRef.current?.close();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    bottomSheetRef.current?.close();
  };

  async function handleDelete(): Promise<void> {
    onDelete && (await onDelete());
    bottomSheetRef.current?.close();
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      enableDynamicSizing
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View p={verticalScale(20)} gap={verticalScale(16)}>
          {/* Title */}
          <Text fontSize={18} fontWeight="700" color="$black">
            {title}
          </Text>

          {/* Time Pickers Container */}
          <View fd="row" gap={scale(12)} ai="center" jc="center">
            {/* From Time Picker */}
            <View f={1} ai="center">
              <Text fontSize={14} fontWeight="600" color="$black" mb={verticalScale(8)}>
                Từ
              </Text>
              <DatePicker
                date={fromTime}
                onDateChange={setFromTime}
                mode="time"
                locale="vi"
                style={styles.timePicker}
                theme="light"
              />
            </View>

            {/* To Time Picker */}
            <View f={1} ai="center">
              <Text fontSize={14} fontWeight="600" color="$black" mb={verticalScale(8)}>
                Đến
              </Text>
              <DatePicker
                date={toTime}
                onDateChange={setToTime}
                mode="time"
                locale="vi"
                style={styles.timePicker}
                theme="light"
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View fd="row" gap={scale(12)} mt={verticalScale(8)}>
            <View f={1}>
              <Button variant="secondary" onPress={handleCancel}>
                <Button.Text variant="secondary">Hủy</Button.Text>
              </Button>
            </View>
            <View f={1}>
              <Button variant="primary" onPress={handleConfirm}>
                <Button.Text variant="primary">Xác nhận</Button.Text>
              </Button>
            </View>
          </View>
          {onDelete && (
            <ButtonText style={styles.btnDelete} onPress={handleDelete}>
              Xoá bỏ
            </ButtonText>
          )}
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handleIndicator: {
    width: 40,
    height: 4,
  },
  contentContainer: {
    flex: 1,
  },
  timePicker: {
    height: 120,
  },
  btnDelete: { textAlign: 'center', fontSize: 18, color: 'red' },
});

export default TimeRangePickerModal;
