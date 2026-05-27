import { IcExplanation } from 'assets/svgs';
import { LeaveRegistrationStatus } from 'common/enum/leave-registration-status';
import { LeaveRegistrationViewType } from 'common/enum/leave-registration-view-type';
import { LeaveRegistration } from 'common/model/leave-registration';
import { globalStyle } from 'common/styles/base';
import NextStepText from 'components/NextStepText';
import { MAP_STATUS } from 'configs/contansts';
import { RouteName } from 'configs/navigation';
import dayjs from 'dayjs';
import { navigate } from 'navigators';
import React from 'react';
import { Pressable } from 'react-native';
import { Text, View } from 'tamagui';
import { getLocaleDurationDisplay, horizontalScale, scale, verticalScale } from 'utils';

interface ItemRegistrationType {
  viewType?: LeaveRegistrationViewType;
  item: LeaveRegistration;
}
export const mapStatusBg = new Map([
  [LeaveRegistrationStatus.APPROVED, '$approvedBg'],
  [LeaveRegistrationStatus.APPROVED_1, '$pendingBg'],
  [LeaveRegistrationStatus.APPROVED_2, '$pendingBg'],
  [LeaveRegistrationStatus.APPROVED_3, '$pendingBg'],
  [LeaveRegistrationStatus.APPROVED_4, '$pendingBg'],
  [LeaveRegistrationStatus.APPROVED_5, '$pendingBg'],
  [LeaveRegistrationStatus.APPROVED_6, '$pendingBg'],
  [LeaveRegistrationStatus.APPROVED_7, '$pendingBg'],
  [LeaveRegistrationStatus.APPROVED_8, '$pendingBg'],
  [LeaveRegistrationStatus.APPROVED_9, '$pendingBg'],
  [LeaveRegistrationStatus.APPROVED_10, '$pendingBg'],
  [LeaveRegistrationStatus.APPROVED_11, '$pendingBg'],
  [LeaveRegistrationStatus.APPROVED_12, '$pendingBg'],
  [LeaveRegistrationStatus.APPROVED_13, '$pendingBg'],
  [LeaveRegistrationStatus.APPROVED_14, '$pendingBg'],
  [LeaveRegistrationStatus.APPROVED_15, '$pendingBg'],
  [LeaveRegistrationStatus.APPROVED_16, '$pendingBg'],
  [LeaveRegistrationStatus.DRAFT, '$grey'],
  [LeaveRegistrationStatus.PENDING, '$grey'],
  [LeaveRegistrationStatus.CANCELLED, '$detractiveBg'],
  [LeaveRegistrationStatus.REJECTED, '$detractiveBg'],
]);

export const mapStatusColor = new Map([
  [LeaveRegistrationStatus.APPROVED, '$approvedText'],
  [LeaveRegistrationStatus.APPROVED_1, '$pendingText'],
  [LeaveRegistrationStatus.APPROVED_2, '$pendingText'],
  [LeaveRegistrationStatus.APPROVED_3, '$pendingText'],
  [LeaveRegistrationStatus.APPROVED_4, '$pendingText'],
  [LeaveRegistrationStatus.APPROVED_5, '$pendingText'],
  [LeaveRegistrationStatus.APPROVED_6, '$pendingText'],
  [LeaveRegistrationStatus.APPROVED_7, '$pendingText'],
  [LeaveRegistrationStatus.APPROVED_8, '$pendingText'],
  [LeaveRegistrationStatus.APPROVED_9, '$pendingText'],
  [LeaveRegistrationStatus.APPROVED_10, '$pendingText'],
  [LeaveRegistrationStatus.APPROVED_11, '$pendingText'],
  [LeaveRegistrationStatus.APPROVED_12, '$pendingText'],
  [LeaveRegistrationStatus.APPROVED_13, '$pendingText'],
  [LeaveRegistrationStatus.APPROVED_14, '$pendingText'],
  [LeaveRegistrationStatus.APPROVED_15, '$pendingText'],
  [LeaveRegistrationStatus.APPROVED_16, '$pendingText'],
  [LeaveRegistrationStatus.DRAFT, '$white'],
  [LeaveRegistrationStatus.PENDING, '$white'],
  [LeaveRegistrationStatus.CANCELLED, '$detractive'],
  [LeaveRegistrationStatus.REJECTED, '$detractive'],
]);

