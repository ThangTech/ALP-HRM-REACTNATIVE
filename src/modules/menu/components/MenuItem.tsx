import { View } from 'tamagui';
import { MenuItemType } from '../FullMenu';
import { globalStyle } from 'common/styles/base';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { scale } from 'utils';
import React from 'react';
import { Text } from 'components';
import IcArrowRight from 'assets/svgs/IcArrowRight';

interface MenuItemPropsType {
  item: MenuItemType;
}

const MenuItem = (props: MenuItemPropsType) => {
  return (
    <TouchableOpacity onPress={props.item.onPress}>
      <View
        style={globalStyle.itemShadow}
        bg={'$white'}
        br={scale(16)}
        fd={'row'}
        pv={scale(20)}
        ph={scale(16)}
        gap={scale(10)}
        ai={'center'}
        bw={1}
        bc={'$divider'}
      >
        <View w={scale(32)} h={scale(32)}>
          <Image source={props.item.icon} style={styles.fillMaxSize} resizeMode="contain" />
        </View>
        <Text f={1}>{props.item.label}</Text>
        <IcArrowRight />
      </View>
    </TouchableOpacity>
  );
};

export default MenuItem;

const styles = StyleSheet.create({
  fillMaxSize: {
    width: '100%',
    height: '100%',
  },
});
