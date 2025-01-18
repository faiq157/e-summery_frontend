import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterValidationSchema } from "../../utils/authValidation";
const base_URL = import.meta.env.VITE_APP_API_URL;
const Register = () => {
  const [RegisterError, SetRegisterError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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
    <div
      className="flex justify-center flex-col items-center h-screen"
      id="register"
    >
      <div className="flex flex-col justify-center items-center gap-4">
        <h1 className="text-4xl font-bold">Create Your Account</h1>
        <p className="text-2xl m-3">Welcome🙌</p>
      </div>
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
                className={`py-1 border w-80 rounded-md px-2 ${errors.fullname && touched.fullname ? "border-red-500" : ""
                  }`}
                type="text"
                name="fullname"
                placeholder="Full Name"
              />
              <ErrorMessage
                className="text-red-500 text-xs"
                name="fullname"
                component="div"
              />

              <label>Email</label>
              <Field
                className={`py-1 border w-80 rounded-md px-2 ${errors.email && touched.email ? "border-red-500" : ""
                  }`}
                type="email"
                name="email"
                placeholder="Email"
              />
              <ErrorMessage
                className="text-red-500 text-xs"
                name="email"
                component="div"
              />

              <label htmlFor="password"> Password</label>
              <Field
                className={`py-1 border w-80 rounded-md px-2 ${errors.password && touched.password ? "border-red-500" : ""
                  }`}
                type="password"
                name="password"
                placeholder="Password"
              />
              <ErrorMessage
                className="text-red-500 text-xs"
                name="password"
                component="div"
              />

              <label htmlFor="Confpassword">Confirm Password</label>
              <Field
                className={`py-1 border w-80 rounded-md px-2 ${errors.Confpassword && touched.Confpassword
                  ? "border-red-500"
                  : ""
                  }`}
                type="password"
                name="Confpassword"
                placeholder="Confirm Password"
              />
              <ErrorMessage
                className="text-red-500 text-xs"
                name="Confpassword"
                component="div"
              />
              <label>Department</label>
              <div className="w-52 text-right">
                <Field
                  className={`py-1 border w-80 rounded-md px-2 ${errors.role && touched.role
                    ? "border-red-500"
                    : ""
                    }`}
                  name="department" type="text" placeholder="Please Enter department" />

              </div>
              <ErrorMessage
                className="text-red-500 text-xs"
                name="role"
                component="div"
              />
              <label>Role</label>
              <div className="w-52 text-right">
                <Field
                  className={`py-1 border w-80 rounded-md px-2 ${errors.role && touched.role
                    ? "border-red-500"
                    : ""
                    }`}
                  name="role" type="text" placeholder="Please Enter Role" />

              </div>
              <ErrorMessage
                className="text-red-500 text-xs"
                name="role"
                component="div"
              />
              <button
                className="bg-[#2C2C2C] mb-10 mt-3 rounded py-2 text-white"
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
