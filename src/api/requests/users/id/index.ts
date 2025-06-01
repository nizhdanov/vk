import type { User } from '@/types';

import { api } from '@/api/instance';

interface UpdateUserParams extends IdParam {
  data: Partial<Omit<User, 'id'>>;
}

export const getUserById = ({ id, config }: ApiRequest<IdParam>) =>
  api.get<User>(`/users/${id}`, config);

export const updateUser = ({ id, data, config }: ApiRequest<UpdateUserParams>) =>
  api.put<User>(`/users/${id}`, data, config);

export const deleteUser = ({ id, config }: ApiRequest<IdParam>) =>
  api.delete<User>(`/users/${id}`, config);
