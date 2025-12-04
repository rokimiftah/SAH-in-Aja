import { Authenticated, Unauthenticated } from "convex/react";
import { Redirect, Route, Switch } from "wouter";

import LoginPage from "@pages/Auth/LoginPage";
import MagicLinkPage from "@pages/Auth/MagicLinkPage";
import { DashboardLayout } from "@pages/dashboard";
import { LandingPage } from "@pages/landing";

import "./styles/global.css";

export const App = () => {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />

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

      {/* Protected Dashboard Routes */}
      <Route path="/dashboard">
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
      <Route path="/dashboard/:rest*">
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
        <div className="flex min-h-screen items-center justify-center">
          <h1 className="text-2xl font-bold">404 - Halaman tidak ditemukan</h1>
        </div>
      </Route>
    </Switch>
  );
};
