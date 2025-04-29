import React, { useState } from 'react';

interface ImagesSectionProps {
    formData: any;
    handleImageUpload: (field: string, files: FileList) => void;
    errors: any;
}

const ImagesSection: React.FC<ImagesSectionProps> = ({
    formData,
    handleImageUpload,
    errors
}) => {
    const [showGallery, setShowGallery] = useState(true);

    // For demonstration, these would normally come from the server
    const existingMainImages = formData.post_images || [];
    const existingFloorPlanImages = formData.floor_plan_images || [];
    const existingGalleryImages = formData.galleryList || [];

    console.log("existingMainImages", existingMainImages)
    console.log("existingFloorPlanImages", existingFloorPlanImages)
    console.log("existingGalleryImages", existingGalleryImages)

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden transition-all">
            <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-medium text-gray-900">Images & Gallery</h2>
                <p className="mt-1 text-sm text-gray-500">
                    Upload high-quality images of your property.
                </p>
            </div>

            <div className="px-6 py-4 space-y-6">
                {/* Main Property Image */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Main Property Image
                    </label>

                    <div className="flex flex-col space-y-4">
                        {/* Display existing images */}
                        {existingMainImages.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {existingMainImages.map((image: any, index: number) => (
                                    <div key={index} className="relative group">
                                        <div className="aspect-w-16 aspect-h-12 rounded-lg overflow-hidden bg-gray-100">
                                            <img
                                                src={image.url}
                                                alt={`Property ${index + 1}`}
                                                className="object-cover w-full h-full"
                                            />
                                            <div className="absolute inset-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        type="button"
                                                        className="bg-red-600 p-1.5 rounded-full text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="mt-1 text-xs text-gray-500 truncate">
                                            {new Date(image.timestamp).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Upload new image */}
                        <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 48 48"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <div className="flex text-sm text-gray-600">
                                    <label
                                        htmlFor="post_image"
                                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                    >
                                        <span>Upload image</span>
                                        <input
                                            id="post_image"
                                            name="post_image"
                                            type="file"
                                            accept="image/*"
                                            className="sr-only"
                                            onChange={(e) => e.target.files && handleImageUpload('post_image', e.target.files)}
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                    PNG, JPG, GIF up to 5MB
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floor Plan Images */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Floor Plan Images
                    </label>

                    <div className="flex flex-col space-y-4">
                        {/* Display existing floor plan images */}
                        {existingFloorPlanImages.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {existingFloorPlanImages.map((image: any, index: number) => (
                                    <div key={index} className="relative group">
                                        <div className="aspect-w-16 aspect-h-12 rounded-lg overflow-hidden bg-gray-100">
                                            <img
                                                src={image.url}
                                                alt={`Floor Plan ${index + 1}`}
                                                className="object-cover w-full h-full"
                                            />
                                            <div className="absolute inset-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        type="button"
                                                        className="bg-red-600 p-1.5 rounded-full text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="mt-1 text-xs text-gray-500 truncate">
                                            {new Date(image.timestamp).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Upload new floor plan */}
                        <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 48 48"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <div className="flex text-sm text-gray-600">
                                    <label
                                        htmlFor="floor_plan_image"
                                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                    >
                                        <span>Upload floor plan</span>
                                        <input
                                            id="floor_plan_image"
                                            name="floor_plan_image"
                                            type="file"
                                            accept="image/*"
                                            className="sr-only"
                                            onChange={(e) => e.target.files && handleImageUpload('floor_plan_image', e.target.files)}
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                    PNG, JPG, GIF up to 5MB
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gallery Images */}
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <label className="block text-sm font-medium text-gray-700">
                            Gallery Images
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowGallery(!showGallery)}
                            className="text-sm text-blue-600 hover:text-blue-500"
                        >
                            {showGallery ? 'Hide Gallery' : 'Show Gallery'}
                        </button>
                    </div>

                    {showGallery && (
                        <div className="flex flex-col space-y-4">
                            {/* Display existing gallery images */}
                            {existingGalleryImages.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {existingGalleryImages.map((imageUrl: string, index: number) => (
                                        <div key={index} className="relative group">
                                            <div className="aspect-w-16 aspect-h-12 rounded-lg overflow-hidden bg-gray-100">
                                                <img
                                                    src={imageUrl}
                                                    alt={`Gallery ${index + 1}`}
                                                    className="object-cover w-full h-full"
                                                />
                                                <div className="absolute inset-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            type="button"
                                                            className="bg-red-600 p-1.5 rounded-full text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">No gallery images uploaded yet.</p>
                            )}

                            {/* Upload new gallery images */}
                            <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 48 48"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <div className="flex text-sm text-gray-600">
                                        <label
                                            htmlFor="galleryList"
                                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                        >
                                            <span>Upload gallery images</span>
                                            <input
                                                id="galleryList"
                                                name="galleryList"
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                className="sr-only"
                                                onChange={(e) => e.target.files && handleImageUpload('galleryList', e.target.files)}
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        You can select multiple images at once
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImagesSection;