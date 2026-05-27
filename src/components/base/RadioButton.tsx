import React from 'react';
import { View, StyleSheet } from 'react-native';
import { scale } from 'utils';
import { Text } from './Text';
import { getTokens } from 'tamagui';
import Pressable from './Pressable';

interface RadioButtonProps {
  label: string;
  value: string;
  selected: boolean;
  onPress: () => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({ label, selected, onPress }) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && <View style={styles.radioInner} />}
      </View>
      <Text color={'$grey'} fontSize={scale(8)}>
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  radio: {
    width: scale(20),
    height: scale(20),
    borderRadius: scale(10),
    borderWidth: 2,
    borderColor: getTokens().color.grey.val,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    // borderColor: '#007AFF',
  },
  radioInner: {
    width: scale(10),
    height: scale(10),
    borderRadius: scale(5),
    // backgroundColor: '#007AFF',
  },
});

export default RadioButton;
