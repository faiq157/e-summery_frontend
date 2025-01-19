/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { AiOutlineClose } from 'react-icons/ai';

const RoleSelectionModal = ({ isOpen, onClose, notesheet, storedToken, userRole }) => {
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const base_URL = import.meta.env.VITE_APP_API_URL;

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get(`${base_URL}/auth/roles`, {
                    headers: { Authorization: `${storedToken}` },
                });
                console.log('Roles fetched:', response.data);
                setRoles(response.data);
            } catch (error) {
                console.error('Error fetching roles:', error);
                setErrorMessage('Failed to load roles.');
            }
        };

        if (isOpen) {
            fetchRoles();
        }
    }, [isOpen, storedToken]);

    const handleSend = async () => {
        if (!selectedRole) {
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                `${base_URL}/notesheet/send/${notesheet._id}`,
                {
                    currentRole: userRole,  // Send the userRole directly as a string
                    toSendRole: selectedRole,
                },
                {
                    headers: {
                        Authorization: `${storedToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('Send response:', response.data);
            setLoading(false);
            onClose();
        } catch (error) {
            console.error('Error sending data:', error);
            setErrorMessage('Failed to send data.');
            setLoading(false);
        }
    };

    if (!isOpen) {
        return null;
    }

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
                        {roles.map((role, index) => (
                            <option key={index} value={role}>
                                {role}
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
