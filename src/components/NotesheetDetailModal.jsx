/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";  // Reuse the button component
import { AiOutlineClose } from 'react-icons/ai';
import RoleSelectionModal from './RoleSelectionModal';

// eslint-disable-next-line react/prop-types
const NotesheetDetailModal = ({ isOpen, onClose, notesheet, userRole, storedToken }) => {
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [rolesData, setRolesData] = useState([]); // State to store roles and comments
    const [isRoleModalOpen, setRoleModalOpen] = useState(false);
    const [commentsUpdated, setCommentsUpdated] = useState(false); // Track if comments are updated
    const base_URL = import.meta.env.VITE_APP_API_URL;
    // eslint-disable-next-line react/prop-types
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(
                    `${base_URL}/notesheet/comments/${notesheet._id}`,
                    {
                        headers: {
                            'Authorization': `${storedToken}`,
                        },
                    }
                );
                console.log(response.data); // This will log the response data
                setRolesData(response.data.comments); // Store comments in state
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        if (notesheet?._id && isOpen) {
            fetchComments();
        }
    }, [notesheet?._id, storedToken, commentsUpdated]); // Trigger refetch when commentsUpdated changes

    // Add Comment
    const handleAddComment = async () => {
        if (!comment) {
            return;
        }

        setLoading(true);
        try {
            // Create FormData to send as multipart/form-data
            const formData = new FormData();
            formData.append('role', userRole);
            formData.append('comment', comment);

            const response = await axios.post(
                `${base_URL}/notesheet/add-comment/${notesheet._id}`,
                formData,
                {
                    headers: {
                        'Authorization': `${storedToken}`,
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );

            setSuccessMessage('Comment added successfully!');
            setComment('');
            setRolesData(prevData => [...prevData, response.data.comment]); // Update rolesData with the new comment
            setTimeout(() => {
                setSuccessMessage(null);
            }, 2000);
            // Trigger refetch after adding the comment
            setCommentsUpdated(prev => !prev); // Toggle to trigger useEffect
        } catch (error) {
            console.error('Error adding comment:', error);
            setSuccessMessage('Failed to add comment.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const handleSendClick = () => {
        setRoleModalOpen(true); // Open the RoleSelectionModal when 'Send' is clicked
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[60vw]">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold mb-4">Notesheet Details</h2>
                    <AiOutlineClose className="text-2xl cursor-pointer" onClick={onClose} />
                </div>

                <div className="flex space-x-8">
                    {/* Notesheet Details */}
                    <div className="w-1/2 mb-4">
                        <p><strong>Subject:</strong> {notesheet?.subject}</p>
                        <p><strong>Description:</strong> {notesheet?.description}</p>
                        <p><strong>Status:</strong> {notesheet?.status}</p>
                        <p><strong>Flow Status:</strong> {notesheet?.flowStatus}</p>
                        <p><strong>Created by:</strong> {notesheet?.userName}</p>
                        <p><strong>Email:</strong> {notesheet?.email}</p>
                        <p><strong>Contact Number:</strong> {notesheet?.contact_number}</p>
                        <p><strong>Created at:</strong> {new Date(notesheet?.timestamps.createdAt).toLocaleString()}</p>



                    </div>

                    {/* Comments Section */}
                    <div className="w-1/2 mt-4 h-72 overflow-y-auto p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <h3 className="text-xl font-bold mb-2">Comments:</h3>
                        {rolesData.length > 0 ? (
                            rolesData.map((commentData) => (
                                commentData ? (  // Defensive check to ensure commentData is not undefined
                                    <div key={commentData._id} className="p-4 border border-gray-200 rounded-lg bg-white shadow-md mb-4">
                                        <p className="font-medium">{commentData.user || 'Unknown User'}:</p> {/* Fallback if 'user' is missing */}
                                        <p className="text-gray-700">{commentData.comment}</p>
                                        <p className="text-sm text-gray-500">{new Date(commentData.timestamp).toLocaleString()}</p>
                                    </div>
                                ) : null // Skip rendering if commentData is undefined
                            ))
                        ) : (
                            <p>No comments available.</p>
                        )}

                    </div>
                </div>

                <div className="mb-4">
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

                {successMessage && <p className="text-green-500 mb-2">{successMessage}</p>}

                <div className="mt-6 flex justify-between">
                    <Button onClick={handleAddComment} disabled={loading}>
                        {loading ? 'Adding...' : 'Add Comment'}
                    </Button>

                    {/* Send Button */}
                    <Button onClick={handleSendClick}>Send</Button>
                </div>

            </div>
            <RoleSelectionModal
                isOpen={isRoleModalOpen}
                onClose={() => setRoleModalOpen(false)}
                notesheet={notesheet}
                storedToken={storedToken}
            />
        </div>
    );
};

export default NotesheetDetailModal;
