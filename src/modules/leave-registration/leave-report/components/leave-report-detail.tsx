import { IcClose } from 'assets/svgs';
import { globalStyle } from 'common/styles/base';
import { Button, OptionItem, Text } from 'components';
import React, { useState } from 'react';
import { View } from 'tamagui';
import { scale } from 'utils';
import Divider from './divider';
import LineItem from './line-item';
import GroupButton from './group-button';

interface LeaveReportDetailType {
  onClose?: () => void;
}

const LeaveReportDetail = (props: LeaveReportDetailType) => {
  const [option, setOption] = useState<OptionItem>({ key: 'after', value: 'Năm nay' });
  return (
    <View>
      <View fd={'row'}>
        <Text fontSize={scale(16)} fontW={500} f={1}>
          Xem chi tiết nghỉ phép
        </Text>
        <Button onPress={props.onClose}>
          <IcClose size={scale(24)} />
        </Button>
      </View>
      <Divider />
      <GroupButton
        value={option.key as string}
        onChange={setOption}
        buttons={[
          { key: 'after', value: 'Năm nay' },
          { key: 'before', value: 'Năm trước' },
        ]}
      />
      <View gap={scale(16)} style={globalStyle.itemShadow}>
        <View fd={'row'}>
          <Text f={1} fontW={500}>
            26/12/2024
          </Text>
        </View>
        <Divider />
        <View gap={scale(10)}>
          <LineItem label="Ngày bắt đầu" value="26/12/2024" />
          <Divider />
          <LineItem label="Ngày hết hạn" value="26/12/2024" />
          <Divider />
          <LineItem label="Tổng số" value="26/12/2024" />
          <Divider />
          <LineItem label="Đã sử dụng" value="26/12/2024" />
          <Divider />
          <LineItem label="Còn lại" value="26/12/2024" />
          <Divider />
        </View>
      </View>
    </View>
  );
};

export default LeaveReportDetail;
