import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { UploadIcon, CloseIcon, CameraIcon } from './Icons';

const ImageUploader = ({ initialImages = [], onImagesChange }) => {
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [captions, setCaptions] = useState(['', '', '', '']);

    // Initialize with initial images if provided
    useEffect(() => {
        if (initialImages && initialImages.length > 0) {
            setImagePreviews(initialImages.map(img => img.url || img));
            setCaptions(initialImages.map(img => img.caption || ''));
            // We don't set actual image files since we don't have them from server
        }
    }, [initialImages]);

    // Handle image selection
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length > 4) {
            toast.error('Maximum 4 images allowed');
            return;
        }

        // Add new images
        setImages((prevImages) => [...prevImages, ...files]);

        // Generate image previews
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);

        // Add empty captions for new images
        setCaptions((prevCaptions) => [
            ...prevCaptions.slice(0, images.length),
            ...Array(files.length).fill(''),
            ...prevCaptions.slice(images.length + files.length),
        ]);

        // Notify parent component
        onImagesChange({
            files: [...images, ...files],
            previews: [...imagePreviews, ...newPreviews],
            captions: [
                ...captions.slice(0, images.length),
                ...Array(files.length).fill(''),
                ...captions.slice(images.length + files.length),
            ]
        });
    };

    // Handle image removal
    const removeImage = (index) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));

        // Revoke object URL to prevent memory leaks
        URL.revokeObjectURL(imagePreviews[index]);
        setImagePreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));

        setCaptions((prevCaptions) => [
            ...prevCaptions.slice(0, index),
            ...prevCaptions.slice(index + 1),
            '',
        ]);

        // Notify parent component
        onImagesChange({
            files: images.filter((_, i) => i !== index),
            previews: imagePreviews.filter((_, i) => i !== index),
            captions: [
                ...captions.slice(0, index),
                ...captions.slice(index + 1),
                '',
            ]
        });
    };

    // Handle caption changes
    const handleCaptionChange = (index, value) => {
        const newCaptions = [
            ...captions.slice(0, index),
            value,
            ...captions.slice(index + 1),
        ];

        setCaptions(newCaptions);

        // Notify parent component
        onImagesChange({
            files: images,
            previews: imagePreviews,
            captions: newCaptions
        });
    };

    // Clean up image previews when component unmounts
    useEffect(() => {
        return () => {
            imagePreviews.forEach(preview => {
                if (preview && typeof preview === 'string' && preview.startsWith('blob:')) {
                    URL.revokeObjectURL(preview);
                }
            });
        };
    }, [imagePreviews]);

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Images (up to 4)
            </label>
            <div className="flex items-center justify-center w-full mb-4">
                <label
                    className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadIcon className="w-8 h-8 mb-1 text-gray-500" />
                        <p className="text-sm text-gray-500">
                            <span className="font-medium">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">(PNG, JPG, JPEG up to 10MB)</p>
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        disabled={imagePreviews.length >= 4}
                    />
                </label>
            </div>
            <p className="text-xs text-gray-500 mb-4">
                {imagePreviews.length}/4 images uploaded
            </p>

            {/* Image Previews with Captions */}
            {imagePreviews.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {imagePreviews.map((preview, index) => (
                        <div
                            key={index}
                            className="relative border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                        >
                            <div className="h-48 overflow-hidden bg-gray-100 flex items-center justify-center">
                                <img
                                    src={preview}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            >
                                <CloseIcon className="w-4 h-4" />
                            </button>
                            <div className="p-3">
                                <input
                                    type="text"
                                    placeholder="Add a caption (optional)"
                                    value={captions[index] || ''}
                                    onChange={(e) => handleCaptionChange(index, e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* No images message */}
            {imagePreviews.length === 0 && (
                <div className="text-center py-4 border border-gray-200 rounded-lg bg-gray-50">
                    <CameraIcon className="w-10 h-10 mx-auto text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">No images uploaded yet</p>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;