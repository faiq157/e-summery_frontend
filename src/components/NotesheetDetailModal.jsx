/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { AiOutlineClose } from 'react-icons/ai';
import RoleSelectionModal from './RoleSelectionModal';
import { addComment, fetchComments } from '@/constant/notesheetAPI';
import { toast } from 'react-toastify';
import FullScreenImageViewer from './FullScreenImageViewer ';
import axiosInstance from '@/utils/http';

const base_URL = import.meta.env.VITE_APP_API_URL;
import { useNotesheetContext } from '@/context/NotesheetContext';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel
} from "@/components/ui/alert-dialog";
import CommentsSection from './Comments';
import { Calendar, FileText, Mail, Phone, User } from 'lucide-react';
import { useApprovalAccess } from '@/context/ApprovalAccessContext';


const NotesheetDetailModal = ({ isOpen, onClose, notesheet, userRole, storedToken, status }) => {
    const [comment, setComment] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [rolesData, setRolesData] = useState([]);
    const [isRoleModalOpen, setRoleModalOpen] = useState(false);
    const [commentsUpdated, setCommentsUpdated] = useState(false);
    const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);  // state for dialog visibility
    const { fetchNotesheets } = useNotesheetContext();
    const [totalPages, setTotalPages] = useState(1);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
      const { hasAccess  } = useApprovalAccess();
console.log("completed button has access to.",hasAccess)
const handlePreviewClick = () => {
    setIsPreviewOpen(true);
};

