import { Button } from "@/components/ui/button";
import AuthContext from "@/context/AuthContext";
import Dashboardlayout from "@/layout/Dashboardlayout";

import { useContext } from "react";

const Setting = () => {
  const storedUser = localStorage.getItem('user');
  const userData = JSON.parse(storedUser);
  const { logout } = useContext(AuthContext);
  return (
    <Dashboardlayout>
      <h1 className="text-3xl font-bold p-4 text-gray-800">Settings</h1>
      <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Profile Section */}
        <div className="bg-white shadow-lg p-6 rounded-lg flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
              {userData?.fullname?.[0] || userData?.name?.[0]}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Profile</h2>
              <p className="text-gray-500 text-sm">Basic information about you</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-gray-700">
              <span className="font-medium">Name:</span> {userData?.fullname || userData?.name}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Email:</span> {userData?.email}
            </p>
          </div>

        </div>

        {/* Account Section */}
        <div className="bg-white shadow-lg p-6 rounded-lg flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-800">Account</h2>
          <p className="text-gray-500 text-sm">Details about your account</p>
          <div className="flex flex-col gap-2">
            <p className="text-gray-700">
              <span className="font-medium">Role:</span> {userData?.role}
            </p>
            <p className="text-gray-700 mb-12">
              <span className="font-medium">Department:</span> {userData?.department}
            </p>
            <Button variant="danger" onClick={logout}>logout</Button>
          </div>

        </div>

      </div>
    </Dashboardlayout>

  )
}

export default Setting