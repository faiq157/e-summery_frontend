import { useEffect, useState } from "react";
import axios from "axios";
import { Dialog } from "@headlessui/react";
import { Link } from 'react-router-dom';
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { Button } from "@/components/ui/button";

const base_URL = import.meta.env.VITE_APP_API_URL;

const AdminRoles = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const openModal = (role) => {
        setSelectedRole(role);
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
            alert("Users assigned successfully!");
            setIsModalOpen(false);
            setSelectedUsers([]);
        } catch (err) {
            console.error("Failed to assign roles.", err);
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="flex items-center mb-6 gap-7 ">
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
                        <Dialog.Title className="text-xl font-bold">Assign Users to Role</Dialog.Title>
                        <p className="text-gray-500 mb-4">Role: {selectedRole?.role}</p>

                        <div className="mb-4 h-40 overflow-y-auto">
                            {/* Filter out the selected role from the dropdown */}
                            {roles
                                .filter((role) => role.role !== selectedRole?.role && role.role !== "admin")
                                .map((role) => (
                                    <label
                                        key={role.id}
                                        className="flex items-center gap-2 mb-2"
                                    >
                                        <input
                                            type="checkbox"
                                            className="form-checkbox h-5 w-5 text-blue-600"
                                            checked={selectedUsers.some(user => user.id === role.id)}
                                            onChange={() => toggleUserSelection(role.id, role.role)}
                                        />
                                        {role.role}
                                    </label>
                                ))}
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button
                                variant="danger"

                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button

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
