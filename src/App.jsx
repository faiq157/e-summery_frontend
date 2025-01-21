import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Registration/Login";
import ForgotPass from "./pages/Registration/ForgotPass";
import ResetPassword from "./pages/Registration/ResetPassword";
import PrivateRoute from "./components/PrivateRoute";
import Progress from "./pages/Progress";
import Completed from "./pages/Completed";
import Tracking from "./pages/Tracking";
import Setting from "./pages/Setting";
import DraftApplication from "./pages/createApp/DraftApplication";
import NotFoundPage from "./pages/NotFoundPage";
import CreateApplication from "./pages/createApp/CreateApplication";
import Register from "./pages/Registration/Register";
import AdminDashboard from "./pages/AdminDashboard";

import { NonAdminRoute } from "./constant/Non-AdminRoute";
import { AdminRoute } from "./constant/AdminRoute";
import Received from "./pages/Received";
import { useEffect } from "react";
import { generatToken, messaging } from "./notification/firebase-config";
import { onMessage } from "firebase/messaging";


function App() {
  useEffect(() => {
    generatToken();
    onMessage(messaging, (payload) => {
      console.log(payload)
    })
  }, [])
  return (
    <BrowserRouter>
      <Routes>
        {/* Home Routes - Non-Admin Users */}
        <Route path="/" element={<NonAdminRoute><PrivateRoute /></NonAdminRoute>}>
          <Route index element={<NonAdminRoute><Home /></NonAdminRoute>} />
          <Route path="progress" element={<NonAdminRoute><Progress /></NonAdminRoute>} />
          <Route path="received" element={<NonAdminRoute><Received /></NonAdminRoute>} />
          <Route path="completed" element={<NonAdminRoute><Completed /></NonAdminRoute>} />
          <Route path="tracking" element={<NonAdminRoute><Tracking /></NonAdminRoute>} />
          <Route path="setting" element={<NonAdminRoute><Setting /></NonAdminRoute>} />
          <Route path="create" element={<NonAdminRoute><CreateApplication /></NonAdminRoute>} />
          <Route path="draft" element={<NonAdminRoute><DraftApplication /></NonAdminRoute>} />
        </Route>

        {/* Admin Routes - Accessible only for Admin users */}
        <Route path="/adminDashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/register" element={<AdminRoute><Register /></AdminRoute>} />

        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot" element={<ForgotPass />} />
        <Route path="/resetpassword/:token" element={<ResetPassword />} />

        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
