import { Pressable } from 'react-native';
import { IcExplanation } from 'assets/svgs';
import IcOvertime from 'assets/svgs/IcOvertime';
import IcTermination from 'assets/svgs/IcTermination';
import { LeaveRegistrationViewType } from 'common/enum/leave-registration-view-type';
import { NotificationItemType } from 'common/enum/notification-item-type';
import { TerminationState } from 'common/enum/termination-state';
import { NotificationModel } from 'common/model/notification-model';
import { Text } from 'components';
import { RouteName } from 'configs/navigation';
import TerminationStatus from 'modules/termination/terminations/components/TerminationStatus';
import { navigate } from 'navigators';
import React from 'react';
import { View } from 'tamagui';
import { scale } from 'utils/scaling-utils';
import NextStepText from 'components/NextStepText';
interface NotificationItemProps {
  item: NotificationModel;
}

const iconMap = new Map<string, Element>([
  [NotificationItemType.GTC, <IcExplanation size={scale(32)} />],
  [NotificationItemType.LEAVE, <IcExplanation size={scale(32)} />],
  [NotificationItemType.OVERTIME, <IcOvertime size={scale(32)} />],
  [NotificationItemType.TERMINATION, <IcTermination />],
]);

const itemNameMap = new Map<string, string>([
  [NotificationItemType.GTC, 'GTC'],
  [NotificationItemType.LEAVE, 'Nghỉ phép'],
  [NotificationItemType.OVERTIME, 'OT'],
  [NotificationItemType.TERMINATION, 'Nghỉ việc'],
]);
const NotificationItem = (props: NotificationItemProps) => {
  const _onNavigate = () => {
    switch (props.item.type) {
      case NotificationItemType.GTC:
        navigate(RouteName.TimesheetExplanationDetail, { id: props.item.id, type: 'edit' });
        break;
      case NotificationItemType.LEAVE:
        navigate(RouteName.LeaveRegistrationsDetail, {
          id: props.item.id,
          viewType: LeaveRegistrationViewType.APPROVE,
        });
        break;
      case NotificationItemType.OVERTIME:
        navigate(RouteName.OvertimeEditor, {
          id: props.item.id,
        });
        break;
      case NotificationItemType.TERMINATION:
        navigate(RouteName.TerminationDetail, {
          id: props.item.id,
          viewType: LeaveRegistrationViewType.APPROVE,
        });
        break;
      default:
        break;
    }
  };
  return (
    <Pressable onPress={() => _onNavigate()}>
      <View
        fd={'row'}
        bg={'$white'}
        br={scale(8)}
        ai={'center'}
        mb={scale(10)}
        pv={scale(12)}
        ph={scale(16)}
      >
        <View fd={'row'} gap={scale(8)} f={1} ai={'center'}>
          {iconMap.get(props.item.type || '') || <IcExplanation size={scale(32)} />}
          <View f={1}>
            <Text fontSize={scale(14)} fontWeight={600}>
              {itemNameMap.get(props.item.type || '')}: {props.item.description}
            </Text>
            <Text fontSize={scale(14)} fontWeight={600}>
              {props.item.employee_name} ({props.item.employee_code})
            </Text>
            <NextStepText next_step_name={props.item.stage_name} />
          </View>
        </View>
        <View>
          <TerminationStatus status={TerminationState.WAITING} />
        </View>
      </View>
    </Pressable>
  );
};

export default NotificationItem;
