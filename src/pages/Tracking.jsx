import { useState } from "react";
import NotesheetTracker from "@/components/NotesheetTracker";
import Dashboardlayout from "@/layout/Dashboardlayout";
import { Button } from "@/components/ui/button";
import { Activity, Search } from "lucide-react";

const Tracking = () => {
  const [trackingId, setTrackingId] = useState("");
  const [submittedId, setSubmittedId] = useState(null);

  const handleTrack = () => {
    if (trackingId.trim() !== "") {
      setSubmittedId(trackingId.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleTrack();
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-100 via-purple-50 to-rose-100 p-6">
    <div className="max-w-5xl mx-auto">
      {/* Glass Header */}
      <div className="backdrop-blur-xl bg-white/30 rounded-2xl p-6 mb-8 shadow-lg border border-white/40">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-2.5 shadow-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Notesheet Tracker
            </h1>
          </div>
       
          <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur group-hover:blur-md transition-all duration-300"></div>
              <div className="relative flex bg-white rounded-xl">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
              id="trackingId"
              type="text"
              className="w-full md:w-72 pl-10 pr-4 py-2.5 rounded-xl bg-transparent focus:outline-none"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              onKeyDown={handleKeyDown}  // Add this line
              placeholder="Paste the tracking ID here..."
            />
                <button onClick={handleTrack} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg m-1 hover:shadow-lg transition-all duration-300">
                  Track
                </button>
              </div>
            </div>
          </div>
          </div>
          </div>
        {/* Input Section */}
       
         
    

        {/* Notesheet Tracker */}
        {submittedId ? (
          <NotesheetTracker trackingId={submittedId} />
        ) : (
          <p className="text-gray-500">Please enter a tracking ID to track the notesheet.</p>
        )}
 
    </div>
  );
};

export default Tracking;
