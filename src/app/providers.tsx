import type { ReactNode } from "react";

import { ToastProvider } from "@shared/components/ui";
import { ConvexClientProvider } from "@shared/lib";

interface ProvidersProps {
  children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <ConvexClientProvider>
      <ToastProvider>{children}</ToastProvider>
    </ConvexClientProvider>
  );
};
