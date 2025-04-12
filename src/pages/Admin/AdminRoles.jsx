import { useEffect, useState } from "react";
import axios from "axios";
import { Dialog } from "@headlessui/react";
import { Link } from 'react-router-dom';
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Checkbox } from "@/components/ui/checkbox";
import { FaSpinner } from "react-icons/fa";
import { Shield, Users } from "lucide-react";
import { motion } from "framer-motion"; // Import Framer Motion

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
            setSelectedUsers(filteredRoles.map((role) => ({
                id: role.id,
                role: role.role,
                email: role.email || '' // Ensure to send email if available
            })));
            setAreAllSelected(true);
        } else {
            setSelectedUsers([]); // Deselect all users
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
            setSelectedUsers(response.data || []);
        } catch (err) {
            toast.error("Failed to fetch assigned users.", err);
            setSelectedUsers([]); // Clear users in case of error
        }
        setIsModalOpen(true);
    };

    const toggleUserSelection = (userId, userRole, email) => {
        setSelectedUsers((prev) => {
            const userExists = prev.some(user => user.id === userId);
            if (userExists) {
                return prev.filter(user => user.id !== userId); // Remove user if already selected
            }
            return [...prev, { id: userId, role: userRole, email }]; // Add user if not selected
        });
    };

    const handleSave = async () => {
        if (selectedUsers.length === 0) return; // Ensure users are selected

        try {
            await axios.post(`${base_URL}/assign-role`, {
                role: selectedRole.role,
                selectedRole: selectedUsers,
            });
            toast.success("Users assigned successfully!");
            setIsModalOpen(false);
            setSelectedUsers([]); // Clear selection after saving
        } catch (err) {
            toast.error("Failed to assign roles.", err);
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
              <div className="flex items-center m-5 gap-3">
              <Link to="/AdminDashboard" className="text-black">
                    <IoArrowBackCircleSharp className="text-3xl" />
                </Link>
            <div className="bg-indigo-600 rounded-xl p-2">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Admin Panel - Roles
            </h1>
          </div>
            {loading &&  <FaSpinner className="animate-spin text-black" size={24} /> }
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {roles.map((role, index) => (
            <div
                key={index}
                onClick={() => openModal(role)}
                className={`
                    group relative bg-white rounded-xl p-6
                    transform transition-all duration-200 ease-in-out
                    hover:scale-105 hover:shadow-lg
                    border-2 ${selectedRole?.id === role.id ? 'border-indigo-500' : 'border-transparent'}
                    cursor-pointer
                `}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-200" />
                
                <div className="relative flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">{role.role}</h2>
                </div>
                
                <div className="relative mt-2">
                    <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300" />
                </div>
            </div>
        ))}
    </div>
)}

            {roles.length === 0 && !loading && !error && (
                <p>No roles found.</p>
            )}

            {/* Modal */}
            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
                <motion.div
                        initial={{ opacity: 0, scale: 0.9 }} // Initial state
                        animate={{ opacity: 1, scale: 1 }} // Animation on open
                        exit={{ opacity: 0, scale: 0.9 }} // Animation on close
                        transition={{ duration: 0.3 }} // Smooth transition
                        className="bg-white p-6 rounded-md shadow-md w-full max-w-lg"
                    >
                    <div className="bg-white p-6 rounded-md  w-full max-w-md">
                        
                         <div className="flex flex-col items-center mb-6">
                                                    <div className="mb-4 inline-block p-3 bg-indigo-100 rounded-full">
                                                        <Shield className="w-8 h-8 text-indigo-600" />
                                                    </div>
                                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Grant Access</h3>
                                                    <p className="text-gray-600 mb-6">
                                                        Configure access permissions for the selected role
                                                    </p>
                                                </div>
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
                                            onCheckedChange={() => toggleUserSelection(role.id, role.role, role.email)}
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
                      </motion.div>
                </div>
            </Dialog>
        </div>
    );
};

export default AdminRoles;
