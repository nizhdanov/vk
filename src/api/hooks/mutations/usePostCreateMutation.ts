import { useMutation } from '@tanstack/react-query';

import { createUser } from '@/api/requests/users';

export const usePostCreateMutation = (
  params?: ApiMutation<Parameters<typeof createUser>[0], typeof createUser>
) =>
  useMutation({
    mutationFn: ({ data, config }) =>
      createUser({ data, config: { ...config, ...params?.config } }),
    ...params?.options
  });
