import axios from "axios";
const base_URL = import.meta.env.VITE_APP_API_URL;
// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: `${base_URL}`, // Replace with your API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor (optional, for adding tokens to requests)
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from localStorage or wherever you're storing it
    const token = localStorage.getItem("token"); // Or sessionStorage, or cookies
    
    // If token exists, add it to request headers
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    // Handle any request errors
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle expired tokens or other errors
axiosInstance.interceptors.response.use(
  (response) => {
    // If response is successful, simply return the response data
    return response;
  },
  (error) => {
    // If response status is 401 (Unauthorized), it likely means token expired
    if (error.response && error.response.status === 401) {
      // Remove the token from local storage (or wherever you store it)
      localStorage.removeItem("token");

      // Redirect to login page (or show logout modal, depending on your app)
      window.location.href = "/login"; // Adjust to your login route

      // Optionally, show a message to the user
      alert("Session expired, please log in again.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
