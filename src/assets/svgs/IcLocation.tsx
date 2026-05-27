import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function IcLocation() {
  return (
    <Svg width={27} height={27} viewBox="0 0 27 27" fill="none">
      <Path fill="none" d="M0 0H27V27H0z" />
      <Path
        d="M13.5 2.531c-4.192 0-7.594 3.238-7.594 7.225 0 4.588 5.063 11.858 6.922 14.37a.831.831 0 001.344 0c1.86-2.51 6.922-9.779 6.922-14.37 0-3.987-3.402-7.225-7.594-7.225z"
        stroke="#005BAB"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.5 12.656a2.531 2.531 0 100-5.062 2.531 2.531 0 000 5.062z"
        stroke="#005BAB"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default IcLocation;
