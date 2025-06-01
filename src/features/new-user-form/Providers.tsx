import { StageProvider } from './contexts/stage';
import { UserProvider } from './contexts/user';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <StageProvider>
      <UserProvider>{children}</UserProvider>
    </StageProvider>
  );
}
