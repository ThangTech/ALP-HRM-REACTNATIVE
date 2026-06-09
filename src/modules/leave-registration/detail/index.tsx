/* eslint-disable react-hooks/exhaustive-deps */
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LeaveButtonType, LeaveRegistrationStatus } from 'common/enum/leave-registration-status';
import { LeaveRegistrationViewType } from 'common/enum/leave-registration-view-type';
import { TicketType } from 'common/enum/ticket-type';
import { Header, Text } from 'components';
import OptionDelete from 'components/OptionDelete';
import OptionMenu from 'components/OptionMenu';
import { AppStackParamList, RouteName } from 'configs/navigation';
import dayjs from 'dayjs';
import { useDeleteTicket } from 'hooks/useDeleteTicket';
import { goBack } from 'navigators';
import React, { useEffect, useMemo } from 'react';
import { ScrollView, View } from 'tamagui';
import { getLocaleDurationDisplay, horizontalScale, scale, verticalScale } from 'utils';
import ActionButtons from '../editor/components/ActionButtons';
import { mapStatusBg, mapStatusColor, mapStatusText } from '../list/components/ItemRegistration';
import CardContainer from './components/CardContainer';
import ItemHistory from './components/ItemHistory';
import { LeaveRegistrationDetailProvider, useLeaveRegistrationDetailProvider } from './provider';

type LeaveRegistrationDetailProps = NativeStackScreenProps<
  AppStackParamList,
  RouteName.LeaveRegistrationsDetail
>;

function LeaveRegistrationDetailPage(props: LeaveRegistrationDetailProps) {
  return (
    <LeaveRegistrationDetailProvider>
      <BottomSheetModalProvider>
        <ViewPage {...props} />
      </BottomSheetModalProvider>
    </LeaveRegistrationDetailProvider>
  );
}

