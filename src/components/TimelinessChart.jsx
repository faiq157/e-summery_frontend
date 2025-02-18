import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const TimelinessChart = () => {
  const [chartData, setChartData] = useState([]);
  const base_URL = import.meta.env.VITE_APP_API_URL;

  const fetchTimelinessData = async () => {
    try {
      const response = await axios.get(
        `${base_URL}/notesheet/timeliness-count`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data.data;
      // Transform the data to a format suitable for recharts
      const transformedData = Object.keys(data).map((role) => ({
        role,
        timely: data[role].timely,
        delayed: data[role].delayed,
      }));
      setChartData(transformedData);
    } catch (error) {
      console.error("Failed to fetch timeliness data:", error);
    }
  };

  useEffect(() => {
    fetchTimelinessData();
  }, []);

  return (
    <div className="w-full h-96">
      <ResponsiveContainer>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey="role" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="timely" name="Timely" fill="#4CAF50" /> {/* Green for timely */}
          <Bar dataKey="delayed" name="Delayed" fill="#F44336" /> {/* Red for delayed */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimelinessChart;
