import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { IcCalendar } from 'assets/svgs';
import { Text } from 'components';
import DateTimePickerModal2, { DateTimePickerMode } from 'components/base/DateTimePickerModal2';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { View } from 'tamagui';
import { horizontalScale, scale, verticalScale } from 'utils';

interface DatePickerType {
  label?: string;
  placeholder?: string;
  value?: Date;
  valueFormat?: string;
  mode?: DateTimePickerMode;
  required?: boolean;
  onChange: (date: Date) => void;
}

const DatePicker = (props: DatePickerType) => {
  const dateTimePickerRef = useRef<BottomSheetModal>(null);
  const [dateTimeConfig, setDateTimeConfig] = useState<{
    mode: DateTimePickerMode;
    initialValue?: Date;
    title: string;
    onConfirm: (date: Date) => void;
  }>({
    mode: 'date',
    initialValue: props.value,
    title: '',
    onConfirm: () => {},
  });

  function _onPress(): void {
    setDateTimeConfig({
      mode: props.mode ?? 'date',
      initialValue: props.value,
      title: props.label ?? '',
      onConfirm: (date) => {
        props.onChange(date);
        // dateTimePickerRef.current?.close();
      },
    });
    dateTimePickerRef.current?.present();
  }

  return (
    <>
      <View f={1}>
        {props.label && (
          <View gap={scale(2)} fd={'row'}>
            <Text fontSize={scale(14)} fontWeight="500" mb={verticalScale(8)} color="$black">
              {props.label}
            </Text>
            {props.required && <Text color="$m_red">*</Text>}
          </View>
        )}
        <TouchableOpacity activeOpacity={0.7} onPress={_onPress}>
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
              {props.value
                ? dayjs(props.value).format(props.valueFormat ?? 'DD/MM/YYYY')
                : (props.placeholder ?? 'Chọn ngày')}
            </Text>
            <IcCalendar size={scale(20)} />
          </View>
        </TouchableOpacity>
      </View>
      <DateTimePickerModal2
        bottomSheetRef={dateTimePickerRef}
        mode={dateTimeConfig.mode}
        initialValue={dateTimeConfig.initialValue}
        title={dateTimeConfig.title}
        onConfirm={dateTimeConfig.onConfirm}
      />
    </>
  );
};

export default DatePicker;
