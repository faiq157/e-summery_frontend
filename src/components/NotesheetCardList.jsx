import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import NotesheetDetailModal from './NotesheetDetailModal';
import Loader from './Loader';
import AuthContext from '@/context/AuthContext';
import { fetchNotesheets } from '@/constant/notesheetAPI';
import { deleteNotesheet } from '@/constant/notesheetAPI'; // Import delete function
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog"; // Import alert dialog components
import EditApplication from '../pages/createApp/EditeApplication'; // Assuming this is the edit component

const NotesheetCardList = ({ userRole, status, searchQuery, refetchData }) => {
    const [notesheets, setNotesheets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const storedToken = localStorage.getItem('token');
    const [selectedNotesheet, setSelectedNotesheet] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [notesheetToDelete, setNotesheetToDelete] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State to control Edit Application modal
    const base_URL = import.meta.env.VITE_APP_API_URL;

    // Fetch notesheets and sort by createdAt
    useEffect(() => {
        const getNotesheets = async () => {
            try {
                const fetchedNotesheets = await fetchNotesheets(userRole, status, storedToken);
                setNotesheets(fetchedNotesheets);
                setLoading(false);
            } catch (err) {
                setError("Error fetching notesheets");
                setLoading(false);
            }
        };

        getNotesheets();
    }, [userRole, status, storedToken, refetchData]);

    // Handle deleting the notesheet
    const handleDelete = async () => {
        try {
            const result = await deleteNotesheet(notesheetToDelete._id, storedToken); // Use the imported function
            console.log(result.message); // Optionally log success message
            // After deleting, refetch the notesheets
            const updatedNotesheets = notesheets.filter(notesheet => notesheet._id !== notesheetToDelete._id);
            setNotesheets(updatedNotesheets);
            setIsDeleteDialogOpen(false); // Close the confirmation dialog
        } catch (error) {
            setError("Error deleting notesheet");
        }
    };
    const onEditSave = async (updatedValues, resetForm) => {
        try {
            const formData = new FormData();
            formData.append('description', updatedValues.description);
            formData.append('subject', updatedValues.subject);
            formData.append('userName', updatedValues.userName);
            formData.append('email', updatedValues.email);
            formData.append('contact_number', updatedValues.contact_number);
            formData.append('userEmail', updatedValues.userEmail);
            formData.append('status', updatedValues.status);
            if (updatedValues.file) formData.append('image', updatedValues.file);

            const response = await axios.put(
                `${base_URL}/notesheet/edit/${selectedNotesheet._id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: ` ${localStorage.getItem('token')}`,
                    },
                }
            );

            console.log(response.data.message); // Log success message if needed

            // Update the state to reflect the changes
            const updatedNotesheets = notesheets.map((notesheet) =>
                notesheet._id === selectedNotesheet._id ? { ...notesheet, ...updatedValues } : notesheet
            );
            setNotesheets(updatedNotesheets);
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Error updating notesheet:', error);
        }
    };

    const handleEdit = (notesheet) => {
        // Set selected notesheet for editing or open modal
        setSelectedNotesheet(notesheet);
        setIsEditModalOpen(true); // Open the Edit Application modal
    };

    const handleOpenDeleteDialog = (notesheet) => {
        setNotesheetToDelete(notesheet);
        setIsDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
        setNotesheetToDelete(null);
    };

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
            {notesheets.map((notesheet) => (
                <Card key={notesheet._id} className="w-full">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">{notesheet.subject}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p><strong>Description:</strong> {notesheet.description}</p>
                        <p><strong>Status:</strong> {notesheet.status}</p>
                        <p><strong>Created by:</strong> {notesheet.userName}</p>
                        <p><strong>Created at:</strong> {new Date(notesheet.timestamps.createdAt).toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "numeric", hour12: true })}</p>

                        {/* Display roles dynamically */}
                        <div>
                            <strong>User Role:</strong>
                            {notesheet.roles.map((role, index) => (
                                <span key={index}>
                                    <strong>{role.role}</strong>
                                </span>
                            ))}
                        </div>

                        {status === 'New' && (
                            <div className="mt-2">
                                <Button className="mr-2" onClick={() => handleViewDetails(notesheet)}>View Details</Button>
                                <Button className="mr-2" onClick={() => handleEdit(notesheet)}>Edit</Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button className="bg-red-500 text-white" onClick={() => handleOpenDeleteDialog(notesheet)}>Delete</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to delete this notesheet? This action cannot be undone.
                                        </AlertDialogDescription>
                                        <div className="flex justify-end space-x-2">
                                            <AlertDialogCancel onClick={handleCloseDeleteDialog}>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                                        </div>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>)
                        }
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

            {/* Add EditApplication Modal */}
            {isEditModalOpen && (
                <EditApplication
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    notesheet={selectedNotesheet}
                    onEditSave={onEditSave}
                />
            )}
        </div>
    );
};

export default NotesheetCardList;
