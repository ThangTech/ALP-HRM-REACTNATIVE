import React from 'react';
import { OverTimeEditorProvider, useOverTimeEditorProvider } from './provider';
import { ScrollView, View } from 'tamagui';
import { Button, Header, Input } from 'components';
import { cleanNumberString, scale } from 'utils';
import { Controller } from 'react-hook-form';
import OptionPicker from 'modules/leave-registration/list/components/OptionPicker';
import DatePicker from 'modules/leave-registration/list/components/DatePicker';
import { useSafeArea } from 'hooks';
import { OverTimeRequestTime } from 'common/enum/over-time-request-time';
import UploadComponent from 'components/file-upload/UploadComponent';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList, RouteName } from 'configs/navigation';
import ActionButtons from 'modules/leave-registration/editor/components/ActionButtons';
import { goBack } from 'navigators';
import { ActivityIndicator } from 'react-native';
import CardContainer from 'components/CardContainer';
import ItemHistory from 'modules/leave-registration/detail/components/ItemHistory';

type OverTimeEditorProps = NativeStackScreenProps<AppStackParamList, RouteName.OvertimeEditor>;
function OverTimeEditorPage(props: OverTimeEditorProps) {
  return (
    <OverTimeEditorProvider {...props.route.params}>
      <ViewPage />
    </OverTimeEditorProvider>
  );
}

