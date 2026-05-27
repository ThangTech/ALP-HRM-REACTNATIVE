import { globalStyle } from 'common/styles/base';
import { Text } from 'components';
import React, { useState } from 'react';
import { View } from 'tamagui';
import { scale } from 'utils';
import Divider from './divider';
import LineItem, { LineItemType } from './line-item';
import IcArrowRight from 'assets/svgs/IcArrowRight';

interface ReportBlockType {
  label?: string;
  lines: LineItemType[];
  defaultExpanded?: boolean;
  hasExpandIcon?: boolean;
}

const ReportBlock = (props: ReportBlockType) => {
  const [expanded, setExpanded] = useState(props.defaultExpanded ?? true);
  return (
    <View gap={scale(10)}>
      {props.label && (
        <View
          fd={'row'}
          ai={'center'}
          onPress={props.hasExpandIcon ? () => setExpanded(!expanded) : undefined}
        >
          <Text fontW={500} fontSize={14} f={1}>
            {props.label}
          </Text>
          {props.hasExpandIcon && (
            <View style={{ transform: [{ rotate: expanded ? '90deg' : '-90deg' }] }}>
              <IcArrowRight size={scale(24)} />
            </View>
          )}
        </View>
      )}
      {expanded && (
        <View
          borderWidth={1}
          ph={scale(16)}
          bc={'$reportBorderColor'}
          bg={'$white'}
          br={scale(16)}
          style={globalStyle.itemShadow}
        >
          {props.lines.map((line, index) => (
            <View key={line.label}>
              <LineItem key={index} {...line} />
              {index === props.lines.length - 1 ? null : <Divider />}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default ReportBlock;
