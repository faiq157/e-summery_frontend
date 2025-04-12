import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Link } from "react-router-dom";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Users } from "lucide-react";
import { motion } from "framer-motion"; // Import Framer Motion

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
                const response = await fetch(`${base_URL}/auth/roles`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const data = await response.json();
                setRoles(data.filter((role) => role.role !== "Admin"));
            } catch (err) {
                setError("Failed to fetch roles.");
            } finally {
                setLoading(false);
            }
        };

        fetchRoles();
    }, []);

    const fetchApprovalAccess = async () => {
        try {
            const response = await fetch(`${base_URL}/get-approval-access`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            const approvalAccess = data.data.approvalAccess
            console.log(approvalAccess,"approval selected ")
            setSelectedUsers(
                roles
                    .filter((role) => approvalAccess.includes(role.role))
                    .map((role) => ({ id: role.id, role: role.role }))
            );
            setAreAllSelected(
                roles.every((role) => approvalAccess.includes(role.role))
            );
        } catch (err) {
            toast.error("Failed to fetch existing approval access.");
        }
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
        fetchApprovalAccess(); // Fetch approval access when the modal opens
    };

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

    const handleUpdate = async () => {
        if (selectedUsers.length === 0) {
            toast.error("No users selected.");
            return;
        }

        try {
            const approvalAccess = selectedUsers.map((user) => user.role);
            await fetch(`${base_URL}/update-approval-access`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ approvalAccess }),
            });
            toast.success("Approval access updated successfully!");
            setIsModalOpen(false);
            setSelectedUsers([]);
        } catch (err) {
            toast.error("Failed to update approval access.");
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="flex items-center mb-6 gap-7">
                <Link to="/AdminDashboard" className="text-black">
                    <IoArrowBackCircleSharp className="text-3xl" />
                </Link>
            
                <div className="bg-indigo-600 rounded-xl p-2">
                    <Users className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                    Notification Access to the Users
                </h1>
            </div>

            {error && <p className="text-red-500">{error}</p>}
            <div className="flex justify-center mb-8">
                <button
                    onClick={handleOpenModal}
                    className="relative group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                    <Shield className="w-5 h-5" />
                    Give Access
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-100 transition-opacity duration-500 group-hover:duration-500 animate-pulse" />
                </button>
            </div>

            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }} // Initial state
                        animate={{ opacity: 1, scale: 1 }} // Animation on open
                        exit={{ opacity: 0, scale: 0.9 }} // Animation on close
                        transition={{ duration: 0.3 }} // Smooth transition
                        className="bg-white p-6 rounded-md shadow-md w-full max-w-md"
                    >
                        <div className="flex flex-col items-center mb-6">
                            <div className="mb-4 inline-block p-3 bg-indigo-100 rounded-full">
                                <Shield className="w-8 h-8 text-indigo-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Update Access</h3>
                            <p className="text-gray-600 mb-6">
                                Configure access permissions for the selected role
                            </p>
                        </div>
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
                                            checked={selectedUsers.some((user) => user.role === role.role)}
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
                            <Button className="rounded-full" onClick={handleUpdate}>
                                Update
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </Dialog>
        </div>
    );
};

export default ApprovalsAccess;