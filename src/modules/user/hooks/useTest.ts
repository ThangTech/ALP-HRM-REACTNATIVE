import api from 'hooks/api';
import useSWR from 'swr';

// interface testProps {
//   model: string;
// }

const useTest = () => {
  const { data, error } = useSWR('test', async () => {
    const res = await api.GET({
      path: '/model/fleet-vehicle/159?fields=display_name,name',
    });
    return res;
  });
  return [
    {
      data,
      error,
    },
    {},
  ] as const;
};

export default useTest;
