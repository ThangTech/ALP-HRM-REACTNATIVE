import { Images } from 'assets';
import React from 'react';
import { View } from 'tamagui';
import { Text } from './base';
import { Image, StyleSheet } from 'react-native';
import { scale, verticalScale, horizontalScale } from 'utils';

const EmptyBox = () => {
  return (
    <View style={styles.emptyContainer}>
      <Image source={Images.empty_data} style={styles.emptyImage} resizeMode="contain" />
      <Text fontSize={scale(16)} tx={'Không có dữ liệu'} />
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: 'center',
  },
  emptyImage: {
    width: horizontalScale(400),
    height: verticalScale(300),
  },
});

export default EmptyBox;
