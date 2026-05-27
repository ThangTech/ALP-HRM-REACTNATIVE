import { Text } from 'components';
import React from 'react';
import { StyleSheet } from 'react-native';
import { getTokens, View } from 'tamagui';
import { horizontalScale, scale } from 'utils';

type ItemRowProps = { label: string; value: string };

const ItemRow = ({ label, value }: ItemRowProps) => (
  <View style={styles.itemRow}>
    <Text color={'$black'}>{label}</Text>
    <Text f={1} fontWeight="bold" color={'$black'} textAlign="right">
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: horizontalScale(14),
    borderWidth: 1,
    borderRadius: scale(20),
    borderColor: getTokens().color.border.val,
    backgroundColor: 'white',
  },
});

export default ItemRow;
