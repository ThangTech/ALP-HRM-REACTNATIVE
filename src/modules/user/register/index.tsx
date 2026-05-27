import React from 'react';
import { getTokens, Image, Text, View } from 'tamagui';
import { RegisterProvider } from './provider';
import { Images } from 'assets';
import { verticalScale, horizontalScale, scale } from 'utils';
import { useSafeArea } from 'hooks';
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
  const { top } = useSafeArea();

  const renderHeader = () => {
    return (
      <View bg={'$blue'} jc={'center'}>
        <TouchableOpacity
          onPress={() => goBack()}
          style={[styles.backButton, { top: top + scale(10) }]}
        >
          <IcBack size={scale(30)} />
        </TouchableOpacity>
        <Image
          source={Images.login_bg}
          alignSelf="flex-end"
          resizeMode="contain"
          mt={verticalScale(150)}
          w={horizontalScale(200)}
          h={verticalScale(150)}
          mb={verticalScale(5)}
        />
        <View position="absolute" top={scale(20)} left={0} right={0} bottom={0}>
          <Image
            source={Images.savani_logo}
            w={horizontalScale(140)}
            h={verticalScale(140)}
            bg={'white'}
            br={scale(100)}
            as={'center'}
            mt={top}
          />
          <Text
            textAlign="center"
            mt={verticalScale(20)}
            mb={verticalScale(50)}
            color={'$white'}
            fontSize={scale(28)}
            fontW={'bold'}
          >
            SAVANI
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
    <Screen>
      {renderHeader()}
      <View f={1} p={scale(16)}>
        <Form<RegisterFormData> ref={formRef} onSubmit={handleSubmit} gap={scale(20)}>
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={{
              required: 'Vui lòng nhập tên đăng nhập',
              minLength: {
                value: 5,
                message: 'Tài khoản phải có ít nhất 5 ký tự',
              },
            }}
          >
            <Input placeholder="Nhập tên đăng nhập" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
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
              onIconRightPress={() => setShowPassword(!showPassword)}
              iconRight={showPassword ? <IcShowPassword size={20} /> : <IcHidePassword size={20} />}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Nhập lại mật khẩu"
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
              onIconRightPress={() => setShowConfirmPassword(!showConfirmPassword)}
              iconRight={
                showConfirmPassword ? <IcShowPassword size={20} /> : <IcHidePassword size={20} />
              }
            />
          </Form.Item>
          <Button style={styles.btn} onPress={handleRegisterPress} loading={isLoading}>
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
    backgroundColor: getTokens().color.$backgroundHeader.val,
  },
  backButton: {
    position: 'absolute',
    left: horizontalScale(16),
    zIndex: 10,
    padding: scale(8),
  },
});

export default RegisterPage;
