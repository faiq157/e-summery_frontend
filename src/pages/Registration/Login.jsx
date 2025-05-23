import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginValidationSchema } from "../../utils/authValidation";
import { AuthContext } from "../../context/AuthContext";
import Loader from "@/components/Loader";
import axiosInstance from "@/utils/http";
import { FaSpinner, FaEye, FaEyeSlash } from "react-icons/fa";
import { LogIn, Mail, Users } from "lucide-react";

const base_URL = import.meta.env.VITE_APP_API_URL;

const Login = () => {

  const [loginError, setLoginError] = useState(null);

  const [isLoading, setIsLoading] = useState(false);


  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility

  const navigate = useNavigate();

  const { login } = useContext(AuthContext);



  const handleSubmit = async (values) => {

    setIsLoading(true);
    try {
      console.log(values)
      const response = await axiosInstance.post(`${base_URL}/auth/login`, values);
      console.log(response.data)
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


    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -inset-[10px] opacity-50">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
    </div>

    <div className="relative w-full max-w-md">
      <div className="absolute inset-0 bg-white/40 backdrop-blur-xl rounded-2xl"></div>
      <div className="relative bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 space-y-8 border border-white/20">
        {/* Logo and Title */}
        <div className="text-center space-y-2">
          <div className="inline-block p-4 rounded-full ">
          <img src="./UET.png" alt="Logo" className="w-24 h-24 shadow-lg shadow-slate-900 rounded-full" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-500">Sign in to access your dashboard</p>
        </div>

        {/* Login Form */}
        <Formik

            initialValues={{ email: "", password: "" }}

            validationSchema={loginValidationSchema}

            onSubmit={(values, { setSubmitting }) => {

              handleSubmit(values);

              setSubmitting(false);

            }} >
            {({ isSubmitting, errors, touched }) => (

              <Form className="flex flex-col gap-2">

                <label>Email</label>

                <Field
                  className={`py-1 border bg-transparent  rounded-md px-2 ${touched.email && errors.email ? "border-red-500" : "border-[#D9D9D9]"} `}
                  type="email"
                  name="email"
                />
                <ErrorMessage className="text-red-500 text-xs" name="email" component="div" />
                <label htmlFor="password">Password</label>
                <div className="relative">
                  <Field
                  className={`py-1 bg-transparent border w-[24rem] rounded-md px-2 pr-10 ${touched.password && errors.password ? "border-red-500" : "border-[#D9D9D9]"}`}
                    type={passwordVisible ? "text" : "password"} // Toggle password visibility
                    name="password"

                  />
                  {/* Eye Icon */}
                  <div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? (
                    <FaEyeSlash className="text-gray-500" />
                    ) : (
                      <FaEye className="text-gray-500" />
                    )}
                  </div>
                </div>
                <ErrorMessage className="text-xs text-red-500" name="password" component="div" />
                <button
                  className="bg-card border mb-10 mt-3 flex justify-center rounded py-2 text-black dark:text-white"
                  type="submit"
                  disabled={isSubmitting || isLoading}
                >
                  {isLoading ? (
                    <FaSpinner className="animate-spin  text-black" size={24} />

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
  </div>

//     <div className="flex justify-center flex-col items-center h-screen" id="login">

//       <div className="flex flex-col justify-center items-center gap-4">

//         <h1 className="text-4xl font-bold">Login Your Account</h1>

//         <p className="text-2xl m-5">Welcome back🙌</p>

//       </div>

//       <div className="flex flex-col justify-center border py-8 border-[#D9D9D9] rounded-lg px-8 items-center">

//         {loginError && <div className="text-red-500">{loginError}</div>}

   

//       </div>

//     </div>

  );

};



export default Login;