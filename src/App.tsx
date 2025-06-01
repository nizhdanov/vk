import { queryClient } from './api/queryClient';
import { UsersPage } from './pages/users';
import { Providers } from './Providers';

export function App() {
  return (
    <Providers queryClient={queryClient}>
      <UsersPage />
    </Providers>
  );
}
