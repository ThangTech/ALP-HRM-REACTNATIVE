import React from 'react';
import { Image, Text, View, getTokens } from 'tamagui';
import { RegisterProvider } from './provider';
import { Images } from 'assets';
import { verticalScale, horizontalScale, scale } from 'utils';
import { Button, Form, Input, Screen, showToast } from 'components';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { IcShowPassword, IcHidePassword } from 'assets/svgs';
import IcBack from 'assets/svgs/IcBack';
import { useRef, useState } from 'react';
import api from 'hooks/api';
import { goBack } from 'navigators';

interface RegisterFormData {
  username: string;
  password: string;
  confirmPassword: string;
}

function RegisterPage() {
  return (
    <RegisterProvider>
      <ViewPage />
    </RegisterProvider>
  );
}

function ViewPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<any>(null);

  const renderHeader = () => {
    return (
      <View>
        <View pt={verticalScale(52)} pl={horizontalScale(8)}>
          <TouchableOpacity onPress={() => goBack()} style={styles.backButton}>
            <IcBack size={scale(24)} tintColor={getTokens().color.$red500.val} />
          </TouchableOpacity>
        </View>
        <View jc={'center'} alignItems={'center'} pt={verticalScale(16)}>
          <Image
            source={Images.alp_logo}
            w={horizontalScale(124)}
            h={verticalScale(121)}
            resizeMode="contain"
          />
          <Text
            mt={0}
            color={'$red500'}
            fontSize={scale(32)}
            fontWeight="600"
            textAlign="center"
            lineHeight={scale(45)}
            style={{ fontFamily: 'Lexend' }}
          >
            An Lộc Phát
          </Text>
        </View>
      </View>
    );
  };

  async function handleSubmit(data: RegisterFormData) {
    try {
      setIsLoading(true);
      await api.POST({
        path: '/app/signup/user',
        data: {
          name: 'Anonymous',
          email: data.username,
          login: data.username,
          pass_wd: data.password,
        },
      });
      showToast('success', 'Đăng ký thành công');
      goBack();
    } catch (error: any) {
      showToast('error', error.message || 'Đăng ký thất bại');
    }
    setIsLoading(false);
  }

  function handleRegisterPress(): void {
    formRef.current?.submit();
  }

  return (
    <Screen style={styles.container}>
      {renderHeader()}
      <View
        f={1}
        pt={verticalScale(50)}
        backgroundColor={'white'}
        ph={horizontalScale(24)}
        gap={scale(15)}
      >
        <Text
          fontSize={scale(32)}
          pb={verticalScale(20)}
          fontWeight="600"
          color={'$red500'}
          lineHeight={scale(45)}
          style={{ fontFamily: 'Lexend' }}
        >
          Đăng ký
        </Text>
        <Form<RegisterFormData> ref={formRef} onSubmit={handleSubmit} gap={scale(20)}>
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            floatingLabel={true}
            rules={{
              required: 'Vui lòng nhập tên đăng nhập',
              minLength: {
                value: 5,
                message: 'Tài khoản phải có ít nhất 5 ký tự',
              },
            }}
          >
            <Input
              placeholder="Nhập tên đăng nhập"
              activeBorderColor={getTokens().color.$red500.val}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            floatingLabel={true}
            rules={{
              required: 'Vui lòng nhập mật khẩu',
              minLength: {
                value: 6,
                message: 'Mật khẩu phải có ít nhất 6 ký tự',
              },
            }}
          >
            <Input
              placeholder="Nhập mật khẩu"
              isPassword={!showPassword}
              activeBorderColor={getTokens().color.$red500.val}
              onIconRightPress={() => setShowPassword(!showPassword)}
              iconRight={showPassword ? <IcShowPassword size={20} /> : <IcHidePassword size={20} />}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Nhập lại mật khẩu"
            floatingLabel={true}
            rules={{
              required: 'Vui lòng nhập lại mật khẩu',
              validate: (value, formValues) => {
                if (value !== formValues.password) {
                  return 'Mật khẩu không khớp';
                }
                return true;
              },
            }}
          >
            <Input
              placeholder="Nhập lại mật khẩu"
              isPassword={!showConfirmPassword}
              activeBorderColor={getTokens().color.$red500.val}
              onIconRightPress={() => setShowConfirmPassword(!showConfirmPassword)}
              iconRight={
                showConfirmPassword ? <IcShowPassword size={20} /> : <IcHidePassword size={20} />
              }
            />
          </Form.Item>
          <Button
            onPress={handleRegisterPress}
            loading={isLoading}
            style={[styles.btn, { backgroundColor: getTokens().color.$red500.val }]}
          >
            <Button.Text>Đăng Ký</Button.Text>
          </Button>
        </Form>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  btn: {
    marginTop: scale(20),
    borderRadius: scale(16),
    height: verticalScale(48),
    borderWidth: 0,
  },
  backButton: {
    padding: scale(8),
    alignSelf: 'flex-start',
  },
  container: {
    backgroundColor: getTokens().color.$white.val,
  },
});

export default RegisterPage;
