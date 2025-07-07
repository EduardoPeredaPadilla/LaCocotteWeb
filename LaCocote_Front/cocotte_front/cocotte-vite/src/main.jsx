import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext/AuthProvider";
import { RegDiarioProvider } from "./context/RegDiarioContext/RegDiarioProvider.jsx";

createRoot(document.getElementById("root")).render(
  // <BrowserRouter basename={window.location.pathname || ""}>
  <AuthProvider>
    <RegDiarioProvider>
      <App />
    </RegDiarioProvider>
  </AuthProvider>
  // </BrowserRouter>
);
