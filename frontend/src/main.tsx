import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";
import App from "./App.tsx";

import { BrowserRouter as Router } from "react-router-dom";

import { Provider } from "react-redux";
import store from "./store";
import Init from "./Init";
import Toasts from "./components/Toasts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Provider store={store}>
        <Toasts />
        <Init>
          <App />
        </Init>
      </Provider>
    </Router>
  </StrictMode>
);
