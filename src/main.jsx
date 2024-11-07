
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./components/theme-provider.jsx";

createRoot(document.getElementById("root")).render(
   <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <AuthProvider>
        <App />
      </AuthProvider>
      </ThemeProvider>
);
