// import React from 'react';
// import { Link } from 'react-router-dom';
// import { formatDate } from '../../../utils/formatters';
// import { EyeIcon, PencilIcon, TrashIcon, MapPinIcon } from 'lucide-react';
// import { useSelector } from 'react-redux';
// import { Button } from 'antd';
// import { base_url } from '../../../utils/base_url';
// const LeadCard = ({ lead, onDeleteClick }) => {
//     const { _id, propertyName, ownerName, ownerContact, images, createdAt, isCrossed } = lead;
//     const { user } = useSelector((state) => state.auth);
//     const featuredImage = images && images.length > 0
//         ? images[0].url
//         : 'https://via.placeholder.com/300x200?text=No+Image';

//     const leadAge = Math.floor((new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24));


//     const handleCrossToggle = async () => {

//         try {
//             const response = await fetch(`${base_url}/api/salesman/property/leads/${_id}/cross-status`, {
//                 method: 'PATCH',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${localStorage.getItem('token')}`
//                 },
//                 body: JSON.stringify({ isCrossed: !isCrossed })
//             });

//             if (response.ok) {
//                 const data = await response.json();

//             } else {
//                 console.error('Failed to update cross status');
//             }
//         } catch (error) {
//             console.error('Error updating cross status:', error);
//         }
//     };
//     return (
//         <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full">
//             <div className="relative h-48 overflow-hidden">
//                 <img
//                     src={featuredImage}
//                     alt={propertyName || "Property"}
//                     className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
//                 />

//                 <div className="absolute top-3 left-3">
//                     <span className="bg-blue-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">
//                         {leadAge === 0 ? 'Today' : `${leadAge} day${leadAge !== 1 ? 's' : ''} ago`}
//                     </span>
//                 </div>

//                 {images && images.length > 1 && (
//                     <div className="absolute bottom-3 right-3">
//                         <span className="bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
//                             +{images.length - 1} more
//                         </span>
//                     </div>
//                 )}
//             </div>

//             <div className='flex p-4 flex-grow items-center gap-12'>
//                 <div className="">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
//                         {propertyName || "Untitled Property"}
//                     </h3>

//                     {ownerName && (
//                         <p className="text-sm text-gray-600 mb-1">
//                             <span className="font-medium">Owner:</span> {ownerName}
//                         </p>
//                     )}

//                     {ownerContact && (
//                         <p className="text-sm text-gray-600 mb-2">
//                             <span className="font-medium">Contact:</span> {ownerContact}
//                         </p>
//                     )}

//                     <div className="flex items-center text-sm text-gray-500 mb-3">
//                         <MapPinIcon className="w-4 h-4 mr-1" />
//                         <span>
//                             {lead.location ?
//                                 `${lead.location.latitude.toFixed(6)}, ${lead.location.longitude.toFixed(6)}` :
//                                 'Location not specified'}
//                         </span>
//                     </div>

//                     <div className="text-xs text-gray-500">
//                         Created: {formatDate(createdAt)}
//                     </div>
//                     <div className="text-xs text-gray-500">
//                         Uploaded By: {lead?.salesman?.name}
//                     </div>
//                 </div>
//                 <div className='flex'>
//                     {
//                         lead?.isCrossed && (
//                             <Button>
//                                 ❌
//                             </Button>
//                         )
//                     }
//                     {
//                         user.userType === 'admin' && <Button onClick={handleCrossToggle}>Mark</Button>
//                     }
//                 </div>
//             </div>

//             <div className="border-t border-gray-100 p-3 bg-gray-50 flex justify-between">
//                 <Link
//                     to={`/lead/${_id}`}
//                     className="flex items-center justify-center px-3 py-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
//                 >
//                     <EyeIcon className="w-4 h-4 mr-1" />
//                     <span>View</span>
//                 </Link>

//                 <Link
//                     to={`/edit-lead/${_id}`}
//                     className="flex items-center justify-center px-3 py-1.5 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
//                 >
//                     <PencilIcon className="w-4 h-4 mr-1" />
//                     <span>Edit</span>
//                 </Link>

//                 <button
//                     onClick={() => onDeleteClick(lead)}
//                     className="flex items-center justify-center px-3 py-1.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
//                 >
//                     <TrashIcon className="w-4 h-4 mr-1" />
//                     <span>Delete</span>
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default LeadCard;

// import React from 'react';
// import { Link } from 'react-router-dom';
// import { formatDate } from '../../../utils/formatters';
// import { EyeIcon, PencilIcon, TrashIcon, MapPinIcon } from 'lucide-react';
// import { useSelector } from 'react-redux';
// import { Button } from 'antd';
// import { base_url } from '../../../utils/base_url';

// const LeadCard = ({ lead, onDeleteClick, onUpdateLead }) => {
//     const { _id, propertyName, ownerName, ownerContact, images, createdAt, isCrossed } = lead;
//     const { user } = useSelector((state) => state.auth);
//     const featuredImage = images && images.length > 0
//         ? images[0].url
//         : 'https://via.placeholder.com/300x200?text=No+Image';

