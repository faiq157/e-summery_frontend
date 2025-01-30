import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginValidationSchema } from "../../utils/authValidation";
import { AuthContext } from "../../context/AuthContext";
import Loader from "@/components/Loader";
import axiosInstance from "@/utils/http";
import { FaSpinner } from "react-icons/fa";

const base_URL = import.meta.env.VITE_APP_API_URL;

const Login = () => {
  const [loginError, setLoginError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(`${base_URL}/auth/login`, values);
      const { token, user } = response.data;

      login(token, user);

      // Navigate to the admin dashboard if the user is an admin
      if (user.role === 'admin') {
        navigate("/AdminDashboard");
      } else {
        // Navigate to the default user page (or home page)
        navigate("/");
      }
    } catch (error) {
      setLoginError(error.response.data.msg);
      console.log("Login failed", error.response.data.msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center flex-col items-center h-screen" id="login">
      <div className="flex flex-col justify-center items-center gap-4">
        <h1 className="text-4xl font-bold">Login Your Account</h1>
        <p className="text-2xl m-5">Welcome back🙌</p>
      </div>
      <div className="flex flex-col justify-center border py-8 border-[#D9D9D9] rounded-lg px-8 items-center">
        {loginError && <div className="text-red-500">{loginError}</div>}
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginValidationSchema}
          onSubmit={(values, { setSubmitting }) => {
            handleSubmit(values);
            setSubmitting(false);
          }}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="flex flex-col gap-2">
              <label>Email</label>
              <Field
                className={`py-1 border bg-transparent w-80 rounded-md px-2 ${touched.email && errors.email ? "border-red-500" : "border-[#D9D9D9]"
                  }`}
                type="email"
                name="email"
              />
              <ErrorMessage className="text-red-500 text-xs" name="email" component="div" />

              <label htmlFor="password">Password</label>
              <Field
                className={`py-1 bg-transparent border w-80 rounded-md px-2 ${touched.password && errors.password ? "border-red-500" : "border-[#D9D9D9]"
                  }`}
                type="password"
                name="password"
              />
              <ErrorMessage className="text-xs text-red-500" name="password" component="div" />

              <button
                className="bg-card border mb-10 mt-3 rounded py-2 text-black dark:text-white"
                type="submit"
                disabled={isSubmitting || isLoading}
              >
                {isLoading ? (
                  <FaSpinner className="animate-spin text-black" size={24} />
                ) : (
                  "Login"
                )}
              </button>
            </Form>
          )}
        </Formik>
        <div className="flex justify-between items-center w-80 text-sm gap-2">
          <p className="text-[#807878] cursor-pointer" onClick={() => navigate("/forgot")}>
            Forgot Password?
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
