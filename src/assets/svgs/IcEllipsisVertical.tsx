import * as React from 'react';
import Svg, { Circle } from 'react-native-svg';

function IcEllipsisVertical() {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="white"
      stroke="white"
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
