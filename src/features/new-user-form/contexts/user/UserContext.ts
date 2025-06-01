import { createContext } from 'react';

import type { UserSchema } from '@/types';

interface UserContextProps {
  user: UserSchema | null;
  setUser: (user: UserSchema) => void;
}

export const UserContext = createContext<UserContextProps>({
  user: null,
  setUser: () => {}
});
