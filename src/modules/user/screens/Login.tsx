import { IcHidePassword, IcShowPassword } from 'assets/svgs';
import { Button, Form, Input, Pressable, Text } from 'components/base';
import React, { useRef, useState } from 'react';
import { getTokens, Image, View } from 'tamagui';
import { horizontalScale, scale, verticalScale } from 'utils/scaling-utils';
import { useMe } from 'modules/user/hooks';
import { Screen } from 'components';
import { Images } from 'assets';
import { StyleSheet } from 'react-native';
// import { DB_NAME, HOST } from 'react-native-dotenv';
import { useSafeArea, useRemoteConfig } from 'hooks';
import { DB_NAME } from 'react-native-dotenv';
import { navigate } from 'navigators';
import { RouteName } from 'configs/navigation';

// Định nghĩa type cho form data
interface LoginFormData {
  username: string;
  password: string;
}

const Login = () => {
  const [{ loading }, { login }] = useMe();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const formRef = useRef<any>(null);
  const { showHiddenFeatures } = useRemoteConfig();

  // Hàm handleSubmit nhận data từ form
  const handleSubmit = (data: LoginFormData) => {
    login({
      db: DB_NAME,
      username: data.username,
      password: data.password,
    });
  };

  const handleLoginPress = () => {
    if (formRef.current) {
      formRef.current.submit();
    }
  };
  const { top } = useSafeArea();

  const renderHeader = () => {
    return (
      <View bg={'$blue'} jc={'center'}>
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

  const renderBody = () => {
    return (
      <View
        f={1}
        pt={verticalScale(30)}
        backgroundColor={'$background'}
        borderTopStartRadius={scale(30)}
        borderTopEndRadius={scale(30)}
        ph={horizontalScale(20)}
        gap={scale(15)}
      >
        <Text fontSize={scale(28)} pb={verticalScale(20)} fontWeight="bold" color={'$blue'}>
          Xin chào!
        </Text>
        <Form<LoginFormData>
          ref={formRef}
          defaultValues={{
            username: __DEV__ ? 'SVN0251' : '',
            password: __DEV__ ? '123456' : '',
            // username: 'SVN0251',
            // password: '123456',
          }}
          onSubmit={handleSubmit}
          gap={scale(20)}
        >
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={{
              required: 'Vui lòng nhập tên đăng nhập',
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

          <Pressable onPress={() => navigate(RouteName.ForgotPassword)}>
            <Text
              fontSize={scale(14)}
              textAlign="right"
              fontStyle="italic"
              textDecorationLine="underline"
              color={'$blue'}
            >
              Quên mật khẩu?
            </Text>
          </Pressable>
          <Button style={styles.btn} onPress={handleLoginPress} loading={loading}>
            <Button.Text>Đăng nhập</Button.Text>
          </Button>
          {showHiddenFeatures && (
            <Button style={styles.btnRegister} onPress={() => navigate(RouteName.Register)}>
              <Text color={'$blue'}>Đăng ký</Text>
            </Button>
          )}
        </Form>
      </View>
    );
  };

  return (
    <Screen style={styles.container}>
      {renderHeader()}
      {renderBody()}
    </Screen>
  );
};

const styles = StyleSheet.create({
  btn: {
    marginTop: scale(20),
    backgroundColor: getTokens().color.$backgroundHeader.val,
  },
  btnRegister: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: getTokens().color.$blue.val,
    color: 'red',
  },
  container: {
    backgroundColor: getTokens().color.$blue.val,
  },
});
export default Login;
