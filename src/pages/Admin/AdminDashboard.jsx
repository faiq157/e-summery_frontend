import { useState, useEffect } from "react";
import { fetchUsers, deleteUser } from "@/constant/userAPI";
import AdminLayout from "@/layout/AdminLayout";
import EditUserModal from "@/components/EditUserModal ";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog"; // Import alert dialog components
import Loader from "@/components/Loader";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

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

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Filter users based on the search query
    const filteredUsers = users.filter((user) => {
        const fullname = user.fullname ? user.fullname.toLowerCase() : "";
        const email = user.email ? user.email.toLowerCase() : "";
        const role = user.role ? user.role.toLowerCase() : "";
        if (role === "admin") {
            return false;
        }
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
            setIsDialogOpen(false); // Close dialog after successful delete
        } catch (err) {
            setError("Failed to delete user", err);
        } finally {
            setLoading(false);
        }
    };

    const openDeleteDialog = (user) => {
        setUserToDelete(user); // Set the user to delete
        setIsDialogOpen(true); // Open the delete confirmation dialog
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Loader width={500} height={500} /></div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <AdminLayout onSearchChange={handleSearchChange} searchQuery={searchQuery}>
            <div className="grid grid-cols-1 md:grid-cols-2 m-5 lg:grid-cols-3 gap-6">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                        <div
                            key={user._id}
                            className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-shadow duration-300"
                        >
                            <h2 className="text-xl font-semibold text-gray-800">{user.fullname}</h2>
                            <p className="text-gray-600">Email: {user.email}</p>
                            <p className="text-gray-600">Role: {user.role}</p>
                            <p className="text-gray-600">Department: {user.department}</p>
                            <p className="text-gray-600">Created At: {new Date(user.createdAt).toLocaleString()}</p>
                            <p className="text-gray-600">Updated At: {new Date(user.updatedAt).toLocaleString()}</p>
                            <div className="mt-4 flex justify-end gap-2">
                                <Button
                                    onClick={() => openEditModal(user)} // Edit button
                                    className="px-4 py-2 rounded-full"
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="destructive"
                                    className="px-4 py-2 rounded-full"
                                    onClick={() => openDeleteDialog(user)} // Open confirmation dialog for delete
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

            {/* Confirmation Dialog for Deletion */}
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogTrigger />
                <AlertDialogContent>
                    <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this user? This action cannot be undone.
                    </AlertDialogDescription>
                    <div className="flex justify-end gap-4 ">
                        <AlertDialogCancel className='px-4 py-2 rounded-full' onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => userToDelete && handleDelete(userToDelete._id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-full"
                        >
                            Delete
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
};

export default AdminDashboard;
