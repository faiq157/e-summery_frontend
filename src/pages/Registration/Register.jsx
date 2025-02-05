import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterValidationSchema } from "../../utils/authValidation";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
const base_URL = import.meta.env.VITE_APP_API_URL;

const Register = () => {
  const [RegisterError, SetRegisterError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false); // State for toggling visibility
  const [confPasswordVisible, setConfPasswordVisible] = useState(false); // State for confirm password visibility
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    if (values.password !== values.Confpassword) {
      SetRegisterError("Passwords do not match");
      return;
    }
    if (!values.role) {
      SetRegisterError("Please select a role");
      return;
    }
    console.log(values);

    try {
      setIsLoading(true);
      const response = await axios.post(`${base_URL}/auth/register`, values);
      console.log("Registration successful", response.data);
      navigate("/adminDashboard");
    } catch (error) {
      const errorMessage =
        error.response?.status === 500
          ? "Internal server error. Please try again later."
          : error.response?.data?.msg || "Registration failed";
      SetRegisterError(errorMessage);
      console.log("Registration failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center flex-col items-center h-screen" id="register">
      <div className="flex flex-col justify-center border py-8 border-[#D9D9D9] rounded-lg px-8 items-center">
        {RegisterError && <div className="text-red-500">{RegisterError}</div>}
        <Formik
          initialValues={{
            fullname: "",
            role: "",
            email: "",
            password: "",
            Confpassword: "",
          }}
          validationSchema={RegisterValidationSchema}
          onSubmit={(values, { setSubmitting }) => {
            handleSubmit(values);
            setSubmitting(false);
          }}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="flex flex-col gap-2">
              <label>Full Name</label>
              <Field
                className={`py-1 border w-80 rounded-md px-2 ${errors.fullname && touched.fullname ? "border-red-500" : ""}`}
                type="text"
                name="fullname"
                placeholder="Full Name"
              />
              <ErrorMessage className="text-red-500 text-xs" name="fullname" component="div" />

              <label>Email</label>
              <Field
                className={`py-1 border w-80 rounded-md px-2 ${errors.email && touched.email ? "border-red-500" : ""}`}
                type="email"
                name="email"
                placeholder="Email"
              />
              <ErrorMessage className="text-red-500 text-xs" name="email" component="div" />

              <label htmlFor="password">Password</label>
              <div className="relative">
                <Field
                  className={`py-1 border w-80 rounded-md px-2 ${errors.password && touched.password ? "border-red-500" : ""}`}
                  type={passwordVisible ? "text" : "password"} // Toggle password visibility
                  name="password"
                  placeholder="Password"
                />
                <div
                  onClick={() => setPasswordVisible(!passwordVisible)} // Toggle visibility on click
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                >
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />} {/* Show eye icon */}
                </div>
              </div>
              <ErrorMessage className="text-red-500 text-xs" name="password" component="div" />

              <label htmlFor="Confpassword">Confirm Password</label>
              <div className="relative">
                <Field
                  className={`py-1 border w-80 rounded-md px-2 ${errors.Confpassword && touched.Confpassword ? "border-red-500" : ""}`}
                  type={confPasswordVisible ? "text" : "password"} // Toggle confirm password visibility
                  name="Confpassword"
                  placeholder="Confirm Password"
                />
                <div
                  onClick={() => setConfPasswordVisible(!confPasswordVisible)} // Toggle visibility on click
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                >
                  {confPasswordVisible ? <FaEyeSlash /> : <FaEye />} {/* Show eye icon */}
                </div>
              </div>
              <ErrorMessage className="text-red-500 text-xs" name="Confpassword" component="div" />

              <label>Department</label>
              <Field
                className={`py-1 border w-80 rounded-md px-2 ${errors.role && touched.role ? "border-red-500" : ""}`}
                name="department" type="text" placeholder="Please Enter department"
              />
              <ErrorMessage className="text-red-500 text-xs" name="role" component="div" />

              <label>Role</label>
              <Field
                className={`py-1 border w-80 rounded-md px-2 ${errors.role && touched.role ? "border-red-500" : ""}`}
                name="role" type="text" placeholder="Please Enter Role"
              />
              <ErrorMessage className="text-red-500 text-xs" name="role" component="div" />

              <button
                className="bg-[#2C2C2C] mb-10 mt-3 rounded-full py-2 text-white"
                type="submit"
                disabled={isSubmitting || isLoading}
              >
                {isLoading ? "Registering..." : "Register"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;
