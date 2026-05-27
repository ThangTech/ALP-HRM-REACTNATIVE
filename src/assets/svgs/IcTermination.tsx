import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

const IcTermination = () => {
  return (
    <Svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <Rect width="32" height="32" rx="10.6667" fill="#FFECEC" />
      <Path
        d="M18 6H10C8.9 6 8 6.9 8 8V24C8 24.41 8.12 24.8 8.34 25.12C8.41 25.23 8.5 25.33 8.59 25.41C8.95 25.78 9.45 26 10 26H17.53C17 25.42 16.61 24.75 16.35 24H10V8H17V13H22V16C22.7 16 23.37 16.12 24 16.34V12L18 6ZM22 27L27 22.5L24 19.8L22 18V21H18V24H22V27Z"
        fill="#8D2929"
      />
    </Svg>
  );
};

export default IcTermination;
