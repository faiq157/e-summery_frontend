
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { ModalProvider } from "./context/ModalContext.jsx";

createRoot(document.getElementById("root")).render(
  <ModalProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ModalProvider>
);
