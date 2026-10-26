/* eslint-disable react-hooks/exhaustive-deps */
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Header, OptionItem, Text } from 'components';
import FileViewerItem from 'components/file-upload/FileViewerItem';
import { AppStackParamList, RouteName } from 'configs/navigation';
import dayjs from 'dayjs';
import CardContainer from 'modules/leave-registration/detail/components/CardContainer';
import React, { useEffect, useMemo } from 'react';
import { ScrollView, View } from 'tamagui';
import { getLocalFileType, scale } from 'utils';
import TerminationStatus from '../terminations/components/TerminationStatus';
import TerminationButtons from './components/TerminationButtons';
import { TerminationDetailProvider, useTerminationDetailProvider } from './provider';
import { LeaveRegistrationViewType } from 'common/enum/leave-registration-view-type';
import ItemHistory from 'modules/leave-registration/detail/components/ItemHistory';
// import { TicketType } from 'common/enum/ticket-type';
// import OptionDelete from 'components/OptionDelete';
// import OptionMenu from 'components/OptionMenu';
// import { goBack } from 'navigators';
// import { useDeleteTicket } from 'hooks/useDeleteTicket';
import { TerminationState } from 'common/enum/termination-state';
import UploadComponent from 'components/file-upload/UploadComponent';
import { StyleSheet } from 'react-native';

type LeaveRegistrationDetailProps = NativeStackScreenProps<
  AppStackParamList,
  RouteName.TerminationDetail
>;

function TerminationDetailPage(props: LeaveRegistrationDetailProps) {
  return (
    <TerminationDetailProvider>
      <ViewPage {...props} />
    </TerminationDetailProvider>
  );
}

function ViewPage(props: LeaveRegistrationDetailProps) {
  const provider = useTerminationDetailProvider();
  // const deleteProvider = useDeleteTicket();
  const id = props.route.params?.id;

  useEffect(() => {
    provider.setState((prev) => ({ ...prev, id: id as number }));
  }, [id]);

  const blocks = useMemo((): OptionItem[] => {
    if (!provider.state.termination) {
      return [];
    }
    return [
      { key: 'Nhân viên', value: provider.state.termination.employee_name },
      { key: 'Mã nhân viên', value: provider.state.termination.employee_code },
      { key: 'Loại nghỉ', value: provider.state.termination.departure_reason_name },
      {
        key: 'Ngày nộp đơn nghỉ',
        value: dayjs(provider.state.termination.resignation_date).format('DD/MM/YYYY'),
      },
      {
        key: 'Ngày nghỉ chính thức',
        value: dayjs(provider.state.termination.day_off).format('DD/MM/YYYY'),
      },
      { key: 'Hợp đồng lao động', value: provider.state.termination.contract_name },
      { key: 'Chi nhánh', value: provider.state.termination.group_name },
      { key: 'Khối', value: provider.state.termination.division_name },
      { key: 'Phòng ban', value: provider.state.termination.department_name },
      { key: 'Chức danh', value: provider.state.termination.job_name },
      { key: 'Cấp trên quản lý', value: provider.state.termination.parent_name },
      { key: 'Nội dung', value: provider.state.termination.content },
      { key: 'Người nhận bàn giao', value: provider.state.termination.receiver_employee_name },
      { key: 'Thông tin bàn giao', value: provider.state.termination.information },
      { key: 'Lý do huỷ', value: provider.state.termination.reject_reason ?? '--' },
    ];
  }, [provider.state.termination]);

  return (
    <View f={1}>
      <Header
        title={'Chi tiết đơn nghỉ'}
        // rightAction={
        //   <OptionMenu>
        //     {id && (
        //       <OptionDelete
        //         onDelete={async () => {
        //           await deleteProvider.handleDelete({
        //             ticketId: id,
        //             type: TicketType.TERMINATION,
        //           });
        //           goBack();
        //         }}
        //       />
        //     )}
        //   </OptionMenu>
        // }
      />
      <ScrollView f={1}>
        <View gap={scale(10)} p={scale(16)}>
          {blocks.map((block) => (
            <CardContainer fd={'row'} key={block.key}>
              <Text f={1} fontW={400}>
                {block.key}
              </Text>
              <View f={2} fd={'row'} justifyContent="flex-end">
                <Text fontW={500} style={styles.textFlexShink}>
                  {block.value}
                </Text>
              </View>
            </CardContainer>
          ))}
          <CardContainer fd={'row'}>
            <Text f={1} fontW={400}>
              Trạng thái
            </Text>
            <TerminationStatus status={provider.state.termination?.state} />
          </CardContainer>
          {provider.state.termination?.state === TerminationState.DRAFT && (
            <UploadComponent
              title="File đính kèm"
              hook={provider.uploadFiles}
              disabled={provider.isUploading}
            />
          )}
          {provider.state.termination?.files?.map((it) => (
            <FileViewerItem
              key={it.id}
              file={{
                id: it.id.toString(),
                name: it.name,
                uri: it.download_url,
                download_url: it.download_url,
                type: getLocalFileType(it.mimetype),
              }}
              disabledDelete={
                props.route.params?.viewType === LeaveRegistrationViewType.APPROVE ||
                provider.state.termination?.state !== TerminationState.DRAFT
              }
              handleDeleteFile={(file) => provider.handleDeleteFile(+file.id)}
            />
          ))}

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
      <TerminationButtons viewType={props.route.params?.viewType ?? LeaveRegistrationViewType.ME} />
    </View>
  );
}

export default TerminationDetailPage;
const styles = StyleSheet.create({
  textFlexShink: {
    flexShrink: 1,
  },
});
