import React from 'react';
import { TerminationState } from 'common/enum/termination-state';
import { Text } from 'components';
import { horizontalScale, verticalScale, scale } from 'utils';
import { View } from 'tamagui';
import { MAP_STATUS } from 'configs/contansts';

interface TerminationStatusType {
  status?: TerminationState;
}
export const mapStatusBg = new Map([
  [TerminationState.DRAFT, '$grey'],
  [TerminationState.APPROVED, '$approvedBg'],
  [TerminationState.WAITING, '$pendingBg'],
  [TerminationState.CANCELLED, '$detractiveBg'],
  [TerminationState.REFUSED, '$detractiveBg'],
]);

export const mapStatusColor = new Map([
  [TerminationState.DRAFT, '$white'],
  [TerminationState.APPROVED, '$approvedText'],
  [TerminationState.WAITING, '$pendingText'],
  [TerminationState.CANCELLED, '$detractive'],
  [TerminationState.REFUSED, '$detractive'],
]);

export const mapStatusText = new Map([
  [TerminationState.DRAFT, MAP_STATUS.get(TerminationState.DRAFT)],
  [TerminationState.APPROVED, MAP_STATUS.get(TerminationState.APPROVED)],
  [TerminationState.WAITING, MAP_STATUS.get(TerminationState.WAITING)],
  [TerminationState.CANCELLED, MAP_STATUS.get(TerminationState.CANCELLED)],
  [TerminationState.REFUSED, MAP_STATUS.get(TerminationState.REFUSED)],
]);
const TerminationStatus = (props: TerminationStatusType) => {
  if (!props.status) {
    return null;
  }
  return (
    <View fd={'row'}>
      <Text
        ph={horizontalScale(8)}
        pv={verticalScale(1)}
        borderRadius={scale(4)}
        fontSize={scale(12)}
        textAlign="center"
        fontWeight="500"
        bg={mapStatusBg.get(props.status)}
        color={mapStatusColor.get(props.status)}
      >
        {mapStatusText.get(props.status)}
      </Text>
    </View>
  );
};

export default TerminationStatus;
