import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AiOutlineClose } from "react-icons/ai";
import NotesheetCardList from "@/components/NotesheetCardList";
import { useModal } from "@/context/ModalContext";
import Dashboardlayout from "@/layout/Dashboardlayout";
import { toast } from "react-toastify";
import axiosInstance from "@/utils/http";
import ApprovalCard from "@/components/ApprovalCard";

const Approval = () => {
    const { isModalOpen, openModal, closeModal } = useModal();
    const [submittedData, setSubmittedData] = useState(null);
    const [storedEmail, setStoredEmail] = useState("");
    const [loading, setLoading] = useState(false); // Loading state
    const storedToken = localStorage.getItem("token");
    const base_URL = import.meta.env.VITE_APP_API_URL;
    const storedUser = localStorage.getItem("user");
    const [userRole, setUserRole] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [refetchData, setRefetchData] = useState(false);

    useEffect(() => {
        if (storedUser) {
            const userObject = JSON.parse(storedUser);
            setStoredEmail(userObject?.email || "");
            setUserRole(userObject?.role || "");
        }
    }, []);

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
    const userId = userData?._id;

    const sendNotification = (userId) => {
        axiosInstance
            .post(`${base_URL}/send-notification`, {
                title: "Approval has been Created",
                body: "A new notesheet has been successfully created.",
                userId: userId,
            })
            .then(() => {
                console.log("Notification sent successfully.");
                toast.success("Notesheet created successfully");
            })
            .catch((error) => {
                console.error("Error sending notification:", error);
                toast.error("Failed to send notification");
            });
    };

    const handleCreateSubmit = (event) => {
        event.preventDefault();
        setLoading(true); // Set loading to true

        const formData = new FormData();
        formData.append("title", event.target.title.value); // Get the title from the input field
        formData.append("pdf", event.target.file.files[0]); // Get the file from the file input field

        axiosInstance
            .post(`${base_URL}/approval`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${storedToken}`,
                },
            })
            .then(() => {
                toast.success("File uploaded and approval request submitted successfully");
                setSubmittedData({
                    title: event.target.title.value,
                    file: event.target.file.files[0],
                });
                handleRefetchData();
                closeModal();
                sendNotification(userId);
            })
            .catch((error) => {
                console.error("Error:", error);
                toast.error("Error submitting approval request");
            })
            .finally(() => {
                setLoading(false); // Reset loading state
            });
    };

    return (
        <Dashboardlayout>
            <div className="p-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                    {/* Title */}
                    <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left mb-4 md:mb-0">
                        Create Approval
                    </h1>
                    {/* Search and Button */}
                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-center">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search notesheets by title..."
                            className="w-full md:w-96 p-2 border rounded-full shadow-sm focus:outline-none"
                        />
                        <Button onClick={openModal} className="w-full md:w-auto rounded-full">
                            Create
                        </Button>
                    </div>
                </div>

                {/* Notesheet Cards */}
                <ApprovalCard searchQuery={searchQuery} refetchData={refetchData} />

                {/* Modal for Creating Approval */}
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-4 rounded-lg shadow-lg w-[40vw] overflow-auto">
                            <div className="flex justify-between">
                                <h2 className="text-2xl font-bold mb-4">Create Approval</h2>
                                <AiOutlineClose className="text-2xl cursor-pointer" onClick={closeModal} />
                            </div>

                            {/* Create Approval Form */}
                            <form onSubmit={handleCreateSubmit}>
                                <div className="mb-4">
                                    <label
                                        htmlFor="title"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Title
                                    </label>
                                    <input
                                        id="title"
                                        name="title"
                                        type="text"
                                        className="w-full p-2 border rounded-md shadow-sm focus:outline-none"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="file"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        PDF File
                                    </label>
                                    <input
                                        id="file"
                                        name="file"
                                        type="file"
                                        accept="application/pdf"
                                        className="w-full p-2 border rounded-md shadow-sm focus:outline-none"
                                        required
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className={`w-full md:w-auto rounded-full ${loading ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                    disabled={loading}
                                >
                                    {loading ? "Submitting..." : "Submit"}
                                </Button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Dashboardlayout>
    );
};

export default Approval;
