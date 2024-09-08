import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ForgotValidationSchema } from "../../utils/authValidation";
const base_URL = import.meta.env.VITE_APP_API_URL;
const ForgotPass = () => {
  const [loginError, setLoginError] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(
        `${base_URL}/auth/forgotpassword`,
        values
      );
      setLoginError(null);
      console.log("Forgot successful", response.data);
      setIsPopupOpen(true);
    } catch (error) {
      if (error.response.status === 404) {
        setLoginError("User not found. Please use a registered email.");
      } else {
        setLoginError("Something went wrong. Please try again later.");
      }
      console.log("Forgot failed", error.response.data.message);
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
        {loginError && <div className="text-red-500">{loginError}</div>}
        <Formik
          initialValues={{ email: "" }}
          validationSchema={ForgotValidationSchema}
          onSubmit={(values, { setSubmitting }) => {
            handleSubmit(values);
            setSubmitting(false);
          }}
        >
          {({ isSubmitting, errors }) => (
            <Form className=" flex flex-col gap-2">
              <label>Email</label>
              <Field
                className={`py-1 border w-80 border-[#D9D9D9] ${
                  errors.email && "border-red-500"
                }   rounded-md px-2`}
                type="email"
                name="email"
              />
              <ErrorMessage
                className="text-red-500 text-xs"
                name="email"
                component="div"
              />

              <button
                className="bg-[#2C2C2C] mb-10 mt-3 rounded py-2  text-white"
                type="submit"
                disabled={isSubmitting}
              >
                Reset Password
              </button>
            </Form>
          )}
        </Formik>
      </div>

      {/* Headless UI Popup */}
      <Transition appear show={isPopupOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsPopupOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Password Reset Successful
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Your password reset link has been sent to your email.
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-[#2C2C2C] px-4 py-2 text-sm font-medium text-white hover:bg-[#2C2C2f] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => {
                        setIsPopupOpen(false);
                        navigate("/login");
                      }}
                    >
                      Got it, take me to login
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default ForgotPass;
