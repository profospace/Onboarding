// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';

// const Draft = () => {
//     const [drafts, setDrafts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();

//     useEffect(() => {
//         // Load drafts from localStorage
//         const loadDrafts = () => {
//             try {
//                 const savedDrafts = localStorage.getItem('propertyDrafts');
//                 if (savedDrafts) {
//                     setDrafts(JSON.parse(savedDrafts));
//                 }
//             } catch (error) {
//                 console.error('Error loading drafts:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         loadDrafts();
//     }, []);

//     const handleDeleteDraft = (draftId) => {
//         try {
//             // Filter out the draft to be deleted
//             const updatedDrafts = drafts.filter(draft => draft.draftId !== draftId);

//             // Update state
//             setDrafts(updatedDrafts);

//             // Update localStorage
//             localStorage.setItem('propertyDrafts', JSON.stringify(updatedDrafts));
//         } catch (error) {
//             console.error('Error deleting draft:', error);
//         }
//     };

//     const handleContinueEditing = (draft) => {
//         // Navigate back to the property form with the draft data
//         navigate('/onboarding', { state: { draftData: draft } });
//     };

//     // Format date for display
//     const formatDate = (dateString) => {
//         try {
//             const date = new Date(dateString);
//             return date.toLocaleString();
//         } catch (error) {
//             return 'Unknown date';
//         }
//     };

//     // Get property type label
//     const getPropertyTypeLabel = (draft) => {
//         if (!draft) return 'Unknown';
//         return `${draft.propertyType || 'Property'} (${draft.propertyCategory || 'Unknown'})`;
//     };

//     // Get location label
//     const getLocationLabel = (draft) => {
//         if (!draft) return 'Unknown location';
//         const parts = [];
//         if (draft.locality) parts.push(draft.locality);
//         if (draft.city) parts.push(draft.city);
//         return parts.length > 0 ? parts.join(', ') : 'Location not specified';
//     };

//     // Get price display
//     const getPriceDisplay = (draft) => {
//         if (!draft || !draft.price) return 'Price not specified';

//         let unitLabel = '';
//         switch (draft.priceUnit) {
//             case 'thousand':
//                 unitLabel = 'K';
//                 break;
//             case 'lakh':
//                 unitLabel = 'L';
//                 break;
//             case 'crore':
//                 unitLabel = 'Cr';
//                 break;
//             default:
//                 unitLabel = '';
//         }

//         if (draft.priceOnRequest) {
//             return 'Price on Request';
//         }

//         return `₹${draft.price} ${unitLabel}`;
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//                 <div className="max-w-7xl mx-auto">
//                     <div className="text-center">
//                         <h1 className="text-3xl font-bold text-gray-900">Loading drafts...</h1>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//             <div className="max-w-7xl mx-auto">
//                 <div className="text-center mb-10">
//                     <h1 className="text-3xl font-bold text-gray-900">Your Property Drafts</h1>
//                     <p className="mt-2 text-sm text-gray-600">
//                         Continue working on your saved property listings or add new ones
//                     </p>
//                 </div>

//                 {drafts.length === 0 ? (
//                     <div className="text-center bg-white rounded-lg shadow-md p-8">
//                         <svg
//                             className="mx-auto h-12 w-12 text-gray-400"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             stroke="currentColor"
//                             aria-hidden="true"
//                         >
//                             <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
//                             />
//                         </svg>
//                         <h3 className="mt-2 text-sm font-medium text-gray-900">No drafts</h3>
//                         <p className="mt-1 text-sm text-gray-500">Get started by creating a new property listing.</p>
//                         <div className="mt-6">
//                             <Link
//                                 to="/onboarding"
//                                 className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                             >
//                                 <svg
//                                     className="-ml-1 mr-2 h-5 w-5"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     viewBox="0 0 20 20"
//                                     fill="currentColor"
//                                     aria-hidden="true"
//                                 >
//                                     <path
//                                         fillRule="evenodd"
//                                         d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
//                                         clipRule="evenodd"
//                                     />
//                                 </svg>
//                                 Create Property Listing
//                             </Link>
//                         </div>
//                     </div>
//                 ) : (
//                     <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//                         {/* Add new property card */}
//                         <div className="bg-white overflow-hidden shadow-md rounded-lg border-2 border-dashed border-gray-300 p-6 flex items-center justify-center">
//                             <Link
//                                 to="/onboarding"
//                                 className="text-center"
//                             >
//                                 <svg
//                                     className="mx-auto h-12 w-12 text-gray-400"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     fill="none"
//                                     viewBox="0 0 24 24"
//                                     stroke="currentColor"
//                                 >
//                                     <path
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                         strokeWidth={2}
//                                         d="M12 4v16m8-8H4"
//                                     />
//                                 </svg>
//                                 <h3 className="mt-2 text-sm font-medium text-gray-900">Add new property</h3>
//                             </Link>
//                         </div>

