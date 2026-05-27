import React, { ReactNode } from 'react';
import { IcDropdown } from 'assets/svgs';
import { OptionItem, Text } from 'components';
import { TouchableOpacity } from 'react-native';
import { View } from 'tamagui';
import { verticalScale, scale, horizontalScale } from 'utils';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import OptionPickerModal2 from 'components/base/OptionPickerModal2';

interface OptionPickerType {
  label?: string;
  numberOfLines?: number;
  placeholder?: ReactNode;
  required?: boolean;
  value?: OptionItem;
  options: OptionItem[];
  disabled?: boolean;
  searchable?: boolean;
  onChange: (item: OptionItem) => void;
}

const OptionPicker = (props: OptionPickerType) => {
  const optionPickerRef = React.useRef<BottomSheetModal>(null);

  function handleSelect(item: OptionItem): void {
    props.onChange(item);
  }

  return (
    <>
      <View>
        {props.label && (
          <View gap={scale(2)} fd={'row'}>
            <Text fontSize={scale(14)} fontWeight="500" mb={verticalScale(8)} color="$black">
              {props.label}
            </Text>
            {props.required && <Text color="$m_red">*</Text>}
          </View>
        )}
        <TouchableOpacity
          activeOpacity={0.7}
          disabled={props.disabled}
          onPress={() => {
            optionPickerRef.current?.present();
          }}
        >
          <View
            fd="row"
            ai="center"
            jc="space-between"
            bg={props.disabled ? '$inputDisable' : '$white'}
            br={scale(8)}
            ph={horizontalScale(12)}
            pv={verticalScale(12)}
            borderWidth={1}
            borderColor="$border"
          >
            {props.value?.value && (
              <Text fontSize={scale(14)} color="$black" numberOfLines={props.numberOfLines}>
                {props.value?.value ?? props.placeholder}
              </Text>
            )}
            {!props.value?.value && props.placeholder && (
              <Text fontSize={scale(14)} color="$grey">
                {props.placeholder}
              </Text>
            )}
            <IcDropdown size={scale(20)} />
          </View>
        </TouchableOpacity>
      </View>
      <OptionPickerModal2
        bottomSheetRef={optionPickerRef}
        data={props.options}
        selectedValue={props.value?.key}
        title={props.label}
        onSelect={handleSelect}
        searchable={props.searchable}
      />
    </>
  );
};

export default OptionPicker;
