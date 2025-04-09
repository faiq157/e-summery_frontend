/* eslint-disable react/prop-types */

import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import Loader from './Loader';
import { FaSpinner } from 'react-icons/fa';
import { MessageSquare, User } from 'lucide-react';

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
        <div className="w-1/2 flex flex-col h-full">
            <div className='p-6 flex-1 overflow-y-auto'>
            <div className="space-y-4">
            <div className="sticky top-0 z-10 bg-white">
                <Input
                    placeholder="Search comments..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full px-4 py-2 pl-10 pr-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
            </div>
            <div className='flex items-center space-x-2 mb-4'>
            <MessageSquare className="text-blue-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-800">Comments</h3>
            </div>
           <div className='h-[20rem] overflow-y-auto'>
            {loading ? (
                <div className="flex justify-center items-center  ">
                <FaSpinner className="animate-spin  text-black" size={24} />
                </div>
            ) : filteredComments.length > 0 ? (
                filteredComments
                    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                    .map((commentData) => (
                        commentData ? (
                          
                            <div key={commentData._id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100  transition-colors duration-200">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex-1 shadow-lg rounded p-2">           
                              <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                                <User size={16} />
                              </div>
                              <div>
                                <span className="font-semibold text-gray-800"> {`${commentData.user || 'Unknown User'} `}</span>
                            
                              </div>
                            </div>
                            <span className="text-sm text-gray-500">
                            {new Date(commentData.timestamp).toLocaleString()}
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
            
            </div>
            </div>
         
           
        </div>
    );
};

export default CommentsSection;