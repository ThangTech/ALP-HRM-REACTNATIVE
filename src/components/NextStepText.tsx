import React from 'react';
import { scale } from 'utils';
import { Text } from './base';

interface NextStepTextType {
  next_step_name?: string;
}

const NextStepText = (props: NextStepTextType) => {
  if (!props.next_step_name) {
    return null;
  }
  const isHighlight = props.next_step_name?.toLowerCase()?.includes('c&b');
  return (
    <Text fontSize={scale(14)} fontWeight="600">
      Bước duyệt tiếp theo:
      <Text
        fontSize={scale(14)}
        marginLeft={scale(10)}
        fontWeight="600"
        color={isHighlight ? '$blue' : undefined}
      >
        {' '}
        {props.next_step_name ?? ''}
      </Text>
    </Text>
  );
};

export default NextStepText;
