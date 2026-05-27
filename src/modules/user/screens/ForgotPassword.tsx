import { Images } from 'assets';
import IcBack from 'assets/svgs/IcBack';
import { Button, Form, Input, Pressable, Screen, showToast, Text } from 'components';
import { useSafeArea } from 'hooks';
import { goBack } from 'navigators';
import React, { useRef, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { getTokens, Image, View } from 'tamagui';
import { useForgotPasswordApi } from 'user/hooks/useForgotPassword';
import { horizontalScale, scale, verticalScale } from 'utils';

interface ForgotFromData {
  username: string;
}

const ForgotPassword = () => {
  const { top } = useSafeArea();
  const formRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const forgotPwdApi = useForgotPasswordApi();

  async function handleSubmit(data: ForgotFromData) {
    try {
      setLoading(true);
      await forgotPwdApi.forgotPassword(data.username);
      Alert.alert('Thành công', 'Link đặt lại mật khẩu đã được gửi đến email của bạn');
    } catch (error) {
      showToast('error', 'Đã có lỗi xảy ra, vui lòng thử lại sau.');
    }
    setLoading(false);
  }

  function handleForgotPress(): void {
    if (formRef.current) {
      formRef.current.submit();
    }
  }

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
        <View fd={'row'} gap={scale(16)}>
          <Pressable onPress={() => goBack()}>
            <IcBack tintColor={'#007ACC'} />
          </Pressable>
          <Text f={1} fontSize={scale(28)} pb={verticalScale(20)} fontWeight="bold" color={'$blue'}>
            Quên mật khẩu?
          </Text>
        </View>
        <Form<ForgotFromData>
          ref={formRef}
          defaultValues={{
            username: '',
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
          <Button style={styles.btn} onPress={handleForgotPress} loading={loading}>
            <Button.Text>Lấy lại mật khẩu</Button.Text>
          </Button>
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

export default ForgotPassword;
