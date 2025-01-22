import React, { useState } from 'react';
import { AiOutlineClose, AiOutlineEye, AiOutlineDownload } from 'react-icons/ai';

const FullScreenImageViewer = ({ imageUrl }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);  // Track hover state

    // Handle opening the modal
    const handleImageClick = () => {
        setIsModalOpen(true);
    };

    // Handle closing the modal
    const handleClose = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            {/* Thumbnail image with hover effect */}
            <div
                className="relative w-20 h-20 border rounded-lg cursor-pointer"
                onClick={handleImageClick}
                onMouseEnter={() => setIsHovered(true)}  // Hover effect
                onMouseLeave={() => setIsHovered(false)}  // Hover effect
            >
                <img
                    src={imageUrl}
                    alt="Thumbnail"
                    className="w-full h-full border rounded-md object-cover"
                />

                {/* Eye icon visible only when hovered */}
                {isHovered && (
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
                        <AiOutlineEye className="text-white text-3xl" />
                    </div>
                )}
            </div>

            {/* Full-screen modal for the image */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                    <div className="relative max-w-full max-h-full">
                        <img
                            src={imageUrl}
                            alt="Full Screen"
                            className="max-w-[90%] max-h-[90%] object-contain"
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
