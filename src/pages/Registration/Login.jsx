import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginValidationSchema } from "../../utils/authValidation";
const base_URL = import.meta.env.VITE_APP_API_URL;
console.log(base_URL);
const Login = () => {
  const [loginError, setLoginError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(`${base_URL}/auth/login`, values);
      console.log("Login successful", response.data);
      console.log("Login successful", response.data);

      // Assuming your backend sends the token in response.data.token
      const token = response.data.token;

      // Store the token in localStorage
      localStorage.setItem("authToken", token);

      // Now navigate to the home page
      navigate("/");
    } catch (error) {
      setLoginError(error.response.data.msg);
      console.log("Login failed", error.response.data.msg);
    }
  };

  return (
    <div
      className="flex justify-center flex-col items-center h-screen"
      id="login"
    >
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
                className={`py-1 border w-80 rounded-md px-2 ${
                  touched.email && errors.email
                    ? "border-red-500"
                    : "border-[#D9D9D9]"
                }`}
                type="email"
                name="email"
              />
              <ErrorMessage
                className="text-red-500 text-xs"
                name="email"
                component="div"
              />

              <label htmlFor="password">Password</label>
              <Field
                className={`py-1 border w-80 rounded-md px-2 ${
                  touched.password && errors.password
                    ? "border-red-500"
                    : "border-[#D9D9D9]"
                }`}
                type="password"
                name="password"
              />
              <ErrorMessage
                className="text-xs text-red-500"
                name="password"
                component="div"
              />

              <button
                className="bg-[#2C2C2C] mb-10 mt-3 rounded py-2 text-white"
                type="submit"
                disabled={isSubmitting}
              >
                Login
              </button>
            </Form>
          )}
        </Formik>
        <div className="flex justify-between items-center w-80 text-sm gap-2">
          <p
            className="text-[#807878] cursor-pointer"
            onClick={() => navigate("/forgot")}
          >
            Forgot Password?
          </p>
          <button
            onClick={() => navigate("/register")}
            type="button"
            id="register"
            className="px-12 border border-[#D9D9D9] rounded-lg py-2 text-black"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
