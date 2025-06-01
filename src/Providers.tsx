import type { QueryClient } from '@tanstack/react-query';

import { QueryClientProvider } from '@tanstack/react-query';

interface ProvidersProps {
  children: React.ReactNode;
  queryClient: QueryClient;
}

export function Providers({ children, queryClient }: ProvidersProps) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
