/* eslint-disable react/prop-types */
// NotesheetDetailModal.js
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { AiOutlineClose } from 'react-icons/ai';
import RoleSelectionModal from './RoleSelectionModal';
import { addComment, fetchComments } from '@/constant/notesheetAPI';
import { toast } from 'react-toastify';

const NotesheetDetailModal = ({ isOpen, onClose, notesheet, userRole, storedToken, refetchData, status }) => {
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [rolesData, setRolesData] = useState([]);
    const [isRoleModalOpen, setRoleModalOpen] = useState(false);
    const [commentsUpdated, setCommentsUpdated] = useState(false);
    console.log(storedToken)
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
        if (!comment) return;

        setLoading(true);
        try {
            const newComment = await addComment(notesheet._id, comment, userRole, storedToken);

            toast.success('Comment added successfully!');
            setComment('');
            setRolesData(prevData => [...prevData, newComment]);
            setCommentsUpdated(prev => !prev); // Toggle to trigger useEffect

        } catch (error) {
            console.error(error);
            toast.error('Failed to add comment.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const handleSendClick = () => {
        setRoleModalOpen(true);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[60vw]">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold mb-4">Notesheet Details</h2>
                    <AiOutlineClose className="text-2xl cursor-pointer" onClick={onClose} />
                </div>

                <div className="flex space-x-8">
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

                    <div className="w-1/2 mt-4 h-72 overflow-y-auto p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <h3 className="text-xl font-bold mb-2">Comments:</h3>
                        {rolesData.length > 0 ? (
                            rolesData.map((commentData) => (
                                commentData ? (
                                    <div key={commentData._id} className="p-4 border border-gray-200 rounded-lg bg-white shadow-md mb-4">
                                        <p className="font-medium">{commentData.user || 'Unknown User'}:</p>
                                        <p className="text-gray-700">{commentData.comment}</p>
                                        <p className="text-sm text-gray-500">{new Date(commentData.timestamp).toLocaleString()}</p>
                                    </div>
                                ) : null
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

                <div className="mt-6 flex justify-between">


                    {status !== "In Progress" && (
                        <div className='flex justify-between w-full'>
                            <Button onClick={handleAddComment} disabled={loading}>
                                {loading ? 'Adding...' : 'Add Comment'}
                            </Button>
                            <Button onClick={handleSendClick}>Send</Button>
                        </div>
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
                refetchData={refetchData}
            />
        </div>
    );
};

export default NotesheetDetailModal;