function ViewPage(props: LeaveRegistrationDetailProps) {
  const provider = useLeaveRegistrationDetailProvider();
  const deleteProvider = useDeleteTicket();
  const detail = provider.state.item;

  const isViewApprove = props.route.params?.viewType === LeaveRegistrationViewType.APPROVE;

  const buttons = useMemo(() => {
    const viewOnlyButtons = [LeaveButtonType.ACTION_CANCEL, LeaveButtonType.APPROVAL_SUBMIT];
    const isApprovedFinal = detail?.state === LeaveRegistrationStatus.APPROVED;

    if (isViewApprove) {
      return detail?.buttons?.filter((it) => {
        if (it === LeaveButtonType.APPROVAL_SET_TO_DRAFT) return !isApprovedFinal;
        return !viewOnlyButtons.includes(it);
      });
    } else {
      return detail?.buttons?.filter((it) => {
        if (it === LeaveButtonType.APPROVAL_SET_TO_DRAFT) return !isApprovedFinal;
        return viewOnlyButtons.includes(it);
      });
    }
  }, [isViewApprove, detail]);

  useEffect(() => {
    provider.setState((prev) => ({ ...prev, id: props.route.params?.id }));
  }, [props.route.params?.id]);

  return (
    <View f={1}>
      <Header
        title="Chi tiết đơn xin nghỉ"
        rightAction={
          detail?.state !== LeaveRegistrationStatus.APPROVED ? (
            <OptionMenu>
              <OptionDelete
                onDelete={async () => {
                  await deleteProvider.handleDelete({
                    ticketId: detail?.id,
                    type: TicketType.LEAVE_REGISTRATION,
                  });
                  goBack();
                }}
              />
            </OptionMenu>
          ) : undefined
        }
      />
      <ScrollView showsVerticalScrollIndicator={false} p={scale(16)}>
        <View gap={scale(12)} mb={32}>
          <CardContainer fd="row">
            <Text f={1} fontW={400}>
              Nhân viên
            </Text>
            <View f={2} fd={'row'} justifyContent="flex-end">
              <Text fontW={500}>
                [{detail?.employee_code}] {detail?.employee_name}
              </Text>
            </View>
          </CardContainer>
          <CardContainer fd="row">
            <Text f={1} fontW={400}>
              Chức danh
            </Text>
            <View f={2} fd={'row'} justifyContent="flex-end">
              <Text fontW={500}>{detail?.job_name ?? '--'}</Text>
            </View>
          </CardContainer>
          <CardContainer fd="row">
            <Text f={1} fontW={400}>
              Loại nghỉ
            </Text>
            <View f={2} fd={'row'} justifyContent="flex-end">
              <Text fontW={500}>{detail?.holiday_status_name}</Text>
            </View>
          </CardContainer>
          <View fd={'row'} gap={scale(8)}>
            <CardContainer>
              <Text fontW={400}>Từ</Text>
              <Text fontW={500}>
                {dayjs(provider.state.item?.date_from).format('DD/MM/YYYY HH:mm')}
              </Text>
            </CardContainer>
            <CardContainer>
              <Text fontW={400}>Đến</Text>
              <Text fontW={500}>
                {dayjs(provider.state.item?.date_to).format('DD/MM/YYYY HH:mm')}
              </Text>
            </CardContainer>
          </View>
          <View fd={'row'} gap={scale(8)}>
            <CardContainer>
              <Text fontW={400}>Thời gian nghỉ</Text>
              <Text fontW={500}>
                {getLocaleDurationDisplay(provider.state.item?.duration_display ?? '')}
              </Text>
            </CardContainer>
            <CardContainer>
              <Text fontW={400}>Trạng thái</Text>
              <View fd={'row'}>
                <Text
                  ph={horizontalScale(8)}
                  pv={verticalScale(1)}
                  borderRadius={scale(4)}
                  fontW={500}
                  bg={mapStatusBg.get(provider.state.item?.state!)}
                  color={mapStatusColor.get(provider.state.item?.state!)}
                >
                  {mapStatusText.get(provider.state.item?.state!)}
                </Text>
              </View>
            </CardContainer>
          </View>
          <CardContainer>
            <Text fontW={400}>Giờ công quy đổi</Text>
            <Text fontW={500}>{provider.state.item?.leave_hours || '--'}</Text>
          </CardContainer>
          <CardContainer>
            <Text fontW={400}>Lý do nghỉ</Text>
            <Text fontW={500} c={'$detractive'}>
              {provider.state.item?.name || '--'}
            </Text>
          </CardContainer>
          {!!provider.state.item?.id && (
            <CardContainer>
              <Text fontW={400}>Lý do huỷ</Text>
              <Text fontW={500} c={'$detractive'}>
                {provider.state.item?.reject_reason || '--'}
              </Text>
            </CardContainer>
          )}

          {!!provider.createDateInfo?.data?.id && (
            <>
              <CardContainer>
                <Text fontW={400}>Người tạo</Text>
                <Text fontW={500}>{provider.createDateInfo?.data.creator_name || '--'}</Text>
              </CardContainer>
              <CardContainer>
                <Text fontW={400}>Thời gian tạo</Text>
                <Text fontW={500}>
                  {dayjs(provider.createDateInfo?.data.create_date).format('DD/MM/YYYY HH:mm:ss') ||
                    '--'}
                </Text>
              </CardContainer>
            </>
          )}
          {!!provider.histories?.data?.approval_steps?.length && (
            <CardContainer>
              <View gap={scale(16)}>
                {provider.histories?.data?.approval_steps.map((item) => (
                  <ItemHistory
                    key={item.step_approval_id}
                    item={{
                      step_name: item.step_approval_name || '',
                      description: item.description || '',
                    }}
                  />
                ))}
              </View>
            </CardContainer>
          )}
        </View>
      </ScrollView>
      {!!buttons?.length && (
        <ActionButtons
          buttons={buttons}
          triggerUpdate={provider.triggerUpdate}
          isViewApprove={isViewApprove}
        />
      )}
    </View>
  );
}

export default LeaveRegistrationDetailPage;
