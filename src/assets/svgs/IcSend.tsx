import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from '.';
const IcSend = ({ size = 30 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 19.766 19.766">
    <Path
      id="send"
      d="M17.736,0,0,9.977l5.668,2.1,8.743-8.2-6.65,8.971.005,0-.007,0v4.885l3.179-3.708,4.027,1.491Z"
      transform="translate(2.161) rotate(7)"
      fill="#bababa"
    />
  </Svg>
);
export default IcSend;
