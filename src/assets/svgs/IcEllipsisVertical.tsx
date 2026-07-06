import * as React from 'react';
import Svg, { Circle } from 'react-native-svg';

import { IconProps } from '.';

function IcEllipsisVertical({ size = 24, tintColor = 'black' }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={tintColor}
      stroke={tintColor}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Circle cx={12} cy={12} r={1} />
      <Circle cx={12} cy={5} r={1} />
      <Circle cx={12} cy={19} r={1} />
    </Svg>
  );
}

export default IcEllipsisVertical;
