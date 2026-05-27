import { IcHidePassword, IcShowPassword } from 'assets/svgs';
import { Button, Form, Header, Input } from 'components';
import React, { useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView, View } from 'tamagui';
import { horizontalScale, verticalScale } from 'utils';
import { useMe } from 'modules/user/hooks';

interface ChangePasswordFormData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

const ChangePassword = () => {
  const [{ changePasswordLoading }, { changePassword }] = useMe();

  const formRef = useRef<any>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const handleSubmit = async (data: ChangePasswordFormData) => {
    await changePassword({
      old_passwd: data.current_password,
      new_passwd: data.new_password,
    });
  };

  const handleChangePasswordPress = () => {
    if (formRef.current) {
      formRef.current.submit();
    }
  };

  const renderHeader = () => {
    return <Header title={'Đổi mật khẩu'} />;
  };

  const renderInput = () => {
    return (
      <Form<ChangePasswordFormData>
        ref={formRef}
        defaultValues={{
          current_password: '',
          new_password: '',
          confirm_password: '',
        }}
        onSubmit={handleSubmit}
        style={styles.container}
      >
        <Form.Item
          name="current_password"
          label="Mật khẩu hiện tại"
          rules={{
            required: 'Vui lòng nhập mật khẩu hiện tại',
          }}
        >
          <Input
            placeholder="Nhập mật khẩu hiện tại"
            isPassword={!showCurrentPassword}
            onIconRightPress={() => setShowCurrentPassword(!showCurrentPassword)}
            iconRight={
              showCurrentPassword ? <IcShowPassword size={20} /> : <IcHidePassword size={20} />
            }
          />
        </Form.Item>

        <Form.Item
          name="new_password"
          label="Mật khẩu mới"
          rules={{
            required: 'Vui lòng nhập mật khẩu mới',
            minLength: {
              value: 6,
              message: 'Mật khẩu phải có ít nhất 6 ký tự',
            },
          }}
        >
          <Input
            placeholder="Nhập mật khẩu mới"
            isPassword={!showNewPassword}
            onIconRightPress={() => setShowNewPassword(!showNewPassword)}
            iconRight={
              showNewPassword ? <IcShowPassword size={20} /> : <IcHidePassword size={20} />
            }
          />
        </Form.Item>

        <Form.Item
          name="confirm_password"
          label="Xác nhận mật khẩu"
          rules={{
            required: 'Vui lòng xác nhận mật khẩu',
            validate: (value, formValues) => {
              if (value !== formValues.new_password) {
                return 'Mật khẩu không khớp';
              }
              return true;
            },
          }}
        >
          <Input
            placeholder="Nhập lại mật khẩu"
            isPassword={!showNewPassword}
            onIconRightPress={() => setShowConfirmPassword(!showConfirmPassword)}
            iconRight={
              showConfirmPassword ? <IcShowPassword size={20} /> : <IcHidePassword size={20} />
            }
          />
        </Form.Item>
      </Form>
    );
  };

  const renderButton = () => {
    return (
      <View backgroundColor={'white'} ph={horizontalScale(16)} pv={verticalScale(30)}>
        <Button onPress={handleChangePasswordPress} loading={changePasswordLoading}>
          <Button.Text>Đổi mật khẩu</Button.Text>
        </Button>
      </View>
    );
  };
  const renderBody = () => {
    return (
      <>
        <ScrollView>
          <View f={1} pv={verticalScale(16)}>
            {renderInput()}
          </View>
        </ScrollView>
        {renderButton()}
      </>
    );
  };
  return (
    <View f={1}>
      {renderHeader()}
      {renderBody()}
    </View>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: horizontalScale(16),
    flex: 1,
    gap: verticalScale(16),
  },
});
