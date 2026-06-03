import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './index';

const IcNotificationBoard = ({ size = 24, tintColor = '#000000', style, ...props }: IconProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 27 27" fill="none" style={style} {...props}>
      <Path
        d="M20.929 2.98975H5.1642C3.96825 2.98975 2.98975 3.96825 2.98975 5.1642V20.929C2.98975 22.1249 3.96825 23.1034 5.1642 23.1034H20.929C22.1249 23.1034 23.1034 22.1249 23.1034 20.929V5.1642C23.1034 3.96825 22.1249 2.98975 20.929 2.98975Z"
        stroke={tintColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M11.0752 6.25146H20.0459V8.96953H11.0752V6.25146ZM11.0752 11.6876H20.0459V14.4057H11.0752V11.6876ZM11.0752 17.1237H20.0459V19.8418H11.0752V17.1237ZM6.04785 6.25201H8.76591V8.97007H6.04785V6.25201ZM6.04785 11.6876H8.76591V14.4057H6.04785V11.6876ZM6.04785 17.1237H8.76591V19.8418H6.04785V17.1237Z"
        stroke={tintColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default IcNotificationBoard;
