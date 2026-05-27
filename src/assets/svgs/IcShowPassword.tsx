import * as React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { IconProps } from '.';
const IcShowPassword = ({ size = 25 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 20 14" fill="none">
    <Path
      d="M1.20057 7.78442C0.933139 7.2954 0.933144 6.70445 1.20058 6.21544C2.9 3.10803 6.20336 1 9.99997 1C13.7966 1 17.1 3.10809 18.7994 6.21558C19.0669 6.7046 19.0669 7.29555 18.7994 7.78456C17.1 10.892 13.7966 13 10 13C6.20336 13 2.89997 10.8919 1.20057 7.78442Z"
      stroke="#4D4D4D"
      strokeWidth={1.5}
    />
    <Circle cx={10} cy={7} r={3} stroke="#4D4D4D" strokeWidth={1.5} />
  </Svg>
);
export default IcShowPassword;
