import { Route, Switch } from "wouter";

import { DashboardLayout } from "@pages/dashboard";
import { LandingPage } from "@pages/landing";

import "./styles/global.css";

export const App = () => {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/dashboard" component={DashboardLayout} />
      <Route path="/dashboard/:rest*" component={DashboardLayout} />
      <Route>
        {/* 404 fallback */}
        <div className="flex min-h-screen items-center justify-center">
          <h1 className="text-2xl font-bold">404 - Halaman tidak ditemukan</h1>
        </div>
      </Route>
    </Switch>
  );
};
