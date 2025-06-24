import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import { BrowserRouter as Router } from "react-router-dom";

import { Provider } from "react-redux";
import store from "./store";
import Init from "./Init";
import Toasts from "./components/Toasts";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ScrollToTop } from "./components/common/ScrollToTop";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AppWrapper>
        <Router>
          <Provider store={store}>
            <Toasts />
            <Init>
              <ScrollToTop />
              <App />
            </Init>
          </Provider>
        </Router>
      </AppWrapper>
    </ThemeProvider>
  </StrictMode>
);
