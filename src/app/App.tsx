import { Authenticated, Unauthenticated, useConvexAuth, useQuery } from "convex/react";
import { AnimatePresence } from "motion/react";
import { Redirect, Route, Switch, useLocation } from "wouter";

import { AdminDashboard, AdminLayout, PromoCodesPage, UsersPage } from "@pages/admin";
import LoginPage from "@pages/Auth/LoginPage";
import MagicLinkPage from "@pages/Auth/MagicLinkPage";
import { DashboardLayout } from "@pages/dashboard";
import { LandingPage } from "@pages/landing";
import { PrivacyPage, TermsPage } from "@pages/legal";
import { NotFoundPage } from "@pages/not-found";
import { PageTransition } from "@shared/components";
import { BRANDING } from "@shared/config/branding";

import { api } from "../../convex/_generated/api";

import "./styles/global.css";

function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <img src="/logo.avif" alt={BRANDING.name} className="h-24 w-auto animate-none" />
    </div>
  );
}

// Wrapper for protected routes that shows loading state while auth is being determined
function ProtectedRoute({
  children,
  fallback = <Redirect to="/login" />,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { isLoading } = useConvexAuth();

  if (isLoading) {
    return <AuthLoading />;
  }

  return (
    <>
      <Authenticated>{children}</Authenticated>
      <Unauthenticated>{fallback}</Unauthenticated>
    </>
  );
}

// Wrapper for guest-only routes (login, magic link)
function GuestRoute({
  children,
  fallback = <Redirect to="/dashboard" />,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { isLoading } = useConvexAuth();

  if (isLoading) {
    return <AuthLoading />;
  }

  return (
    <>
      <Authenticated>{fallback}</Authenticated>
      <Unauthenticated>{children}</Unauthenticated>
    </>
  );
}

// Helper component to protect admin routes
function AdminRoute({ children }: { children: React.ReactNode }) {
  const user = useQuery(api.users.getCurrentUser);

  if (user === undefined) {
    return <AuthLoading />;
  }

  if (!user || user.role !== "admin") {
    return <Redirect to="/dashboard" />;
  }

  return <>{children}</>;
}

export const App = () => {
  const [location] = useLocation();

  // Normalize location for transition key - dashboard routes share same key
  const getTransitionKey = () => {
    if (location.startsWith("/dashboard")) return "/dashboard";
    if (location.startsWith("/admin")) return "/admin";
    return location;
  };

  return (
    <AnimatePresence
      mode="wait"
      onExitComplete={() => {
        window.scrollTo({ top: 0, behavior: "instant" });
      }}
    >
      <PageTransition key={getTransitionKey()}>
        <Switch location={location}>
          <Route path="/" component={LandingPage} />
          <Route path="/terms" component={TermsPage} />
          <Route path="/privacy" component={PrivacyPage} />

          {/* Login Page */}
          <Route path="/login">
            {() => (
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            )}
          </Route>

          {/* Magic Link Verification */}
          <Route path="/link">
            {() => (
              <GuestRoute>
                <MagicLinkPage />
              </GuestRoute>
            )}
          </Route>

          {/* Admin Routes - Flat structure to avoid wouter nesting issues */}
          <Route path="/admin">
            {() => (
              <ProtectedRoute>
                <AdminRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </AdminRoute>
              </ProtectedRoute>
            )}
          </Route>

          <Route path="/admin/promos">
            {() => (
              <ProtectedRoute>
                <AdminRoute>
                  <AdminLayout>
                    <PromoCodesPage />
                  </AdminLayout>
                </AdminRoute>
              </ProtectedRoute>
            )}
          </Route>

          <Route path="/admin/users">
            {() => (
              <ProtectedRoute>
                <AdminRoute>
                  <AdminLayout>
                    <UsersPage />
                  </AdminLayout>
                </AdminRoute>
              </ProtectedRoute>
            )}
          </Route>

          {/* Protected Dashboard Routes */}
          <Route path="/dashboard/*?">
            {() => (
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            )}
          </Route>

          <Route>
            {/* 404 fallback */}
            <NotFoundPage />
          </Route>
        </Switch>
      </PageTransition>
    </AnimatePresence>
  );
};
