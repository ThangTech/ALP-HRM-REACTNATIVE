import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LeaveRegistrationRequestTimeType } from 'common/enum/leave-registration-period';
import { LeaveButtonType } from 'common/enum/leave-registration-status';
import { TicketType } from 'common/enum/ticket-type';
import { globalStyle } from 'common/styles/base';
import { Button, Header, Input } from 'components';
import OptionDelete from 'components/OptionDelete';
import OptionMenu from 'components/OptionMenu';
import { AppStackParamList, RouteName } from 'configs/navigation';
import dayjs from 'dayjs';
import { useSafeArea } from 'hooks';
import { useDeleteTicket } from 'hooks/useDeleteTicket';
import { goBack } from 'navigators';
import React, { useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { ScrollView, View } from 'tamagui';
import { isCodeShowLeaveHours, scale, verticalScale } from 'utils';
import DatePicker from '../list/components/DatePicker';
import OptionPicker from '../list/components/OptionPicker';
import ActionButtons from './components/ActionButtons';
import {
  LeaveRegistrationEditorProvider,
  LeaveRegistrationForm,
  useLeaveRegistrationEditorProvider,
} from './provider';

type LeaveRegistrationEditorPageProps = NativeStackScreenProps<
  AppStackParamList,
  RouteName.LeaveRegistrationEditor
>;

function LeaveRegistrationEditorPage(props: LeaveRegistrationEditorPageProps) {
  const params = props.route.params;
  return (
    <LeaveRegistrationEditorProvider {...params}>
      <BottomSheetModalProvider>
        <ViewPage />
      </BottomSheetModalProvider>
    </LeaveRegistrationEditorProvider>
  );
}

function ViewPage() {
  const safeArea = useSafeArea();
  const provider = useLeaveRegistrationEditorProvider();
  const deleteProvider = useDeleteTicket();
  const formValues = provider.form.watch();

  const selectedType = useMemo(() => {
    return provider.state.leaveRegistrationTypes?.find((option) => option.key === formValues.type);
  }, [provider.state.leaveRegistrationTypes, formValues.type]);

  const selectedRequestTimeType = useMemo(() => {
    return provider.state.requestTimeOptions?.find(
      (option) => option.key === formValues.requestType,
    );
  }, [provider.state.requestTimeOptions, formValues.requestType]);

  const selectedPeriod = useMemo(() => {
    return provider.state.leaveRegistrationPeriodOptions?.find(
      (option) => option.key === formValues.period,
    );
  }, [provider.state.leaveRegistrationPeriodOptions, formValues.period]);

  // ['nb', 'kl'] = ['Nghỉ bù', 'Nghỉ không lương']
  const isShowLeaveHours = isCodeShowLeaveHours(selectedType?.data?.code ?? '--');

  async function handleSubmit(data: LeaveRegistrationForm): Promise<void> {
    await provider.onSubmit(data);
  }

  const buttons = useMemo(() => {
    const viewOnlyButtons = [LeaveButtonType.ACTION_CANCEL, LeaveButtonType.APPROVAL_SUBMIT];
    return provider.leaveDetail?.buttons?.filter((it) => viewOnlyButtons.includes(it));
  }, [provider.leaveDetail]);

  return (
    <View f={1}>
      <Header
        title={'Tạo đơn xin nghỉ'}
        rightAction={
          <OptionMenu>
            {provider.leaveDetail?.id && (
              <OptionDelete
                onDelete={async () => {
                  await deleteProvider.handleDelete({
                    ticketId: provider.leaveDetail?.id,
                    type: TicketType.LEAVE_REGISTRATION,
                  });
                  goBack();
                }}
              />
            )}
          </OptionMenu>
        }
      />
      <ScrollView f={1} showsVerticalScrollIndicator={false} automaticallyAdjustKeyboardInsets>
        <View p={scale(16)} gap={scale(16)}>
          <Controller
            name="type"
            control={provider.form.control}
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <OptionPicker
                label="Loại nghỉ"
                placeholder="Chọn loại nghỉ"
                required
                value={selectedType}
                onChange={(item) => field.onChange(item?.key)}
                options={provider.state.leaveRegistrationTypes ?? []}
              />
            )}
          />
          <Controller
            name="requestType"
            control={provider.form.control}
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <OptionPicker
                label="Thời gian nghỉ"
                placeholder="Thời gian nghỉ"
                required
                value={selectedRequestTimeType}
                onChange={(item) => field.onChange(item?.key)}
                options={provider.state.requestTimeOptions ?? []}
              />
            )}
          />
          {formValues.requestType !== LeaveRegistrationRequestTimeType.DATE_EXACT && (
            <View fd={'row'} gap={scale(8)}>
              <Controller
                name="dateFrom"
                control={provider.form.control}
                rules={{
                  required: true,
                }}
                render={({ field }) => (
                  <DatePicker
                    label="Ngày"
                    mode="date"
                    required
                    valueFormat="DD/MM/YYYY"
                    value={dayjs(field.value).toDate()}
                    onChange={(value) => field.onChange(value)}
                  />
                )}
              />
            </View>
          )}
          {formValues.requestType === LeaveRegistrationRequestTimeType.EXACT && (
            <>
              <View fd={'row'} gap={scale(8)}>
                <Controller
                  name="timeFrom"
                  control={provider.form.control}
                  rules={{
                    required: true,
                  }}
                  render={({ field }) => (
                    <DatePicker
                      label="Từ giờ"
                      required
                      mode="time"
                      valueFormat="HH:mm"
                      value={dayjs(field.value).toDate()}
                      onChange={(value) => field.onChange(value)}
                    />
                  )}
                />
                <Controller
                  name="timeTo"
                  control={provider.form.control}
                  rules={{
                    required: true,
                  }}
                  render={({ field }) => (
                    <DatePicker
                      label="Đến giờ"
                      required
                      mode="time"
                      valueFormat="HH:mm"
                      value={dayjs(field.value).toDate()}
                      onChange={(value) => field.onChange(value)}
                    />
                  )}
                />
              </View>
            </>
          )}
          {formValues.requestType === LeaveRegistrationRequestTimeType.DATE_EXACT && (
            <>
              <View fd={'row'} gap={scale(8)}>
                <Controller
                  name="dateFrom"
                  control={provider.form.control}
                  rules={{
                    required: true,
                  }}
                  render={({ field }) => (
                    <DatePicker
                      label="Từ ngày"
                      required
                      mode="date"
                      valueFormat="DD/MM/YYYY"
                      value={dayjs(field.value).toDate()}
                      onChange={(value) => field.onChange(value)}
                    />
                  )}
                />
                <Controller
                  name="dateTo"
                  control={provider.form.control}
                  rules={{
                    required: true,
                  }}
                  render={({ field }) => (
                    <DatePicker
                      label="Đến ngày"
                      required
                      mode="date"
                      valueFormat="DD/MM/YYYY"
                      value={dayjs(field.value).toDate()}
                      onChange={(value) => field.onChange(value)}
                    />
                  )}
                />
              </View>
            </>
          )}
          {formValues.requestType === LeaveRegistrationRequestTimeType.PERIOD && (
            <>
              <View gap={scale(8)} f={1}>
                <Controller
                  name="period"
                  control={provider.form.control}
                  rules={{
                    required: true,
                  }}
                  render={({ field }) => (
                    <OptionPicker
                      label="Buổi"
                      placeholder="Buổi"
                      required
                      value={selectedPeriod}
                      onChange={(item) => field.onChange(item?.key)}
                      options={provider.state.leaveRegistrationPeriodOptions ?? []}
                    />
                  )}
                />
              </View>
            </>
          )}

          <View gap={scale(16)}>
            {/* <Controller
              name="durationDisplay"
              control={provider.form.control}
              render={() => (
                <Input
                  label={'Đã đề nghị'}
                  placeholder={'Đã đề nghị'}
                  value={formValues.durationDisplay}
                  editable={false}
                />
              )}
            /> */}
            {isShowLeaveHours && (
              <Controller
                name="leaveHours"
                control={provider.form.control}
                render={({ field }) => (
                  <Input
                    label={'Giờ công quy đổi'}
                    placeholder={'Giờ công quy đổi'}
                    value={formValues.leaveHours}
                    keyboardType="numeric"
                    onChangeValue={field.onChange}
                  />
                )}
              />
            )}
            <Controller
              name="reason"
              control={provider.form.control}
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <Input
                  label={'Lý do nghỉ'}
                  placeholder={'Nhập lý do nghỉ'}
                  isRequired
                  onChangeValue={field.onChange}
                  multiline={true}
                  scrollEnabled={false}
                  value={field.value}
                />
              )}
            />
            {provider.leaveDetail?.id && (
              <Input
                label={'Lý do huỷ'}
                placeholder={'Nhập lý do huỷ'}
                multiline={true}
                scrollEnabled={false}
                readOnly
                value={provider.leaveDetail?.reject_reason || '--'}
              />
            )}
          </View>
        </View>
      </ScrollView>

      {!provider.leaveDetail?.id ? (
        <View
          fd="row"
          gap={scale(12)}
          pt={verticalScale(12)}
          pb={verticalScale(12) + safeArea.bottom}
          ph={scale(16)}
          bg={'$white'}
        >
          <View f={1}>
            <Button onPress={goBack} variant="detractive">
              <Button.Text variant="detractive">Huỷ</Button.Text>
            </Button>
          </View>
          <View f={1}>
            <Button
              onPress={provider.form.handleSubmit(handleSubmit)}
              style={globalStyle.btnPrimary}
              disabled={
                provider.form.formState.isSubmitting ||
                !provider.form.formState.isValid ||
                !formValues.reason?.trim()
              }
              loading={provider.form.formState.isSubmitting}
            >
              <Button.Text variant="primary">Tạo mới</Button.Text>
            </Button>
          </View>
        </View>
      ) : (
        <ActionButtons buttons={buttons ?? []} triggerUpdate={provider.handleChangeStatus} />
      )}
    </View>
  );
}

export default LeaveRegistrationEditorPage;
