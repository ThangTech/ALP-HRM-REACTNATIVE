import React from 'react';
import { globalStyle } from 'common/styles/base';
import { View } from 'tamagui';
import { RNTamaguiViewNonStyleProps } from '@tamagui/core';
import { scale } from 'utils';

interface CardContainerType extends RNTamaguiViewNonStyleProps {
  padding?: number;
}

const CardContainer = (props: CardContainerType) => {
  return (
    <View
      borderWidth={1}
      bc={'$reportBorderColor'}
      bg={'$white'}
      style={globalStyle.itemShadow}
      br={scale(16)}
      p={props.padding}
      overflow="hidden"
    >
      {props.children}
    </View>
  );
};

export default CardContainer;
