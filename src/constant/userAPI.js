import axiosInstance from "@/utils/http";
import axios from "axios";

const base_URL = import.meta.env.VITE_APP_API_URL;

export const fetchUsers = async () => {
    try {
        const response = await axiosInstance.get(`${base_URL}/auth/users`);
        if (Array.isArray(response.data)) {
            return response.data;
        } else {
            throw new Error("Invalid data format");
        }
    } catch (err) {
        throw new Error("Failed to fetch users", err);
    }
};

export const deleteUser = async (userId) => {
    try {
        const response = await axiosInstance.delete(`${base_URL}/auth/delete/${userId}`);
        if (response.status === 200) {
            return userId; // Return the user ID for deletion confirmation
        } else {
            throw new Error("Failed to delete user");
        }
    } catch (err) {
        throw new Error("Error deleting user", err);
    }
};
