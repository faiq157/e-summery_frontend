import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/http";
import { Button } from "@/components/ui/button";
import { FaSpinner } from "react-icons/fa";

const OtpPage = () => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpError, setOtpError] = useState(null);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  

  // Retrieve the email from sessionStorage
  useEffect(() => {
    const storedEmail = sessionStorage.getItem("userEmail");
    if (storedEmail) {
      setEmail(storedEmail);
      console.log("Stored email from sessionStorage:", storedEmail); // Log email from sessionStorage
    } else {
      navigate("/login"); // Redirect if no email is found
    }
  }, [navigate]);

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/auth/verify-otp", { email, otp });

      console.log(response.status, response.data); // Log response status and data

      if (response.status === 200 && response.data.token && response.data.user) {
        const { token, user } = response.data;
        // Clear and set local storage
        sessionStorage.removeItem("userEmail");
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        // Set the sessionStorage again with email
        sessionStorage.setItem("userEmail", email);
        navigate("/"); // Redirect after successful verification
      } else {
        setOtpError("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      setOtpError("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (otp.length === 6) {
      handleOtpSubmit();
    }
  }, [otp, handleOtpSubmit]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="flex flex-col justify-center items-center border py-10 px-8 border-gray-300 rounded-lg bg-white shadow-lg">
      <h1 className="text-3xl font-semibold text-gray-800">Enter OTP</h1>
      <p className="text-lg text-gray-600 mt-2">Please enter the OTP sent to your email</p>
  
      {otpError && <div className="text-red-500 mt-3">{otpError}</div>}
  
      <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4 mt-6 w-full max-w-xs">
        <label htmlFor="otp" className="text-gray-700 font-medium">OTP</label>
        <input
          type="number"
          id="otp"
          value={otp}
          onChange={(e) => {
            // Allow only digits and limit input to 6 characters
            if (/^\d{0,6}$/.test(e.target.value)) {
              setOtp(e.target.value);
            }
          }}
          maxLength="6"
          className="py-3 px-4 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200"
          required
        />
        <Button
          type="submit"
         
          disabled={isLoading}
        >
          {isLoading ?   <FaSpinner className="animate-spin text-black" size={24} /> : "Verify OTP"}
        </Button>
      </form>
    </div>
  </div>
  
  );
};

export default OtpPage;
