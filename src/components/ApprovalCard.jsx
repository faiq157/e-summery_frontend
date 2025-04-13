import { useState, useEffect } from "react";
import { FaCheckCircle, FaEye } from "react-icons/fa";
import axiosInstance from "@/utils/http";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { AnimatePresence, motion } from "framer-motion";
import { Player } from "@lottiefiles/react-lottie-player";
import Loader from "./Loader";
import { DataTable } from "./DataTable/Data-Table";
import { ApprovalData } from "./DataTable/columns";
import ViewNotificationTemplate from "./ViewApproval";
import { useModal } from "@/context/ModalContext";
import { AiOutlineClose } from "react-icons/ai";
import ApprovalTabs from "./ApprovalTabs";
import NotificationTemplate from "./CreateApproval";
import { set } from "lodash";
import { useApprovalAccess } from "@/context/ApprovalAccessContext";
import { Mail, MailCheck, Send } from "lucide-react";

const base_URL = import.meta.env.VITE_APP_API_URL;

const ApprovalCard = ({ searchQuery }) => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roles, setRoles] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentApprovalId, setCurrentApprovalId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [approvalEmail, setApprovalEmail] = useState(""); // new state for email input

  const [refetchData, setRefetchData] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); // state for view modal visibility
  const [isSendModalOpen, setIsSendModalOpen] = useState(false); // state for send modal visibility
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const storedUser = localStorage.getItem("user");
  const userObject = storedUser ? JSON.parse(storedUser) : null;
    const { hasAccess ,userRole,approvalAccessData } = useApprovalAccess();
    const [showRadioList, setShowRadioList] = useState(true); // State to toggle radio button list
    const [showCheckboxList, setShowCheckboxList] = useState(false); // State to toggle checkbox list
    
    const handleToggleRadioList = () => {
      setShowRadioList(true);
      setShowCheckboxList(false); // Hide checkbox list when radio list is shown
    };
    
    const handleToggleCheckboxList = () => {
      setShowCheckboxList(true);
      setShowRadioList(false); // Hide radio list when checkbox list is shown
    };

  const userId = userObject?._id;

  const handleRowClick = (approvalId) => {
    setCurrentApprovalId(approvalId);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (approvalId) => {
    const selectedApproval = approvals.find((approval) => approval._id === approvalId);
    setEditData(selectedApproval);
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`${base_URL}/approvals/user/${userId}`, {
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
        const response = await axiosInstance.get(`${base_URL}/approvals/${userId}`, {
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
      if (hasAccess) {
        await fetchApprovals();
      } else {
        await fetchSpecificApprovals();
      }
      await fetchRoles();
    };
    

    if (userRole) {
      initializeData();
    }
  }, [refetchData, userRole]);

  const triggerAlertDialog = (approvalId) => {
    setCurrentApprovalId(approvalId);
    setIsSendModalOpen(true);
  };

  const HandledeleteApproval = async (approvalId) => {
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

  const sendApproval = async (approvalId) => {
    if (selectedUsers.length === 0) {
      toast.error("Please select at least one user.");
      return;
    }
    const roles = selectedUsers.map((user) => user.role);
    console.log("roles", roles);

    try {
      const payload = {
        approvalId,
        userIds: selectedUsers,
        selectedRole,
      };

      const response = await axiosInstance.post(`${base_URL}/approval/send`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (response.status === 200) {
        toast.success("Approval sent successfully!");

        // Call the additional API if more than one user is selected
        if (selectedUsers.length > 1) {
          await axiosInstance.put(`${base_URL}/approval`, { approvalId }, {
            headers: {
              "Content-Type": "application/json",
            },
          });
        }

        setRefetchData((prev) => !prev);
      }
    } catch (error) {
      console.error("Error sending approval:", error);
      toast.error("Failed to send approval. Please try again.");
    } finally {
      setIsSendModalOpen(false);
      setSelectedUsers([]);
    }
  };

  const sendApprovalByEmail = async (approvalId) => {
    if (!approvalEmail) {
      toast.error("Please enter an email address.");
      return;
    }

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
      setIsSendModalOpen(false);
      setApprovalEmail("");
    }
  };

  const handleUserSelection = (userId, userselectedRole) => {
    setSelectedRole(userselectedRole);
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const filteredApprovals = approvals.filter((approval) =>
    approval?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  const handleCheckboxChange = () => {
    setIsChecked((prev) => !prev);
  };


  return (
    <div className="p-8">
      {hasAccess ? (
        <ApprovalTabs
          approvals={filteredApprovals}
          loading={loading}
          error={error}
          handleRowClick={handleRowClick}
          triggerAlertDialog={triggerAlertDialog}
          HandledeleteApproval={HandledeleteApproval}
          userRole={userRole}
          handleEditClick={handleEditClick}
        />
      ) : (
        <div className="">
          {loading ? (
            <Loader width={500} height={500} />
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : filteredApprovals.length === 0 ? (
            <div className="flex flex-col items-center justify-center w-[100vw] h-screen ">
              <Player
                autoplay
                loop
                src="https://lottie.host/7881658b-10eb-4e1d-9424-661cf3bb1665/xne07bwaFH.json"
                style={{ height: "300px", width: "300px" }}
              />
              <p className="text-xl font-semibold mt-4">Please add an application.</p>
            </div>
          ) : (
            <DataTable
              columns={ApprovalData(triggerAlertDialog, HandledeleteApproval, userRole)}
              data={filteredApprovals}
              onRowClick={handleRowClick}
            />
          )}
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg no-scrollbar w-[60%] h-[80%] overflow-auto">
            <div className="flex justify-end mr-3">
              <AiOutlineClose className="text-2xl cursor-pointer" onClick={() => setIsEditModalOpen(false)} />
            </div>
            <NotificationTemplate
              existingData={editData} // Pass existing data
              closeModal={() => setIsEditModalOpen(false)}
              userRole={userRole}
            />
          </div>
        </div>
      )}

      {isViewModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg no-scrollbar w-[60%] h-[80%] overflow-auto">
            <div className="flex justify-end mr-3">
              <AiOutlineClose className="text-2xl cursor-pointer" onClick={() => setIsViewModalOpen(false)} />
            </div>
            <ViewNotificationTemplate userID={userId} refetchData={currentApprovalId} userRole={userRole} />
          </div>
        </div>
      )}

      {isSendModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded w-[50vw] overflow-auto no-scrollbar">
            <div className="flex mb-3 justify-between ">
            <div className="flex items-center  gap-3">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <Send className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Send Notification</h3>
                  
                  </div>
                </div>
              <AiOutlineClose className="text-2xl cursor-pointer" onClick={() => setIsSendModalOpen(false)} />
            </div>
            <div className="mb-4">
  {/* Toggle Checkboxes */}
  <div className="flex gap-4 m-5 items-center">
  <button
    className={`px-4 py-2 rounded-lg border ${
      showRadioList
        ? "border-indigo-500 bg-indigo-50/50 text-indigo-600"
        : "border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/30"
    }`}
    onClick={handleToggleRadioList}
  >
    <div className="flex items-center gap-2">
      <Mail className={`w-5 h-5 ${showRadioList ? "text-blue-600" : "text-gray-600"}`} />
      <div>
        <p className="font-semibold">Draft Notification</p>
        <p className="text-sm text-gray-500">Send as draft first</p>
      </div>
    </div>
  </button>

  <button
    className={`px-4 py-2 rounded-lg border ${
      showCheckboxList
        ? "border-indigo-500 bg-indigo-50/50 text-indigo-600"
        : "border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/30"
    }`}
    onClick={handleToggleCheckboxList}
  >
    <div className="flex items-center gap-2">
      <MailCheck className={`w-5 h-5 ${showCheckboxList ? "text-blue-600" : "text-gray-600"}`} />
      <div>
        <p className="font-semibold">Final Notification</p>
        <p className="text-sm text-gray-500">Send as final version</p>
      </div>
    </div>
  </button>
</div>

  {/* Radio Button List */}
  {showRadioList && (
    <div className="space-y-2 h-48 overflow-auto">
      {roles.length > 0 ? (
        <>
          {roles
            .filter((role) => approvalAccessData.includes(role.role))
            .map((role) => (
              <div key={role.id} className="flex gap-3 items-center">
                <input
                  type="radio"
                  id={role.id}
                  name="roleSelection"
                  value={role.id}
                  checked={selectedUsers.includes(role.id)}
                  onChange={() => setSelectedUsers([role.id], handleUserSelection(role.id, role.role))}
                />
                <label htmlFor={role.id} className="text-lg cursor-pointer">
                  {role.role}
                </label>
              </div>
            ))}
        </>
      ) : (
        <p>No roles available</p>
      )}
    </div>
  )}

  {/* Checkbox List */}
  {showCheckboxList && (
    <div className="space-y-2 h-48 overflow-auto">
      {roles.length > 0 ? (
        <>
          {roles.map((role) => (
            <div key={role.id} className="flex gap-3 items-center">
              <Checkbox
                id={role.id}
                checked={selectedUsers.includes(role.id)}
                onCheckedChange={() =>
                  setSelectedUsers((prevSelected) =>
                    prevSelected.includes(role.id)
                      ? prevSelected.filter((id) => id !== role.id)
                      : [...prevSelected, role.id]
                  )
                }
              />
              <label htmlFor={role.id} className="text-lg">
                {role.role}
              </label>
            </div>
          ))}
        </>
      ) : (
        <p>No roles available</p>
      )}
    </div>
  )}
</div>

            {/* {userRole.toLowerCase() !== "registrar" && (
              <>
                <div className="flex justify-start items-center gap-2">
                  <Checkbox
                    id="others"
                    checked={isChecked}
                    onCheckedChange={handleCheckboxChange}
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
              </>
            )} */}

            <div className="flex justify-end space-x-4">
              <Button onClick={() => sendApproval(currentApprovalId)} className="rounded-full">
                Send to Selected Roles
              </Button>
              {/* {userRole.toLowerCase() !== "registrar" && (
                <Button onClick={() => sendApprovalByEmail(currentApprovalId)} className="rounded-full">
                  Send via Email
                </Button>
              )} */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalCard;