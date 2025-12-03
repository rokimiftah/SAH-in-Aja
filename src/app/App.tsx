import { Route, Switch } from "wouter";

import { LandingPage } from "@pages/landing";
import { SiapHalalPage } from "@pages/siap-halal";

import "./styles/global.css";

export const App = () => {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/siap-halal" component={SiapHalalPage} />
      <Route>
        {/* 404 fallback */}
        <div className="flex min-h-screen items-center justify-center">
          <h1 className="text-2xl font-bold">404 - Halaman tidak ditemukan</h1>
        </div>
      </Route>
    </Switch>
  );
};
