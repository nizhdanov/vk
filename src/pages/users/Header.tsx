import { NewUserForm } from '@/features/new-user-form';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/shared/ui/dialog';

export function Header() {
  return (
    <header className='flex items-center justify-between py-4'>
      <h1>Пользователи</h1>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Добавить</Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Добавить пользователя</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <NewUserForm />
        </DialogContent>
      </Dialog>
    </header>
  );
}
