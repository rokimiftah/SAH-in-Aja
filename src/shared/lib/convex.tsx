import type { ReactNode } from "react";

import { ConvexProvider, ConvexReactClient } from "convex/react";

// Get Convex URL from environment
const convexUrl = import.meta.env.PUBLIC_CONVEX_URL as string;

// Create client only if URL is configured
export const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

// Provider wrapper component
export function ConvexClientProvider({ children }: { children: ReactNode }) {
  if (!convex) {
    console.warn("Convex URL not configured. Set PUBLIC_CONVEX_URL in .env.local");
    return <>{children}</>;
  }

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
