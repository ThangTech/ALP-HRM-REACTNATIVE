import * as React from 'react';
import Svg, { G, Path } from 'react-native-svg';
import { IconProps } from '.';
const IcDelete = ({ size = 30, tintColor = '#666' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 11.454 14">
    <G id="delete" transform="translate(-3 -1)">
      <Path
        id="Path_34"
        data-name="Path 34"
        d="M13.545,7a.636.636,0,0,0-.636.636v7.121a1.222,1.222,0,0,1-1.279,1.151H6.552a1.222,1.222,0,0,1-1.279-1.151V7.636A.636.636,0,0,0,4,7.636v7.121a2.493,2.493,0,0,0,2.552,2.424H11.63a2.493,2.493,0,0,0,2.552-2.424V7.636A.636.636,0,0,0,13.545,7Z"
        transform="translate(-0.364 -2.182)"
        fill={tintColor}
      />
      <Path
        id="Path_35"
        data-name="Path 35"
        d="M13.818,2.909H11.272V1.636A.636.636,0,0,0,10.636,1H6.818a.636.636,0,0,0-.636.636V2.909H3.636a.636.636,0,0,0,0,1.273H13.818a.636.636,0,1,0,0-1.273Zm-6.363,0V2.273H10v.636Z"
        fill={tintColor}
      />
      <Path
        id="Path_36"
        data-name="Path 36"
        d="M10.273,14.091V9.636A.636.636,0,0,0,9,9.636v4.454a.636.636,0,0,0,1.273,0Z"
        transform="translate(-2.182 -2.909)"
        fill={tintColor}
      />
      <Path
        id="Path_37"
        data-name="Path 37"
        d="M14.273,14.091V9.636a.636.636,0,0,0-1.273,0v4.454a.636.636,0,0,0,1.273,0Z"
        transform="translate(-3.637 -2.909)"
        fill={tintColor}
      />
    </G>
  </Svg>
);
export default IcDelete;
