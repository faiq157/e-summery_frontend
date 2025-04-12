
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { ModalProvider } from "./context/ModalContext.jsx";
import { NotesheetProvider } from "./context/NotesheetContext.jsx";
import { ApprovalAccessProvider } from "./context/ApprovalAccessContext.jsx";

createRoot(document.getElementById("root")).render(
  <ApprovalAccessProvider>
  <NotesheetProvider>
    <ModalProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ModalProvider>
  </NotesheetProvider>
</ApprovalAccessProvider>
);
