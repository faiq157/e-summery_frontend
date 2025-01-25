import { useState } from "react";
import NotesheetTracker from "@/components/NotesheetTracker";
import Dashboardlayout from "@/layout/Dashboardlayout";
import { Button } from "@/components/ui/button";

const Tracking = () => {
  const [trackingId, setTrackingId] = useState("");
  const [submittedId, setSubmittedId] = useState(null);

  const handleTrack = () => {
    if (trackingId.trim() !== "") {
      setSubmittedId(trackingId.trim());
    }
  };

  return (
    <Dashboardlayout>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-700 mb-6">Notesheet Tracker</h1>

          {/* Input Section */}
          <div className="mb-6">
            <label htmlFor="trackingId" className="block text-gray-600 font-medium mb-2">
              Enter Tracking ID
            </label>
            <div className="flex items-center space-x-2">
              <input
                id="trackingId"
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Paste the tracking ID here..."
              />
              <Button
                className="rounded-full"
                onClick={handleTrack}

              >
                Track
              </Button>
            </div>
          </div>

          {/* Notesheet Tracker */}
          {submittedId ? (
            <NotesheetTracker trackingId={submittedId} />
          ) : (
            <p className="text-gray-500">Please enter a tracking ID to track the notesheet.</p>
          )}
        </div>
      </div>
    </Dashboardlayout>
  );
};

export default Tracking;
