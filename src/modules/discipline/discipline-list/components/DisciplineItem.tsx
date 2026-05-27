import React from 'react';
import { Images } from 'assets';
import { DisciplineType } from 'common/enum/discipline-type';
import { Discipline } from 'common/model/discipline';
import { Text } from 'components';
import { Image } from 'react-native';
import { View } from 'tamagui';
import { scale } from 'utils';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { navigate } from 'navigators';
import { RouteName } from 'configs/navigation';
import dayjs from 'dayjs';

interface DisciplineItemType {
  item: Discipline;
}

const DisciplineItem = (props: DisciplineItemType) => {
  const isReward = props.item.type === DisciplineType.REWARD;
  const bgColor = isReward ? '#ADD1E7' : '#F1D8D8';
  const moneyColor = isReward ? '#7CB351' : '#A70F0A';
  return (
    <TouchableOpacity onPress={() => navigate(RouteName.DisciplineDetail, { id: props.item.id })}>
      <View gap={scale(16)} p={16} bg={bgColor} br={scale(12)}>
        <View fd={'row'} gap={scale(8)}>
          <Image
            source={isReward ? Images.reward : Images.discipline}
            width={scale(24)}
            height={scale(24)}
          />
          <View>
            <Text fontSize={scale(17)} fontW={600}>
              {props.item.label_type}
            </Text>
            <Text fontSize={scale(14)} fontW={700} color={'#6F6D6D'}>
              {props.item.getObjectDescription()}
            </Text>
            <Text fontSize={scale(14)} fontW={400} color={'#6F6D6D'}>
              Nội dung: {props.item.content || '--'}
            </Text>
          </View>
        </View>
        <View fd={'column'} ai={'flex-end'}>
          <Text fontSize={scale(20)} fontW={700} color={moneyColor}>
            {isReward ? '' : '-'}
            {props.item.value?.toLocaleString()}
          </Text>
          <Text fontSize={scale(14)} fontW={400} color={'#8A8A8A'}>
            {dayjs(props.item.effective_date).format('DD/MM/YYYY')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DisciplineItem;
