import IcTermination from 'assets/svgs/IcTermination';
import { LeaveRegistrationViewType } from 'common/enum/leave-registration-view-type';
import { Termination } from 'common/model/termination';
import { RouteName } from 'configs/navigation';
import dayjs from 'dayjs';
import { navigate } from 'navigators';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Text, View } from 'tamagui';
import { scale } from 'utils';
import TerminationStatus from './TerminationStatus';
import NextStepText from 'components/NextStepText';

interface ItemTerminationType {
  item: Termination;
  viewType: LeaveRegistrationViewType;
}

const ItemTermination = (props: ItemTerminationType) => {
  return (
    <TouchableOpacity
      onPress={() =>
        navigate(RouteName.TerminationDetail, { id: props.item.id, viewType: props.viewType })
      }
    >
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
          <IcTermination />
          <View f={1}>
            <Text fontSize={scale(14)} fontWeight={600}>
              {props.item.departure_reason_name}
            </Text>
            <Text fontSize={scale(14)} fontWeight={600}>
              {props.item.employee_name} ({props.item.employee_code})
            </Text>
            <NextStepText next_step_name={props.item.next_step_data?.next_step_name} />
            <Text color={'$d_light'} fontSize={scale(12)} mt={scale(2)}>
              {dayjs(props.item.resignation_date).format('DD/MM/YYYY')}
            </Text>
          </View>
        </View>
        <View>
          <TerminationStatus status={props.item.state} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ItemTermination;
