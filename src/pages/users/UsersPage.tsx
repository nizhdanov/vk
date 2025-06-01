import { Header } from './Header';
import { UsersTable } from './UsersTable';

export function UsersPage() {
  return (
    <div className='flex min-h-screen flex-col px-4'>
      <Header />
      <main>
        <UsersTable />
      </main>
    </div>
  );
}
