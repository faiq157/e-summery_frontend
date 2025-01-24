import React, { useState } from 'react';
import { AiOutlineClose, AiOutlineEye, AiOutlineDownload } from 'react-icons/ai';
import { Button } from './ui/button';

const FullScreenImageViewer = ({ imageUrl }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Handle opening the modal
    const handleImageClick = () => {
        setIsModalOpen(true);
    };

    // Handle closing the modal
    const handleClose = () => {
        setIsModalOpen(false);
    };

    return (
        <div className='mt-4'>
            {/* Thumbnail image with hover effect */}
            <Button onClick={handleImageClick} >View Attachment</Button>

            {/* Full-screen modal for the image */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                    <div className="relative max-w-full max-h-full">
                        <img
                            src={imageUrl}
                            alt="Full Screen"
                            className="max-w-[90%] max-h-[90%] object-contain"
                            onError={(e) => {
                                e.target.style.display = "none";
                                const fallbackText = document.createElement("div");
                                fallbackText.textContent = "Your image is not available";
                                fallbackText.className = "text-white text-lg text-center";
                                e.target.parentNode.appendChild(fallbackText);
                            }}
                        />

                        {/* Close button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-2 right-2 text-white text-3xl"
                        >
                            <AiOutlineClose />
                        </button>

                        {/* Download button */}
                        <a
                            href={imageUrl}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute top-2 left-2 bg-blue-500 text-white py-2 px-4 rounded-md flex items-center"
                        >
                            <AiOutlineDownload className="mr-2" />
                            Download
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FullScreenImageViewer;
