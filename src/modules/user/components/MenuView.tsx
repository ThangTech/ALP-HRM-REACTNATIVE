import IcRightArrow from 'assets/svgs/IcRightArrow';
import { Pressable, Text } from 'components';
import React from 'react';
import { StyleSheet } from 'react-native';
import { getTokens } from 'tamagui';
import { scale } from 'utils';

type MenuViewProps = {
  title: string;
  onPress: () => void;
};

const MenuView = ({ title, onPress }: MenuViewProps) => {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Text fontSize={scale(16)}>{title}</Text>
      <IcRightArrow size={scale(16)} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: scale(20),
    borderRadius: scale(10),
    backgroundColor: 'white',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: getTokens().color.border.val,
  },
});

export default MenuView;
