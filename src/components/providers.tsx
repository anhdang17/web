'use client';

import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="top-center"
        richColors
        closeButton
        duration={4000}
        toastOptions={{
          classNames: {
            toast: 'rounded-lg border border-border shadow-lg',
            title: 'text-sm font-medium',
            description: 'text-sm text-muted-foreground',
          },
        }}
      />
    </>
  );
}
