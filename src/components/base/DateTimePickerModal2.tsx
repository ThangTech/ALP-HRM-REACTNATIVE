import React, { useCallback, useState, useEffect } from 'react';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Button, Text, SmartBackdrop } from 'components';
import { View } from 'tamagui';
import { StyleSheet } from 'react-native';
import { verticalScale, scale } from 'utils';
import DatePicker from 'react-native-date-picker';

export type DateTimePickerMode = 'date' | 'time' | 'datetime' | 'yearAndMonth';

interface DateTimePickerModalProps {
  bottomSheetRef: React.RefObject<BottomSheetModal>;
  mode?: DateTimePickerMode;
  initialValue?: Date;
  onConfirm: (date: Date) => void;
  onCancel?: () => void;
  minimumDate?: Date;
  maximumDate?: Date;
  title?: string;
}

const DateTimePickerModal2: React.FC<DateTimePickerModalProps> = ({
  bottomSheetRef,
  mode = 'date',
  initialValue,
  onConfirm,
  onCancel,
  minimumDate,
  maximumDate,
  title,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(initialValue || new Date());

  // Update selected date when initial value changes
  useEffect(() => {
    if (initialValue) {
      setSelectedDate(initialValue);
    }
  }, [initialValue]);

  const renderBackdrop = useCallback(
    (props: any) => <SmartBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />,
    [],
  );

  const handleConfirm = () => {
    bottomSheetRef.current?.dismiss();
    setTimeout(() => {
      onConfirm(selectedDate);
    }, 500);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    bottomSheetRef.current?.dismiss();
  };

  const getTitle = () => {
    if (title) {
      return title;
    }
    switch (mode) {
      case 'time':
        return 'Chọn giờ';
      case 'datetime':
        return 'Chọn ngày và giờ';
      default:
        return 'Chọn ngày';
    }
  };

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
      onDismiss={bottomSheetRef.current?.dismiss}
    >
      <BottomSheetView>
        <View p={verticalScale(20)} gap={verticalScale(16)}>
          {/* Title */}
          <Text fontSize={18} fontWeight="700" color="$black">
            {getTitle()}
          </Text>

          {/* Date Picker */}
          <View ai="center" jc="center">
            <DatePicker
              date={selectedDate}
              onDateChange={setSelectedDate}
              mode={mode}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              locale="vi"
              theme="light"
            />
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
        </View>
      </BottomSheetView>
    </BottomSheetModal>
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
});

export default DateTimePickerModal2;
