import type { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  // Future: Add ConvexProvider, AuthProvider, etc.
  // Example:
  // return (
  //   <ConvexProvider client={convex}>
  //     <AuthProvider>
  //       {children}
  //     </AuthProvider>
  //   </ConvexProvider>
  // );

  return <>{children}</>;
};
