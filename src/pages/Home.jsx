import { useNavigate } from "react-router-dom";
import axios from "axios";
const base_URL = import.meta.env.VITE_APP_API_URL;

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${base_URL}/auth/logout`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  return (
    <div className="text-center">
      <h1 className="text-7xl font-bold">
        This is E-Summery Website that Manages Your Notes in Education System
      </h1>
      <button
        onClick={handleLogout}
        className="mt-10 bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};

export default Home;
