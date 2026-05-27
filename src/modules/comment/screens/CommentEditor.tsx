import IcDropdown from 'assets/svgs/IcDropdown';
import { Button, Header, Input, OptionPickerModal } from 'components';
import InputErrorMessage from 'components/base/InputErrorMessage';
import { useSafeArea } from 'hooks';
import UploadComponent from 'modules/suggestion/components/UploadComponent';
import { goBack } from 'navigators';
import React from 'react';
import { Controller } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { ScrollView, View } from 'tamagui';
import { FilePickerBottomSheet } from 'user/components';
import { horizontalScale, scale, verticalScale } from 'utils';
import { useCommentEditor } from '../hooks/useCommentEditor';

const CommentEditor = () => {
  const { bottom } = useSafeArea();
  const provider = useCommentEditor();

  return (
    <View f={1}>
      <Header title="Góp ý" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View gap={scale(36)} p={horizontalScale(15)}>
          <View gap={scale(4)}>
            <Controller
              control={provider.form.control}
              name="departmentId"
              rules={{
                required: 'Vui lòng chọn phòng ban',
              }}
              render={({ field }) => (
                <Input
                  label="Phòng ban"
                  placeholder={'Chọn phòng ban'}
                  isRequired
                  readOnly
                  disabled={provider.form.formState.isSubmitting}
                  iconRight={<IcDropdown size={20} />}
                  onPress={provider.optionPickerRef.current?.expand}
                  errorMessage={provider.errors.departmentId?.message}
                  {...field}
                  value={provider.selectedDepartment?.value || ''}
                />
              )}
            />
            <InputErrorMessage message={provider.errors.departmentId?.message} />
          </View>
          <View gap={scale(4)}>
            <Controller
              control={provider.form.control}
              name="groupId"
              rules={{
                required: 'Vui lòng nhập mô tả sáng kiến',
                validate: (value) => value.trim() !== '' || 'Vui lòng nhập mô tả sáng kiến',
              }}
              render={({ field }) => (
                <Input
                  placeholder="Chọn Nhóm/Chi nhánh"
                  label="Nhóm/Chi nhánh"
                  isRequired
                  readOnly
                  onPress={provider.groupPickerRef.current?.expand}
                  disabled={provider.form.formState.isSubmitting}
                  iconRight={<IcDropdown size={20} />}
                  errorMessage={provider.form.formState.errors.groupId?.message}
                  {...field}
                  value={provider.selectedGroup?.value || ''}
                />
              )}
            />
            <InputErrorMessage message={provider.errors.groupId?.message} />
          </View>
          <View gap={scale(4)}>
            <Controller
              control={provider.form.control}
              name="content"
              rules={{
                required: 'Vui lòng nhập nội dung góp ý',
                validate: (value) => value.trim() !== '' || 'Vui lòng nhập nội dung góp ý',
              }}
              render={({ field }) => (
                <Input
                  placeholder="Nhập nội dung góp ý"
                  multiline={true}
                  label="Nội dung góp ý"
                  isRequired
                  disabled={provider.form.formState.isSubmitting}
                  onChangeText={field.onChange}
                  errorMessage={provider.form.formState.errors.content?.message}
                  {...field}
                />
              )}
            />
            <InputErrorMessage message={provider.errors.content?.message} />
          </View>
          <View gap={scale(4)}>
            <UploadComponent
              title="Đăng tải file"
              isRequired
              disabled={provider.form.formState.isSubmitting}
              hook={provider.uploadFile}
            />
            <InputErrorMessage message={provider.errors.files?.message} />
          </View>
        </View>
      </ScrollView>
      <View
        fd={'row'}
        bg={'white'}
        gap={scale(20)}
        pt={verticalScale(16)}
        ph={verticalScale(12)}
        pb={bottom + verticalScale(12)}
      >
        <Button
          variant="secondary"
          style={styles.btn}
          onPress={goBack}
          disabled={provider.form.formState.isSubmitting}
        >
          <Button.Text variant="secondary">Hủy</Button.Text>
        </Button>
        <Button
          variant="primary"
          style={styles.btn}
          onPress={provider.form.handleSubmit(provider.onSubmit)}
          loading={provider.form.formState.isSubmitting}
        >
          <Button.Text variant="primary">Gửi</Button.Text>
        </Button>
      </View>
      <FilePickerBottomSheet
        bottomSheetRef={provider.uploadFile.filePickerRef}
        onSelectImage={provider.uploadFile.handleSelectImage}
        onSelectDocument={provider.uploadFile.handleSelectDocument}
      />
      <OptionPickerModal
        bottomSheetRef={provider.optionPickerRef}
        data={provider.departmentOptions}
        selectedValue={provider.selectedDepartment?.key}
        title={'Phòng ban'}
        onSelect={(item) => provider.form.setValue('departmentId', String(item.key))}
        searchable
      />
      <OptionPickerModal
        bottomSheetRef={provider.groupPickerRef}
        data={provider.groupOptions}
        selectedValue={provider.selectedGroup?.key}
        title={'Nhóm/Chi nhánh'}
        onSelect={(item) => provider.form.setValue('groupId', String(item.key))}
        searchable
      />
    </View>
  );
};

const styles = StyleSheet.create({
  btn: {
    flex: 1,
  },
});

export default CommentEditor;
