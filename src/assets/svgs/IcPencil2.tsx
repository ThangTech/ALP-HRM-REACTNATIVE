import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from '.';
const IcPencil2 = ({ size = 24 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 19 18" fill="none">
    <Path
      d="M12 2.99994L15 5.99994M10 16.9999H18M2 12.9999L1 16.9999L5 15.9999L16.586 4.41394C16.9609 4.03889 17.1716 3.53027 17.1716 2.99994C17.1716 2.46961 16.9609 1.961 16.586 1.58594L16.414 1.41394C16.0389 1.039 15.5303 0.828369 15 0.828369C14.4697 0.828369 13.9611 1.039 13.586 1.41394L2 12.9999Z"
      stroke="white"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default IcPencil2;
