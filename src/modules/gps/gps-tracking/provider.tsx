import Geolocation from '@react-native-community/geolocation';
import { useIsFocused } from '@react-navigation/native';
import { showToast } from 'components';
import { UploadedFile } from 'components/file-upload/useUploadFile';
import { goBack } from 'navigators';
import React, { createContext, ReactElement, useCallback, useContext, useEffect } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { useFilePicker } from 'user/hooks/useFilePicker';
import { useGpsTrackingApi } from './hooks/useGpsTracking';

/** W3C Geolocation error codes — compare with `error.code`, not `error.PERMISSION_DENIED` (may be missing on plain objects). */
// const GEO_ERROR_CODE = {
//   PERMISSION_DENIED: 1,
//   POSITION_UNAVAILABLE: 2,
//   TIMEOUT: 3,
// } as const;

const GpsTrackingContext = createContext<GpsTrackingType>(null!);

interface GpsTrackingType {
  form: UseFormReturn<GpsTrackingForm>;
  onSubmit: (data: GpsTrackingForm) => void;
  takeImage: () => Promise<void>;
}

export interface GpsTrackingForm {
  latitude?: number;
  longitude?: number;
  address?: string;
  reason?: string;
  addressName?: string;
  addressDetail?: string;
  file?: UploadedFile;
}

export function useGpsTrackingProvider() {
  return useContext(GpsTrackingContext);
}

export function GpsTrackingProvider({ children }: { children: ReactElement }) {
  const form = useForm<GpsTrackingForm>({
    defaultValues: {},
  });
  const gpsTrackingApi = useGpsTrackingApi();
  const filePicker = useFilePicker();
  const isFocused = useIsFocused();

  const onSubmit = async (data: GpsTrackingForm) => {
    try {
      const resolvedAddress =
        data.address ||
        (data.latitude && data.longitude
          ? await gpsTrackingApi.getAddressFromCoords({
              latitude: data.latitude,
              longitude: data.longitude,
            })
          : undefined);

      await gpsTrackingApi.createTracking({
        ...data,
        address: resolvedAddress,
      });
      showToast('success', 'Chấm công thành công');
      goBack();
    } catch (error: any) {
      showToast('error', error.message ?? 'Chấm công thất bại, vui lòng thử lại');
    }
  };

  const takeImage = async () => {
    const result = await filePicker.takeImage();
    if (!result) {
      return;
    }
    form.setValue('file', {
      id: `temp-${Date.now()}`,
      uri: result.uri,
      name: result.name,
      type: result.type,
    });
  };

  // const _handlePermissionLocation = useCallback(
  //   (error: GeolocationError) => {
  //     if (error.code === GEO_ERROR_CODE.PERMISSION_DENIED) {
  //       Alert.alert(
  //         'Thông báo',
  //         'Vui lòng cấp quyền vị trí để sử dụng chức năng chấm công bằng GPS.',
  //         [
  //           { text: 'Quay lại', onPress: () => goBack() },
  //           { text: 'OK', onPress: () => Linking.openSettings() },
  //         ],
  //       );
  //     } else if (error.code === GEO_ERROR_CODE.POSITION_UNAVAILABLE) {
  //       Alert.alert('Thông báo', 'Vị trí hiện không khả dụng. Vui lòng thử lại sau.', [
  //         { text: 'Quay lại', onPress: () => goBack() },
  //       ]);
  //     } else if (error.code === GEO_ERROR_CODE.TIMEOUT) {
  //       Alert.alert('Thông báo', 'Vị trí hiện không khả dụng. Vui lòng thử lại sau.', [
  //         { text: 'Quay lại', onPress: () => goBack() },
  //         { text: 'Thử lại', onPress: () => _requestLocation() },
  //       ]);
  //     }
  //   },
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [isFocused],
  // );

  const _requestLocation = useCallback(async () => {
    Geolocation.requestAuthorization();

    Geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        form.setValue('latitude', latitude);
        form.setValue('longitude', longitude);

        try {
          const address = await gpsTrackingApi.getAddressFromCoords({ latitude, longitude });
          form.setValue('address', address);
        } catch (error) {
          showToast('error', 'Không thể lấy địa chỉ từ tọa độ hiện tại.');
        }
      },
      undefined,
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 },
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  useEffect(() => {
    _requestLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  const value = {
    form,
    onSubmit,
    takeImage,
  };
  return <GpsTrackingContext.Provider value={value}>{children}</GpsTrackingContext.Provider>;
}
