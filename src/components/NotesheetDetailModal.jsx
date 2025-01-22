/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { AiOutlineClose } from 'react-icons/ai';
import RoleSelectionModal from './RoleSelectionModal';
import { addComment, fetchComments } from '@/constant/notesheetAPI';
import { toast } from 'react-toastify';
import FullScreenImageViewer from './FullScreenImageViewer ';

const NotesheetDetailModal = ({ isOpen, onClose, notesheet, userRole, storedToken, refetchData, status }) => {
    const [comment, setComment] = useState('');
    const [file, setFile] = useState(null); // State for file
    const [loading, setLoading] = useState(false);
    const [rolesData, setRolesData] = useState([]);
    const [isRoleModalOpen, setRoleModalOpen] = useState(false);
    const [commentsUpdated, setCommentsUpdated] = useState(false);
    console.log("this is user role id", userRole)
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


    if (!isOpen) return null;

    const handleSendClick = () => {
        setRoleModalOpen(true);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]); // Set selected file
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[60vw]">
                <div className="flex justify-between mb-4 items-center">
                    <h2 className="text-2xl font-bold ">Notesheet Details</h2>
                    <AiOutlineClose className="text-2xl cursor-pointer" onClick={onClose} />
                </div>

                <div className="flex space-x-8">
                    <div className="w-1/2 mb-4">
                        <p><strong>Subject:</strong> {notesheet?.subject}</p>
                        <p><strong>Description:</strong> {notesheet?.description}</p>
                        <p><strong>Application User:</strong> {notesheet?.userName}</p>
                        <p><strong>Email:</strong> {notesheet?.email}</p>
                        <p><strong>Contact Number:</strong> {notesheet?.contact_number}</p>
                        <p><strong>Created at:</strong> {new Date(notesheet?.timestamps.createdAt).toLocaleString()}</p>
                        {notesheet?.image && (
                            <div>
                                <FullScreenImageViewer imageUrl={notesheet?.image} />
                            </div>
                        )}
                    </div>

                    <div className="w-1/2 mt-4 h-72 overflow-y-auto p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <h3 className="text-xl font-bold mb-2">Comments:</h3>
                        {rolesData.length > 0 ? (
                            rolesData.map((commentData) => (
                                commentData ? (
                                    <div key={commentData._id} className="p-4 border border-gray-200 rounded-lg bg-white shadow-md mb-4">
                                        <p className="font-medium">{commentData.user || 'Unknown User'}:</p>
                                        <p className="text-gray-700">{commentData.comment}</p>
                                        {commentData.document && (
                                            <a
                                                href={commentData.document}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 underline"
                                            >
                                                View Uploaded File
                                            </a>
                                        )}
                                        <p className="text-sm text-gray-500">{new Date(commentData.timestamp).toLocaleString()}</p>
                                    </div>
                                ) : null
                            ))
                        ) : (
                            <p>No comments available.</p>
                        )}
                    </div>
                </div>
                {status !== "In Progress" && (
                    <>
                        <div className="mb-2">
                            <label htmlFor="comment" className="block text-gray-700 font-bold mb-2">Add a Comment</label>
                            <textarea
                                id="comment"
                                name="comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="shadow appearance-none bg-transparent border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                rows={4}
                            />
                        </div>
                        {userRole.toLowerCase() === 'establishment' && (
                            <div className="mb-2">
                                <label htmlFor="file" className="block text-lg font-semibold text-gray-800 mb-3">Upload File</label>

                                <div className="flex items-center justify-center w-full bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 py-2 px-6 hover:border-blue-500 hover:bg-gray-50 transition-all duration-300">
                                    <input
                                        id="file"
                                        type="file"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept=".pdf"  // Restrict to PDF files
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





                        <div className="mt-6 flex justify-between">
                            <div className="flex justify-between w-full">
                                <Button onClick={handleAddComment} disabled={loading}>
                                    {loading ? 'Adding...' : 'Add Comment'}
                                </Button>
                                <Button onClick={handleSendClick}>Send</Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <RoleSelectionModal
                userRole={userRole}
                isOpen={isRoleModalOpen}
                onClose={() => setRoleModalOpen(false)}
                notesheet={notesheet}
                storedToken={storedToken}
                closeParentModal={onClose}
                refetchData={refetchData}
            />
        </div>
    );
};

export default NotesheetDetailModal;