//                         {/* Draft cards */}
//                         {drafts.map((draft) => (
//                             <div key={draft.draftId} className="bg-white overflow-hidden shadow-md rounded-lg">
//                                 {/* Draft property image or placeholder */}
//                                 <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
//                                     {draft.postImage && typeof draft.postImage === 'object' && Object.keys(draft.postImage).length > 0 ? (
//                                         <img
//                                             src={'https://wityysaver.s3.ap-south-1.amazonaws.com/gallery_images/PROP1742202858454/34f30911-bfc3-4595-95b0-bcb40806a924_67777496d2deebfe7188efac_DSC02589-HDR.webp'}
//                                             alt={draft.title || 'Property'}
//                                             className="h-full w-full object-cover"
//                                         />
//                                     ) : (
//                                         <svg
//                                             className="h-16 w-16 text-gray-400"
//                                             xmlns="http://www.w3.org/2000/svg"
//                                             fill="none"
//                                             viewBox="0 0 24 24"
//                                             stroke="currentColor"
//                                         >
//                                             <path
//                                                 strokeLinecap="round"
//                                                 strokeLinejoin="round"
//                                                 strokeWidth={2}
//                                                 d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
//                                             />
//                                             <path
//                                                 strokeLinecap="round"
//                                                 strokeLinejoin="round"
//                                                 strokeWidth={2}
//                                                 d="M9 22V12h6v10"
//                                             />
//                                         </svg>
//                                     )}
//                                 </div>

//                                 <div className="p-6">
//                                     <div className="flex justify-between items-start">
//                                         <div>
//                                             <h3 className="text-lg font-medium text-gray-900 truncate" title={draft.title || 'Untitled Property'}>
//                                                 {draft.title || 'Untitled Property'}
//                                             </h3>
//                                             <p className="mt-1 text-sm text-gray-500">
//                                                 {getPropertyTypeLabel(draft)}
//                                             </p>
//                                         </div>
//                                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                                             {draft.purpose === 'rent' ? 'Rent' : 'Sale'}
//                                         </span>
//                                     </div>

//                                     <div className="mt-4">
//                                         <div className="flex items-center text-sm text-gray-500">
//                                             <svg
//                                                 className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
//                                                 xmlns="http://www.w3.org/2000/svg"
//                                                 viewBox="0 0 20 20"
//                                                 fill="currentColor"
//                                             >
//                                                 <path
//                                                     fillRule="evenodd"
//                                                     d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
//                                                     clipRule="evenodd"
//                                                 />
//                                             </svg>
//                                             {getLocationLabel(draft)}
//                                         </div>

//                                         <div className="mt-2 flex items-center text-sm text-gray-500">
//                                             <svg
//                                                 className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
//                                                 xmlns="http://www.w3.org/2000/svg"
//                                                 viewBox="0 0 20 20"
//                                                 fill="currentColor"
//                                             >
//                                                 <path
//                                                     fillRule="evenodd"
//                                                     d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
//                                                     clipRule="evenodd"
//                                                 />
//                                             </svg>
//                                             Last updated {formatDate(draft.lastUpdated)}
//                                         </div>

//                                         <div className="mt-4 flex items-center justify-between">
//                                             <span className="text-lg font-medium text-gray-900">
//                                                 {getPriceDisplay(draft)}
//                                             </span>
//                                             <span className="text-sm text-gray-500">
//                                                 {draft.area} {draft.areaUnit}
//                                             </span>
//                                         </div>
//                                     </div>

