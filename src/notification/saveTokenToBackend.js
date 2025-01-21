import axios from "axios";
const base_URL = import.meta.env.VITE_APP_API_URL;

export const saveTokenToBackend = async (token) => {
       const storedUser = localStorage.getItem('user');
       const userData = JSON.parse(storedUser);
    
    // Get the userId from _id
    const userId = userData._id;
    console.log(userId)

  try {
    const response = await axios.post(`${base_URL}/save-token`, { token,userId });
    console.log(response.data)
    return response.data.message; 
  } catch (err) {
    throw new Error(err?.response?.data?.message || "Error saving token");
  }
};
