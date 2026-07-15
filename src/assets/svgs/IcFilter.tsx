import * as React from 'react';
import Svg, { G, Path } from 'react-native-svg';
import { IconProps } from '.';

const IcFilter = ({ size = 24 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
    <G transform="translate(0, 24) scale(0.1, -0.1)" fill="#000000" stroke="none">
      <Path d="M0 200 c0 -6 47 -10 120 -10 73 0 120 4 120 10 0 6 -47 10 -120 10 -73 0 -120 -4 -120 -10z" />
      <Path d="M0 120 c0 -6 47 -10 120 -10 73 0 120 4 120 10 0 6 -47 10 -120 10 -73 0 -120 -4 -120 -10z" />
      <Path d="M0 40 c0 -13 227 -13 235 0 4 6 -37 10 -114 10 -74 0 -121 -4 -121 -10z" />
    </G>
  </Svg>
);

export default IcFilter;
