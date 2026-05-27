import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from '.';
const IcRightArrow = ({ size = 30 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 10 16" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.005 0L10.005 8L2.005 16L0 14L6.005 8L0 2L2.005 0Z"
      fill="black"
    />
  </Svg>
);
export default IcRightArrow;
