import * as React from 'react';
import Svg, { Rect, Path } from 'react-native-svg';
import { IconProps } from '.';
const SVGComponent = ({ size = 30 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 18 20" fill="none">
    <Rect x={1} y={7} width={16} height={12} rx={4} stroke="#717171" strokeWidth={1.5} />
    <Path
      d="M9 14L9 12"
      stroke="#717171"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M13 7V5C13 2.79086 11.2091 1 9 1V1C6.79086 1 5 2.79086 5 5L5 7"
      stroke="#717171"
      strokeWidth={1.5}
    />
  </Svg>
);
export default SVGComponent;
