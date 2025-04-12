import { fetchNotesheetTracking } from "@/constant/notesheetAPI";
import { useState, useEffect } from "react"; // Update the path
import { motion } from "framer-motion";
import { Clock, Users } from "lucide-react";
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
        {/* Loading/Error States */}
        {loading && <p className="text-blue-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Main Content */}
        {!loading && notesheetData && (
          <div>
             <div className="space-y-6">
          {/* Current Handler Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500 opacity-75"></div>
            <div className="relative backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/40">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-white/80">Current Handler</h3>
                  <p className="text-3xl font-bold text-white"> {notesheetData.currentHandler
                      ? notesheetData.currentHandler
                      : "No current handler assigned"}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <Users className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
          
          </div>
          <div className="backdrop-blur-xl bg-white/40 rounded-2xl mt-5 p-8 border border-white/40">
            <h3 className="text-xl font-bold text-gray-800 mb-8">Tracking Timeline</h3>
            <div className="relative pl-8 space-y-8">
              {  notesheetData.history.map((item, index) => (
                <div key={index} className="relative group">
                  {/* Animated Timeline Line */}
                  <div className="absolute left-0 top-0 h-full w-0.5 bg-gradient-to-b from-blue-500 to-purple-500 group-hover:scale-y-110 transition-transform duration-300" />
                  
                  {/* Animated Timeline Dot */}
                  <div className="absolute left-0 top-0 -ml-2 group-hover:scale-125 transition-transform duration-300">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg" />
                    <div className="absolute inset-0 rounded-full animate-ping bg-blue-500 opacity-75" />
                  </div>
                  
                  {/* Content Card */}
                  <div className="relative ml-6">
                    <div className="backdrop-blur-sm bg-white/60 rounded-xl p-6 border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:translate-x-2">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h4 className="text-lg font-semibold text-gray-800">{item.role}</h4>
                          <p className="text-gray-600">{item.action}</p>
                        </div>
                        <div className="flex items-center text-gray-500 bg-white/50 px-3 py-1 rounded-full">
                          <Clock className="w-4 h-4 mr-2" />
                          <span className="text-sm">{item.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
           
               
            </div>
          </div>
        )}
      </div>
    </div>
  );



};

export default NotesheetTracker;
