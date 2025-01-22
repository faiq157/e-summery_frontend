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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">Notesheet Tracker</h1>
        {loading && <p className="text-blue-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && notesheetData && (
          <div>
            {/* Current Handler */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-600">Current Handler</h2>
              <div className="p-4 mt-2 bg-blue-100 text-blue-800 rounded-lg shadow-sm">
                {notesheetData.currentHandler
                  ? notesheetData.currentHandler
                  : "No current handler assigned"}
              </div>
            </div>

            {/* Workflow Tree */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-600">Workflow</h2>
              <div className="mt-4 flex flex-col items-center">
                {notesheetData.workflow && notesheetData.workflow.length > 0 ? (
                  notesheetData.workflow.map((step, index) => (
                    <motion.div
                      key={step._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.2 }}
                      className="relative flex flex-col items-center w-full"
                    >
                      {/* Arrow Line */}
                      {index !== notesheetData.workflow.length - 1 && (
                        <>
                          <motion.div
                            className="absolute top-full h-6 w-0.5 bg-gray-300"
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ duration: 0.3, delay: (index + 1) * 0.2 }}
                          ></motion.div>
                          <motion.div
                            className="absolute top-full left-1/2 -translate-x-1/2 h-6 w-3 border-t-2 border-l-2 border-gray-300 rotate-45"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3, delay: (index + 1) * 0.2 }}
                          ></motion.div>
                        </>
                      )}

                      {/* Card */}
                      <motion.div
                        className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg shadow-md w-full"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-gray-800 font-medium">Role: {step.role}</p>
                          <p className="text-gray-600 text-sm">Status: {step.status}</p>
                          <p className="text-gray-500 text-xs">
                            Forwarded At:{" "}
                            {new Date(step.forwardedAt).toLocaleString()}
                          </p>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-500">No workflow data available.</p>
                )}
              </div>
            </div>

            {/* History Tree */}
            <div>
              <h2 className="text-xl font-semibold text-gray-600">History</h2>
              <div className="mt-4 flex flex-col items-center">
                {notesheetData.history && notesheetData.history.length > 0 ? (
                  notesheetData.history.map((entry, index) => (
                    <motion.div
                      key={entry._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.2 }}
                      className="relative flex flex-col items-center w-full"
                    >
                      {/* Arrow Line */}
                      {index !== notesheetData.history.length - 1 && (
                        <>
                          <motion.div
                            className="absolute top-full h-6 w-0.5 bg-gray-300"
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ duration: 0.3, delay: (index + 1) * 0.2 }}
                          ></motion.div>
                          <motion.div
                            className="absolute top-full left-1/2 -translate-x-1/2 h-6 w-3 border-t-2 border-l-2 border-gray-300 rotate-45"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3, delay: (index + 1) * 0.2 }}
                          ></motion.div>
                        </>
                      )}

                      {/* Card */}
                      <motion.div
                        className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg shadow-md w-full"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="flex-shrink-0 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-gray-800 font-medium">Role: {entry.role}</p>
                          <p className="text-gray-600 text-sm">Action: {entry.action}</p>
                          <p className="text-gray-500 text-xs">
                            Timestamp: {new Date(entry.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </motion.div>
                    </motion.div>
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
