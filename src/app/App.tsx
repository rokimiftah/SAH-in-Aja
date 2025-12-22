import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { Redirect, Route, Switch } from "wouter";

import { AdminDashboard, AdminLayout, PromoCodesPage, UsersPage } from "@pages/admin";
import LoginPage from "@pages/Auth/LoginPage";
import MagicLinkPage from "@pages/Auth/MagicLinkPage";
import { DashboardLayout } from "@pages/dashboard";
import { LandingPage } from "@pages/landing";
import { PrivacyPage, TermsPage } from "@pages/legal";
import { NotFoundPage } from "@pages/not-found";

import { api } from "../../convex/_generated/api";

import "./styles/global.css";

// Helper component to protect admin routes
function AdminRoute({ children }: { children: React.ReactNode }) {
  const user = useQuery(api.users.getCurrentUser);

  if (user === undefined) {
    return null; // Silent loading
  }

  if (!user || user.role !== "admin") {
    return <Redirect to="/dashboard" />;
  }

  return <>{children}</>;
}

export const App = () => {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/privacy" component={PrivacyPage} />

      {/* Login Page */}
      <Route path="/login">
        {() => (
          <>
            <Authenticated>
              <Redirect to="/dashboard" />
            </Authenticated>
            <Unauthenticated>
              <LoginPage />
            </Unauthenticated>
          </>
        )}
      </Route>

      {/* Magic Link Verification */}
      <Route path="/link">
        {() => (
          <>
            <Authenticated>
              <Redirect to="/dashboard" />
            </Authenticated>
            <Unauthenticated>
              <MagicLinkPage />
            </Unauthenticated>
          </>
        )}
      </Route>

      {/* Admin Routes - Flat structure to avoid wouter nesting issues */}
      <Route path="/admin">
        {() => (
          <>
            <Authenticated>
              <AdminRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </AdminRoute>
            </Authenticated>
            <Unauthenticated>
              <Redirect to="/login" />
            </Unauthenticated>
          </>
        )}
      </Route>

      <Route path="/admin/promos">
        {() => (
          <>
            <Authenticated>
              <AdminRoute>
                <AdminLayout>
                  <PromoCodesPage />
                </AdminLayout>
              </AdminRoute>
            </Authenticated>
            <Unauthenticated>
              <Redirect to="/login" />
            </Unauthenticated>
          </>
        )}
      </Route>

      <Route path="/admin/users">
        {() => (
          <>
            <Authenticated>
              <AdminRoute>
                <AdminLayout>
                  <UsersPage />
                </AdminLayout>
              </AdminRoute>
            </Authenticated>
            <Unauthenticated>
              <Redirect to="/login" />
            </Unauthenticated>
          </>
        )}
      </Route>

      {/* Protected Dashboard Routes */}
      <Route path="/dashboard/*?">
        {() => (
          <>
            <Authenticated>
              <DashboardLayout />
            </Authenticated>
            <Unauthenticated>
              <Redirect to="/login" />
            </Unauthenticated>
          </>
        )}
      </Route>

      <Route>
        {/* 404 fallback */}
        <NotFoundPage />
      </Route>
    </Switch>
  );
};
