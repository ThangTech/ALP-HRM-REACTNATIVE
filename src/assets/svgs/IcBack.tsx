import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from '.';
const IcBack = ({ size = 30, tintColor }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 8 14" fill="none">
    <Path
      d="M7 1L1 7L7 13"
      stroke={tintColor ?? 'white'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default IcBack;
