import { fetchNotesheetTracking } from "@/constant/notesheetAPI";
import { useState, useEffect } from "react"; // Update the path
import { motion } from "framer-motion";
const NotesheetTracker = ({ trackingId }) => {
  const [notesheetData, setNotesheetData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const storedToken = localStorage.getItem("token");

  const fetchTrackingData = async () => {
    if (!trackingId) return;
    setLoading(true);
    setError("");
    try {
      const data = await fetchNotesheetTracking(trackingId, storedToken);
      setNotesheetData(data);
    } catch (err) {
      setError(err.message || "Failed to fetch data");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTrackingData();
  }, [trackingId, storedToken]);


  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-4xl mx-auto  rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6"> Track Your Notesheet </h1>

        {/* Loading/Error States */}
        {loading && <p className="text-blue-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Main Content */}
        {!loading && notesheetData && (
          <div>
            {/* Current Handler */}
            <div className="mb-10">
              <div className="flex items-center justify-center p-6   bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full shadow-lg">
                <div className="flex items-center justify-center w-14 h-14 bg-white text-blue-700 rounded-full shadow-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM6.54 14a6.967 6.967 0 00-1.54 4.5v1a2 2 0 002 2h10a2 2 0 002-2v-1c0-1.68-.59-3.22-1.54-4.5A7 7 0 006.54 14z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold">Owner</h3>
                  <p className="text-xl font-medium">
                    {notesheetData.currentHandler
                      ? notesheetData.currentHandler
                      : "No current handler assigned"}
                  </p>
                </div>
              </div>
            </div>
            {/* History Section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-6">Tracking History</h2>
              <div className="relative flex flex-col items-center">
                {notesheetData.history && notesheetData.history.length > 0 ? (
                  notesheetData.history.map((entry, index) => (
                    <div key={entry._id} className="relative flex items-center w-full">
                      <div className="absolute h-full border-l-2 border-gray-300 left-5 top-0 transform translate-x-1/2"></div>
                      <div
                        className={`z-10 flex-shrink-0 w-12 h-12 rounded-full text-white flex items-center justify-center shadow-md ${[
                          'bg-gradient-to-r from-blue-400 to-blue-600', // Gradient 1
                          'bg-gradient-to-r from-green-400 to-green-600', // Gradient 2
                          'bg-gradient-to-r from-yellow-400 to-yellow-600', // Gradient 3
                          'bg-gradient-to-r from-red-400 to-red-600', // Gradient 4
                          'bg-gradient-to-r from-purple-400 to-purple-600', // Gradient 5
                        ][index % 5]}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 8v4l3 3M12 4c4.418 0 8 3.582 8 8s-3.582 8-8 8-8-3.582-8-8 3.582-8 8-8z"
                          />
                        </svg>
                      </div>

                      {/* History Details */}
                      <div className="ml-6 my-5">
                        <p className="text-lg font-medium text-gray-800">Role: {entry.role}</p>
                        <p className="text-gray-600 text-sm">Action: {entry.action}</p>
                        <p className="text-gray-500 text-sm">
                          Timestamp: {new Date(entry.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No history available.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );



};

export default NotesheetTracker;
