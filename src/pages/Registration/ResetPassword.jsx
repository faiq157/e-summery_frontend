import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { resetPasswordValidationSchema } from "../../utils/authValidation";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (values) => {
    console.log(values);
    if (values.password !== values.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        `https://e-summery-backend.onrender.com/api/auth/reset-password/${token}`,
        {
          password: values.password,
        }
      );
      setMessage(res.data.msg);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setError(error.response.data.msg);
    }
  };

  return (
    <div
      className="flex justify-center flex-col items-center h-screen"
      id="forgot"
    >
      <div className="flex flex-col justify-center items-center gap-4">
        <h1 className="text-4xl font-bold mb-4">Reset Your Password</h1>
      </div>
      <div className="flex flex-col justify-center border py-8 border-[#D9D9D9] rounded-lg px-8 items-center">
        {error && <div className="text-red-500">{error}</div>}
        {message && <div className="text-green-500">{message}</div>}
        <Formik
          initialValues={{ password: "", confirmPassword: "" }}
          onSubmit={handleSubmit}
          validationSchema={resetPasswordValidationSchema}
        >
          {({ touched }) => (
            <Form className="flex flex-col gap-4">
              <label htmlFor="password">New Password:</label>
              <Field
                className={`py-1 border w-80 border-[#D9D9D9] ${
                  touched.password && "border-red-500"
                }   rounded-md px-2`}
                type="password"
                id="password"
                name="password"
                required
              />
              <ErrorMessage
                className="text-red-500"
                name="password"
                component="div"
              />

              <label htmlFor="confirmPassword">Confirm Password:</label>
              <Field
                className={`py-1 border w-80 border-[#D9D9D9] ${
                  touched.confirmPassword && "border-red-500"
                }   rounded-md px-2`}
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
              />
              <ErrorMessage
                className="text-red-500"
                name="confirmPassword"
                component="div"
              />

              <button
                className="bg-[#2C2C2C] mb-10 mt-3 rounded py-2  text-white"
                type="submit"
              >
                Reset Password
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ResetPassword;
