import * as React from 'react';
import Svg, { Circle } from 'react-native-svg';
import { IconProps } from '.';
const IcGreenDot = ({ size = 7, style }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 7 7" style={style}>
    <Circle id="Ellipse_8" data-name="Ellipse 8" cx={3.5} cy={3.5} r={3.5} fill="#4dbd74" />
  </Svg>
);
export default IcGreenDot;
