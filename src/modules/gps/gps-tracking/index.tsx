import React from 'react';
import { GpsTrackingProvider, useGpsTrackingProvider } from './provider';
import { View } from 'tamagui';
import { Button, Header, Input, showToast } from 'components';
import { Pressable, ScrollView } from 'react-native-gesture-handler';
import { scale } from 'utils';
import TimeInterval from './components/TimeInterval';
import { Controller } from 'react-hook-form';
import IcLocation from 'assets/svgs/IcLocation';
import { Image, Linking } from 'react-native';

function GpsTrackingPage() {
  return (
    <GpsTrackingProvider>
      <ViewPage />
    </GpsTrackingProvider>
  );
}

function ViewPage() {
  const provider = useGpsTrackingProvider();
  const control = provider.form.control;
  const values = provider.form.watch();
  return (
    <View f={1}>
      <Header title={'Chấm công'} />
      <ScrollView automaticallyAdjustKeyboardInsets>
        <View f={1} p={scale(16)} gap={scale(16)}>
          <TimeInterval />
          <Controller
            control={control}
            name="file"
            rules={{
              required: 'Vui lòng chụp ảnh của bạn.',
            }}
            render={() => {
              if (values.file) {
                return (
                  <>
                    <Image
                      source={{ uri: values.file.uri }}
                      // eslint-disable-next-line react-native/no-inline-styles
                      style={{ width: '100%', height: scale(300) }}
                      resizeMode="contain"
                    />
                    <Button variant="secondary" onPress={provider.takeImage}>
                      <Button.Text variant="secondary">Dùng ảnh khác</Button.Text>
                    </Button>
                  </>
                );
              }
              return (
                <Button variant="secondary" onPress={provider.takeImage}>
                  <Button.Text variant="secondary">Mở camera</Button.Text>
                </Button>
              );
            }}
          />
          <Controller
            control={control}
            name="reason"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={'Lý do'}
                placeholder={'Nhập lý do'}
                multiline
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
          />
          <Controller
            control={control}
            name="addressName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={'Tên địa điểm'}
                placeholder={'Nhập tên địa điểm'}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
          />
          <Controller
            control={control}
            name="addressDetail"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={'Địa chỉ chi tiết'}
                placeholder={'Nhập địa chỉ chi tiết'}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
          />
          <View fd={'row'} gap={scale(12)}>
            <View f={1}>
              <Controller
                control={control}
                name="latitude"
                rules={{
                  required: 'Vui lòng bật dịch vụ vị trí để thực hiện chấm công.',
                }}
                render={() => (
                  <Input
                    label={'Định vị địa điểm'}
                    editable={false}
                    multiline
                    value={
                      values.address || `Vĩ độ: ${values.latitude} - Kinh độ: ${values.longitude}`
                    }
                  />
                )}
              />
            </View>
            {values.latitude && values.longitude && (
              <View mt={scale(36)}>
                <Pressable
                  onPress={() =>
                    Linking.openURL(
                      `https://www.google.com/maps?q=${values.latitude},${values.longitude}`,
                    )
                  }
                >
                  <IcLocation />
                </Pressable>
              </View>
            )}
          </View>
          <View mt={scale(24)}>
            <Button
              variant="primary"
              onPress={() =>
                provider.form.handleSubmit(provider.onSubmit, (error) => {
                  showToast('error', Object.values(error)[0]?.message || 'Có lỗi xảy ra');
                })()
              }
              loading={!!provider.form.formState.isSubmitting}
              disabled={!!provider.form.formState.isSubmitting}
            >
              <Button.Text>Chấm công</Button.Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default GpsTrackingPage;
