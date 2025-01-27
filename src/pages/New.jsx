import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { AiOutlineClose } from "react-icons/ai";
import NotesheetCardList from '@/components/NotesheetCardList';
import { useModal } from '@/context/ModalContext';
import Dashboardlayout from '@/layout/Dashboardlayout';
import NotesheetForm from './createApp/NotesheetForm';
import { toast } from 'react-toastify';
import axiosInstance from '@/utils/http';
import { useNotesheetContext } from '@/context/NotesheetContext';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import PaginationUI from '@/components/PaginationUI';


const New = () => {
    const { isModalOpen, openModal, closeModal } = useModal();
    const [submittedData, setSubmittedData] = useState(null);
    const [storedEmail, setStoredEmail] = useState('');
    const storedToken = localStorage.getItem('token');
    const base_URL = import.meta.env.VITE_APP_API_URL;
    const storedUser = localStorage.getItem('user');
    const [userRole, setUserRole] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [refetchData, setRefetchData] = useState(false);
    const { fetchNotesheets } = useNotesheetContext();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(10);


    useEffect(() => {
        if (storedUser) {
            const userObject = JSON.parse(storedUser);
            setStoredEmail(userObject?.email || '');
            setUserRole(userObject?.role || '');
        }
    }, []);
    console.log(userRole)
    useEffect(() => {
        if (userRole && limit && currentPage) {
            fetchNotesheets(userRole, "New", storedToken, currentPage, limit, setTotalPages);
        }
    }, [userRole, storedToken, currentPage, limit]);


    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleRefetchData = () => {
        setRefetchData((prev) => !prev);
    };
    useEffect(() => {
        if (!isModalOpen) {
            handleRefetchData();
        }
    }, [isModalOpen]);
    const userData = JSON.parse(storedUser);

    // Get the userId from _id
    const userId = userData._id;
    const sendNotification = (userId) => {
        axiosInstance.post(`${base_URL}/send-notification`, {
            title: "Notesheet Created",
            body: "A new notesheet has been successfully created.",
            userId: userId,
        })
            .then(() => {
                console.log("Notification sent successfully.");
                toast.success('Notesheet created successfully');
            })
            .catch((error) => {
                console.error("Error sending notification:", error);
            });
    };

    const handleCreateSubmit = (values, { setSubmitting, resetForm }) => {
        const formData = new FormData();
        formData.append('description', values.description);
        formData.append('subject', values.subject);
        formData.append('userName', values.userName);
        formData.append('email', values.email);
        formData.append('contact_number', values.contact_number);
        formData.append('userEmail', values.userEmail);
        formData.append('status', values.status);
        formData.append('image', values.file);

        axiosInstance.post(`${base_URL}/notesheet/create`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: ` ${storedToken}`,
            },
        })
            .then((response) => {
                resetForm();
                setSubmitting(false);
                setSubmittedData(values);
                closeModal();
                fetchNotesheets(userRole, "New", storedToken, 1, 10, setTotalPages);


                sendNotification(userId);
            })
            .catch((error) => {
                console.error('Error:', error);
                setSubmitting(false);
            });
    };

    return (
        <Dashboardlayout>
            <div className="p-8 ">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                    {/* Title */}
                    <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left mb-4 md:mb-0">
                        Create Application
                    </h1>
                    {/* Search and Button */}
                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-center">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search notesheets by subject..."
                            className="w-full md:w-96 p-2 border rounded-full shadow-sm focus:outline-none"
                        />
                        <Button onClick={openModal} className="w-full md:w-auto rounded-full">
                            Create
                        </Button>
                    </div>
                </div>


                <div className="mt-8">
                    <NotesheetCardList userRole={userRole} status={"New"} searchQuery={searchQuery} />
                    {totalPages > 1 && (
                        <div className='mt-5'>
                            <PaginationUI
                                currentPage={currentPage}
                                totalPages={totalPages}
                                setCurrentPage={setCurrentPage}
                            />
                        </div>
                    )}
                    {isModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-4 rounded-lg shadow-lg w-[60vw] h-[90vh] overflow-auto">
                                <div className='flex justify-between'>
                                    <h2 className="text-2xl font-bold mb-4">Create New Application</h2>
                                    <AiOutlineClose className='text-2xl cursor-pointer' onClick={closeModal} />
                                </div>

                                <NotesheetForm
                                    initialValues={{
                                        description: '',
                                        subject: '',
                                        userName: '',
                                        email: storedEmail,
                                        contact_number: '',
                                        userEmail: '',
                                        status: '',
                                        file: null,
                                    }}
                                    onSubmit={handleCreateSubmit}
                                    isSubmitting={false}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Dashboardlayout >
    );
};

export default New;
