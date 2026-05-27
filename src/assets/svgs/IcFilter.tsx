import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from '.';
const IcFilter = ({ size = 26, tintColor = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M11.3749 19.5C11.1249 19.5 10.9166 19.4167 10.7499 19.25C10.5833 19.0833 10.4999 18.875 10.4999 18.625V12.825L4.89993 5.725C4.7166 5.45833 4.6916 5.18733 4.82493 4.912C4.95827 4.63733 5.18327 4.5 5.49993 4.5H18.4999C18.8166 4.5 19.0416 4.63733 19.1749 4.912C19.3083 5.18733 19.2833 5.45833 19.0999 5.725L13.4999 12.825V18.625C13.4999 18.875 13.4166 19.0833 13.2499 19.25C13.0833 19.4167 12.8749 19.5 12.6249 19.5H11.3749ZM11.9999 12.3L16.9499 6H7.04993L11.9999 12.3Z"
      fill={tintColor}
    />
  </Svg>
);
export default IcFilter;
