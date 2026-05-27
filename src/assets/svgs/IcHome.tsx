import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from '.';
const IcHome = ({ size = 30, tintColor = '#005BAB', style }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 19 21" fill="none" style={style}>
    <Path
      d="M3.14706 19.8937C1.91491 19.8937 0.916016 18.8686 0.916016 17.603V8.39645C0.916016 7.70088 1.22458 7.04192 1.75279 6.60785L7.88946 1.56839C8.28155 1.24371 8.77466 1.06604 9.28373 1.06604C9.7928 1.06604 10.2859 1.24371 10.678 1.56839L16.8136 6.60785C17.3429 7.04192 17.6514 7.70088 17.6514 8.39645V17.603C17.6514 18.8686 16.6525 19.8937 15.4204 19.8937H3.14706Z"
      stroke={tintColor}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6.66797 19.8937V14.1409C6.66797 13.5861 6.88837 13.054 7.28068 12.6617C7.67299 12.2693 8.20508 12.049 8.7599 12.049H9.80586C10.3607 12.049 10.8928 12.2693 11.2851 12.6617C11.6774 13.054 11.8978 13.5861 11.8978 14.1409V19.8937"
      stroke={tintColor}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default IcHome;
