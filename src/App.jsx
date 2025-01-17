import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Registration/Login";
// import Register from "./pages/Registration/Register";
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PrivateRoute />}>
          <Route index element={<Home />} />
          <Route path="progress" element={<Progress />} />
          <Route path="completed" element={<Completed />} />
          <Route path="tracking" element={<Tracking />} />
          <Route path="setting" element={<Setting />} />
          <Route path="create" element={<CreateApplication />} />
          <Route path="draft" element={<DraftApplication />} />
        </Route>
        <Route path="/adminDashboard" element={<AdminDashboard />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<ForgotPass />} />
        <Route path="/resetpassword/:token" element={<ResetPassword />} />

        <Route path="*" element={<NotFoundPage />} /> {/* 404 route should be last */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;