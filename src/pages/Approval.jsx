import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AiOutlineClose } from "react-icons/ai";
import NotesheetCardList from "@/components/NotesheetCardList";
import { useModal } from "@/context/ModalContext";
import Dashboardlayout from "@/layout/Dashboardlayout";
import { toast } from "react-toastify";
import axiosInstance from "@/utils/http";
import ApprovalCard from "@/components/ApprovalCard";
import NotificationTemplate from "@/components/CreateApproval";
import ViewNotificationTemplate from "@/components/ViewApproval";

const Approval = () => {
    const { isModalOpen, openModal, closeModal } = useModal();
    const [storedEmail, setStoredEmail] = useState("");
    const [loading, setLoading] = useState(false); // Loading state
    const storedUser = localStorage.getItem("user");
    const [userRole, setUserRole] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [refetchData, setRefetchData] = useState(false);
    const [userID, setUserID] = useState("");

    useEffect(() => {
        if (storedUser) {
            const userObject = JSON.parse(storedUser);
            setStoredEmail(userObject?.email || "");
            setUserRole(userObject?.role || "");
            setUserID(userObject?._id || "");
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

   
   

    return (
        <Dashboardlayout>
            <div className="p-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left mb-4 md:mb-0">
                        Create Approval
                    </h1>
                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-center">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search notesheets by title..."
                            className="w-full md:w-96 p-2 border rounded-full shadow-sm focus:outline-none"
                        />
                        {userRole.toLocaleLowerCase() === "establishment" && (
                            <Button onClick={openModal} className="w-full md:w-auto rounded-full">
                                Create
                            </Button>
                        )}



                    </div>
                </div>
                <div className="ml-20">
</div>
                {/* Notesheet Cards */}
                <ApprovalCard searchQuery={searchQuery} refetchData={refetchData} isOpenModel={openModal} isClosedModel={closeModal} />

                {/* Modal for Creating Approval */}
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-4 rounded-lg shadow-lg w-[60%] h-[80%] overflow-auto">
                            <div className="flex justify-end mr-4">
                                <AiOutlineClose className="text-2xl cursor-pointer" onClick={closeModal} />
                            </div>
                            {userRole.toLowerCase() === "establishment" && (
                                <NotificationTemplate userRole={userRole} refetchData={refetchData} closeModal={closeModal} />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Dashboardlayout>
    );
};

export default Approval;
