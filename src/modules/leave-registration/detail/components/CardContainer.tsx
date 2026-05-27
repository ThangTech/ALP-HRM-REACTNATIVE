import React from 'react';
import { globalStyle } from 'common/styles/base';
import { ReactNode } from 'react';
import { View } from 'tamagui';
import { scale } from 'utils';

interface CardContainerType {
  fd?: 'row' | 'unset' | 'column' | 'row-reverse' | 'column-reverse' | null | undefined;
  children?: ReactNode;
}

const CardContainer = (props: CardContainerType) => {
  return (
    <View
      style={globalStyle.itemShadow}
      gap={scale(props.fd === 'row' ? 12 : 2)}
      ph={scale(16)}
      pv={scale(10)}
      br={scale(16)}
      bg={'$white'}
      fd={props.fd}
      f={1}
    >
      {props.children}
    </View>
  );
};

export default CardContainer;
