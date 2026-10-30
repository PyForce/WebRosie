import "leaflet/dist/leaflet.css";
import "./styles.css";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import { App } from "./components/App";
import { makeStore } from "./store";
import { theme } from "./theme";

const root = document.getElementById("app");
if (!root) {
  throw new Error("index.html has no #app element");
}

createRoot(root).render(
  <StrictMode>
    <Provider store={makeStore()}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
