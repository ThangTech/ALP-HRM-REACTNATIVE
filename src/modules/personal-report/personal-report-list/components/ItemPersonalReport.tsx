import { IcExplanation } from 'assets/svgs';
import { LeaveRegistrationViewType } from 'common/enum/leave-registration-view-type';
import { PersonalReport } from 'common/model/personal-report';
import { globalStyle } from 'common/styles/base';
import { Text } from 'components';
import { RouteName } from 'configs/navigation';
import dayjs from 'dayjs';
import TerminationStatus from 'modules/termination/terminations/components/TerminationStatus';
import { navigate } from 'navigators';
import React from 'react';
import { Pressable } from 'react-native';
import { View } from 'tamagui';
import { scale, verticalScale } from 'utils';

interface ItemPersonalReportType {
  item: PersonalReport;
  viewType: LeaveRegistrationViewType;
}

const ItemPersonalReport = (props: ItemPersonalReportType) => {
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
        onPress={() =>
          navigate(RouteName.PersonalReportEditor, {
            id: props.item.id,
            viewType: props.viewType,
          })
        }
      >
        <View fd="row" gap={scale(8)} alignItems="center">
          <IcExplanation size={scale(32)} />
          <View fd="row" ai="center" f={1}>
            <View gap={scale(2)}>
              <Text fontSize={scale(15)} fontWeight="600" color="$black" numberOfLines={1}>
                {props.item.name}
              </Text>
              {props.viewType === LeaveRegistrationViewType.APPROVE && (
                <Text fontSize={scale(15)} fontWeight="600" color="$m_light" numberOfLines={1}>
                  {props.item.employee_name}
                </Text>
              )}
              <Text fontSize={scale(12)} color="$grey">
                {dayjs(props.item.effective_date).format('DD/MM/YYYY')}
              </Text>
            </View>
          </View>
          <View gap={scale(2)}>
            <TerminationStatus status={props.item.state} />
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export default ItemPersonalReport;