export const mapStatusText = new Map([
  [LeaveRegistrationStatus.APPROVED_1, MAP_STATUS.get(LeaveRegistrationStatus.PENDING)],
  [LeaveRegistrationStatus.APPROVED_2, MAP_STATUS.get(LeaveRegistrationStatus.PENDING)],
  [LeaveRegistrationStatus.APPROVED_3, MAP_STATUS.get(LeaveRegistrationStatus.PENDING)],
  [LeaveRegistrationStatus.APPROVED_4, MAP_STATUS.get(LeaveRegistrationStatus.PENDING)],
  [LeaveRegistrationStatus.APPROVED_5, MAP_STATUS.get(LeaveRegistrationStatus.PENDING)],
  [LeaveRegistrationStatus.APPROVED_6, MAP_STATUS.get(LeaveRegistrationStatus.PENDING)],
  [LeaveRegistrationStatus.APPROVED_7, MAP_STATUS.get(LeaveRegistrationStatus.PENDING)],
  [LeaveRegistrationStatus.APPROVED_8, MAP_STATUS.get(LeaveRegistrationStatus.PENDING)],
  [LeaveRegistrationStatus.APPROVED_9, MAP_STATUS.get(LeaveRegistrationStatus.PENDING)],
  [LeaveRegistrationStatus.APPROVED_10, MAP_STATUS.get(LeaveRegistrationStatus.PENDING)],
  [LeaveRegistrationStatus.APPROVED_11, MAP_STATUS.get(LeaveRegistrationStatus.PENDING)],
  [LeaveRegistrationStatus.APPROVED_12, MAP_STATUS.get(LeaveRegistrationStatus.PENDING)],
  [LeaveRegistrationStatus.APPROVED_13, MAP_STATUS.get(LeaveRegistrationStatus.PENDING)],
  [LeaveRegistrationStatus.APPROVED_14, MAP_STATUS.get(LeaveRegistrationStatus.PENDING)],
  [LeaveRegistrationStatus.APPROVED_15, MAP_STATUS.get(LeaveRegistrationStatus.PENDING)],
  [LeaveRegistrationStatus.APPROVED_16, MAP_STATUS.get(LeaveRegistrationStatus.PENDING)],
  [LeaveRegistrationStatus.DRAFT, MAP_STATUS.get(LeaveRegistrationStatus.DRAFT)],
  [LeaveRegistrationStatus.APPROVED, MAP_STATUS.get(LeaveRegistrationStatus.APPROVED)],
  [LeaveRegistrationStatus.PENDING, MAP_STATUS.get(LeaveRegistrationStatus.DRAFT)],
  [LeaveRegistrationStatus.CANCELLED, MAP_STATUS.get(LeaveRegistrationStatus.CANCELLED)],
  [LeaveRegistrationStatus.REJECTED, MAP_STATUS.get(LeaveRegistrationStatus.REJECTED)],
]);

const ItemRegistration = (props: ItemRegistrationType) => {
  return (
    <View
      bg="$white"
      br={scale(12)}
      pv={scale(12)}
      ph={scale(16)}
      mb={verticalScale(12)}
      borderWidth={1}
      borderColor="$border"
      style={globalStyle.itemShadow}
    >
      <Pressable
        onPress={() => {
          if (
            props.viewType === LeaveRegistrationViewType.ME &&
            [LeaveRegistrationStatus.DRAFT, LeaveRegistrationStatus.PENDING].includes(
              props.item.state,
            )
          ) {
            return navigate(RouteName.LeaveRegistrationEditor, {
              id: props.item.id,
            });
          }
          navigate(RouteName.LeaveRegistrationsDetail, {
            id: props.item.id,
            viewType: props.viewType,
          });
        }}
      >
        <View fd="row" gap={scale(8)} alignItems="center">
          <IcExplanation size={scale(32)} />
          <View fd="row" ai="center" f={1}>
            <View gap={scale(2)}>
              <Text fontSize={scale(15)} fontWeight="600" color="$black" numberOfLines={1}>
                {props.item.holiday_status_name}
              </Text>
              {props.viewType === LeaveRegistrationViewType.APPROVE && (
                <Text fontSize={scale(14)} fontWeight="600">
                  {props.item.employee_name} ({props.item.employee_code})
                </Text>
              )}
              <NextStepText next_step_name={props.item.next_step_data?.next_step_name} />
              <Text fontSize={scale(12)} color="$grey">
                {dayjs(props.item.date_from).format('DD/MM/YYYY')}
              </Text>
            </View>
          </View>
          <View gap={scale(2)}>
            <View fd={'row'} justifyContent="center">
              <Text
                ph={horizontalScale(8)}
                pv={verticalScale(1)}
                borderRadius={scale(4)}
                fontSize={scale(12)}
                fontWeight="500"
                bg={mapStatusBg.get(props.item.state)}
                color={mapStatusColor.get(props.item.state)}
              >
                {mapStatusText.get(props.item.state)}
              </Text>
            </View>
            <Text fontSize={scale(12)}>
              Giờ nghỉ: {getLocaleDurationDisplay(props.item?.duration_display ?? '')}
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export default ItemRegistration;
