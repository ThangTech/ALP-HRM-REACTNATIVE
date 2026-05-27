import React from 'react';
import { Images } from 'assets';
import { InsuranceStatus } from 'common/enum/insurance-status';
import { Insurance, InsuranceOther } from 'common/model/insurance';
import { globalStyle } from 'common/styles/base';
import { Text } from 'components';
import dayjs from 'dayjs';
import { Image, View } from 'tamagui';
import { scale } from 'utils';
import { InsuranceType } from 'common/enum/insurance-type';

interface InsuranceItemType {
  item?: Insurance;
  insuranceOther?: InsuranceOther;
  type: InsuranceType;
}

const InsuranceItem = (props: InsuranceItemType) => {
  const isActive = [InsuranceStatus.PAYING, InsuranceStatus.JOIN].includes(
    (props.item?.insurance_status ??
      props.insuranceOther?.insurance_other_status ??
      '') as InsuranceStatus,
  );

  const blocks =
    props.type === InsuranceType.HEALTH
      ? [
          {
            title: 'Tên loại BHSK',
            value: props.insuranceOther?.insurance_other_name,
          },
          {
            title: 'Thời gian bắt đầu',
            value: `${dayjs(props.insuranceOther?.insurance_other_start).format('DD/MM/YYYY')}`,
          },
          {
            title: 'Thời gian kết thúc',
            value: `${dayjs(props.insuranceOther?.insurance_other_end).format('DD/MM/YYYY')}`,
          },
          {
            title: 'Đối tượng tham gia',
            value: props.insuranceOther?.insurance_other_object_label,
          },
        ]
      : [
          { title: 'Mã số BHXH', value: props.item?.insurance_code },
          { title: 'Số sổ BHXH', value: props.item?.insurance_code },
          {
            title: 'Ngày bắt đầu tham gia BHXH',
            value:
              typeof props.item?.insurance_join_date === 'string'
                ? dayjs(props.item.insurance_join_date).format('DD/MM/YYYY')
                : '--',
          },
          {
            title: 'Nơi đăng ký khám chữa bệnh',
            value: props.item?.registered_hospital_name || '--',
          },
        ];
  return (
    <View
      br={scale(16)}
      bg={isActive ? '$insuranceContinue' : '$insuranceExpired'}
      gap={scale(12)}
      style={globalStyle.itemShadow}
      ph={scale(24)}
      pv={scale(12)}
    >
      <View fd={'row'} gap={scale(8)} ai={'center'}>
        <Image
          source={isActive ? Images.insurance_active : Images.insurance_deactivate}
          w={scale(32)}
          h={scale(32)}
        />
        <Text fontSize={scale(20)} fontW={400}>
          {props.item?.insurance_status_label ?? props.insuranceOther?.insurance_other_status_label}
        </Text>
      </View>
      <Text fontSize={scale(24)} fontW={400}>
        {props.item?.employee_name ?? props.insuranceOther?.employee_name}
      </Text>
      <View gap={scale(6)}>
        {blocks.map((block) => (
          <View key={block.title}>
            <Text fontSize={scale(14)} fontW={400}>
              {block.title}
            </Text>
            <Text fontSize={scale(14)} fontW={400} color={'$grey'}>
              {block.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default InsuranceItem;
