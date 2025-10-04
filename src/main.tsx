import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import AppShell from "./pages/AppShell";
import "./index.css"; // <- ensure Tailwind CSS is bundled

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <AppShell />
    </HashRouter>
  </React.StrictMode>
);
