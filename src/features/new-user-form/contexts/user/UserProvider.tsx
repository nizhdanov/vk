import { useMemo, useState } from 'react';

import type { UserSchema } from '@/types';

import { UserContext } from './UserContext';

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<UserSchema | null>(null);

  const value = useMemo(() => ({ user, setUser }), [user]);

  return <UserContext value={value}>{children}</UserContext>;
};
