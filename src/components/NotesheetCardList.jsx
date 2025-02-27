/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import NotesheetDetailModal from './NotesheetDetailModal';
import Loader from './Loader';

import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import EditApplication from '../pages/createApp/EditeApplication';
import { Player } from '@lottiefiles/react-lottie-player';
import axiosInstance from '@/utils/http';
import { AiOutlineCopy } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { useNotesheetContext } from '@/context/NotesheetContext';
import { motion } from 'framer-motion';  // Import Framer Motion
import { DataTable } from './DataTable/Data-Table';
import { NotesheetData } from './DataTable/columns';

const NotesheetCardList = ({ userRole, status, sortOrder = 'asc' }) => {
    const storedToken = localStorage.getItem('token');
    const [selectedNotesheet, setSelectedNotesheet] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [DeleteDialog, setIsDeleteDialogOpen] = useState(false);
    const [notesheetToDelete, setNotesheetToDelete] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const base_URL = import.meta.env.VITE_APP_API_URL;
    const [isCopied, setIsCopied] = useState(false);
    const { notesheets, fetchNotesheets, deleteNotesheets, loading, error } = useNotesheetContext();
    const [totalpages, setTotalPages] = useState(1);
console.log("notesheet Id",notesheetToDelete)
    const handleDelete = async () => {
        await deleteNotesheets(notesheetToDelete, storedToken);
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
            fetchNotesheets(userRole, status, storedToken, 1, 10, setTotalPages);
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
        console.log(notesheet);
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
        }).catch(() => {
            toast.error('Failed to copy tracking ID');
        });
    };

    const sortedNotesheets = [...notesheets].sort((a, b) => {
        const dateA = new Date(a.timestamps.createdAt);
        const dateB = new Date(b.timestamps.createdAt);
        if (isNaN(dateA) || isNaN(dateB)) {
            console.error("Invalid date format in notesheet:", a.timestamps.createdAt, b.timestamps.createdAt);
            return 0;
        }
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    if (loading) {
        return <div className='flex items-center justify-center h-[100vh]'><Loader width={600} height={600} /></div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const history = notesheets[0]?.history?.[0];

    return (
        <div>
        {
            sortedNotesheets.length === 0 ? (
                <div className="flex flex-col items-center justify-center w-[100vw] h-screen space-y-4">
                    <Player
                        autoplay
                        loop
                        src="https://lottie.host/7881658b-10eb-4e1d-9424-661cf3bb1665/xne07bwaFH.json"
                        style={{ height: '500px', width: '500px' }}
                    />
                    <p className="text-xl font-semibold mt-4">Please add an application.</p>
                </div>
            ) : (
                <>
                    <DataTable columns={NotesheetData(handleEdit, handleOpenDeleteDialog,sortedNotesheets)} data={sortedNotesheets}   onRowClick={handleViewDetails} />
                    {sortedNotesheets.map((notesheet) => (
                        <motion.div
                            key={notesheet._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className='flex justify-between mt-2'>
                                {status === 'New' && (
                                    <div className="">
                                       <AlertDialog open={DeleteDialog} onOpenChange={setIsDeleteDialogOpen}>
                                    <AlertDialogTrigger asChild>
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
                        </motion.div>
                    ))}
                </>
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
