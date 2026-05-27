import React from 'react';
import { Text } from 'components';
import { View } from 'tamagui';
import { scale } from 'utils';

export interface LineItemType {
  dotColor?: string;
  labelColor?: string;
  valueColor?: string;
  labelWeight?: 300 | 400 | 500 | 600 | 700 | 800 | 900 | null;
  label: string;
  value: string | number;
}

const LineItem = (props: LineItemType) => {
  return (
    <View fd={'row'} pv={scale(12)} gap={scale(6)} alignItems="center">
      {props.dotColor && (
        <View w={scale(10)} h={scale(10)} bg={props.dotColor || 'transparent'} br={100} />
      )}
      <Text fontW={props.labelWeight ?? 400} f={1} color={props.labelColor} fontSize={scale(14)}>
        {props.label}
      </Text>
      <Text fontW={500} color={props.valueColor} fontSize={scale(14)}>
        {props.value}
      </Text>
    </View>
  );
};

export default LineItem;
