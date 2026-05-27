import React, { useEffect } from 'react';
import { OverTimeDetailProvider, useOverTimeDetailProvider } from './provider';
import { ScrollView, View } from 'tamagui';
import CardContainer from 'modules/leave-registration/detail/components/CardContainer';
import { Header, Text } from 'components';
import { scale } from 'utils';
import TerminationStatus from 'modules/termination/terminations/components/TerminationStatus';
import { TerminationState } from 'common/enum/termination-state';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList, RouteName } from 'configs/navigation';
import OverTimeButtons from './components/OverTimeButtons';

type OverTimeDetailProps = NativeStackScreenProps<AppStackParamList, RouteName.OvertimeDetail>;

function OverTimeDetailPage(props: OverTimeDetailProps) {
  return (
    <OverTimeDetailProvider>
      <ViewPage {...props} />
    </OverTimeDetailProvider>
  );
}

function ViewPage(props: OverTimeDetailProps) {
  const provider = useOverTimeDetailProvider();
  // const detail = provider.state.detail;

  useEffect(() => {
    provider.setState((prev) => ({
      ...prev,
      id: props.route.params?.id,
      viewType: props.route.params?.viewType,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.route.params?.id, props.route.params?.viewType]);

  const blocks = [
    { key: 'Tiêu đề', value: 'Kiểm kê tại chi nhánh Yên Bái' },
    { key: 'Nhân viên đăng ký OT', value: 'Nguyễn Văn ABC' },
    { key: 'Loại OT', value: 'Tính vào lương' },
    { key: 'Ngày OT', value: '19/09/2025' },
  ];
  return (
    <View f={1}>
      <Header title="Chi tiết đơn OT" />
      <ScrollView f={1}>
        <View gap={scale(10)} p={scale(16)}>
          {blocks.map((block) => (
            <CardContainer fd={'row'} key={block.key}>
              <Text f={1} fontW={400}>
                {block.key}
              </Text>
              <Text fontW={500}>{block.value}</Text>
            </CardContainer>
          ))}
          <View fd={'row'} gap={scale(8)}>
            <CardContainer>
              <Text fontW={400}>Từ</Text>
              <Text fontW={500}>13:00</Text>
            </CardContainer>
            <CardContainer>
              <Text fontW={400}>Đến</Text>
              <Text fontW={500}>13:00</Text>
            </CardContainer>
          </View>
          <View fd={'row'} gap={scale(8)}>
            <CardContainer>
              <Text fontW={400}>Giờ theo kế hoạch</Text>
              <Text fontW={500}>2</Text>
            </CardContainer>
            <CardContainer>
              <Text fontW={400}>Trạng thái</Text>
              <TerminationStatus status={TerminationState.WAITING} />
            </CardContainer>
          </View>
          <CardContainer>
            <Text fontW={400}>Lý do OT</Text>
            <Text fontW={500}>Kiểm kê tại chi nhánh Yên Bái</Text>
          </CardContainer>
        </View>
      </ScrollView>
      <OverTimeButtons />
    </View>
  );
}

export default OverTimeDetailPage;
