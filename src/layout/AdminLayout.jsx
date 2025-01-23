import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext"; // Assuming AuthContext is used for user management
import { Button } from "@/components/ui/button";
import AdminRoles from "@/pages/Admin/AdminRoles";

const AdminLayout = ({ children, onSearchChange, searchQuery }) => {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext); // Assuming your context has a logout function

    // Handle logout
    const handleLogout = () => {
        logout(); // Call the logout function to clear user data
        navigate("/login"); // Redirect user to the login page after logout
    };

    return (
        <div className="min-h-screen">
            <div className="bg-black p-4 flex justify-between items-center text-white">
                <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={onSearchChange}
                        placeholder="Search users..."
                        className="px-4 py-2 rounded-md w-64 text-black"
                    />
                    <Link className="bg-white px-6 py-2 rounded-md text-black hover:bg-gray-200" to="/adminRoles">Assign Role</Link>

                    <Link to="/register">
                        <button className="bg-white px-6 py-2 rounded-md text-black hover:bg-gray-200">
                            Create User
                        </button>
                    </Link>
                    {/* Logout Button */}
                    <Button
                        onClick={handleLogout}
                        variant="danger"
                    >
                        Logout
                    </Button>
                </div>
            </div>
            {children}
        </div>
    );
};

export default AdminLayout;
