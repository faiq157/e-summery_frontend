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

// Utility function to generate random colors
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const TimelinessChart = () => {
  const [chartData, setChartData] = useState([]);
  const [colorMap, setColorMap] = useState({});
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

      // Create a color map for each role if not already set
      const newColorMap = {};
      Object.keys(data).forEach((role) => {
        if (!colorMap[role]) {
          newColorMap[role] = getRandomColor();
        }
      });
      setColorMap((prev) => ({ ...prev, ...newColorMap }));
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
          <Bar dataKey="timely" name="Timely">
            {chartData.map((entry, index) => (
              <Cell
                key={`timely-${index}`}
                fill={colorMap[entry.role] || getRandomColor()}
              />
            ))}
          </Bar>
          <Bar dataKey="delayed" name="Delayed">
            {chartData.map((entry, index) => (
              <Cell
                key={`delayed-${index}`}
                fill={colorMap[entry.role] || getRandomColor()}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimelinessChart;
