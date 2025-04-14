import { Button } from "@/components/ui/button";
import AuthContext from "@/context/AuthContext";
import Dashboardlayout from "@/layout/Dashboardlayout";
import { Building2, LogOut, Settings, User } from "lucide-react";

import { useContext } from "react";

const Setting = () => {
  const storedUser = localStorage.getItem('user');
  const userData = JSON.parse(storedUser);
  const { logout } = useContext(AuthContext);
  console.log(userData)
  return (
    <Dashboardlayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 rounded-xl p-2">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Settings
            </h1>
          </div>
        </div>

        {/* Settings Content */}
        <div className="relative">
          <div className="absolute -inset-[10px] opacity-50">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>

          <div className="relative bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-white/20">
            {/* Profile Section */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                {userData?.fullname?.[0] || userData?.name?.[0]}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900"> {userData?.fullname || userData?.name}</h2>
                  <p className="text-gray-500">{userData?.email}</p>
                </div>
              </div>

              {/* Profile Details */}
              <div className="space-y-6">
                {/* Profile Information */}
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-100 space-y-4">
                  <div className="flex items-center gap-2 text-indigo-600 mb-4">
                    <User className="w-5 h-5" />
                    <h3 className="font-semibold">Profile</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-500">Name</label>
                      <p className="text-gray-900 font-medium">{userData?.fullname || userData?.name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Email</label>
                      <p className="text-gray-900 font-medium">{userData?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-100 space-y-4">
                  <div className="flex items-center gap-2 text-indigo-600 mb-4">
                    <Building2 className="w-5 h-5" />
                    <h3 className="font-semibold">Account</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-500">Role</label>
                      <p className="text-gray-900 font-medium">{userData?.role}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Department</label>
                      <p className="text-gray-900 font-medium">{userData?.department}</p>
                    </div>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="w-full relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                  <div className="relative w-full px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl flex items-center justify-center gap-2 text-white font-semibold">
                    <LogOut className="w-5 h-5" />
                    Logout
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>


    </Dashboardlayout>

  )
}

export default Setting