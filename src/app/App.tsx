import { Authenticated, Unauthenticated } from "convex/react";
import { Redirect, Route, Switch } from "wouter";

import LoginPage from "@pages/Auth/LoginPage";
import MagicLinkPage from "@pages/Auth/MagicLinkPage";
import { DashboardLayout } from "@pages/dashboard";
import { LandingPage } from "@pages/landing";
import { PrivacyPage, TermsPage } from "@pages/legal";
import { NotFoundPage } from "@pages/not-found";

import "./styles/global.css";

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
        <NotFoundPage />
      </Route>
    </Switch>
  );
};
