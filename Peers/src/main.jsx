import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <GoogleOAuthProvider clientId="463905837396-ts6e6c5d058amml59pfek9t8p1gjei1s.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
  // </React.StrictMode>
);
