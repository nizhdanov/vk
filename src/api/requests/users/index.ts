import type { User, UserSchema } from '@/types';

import { api } from '@/api/instance';

interface CreateUserParams {
  data: UserSchema;
}

export const createUser = ({ data, config }: ApiRequest<CreateUserParams>) =>
  api.post<User>('/users', data, config);

export const getUsers = ({ config }: ApiRequest) => api.get<User[]>('/users', config);
