// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { MapPinIcon } from '../../components/SalesmanLeads/Icons';
// import LoadingSpinner from '../../components/SalesmanLeads/LoadingSpinner';
// import { base_url } from '../../../utils/base_url';

// const EditLeadPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [formData, setFormData] = useState({
//     propertyName: '',
//     ownerName: '',
//     ownerContact: '',
//     location: {
//       latitude: 0,
//       longitude: 0
//     }
//   });

//   useEffect(() => {
//     const fetchLead = async () => {
//       try {
//         const user = JSON.parse(localStorage.getItem('user')) || {};
//         const response = await axios.get(`${base_url}/api/salesman/property/leads/${id}`, {
//           headers: {
//             Authorization: `Bearer ${user.token}`
//           }
//         });
        
//         setFormData({
//           propertyName: response.data.data.propertyName || '',
//           ownerName: response.data.data.ownerName || '',
//           ownerContact: response.data.data.ownerContact || '',
//           location: response.data.data.location || { latitude: 0, longitude: 0 }
//         });
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching lead:', err);
//         setError('Failed to load lead data');
//         setLoading(false);
//       }
//     };

//     fetchLead();
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleLocationChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       location: {
//         ...prev.location,
//         [name]: parseFloat(value) || 0
//       }
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const user = JSON.parse(localStorage.getItem('user')) || {};
//       await axios.put(
//         `http://localhost:5000/api/salesman/property/leads/${id}`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );
//       navigate(`/lead/${id}`);
//     } catch (err) {
//       console.error('Error updating lead:', err);
//       setError('Failed to update lead');
//     }
//   };

//   if (loading) return <LoadingSpinner />;
//   if (error) return <div className="text-red-600 p-4">{error}</div>;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <MapPinIcon className="w-8 h-8 mr-3" />
//               <h1 className="text-2xl md:text-3xl font-bold">Edit Property Lead</h1>
//             </div>
//             <button
//               onClick={() => navigate(`/lead/${id}`)}
//               className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium shadow-md hover:bg-blue-50 transition-colors"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-3xl mx-auto px-4 py-8">
//         <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md overflow-hidden">
//           <div className="p-6 space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Property Name
//               </label>
//               <input
//                 type="text"
//                 name="propertyName"
//                 value={formData.propertyName}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Owner Name
//               </label>
//               <input
//                 type="text"
//                 name="ownerName"
//                 value={formData.ownerName}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Owner Contact
//               </label>
//               <input
//                 type="text"
//                 name="ownerContact"
//                 value={formData.ownerContact}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Latitude
//                 </label>
//                 <input
//                   type="number"
//                   name="latitude"
//                   value={formData.location.latitude}
//                   onChange={handleLocationChange}
//                   step="any"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Longitude
//                 </label>
//                 <input
//                   type="number"
//                   name="longitude"
//                   value={formData.location.longitude}
//                   onChange={handleLocationChange}
//                   step="any"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="px-6 py-4 bg-gray-50 border-t">
//             <button
//               type="submit"
//               className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center"
//             >
//               Update Lead
//             </button>
//           </div>
//         </form>
//       </main>
//     </div>
//   );
// };

// export default EditLeadPage;


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { MapPinIcon, LoaderIcon } from '../../components/SalesmanLeads/Icons';
import LoadingSpinner from '../../components/SalesmanLeads/LoadingSpinner';
import LocationPicker from '../../components/SalesmanLeads/LocationPicker';
import ImageUploader from '../../components/SalesmanLeads/ImageUploader';
import { base_url } from '../../../utils/base_url';

// Mock for router when no actual router is available
const useParamsMock = () => {
    return {
        id: '123'
    };
};

const useNavigateMock = () => {
    return (path) => {
        console.log(`Navigating to: ${path}`);
        toast.success(`Navigating to: ${path}`);
    };
};

const EditLeadPage = () => {

    const {id} = useParams()
    // console.log(id)
    // Use actual router hooks if available, otherwise use mocks
    // const { id } = window.location.pathname.includes('/lead/')
    //     ? useParams()
    //     : useParamsMock();

    const navigate = typeof useNavigate === 'function'
        ? useNavigate()
        : useNavigateMock();

    // States
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        propertyName: '',
        ownerName: '',
        ownerContact: '',
        location: {
            latitude: 0,
            longitude: 0
        }
    });

    // Image state
    const [imageData, setImageData] = useState({
        files: [],
        previews: [],
        captions: ['', '', '', ''],
        existingImages: []
    });

    // Address state
    const [searchAddress, setSearchAddress] = useState('');

    // Fetch lead data
    useEffect(() => {
        const fetchLead = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user')) || {};
                const response = await axios.get(`${base_url}/api/salesman/property/leads/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });

                const leadData = response.data.data;

                setFormData({
                    propertyName: leadData.propertyName || '',
                    ownerName: leadData.ownerName || '',
                    ownerContact: leadData.ownerContact || '',
                    location: leadData.location || { latitude: 0, longitude: 0 }
                });

                // Set address if available
                if (leadData.address) {
                    setSearchAddress(leadData.address);
                }

                // Set images if available
                if (leadData.images && leadData.images.length > 0) {
                    setImageData({
                        ...imageData,
                        previews: leadData.images.map(img => img.url),
                        captions: leadData.images.map(img => img.caption || ''),
                        existingImages: leadData.images
                    });
                }

                setLoading(false);
            } catch (err) {
                console.error('Error fetching lead:', err);
                setError('Failed to load lead data');
                setLoading(false);
                toast.error('Failed to load lead data');
            }
        };

        fetchLead();
    }, [id]);

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle location changes from LocationPicker
    const handleLocationChange = (newLocation) => {
        setFormData(prev => ({
            ...prev,
            location: newLocation
        }));
    };

    // Handle address changes from LocationPicker
    const handleAddressChange = (address) => {
        setSearchAddress(address);
    };

    // Handle image changes from ImageUploader
    const handleImagesChange = (imageInfo) => {
        setImageData({
            ...imageData,
            files: imageInfo.files,
            previews: imageInfo.previews,
            captions: imageInfo.captions
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const user = JSON.parse(localStorage.getItem('user')) || {};

            // Create form data for multipart submission if we have images
            const hasNewImages = imageData.files.length > 0;

            if (hasNewImages) {
                // Use FormData for multipart submission
                const leadFormData = new FormData();

                // Add basic fields
                leadFormData.append('propertyName', formData.propertyName);
                leadFormData.append('ownerName', formData.ownerName);
                leadFormData.append('ownerContact', formData.ownerContact);

                // Add location
                leadFormData.append('location', JSON.stringify(formData.location));

                // Add address if available
                // if (searchAddress) {
                //     leadFormData.append('address', searchAddress);
                // }

                // Add images and captions
                imageData.files.forEach((image, index) => {
                    leadFormData.append('images', image);
                    if (imageData.captions[index]?.trim()) {
                        leadFormData.append(`caption${index}`, imageData.captions[index]);
                    }
                });

                // Send with multipart/form-data
                await axios.put(
                    `${base_url}/api/salesman/property/leads/${id}`,
                    leadFormData,
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
            } else {
                // Use JSON for submission without new images
                await axios.put(
                    `${base_url}/api/salesman/property/leads/${id}`,
                    {
                        propertyName: formData.propertyName,
                        ownerName: formData.ownerName,
                        ownerContact: formData.ownerContact,
                        location: formData.location,
                        // address: searchAddress
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
            }

            toast.success('Lead updated successfully!');
            navigate(`/lead/${id}`);
        } catch (err) {
            console.error('Error updating lead:', err);
            setError('Failed to update lead');
            toast.error(err.response?.data?.msg || 'Failed to update lead');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <LoadingSpinner text="Loading lead data..." />;
    if (error) return <div className="text-red-600 p-4 text-center font-medium">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <MapPinIcon className="w-8 h-8 mr-3" />
                            <h1 className="text-2xl md:text-3xl font-bold">Edit Property Lead</h1>
                        </div>
                        <button
                            onClick={() => navigate(`/lead/${id}`)}
                            className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium shadow-md hover:bg-blue-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md overflow-hidden">
                    {/* Basic Information */}
                    <div className="p-6 space-y-6">
                        <h2 className="text-lg md:text-xl font-semibold text-gray-800 border-b pb-2">
                            Property Information
                        </h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Property Name
                            </label>
                            <input
                                type="text"
                                name="propertyName"
                                value={formData.propertyName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="E.g., Sunset Villa, Business Park Tower"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Owner Name
                            </label>
                            <input
                                type="text"
                                name="ownerName"
                                value={formData.ownerName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter owner's full name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Owner Contact
                            </label>
                            <input
                                type="text"
                                name="ownerContact"
                                value={formData.ownerContact}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Phone number or email"
                            />
                        </div>
                    </div>

                    {/* Location Section */}
                    <div className="p-6 space-y-6 border-t border-gray-200">
                        <h2 className="text-lg md:text-xl font-semibold text-gray-800 border-b pb-2">
                            Property Location
                        </h2>

                        <LocationPicker
                            initialLocation={formData.location}
                            onLocationChange={handleLocationChange}
                            onAddressChange={handleAddressChange}
                        />
                    </div>

                    {/* Images Section */}
                    <div className="p-6 space-y-6 border-t border-gray-200">
                        <h2 className="text-lg md:text-xl font-semibold text-gray-800 border-b pb-2">
                            Property Images
                        </h2>

                        <ImageUploader
                            initialImages={imageData.existingImages}
                            onImagesChange={handleImagesChange}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="px-6 py-4 bg-gray-50 border-t">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-3 rounded-lg font-medium text-white flex items-center justify-center
                ${isSubmitting
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 transition-colors shadow-md'
                                }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <LoaderIcon className="animate-spin -ml-1 mr-3 h-5 w-5" />
                                    Updating Lead...
                                </>
                            ) : (
                                'Update Lead'
                            )}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default EditLeadPage;