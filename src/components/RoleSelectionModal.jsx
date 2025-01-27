/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { AiOutlineClose } from 'react-icons/ai';
import { toast } from 'react-toastify';
import axiosInstance from '@/utils/http';
import { useNotesheetContext } from '@/context/NotesheetContext';
import { Checkbox } from './ui/checkbox';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Input } from './ui/input';

const RoleSelectionModal = ({ isOpen, onClose, notesheet, storedToken, status, userRole, closeParentModal, refetchData }) => {
    const [roles, setRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);
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

    const handleSelectAll = (checked) => {
        if (checked) {
            const allRoleIds = roles.map((role) => role.id);
            setSelectedRoles(allRoleIds);
        } else {
            setSelectedRoles([]);
        }
    };


    const handleRoleSelect = (roleId) => {
        if (selectedRoles.includes(roleId)) {
            setSelectedRoles(selectedRoles.filter(id => id !== roleId));
        } else {
            setSelectedRoles([...selectedRoles, roleId]);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSend = async () => {
        if (selectedRoles.length === 0) {
            return toast.error('Please select at least one role.');
        }

        setLoading(true);
        try {
            await Promise.all(selectedRoles.map(async (roleId) => {
                await axiosInstance.post(
                    `${base_URL}/notesheet/send/${notesheet._id}`,
                    {
                        currentRole: userRole,
                        toSendRole: roles.find(role => role.id === roleId)?.role,
                    },
                    {
                        headers: {
                            Authorization: ` ${storedToken}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                // Send notification for each selected role
                sendNotification(roleId);
            }));

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

    const areAllSelected = filteredRoles.length > 0 && filteredRoles.every(role => selectedRoles.includes(role.id));

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[40vw]">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold mb-4">Select Roles to Send</h2>
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

                    {/* Select All Checkbox */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            checked={areAllSelected}
                            onCheckedChange={handleSelectAll}
                            id="select-all"
                        />
                        <Label htmlFor="select-all" className="font-medium">
                            Select All
                        </Label>
                    </div>

                    {/* Role List */}
                    <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md p-2">
                        {filteredRoles.length > 0 ? (
                            filteredRoles.map((role) => (
                                <div key={role.id} className="flex items-center space-x-2 mb-2">
                                    <Checkbox
                                        checked={selectedRoles.includes(role.id)}
                                        onCheckedChange={() => handleRoleSelect(role.id)}
                                        id={`role-${role.id}`}
                                    />
                                    <Label htmlFor={`role-${role.id}`}>{role.role}</Label>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 mt-4">No Role Found!</p>
                        )}

                    </div>
                </div>


                <div className="mt-6 flex justify-between">
                    <Button
                        className="rounded-full"
                        onClick={handleSend}
                        disabled={loading || selectedRoles.length === 0}
                    >
                        {loading ? 'Sending...' : 'Send'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RoleSelectionModal;
