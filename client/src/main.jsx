import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";

import { AuthProvider } from "./context/AuthContext";

import "./styles/theme.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>

    <AuthProvider>

      <App />

      <ToastContainer
        position="top-right"
        autoClose={3000}
      />

    </AuthProvider>

  </React.StrictMode>
);