function ViewPage() {
  const safeArea = useSafeArea();
  const provider = useOverTimeEditorProvider();
  const control = provider.form.control;

  const requestTimeType = provider.form.watch('requestTimeType');

  const isRequestDate = requestTimeType?.key === OverTimeRequestTime.DATE_CUSTOM;
  const isRequestTime = requestTimeType?.key === OverTimeRequestTime.TIME_CUSTOM;

  return (
    <View f={1}>
      <Header title={'Tạo đơn đăng ký tăng ca'} />

      <ScrollView f={1} automaticallyAdjustKeyboardInsets>
        <View p={scale(16)} gap={scale(16)}>
          <Controller
            name="employee"
            control={control}
            rules={{
              required: 'Vui lòng chọn nhân viên',
            }}
            render={({ field }) => (
              <OptionPicker
                label="Nhân viên"
                required
                onChange={field.onChange}
                options={provider.employeeOptions || []}
                value={field.value}
              />
            )}
          />
          {provider.overTimeDetail?.id && (
            <OptionPicker
              label="Chức danh"
              disabled
              onChange={() => {}}
              options={[]}
              value={{ key: '', value: provider.overTimeDetail?.job_name || '' }}
            />
          )}
          <Input label="Phân bổ" isRequired editable={false} value={'Tăng ca'} />
          <Controller
            name="type"
            control={control}
            rules={{
              required: 'Vui lòng chọn loại tăng ca',
            }}
            render={({ field }) => (
              <OptionPicker
                label="Loại tăng ca"
                required
                placeholder="Chọn loại tăng ca"
                onChange={field.onChange}
                options={provider.holidayOptions || []}
                value={field.value}
              />
            )}
          />
          <Controller
            name="overtimeType"
            control={control}
            rules={{
              required: 'Vui lòng chọn loại tăng ca',
            }}
            render={({ field }) => (
              <OptionPicker
                label="Loại tăng ca"
                required
                placeholder="Chọn loại tăng ca"
                onChange={(value) =>
                  provider.form.reset({
                    ...provider.form.getValues(),
                    overtimeType: value,
                    autoFillCoefficient: true,
                    percent: '',
                  })
                }
                options={provider.state.overTimeTypes || []}
                value={field.value}
              />
            )}
          />
          <Controller
            name="shift"
            control={control}
            render={({ field }) => (
              <OptionPicker
                label="Ca làm việc"
                placeholder="Chọn ca làm việc"
                searchable
                onChange={field.onChange}
                options={provider.workShiftList || []}
                value={field.value}
              />
            )}
          />
          <Controller
            name="requestTimeType"
            control={control}
            rules={{
              required: 'Vui lòng chọn thời gian OT',
            }}
            render={({ field }) => (
              <OptionPicker
                label="Thời gian OT"
                required
                onChange={field.onChange}
                options={provider.state.requestTimeTypes || []}
                value={field.value}
              />
            )}
          />
          {isRequestDate && (
            <View fd={'row'} gap={scale(16)}>
              <Controller
                name="requestFromTime"
                control={control}
                rules={{
                  required: 'Vui lòng chọn ngày',
                }}
                render={({ field }) => (
                  <DatePicker
                    label="Từ ngày"
                    required
                    mode="date"
                    onChange={(value) =>
                      provider.form.reset({
                        ...provider.form.getValues(),
                        requestFromTime: value,
                        autoFillCoefficient: true,
                        percent: '',
                      })
                    }
                    value={field.value}
                    valueFormat="DD/MM/YYYY"
                  />
                )}
              />
              <Controller
                name="requestToTime"
                control={control}
                rules={{
                  required: 'Vui lòng chọn ngày',
                }}
                render={({ field }) => (
                  <DatePicker
                    label="Đến ngày"
                    mode="date"
                    required
                    onChange={(value) =>
                      provider.form.reset({
                        ...provider.form.getValues(),
                        requestToTime: value,
                        autoFillCoefficient: true,
                        percent: '',
                      })
                    }
                    value={field.value}
                    valueFormat="DD/MM/YYYY"
                  />
                )}
              />
            </View>
          )}
          {isRequestTime && (
            <>
              <Controller
                name="requestDate"
                control={control}
                rules={{
                  required: 'Vui lòng chọn ngày',
                }}
                render={({ field }) => (
                  <DatePicker
                    label="Ngày"
                    required
                    mode="date"
                    onChange={(value) =>
                      provider.form.reset({
                        ...provider.form.getValues(),
                        requestDate: value,
                        autoFillCoefficient: true,
                        percent: '',
                      })
                    }
                    value={field.value}
                    valueFormat="DD/MM/YYYY"
                  />
                )}
              />
              <View fd={'row'} gap={scale(16)}>
                <Controller
                  name="requestFromTime"
                  control={control}
                  rules={{
                    required: 'Vui lòng chọn giờ',
                  }}
                  render={({ field }) => (
                    <DatePicker
                      label="Từ giờ"
                      required
                      mode="time"
                      onChange={field.onChange}
                      value={field.value}
                      valueFormat="HH:mm"
                    />
                  )}
                />
                <Controller
                  name="requestToTime"
                  control={control}
                  rules={{
                    required: 'Vui lòng chọn giờ',
                  }}
                  render={({ field }) => (
                    <DatePicker
                      label="Đến giờ"
                      mode="time"
                      required
                      onChange={field.onChange}
                      value={field.value}
                      valueFormat="HH:mm"
                    />
                  )}
                />
              </View>
            </>
          )}
          <Controller
            name="totalTimeRegistered"
            control={control}
            render={({ field }) => (
              <Input
                label="Đã đăng kí (Ngày/giờ)"
                isRequired
                placeholder={'--:-- giờ'}
                editable={false}
                value={field.value}
              />
            )}
          />
          <Controller
            name="timeRest"
            control={control}
            render={({ field }) => (
              <Input
                label="Số giờ nghỉ giữa ca"
                placeholder={'1.0'}
                keyboardType="numeric"
                value={field.value}
                onChangeValue={(value) => {
                  const val = cleanNumberString(value);
                  field.onChange(val);
                }}
              />
            )}
          />
          <Controller
            name="totalTimeOverTime"
            control={control}
            render={({ field }) => (
              <Input
                label="Số giờ tăng ca"
                placeholder={'0.0'}
                value={field.value}
                keyboardType="number-pad"
                editable={false}
                onChangeValue={field.onChange}
              />
            )}
          />
          <Controller
            name="percent"
            control={control}
            render={({ field }) => (
              <Input
                label="Hệ số"
                keyboardType="numeric"
                value={field.value}
                placeholder={'0.0'}
                onChangeValue={(value) => {
                  const val = cleanNumberString(value);
                  field.onChange(val);
                  provider.form.reset({
                    ...provider.form.getValues(),
                    percent: val,
                    autoFillCoefficient: false,
                  });
                }}
              />
            )}
          />

          <Controller
            name="reason"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Input
                label="Lý do"
                isRequired
                multiline
                placeholder={'Nhập lý do'}
                value={field.value}
                onChangeValue={field.onChange}
              />
            )}
          />
          {provider.overTimeDetail?.id && (
            <Input
              label="Lý do huỷ"
              multiline
              readOnly
              value={provider.overTimeDetail?.reject_reason || '--'}
            />
          )}

          <UploadComponent
            hook={provider.uploadFile}
            title="Đăng tải file"
            handleDeleteFile={provider.deleteFile}
          />
          {!!provider.histories?.data?.approval_steps?.length && (
            <CardContainer>
              <View gap={scale(16)} p={scale(16)}>
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
      {provider.isUpdating && (
        <View position="absolute" top={scale(111)} right={0} bg={'white'} p={scale(2)}>
          <ActivityIndicator size={scale(16)} />
        </View>
      )}
      {provider.state.id ? (
        <ActionButtons
          triggerUpdate={provider.triggerUpdate}
          buttons={provider.overTimeDetail?.buttons || []}
        />
      ) : (
        <View
          fd={'row'}
          ph={scale(16)}
          gap={scale(16)}
          bg={'white'}
          pt={scale(12)}
          pb={scale(12) + safeArea.bottom}
        >
          <View f={1}>
            <Button
              variant="detractive"
              disabled={!!provider.form.formState.isSubmitting}
              onPress={goBack}
            >
              <Button.Text variant="detractive">Hủy</Button.Text>
            </Button>
          </View>
          <View f={1}>
            <Button
              variant="primary"
              disabled={!provider.form.formState.isValid}
              loading={!!provider.form.formState.isSubmitting}
              onPress={() => provider.form.handleSubmit(provider.onSubmit)()}
            >
              <Button.Text variant="primary">Lưu</Button.Text>
            </Button>
          </View>
        </View>
      )}
    </View>
  );
}

export default OverTimeEditorPage;
