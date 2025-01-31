/* eslint-disable react/prop-types */

import { useState } from 'react';
import { Input } from './ui/input';

const CommentsSection = ({ rolesData }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredComments = rolesData.filter(commentData =>
        commentData?.comment?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (commentData?.user && commentData?.user.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="w-full sm:w-[80%] md:w-[50%] h-72 overflow-y-auto  ">
            <div className=" sticky top-0 z-10 bg-white ">
                <Input
                    placeholder="Search comments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full focus:outline-none outline-none bg-transparent border border-gray-300 rounded-md p-2"
                />
            </div>


            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Comments</h3>

            {filteredComments.length > 0 ? (
                filteredComments.map((commentData) => (
                    commentData ? (
                        <div key={commentData._id} className="flex flex-col mb-2">
                            <div className="flex items-start space-x-3">
                                <div className="flex-1">
                                    <div className="bg-black w-[30%] text-white px-3 rounded-full py-1 ">{commentData.user || 'Unknown User'}</div>
                                    <div className={`p-4 ml-2  border border-black rounded-lg text-sm max-w-[80%] ${commentData.user ? ' bg-opacity-50 text-black self-end' : 'bg-black bg-opacity-80 text-gray-700 self-start'} shadow-md transition-all duration-300 ease-in-out hover:scale-105`}>
                                        <div className='flex flex-col'>
                                            {commentData.comment}
                                            {commentData.document && (
                                                <a
                                                    href={commentData.document}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mt-2 text-blue-500 text-xs underline"
                                                >
                                                    View Notesheet File
                                                </a>
                                            )}
                                        </div>

                                        <p className="text-xs flex justify-end text-gray-500 mt-1">{new Date(commentData.timestamp).toLocaleString()}</p>
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
