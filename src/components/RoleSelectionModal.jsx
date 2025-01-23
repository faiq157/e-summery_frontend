import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { AiOutlineClose } from 'react-icons/ai';
import { toast } from 'react-toastify';  // Import toast from react-toastify
import axiosInstance from '@/utils/http';

const RoleSelectionModal = ({ isOpen, onClose, notesheet, storedToken, userRole, closeParentModal, refetchData }) => {
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const base_URL = import.meta.env.VITE_APP_API_URL;

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axiosInstance.get(`${base_URL}/get-role`, {
                    headers: { Authorization: ` ${storedToken}` },
                });
                const allRoles = [];
                response.data.data.forEach(role => {
                    // Push the selected roles from each role object
                    role.selectedRole.forEach(selected => {
                        allRoles.push(selected);
                    });
                });
                setRoles(allRoles); // Set all selected roles to the state
            } catch (error) {
                console.error('Error fetching roles:', error);
                setErrorMessage('Failed to load roles.');
            }
        };

        if (isOpen) {
            fetchRoles();
        }
    }, [isOpen, storedToken, refetchData]);

    const sendNotification = (userId) => {
        axiosInstance.post(`${base_URL}/send-notification`, {
            title: `Notesheet received from ${userRole}`,
            body: "Hello, you've received a new notesheet.",
            userId: userId, // Send the user ID for the selected role
            link: "https://e-summery.netlify.app/received"
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(() => {
                console.log("Notification sent successfully.");
            })
            .catch((error) => {
                console.error("Error sending notification:", error);
            });
    };

    const handleSend = async () => {
        if (!selectedRole) {
            return;
        }

        setLoading(true);
        try {
            // Sending the notesheet to the selected role
            const response = await axiosInstance.post(
                `${base_URL}/notesheet/send/${notesheet._id}`,
                {
                    currentRole: userRole,
                    toSendRole: selectedRole,  // Send the selected role (role name)
                },
                {
                    headers: {
                        Authorization: ` ${storedToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('Send response:', response.data);
            toast.success("Notesheet sent successfully!");
            setLoading(false);
            onClose();
            closeParentModal();
            // Find the selected role's object based on role name
            const selectedRoleObj = roles.find(role => role.role === selectedRole);
            if (selectedRoleObj) {
                sendNotification(selectedRoleObj.id);  // Send the user ID for the selected role
            }

        } catch (error) {
            console.error('Error sending data:', error);
            setErrorMessage('Failed to send data.');
            setLoading(false);
        }
    };

    if (!isOpen) {
        return null;
    }

    // Filter out the current userRole from the available roles
    const filteredRoles = roles.filter(role => role.role !== userRole);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[40vw]">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold mb-4">Select a Role to Send</h2>
                    <AiOutlineClose className="text-2xl cursor-pointer" onClick={onClose} />
                </div>

                {errorMessage && <p className="text-red-500">{errorMessage}</p>}

                <div className="space-y-4">
                    <p className="text-lg">Choose a role:</p>
                    <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-md"
                    >
                        <option value="">Select a role</option>
                        {filteredRoles.map((role) => (
                            <option key={role.id} value={role.role}>
                                {role.role}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mt-6 flex justify-between">
                    <Button onClick={handleSend} disabled={loading || !selectedRole}>
                        {loading ? 'Sending...' : 'Send'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RoleSelectionModal;
