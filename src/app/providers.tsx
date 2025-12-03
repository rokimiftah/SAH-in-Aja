import type { ReactNode } from "react";

import { ConvexClientProvider } from "@shared/lib";

interface ProvidersProps {
  children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return <ConvexClientProvider>{children}</ConvexClientProvider>;
};
