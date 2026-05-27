import React from 'react';
import {
  Pressable as RNPressable,
  PressableProps as RNPressableProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { scale } from 'utils';

export type PressableProps = Omit<RNPressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
};

const Pressable = ({ style, ...rest }: PressableProps) => (
  <RNPressable
    hitSlop={{ bottom: scale(8), left: scale(8), right: scale(8), top: scale(8) }}
    style={({ pressed }) => [
      {
        opacity: rest.disabled || pressed ? 0.7 : 1,
      },
      style,
    ]}
    {...rest}
  />
);

export default Pressable;
