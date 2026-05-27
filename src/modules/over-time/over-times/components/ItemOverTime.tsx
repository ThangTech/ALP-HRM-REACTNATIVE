import IcOvertime from 'assets/svgs/IcOvertime';
import { LeaveRegistrationViewType } from 'common/enum/leave-registration-view-type';
import { OverTime } from 'common/model/over-time';
import { Text } from 'components';
import NextStepText from 'components/NextStepText';
import { RouteName } from 'configs/navigation';
import dayjs from 'dayjs';
import {
  mapStatusBg,
  mapStatusColor,
  mapStatusText,
} from 'modules/leave-registration/list/components/ItemRegistration';
import { navigate } from 'navigators';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { View } from 'tamagui';
import { horizontalScale, scale, verticalScale } from 'utils';

interface ItemOverTimeType {
  item: OverTime;
  viewType?: LeaveRegistrationViewType;
}

const ItemOverTime = (props: ItemOverTimeType) => {
  return (
    <TouchableOpacity
      onPress={() =>
        navigate(RouteName.OvertimeEditor, {
          id: props.item.id,
        })
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
          <IcOvertime />
          <View gap={scale(2)}>
            <View>
              <Text fontSize={scale(14)} fontW={600}>
                {props.item.name}
              </Text>
              {props.viewType === LeaveRegistrationViewType.APPROVE && (
                <Text fontSize={scale(14)} fontW={600}>
                  {props.item.employee_name}({props.item.employee_code})
                </Text>
              )}
              <NextStepText next_step_name={props.item.next_step_data?.next_step_name} />
            </View>
            <Text color={'$d_light'}>
              {dayjs(props.item.request_date_from).format('DD/MM/YYYY')}
            </Text>
          </View>
        </View>
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
      </View>
    </TouchableOpacity>
  );
};

export default ItemOverTime;
