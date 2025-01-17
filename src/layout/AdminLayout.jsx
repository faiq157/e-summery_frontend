import { Link } from "react-router-dom";
const AdminLayout = ({ children, onSearchChange, searchQuery }) => {

    return (
        <div className="min-h-screen ">
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
                    <Link to="/register">
                        <button className="bg-white  px-6 py-2 rounded-md text-black hover:bg-gray-200 ">
                            Create User
                        </button>
                    </Link>
                </div>
            </div>
            {children}
        </div>
    );
};

export default AdminLayout;