//     const leadAge = Math.floor((new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24));

//     const handleCrossToggle = async () => {
//         try {
//             const response = await fetch(`${base_url}/api/salesman/property/leads/${_id}/cross-status`, {
//                 method: 'PATCH',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${localStorage.getItem('token')}`
//                 },
//                 body: JSON.stringify({ isCrossed: !isCrossed })
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 // Update the local state through the parent component
//                 onUpdateLead(_id, { isCrossed: !isCrossed });
//             } else {
//                 console.error('Failed to update cross status');
//             }
//         } catch (error) {
//             console.error('Error updating cross status:', error);
//         }
//     };

//     return (
//         <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full">
//             <div className="relative h-48 overflow-hidden">
//                 <img
//                     src={featuredImage}
//                     alt={propertyName || "Property"}
//                     className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
//                 />

//                 <div className="absolute top-3 left-3">
//                     <span className="bg-blue-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">
//                         {leadAge === 0 ? 'Today' : `${leadAge} day${leadAge !== 1 ? 's' : ''} ago`}
//                     </span>
//                 </div>

//                 {images && images.length > 1 && (
//                     <div className="absolute bottom-3 right-3">
//                         <span className="bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
//                             +{images.length - 1} more
//                         </span>
//                     </div>
//                 )}
//             </div>

//             <div className='flex p-4 flex-grow items-center gap-12'>
//                 <div className="">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
//                         {propertyName || "Untitled Property"}
//                     </h3>

//                     {ownerName && (
//                         <p className="text-sm text-gray-600 mb-1">
//                             <span className="font-medium">Owner:</span> {ownerName}
//                         </p>
//                     )}

//                     {ownerContact && (
//                         <p className="text-sm text-gray-600 mb-2">
//                             <span className="font-medium">Contact:</span> {ownerContact}
//                         </p>
//                     )}

//                     <div className="flex items-center text-sm text-gray-500 mb-3">
//                         <MapPinIcon className="w-4 h-4 mr-1" />
//                         <span>
//                             {lead.location ?
//                                 `${lead.location.latitude.toFixed(6)}, ${lead.location.longitude.toFixed(6)}` :
//                                 'Location not specified'}
//                         </span>
//                     </div>

//                     <div className="text-xs text-gray-500">
//                         Created: {formatDate(createdAt)}
//                     </div>
//                     <div className="text-xs text-gray-500">
//                         Uploaded By: {lead?.salesman?.name}
//                     </div>
//                 </div>
//                 <div className='flex'>
//                     {
//                         lead?.isCrossed && (
//                             <Button>
//                                 ❌
//                             </Button>
//                         )
//                     }
//                     {
//                         user.userType === 'admin' && (
//                             <Button onClick={handleCrossToggle}>
//                                 {isCrossed ? 'Unmark' : 'Mark'}
//                             </Button>
//                         )
//                     }
//                 </div>
//             </div>

//             <div className="border-t border-gray-100 p-3 bg-gray-50 flex justify-between">
//                 <Link
//                     to={`/lead/${_id}`}
//                     className="flex items-center justify-center px-3 py-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
//                 >
//                     <EyeIcon className="w-4 h-4 mr-1" />
//                     <span>View</span>
//                 </Link>

//                 <Link
//                     to={`/edit-lead/${_id}`}
//                     className="flex items-center justify-center px-3 py-1.5 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
//                 >
//                     <PencilIcon className="w-4 h-4 mr-1" />
//                     <span>Edit</span>
//                 </Link>

//                 <button
//                     onClick={() => onDeleteClick(lead)}
//                     className="flex items-center justify-center px-3 py-1.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
//                 >
//                     <TrashIcon className="w-4 h-4 mr-1" />
//                     <span>Delete</span>
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default LeadCard;


import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../../utils/formatters';
import { EyeIcon, PencilIcon, TrashIcon, MapPinIcon, UserIcon, PhoneIcon, CalendarIcon, ImageIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Button } from 'antd';
import { base_url } from '../../../utils/base_url';

