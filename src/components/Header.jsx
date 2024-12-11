import { useContext } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AuthContext from "@/context/AuthContext";
import { ModeToggle } from "./mode-toggle";

const Header = () => {
  const { userData, logout } = useContext(AuthContext);
  console.log(userData)
  const firstLetter = userData?.fullname?.charAt(0) || userData?.name?.charAt(0) || "";

  return (
    <header className="sticky top-0 z-999 flex w-full bg-background border-b-2 dark:border-border h-20  drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex items-center gap-4 ml-auto mr-8">
        <ModeToggle/>
        <DropdownMenu >
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-lg font-bold text-gray-800">
                {firstLetter} 
              </div>
              <span className="text-sidebar-accent-foreground">
                {userData?.fullname} 
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuItem>{userData?.email}</DropdownMenuItem> 
            <DropdownMenuItem>{userData?.role}</DropdownMenuItem> 
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem className="text-red-500" onClick={logout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
