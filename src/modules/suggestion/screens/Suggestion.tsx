import { NativeStackScreenProps } from '@react-navigation/native-stack';
import IcStar from 'assets/svgs/IcStar';
import { SuggestionViewType } from 'common/enum/suggestion-view-type';
import { Button, Header, Input, Text } from 'components';
import InputErrorMessage from 'components/base/InputErrorMessage';
import { AppStackParamList, RouteName } from 'configs/navigation';
import { useSafeArea } from 'hooks';
import OptionPicker from 'modules/leave-registration/list/components/OptionPicker';
import { goBack } from 'navigators';
import React from 'react';
import { Controller } from 'react-hook-form';
import { Pressable, StyleSheet } from 'react-native';
import { ScrollView, View } from 'tamagui';
import { FilePickerBottomSheet } from 'user/components';
import { horizontalScale, scale, verticalScale } from 'utils';
import UploadComponent from '../components/UploadComponent';
import { useSuggestion } from '../hooks/useSuggestion';

type SuggestionProps = NativeStackScreenProps<AppStackParamList, RouteName.Suggestion>;

const Suggestion = (props: SuggestionProps) => {
  const params = props.route.params;
  const { bottom } = useSafeArea();
  const provider = useSuggestion(
    params?.id || 0,
    params?.viewType || SuggestionViewType.SUGGESTION,
  );

  const { form, uploadFile, onSubmit } = provider;
  const errors = form.formState.errors;

  const naming = params?.viewType === SuggestionViewType.COMMENT ? 'góp ý' : 'đề xuất';

  const isReadOnly = provider.suggestion?.stage_code === 'processed';
  const rate = form.watch('rate') || 0;

  return (
    <View f={1}>
      <Header title={naming.charAt(0).toUpperCase() + naming.slice(1)} />
      <ScrollView showsVerticalScrollIndicator={false} automaticallyAdjustKeyboardInsets>
        <View p={horizontalScale(15)} gap={scale(16)} paddingBottom={64}>
          <Controller
            control={form.control}
            name="employee"
            render={({ field }) => (
              <OptionPicker
                options={[]}
                onChange={field.onChange}
                value={field.value}
                required
                disabled
                placeholder={'Chọn nhân viên'}
                label={'Nhân viên'}
              />
            )}
          />
          <Controller
            control={form.control}
            name="jobId"
            render={({ field }) => (
              <OptionPicker
                options={[]}
                onChange={field.onChange}
                value={field.value}
                disabled
                placeholder={'Chọn chức danh'}
                label={'Chức danh'}
              />
            )}
          />
          <Controller
            control={form.control}
            name="groupId"
            render={({ field }) => (
              <OptionPicker
                options={[]}
                onChange={field.onChange}
                value={field.value}
                disabled
                placeholder={'Chọn nhóm/Chi nhánh'}
                label={'Nhóm/Chi nhánh'}
              />
            )}
          />
          <Controller
            control={form.control}
            name="departmentId"
            render={({ field }) => (
              <OptionPicker
                options={[]}
                onChange={field.onChange}
                value={field.value}
                disabled
                placeholder={'Chọn phòng ban'}
                label={'Phòng ban'}
              />
            )}
          />
          <View gap={scale(16)}>
            <Controller
              control={form.control}
              name="topic"
              rules={{
                required: `Vui lòng nhập chủ đề ${naming}`,
                validate: (value) => value.trim() !== '' || `Vui lòng nhập chủ đề ${naming}`,
              }}
              render={({ field }) => (
                <Input
                  label={`Chủ đề ${naming}`}
                  placeholder={`Nhập chủ đề ${naming}`}
                  isRequired
                  readOnly={isReadOnly}
                  onChangeText={field.onChange}
                  disabled={provider.form.formState.isSubmitting}
                  errorMessage={form.formState.errors.topic?.message}
                  {...field}
                />
              )}
            />
            <InputErrorMessage message={errors.topic?.message} />
          </View>
          <Controller
            control={form.control}
            name="description"
            rules={{
              required: `Vui lòng nhập mô tả ${naming}`,
              validate: (value) => value.trim() !== '' || `Vui lòng nhập mô tả ${naming}`,
            }}
            render={({ field }) => (
              <Input
                placeholder={`Mô tả ${naming}`}
                multiline={true}
                label={`Mô tả chi tiết ${naming}`}
                isRequired
                readOnly={isReadOnly}
                onChangeText={field.onChange}
                errorMessage={form.formState.errors.description?.message}
                disabled={provider.form.formState.isSubmitting}
                {...field}
              />
            )}
          />
          <InputErrorMessage message={errors.description?.message} />
          <View gap={scale(4)}>
            <UploadComponent
              title={`Đăng tải file ${naming}`}
              isRequired
              disabled={isReadOnly}
              hook={uploadFile}
            />
            <InputErrorMessage message={errors.files?.message} />
          </View>
          {provider.suggestion?.id && (
            <>
              <Controller
                control={form.control}
                name="response"
                render={({ field }) => (
                  <Input
                    placeholder={`Nội dung phản hồi`}
                    multiline={true}
                    label={`Nội dung phản hồi`}
                    editable={false}
                    {...field}
                  />
                )}
              />
              <OptionPicker
                options={[]}
                onChange={() => {}}
                value={{ key: '', value: provider.suggestion?.team_name ?? '' }}
                disabled
                placeholder={'Bộ phận hỗ trợ'}
                label={'Bộ phận hỗ trợ'}
              />
            </>
          )}
          {isReadOnly && (
            <View gap={scale(4)} fd={'row'}>
              <Text f={1} fontW={500} fontSize={12}>
                Đánh giá phản hồi
              </Text>
              <View fd={'row'} gap={scale(4)}>
                <Controller
                  control={form.control}
                  name="rate"
                  render={() => (
                    <>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Pressable key={index} onPress={() => form.setValue('rate', index + 1)}>
                          <IcStar
                            color={index + 1 <= rate ? '#007ACC' : undefined}
                            strokeColor={index + 1 <= rate ? '#007ACC' : 'grey'}
                            key={index}
                          />
                        </Pressable>
                      ))}
                    </>
                  )}
                />
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      {(!params?.id || isReadOnly) && (
        <View
          fd={'row'}
          bg={'white'}
          gap={scale(20)}
          pt={verticalScale(16)}
          ph={verticalScale(12)}
          pb={bottom + verticalScale(12)}
        >
          <Button variant="secondary" style={styles.btn} onPress={goBack}>
            <Button.Text variant="secondary">Hủy</Button.Text>
          </Button>
          <Button
            variant="primary"
            style={styles.btn}
            disabled={!!provider.form.formState.isSubmitting}
            onPress={form.handleSubmit(onSubmit)}
          >
            <Button.Text variant="primary">Lưu</Button.Text>
          </Button>
        </View>
      )}
      <FilePickerBottomSheet
        bottomSheetRef={uploadFile.filePickerRef}
        onSelectImage={uploadFile.handleSelectImage}
        onSelectDocument={uploadFile.handleSelectDocument}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  btn: {
    flex: 1,
  },
});

export default Suggestion;
