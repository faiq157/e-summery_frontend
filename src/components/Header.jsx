import React, { useEffect, useState, useContext } from 'react';
import { Bell, User, Home, FileText, Clock, Send, CheckSquare, Target, Shield, Settings, X, TimerIcon } from 'lucide-react';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import AuthContext from '@/context/AuthContext';
import axiosInstance from '@/utils/http';
import { Link } from 'react-router-dom';


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
      setHasUnreadNotifications(fetchedNotifications.some((n) => !n.isRead)); // Check if there are unread notifications
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mark a notification as read
  const markAsRead = async (notificationId) => {
    try {
      await axiosInstance.put(`${base_URL}/update-notifications/${notificationId}`, { isRead: true });
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
      );
      setHasUnreadNotifications(notifications.some((n) => !n.isRead)); // Update indicator
    } catch (error) {
      console.error('Error updating notification:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);
  // Open the modal and fetch notifications
  const openModal = () => {
    setIsModalOpen(true);
    fetchNotifications();
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
      setHasUnreadNotifications(false);
    } catch (error) {
      console.error('Error deleting notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const firstLetter = userData?.fullname?.charAt(0) || userData?.name?.charAt(0) || '';

  const items = [
    { title: 'Home', url: '/', icon: Home },
    { title: 'New', url: '/new', icon: FileText },
    { title: 'Progress', url: '/progress', icon: Clock },
    { title: 'Received', url: '/received', icon: Send },
    { title: 'Completed', url: '/completed', icon: CheckSquare },
    { title: 'Tracking', url: '/tracking', icon: Target },
    { title: 'Approval', url: '/approval', icon: Shield },
  ...(userData?.role === 'Vice Chancellor' ? [
    { title: "Timelines", url: '/timelines', icon: TimerIcon }
  ] : []),
    { title: 'Settings', url: '/setting', icon: Settings },
 
  ];



  return (
    <>
      <header className="top-0 flex w-full bg-background border-b-2 dark:border-border h-20 drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
        <nav className="flex items-center gap-6 px-8">
       
          {items.map((item) => (
            <a
              key={item.title}
              href={item.url}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100/50 hover:text-gray-900 transition-all group ${location.pathname === item.url ? 'bg-gray-200 dark:bg-gray-700' : ''
                }`}
            >
              <item.icon className="h-5 w-5 mr-2 group-hover:text-indigo-600 transition-colors" />
              <span>{item.title}</span>
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4 ml-auto mr-8">
          {/* Notification Bell */}
          <button className="relative text-gray-800 dark:text-white hover:text-gray-600" onClick={openModal}>
            <Bell className="w-6 h-6" />
            {hasUnreadNotifications && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>}
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 focus:outline-none hover:border-none">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-lg font-bold text-gray-800 hover:bg-gray-400 transition-colors">
                  {firstLetter}
                </div>
                <span className="text-sidebar-accent-foreground hover:bg-gray-100 rounded px-2 py-1 transition-colors">
                  {userData?.fullname}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-secondary cursor-pointer dark:bg-boxdark rounded-lg p-2 mt-3">
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
    <div className="bg-white dark:bg-boxdark rounded-xl w-[420px] max-h-[80vh] p-0 shadow-xl overflow-hidden flex flex-col">
      {/* Modal Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold flex items-center gap-2">
        <Bell className="text-blue-600" size={20} /> Notifications
        </h2>
        <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-lg font-bold">×</button>
      </div>

      {/* Modal Content */}
      <div className="px-4 py-4 overflow-y-auto flex-1 space-y-3">
        {loading ? (
          <p>Loading...</p>
        ) : notifications.length === 0 ? (
          <p className="text-center text-gray-500">No notifications available.</p>
        ) : (
          <ul className="space-y-3">
            {notifications
              .slice()
              .sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt))
              .map((notification) => (
                <li
                  key={notification._id}
                  className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => markAsRead(notification._id)}
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white text-[15px]">
                    {notification.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
                    {notification.body}
                  </p>
                  {notification.sentAt && (
                    <div className="text-[12px] text-gray-500 dark:text-gray-400 mt-2">
                      {new Date(notification.sentAt).toLocaleString()}
                    </div>
                  )}
                </li>
              ))}
          </ul>
        )}
      </div>

      {/* Modal Footer */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3">
        <button
          onClick={deleteAllNotifications}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold"
        >
           Delete All
        </button>
      </div>
    </div>
  </div>
)}

    </>
  );
};

export default Header;
