import React from "react";
import ReactDOM from "react-dom/client";

import { App, Providers } from "@app/index";

// Disable browser scroll restoration - we handle it manually
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

const rootEl = document.getElementById("root");

if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <Providers>
        <App />
      </Providers>
    </React.StrictMode>,
  );
}
