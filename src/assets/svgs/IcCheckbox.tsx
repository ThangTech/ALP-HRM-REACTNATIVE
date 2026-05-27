import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from '.';
const IcCheckbox = ({ size = 14, style }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 14 14" fill="#fff" style={style}>
    <Path
      d="M0.5 0.5V13.5H13.5V0.5H0.5ZM5.8125 10.2619L3.29375 7.46281L4.03719 6.79375L5.78719 8.73812L9.9375 3.79563L10.7044 4.4375L5.8125 10.2619Z"
      fill="black"
    />
  </Svg>
);
export default IcCheckbox;
