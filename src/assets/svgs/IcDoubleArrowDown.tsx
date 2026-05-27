import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function IcDoubleArrowDown(props: any) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="blue"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-chevrons-down-icon lucide-chevrons-down"
      {...props}
    >
      <Path d="M7 6l5 5 5-5M7 13l5 5 5-5" />
    </Svg>
  );
}

export default IcDoubleArrowDown;