const LeadCard = ({ lead, onDeleteClick, onUpdateLead }) => {
    const { _id, propertyName, ownerName, ownerContact, images, createdAt, isCrossed } = lead;
    const { user } = useSelector((state) => state.auth);
    const featuredImage = images && images.length > 0
        ? images[0].url
        : 'https://via.placeholder.com/300x200?text=No+Image';

    const leadAge = Math.floor((new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24));

    const handleCrossToggle = async () => {
        try {
            const response = await fetch(`${base_url}/api/salesman/property/leads/${_id}/cross-status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ isCrossed: !isCrossed })
            });

            if (response.ok) {
                const data = await response.json();
                onUpdateLead(_id, { isCrossed: !isCrossed });
            } else {
                console.error('Failed to update cross status');
            }
        } catch (error) {
            console.error('Error updating cross status:', error);
        }
    };

    const getLeadAgeColor = () => {
        if (leadAge === 0) return 'bg-green-500';
        if (leadAge <= 3) return 'bg-blue-500';
        if (leadAge <= 7) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full border ${isCrossed ? 'border-red-500 opacity-100 border-2 animate-pulse' : 'border-gray-100 hover:border-blue-200'}`}>
            {/* Header with crossed status indicator */}
            {isCrossed && (
                <div className="bg-red-50 border-b border-red-100 px-3 py-1.5">
                    <div className="flex items-center justify-center">
                        <span className="text-red-600 text-xs font-medium flex items-center">
                            <span className="mr-1">❌</span>
                            Crossed
                        </span>
                    </div>
                </div>
            )}

            {/* Image Section */}
            <div className="relative h-52 overflow-hidden">
                <img
                    src={featuredImage}
                    alt={propertyName || "Property"}
                    className={`w-full h-full object-cover transition-all duration-500 hover:scale-105 `}
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                {/* Lead Age Badge */}
                <div className="absolute top-2 left-2">
                    <span className={`${getLeadAgeColor()} text-white text-xs font-medium px-2 py-1 rounded-full shadow-sm`}>
                        {leadAge === 0 ? '🔥 Today' : `${leadAge}d`}
                    </span>
                </div>

                {/* Image Count Badge */}
                {images && images.length > 1 && (
                    <div className="absolute bottom-2 right-2">
                        <span className="bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full flex items-center shadow-sm">
                            <ImageIcon className="w-3 h-3 mr-1" />
                            +{images.length - 1}
                        </span>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className='flex-1 p-3'>
                <div className="mb-3">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 leading-tight">
                        {propertyName || "Untitled Property"}
                    </h3>

                    <div className='flex justify-between'>
                        <div className="space-y-1.5">
                            {ownerName && (
                                <div className="flex items-center text-gray-700">
                                    <UserIcon className="w-3.5 h-3.5 mr-2 text-blue-500 flex-shrink-0" />
                                    <span className="text-xs truncate">
                                        <span className="font-medium text-gray-900">Owner:</span> {ownerName}
                                    </span>
                                </div>
                            )}

                            {ownerContact && (
                                <div className="flex items-center text-gray-700">
                                    <PhoneIcon className="w-3.5 h-3.5 mr-2 text-green-500 flex-shrink-0" />
                                    <span className="text-xs truncate">
                                        <span className="font-medium text-gray-900">Contact:</span> {ownerContact}
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center text-gray-700">
                                <MapPinIcon className="w-3.5 h-3.5 mr-2 text-red-500 flex-shrink-0" />
                                <span className="text-xs truncate">
                                    {lead.location ?
                                        `${lead.location.latitude.toFixed(2)}, ${lead.location.longitude.toFixed(2)}` :
                                        'Location not specified'}
                                </span>
                            </div>
                        </div>
                        <div>
                            {
                                isCrossed && '❌'
                            }
                        </div>
                    </div>

                    {/* Meta Information */}
                    <div className="mt-2 pt-2 border-t border-gray-100">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center">
                                <CalendarIcon className="w-3 h-3 mr-1" />
                                {formatDate(createdAt)}
                            </div>
                            {lead?.salesman?.name && (
                                <div className="text-right truncate ml-2">
                                    <span className="font-medium">By:</span> {lead.salesman.name}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Admin Controls */}
                {user.userType === 'admin' && (
                    <div className="">
                        <Button
                            onClick={handleCrossToggle}
                            className={`w-full ${isCrossed ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' : 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100'}`}
                            size="small"
                        >
                            {isCrossed ? '✅ Unmark' : '❌ Mark as Wrong'}
                        </Button>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="border-t border-gray-100 p-2 bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="flex gap-1">
                    <Link
                        to={`/lead/${_id}`}
                        className="flex-1 flex items-center justify-center px-2 py-1.5 text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 hover:text-blue-800 transition-all duration-200 font-medium text-xs border border-blue-200 hover:border-blue-300"
                    >
                        <EyeIcon className="w-3.5 h-3.5 mr-1" />
                        View
                    </Link>

                    <Link
                        to={`/edit-lead/${_id}`}
                        className="flex-1 flex items-center justify-center px-2 py-1.5 text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 hover:text-indigo-800 transition-all duration-200 font-medium text-xs border border-indigo-200 hover:border-indigo-300"
                    >
                        <PencilIcon className="w-3.5 h-3.5 mr-1" />
                        Edit
                    </Link>

                    <button
                        onClick={() => onDeleteClick(lead)}
                        className="flex-1 flex items-center justify-center px-2 py-1.5 text-red-700 bg-red-50 rounded-lg hover:bg-red-100 hover:text-red-800 transition-all duration-200 font-medium text-xs border border-red-200 hover:border-red-300"
                    >
                        <TrashIcon className="w-3.5 h-3.5 mr-1" />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LeadCard;