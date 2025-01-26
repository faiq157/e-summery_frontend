/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import NotesheetDetailModal from './NotesheetDetailModal';
import Loader from './Loader';
import { fetchNotesheets } from '@/constant/notesheetAPI';
import { deleteNotesheet } from '@/constant/notesheetAPI'; // Import delete function
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog"; // Import alert dialog components
import EditApplication from '../pages/createApp/EditeApplication'; // Assuming this is the edit component
import { Player } from '@lottiefiles/react-lottie-player';
import axiosInstance from '@/utils/http';
import { AiOutlineCopy } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { useNotesheetContext } from '@/context/NotesheetContext';

const NotesheetCardList = ({ userRole, status, searchQuery, refetchData }) => {
    const storedToken = localStorage.getItem('token');
    const [selectedNotesheet, setSelectedNotesheet] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [notesheetToDelete, setNotesheetToDelete] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const base_URL = import.meta.env.VITE_APP_API_URL;
    const [isCopied, setIsCopied] = useState(false);
    const { notesheets, fetchNotesheets, deleteNotesheet, loading, error } = useNotesheetContext();

    useEffect(() => {
        if (userRole) {
            fetchNotesheets(userRole, status, storedToken);
        }
    }, [userRole, status, storedToken, refetchData]);

    const handleDelete = async () => {
        await deleteNotesheet(notesheetToDelete._id, storedToken);
        setIsDeleteDialogOpen(false);
    };

    const onEditSave = async (updatedValues) => {
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

            const response = await axiosInstance.put(
                `${base_URL}/notesheet/edit/${selectedNotesheet._id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: ` ${localStorage.getItem('token')}`,
                    },
                }
            );
            fetchNotesheets(userRole, status, storedToken);
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Error updating notesheet:', error);
        }
    };

    const handleEdit = (notesheet) => {
        setSelectedNotesheet(notesheet);
        setIsEditModalOpen(true);
    };

    const handleOpenDeleteDialog = (notesheet) => {
        setNotesheetToDelete(notesheet);
        setIsDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
        setNotesheetToDelete(null);
    };

    const handleViewDetails = (notesheet) => {
        setSelectedNotesheet(notesheet);
        setIsModalOpen(true);
    };
    const handleCopy = (trackingId) => {
        navigator.clipboard.writeText(trackingId).then(() => {
            setIsCopied(true);
            toast.success('Tracking ID copied to clipboard');
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    const filteredNotesheets = notesheets.filter((notesheet) =>
        notesheet.userName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <div className='flex items-center justify-center h-screen'><Loader /></div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const history = notesheets[0]?.history?.[0];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {
                filteredNotesheets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center w-[100vw] h-screen space-y-4">
                        <Player
                            autoplay
                            loop
                            src="https://lottie.host/7881658b-10eb-4e1d-9424-661cf3bb1665/xne07bwaFH.json" // Example Lottie animation URL
                            style={{ height: '500px', width: '500px' }}
                        />
                        <p className="text-xl font-semibold mt-4">Please add an application.</p>
                    </div>
                ) : (
                    filteredNotesheets.map((notesheet) => (
                        <Card key={notesheet._id} className="w-full border-none shadow-lg hover:shadow-inner hover:scale-105 transition-transform">
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold">{notesheet.subject}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p><strong>Application User:</strong> {notesheet.userName}</p>
                                <p>
                                    <strong>Created By:</strong>
                                    <span className="bg-gradient-to-r ml-3 from-green-200 to-green-400 text-white rounded-full px-3 py-1 font-medium">
                                        {history?.role || "No role available"}
                                    </span>
                                </p>
                                <p><strong>Created at:</strong> {new Date(notesheet.timestamps.createdAt).toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "numeric", hour12: true })}</p>

                                <p className="flex items-center space-x-2">
                                    <strong>Tracking Id:</strong> {notesheet.trackingId}
                                    <AiOutlineCopy
                                        className="text-blue-600 cursor-pointer hover:text-blue-800"
                                        size={20}
                                        onClick={() => handleCopy(notesheet.trackingId)}
                                        title="Copy Tracking ID"
                                    />
                                </p>

                                <div className='flex justify-between mt-2'>
                                    <Button className="rounded-full" onClick={() => handleViewDetails(notesheet)}>View Details</Button>
                                    {status === 'New' && (
                                        <div className="">
                                            <Button className="mr-2 rounded-full" onClick={() => handleEdit(notesheet)}>Edit</Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button className="bg-red-500 text-white rounded-full" onClick={() => handleOpenDeleteDialog(notesheet)}>Delete</Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to delete this notesheet? This action cannot be undone.
                                                    </AlertDialogDescription>
                                                    <div className="flex justify-end space-x-2">
                                                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                                                        <AlertDialogCancel onClick={handleCloseDeleteDialog}>Cancel</AlertDialogCancel>

                                                    </div>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )
            }


            <NotesheetDetailModal
                userRole={userRole}
                isOpen={isModalOpen}
                storedToken={storedToken}
                onClose={() => setIsModalOpen(false)}
                notesheet={selectedNotesheet}
                status={status}
            />

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
