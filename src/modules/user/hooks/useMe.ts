import { RouteName } from 'configs/navigation';
import api from 'hooks/api';
import useAppContext from 'hooks/useAppContext';
import { navigate, resetRoot } from 'navigators';
import Toast from 'react-native-toast-message';
import { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';
import messaging from '@react-native-firebase/messaging';

const useMe = () => {
  const { setUser, setCurrentCompanyId } = useAppContext();
  const { mutate } = useSWRConfig();

  const onLogout = async () => {
    try {
      await messaging().deleteToken();
    } catch (e) {
      // FCM có thể chưa init / chưa cấp quyền → bỏ qua để không chặn flow logout
      console.log('deleteToken error', e);
    }
    try {
      await api.setToken('');
    } catch (e) {
      console.log('clear token error', e);
    }
    await setCurrentCompanyId?.(undefined);
    await setUser({
      name: '',
      employee_id: 0,
      employee_code: '',
      old_employee_code: '',
      job_id: 0,
      job_name: '',
      group_id: 0,
      group_name: '',
      department_id: 0,
      department_name: '',
      area_category_id: 0,
      area_category_name: '',
      work_location_text: '',
      mobile_phone: '',
      work_email: '',
      onboard_time: '',
      offical_contract_date: '',
      parent: [],
      child: [],
      birthday: '',
      identification_id: '',
      area_provide: '',
      date_provide: '',
      private_email: '',
      place_of_birth: '',
      address_now: '',
      bank_account_name: '',
      account_holder: '',
      bank_id: 0,
      bank_name: '',
      emergency_contact: '',
      emergency_relation: '',
      marital: '',
      marital_label: '',
      count_children: 0,
      children_ids: [],
      certificate_employee: '',
      study_school: '',
      study_field: '',
      image_url: '',
      emergency_phone: '',
      access_staff_transfer: false,
    });
    
    // Xoá toàn bộ SWR cache để tránh leak dữ liệu khi đổi tài khoản
    mutate(() => true, undefined, { revalidate: false });

    resetRoot({ index: 0, routes: [{ name: RouteName.Login }] });
  };

  const {
    trigger: login,
    error: loginError,
    isMutating: loading,
  } = useSWRMutation('login', async (_, { arg }: { arg: LoginRequest }) => {
    const { db, password, username } = arg;

    try {
      const res: LoginResponse = await api.POST({
        path: '/api/login',
        data: {
          username: username,
          password: password,
          db: db,
        },
      });

      await api.setToken(res.access_token);

      const profile = await api.POST({
        path: '/api/models/hr-employee/execute/get_employee_infor',
        data: {},
      });

      if (profile.data) {
        await setUser?.(profile.data);

        // Lấy default_company từ API allowed companies để set làm công ty hiện tại
        try {
          const companiesRes: any = await api.POST({
            path: '/api/models/res-users/execute/app_get_allowed_companies',
            data: {},
          });
          const defaultId =
            companiesRes?.data?.default_company?.id ??
            companiesRes?.data?.allowed_companies?.[0]?.id;
          if (defaultId != null) {
            await setCurrentCompanyId?.(defaultId);
          }
        } catch (e) {
          console.log('get_allowed_companies error', e);
        }

        Toast.show({
          type: 'success',
          text1: 'Đăng nhập thành công!',
        });
        navigate(RouteName.BottomBarStack);
        return true;
      }

      return false;
    } catch (error: any) {
      console.log(error, 'error');
      if (error) {
        if (error.code === 401) {
          Toast.show({
            type: 'error',
            text1: 'Mật khẩu hoặc tên đăng nhập không chính xác',
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Đã xảy ra lỗi, vui lòng thử lại sau',
          });
        }
      }

      return false;
    }
  });

  const { trigger: changePassword, isMutating: changePasswordLoading } = useSWRMutation(
    'changePassword',
    async (_, { arg }: { arg: { old_passwd: string; new_passwd: string } }) => {
      try {
        const res = await api.POST({
          path: '/api/models/res-users/execute/app_change_password',
          data: {
            kwargs: {
              old_passwd: arg.old_passwd,
              new_passwd: arg.new_passwd,
            },
          },
        });

        if (res?.data) {
          Toast.show({
            type: 'success',
            text1: 'Đổi mật khẩu thành công, vui lòng đăng nhập lại!',
          });
          onLogout();
          return res.data;
        }
        return null;
      } catch (error: any) {
        console.log(error, 'error');
        if (error.code === 400 || error.code === 401) {
          Toast.show({
            type: 'error',
            text1: 'Mật khẩu cũ không chính xác',
          });
        } else {
          Toast.show({
            type: 'error',
            text1: error.message || 'Đổi mật khẩu thất bại',
          });
        }
        throw error;
      }
    },
  );

  return [
    {
      loading,
      loginError,
      changePasswordLoading,
    },
    {
      login,
      changePassword,
    },
  ] as const;
};

export default useMe;
