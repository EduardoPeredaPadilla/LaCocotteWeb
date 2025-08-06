import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext/AuthProvider";
import { RegDiarioProvider } from "./context/RegDiarioContext/RegDiarioProvider.jsx";
import { GestPersProvider } from "./context/GestPersContext/GestPersProvider.jsx";
import { GestPagosProvider } from "./context/GestPagosContext/GestPagosProvider.jsx";
import { ConfigProvider } from "./context/ConfigContext/ConfigProvider.jsx";

createRoot(document.getElementById("root")).render(
  // <BrowserRouter basename={window.location.pathname || ""}>
  <AuthProvider>
    <ConfigProvider>
      <RegDiarioProvider>
        <GestPersProvider>
          <GestPagosProvider>
            <App />
          </GestPagosProvider>
        </GestPersProvider>
      </RegDiarioProvider>
    </ConfigProvider>
  </AuthProvider>
  // </BrowserRouter>
);