//                                     <div className="mt-6 flex space-x-3">
//                                         <button
//                                             type="button"
//                                             onClick={() => handleContinueEditing(draft)}
//                                             className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                                         >
//                                             Continue Editing
//                                         </button>
//                                         <button
//                                             type="button"
//                                             onClick={() => handleDeleteDraft(draft.draftId)}
//                                             className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                                         >
//                                             Delete
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Draft;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Draft = () => {
    const [drafts, setDrafts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Load drafts from localStorage
        const loadDrafts = () => {
            try {
                const savedDrafts = localStorage.getItem('propertyDrafts');
                if (savedDrafts) {
                    setDrafts(JSON.parse(savedDrafts));
                }
            } catch (error) {
                console.error('Error loading drafts:', error);
            } finally {
                setLoading(false);
            }
        };

        loadDrafts();
    }, []);

    const handleDeleteDraft = (draftId) => {
        try {
            // Filter out the draft to be deleted
            const updatedDrafts = drafts.filter(draft => draft.draftId !== draftId);

            // Update state
            setDrafts(updatedDrafts);

            // Update localStorage
            localStorage.setItem('propertyDrafts', JSON.stringify(updatedDrafts));
        } catch (error) {
            console.error('Error deleting draft:', error);
        }
    };

    const handleContinueEditing = (draft) => {
        // Navigate back to the property form with the draft data
        navigate('/onboarding', { state: { draftData: draft } });
    };

    // Format date for display
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleString();
        } catch (error) {
            return 'Unknown date';
        }
    };

    // Get property type label
    const getPropertyTypeLabel = (draft) => {
        if (!draft) return 'Unknown';
        return `${draft.propertyType || 'Property'} (${draft.propertyCategory || 'Unknown'})`;
    };

    // Get location label
    const getLocationLabel = (draft) => {
        if (!draft) return 'Unknown location';
        const parts = [];
        if (draft.locality) parts.push(draft.locality);
        if (draft.city) parts.push(draft.city);
        return parts.length > 0 ? parts.join(', ') : 'Location not specified';
    };

    // Get price display
    const getPriceDisplay = (draft) => {
        if (!draft || !draft.price) return 'Price not specified';

        let unitLabel = '';
        switch (draft.priceUnit) {
            case 'thousand':
                unitLabel = 'K';
                break;
            case 'lakh':
                unitLabel = 'L';
                break;
            case 'crore':
                unitLabel = 'Cr';
                break;
            default:
                unitLabel = '';
        }

        if (draft.priceOnRequest) {
            return 'Price on Request';
        }

        return `₹${draft.price} ${unitLabel}`;
    };

    // Get image display for draft card
    const getImageDisplay = (draft) => {
        // Check for images from duplicated property (URLs)
        if (draft.postImages && Array.isArray(draft.postImages) && draft.postImages.length > 0) {
            const firstImage = draft.postImages[0];
            if (typeof firstImage === 'object' && firstImage.url) {
                return firstImage.url;
            }
            if (typeof firstImage === 'string') {
                return firstImage;
            }
        }

        // Check for base64 images (from original draft)
        if (draft.postImagesBase64 && Array.isArray(draft.postImagesBase64) && draft.postImagesBase64.length > 0) {
            return draft.postImagesBase64[0];
        }

        return null;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900">Loading drafts...</h1>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900">Your Property Drafts</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Continue working on your saved property listings or add new ones
                    </p>
                </div>

                {drafts.length === 0 ? (
                    <div className="text-center bg-white rounded-lg shadow-md p-8">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                            />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No drafts</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating a new property listing.</p>
                        <div className="mt-6">
                            <Link
                                to="/onboarding"
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <svg
                                    className="-ml-1 mr-2 h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Create Property Listing
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Add new property card */}
                        <div className="bg-white overflow-hidden shadow-md rounded-lg border-2 border-dashed border-gray-300 p-6 flex items-center justify-center">
                            <Link
                                to="/onboarding"
                                className="text-center"
                            >
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">Add new property</h3>
                            </Link>
                        </div>

                        {/* Draft cards */}
                        {drafts.map((draft) => {
                            const imageUrl = getImageDisplay(draft);

                            return (
                                <div key={draft.draftId} className="bg-white overflow-hidden shadow-md rounded-lg">
                                    {/* Draft property image or placeholder */}
                                    <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
                                        {imageUrl ? (
                                            <img
                                                src={imageUrl}
                                                alt={draft.title || 'Property'}
                                                className="h-full w-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div
                                            className={`${imageUrl ? 'hidden' : 'flex'} h-full w-full items-center justify-center`}
                                        >
                                            <svg
                                                className="h-16 w-16 text-gray-400"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 22V12h6v10"
                                                />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900 truncate" title={draft.title || 'Untitled Property'}>
                                                    {draft.title || 'Untitled Property'}
                                                </h3>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    {getPropertyTypeLabel(draft)}
                                                </p>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {draft.purpose === 'rent' ? 'Rent' : 'Sale'}
                                                </span>
                                                {draft.isDuplicate && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                        Duplicate
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <svg
                                                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                {getLocationLabel(draft)}
                                            </div>

                                            <div className="mt-2 flex items-center text-sm text-gray-500">
                                                <svg
                                                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                Last updated {formatDate(draft.lastUpdated)}
                                            </div>

                                            {draft.isDuplicate && draft.originalPropertyId && (
                                                <div className="mt-2 flex items-center text-sm text-gray-500">
                                                    <svg
                                                        className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M4 2a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    Duplicated from: {draft.originalPropertyId}
                                                </div>
                                            )}

                                            <div className="mt-4 flex items-center justify-between">
                                                <span className="text-lg font-medium text-gray-900">
                                                    {getPriceDisplay(draft)}
                                                </span>
                                                {draft.area && (
                                                    <span className="text-sm text-gray-500">
                                                        {draft.area} {draft.areaUnit || 'sqft'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-6 flex space-x-3">
                                            <button
                                                type="button"
                                                onClick={() => handleContinueEditing(draft)}
                                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                {draft.isDuplicate ? 'Edit Copy' : 'Continue Editing'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteDraft(draft.draftId)}
                                                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Draft;