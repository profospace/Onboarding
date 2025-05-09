import React, { useState } from 'react';

const LeadImages = ({ images }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    // If no images provided, show placeholder
    if (!images || images.length === 0) {
        return (
            <div className="h-64 bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">No images available</p>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Main featured image */}
            <div className="h-64 md:h-96 overflow-hidden">
                <img
                    src={images[activeIndex].url}
                    alt={images[activeIndex].caption || `Property image ${activeIndex + 1}`}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Image caption if available */}
            {images[activeIndex].caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 text-sm">
                    {images[activeIndex].caption}
                </div>
            )}

            {/* Thumbnail navigation - only show if more than 1 image */}
            {images.length > 1 && (
                <div className="flex justify-center p-3 gap-2 bg-gray-100">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className={`w-16 h-16 overflow-hidden rounded-md transition-all ${activeIndex === index
                                    ? 'ring-2 ring-blue-500 opacity-100 scale-105'
                                    : 'opacity-70 hover:opacity-100'
                                }`}
                        >
                            <img
                                src={image.url}
                                alt={image.caption || `Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LeadImages;