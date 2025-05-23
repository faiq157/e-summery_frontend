import React, { useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from "@/utils/http";
import { Button } from "./ui/button";
import { FaEye, FaEyeSlash } from "react-icons/fa";  // Importing the eye icons from react-icons

const EditUserModal = ({ isOpen, onClose, user, onUpdate }) => {
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [department, setDepartment] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);  // State to toggle password visibility
    const base_URL = import.meta.env.VITE_APP_API_URL;

    useEffect(() => {
        if (user) {
            setFullname(user.fullname || "");
            setEmail(user.email || "");
            setPassword("");  // Clear password field
            setRole(user.role || "");
            setDepartment(user.department || "");
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedUser = { fullname, email, password, role, department };
            const response = await axiosInstance.put(
                `${base_URL}/auth/edit/${user._id}`,
                updatedUser
            );
            onUpdate(response.data);
            onClose();
        } catch (err) {
            console.error("Error updating user:", err);
        }
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);  // Toggle the visibility of the password
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Edit User</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Full Name</label>
                        <input
                            type="text"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>
                    <div className="mb-4 relative">
                        <label className="block text-gray-700">Password</label>
                        <input
                            type={isPasswordVisible ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded-md"
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 bottom-1 transform -translate-y-1/2 text-gray-500"
                        >
                            {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Role</label>
                        <input
                            type="text"
                            value={role}
                            readOnly
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Department</label>
                        <input
                            type="text"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>
                    <div className="flex justify-between mt-6">
                        <Button
                            type="button"
                              variant="destructive"
                            onClick={onClose}
                            className=" rounded-full"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                          variant="secondary"
                          className="rounded-full"
                        >
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;
