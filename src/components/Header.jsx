import AuthContext from "@/context/AuthContext";
import { useContext } from "react";
import { FaHome, FaRegCheckCircle, FaTractor } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { RiProgress2Fill } from "react-icons/ri";
import { ModeToggle } from "./mode-toggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";

const Header = () => {
  const { userData, logout } = useContext(AuthContext);
  const firstLetter = userData?.fullname?.charAt(0) || userData?.name?.charAt(0) || "";
  const items = [
    { title: "Home", url: "/", icon: FaHome },
    { title: "Progress", url: "/progress", icon: RiProgress2Fill },
    { title: "Completed", url: "/completed", icon: FaRegCheckCircle },
    { title: "Tracking", url: "/tracking", icon: FaTractor },
    { title: "Settings", url: "/setting", icon: IoSettingsOutline },
  ];

  return (
    <header className="sticky top-0 z-999 flex w-full bg-background border-b-2 dark:border-border h-20 drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <nav className="flex  items-center gap-6 px-8">
        {items.map((item) => (
          <a
            key={item.title}
            href={item.url}
            className={`flex flex-col items-center hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105 gap-2 text-gray-800 rounded-lg p-2 dark:text-white ${location.pathname === item.url ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.title}</span>
          </a>

        ))}
      </nav>
      <div className="flex items-center gap-4 ml-auto mr-8">
        <ModeToggle />
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
          <DropdownMenuContent className=" bg-secondary cursor-pointer dark:bg-boxdark rounded-lg p-2 mt-3">
            <DropdownMenuItem className="focus:outline-none px-2 py-1 rounded hover:bg-gray-200">{userData?.email}</DropdownMenuItem>
            <DropdownMenuItem className="focus:outline-none px-2 py-1 rounded hover:bg-gray-200">{userData?.role}</DropdownMenuItem>
            <DropdownMenuItem className="focus:outline-none px-2 py-1 rounded hover:bg-gray-200">Profile</DropdownMenuItem>
            <DropdownMenuItem className="focus:outline-none px-2 py-1 rounded hover:bg-gray-200">Settings</DropdownMenuItem>
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
  );
};

export default Header;
