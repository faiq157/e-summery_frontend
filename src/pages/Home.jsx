import { useState, useEffect } from "react";
import Dashboardlayout from "./../layout/Dashboardlayout";
import ApplicationSummary from "@/components/ui/ApplicationSummary";
import axios from "axios";
import Loader from "@/components/Loader";

const Home = () => {
  const [statusCounts, setStatusCounts] = useState({
    New: 0,
    "In Progress": 0,
    Completed: 0,
  });
  const storedUser = localStorage.getItem("user");
  const user = JSON.parse(storedUser);
  const role = user.role;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const base_URL = import.meta.env.VITE_APP_API_URL;
  useEffect(() => {
    const fetchStatusCounts = async () => {
      try {
        const response = await axios.get(`${base_URL}/notesheet/statuscount/?role=${role}`);

        setStatusCounts(response.data.statusCount);
      } catch (err) {
        console.error("Error fetching status counts:", err);
        setError("Failed to load application counts.");
      } finally {
        setLoading(false);
      }
    };

    fetchStatusCounts();
  }, []);

  return (
    <div>
      <Dashboardlayout>
        <h1 className="text-3xl font-bold p-4">Dashboard</h1>

        {loading ? (
          <p className="p-4"><Loader width={600} height={600} /></p>
        ) : error ? (
          <p className="p-4 text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 p-8 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <ApplicationSummary title="New Applications" count={statusCounts.New} />
            <ApplicationSummary title="In Progress" count={statusCounts["In Progress"]} />
            <ApplicationSummary title="Completed" count={statusCounts.Completed} />
            <ApplicationSummary title="Received" count={statusCounts.Received} />
            <ApplicationSummary title="Total Applications" count={statusCounts.New + statusCounts["In Progress"] + statusCounts.Completed} />

          </div>
        )}
      </Dashboardlayout>
    </div>
  );
};

export default Home;
