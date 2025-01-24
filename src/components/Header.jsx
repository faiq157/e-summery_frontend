import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { FaHome, FaRegCheckCircle, FaTractor, FaBell } from 'react-icons/fa';
import { IoCheckmarkDoneCircleSharp, IoNewspaper, IoSettingsOutline } from 'react-icons/io5';
import { RiProgress2Fill } from 'react-icons/ri';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import AuthContext from '@/context/AuthContext';
import axiosInstance from '@/utils/http';
import { Link } from 'react-router-dom';
import { VscSortPrecedence } from "react-icons/vsc";
import { CgTrack } from "react-icons/cg";
const Header = () => {
  const { logout } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const base_URL = import.meta.env.VITE_APP_API_URL;
  const storedUser = localStorage.getItem('user');
  const userData = JSON.parse(storedUser);

  const userId = userData?._id;

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`${base_URL}/get-notifications/${userId}`);
      const fetchedNotifications = response.data.notifications || [];
      setNotifications(fetchedNotifications);
      if (fetchedNotifications.length > 0) {
        setHasUnreadNotifications(true);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Open the modal and mark notifications as read
  const openModal = () => {
    setIsModalOpen(true);
    setHasUnreadNotifications(false); // Remove the red dot
    fetchNotifications(); // Ensure the latest notifications are fetched
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Delete all notifications
  const deleteAllNotifications = async () => {
    setLoading(true);
    try {
      await axiosInstance.delete(`${base_URL}/delete-notifications/${userId}`);
      setNotifications([]);
    } catch (error) {
      console.error('Error deleting notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const firstLetter = userData?.fullname?.charAt(0) || userData?.name?.charAt(0) || '';
  const items = [
    { title: 'Home', url: '/', icon: FaHome },
    { title: 'New', url: '/new', icon: IoNewspaper },
    { title: 'Progress', url: '/progress', icon: RiProgress2Fill },
    { title: 'Received', url: '/received', icon: VscSortPrecedence },
    { title: 'Completed', url: '/completed', icon: FaRegCheckCircle },
    { title: 'Tracking', url: '/tracking', icon: CgTrack },
    { title: 'Approval', url: '/approval', icon: IoCheckmarkDoneCircleSharp },
    { title: 'Settings', url: '/setting', icon: IoSettingsOutline },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 flex w-full bg-background border-b-2 dark:border-border h-20 drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
        <nav className="flex items-center gap-6 px-8">
          {items.map((item) => (
            <a
              key={item.title}
              href={item.url}
              className={`flex flex-col items-center hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105 gap-2 text-gray-800 rounded-lg p-2 dark:text-white ${location.pathname === item.url ? 'bg-gray-200 dark:bg-gray-700' : ''
                }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.title}</span>
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4 ml-auto mr-8">
          {/* Notification Bell */}
          <button
            className="relative text-gray-800 dark:text-white hover:text-gray-600"
            onClick={openModal}
          >
            <FaBell className="w-6 h-6" />
            {hasUnreadNotifications && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
            )}
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 focus:outline-none hover:border-none">
                {/* Avatar Circle */}
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-lg font-bold text-gray-800 hover:bg-gray-400 transition-colors">
                  {firstLetter}
                </div>
                {/* User Name */}
                <span className="text-sidebar-accent-foreground hover:bg-gray-100 rounded px-2 py-1 transition-colors">
                  {userData?.fullname}
                </span>
              </button>
            </DropdownMenuTrigger>
            {/* Dropdown Menu Content */}
            <DropdownMenuContent className=" bg-secondary cursor-pointer  dark:bg-boxdark rounded-lg p-2 mt-3">
              <DropdownMenuItem className="focus:outline-none px-2 py-1 rounded hover:bg-gray-200">
                <Link to="/setting">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-500 hover:bg-red-100 focus:outline-none cursor-pointer rounded px-2 py-1 transition-colors"
                onClick={logout}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Modal for Notifications */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-boxdark rounded-lg w-96 p-6 shadow-lg">
            <h2 className="text-lg font-bold mb-4">Notifications</h2>
            {loading ? (
              <p>Loading...</p>
            ) : notifications.length === 0 ? (
              <p>No notifications available.</p>
            ) : (
              <ul className="space-y-4 h-[60vh] overflow-y-auto">
                {/* Sort notifications by `sentAt` in descending order */}
                {notifications
                  .slice()
                  .sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt))
                  .map((notification, index) => (
                    <li
                      key={index}
                      className="flex flex-col gap-2 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {notification.body}
                      </p>
                      {notification.sentAt && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 self-end">
                          {new Date(notification.sentAt).toLocaleString()}
                        </span>
                      )}
                    </li>
                  ))}
              </ul>
            )}
            <div className="flex justify-between mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={deleteAllNotifications}
                disabled={loading}
              >
                Delete All
              </button>
              <button
                className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
