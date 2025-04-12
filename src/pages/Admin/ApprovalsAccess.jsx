import { useEffect, useState } from "react";
import axios from "axios";
import { Dialog } from "@headlessui/react";
import { Link } from "react-router-dom";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Checkbox } from "@/components/ui/checkbox";
import { FaSpinner } from "react-icons/fa";

const base_URL = import.meta.env.VITE_APP_API_URL;

const ApprovalsAccess = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [areAllSelected, setAreAllSelected] = useState(false);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${base_URL}/auth/roles`);
                setRoles(response.data.filter((role) => role.role !== "Admin"));
            } catch (err) {
                setError(err.response?.data?.msg || "Failed to fetch roles.");
            } finally {
                setLoading(false);
            }
        };

        fetchRoles();
    }, []);

    const toggleSelectAll = (checked) => {
        if (checked) {
            setSelectedUsers(roles.map((role) => ({ id: role.id, role: role.role })));
            setAreAllSelected(true);
        } else {
            setSelectedUsers([]);
            setAreAllSelected(false);
        }
    };

    const toggleUserSelection = (userId, userRole) => {
        setSelectedUsers((prev) => {
            const userExists = prev.some((user) => user.id === userId);
            if (userExists) {
                return prev.filter((user) => user.id !== userId);
            }
            return [...prev, { id: userId, role: userRole }];
        });
    };

    const handleSave = async () => {
        if (selectedUsers.length === 0) {
            toast.error("No users selected.");
            return;
        }

        try {
            const approvalAccess = selectedUsers.map((user) => user.role);
            await axios.post(`${base_URL}/approval-access`, { approvalAccess });
            toast.success("Approval access assigned successfully!");
            setIsModalOpen(false);
            setSelectedUsers([]);
        } catch (err) {
            toast.error("Failed to assign approval access.");
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="flex items-center mb-6 gap-7">
                <Link to="/AdminDashboard" className="text-black">
                    <IoArrowBackCircleSharp className="text-3xl" />
                </Link>
                <h1 className="text-2xl font-bold">Admin Panel Notifications Access</h1>
            </div>

            {loading && <FaSpinner className="animate-spin text-black" size={24} />}
            {error && <p className="text-red-500">{error}</p>}

            <Button className="mb-4" onClick={() => setIsModalOpen(true)}>
                Open Modal
            </Button>

            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
                        <Dialog.Title className="text-xl font-bold">Assign Roles</Dialog.Title>

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

                        <div className="mb-4 h-40 overflow-y-auto border rounded-md p-2">
                            {roles.length > 0 ? (
                                roles.map((role) => (
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
                                <p className="text-center text-gray-500 mt-2">No roles available</p>
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
                            <Button className="rounded-full" onClick={handleSave}>
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default ApprovalsAccess;