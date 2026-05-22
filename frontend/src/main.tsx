import React from "react";
import ReactDOM from "react-dom/client";

import { GoogleOAuthProvider } from "@react-oauth/google";

import {
  PublicClientApplication,
} from "@azure/msal-browser";

import {
  MsalProvider,
} from "@azure/msal-react";

import "./index.css";
import App from "./App";

const googleClientId =
  import.meta.env.VITE_GOOGLE_CLIENT_ID;

const microsoftClientId =
  import.meta.env.VITE_MICROSOFT_CLIENT_ID;

const microsoftTenantId =
  import.meta.env.VITE_MICROSOFT_TENANT_ID || "common";

const msalInstance =
  new PublicClientApplication({
    auth: {
      clientId: microsoftClientId,
      authority: `https://login.microsoftonline.com/${microsoftTenantId}`,
      redirectUri: window.location.origin,
      postLogoutRedirectUri: window.location.origin,
    },

    cache: {
      cacheLocation: "localStorage",
    },
  });

const startApp = async () => {
  await msalInstance.initialize();

  await msalInstance.handleRedirectPromise();

  ReactDOM.createRoot(
    document.getElementById("root")!
  ).render(
    <React.StrictMode>
      <GoogleOAuthProvider clientId={googleClientId}>
        <MsalProvider instance={msalInstance}>
          <App />
        </MsalProvider>
      </GoogleOAuthProvider>
    </React.StrictMode>
  );
};

startApp();