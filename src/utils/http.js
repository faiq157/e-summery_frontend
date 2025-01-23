import axios from "axios";
const base_URL = import.meta.env.VITE_APP_API_URL;
const axiosInstance = axios.create({
  baseURL: `${base_URL}`, 
  headers: {
    "Content-Type": "application/json",
  },
});



axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      alert("Session expired, please log in again.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
