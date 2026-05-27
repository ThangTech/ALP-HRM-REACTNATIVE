import useSWRMutation from 'swr/mutation';
import { GpsTrackingForm } from '../provider';
import api from 'hooks/api';
import { UploadedFile } from 'components/file-upload/useUploadFile';
import { getRemoteFileType } from 'utils';

export const useGpsTrackingApi = () => {
  const _handleUpload = async (resId: number, file: UploadedFile) => {
    const form = new FormData();
    form.append('files', {
      uri: file.uri,
      name: file.name,
      type: getRemoteFileType(file.type),
    } as any);
    form.append('res_id', resId.toString());
    await api.POST({
      path: '/api/models/driver-attendance-log/upload_files/upload_attendance_image',
      data: form,
    });
  };

  const getAddressFromCoords = async ({
    latitude,
    longitude,
  }: {
    latitude?: number;
    longitude?: number;
  }) => {
    const response = await api.POST({
      path: '/api/models/driver-attendance-log/execute/app_get_address_from_coords',
      data: {
        kwargs: {
          latitude,
          longitude,
        },
      },
    });
    return (
      response?.data?.address ??
      response?.data?.result?.address ??
      response?.data?.data?.address ??
      ''
    );
  };

  const _createTracking = async (_: any, { arg }: { arg: GpsTrackingForm }) => {
    const response = await api.POST({
      path: '/api/models/driver-attendance/execute/create_attendance_gps',
      data: {
        kwargs: {
          latitude: arg.latitude,
          longitude: arg.longitude,
          address: arg.address ?? '',
          reason: arg.reason,
          address_name: arg.addressName,
          address_detail: arg.addressDetail,
        },
      },
    });
    const resId = response?.data?.id;
    if (arg.file && resId) {
      await _handleUpload(resId, arg.file);
    }
    return response;
  };

  const { trigger: createTracking } = useSWRMutation(['create_gps_tracking'], _createTracking);

  return {
    createTracking,
    getAddressFromCoords,
  };
};
