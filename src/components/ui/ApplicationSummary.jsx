import React from 'react';

// Reusable component for displaying total applications
const ApplicationSummary = ({ title, count }) => {
  return (
    <div className="flex items-center justify-between p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center space-x-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-700">{title}</h3>
        </div>
      </div>
      <div className="text-3xl font-bold text-indigo-600">{count}</div>
    </div>
  );
};

export default ApplicationSummary;
