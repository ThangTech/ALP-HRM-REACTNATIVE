import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from '.';
const IcPlus = ({ size = 30, tintColor = '#000000', style }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 14 14" fill={tintColor} style={style}>
    <Path
      d="M7 0.5C3.416 0.5 0.5 3.416 0.5 7C0.5 10.584 3.416 13.5 7 13.5C10.584 13.5 13.5 10.584 13.5 7C13.5 3.416 10.584 0.5 7 0.5ZM7 1.5C10.0435 1.5 12.5 3.9565 12.5 7C12.5 10.0435 10.0435 12.5 7 12.5C3.9565 12.5 1.5 10.0435 1.5 7C1.5 3.9565 3.9565 1.5 7 1.5ZM6.5 4V6.5H4V7.5H6.5V10H7.5V7.5H10V6.5H7.5V4H6.5Z"
      fill={tintColor}
    />
  </Svg>
);
export default IcPlus;
