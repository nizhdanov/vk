import { useQuery } from '@tanstack/react-query';

import { QUERY_KEY } from '@/api/queryKey';
import { getUsers } from '@/api/requests/users';

export const useGetUsersQuery = (params?: ApiQuery<typeof getUsers>) =>
  useQuery({
    queryKey: [QUERY_KEY.USERS],
    queryFn: () => getUsers({ config: params?.config }),
    ...params?.options
  });
