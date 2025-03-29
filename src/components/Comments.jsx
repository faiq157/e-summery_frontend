/* eslint-disable react/prop-types */

import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import Loader from './Loader';
import { FaSpinner } from 'react-icons/fa';

const CommentsSection = ({ rolesData }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true); // Add loading state
    const [filteredComments, setFilteredComments] = useState([]);

    useEffect(() => {
        // Simulate fetching comments
        const fetchComments = async () => {
            setLoading(true);
            // Simulate a delay for fetching
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setFilteredComments(rolesData);
            setLoading(false);
        };

        fetchComments();
    }, [rolesData]);

    const handleSearch = (query) => {
        setSearchQuery(query);
        setFilteredComments(
            rolesData.filter((commentData) =>
                commentData?.comment?.toLowerCase().includes(query.toLowerCase()) ||
                (commentData?.user && commentData?.user.toLowerCase().includes(query.toLowerCase()))
            )
        );
    };

    return (
        <div className="w-full sm:w-[80%] md:w-[50%] h-[20rem], sm:h-[25rem], and lg:h-[30rem] overflow-y-auto">
            <div className="sticky top-0 z-10 bg-white">
                <Input
                    placeholder="Search comments..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full focus:outline-none outline-none bg-transparent border border-gray-300 rounded-md p-2"
                />
            </div>

            <h3 className="text-2xl font-semibold text-gray-800 m-4">Comments</h3>

            {loading ? (
                <div className="flex justify-center items-center h-full">
                <FaSpinner className="animate-spin  text-black" size={24} />
                </div>
            ) : filteredComments.length > 0 ? (
                filteredComments
                    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                    .map((commentData) => (
                        commentData ? (
                            <div key={commentData._id} className="flex flex-col m-2">
                                <div className="flex items-start space-x-3">
                                    <div className="flex-1 shadow-lg rounded p-2">
                                        <div className="mb-2">
                                            <span className="font-semibold bg-blue-200 p-2 rounded-full">
                                                {`${commentData.user || 'Unknown User'} :`}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="flex flex-col">
                                                {commentData.comment}
                                                {commentData.document && (() => {
                                                    const byteCharacters = atob(commentData.document.split(",")[1]); // Decode Base64
                                                    const byteNumbers = new Uint8Array(byteCharacters.length);
                                                    for (let i = 0; i < byteCharacters.length; i++) {
                                                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                                                    }
                                                    const blob = new Blob([byteNumbers], { type: "application/pdf" });
                                                    const blobUrl = URL.createObjectURL(blob);

                                                    return (
                                                        <a
                                                            href={blobUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="mt-3 inline-flex items-center gap-2 text-blue-600 text-sm font-medium hover:text-blue-700 transition-all duration-200"
                                                        >
                                                            📄 View Notesheet File
                                                        </a>
                                                    );
                                                })()}
                                            </div>
                                            <p className="text-xs flex justify-end text-gray-500 mt-1">
                                                {new Date(commentData.timestamp).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null
                    ))
            ) : (
                <p className="text-gray-500">No comments available.</p>
            )}
        </div>
    );
};

export default CommentsSection;