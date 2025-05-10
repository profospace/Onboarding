// import React from 'react';
// import { Link } from 'react-router-dom';
// import { formatDate } from '../../../utils/formatters';
// import { EyeIcon, PencilIcon, TrashIcon, MapPinIcon } from './Icons';

// const LeadCard = ({ lead, onDeleteClick }) => {
//     const { _id, propertyName, ownerName, ownerContact, images, createdAt } = lead;

//     // Get first image or use placeholder
//     const featuredImage = images && images.length > 0
//         ? images[0].url
//         : 'https://via.placeholder.com/300x200?text=No+Image';

//     // Get lead age in days
//     const leadAge = Math.floor((new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24));

//     return (
//         <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full">
//             {/* Image Container */}
//             <div className="relative h-48 overflow-hidden">
//                 <img
//                     src={featuredImage}
//                     alt={propertyName || "Property"}
//                     className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
//                 />

//                 {/* Image overlay with lead age */}
//                 <div className="absolute top-3 left-3">
//                     <span className="bg-blue-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">
//                         {leadAge === 0 ? 'Today' : `${leadAge} day${leadAge !== 1 ? 's' : ''} ago`}
//                     </span>
//                 </div>

//                 {/* Image counter if more than 1 image */}
//                 {images && images.length > 1 && (
//                     <div className="absolute bottom-3 right-3">
//                         <span className="bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
//                             +{images.length - 1} more
//                         </span>
//                     </div>
//                 )}
//             </div>

//             {/* Content Container */}
//             <div className="p-4 flex-grow">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
//                     {propertyName || "Untitled Property"}
//                 </h3>

//                 {ownerName && (
//                     <p className="text-sm text-gray-600 mb-1">
//                         <span className="font-medium">Owner:</span> {ownerName}
//                     </p>
//                 )}

//                 {ownerContact && (
//                     <p className="text-sm text-gray-600 mb-2">
//                         <span className="font-medium">Contact:</span> {ownerContact}
//                     </p>
//                 )}

//                 <div className="flex items-center text-sm text-gray-500 mb-3">
//                     <MapPinIcon className="w-4 h-4 mr-1" />
//                     <span>
//                         {lead.location ?
//                             `${lead.location.latitude.toFixed(6)}, ${lead.location.longitude.toFixed(6)}` :
//                             'Location not specified'}
//                     </span>
//                 </div>

//                 <div className="text-xs text-gray-500">
//                     Created: {formatDate(createdAt)}
//                 </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="border-t border-gray-100 p-3 bg-gray-50 flex justify-between">
//                 <Link
//                     to={`/lead/${_id}`}
//                     className="flex items-center justify-center px-3 py-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
//                 >
//                     <EyeIcon className="w-4 h-4 mr-1" />
//                     <span>View</span>
//                 </Link>

//                 <Link
//                     to="/sales-leads"
//                     state={{ lead }}
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
import { EyeIcon, PencilIcon, TrashIcon, MapPinIcon } from '../SalesmanLeads/Icons';

const LeadCard = ({ lead, onDeleteClick }) => {
    const { _id, propertyName, ownerName, ownerContact, images, createdAt } = lead;

    const featuredImage = images && images.length > 0
        ? images[0].url
        : 'https://via.placeholder.com/300x200?text=No+Image';

    const leadAge = Math.floor((new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24));

    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full">
            <div className="relative h-48 overflow-hidden">
                <img
                    src={featuredImage}
                    alt={propertyName || "Property"}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />

                <div className="absolute top-3 left-3">
                    <span className="bg-blue-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                        {leadAge === 0 ? 'Today' : `${leadAge} day${leadAge !== 1 ? 's' : ''} ago`}
                    </span>
                </div>

                {images && images.length > 1 && (
                    <div className="absolute bottom-3 right-3">
                        <span className="bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
                            +{images.length - 1} more
                        </span>
                    </div>
                )}
            </div>

            <div className="p-4 flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
                    {propertyName || "Untitled Property"}
                </h3>

                {ownerName && (
                    <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Owner:</span> {ownerName}
                    </p>
                )}

                {ownerContact && (
                    <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Contact:</span> {ownerContact}
                    </p>
                )}

                <div className="flex items-center text-sm text-gray-500 mb-3">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    <span>
                        {lead.location ?
                            `${lead.location.latitude.toFixed(6)}, ${lead.location.longitude.toFixed(6)}` :
                            'Location not specified'}
                    </span>
                </div>

                <div className="text-xs text-gray-500">
                    Created: {formatDate(createdAt)}
                </div>
                <div className="text-xs text-gray-500">
                    Uploaded By: {lead?.salesman?.name}
                </div>
            </div>

            <div className="border-t border-gray-100 p-3 bg-gray-50 flex justify-between">
                <Link
                    to={`/lead/${_id}`}
                    className="flex items-center justify-center px-3 py-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                    <EyeIcon className="w-4 h-4 mr-1" />
                    <span>View</span>
                </Link>

                <Link
                    to={`/edit-lead/${_id}`}
                    className="flex items-center justify-center px-3 py-1.5 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                    <PencilIcon className="w-4 h-4 mr-1" />
                    <span>Edit</span>
                </Link>

                <button
                    onClick={() => onDeleteClick(lead)}
                    className="flex items-center justify-center px-3 py-1.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                    <TrashIcon className="w-4 h-4 mr-1" />
                    <span>Delete</span>
                </button>
            </div>
        </div>
    );
};

export default LeadCard;