import { useEffect, useState } from "react";
import axios from "axios";
import { Dialog } from "@headlessui/react";
import { Link } from 'react-router-dom';
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Checkbox } from "@/components/ui/checkbox";

const base_URL = import.meta.env.VITE_APP_API_URL;

const AdminRoles = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [searchQuery, setSearchQuery] = useState(""); // Search query
    const [areAllSelected, setAreAllSelected] = useState(false); // "Select All" state

    // Filter roles based on search query
    const filteredRoles = roles.filter((role) =>
        role.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Toggle "Select All" functionality
    const toggleSelectAll = (checked) => {
        if (checked) {
            const allRoleIds = filteredRoles.map((role) => role.id);
            setSelectedUsers(
                roles.filter((role) => allRoleIds.includes(role.id))
            );
            setAreAllSelected(true);
        } else {
            const deselectIds = filteredRoles.map((role) => role.id);
            setSelectedUsers((prev) =>
                prev.filter((user) => !deselectIds.includes(user.id))
            );
            setAreAllSelected(false);
        }
    };

    // Update "Select All" state when roles are selected/deselected
    useEffect(() => {
        setAreAllSelected(
            filteredRoles.every((role) =>
                selectedUsers.some((user) => user.id === role.id)
            )
        );
    }, [selectedUsers, filteredRoles]);


    useEffect(() => {
        const fetchRoles = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${base_URL}/auth/roles`);
                const filteredRoles = response.data.filter(role => role.role !== "Admin");
                setRoles(filteredRoles);
            } catch (err) {
                setError(err.response?.data?.msg || "Failed to fetch roles.");
            } finally {
                setLoading(false);
            }
        };

        fetchRoles();
    }, []);

    const openModal = async (role) => {
        setSelectedRole(role);
        try {
            // Fetch already assigned users for the selected role
            const response = await axios.get(`${base_URL}/assigned-users/${role.role}`);
            setSelectedUsers(response.data); // Assume the API returns an array of user objects
        } catch (err) {
            toast.error("Failed to fetch assigned users.", err);
            setSelectedUsers([]);
        }
        setIsModalOpen(true);
    };

    const toggleUserSelection = (userId, userRole) => {
        setSelectedUsers((prev) => {
            const userExists = prev.some(user => user.id === userId);
            if (userExists) {
                return prev.filter(user => user.id !== userId); // Remove user if already selected
            }
            return [...prev, { id: userId, role: userRole }]; // Add user if not selected
        });
    };

    const handleSave = async () => {
        if (selectedUsers.length === 0) return;
        try {
            await axios.post(`${base_URL}/assign-role`, {
                role: selectedRole.role,
                selectedRole: selectedUsers,
            });
            toast.success("Users assigned successfully!");
            setIsModalOpen(false);
            setSelectedUsers([]);
        } catch (err) {
            toast.error("Failed to assign roles.", err);
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="flex items-center mb-6 gap-7">
                <Link to="/AdminDashboard" className="text-black">
                    <IoArrowBackCircleSharp className="text-3xl" />
                </Link>
                <h1 className="text-2xl font-bold">Admin Panel - Roles</h1>
            </div>

            {loading && <p>Loading roles...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {roles.map(({ id, role }) => (
                        role.toLowerCase() !== 'admin' && (
                            <div
                                key={id}
                                className="bg-white p-4 shadow-md rounded-md cursor-pointer hover:shadow-lg"
                                onClick={() => openModal({ id, role })}
                            >
                                <h2 className="text-lg font-semibold">{role}</h2>
                                <p className="text-gray-500 text-sm">ID: {id}</p>
                            </div>
                        )
                    ))}
                </div>
            )}

            {roles.length === 0 && !loading && !error && (
                <p>No roles found.</p>
            )}

            {/* Modal */}
            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
                        <Dialog.Title className="text-xl font-bold">Assign Roles To User </Dialog.Title>
                        <p className="text-gray-500 mb-4">Role: {selectedRole?.role}</p>

                        {/* Search Input */}
                        <input
                            type="text"
                            placeholder="Search roles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded-md mb-4"
                        />

                        {/* Select All Checkbox */}
                        <div className="flex items-center mb-4">
                            <Checkbox
                                checked={areAllSelected}
                                onCheckedChange={toggleSelectAll}
                                id="select-all-checkbox"
                            />
                            <label htmlFor="select-all-checkbox" className="ml-2 text-gray-700 font-medium">
                                Select All
                            </label>
                        </div>

                        {/* Role List */}
                        <div className="mb-4 h-40 overflow-y-auto border rounded-md p-2">
                            {filteredRoles.length > 0 ? (
                                filteredRoles.map((role) => (
                                    <div key={role.id} className="flex items-center gap-2 mb-2">
                                        <Checkbox
                                            checked={selectedUsers.some((user) => user.id === role.id)}
                                            onCheckedChange={() => toggleUserSelection(role.id, role.role)}
                                            id={`checkbox-${role.id}`}
                                        />
                                        <label htmlFor={`checkbox-${role.id}`} className="text-gray-700">
                                            {role.role}
                                        </label>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 mt-2">Nothing exists</p>
                            )}
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button
                                className="rounded-full"
                                variant="destructive"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="rounded-full"
                                onClick={handleSave}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            </Dialog>

        </div>
    );
};

export default AdminRoles;
