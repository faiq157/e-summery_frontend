/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import NotesheetDetailModal from './NotesheetDetailModal';
import Loader from './Loader';

const NotesheetCardList = ({ userRole, searchQuery, refetchData }) => {
    const [notesheets, setNotesheets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const storedToken = localStorage.getItem('token');
    const [selectedNotesheet, setSelectedNotesheet] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filteredNotesheets, setFilteredNotesheets] = useState([]);
    const base_URL = import.meta.env.VITE_APP_API_URL;

    // Filter notesheets based on the search query and user role
    useEffect(() => {
        const filterNotesheets = () => {
            const filteredByRole = userRole
                ? notesheets.filter((notesheet) => notesheet.userRole === userRole) // Filter by userRole
                : notesheets;

            if (searchQuery) {
                return filteredByRole.filter((notesheet) =>
                    notesheet.subject.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }
            return filteredByRole;
        };

        setFilteredNotesheets(filterNotesheets());
    }, [searchQuery, notesheets, userRole]);

    // Fetch notesheets and sort by createdAt
    useEffect(() => {
        const fetchNotesheets = async () => {
            try {
                const response = await axios.get(`${base_URL}/notesheet/notesheets`, {
                    headers: {
                        Authorization: ` ${storedToken}`,
                    },
                });
                const sortedNotesheets = response.data.sort((a, b) => {
                    return new Date(b.timestamps.createdAt) - new Date(a.timestamps.createdAt);
                });

                setNotesheets(sortedNotesheets);
                setLoading(false);
            } catch (err) {
                setError('Error fetching notesheets');
                setLoading(false);
            }
        };

        fetchNotesheets();
    }, [storedToken, refetchData]);

    if (loading) {
        return <div className='flex items-center justify-center h-screen'><Loader /></div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const handleViewDetails = (notesheet) => {
        setSelectedNotesheet(notesheet);
        setIsModalOpen(true);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotesheets.map((notesheet) => (
                <Card key={notesheet._id} className="w-full">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">{notesheet.subject}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p><strong>Description:</strong> {notesheet.description}</p>
                        <p><strong>Status:</strong> {notesheet.status}</p>
                        <p><strong>Created by:</strong> {notesheet.userName}</p>
                        <p><strong>Created at:</strong> {new Date(notesheet.timestamps.createdAt).toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "numeric", hour12: true })}</p>
                        <Button className="mt-2" onClick={() => handleViewDetails(notesheet)}>View Details</Button>
                    </CardContent>
                </Card>
            ))}

            <NotesheetDetailModal
                userRole={userRole}
                isOpen={isModalOpen}
                storedToken={storedToken}
                onClose={() => setIsModalOpen(false)}
                notesheet={selectedNotesheet}
            />
        </div>
    );
};

export default NotesheetCardList;
