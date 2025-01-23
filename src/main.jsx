
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { ModalProvider } from "./context/ModalContext.jsx";
import { NotesheetProvider } from "./context/NotesheetContext.jsx";

createRoot(document.getElementById("root")).render(
  <NotesheetProvider>
    <ModalProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ModalProvider>
  </NotesheetProvider>
);
