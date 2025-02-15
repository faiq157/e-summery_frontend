import { useState, useEffect } from "react";
import Dashboardlayout from "./../layout/Dashboardlayout";
import ApplicationSummary from "@/components/ui/ApplicationSummary";
import axios from "axios";
import Loader from "@/components/Loader";
import Rechart from "@/components/Rechart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const Home = () => {
  const [statusCounts, setStatusCounts] = useState({
    New: 0,
    "In Progress": 0,
    Completed: 0,
    Received: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("weekly");  // Default filter
  const base_URL = import.meta.env.VITE_APP_API_URL;
  const storedUser = localStorage.getItem("user");
  const user = JSON.parse(storedUser);
  const role = user.role;

  useEffect(() => {
    const fetchStatusCounts = async () => {
      try {
        const response = await axios.get(`${base_URL}/notesheet/statuscount/?role=${role}&filter=${filter}`);
        setStatusCounts(response.data.statusCount);
      } catch (err) {
        console.error("Error fetching status counts:", err);
        setError("Failed to load application counts.");
      } finally {
        setLoading(false);
      }
    };

    fetchStatusCounts();
  }, [filter]);

  // Filter options for ShadCN Select
  const filterOptions = [
    { value: "weekly", label: "Weekly" },
    { value: "15days", label: "15 Days" },
    { value: "monthly", label: "Monthly" },
  ];

  return (
    <div>
      <Dashboardlayout>
        <div className="flex justify-between items-center mx-9">
        <h1 className="text-3xl font-bold p-4 ">Dashboard</h1>
        <div className="mb-4 w-[95%] flex justify-end  items-center ">
              <label htmlFor="filter" className="mr-2">Filter by:</label>
              <Select value={filter} onValueChange={(value) => setFilter(value)} >
                <SelectTrigger className="w-40 p-2 border border-gray-300 rounded">
                  <SelectValue placeholder="Select filter" />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
        </div>
       

        {loading ? (
          <p className="p-4"><Loader width={600} height={600} /></p>
        ) : error ? (
          <p className="p-4 text-red-500">{error}</p>
        ) : (
          <div  >
            {/* Filter UI using ShadCN Select */}
            

            {/* Status counts */}
            <div className="grid grid-cols-1 m-10  md:grid-cols-4 lg:grid-cols-5 ">
              <ApplicationSummary title="New Applications" count={statusCounts.New} />
              <ApplicationSummary title="In Progress" count={statusCounts["In Progress"]} />
              <ApplicationSummary title="Completed" count={statusCounts.Completed} />
              <ApplicationSummary title="Received" count={statusCounts.Received} />
              <ApplicationSummary title="Total Applications" count={statusCounts.New + statusCounts["In Progress"] + statusCounts.Completed + statusCounts.Received} />
            </div>

            {/* Rechart visualization */}
            <Rechart statusCounts={statusCounts} />
          </div>
        )}
      </Dashboardlayout>
    </div>
  );
};

export default Home;
