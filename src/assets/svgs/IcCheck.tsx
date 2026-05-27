import * as React from 'react';
import Svg, { G, Ellipse, Defs } from 'react-native-svg';
import { IconProps } from '.';
const SVGComponent = ({ size = 35 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 35 34" fill="none">
    <G filter="url(#filter0_d_5506_15715)">
      <Ellipse cx={17.5} cy={13} rx={13.5} ry={12.5} fill="#0066CC" />
    </G>
    <Defs />
  </Svg>
);
export default SVGComponent;
