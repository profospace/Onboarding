import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LocationPicker from './LocationPicker';
import { Steps } from 'antd';

const RealEstateOnboarding = ({ user }) => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        propertyType: '',
        propertyCategory: '',
        bedrooms: '',
        bathrooms: '',
        balconies: '',
        furnishingStatus: '',
        propertyAge: '',
        floorNumber: '',
        totalFloors: '',
        facingDirection: '',
        address: '',
        city: '',
        locality: '',
        pincode: '',
        title: '',
        description: '',
        price: '',
        priceUnit: 'lakh',
        area: '',
        areaUnit: 'sqft',
        amenities: [],
        postImage: null,           // Main property image
        floorPlanImage: null,      // Floor plan image
        galleryImages: [],         // Additional property images
        latitude: '',              // Added for Google Maps
        longitude: ''              // Added for Google Maps
    });

    // Add a function to handle location selection from the map
    const handleLocationSelect = (position) => {
        setFormData({
            ...formData,
            latitude: position.lat,
            longitude: position.lng
        });
    };

    // Available options for select fields
    const propertyTypes = ['Apartment', 'House', 'Shops', 'Warehouses', 'Halls', 'Land'];
    const propertyCategories = ['Residential', 'Commercial', 'Industrial', 'Agricultural'];
    const furnishingOptions = ['Unfurnished', 'Semi-Furnished', 'Fully Furnished'];
    const directionOptions = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'];
    const amenitiesOptions = [
        'Parking', 'Lift', 'Power Backup', 'Gas Pipeline', 'Swimming Pool', 'Gym',
        'Club House', 'Children\'s Play Area', 'Garden', 'Security', 'CCTV',
        'Intercom', 'Fire Safety', 'Rain Water Harvesting'
    ];

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            // Handle amenities checkboxes
            if (checked) {
                setFormData({
                    ...formData,
                    amenities: [...formData.amenities, value]
                });
            } else {
                setFormData({
                    ...formData,
                    amenities: formData.amenities.filter(item => item !== value)
                });
            }
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    // Handle image uploads
    // const handleImageUpload = (e) => {
    //     const files = Array.from(e.target.files);
    //     // Just store the file objects in state for now
    //     // In a real app, you would upload these to your server/cloud storage
    //     setFormData({
    //         ...formData,
    //         images: [...formData.images, ...files]
    //     });
    // };

    // Handle post image upload
    const handlePostImageUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({
                ...formData,
                postImage: e.target.files[0]
            });
        }
    };

    // Handle floor plan image upload
    const handleFloorPlanImageUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({
                ...formData,
                floorPlanImage: e.target.files[0]
            });
        }
    };

    // Handle gallery images upload
    const handleGalleryImagesUpload = (e) => {
        const files = Array.from(e.target.files);
        setFormData({
            ...formData,
            galleryImages: [...formData.galleryImages, ...files]
        });
    };

    // Remove post image
    const handleRemovePostImage = () => {
        setFormData({
            ...formData,
            postImage: null
        });
    };

    // Remove floor plan image
    const handleRemoveFloorPlanImage = () => {
        setFormData({
            ...formData,
            floorPlanImage: null
        });
    };

    // Remove gallery image
    const handleRemoveGalleryImage = (index) => {
        const newGalleryImages = [...formData.galleryImages];
        newGalleryImages.splice(index, 1);
        setFormData({
            ...formData,
            galleryImages: newGalleryImages
        });
    };

    // Remove an uploaded image
    const handleRemoveImage = (index) => {
        const newImages = [...formData.images];
        newImages.splice(index, 1);
        setFormData({
            ...formData,
            images: newImages
        });
    };

    // Go to next step
    const nextStep = () => {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
    };

    // Go to previous step
    const prevStep = () => {
        setCurrentStep(currentStep - 1);
        window.scrollTo(0, 0);
    };

    // Save draft to localStorage
    const saveDraft = () => {
        try {
            const draftData = {
                ...formData,
                draftId: `draft_${Date.now()}`,
                lastUpdated: new Date().toISOString()
            };

            // Get existing drafts
            const existingDrafts = JSON.parse(localStorage.getItem('propertyDrafts') || '[]');

            // Add new draft
            localStorage.setItem('propertyDrafts', JSON.stringify([...existingDrafts, draftData]));

            console.log('Draft saved successfully');
        } catch (error) {
            console.error('Error saving draft:', error);
        }
    };

    // Submit the form
    // const handleSubmit = async () => {
    //     setLoading(true);

    //     try {
    //         // First save as draft locally
    //         saveDraft();

    //         // Prepare form data for API submission
    //         const propertyData = new FormData();

    //         // Prepare the main property data object
    //         const mainData = {
    //             type_name: formData.propertyType,
    //             post_title: formData.title,
    //             post_description: formData.description,
    //             price: formData.price,
    //             price_unit: formData.priceUnit,
    //             area: formData.area,
    //             area_unit: formData.areaUnit,
    //             bedrooms: formData.bedrooms,
    //             bathrooms: formData.bathrooms,
    //             balconies: formData.balconies,
    //             furnishing_status: formData.furnishingStatus,
    //             property_age: formData.propertyAge,
    //             floor_number: formData.floorNumber,
    //             total_floors: formData.totalFloors,
    //             facing_direction: formData.facingDirection,
    //             address: formData.address,
    //             city: formData.city,
    //             locality: formData.locality,
    //             pincode: formData.pincode,
    //             amenities: formData.amenities,
    //             latitude: formData.latitude,
    //             longitude: formData.longitude,
    //             post_id: `PROP${Date.now()}`, // Generate a unique property ID
    //         };

    //         // Add user information
    //         if (user && user.id) {
    //             mainData.user_id = user.id;
    //         }

    //         // Append the main data as a JSON string
    //         propertyData.append('data', JSON.stringify(mainData));

    //         // Add images according to the backend's expected field names
    //         if (formData.images.length > 0) {
    //             // Use the first image as the post_image (main image)
    //             propertyData.append('post_image', formData.images[0]);

    //             // Use the second image as floor_plan_image if available
    //             if (formData.images.length > 1) {
    //                 propertyData.append('floor_plan_image', formData.images[1]);
    //             }

    //             // Add remaining images to galleryList
    //             for (let i = 2; i < formData.images.length; i++) {
    //                 propertyData.append('galleryList', formData.images[i]);
    //             }
    //         }

    //         // Submit to API
    //         const response = await fetch('http://localhost:5053/api/upload/property', {
    //             method: 'POST',
    //             body: propertyData,
    //             // No Content-Type header as the browser will set it with the boundary parameter for FormData
    //         });

    //         if (!response.ok) {
    //             const errorData = await response.json();
    //             throw new Error(`API error: ${errorData.message || response.statusText}`);
    //         }

    //         const result = await response.json();
    //         console.log('Property submitted successfully:', result);

    //         // Navigate to dashboard after successful submission
    //         navigate('/dashboard');

    //     } catch (error) {
    //         console.error('Error submitting property:', error);
    //         alert(`There was an error submitting your property: ${error.message}. It has been saved as a draft.`);
    //         setLoading(false);
    //     }
    // };

    // Submit the form
    const handleSubmit = async () => {
        setLoading(true);

        try {
            // First save as draft locally
            saveDraft();

            // Prepare form data for API submission
            const propertyData = new FormData();

            // Prepare the main property data object
            const mainData = {
                type_name: formData.propertyType,
                post_title: formData.title,
                post_description: formData.description,
                price: formData.price,
                price_unit: formData.priceUnit,
                area: formData.area,
                area_unit: formData.areaUnit,
                bedrooms: formData.bedrooms,
                bathrooms: formData.bathrooms,
                balconies: formData.balconies,
                furnishing_status: formData.furnishingStatus,
                property_age: formData.propertyAge,
                floor_number: formData.floorNumber,
                total_floors: formData.totalFloors,
                facing_direction: formData.facingDirection,
                address: formData.address,
                city: formData.city,
                locality: formData.locality,
                pincode: formData.pincode,
                amenities: formData.amenities,
                latitude: formData.latitude,
                longitude: formData.longitude,
                post_id: `PROP${Date.now()}`, // Generate a unique property ID
            };

            // Add user information
            if (user && user.id) {
                mainData.user_id = user.id;
            }

            // Append the main data as a JSON string
            propertyData.append('data', JSON.stringify(mainData));

            // Add images according to the backend's expected field names
            if (formData.postImage) {
                propertyData.append('post_image', formData.postImage);
            }

            if (formData.floorPlanImage) {
                propertyData.append('floor_plan_image', formData.floorPlanImage);
            }

            // Add gallery images
            if (formData.galleryImages && formData.galleryImages.length > 0) {
                formData.galleryImages.forEach(image => {
                    propertyData.append('galleryList', image);
                });
            }

            // // Submit to API
            // const response = await fetch('http://localhost:5053/api/upload/property', {
            //     method: 'POST',
            //     body: propertyData,
            //     // No Content-Type header as the browser will set it with the boundary parameter for FormData
            // });

            const details = JSON.parse(localStorage.getItem('user'))
            const response = await fetch('http://localhost:5053/api/upload/property', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${details?.token}` // Replace yourToken with the actual token
                },
                body: propertyData,
            });


            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API error: ${errorData.message || response.statusText}`);
            }

            const result = await response.json();
            console.log('Property submitted successfully:', result);

            // Navigate to dashboard after successful submission
            navigate('/dashboard');

        } catch (error) {
            console.error('Error submitting property:', error);
            alert(`There was an error submitting your property: ${error.message}. It has been saved as a draft.`);
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            {/* Header */}
            {/* <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-semibold text-gray-900">Add New Property</h1>
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        &larr; Back to Dashboard
                    </Link>
                </div>
            </header> */}

            {/* Progress bar */}
            {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                    <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${(currentStep / 4) * 100}%` }}
                    ></div>
                </div>

                <div className="flex justify-between">
                    <div className={`text-sm font-medium ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-500'}`}>Basic Details</div>
                    <div className={`text-sm font-medium ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-500'}`}>Location</div>
                    <div className={`text-sm font-medium ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-500'}`}>Property Details</div>
                    <div className={`text-sm font-medium ${currentStep >= 4 ? 'text-blue-600' : 'text-gray-500'}`}>Photos & Amenities</div>
                </div>
            </div> */}
            {/* Progress Steps */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Steps
                    current={currentStep - 1}
                    percent={((currentStep - 1) / 3) * 100}
                    items={[
                        {
                            title: 'Basic Details',
                            description: currentStep === 1 ? 'Current step' : '',
                        },
                        {
                            title: 'Location',
                            description: currentStep === 2 ? 'Current step' : '',
                        },
                        {
                            title: 'Property Details',
                            description: currentStep === 3 ? 'Current step' : '',
                        },
                        {
                            title: 'Photos & Amenities',
                            description: currentStep === 4 ? 'Current step' : '',
                        },
                    ]}
                />
            </div>

            {/* Form content */}
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-2">
                <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                    {/* Step 1: Basic Details */}
                    {currentStep === 1 && (
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-6">Basic Details</h2>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">
                                        Property Type*
                                    </label>
                                    <select
                                        id="propertyType"
                                        name="propertyType"
                                        value={formData.propertyType}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select Property Type</option>
                                        {propertyTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="propertyCategory" className="block text-sm font-medium text-gray-700 mb-1">
                                        Property Category*
                                    </label>
                                    <select
                                        id="propertyCategory"
                                        name="propertyCategory"
                                        value={formData.propertyCategory}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select Category</option>
                                        {propertyCategories.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
                                        Bedrooms
                                    </label>
                                    <select
                                        id="bedrooms"
                                        name="bedrooms"
                                        value={formData.bedrooms}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select</option>
                                        {[1, 2, 3, 4, 5, '5+'].map(num => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
                                        Bathrooms
                                    </label>
                                    <select
                                        id="bathrooms"
                                        name="bathrooms"
                                        value={formData.bathrooms}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select</option>
                                        {[1, 2, 3, 4, 5, '5+'].map(num => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="balconies" className="block text-sm font-medium text-gray-700 mb-1">
                                        Balconies
                                    </label>
                                    <select
                                        id="balconies"
                                        name="balconies"
                                        value={formData.balconies}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select</option>
                                        {[0, 1, 2, 3, 4, '4+'].map(num => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="furnishingStatus" className="block text-sm font-medium text-gray-700 mb-1">
                                        Furnishing Status
                                    </label>
                                    <select
                                        id="furnishingStatus"
                                        name="furnishingStatus"
                                        value={formData.furnishingStatus}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select</option>
                                        {furnishingOptions.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Location Details */}
                    {/* {currentStep === 2 && (
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-6">Location Details</h2>

                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                        Address*
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Street address"
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                            City*
                                        </label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="City"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="locality" className="block text-sm font-medium text-gray-700 mb-1">
                                            Locality/Area*
                                        </label>
                                        <input
                                            type="text"
                                            id="locality"
                                            name="locality"
                                            value={formData.locality}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Locality"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                                            PIN Code*
                                        </label>
                                        <input
                                            type="text"
                                            id="pincode"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="PIN Code"
                                            pattern="[0-9]*"
                                            maxLength="6"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="facingDirection" className="block text-sm font-medium text-gray-700 mb-1">
                                            Facing Direction
                                        </label>
                                        <select
                                            id="facingDirection"
                                            name="facingDirection"
                                            value={formData.facingDirection}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Select</option>
                                            {directionOptions.map(direction => (
                                                <option key={direction} value={direction}>{direction}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )} */}
                    {/* Step 2: Location Details */}
                    {currentStep === 2 && (
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-6">Location Details</h2>

                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                        Address*
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Street address"
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                            City*
                                        </label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="City"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="locality" className="block text-sm font-medium text-gray-700 mb-1">
                                            Locality/Area*
                                        </label>
                                        <input
                                            type="text"
                                            id="locality"
                                            name="locality"
                                            value={formData.locality}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Locality"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                                            PIN Code*
                                        </label>
                                        <input
                                            type="text"
                                            id="pincode"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="PIN Code"
                                            pattern="[0-9]*"
                                            maxLength="6"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="facingDirection" className="block text-sm font-medium text-gray-700 mb-1">
                                            Facing Direction
                                        </label>
                                        <select
                                            id="facingDirection"
                                            name="facingDirection"
                                            value={formData.facingDirection}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Select</option>
                                            {directionOptions.map(direction => (
                                                <option key={direction} value={direction}>{direction}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Google Maps Location Picker Integration */}
                                <LocationPicker
                                    address={formData.address}
                                    city={formData.city}
                                    onLocationSelect={handleLocationSelect}
                                />

                                {/* Display selected coordinates */}
                                {formData.latitude && formData.longitude && (
                                    <div className="text-sm text-gray-700">
                                        <p>Selected location coordinates: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            These coordinates will be used to show your property's location on maps.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Property Details */}
                    {currentStep === 3 && (
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-6">Property Details</h2>

                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                        Property Title*
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="e.g. 3BHK Apartment in Civil Lines"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                        Description*
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="4"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Describe your property..."
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                            Price*
                                        </label>
                                        <div className="flex">
                                            <input
                                                type="number"
                                                id="price"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleChange}
                                                required
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Amount"
                                            />
                                            <select
                                                name="priceUnit"
                                                value={formData.priceUnit}
                                                onChange={handleChange}
                                                className="w-24 border-y border-r border-gray-300 rounded-r-md bg-gray-50 px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="thousand">Thousand</option>
                                                <option value="lakh">Lakh</option>
                                                <option value="crore">Crore</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                                            Area*
                                        </label>
                                        <div className="flex">
                                            <input
                                                type="number"
                                                id="area"
                                                name="area"
                                                value={formData.area}
                                                onChange={handleChange}
                                                required
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Area"
                                            />
                                            <select
                                                name="areaUnit"
                                                value={formData.areaUnit}
                                                onChange={handleChange}
                                                className="w-24 border-y border-r border-gray-300 rounded-r-md bg-gray-50 px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="sqft">sq.ft</option>
                                                <option value="sqm">sq.m</option>
                                                <option value="acres">acres</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="propertyAge" className="block text-sm font-medium text-gray-700 mb-1">
                                            Property Age
                                        </label>
                                        <select
                                            id="propertyAge"
                                            name="propertyAge"
                                            value={formData.propertyAge}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Select</option>
                                            <option value="new">New Construction</option>
                                            <option value="<5">Less than 5 years</option>
                                            <option value="5-10">5-10 years</option>
                                            <option value="10+">10+ years</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="floorNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                                Floor Number
                                            </label>
                                            <input
                                                type="number"
                                                id="floorNumber"
                                                name="floorNumber"
                                                value={formData.floorNumber}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Floor"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="totalFloors" className="block text-sm font-medium text-gray-700 mb-1">
                                                Total Floors
                                            </label>
                                            <input
                                                type="number"
                                                id="totalFloors"
                                                name="totalFloors"
                                                value={formData.totalFloors}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Total Floors"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Photos & Amenities */}
                    {currentStep === 4 && (
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-6">Photos & Amenities</h2>

                            {/* Main Property Image */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Main Property Image*
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                    {formData.postImage ? (
                                        <div className="relative rounded-lg overflow-hidden h-40 mb-2">
                                            <img
                                                src={URL.createObjectURL(formData.postImage)}
                                                alt="Main property image"
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleRemovePostImage}
                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Upload the main image of your property (required)
                                            </p>
                                            <div className="mt-4">
                                                <label htmlFor="post-image-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                                    <svg className="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                    </svg>
                                                    Upload Main Image
                                                </label>
                                                <input
                                                    id="post-image-upload"
                                                    name="post-image-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handlePostImageUpload}
                                                    className="sr-only"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Floor Plan Image */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Floor Plan Image
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                    {formData.floorPlanImage ? (
                                        <div className="relative rounded-lg overflow-hidden h-40 mb-2">
                                            <img
                                                src={URL.createObjectURL(formData.floorPlanImage)}
                                                alt="Floor plan"
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleRemoveFloorPlanImage}
                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                            </svg>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Upload your property's floor plan
                                            </p>
                                            <div className="mt-4">
                                                <label htmlFor="floor-plan-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                                    <svg className="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                    </svg>
                                                    Upload Floor Plan
                                                </label>
                                                <input
                                                    id="floor-plan-upload"
                                                    name="floor-plan-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFloorPlanImageUpload}
                                                    className="sr-only"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Gallery Images */}
                            <div className="mb-8">
                                <div className="mb-2 flex justify-between items-center">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Gallery Images
                                    </label>
                                    <span className="text-xs text-gray-500">
                                        {formData.galleryImages.length} of 10 photos added
                                    </span>
                                </div>

                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    {formData.galleryImages.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 mb-4">
                                            {formData.galleryImages.map((image, index) => (
                                                <div key={index} className="relative rounded-lg overflow-hidden h-24">
                                                    <img
                                                        src={URL.createObjectURL(image)}
                                                        alt={`Gallery image ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveGalleryImage(index)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : null}

                                    {formData.galleryImages.length < 10 && (
                                        <div>
                                            <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Upload up to 10 additional property photos
                                            </p>
                                            <div className="mt-4">
                                                <label htmlFor="gallery-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                                    <svg className="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                    </svg>
                                                    Upload Gallery Photos
                                                </label>
                                                <input
                                                    id="gallery-upload"
                                                    name="gallery-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={handleGalleryImagesUpload}
                                                    className="sr-only"
                                                />
                                            </div>
                                            <p className="mt-2 text-xs text-gray-500">
                                                PNG, JPG, GIF up to 5MB each
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Amenities section */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Amenities
                                </label>
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                                    {amenitiesOptions.map((amenity) => (
                                        <div key={amenity} className="flex items-start">
                                            <div className="flex items-center h-5">
                                                <input
                                                    id={`amenity-${amenity}`}
                                                    name="amenities"
                                                    type="checkbox"
                                                    value={amenity}
                                                    checked={formData.amenities.includes(amenity)}
                                                    onChange={handleChange}
                                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                            </div>
                                            <div className="ml-2 text-sm">
                                                <label htmlFor={`amenity-${amenity}`} className="text-gray-700">
                                                    {amenity}
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation buttons */}
                    <div className="flex justify-between mt-8">
                        {currentStep > 1 ? (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <svg className="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                                Previous
                            </button>
                        ) : (
                            <div></div>
                        )}

                        {currentStep < 4 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Next
                                <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading}
                                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        Submit Property
                                        <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RealEstateOnboarding;