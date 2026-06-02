import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from '.';

const IcChangeShift = ({
  size = 24,
  tintColor = '#d32f2f', // màu đỏ nhạt mặc định
  ...rest
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
    <Path
      d="M19.9381 13C19.979 12.6724 20 12.3387 20 12C20 7.58172 16.4183 4 12 4C9.49942 4 7.26681 5.14727 5.7998 6.94416"
      stroke={tintColor}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Path
      d="M20 4V8H16"
      stroke={tintColor}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4.06189 11C4.02099 11.3276 4 11.6613 4 12C4 16.4183 7.58172 20 12 20C14.3894 20 16.5341 18.9525 18.0229 17.2733"
      stroke={tintColor}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Path
      d="M4 20V16H8"
      stroke={tintColor}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default IcChangeShift;
