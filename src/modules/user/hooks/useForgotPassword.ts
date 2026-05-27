import api from 'hooks/api';
import useSWRMutation from 'swr/mutation';

export const useForgotPasswordApi = () => {
  const _forgotPassword = async (_: any, { arg }: { arg: string }) => {
    await api.POST({
      path: '/app/forgot-password',
      data: {
        login: arg,
      },
    });
  };
  const { trigger: forgotPassword } = useSWRMutation(['forgotPassword'], _forgotPassword);
  return {
    forgotPassword,
  };
};
