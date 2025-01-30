import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '@/utils/http';
import { deleteNotesheet } from '@/constant/notesheetAPI';

const NotesheetContext = createContext();

const base_URL = import.meta.env.VITE_APP_API_URL;

export const NotesheetProvider = ({ children }) => {
    const [notesheets, setNotesheets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const fetchNotesheets = async (userRole, status, storedToken, page, limit, setTotalPages, searchQuery, dateRange) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.get(`${base_URL}/notesheet/notesheets`, {
                params: {
                    role: { $in: [userRole] },
                    status,
                    page,
                    limit,
                    search: searchQuery,
                    dateRange,
                },
                headers: {
                    Authorization: ` ${storedToken}`,
                },
            });

            // Check if the response contains notesheets and totalPages
            if (Array.isArray(response.data.notesheets)) {
                // Sort notesheets by creation date (most recent first)
                const sortedNotesheets = response.data.notesheets.sort((a, b) => {
                    return new Date(b.timestamps.createdAt) - new Date(a.timestamps.createdAt);
                });
                setNotesheets(sortedNotesheets);
                setTotalPages(response.data.pagination.totalPages);
            } else {
                throw new Error('Invalid data format: Expected an array');
            }
        } catch (err) {
            console.error('Failed to fetch notesheets:', err);
            const errorMessage = err.response?.data?.message || 'Failed to fetch notesheets';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const deleteNotesheets = async (notesheetId, storedToken) => {
        try {
            await deleteNotesheet(notesheetId, storedToken);
            setNotesheets((prev) => prev.filter((notesheet) => notesheet._id !== notesheetId));
        } catch (err) {
            setError('Error deleting notesheet');
        }
    };

    // Provide both data and functions globally
    return (
        <NotesheetContext.Provider value={{ notesheets, fetchNotesheets, deleteNotesheets, loading, error }}>
            {children}
        </NotesheetContext.Provider>
    );
};

// Custom hook to access the context
export const useNotesheetContext = () => useContext(NotesheetContext);
