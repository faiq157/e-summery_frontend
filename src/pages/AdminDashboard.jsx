// src/components/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { fetchUsers, deleteUser } from "../constant/userAPI";
import AdminLayout from "@/layout/AdminLayout";
import EditUserModal from "../components/EditUserModal ";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const usersData = await fetchUsers();
                setUsers(usersData);
            } catch (err) {
                setError("Failed to fetch users", err);
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, []);

    // Handle search change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Filter users based on the search query
    const filteredUsers = users.filter((user) => {
        const fullname = user.fullname ? user.fullname.toLowerCase() : "";
        const email = user.email ? user.email.toLowerCase() : "";
        const role = user.role ? user.role.toLowerCase() : "";

        return (
            fullname.includes(searchQuery.toLowerCase()) ||
            email.includes(searchQuery.toLowerCase()) ||
            role.includes(searchQuery.toLowerCase())
        );
    });

    const openEditModal = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleUpdateUser = async (updatedUser) => {
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user._id === updatedUser._id ? updatedUser : user
            )
        );
        const usersData = await fetchUsers(); // Refetch users after update
        setUsers(usersData);
    };

    const handleDelete = async (userId) => {
        setLoading(true);
        try {
            const deletedUserId = await deleteUser(userId);
            setUsers((prevUsers) => prevUsers.filter((user) => user._id !== deletedUserId));
        } catch (err) {
            setError("Failed to delete user", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <AdminLayout onSearchChange={handleSearchChange} searchQuery={searchQuery}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                        <div
                            key={user._id}
                            className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-shadow duration-300"
                        >
                            <h2 className="text-xl font-semibold text-gray-800">{user.fullname}</h2>
                            <p className="text-gray-600">Email: {user.email}</p>
                            <p className="text-gray-600">Role: {user.role}</p>
                            <p className="text-gray-600">Created At: {new Date(user.createdAt).toLocaleString()}</p>
                            <p className="text-gray-600">Updated At: {new Date(user.updatedAt).toLocaleString()}</p>
                            <div className="mt-4 flex justify-between">
                                <Button
                                    onClick={() => openEditModal(user)} // Edit button
                                    className="px-4 py-2 rounded-md"
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="secondary"
                                    className="px-4 py-2 rounded-md"
                                    onClick={() => handleDelete(user._id)} // Delete button
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-3 text-center text-gray-500">
                        No users found
                    </div>
                )}
            </div>

            {/* Modal for Editing User */}
            {isModalOpen && (
                <EditUserModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    user={selectedUser}
                    onUpdate={handleUpdateUser}
                />
            )}
        </AdminLayout>
    );
};

export default AdminDashboard;
