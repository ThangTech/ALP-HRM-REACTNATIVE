import { IcHidePassword, IcShowPassword, IcCheckbox, IcUnCheckbox } from 'assets/svgs';
import { Button, Form, Input, Pressable, Text } from 'components/base';
import React, { useEffect, useRef, useState } from 'react';
import { Image, View } from 'tamagui';
import { horizontalScale, scale, verticalScale } from 'utils/scaling-utils';
import { useMe } from 'modules/user/hooks';
import { getCredentials, saveCredentials, clearCredentials } from 'modules/user/utils/credentials';
import { Screen } from 'components';
import { Images } from 'assets';
import { StyleSheet } from 'react-native';
import { useRemoteConfig } from 'hooks';
import { DB_NAME } from 'react-native-dotenv';
import { navigate } from 'navigators';
import { RouteName } from 'configs/navigation';
import { useWatch } from 'react-hook-form';

// Định nghĩa type cho form data
interface LoginFormData {
  username: string;
  password: string;
}

const SubmitButton = ({ loading, onPress }: { loading: boolean; onPress: () => void }) => {
  const username = useWatch<LoginFormData>({ name: 'username' });
  const password = useWatch<LoginFormData>({ name: 'password' });
  const isValid = !!(username && password && password.length >= 6);

  return (
    <Button onPress={onPress} loading={loading} disabled={!isValid} style={styles.btn}>
      <Button.Text>Đăng nhập</Button.Text>
    </Button>
  );
};

const Login = () => {
  const [{ loading }, { login }] = useMe();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const formRef = useRef<any>(null);
  const { showHiddenFeatures } = useRemoteConfig();
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    (async () => {
      const creds = await getCredentials();
      if (creds?.username) {
        formRef.current?.reset({
          username: creds.username,
          password: creds.password,
        });
        setRememberMe(true);
      }
    })();
  }, []);

  // Hàm handleSubmit nhận data từ form
  const handleSubmit = async (data: LoginFormData) => {
    const ok = await login({
      db: DB_NAME,
      username: data.username,
      password: data.password,
    });

    if (ok && rememberMe) {
      await saveCredentials(data.username, data.password);
    } else if (!rememberMe) {
      await clearCredentials();
    }
  };

  const handleLoginPress = () => {
    if (formRef.current) {
      formRef.current.submit();
    }
  };

  const renderHeader = () => {
    return (
      <View jc={'center'} alignItems={'center'} pt={verticalScale(86)}>
        <Image
          source={Images.alp_logo}
          w={horizontalScale(124)}
          h={verticalScale(121)}
          resizeMode="contain"
        />
        <Text
          mt={0}
          color={'#EF4444'}
          fontSize={scale(32)}
          fontWeight="600"
          textAlign="center"
          lineHeight={scale(45)}
          style={styles.fontLexend}
        >
          An Lộc Phát
        </Text>
      </View>
    );
  };

  const renderBody = () => {
    return (
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
          color={'#EF4444'}
          lineHeight={scale(45)}
          style={styles.fontLexend}
        >
          Đăng nhập
        </Text>
        <Form<LoginFormData>
          ref={formRef}
          defaultValues={{
            username: __DEV__ ? '' : '',
            password: __DEV__ ? '' : '',
          }}
          onSubmit={handleSubmit}
          gap={scale(20)}
        >
          <Form.Item
            name="username"
            label="Tài khoản"
            floatingLabel={true}
            rules={{
              required: 'Vui lòng nhập tài khoản',
            }}
          >
            <Input placeholder="Email / Tên đăng nhập" activeBorderColor="#EF4444" />
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
              placeholder="Mật khẩu"
              isPassword={!showPassword}
              activeBorderColor="#EF4444"
              onIconRightPress={() => setShowPassword(!showPassword)}
              iconRight={showPassword ? <IcShowPassword size={20} /> : <IcHidePassword size={20} />}
            />
          </Form.Item>

          <View
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            mt={scale(4)}
            paddingLeft={scale(4)}
          >
            <Pressable onPress={() => setRememberMe(!rememberMe)} style={styles.rowCenter}>
              {rememberMe ? (
                <IcCheckbox width={scale(14)} height={scale(14)} tintColor="#EF4444" />
              ) : (
                <IcUnCheckbox width={scale(14)} height={scale(14)} tintColor="#EF4444" />
              )}
              <Text ml={scale(8)} fontSize={scale(14)} color="$black">
                Ghi nhớ đăng nhập
              </Text>
            </Pressable>
          </View>
          <SubmitButton loading={loading} onPress={handleLoginPress} />
          {showHiddenFeatures && (
            <Button style={styles.btnRegister} onPress={() => navigate(RouteName.Register)}>
              <Text color={'#EF4444'}>Đăng ký</Text>
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
    borderRadius: scale(16),
    height: verticalScale(48),
    borderWidth: 0,
    backgroundColor: '#EF4444',
  },
  btnRegister: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  container: {
    backgroundColor: 'white',
  },
  fontLexend: {
    fontFamily: 'Lexend',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default Login;
