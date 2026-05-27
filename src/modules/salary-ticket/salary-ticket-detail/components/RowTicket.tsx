import React from 'react';
import { Text } from 'components';
import { View } from 'tamagui';
import { scale } from 'utils';

interface RowTicketType {
  title: string;
  value: string | number;
  titleWeight?: '400' | '500';
  titleColor?: string;
  pv?: number;
}

const RowTicket = (props: RowTicketType) => {
  return (
    <View fd={'row'} gap={scale(8)} pv={scale(props.pv ?? 12)}>
      <Text fontSize={scale(14)} fontW={props.titleWeight ?? 500} f={2} color={props.titleColor}>
        {props.title}
      </Text>
      <View f={1} ai={'flex-end'}>
        <Text fontSize={scale(14)} fontW={500}>
          {props.value}
        </Text>
      </View>
    </View>
  );
};

export default RowTicket;
