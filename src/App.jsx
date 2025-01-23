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
import NotFoundPage from "./pages/NotFoundPage";
import Register from "./pages/Registration/Register";

import { NonAdminRoute } from "./constant/Non-AdminRoute";
import { AdminRoute } from "./constant/AdminRoute";
import Received from "./pages/Received";
import { useEffect } from "react";
import { generatToken, messaging } from "./notification/firebase-config";
import { onMessage } from "firebase/messaging";
import New from "./pages/New";
import { Bounce, ToastContainer, Zoom } from "react-toastify";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminRoles from "./pages/Admin/AdminRoles";


function App() {
  useEffect(() => {
    generatToken();
    onMessage(messaging, (payload) => {
      console.log(payload);
    });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Home Routes - Non-Admin Users */}
        <Route path="/" element={<NonAdminRoute><PrivateRoute /></NonAdminRoute>}>
          <Route index element={<NonAdminRoute><Home /></NonAdminRoute>} />
          <Route path="new" element={<NonAdminRoute><New /></NonAdminRoute>} />
          <Route path="progress" element={<NonAdminRoute><Progress /></NonAdminRoute>} />
          <Route path="received" element={<NonAdminRoute><Received /></NonAdminRoute>} />
          <Route path="completed" element={<NonAdminRoute><Completed /></NonAdminRoute>} />
          <Route path="tracking" element={<NonAdminRoute><Tracking /></NonAdminRoute>} />
          <Route path="setting" element={<NonAdminRoute><Setting /></NonAdminRoute>} />
        </Route>

        {/* Admin Routes - Accessible only for Admin users */}
        <Route path="/adminDashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/register" element={<AdminRoute><Register /></AdminRoute>} />
        <Route path="/adminRoles" element={<AdminRoute><AdminRoles /></AdminRoute>} />

        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot" element={<ForgotPass />} />
        <Route path="/resetpassword/:token" element={<ResetPassword />} />

        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Zoom}
      />
    </BrowserRouter>
  );
}

export default App;
