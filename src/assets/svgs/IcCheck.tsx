import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from '.';

const IcCheck = ({ size = 24, width, height, tintColor = 'black', style }: IconProps) => (
  <Svg width={width || size} height={height || size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      d="M20 6L9 17L4 12"
      stroke={tintColor}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default IcCheck;
