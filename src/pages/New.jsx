import { useState, useEffect } from "react";
import { AiOutlineArrowDown, AiOutlineArrowUp, AiOutlineClose } from "react-icons/ai";
import NotesheetCardList from "@/components/NotesheetCardList";
import { useModal } from "@/context/ModalContext";
import Dashboardlayout from "@/layout/Dashboardlayout";
import NotesheetForm from "./createApp/NotesheetForm";
import { toast } from "react-toastify";
import axiosInstance from "@/utils/http";
import { useNotesheetContext } from "@/context/NotesheetContext";
import PaginationUI from "@/components/PaginationUI";
import FilterAndSearch from "@/components/FilterAndSearch";
import { Button } from "@/components/ui/button";

const New = () => {
    const { isModalOpen, openModal, closeModal } = useModal();
    const [submittedData, setSubmittedData] = useState(null);
    const [storedEmail, setStoredEmail] = useState("");
    const storedToken = localStorage.getItem("token");
    const base_URL = import.meta.env.VITE_APP_API_URL;
    const storedUser = localStorage.getItem("user");
    const [userRole, setUserRole] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [refetchData, setRefetchData] = useState(false);
    const [dateRange, setDateRange] = useState("all");
    const { fetchNotesheets } = useNotesheetContext();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortOrder, setSortOrder] = useState('asc');
    const [limit] = useState(10);

    useEffect(() => {
        if (storedUser) {
            const userObject = JSON.parse(storedUser);
            setStoredEmail(userObject?.email || "");
            setUserRole(userObject?.role || "");
        }
    }, []);

    useEffect(() => {
        if (userRole && limit && currentPage) {
            fetchNotesheets(userRole, "New", storedToken, currentPage, limit, setTotalPages);
        }
    }, [userRole, storedToken, currentPage, limit]);

    useEffect(() => {
        const fetchData = setTimeout(() => {
            if (userRole && limit && currentPage) {
                fetchNotesheets(
                    userRole,
                    "New",
                    storedToken,
                    currentPage,
                    limit,
                    setTotalPages,
                    searchQuery,
                    dateRange || ""
                );
            }
        }, 1000);

        return () => clearTimeout(fetchData);
    }, [searchQuery, dateRange]);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleDateRangeChange = (value) => {
        setDateRange(value);
    };

    const handleRefetchData = () => {
        setRefetchData((prev) => !prev);
    };

    const toggleSortOrder = () => {
        setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
    };

    useEffect(() => {
        if (!isModalOpen) {
            handleRefetchData();
        }
    }, [isModalOpen]);

    const userData = JSON.parse(storedUser);
    const userId = userData._id;

    const sendNotification = (userId) => {
        axiosInstance
            .post(`${base_URL}/send-notification`, {
                title: "Notesheet Created",
                body: "A new notesheet has been successfully created.",
                userId: userId,
            })
            .then(() => {
                console.log("Notification sent successfully.");
                toast.success("Notesheet created successfully");
            })
            .catch((error) => {
                console.error("Error sending notification:", error);
            });
    };

    const handleCreateSubmit = (values, { setSubmitting, resetForm }) => {
        const formData = new FormData();
        formData.append("description", values.description);
        formData.append("subject", values.subject);
        formData.append("userName", values.userName);
        formData.append("email", values.email);
        formData.append("contact_number", values.contact_number);
        formData.append("userEmail", values.userEmail);
        formData.append("status", values.status);
        formData.append("image", values.file);

        axiosInstance
            .post(`${base_URL}/notesheet/create`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: ` ${storedToken}`,
                },
            })
            .then((response) => {
                // Assume the response contains a trackingId field
                const trackingId = response.data.data.trackingId;

                resetForm();
                setSubmitting(false);
                setSubmittedData(values);
                closeModal();
                fetchNotesheets(userRole, "New", storedToken, 1, 10, setTotalPages);
                sendNotification(userId);
                axiosInstance
                    .post(`${base_URL}/notesheet/send-tracking-id`, {
                        email: values.userEmail,
                        trackingId: trackingId,
                    })
                    .then(() => {
                        console.log("Approval email sent successfully.");
                    })
                    .catch((error) => {
                        console.error("Error sending approval email:", error);
                    });
            })
            .catch((error) => {
                console.error("Error:", error);
                setSubmitting(false);
            });
    };

    return (
        <Dashboardlayout>
            <div className="p-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                    <FilterAndSearch
                        title="Create Application"
                        onDateRangeChange={handleDateRangeChange}
                        searchQuery={searchQuery}
                        onSearchChange={handleSearchChange}
                        onCreateClick={openModal}
                        dateRange={dateRange}
                        showbutton={true}
                        toggleSortOrder={toggleSortOrder}
                        sortOrder={sortOrder}
                    />
                </div>

                <div className="mt-8">
                    <NotesheetCardList
                        sortOrder={sortOrder}
                        userRole={userRole}
                        status={"New"}
                        searchQuery={searchQuery}
                    />
                    {totalPages > 1 && (
                        <div className="mt-5">
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
                                <div className="flex justify-between">
                                    <h2 className="text-2xl font-bold mb-4">Create New Application</h2>
                                    <AiOutlineClose
                                        className="text-2xl cursor-pointer"
                                        onClick={closeModal}
                                    />
                                </div>
                                <NotesheetForm
                                    initialValues={{
                                        description: "",
                                        subject: "",
                                        userName: "",
                                        email: storedEmail,
                                        contact_number: "",
                                        userEmail: "",
                                        status: "",
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
        </Dashboardlayout>
    );
};

export default New;
