import React from 'react';
import { Images } from 'assets';
import { SalaryTicket } from 'common/model/salary-ticket';
import { Image } from 'react-native';
import { View } from 'tamagui';
import { scale } from 'utils';
import { Pressable, Text } from 'components';
import dayjs from 'dayjs';
import { navigate } from 'navigators';
import { RouteName } from 'configs/navigation';

interface ItemSalaryTicketType {
  item: SalaryTicket;
}

const ItemSalaryTicket = (props: ItemSalaryTicketType) => {
  const ticketMonth = dayjs()
    .set('month', +props.item.month - 1)
    .set('year', props.item.year);
  return (
    <Pressable onPress={() => navigate(RouteName.SalaryTicketDetail, { id: props.item.id })}>
      <View
        fd={'row'}
        gap={scale(8)}
        pv={scale(16)}
        ph={scale(16)}
        bg={'$white'}
        br={scale(8)}
        mt={scale(10)}
        ai={'center'}
      >
        <Image
          source={Images.ic_phieu_luong}
          style={{ width: scale(32), height: scale(32) }}
          resizeMode="contain"
        />
        <View gap={scale(2)}>
          <Text fontSize={scale(14)}>
            {props.item.employee_name}_Tháng {props.item.month}/{props.item.year}
          </Text>
          <Text fontSize={scale(12)} color={'$d_light'}>
            {dayjs(ticketMonth).startOf('month').format('DD/MM/YYYY')} -
            {dayjs(ticketMonth).endOf('month').format('DD/MM/YYYY')}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default ItemSalaryTicket;
