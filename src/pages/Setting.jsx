import { Button } from "@/components/ui/button";
import AuthContext from "@/context/AuthContext";
import Dashboardlayout from "@/layout/Dashboardlayout";

import { useContext } from "react";

const Setting = () => {
  const storedUser = localStorage.getItem('user');
  const userData = JSON.parse(storedUser);
  const { logout } = useContext(AuthContext);
  console.log(userData)
  return (
    <Dashboardlayout>
      <h1 className="text-3xl font-bold p-4 text-gray-800">Settings</h1>
      <div className="flex flex-col justify-center gap-4 md:flex-row md:gap-8">
        <div className="bg-white shadow-lg p-8 rounded-lg flex flex-col gap-4">
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

          <h2 className="text-xl font-semibold text-gray-800">Account</h2>
          <p className="text-gray-500 text-sm">Details about your account</p>
          <div className="flex flex-col gap-2">
            <p className="text-gray-700">
              <span className="font-medium">Role:</span> {userData?.role}
            </p>
            <p className="text-gray-700 mb-12">
              <span className="font-medium">Department:</span> {userData?.department}
            </p>
            <Button className="rounded-full" variant="danger" onClick={logout}>logout</Button>
          </div>
        </div>
      </div>


    </Dashboardlayout>

  )
}

export default Setting