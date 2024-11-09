import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Registration/Login";
import Register from "./pages/Registration/Register";
import ForgotPass from "./pages/Registration/ForgotPass";
import ResetPassword from "./pages/Registration/ResetPassword";
import PrivateRoute from "./components/PrivateRoute";
import Progress from "./pages/Progress";
import Completed from "./pages/Completed";
import Tracking from "./pages/Tracking";
import Setting from "./pages/Setting";
import CreateApplication from "./pages/createApp/createApplication";
import DraftApplication from "./pages/createApp/DraftApplication";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoute />}>
           <Route path="/" element={<Home />} />
           <Route path="*" element={<NotFoundPage />} />
           <Route path="progress" element={<Progress />} />
           <Route path="completed" element={<Completed />} />
            <Route path="tracking" element={<Tracking />} />
            <Route path="setting" element={<Setting />} />
            <Route path="create" element={<CreateApplication />} />
            <Route path="draft" element={<DraftApplication />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} /> 
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot" element={<ForgotPass />} />
        <Route path="resetpassword/:token" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
