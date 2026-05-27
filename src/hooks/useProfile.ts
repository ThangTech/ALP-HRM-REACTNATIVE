import useSWR from 'swr';
import api from './api';
import useAppContext from './useAppContext';

export const useProfile = () => {
  const { setUser } = useAppContext();

  const _fetchProfile = async () => {
    const profile = await api.POST({
      path: '/api/models/hr-employee/execute/get_employee_infor',
      data: {},
    });

    if (profile.data) {
      await setUser?.(profile.data);
    }
  };

  useSWR('me-profile', _fetchProfile);
};
