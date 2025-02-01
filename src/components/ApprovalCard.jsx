import { useState, useEffect } from "react";
import { FaCheckCircle, FaEye } from "react-icons/fa";
import axiosInstance from "@/utils/http";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { AnimatePresence, motion } from "framer-motion";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "./ui/alert-dialog";
import { Player } from "@lottiefiles/react-lottie-player";
import Loader from "./Loader";

const base_URL = import.meta.env.VITE_APP_API_URL;

const ApprovalCard = ({ searchQuery }) => {
    const [approvals, setApprovals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [roles, setRoles] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentApprovalId, setCurrentApprovalId] = useState(null);
    const [approvalEmail, setApprovalEmail] = useState(""); // new state for email input
    const [userRole, setUserRole] = useState("");
    const [refetchData, setRefetchData] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const storedUser = localStorage.getItem("user");
    const userObject = storedUser ? JSON.parse(storedUser) : null;

    useEffect(() => {
        if (storedUser) {
            setUserRole(userObject?.role || "");
        }
    }, [storedUser, userObject]);

    useEffect(() => {
        const fetchApprovals = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(`${base_URL}/approvals`, {
                    headers: { "Content-Type": "application/json" },
                });
                setApprovals(response.data.data || []);
            } catch (error) {
                setError("Error fetching approvals");
                toast.error("Error fetching approvals");
            } finally {
                setLoading(false);
            }
        };

        const fetchSpecificApprovals = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(`${base_URL}/approvals`, {
                    headers: { "Content-Type": "application/json" },
                });
                setApprovals(response.data.data || []);
            } catch (error) {
                setError("Error fetching approvals");
                toast.error("Error fetching approvals");
            } finally {
                setLoading(false);
            }
        };

        const fetchRoles = async () => {
            try {
                const response = await axiosInstance.get(`${base_URL}/auth/roles`, {
                    headers: { "Content-Type": "application/json" },
                });
                setRoles(response.data || []);
            } catch (error) {
                setError("Error fetching roles");
                toast.error("Error fetching roles");
            }
        };

        const initializeData = async () => {
            if (userRole.toLocaleLowerCase() === "establishment") {
                await fetchApprovals();
                await fetchRoles();
            } else {
                await fetchSpecificApprovals();
                await fetchRoles();
            }
        };

        initializeData();
    }, [refetchData, userRole]);

    const openPdf = (pdfUrl) => {
        if (pdfUrl) {
            window.open(pdfUrl, "_blank");
        } else {
            toast.error("No PDF URL available");
        }
    };

    const deleteApproval = async (approvalId) => {
        try {
            const response = await axiosInstance.delete(`${base_URL}/approval/${approvalId}`, {
                headers: { "Content-Type": "application/json" },
            });

            if (response.status === 200) {
                setApprovals((prevApprovals) =>
                    prevApprovals.filter((approval) => approval._id !== approvalId)
                );
                toast.success("Approval deleted successfully");
                setRefetchData((prev) => !prev);
            }
        } catch (error) {
            console.error("Error deleting approval:", error);
            toast.error("Failed to delete approval. Please try again.");
        }
    };

    // Existing sendApproval function for role-based sending
    const sendApproval = async (approvalId) => {
        if (selectedUsers.length === 0) {
            toast.error("Please select at least one user.");
            return;
        }

        try {
            const payload = {
                approvalId,
                userIds: selectedUsers,
            };

            const response = await axiosInstance.post(`${base_URL}/approval/send`, payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });

            if (response.status === 200) {
                toast.success("Approval sent successfully!");
                setRefetchData((prev) => !prev);
            }
        } catch (error) {
            console.error("Error sending approval:", error);
            toast.error("Failed to send approval. Please try again.");
        } finally {
            setIsModalOpen(false);
            setSelectedUsers([]);
        }
    };

    // New function to send the approval document URL via email using the new route.
    const sendApprovalByEmail = async (approvalId) => {
        if (!approvalEmail) {
            toast.error("Please enter an email address.");
            return;
        }

        // Find the current approval to get its document URL
        const currentApproval = approvals.find((approval) => approval._id === approvalId);
        if (!currentApproval || !currentApproval.pdfUrl) {
            toast.error("Approval document URL not found.");
            return;
        }

        try {
            const payload = {
                email: approvalEmail,
                Url: currentApproval.pdfUrl,
            };

            const response = await axiosInstance.post(`${base_URL}/approval/send-other`, payload, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                toast.success("Approval document sent successfully via email!");
                setRefetchData((prev) => !prev);
            }
        } catch (error) {
            console.error("Error sending approval document via email:", error);
            toast.error("Failed to send document. Please try again.");
        } finally {
            setIsModalOpen(false);
            setApprovalEmail("");
        }
    };

    const handleUserSelection = (userId) => {
        setSelectedUsers((prevSelected) =>
            prevSelected.includes(userId)
                ? prevSelected.filter((id) => id !== userId)
                : [...prevSelected, userId]
        );
    };

    const filteredApprovals = approvals.filter((approval) =>
        approval.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const handleCheckboxChange = () => {
        setIsChecked((prev) => !prev);
    };

    return (
        <div className="p-8">
            {loading ? (
                <Loader width={500} height={500} />
            ) : error ? (
                <p className="text-red-600">{error}</p>
            ) : filteredApprovals.length === 0 ? (
                <div className="flex flex-col items-center justify-center w-[100vw] h-screen ">
                    <Player
                        autoplay
                        loop
                        src="https://lottie.host/7881658b-10eb-4e1d-9424-661cf3bb1665/xne07bwaFH.json" // Lottie animation URL
                        style={{ height: "300px", width: "300px" }}
                    />
                    <p className="text-xl font-semibold mt-4">Please add an application.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredApprovals.map((approval) => (
                        <div key={approval._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900">{approval.title}</h3>
                                <div className="flex items-center space-x-2 mt-2">
                                    <button
                                        onClick={() => openPdf(approval.pdfUrl)}
                                        className="text-blue-600 flex justify-center items-center gap-2 hover:text-blue-800"
                                    >
                                        <FaEye size={20} /> View Approval
                                    </button>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                    Created on: {new Date(approval.createdAt).toLocaleDateString()}
                                </p>
                                <div className="mt-4 flex space-x-4 items-center">
                                    {approval.sended && userRole.toLocaleLowerCase() === "establishment" ? (
                                        <div className="flex items-center gap-2">
                                            <FaCheckCircle className="text-green-500" size={20} />
                                            <span className="text-green-600 font-medium">Approval Sent</span>
                                        </div>
                                    ) : (
                                        <>
                                            {userRole.toLocaleLowerCase() === "establishment" && (
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="destructive" className="rounded-full">
                                                            Delete
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete Approval</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to delete this approval? This action cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                className="bg-red-500 hover:bg-red-600 text-white rounded-full px-4 py-2"
                                                                onClick={() => deleteApproval(approval._id)}
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            )}
                                            {userRole.toLocaleLowerCase() === "establishment" && (
                                                <Button
                                                    onClick={() => {
                                                        setIsModalOpen(true);
                                                        setCurrentApprovalId(approval._id);
                                                    }}
                                                    className="rounded-full"
                                                >
                                                    Send
                                                </Button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[40vw] overflow-auto">
                        <h2 className="text-xl font-bold mb-4">Send Approval</h2>
                        <div className="mb-4">
                            <p className="text-lg mb-2">Select Users:</p>
                            <div className="space-y-2 h-48 overflow-auto">
                                {roles.length > 0 ? (
                                    roles.map((role) => (
                                        <div key={role.id} className="flex gap-3 items-center">
                                            <Checkbox
                                                id={role.id}
                                                checked={selectedUsers.includes(role.id)}
                                                onCheckedChange={() => handleUserSelection(role.id)}
                                            />
                                            <label htmlFor={role.id} className="text-lg">
                                                {role.role}
                                            </label>
                                        </div>
                                    ))
                                ) : (
                                    <p>No roles available</p>
                                )}
                            </div>
                        </div>

                        {/* New Input Field for Email Approval */}

                        <div className="flex justify-start items-center gap-2">
                            <Checkbox
                                id="others"
                                checked={isChecked}
                                onCheckedChange={setIsChecked}
                            />
                            <label htmlFor="others" className="cursor-pointer text-lg">Others</label>
                        </div>


                        <AnimatePresence>
                            {isChecked && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                >
                                    <div className="mb-4 mt-2">
                                        <label htmlFor="approvalEmail" className="block text-lg font-medium mb-1">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="approvalEmail"
                                            value={approvalEmail}
                                            onChange={(e) => setApprovalEmail(e.target.value)}
                                            placeholder="Enter email to send document URL"
                                            className="w-full border rounded px-3 py-2 transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>


                        <div className="flex justify-end space-x-4">
                            <Button
                                variant="outline"
                                onClick={() => setIsModalOpen(false)}
                                className="rounded-full"
                            >
                                Cancel
                            </Button>
                            {/* Button for role-based approval sending */}
                            <Button
                                onClick={() => sendApproval(currentApprovalId)}
                                className="rounded-full"
                            >
                                Send to Selected Roles
                            </Button>
                            {/* Button for sending approval document via email */}
                            <Button
                                onClick={() => sendApprovalByEmail(currentApprovalId)}
                                className="rounded-full"
                            >
                                Send via Email
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApprovalCard;