const handleClosePreview = () => {
    setIsPreviewOpen(false);
};


    useEffect(() => {
        const loadComments = async () => {
            try {
                const comments = await fetchComments(notesheet._id, storedToken);
                setRolesData(comments);
            } catch (error) {
                console.error(error);
            }
        };

        if (notesheet?._id && isOpen) {
            loadComments();
        }
    }, [notesheet?._id, storedToken, commentsUpdated]);

    const handleComplete = async () => {
        if (!notesheet?._id) {
            toast.error("Notesheet ID is missing.");
            return;
        }

        setLoading(true);
        try {
            const response = await axiosInstance.put(
                `${base_URL}/notesheet/complete/${notesheet._id}`,
                {},
                {
                    headers: {
                        Authorization: ` ${storedToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                toast.success("Notesheet marked as complete!");
                fetchNotesheets(userRole, status, storedToken, 1, 10, setTotalPages);
                onClose();

            } else {
                toast.error("Failed to mark as complete. Please try again.");
            }
        } catch (error) {
            console.error("Error marking notesheet as complete:", error);
            toast.error("An error occurred while marking as complete.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async () => {
        if (!comment && !file) {
            toast.error('Please add a comment or upload a file.');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('comment', comment);
            if (file) {
                formData.append('document', file);
            }
            formData.append('role', userRole);

            console.log("FormData being sent:", Array.from(formData.entries()));

            const newComment = await addComment(notesheet._id, formData, storedToken);

            toast.success('Comment added successfully!');
            setComment('');
            setFile(null);
            setRolesData((prevData) => [...prevData, newComment]);
            setCommentsUpdated((prev) => !prev);
        } catch (error) {
            console.error("Error adding comment:", error);
            toast.error('Failed to add comment.');
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteConfirmation = () => {
        setIsCompleteDialogOpen(true);
    };

    const handleCompleteClose = () => {
        setIsCompleteDialogOpen(false);
        fetchNotesheets(userRole, status, storedToken, 1, 10);
    };

    if (!isOpen) return null;

    const handleSendClick = () => {
        setRoleModalOpen(true);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl   overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b bg-gray-50">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="text-blue-600" size={24} />
                Notesheet Details
              </h2>
              <AiOutlineClose className="text-2xl cursor-pointer" onClick={onClose} />
            </div>

                <div className=" flex  ">
  <div className="w-1/2 mb-4 space-y-2 bg-blue-50 p-4 m-4  rounded-lg">
  <h3 className="text-lg font-semibold text-blue-800 mb-4">
                      Subject: {notesheet?.subject}
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <User className="text-blue-600" size={20} />
                        <div>
                          <p className="text-sm text-gray-600">Application User</p>
                          <p className="text-gray-800 font-medium">{notesheet?.userName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="text-blue-600" size={20} />
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="text-gray-800 font-medium">{notesheet?.userEmail}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="text-blue-600" size={20} />
                        <div>
                          <p className="text-sm text-gray-600">Contact Number</p>
                          <p className="text-gray-800 font-medium">{notesheet?.contact_number}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="text-blue-600" size={20} />
                        <div>
                          <p className="text-sm text-gray-600">Created at</p>
                          <p className="text-gray-800 font-medium">{new Date(notesheet?.timestamps.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

    {/* Conditional Rendering */}
    {notesheet?.image ? (
      <div className="relative">
        <FullScreenImageViewer imageUrl={notesheet?.image} />
      </div>
    ) : notesheet?.description ? (
      <div className="max-h-32 ">
                {isPreviewOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-[80vw] h-[60vh] md:h-[70vh] lg:h-[80vh] ">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Application Preview</h2>
                        <AiOutlineClose className="text-2xl cursor-pointer" onClick={handleClosePreview} />
                    </div>
                    <div>
                    <strong>{`Subject: ${notesheet?.subject}`}</strong>
                    <p className='whitespace-pre-wrap mt-2'>{notesheet?.description}</p>
                    </div>
                   
                </div>
            </div>
        )}

        {notesheet?.description && (
         <Button
         className="rounded-full"
         onClick={handlePreviewClick}
     >
        View Application
     </Button>
     
        )}
      </div>
    ) : (
      <p>No description or image available.</p>
    )}
  </div>

  <CommentsSection rolesData={rolesData} />
</div>
                <div className=" mb-4 p-4 bg-gray-50 rounded-lg">
                {status !== "In Progress" && status !== "Completed" && (
                    <>
                        <div className={`grid ${hasAccess ? "grid-cols-2" : "grid-cols-1"} gap-2`}>
                            <div className="mt-3 relative">
                                <label htmlFor="comment" className="block text-gray-700 font-bold mb-2">Add a Comment</label>
                                <textarea
                                    id="comment"
                                    name="comment"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                                    rows={3}
                                    required
                                />
                            </div>

                            {hasAccess && (
                                <div className="mt-3">
                                    <label htmlFor="file" className="block text-lg font-semibold text-gray-800 mb-1">Upload File</label>
                                    <div className="flex items-center justify-center w-full bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 py-3 px-6 hover:border-blue-500 hover:bg-gray-50 transition-all duration-300">
                                        <input
                                            id="file"
                                            type="file"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            accept=".pdf"
                                        />
                                        <label
                                            htmlFor="file"
                                            className="cursor-pointer text-center text-gray-600 font-medium text-sm">
                                            <span className="block mb-2">Drag & Drop your file here</span>
                                            <span className="text-blue-500 underline">or click to browse</span>
                                        </label>
                                    </div>

                                    {file && (
                                        <div className="mt-4 text-sm text-gray-600">
                                            <p className="font-medium">Selected File:</p>
                                            <p>{file.name}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="mt-4 flex justify-between">
                            <div className="flex justify-between w-full">
                                <Button className="rounded-full" onClick={handleAddComment} disabled={loading}>
                                    {loading ? 'Adding...' : 'Add Comment'}
                                </Button>
                                <div className='flex gap-4'>
                                    <Button className="rounded-full" onClick={handleSendClick}>Send</Button>
                                    {
                                        hasAccess && status !== "New" && (
                                            <AlertDialog>
                                                <AlertDialogTrigger>
                                                    <Button
                                                        className="bg-green-500 rounded-full"
                                                        disabled={loading}
                                                        onClick={handleCompleteConfirmation}
                                                    >
                                                        {loading ? 'Completing...' : 'Mark as Complete'}
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action will mark the notesheet as complete.
                                                    </AlertDialogDescription>
                                                    <div className='flex justify-end space-x-2'>
                                                        <AlertDialogCancel onClick={handleCompleteClose}>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={handleComplete}>Yes, Mark as Complete</AlertDialogAction>

                                                    </div>

                                                </AlertDialogContent>
                                            </AlertDialog>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </>
                )}
                </div>
            </div>
            <RoleSelectionModal
                userRole={userRole}
                isOpen={isRoleModalOpen}
                onClose={() => setRoleModalOpen(false)}
                notesheet={notesheet}
                storedToken={storedToken}
                closeParentModal={onClose}
                status={status}
            />
        </div>
    );
};

export default NotesheetDetailModal;
