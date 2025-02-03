/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { AiOutlineClose } from 'react-icons/ai';
import { toast } from 'react-toastify';
import axiosInstance from '@/utils/http';
import { useNotesheetContext } from '@/context/NotesheetContext';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Input } from './ui/input';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';


const RoleSelectionModal = ({ isOpen, onClose, notesheet, storedToken, status, userRole, closeParentModal, refetchData }) => {
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null); // Single selection for radio
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const base_URL = import.meta.env.VITE_APP_API_URL;
    const { fetchNotesheets } = useNotesheetContext();
    const [totalPages, setTotalPages] = useState(1);
    const storedUser = localStorage.getItem('user');
    const userData = JSON.parse(storedUser);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axiosInstance.get(`${base_URL}/assigned-users/${userData?.role}`, {
                    headers: { Authorization: ` ${storedToken}` },
                });
                console.log('Roles response:', response.data);

                if (Array.isArray(response.data)) {
                    const allRoles = response.data.map((role) => ({
                        id: role.id,
                        role: role.role,
                        email: role.email,
                    }));

                    const uniqueRoles = [
                        ...new Map(allRoles.map(role => [role.role, role])).values(),
                    ];

                    const filteredRoles = uniqueRoles.filter(role => role.role !== 'admin');
                    setRoles(filteredRoles);

                } else {
                    console.error('Unexpected response format:', response);
                    setErrorMessage('Failed to load roles due to unexpected response format.');
                }
            } catch (error) {
                console.error('Error fetching roles:', error);
                setErrorMessage('Failed to load roles.');
            }
        };

        if (isOpen) {
            fetchRoles();
        }
    }, [isOpen, storedToken, refetchData]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSend = async () => {
        if (!selectedRole) {
            return toast.error('Please select a role.');
        }

        const selectedUser = roles.find(role => role.id === selectedRole);

        if (!selectedUser || !selectedUser.email) {
            return toast.error('Selected role does not have an email.');
        }

        const userEmail = selectedUser.email; // Get the email from the selected role
        console.log("Selected User Email:", userEmail);

        setLoading(true);
        try {
            await axiosInstance.post(
                `${base_URL}/notesheet/send/${notesheet._id}`,
                {
                    currentRole: userRole,
                    toSendRole: selectedUser.role,
                },
                {
                    headers: {
                        Authorization: ` ${storedToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            await axiosInstance.post(`${base_URL}/notesheet/send-tracking-id`, {
                email: userEmail,
                subject: `Notesheet Received from ${userRole}`,
                text: `Hello,You’ve received a new notesheet from  ${userRole}.
                Please review the details and take necessary actions at your earliest convenience.
                To access the notesheet,
                click the link below: https://e-summery.netlify.app/received .
                If you have any questions or need further assistance, 
                feel free to reach out.Best regards,
                UET Mardan`,
            });

            sendNotification(selectedRole);

            toast.success("Notesheet sent successfully!");
            setLoading(false);
            fetchNotesheets(userRole, status, storedToken, 1, 10, setTotalPages);
            onClose();
            closeParentModal();
        } catch (error) {
            console.error('Error sending data:', error);
            setErrorMessage('Failed to send data.');
            setLoading(false);
        }
    };

    const sendNotification = (userId) => {
        axiosInstance.post(`${base_URL}/send-notification`, {
            title: `Notesheet received from ${userRole}`,
            body: "Hello, you've received a new notesheet.",
            userId: userId,
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

    if (!isOpen) {
        return null;
    }

    const filteredRoles = roles
        .filter(role => role.role.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter(role => role.role !== userRole);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[40vw]">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold mb-4">Select Role to Send</h2>
                    <AiOutlineClose className="text-2xl cursor-pointer" onClick={onClose} />
                </div>

                {errorMessage && <p className="text-red-500">{errorMessage}</p>}

                <div className="space-y-4">
                    {/* Search Field */}
                    <Input
                        type="text"
                        placeholder="Search roles..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full"
                    />

                    {/* Role List */}
                    <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md p-2">
                        {filteredRoles.length > 0 ? (
                            <RadioGroup value={selectedRole} onValueChange={setSelectedRole}>
                                {filteredRoles.map((role) => (
                                    <div key={role.id} className="flex items-center space-x-2 mb-2">
                                        <RadioGroupItem
                                            value={role.id}
                                            id={`role-${role.id}`}
                                            className="radio"
                                        />
                                        <Label htmlFor={`role-${role.id}`}>{role.role}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        ) : (
                            <p className="text-center text-gray-500 mt-4">No Role Found!</p>
                        )}
                    </div>
                </div>

                <div className="mt-6 flex justify-between">
                    <Button
                        className="rounded-full"
                        onClick={handleSend}
                        disabled={loading || !selectedRole}
                    >
                        {loading ? 'Sending...' : 'Send'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RoleSelectionModal;
