import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Registration/Login";
import Register from "./pages/Registration/Register";
import ForgotPass from "./pages/Registration/ForgotPass";
import ResetPassword from "./pages/Registration/ResetPassword";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot" element={<ForgotPass />} />
        <Route path="resetpassword/:token" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
