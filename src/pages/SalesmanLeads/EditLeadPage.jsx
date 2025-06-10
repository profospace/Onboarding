// // import React, { useState, useEffect } from 'react';
// // import { useParams, useNavigate } from 'react-router-dom';
// // import axios from 'axios';
// // import { MapPinIcon } from '../../components/SalesmanLeads/Icons';
// // import LoadingSpinner from '../../components/SalesmanLeads/LoadingSpinner';
// // import { base_url } from '../../../utils/base_url';

// // const EditLeadPage = () => {
// //   const { id } = useParams();
// //   const navigate = useNavigate();
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [formData, setFormData] = useState({
// //     propertyName: '',
// //     ownerName: '',
// //     ownerContact: '',
// //     location: {
// //       latitude: 0,
// //       longitude: 0
// //     }
// //   });

// //   useEffect(() => {
// //     const fetchLead = async () => {
// //       try {
// //         const user = JSON.parse(localStorage.getItem('user')) || {};
// //         const response = await axios.get(`${base_url}/api/salesman/property/leads/${id}`, {
// //           headers: {
// //             Authorization: `Bearer ${user.token}`
// //           }
// //         });
        
// //         setFormData({
// //           propertyName: response.data.data.propertyName || '',
// //           ownerName: response.data.data.ownerName || '',
// //           ownerContact: response.data.data.ownerContact || '',
// //           location: response.data.data.location || { latitude: 0, longitude: 0 }
// //         });
// //         setLoading(false);
// //       } catch (err) {
// //         console.error('Error fetching lead:', err);
// //         setError('Failed to load lead data');
// //         setLoading(false);
// //       }
// //     };

// //     fetchLead();
// //   }, [id]);

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData(prev => ({
// //       ...prev,
// //       [name]: value
// //     }));
// //   };

// //   const handleLocationChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData(prev => ({
// //       ...prev,
// //       location: {
// //         ...prev.location,
// //         [name]: parseFloat(value) || 0
// //       }
// //     }));
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       const user = JSON.parse(localStorage.getItem('user')) || {};
// //       await axios.put(
// //         `http://localhost:5000/api/salesman/property/leads/${id}`,
// //         formData,
// //         {
// //           headers: {
// //             Authorization: `Bearer ${user.token}`,
// //             'Content-Type': 'application/json'
// //           }
// //         }
// //       );
// //       navigate(`/lead/${id}`);
// //     } catch (err) {
// //       console.error('Error updating lead:', err);
// //       setError('Failed to update lead');
// //     }
// //   };

// //   if (loading) return <LoadingSpinner />;
// //   if (error) return <div className="text-red-600 p-4">{error}</div>;

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
// //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
// //           <div className="flex items-center justify-between">
// //             <div className="flex items-center">
// //               <MapPinIcon className="w-8 h-8 mr-3" />
// //               <h1 className="text-2xl md:text-3xl font-bold">Edit Property Lead</h1>
// //             </div>
// //             <button
// //               onClick={() => navigate(`/lead/${id}`)}
// //               className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium shadow-md hover:bg-blue-50 transition-colors"
// //             >
// //               Cancel
// //             </button>
// //           </div>
// //         </div>
// //       </header>

// //       <main className="max-w-3xl mx-auto px-4 py-8">
// //         <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md overflow-hidden">
// //           <div className="p-6 space-y-6">
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-1">
// //                 Property Name
// //               </label>
// //               <input
// //                 type="text"
// //                 name="propertyName"
// //                 value={formData.propertyName}
// //                 onChange={handleChange}
// //                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //               />
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-1">
// //                 Owner Name
// //               </label>
// //               <input
// //                 type="text"
// //                 name="ownerName"
// //                 value={formData.ownerName}
// //                 onChange={handleChange}
// //                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //               />
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-1">
// //                 Owner Contact
// //               </label>
// //               <input
// //                 type="text"
// //                 name="ownerContact"
// //                 value={formData.ownerContact}
// //                 onChange={handleChange}
// //                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //               />
// //             </div>

// //             <div className="grid grid-cols-2 gap-4">
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-1">
// //                   Latitude
// //                 </label>
// //                 <input
// //                   type="number"
// //                   name="latitude"
// //                   value={formData.location.latitude}
// //                   onChange={handleLocationChange}
// //                   step="any"
// //                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                 />
// //               </div>
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-1">
// //                   Longitude
// //                 </label>
// //                 <input
// //                   type="number"
// //                   name="longitude"
// //                   value={formData.location.longitude}
// //                   onChange={handleLocationChange}
// //                   step="any"
// //                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                 />
// //               </div>
// //             </div>
// //           </div>

// //           <div className="px-6 py-4 bg-gray-50 border-t">
// //             <button
// //               type="submit"
// //               className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center"
// //             >
// //               Update Lead
// //             </button>
// //           </div>
// //         </form>
// //       </main>
// //     </div>
// //   );
// // };

// // export default EditLeadPage;


// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-hot-toast';
// import { MapPinIcon, LoaderIcon } from '../../components/SalesmanLeads/Icons';
// import LoadingSpinner from '../../components/SalesmanLeads/LoadingSpinner';
// import LocationPicker from '../../components/SalesmanLeads/LocationPicker';
// import ImageUploader from '../../components/SalesmanLeads/ImageUploader';
// import { base_url } from '../../../utils/base_url';

// // Mock for router when no actual router is available
// const useParamsMock = () => {
//     return {
//         id: '123'
//     };
// };

// const useNavigateMock = () => {
//     return (path) => {
//         console.log(`Navigating to: ${path}`);
//         toast.success(`Navigating to: ${path}`);
//     };
// };

// const EditLeadPage = () => {

//     const {id} = useParams()
//     // console.log(id)
//     // Use actual router hooks if available, otherwise use mocks
//     // const { id } = window.location.pathname.includes('/lead/')
//     //     ? useParams()
//     //     : useParamsMock();

//     const navigate = typeof useNavigate === 'function'
//         ? useNavigate()
//         : useNavigateMock();

//     // States
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [formData, setFormData] = useState({
//         propertyName: '',
//         ownerName: '',
//         ownerContact: '',
//         location: {
//             latitude: 0,
//             longitude: 0
//         }
//     });

//     // Image state
//     const [imageData, setImageData] = useState({
//         files: [],
//         previews: [],
//         captions: ['', '', '', ''],
//         existingImages: []
//     });

//     // Address state
//     const [searchAddress, setSearchAddress] = useState('');

//     // Fetch lead data
//     useEffect(() => {
//         const fetchLead = async () => {
//             try {
//                 const user = JSON.parse(localStorage.getItem('user')) || {};
//                 const response = await axios.get(`${base_url}/api/salesman/property/leads/${id}`, {
//                     headers: {
//                         Authorization: `Bearer ${user.token}`
//                     }
//                 });

//                 const leadData = response.data.data;

//                 setFormData({
//                     propertyName: leadData.propertyName || '',
//                     ownerName: leadData.ownerName || '',
//                     ownerContact: leadData.ownerContact || '',
//                     location: leadData.location || { latitude: 0, longitude: 0 }
//                 });

//                 // Set address if available
//                 if (leadData.address) {
//                     setSearchAddress(leadData.address);
//                 }

//                 // Set images if available
//                 if (leadData.images && leadData.images.length > 0) {
//                     setImageData({
//                         ...imageData,
//                         previews: leadData.images.map(img => img.url),
//                         captions: leadData.images.map(img => img.caption || ''),
//                         existingImages: leadData.images
//                     });
//                 }

//                 setLoading(false);
//             } catch (err) {
//                 console.error('Error fetching lead:', err);
//                 setError('Failed to load lead data');
//                 setLoading(false);
//                 toast.error('Failed to load lead data');
//             }
//         };

//         fetchLead();
//     }, [id]);

//     // Handle form field changes
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     // Handle location changes from LocationPicker
//     const handleLocationChange = (newLocation) => {
//         setFormData(prev => ({
//             ...prev,
//             location: newLocation
//         }));
//     };

//     // Handle address changes from LocationPicker
//     const handleAddressChange = (address) => {
//         setSearchAddress(address);
//     };

//     // Handle image changes from ImageUploader
//     const handleImagesChange = (imageInfo) => {
//         setImageData({
//             ...imageData,
//             files: imageInfo.files,
//             previews: imageInfo.previews,
//             captions: imageInfo.captions
//         });
//     };

//     // Handle form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsSubmitting(true);

//         try {
//             const user = JSON.parse(localStorage.getItem('user')) || {};

//             // Create form data for multipart submission if we have images
//             const hasNewImages = imageData.files.length > 0;

//             if (hasNewImages) {
//                 // Use FormData for multipart submission
//                 const leadFormData = new FormData();

//                 // Add basic fields
//                 leadFormData.append('propertyName', formData.propertyName);
//                 leadFormData.append('ownerName', formData.ownerName);
//                 leadFormData.append('ownerContact', formData.ownerContact);

//                 // Add location
//                 leadFormData.append('location', JSON.stringify(formData.location));

//                 // Add address if available
//                 // if (searchAddress) {
//                 //     leadFormData.append('address', searchAddress);
//                 // }

//                 // Add images and captions
//                 imageData.files.forEach((image, index) => {
//                     leadFormData.append('images', image);
//                     if (imageData.captions[index]?.trim()) {
//                         leadFormData.append(`caption${index}`, imageData.captions[index]);
//                     }
//                 });

//                 // Send with multipart/form-data
//                 await axios.put(
//                     `${base_url}/api/salesman/property/leads/${id}`,
//                     leadFormData,
//                     {
//                         headers: {
//                             Authorization: `Bearer ${user.token}`,
//                             'Content-Type': 'multipart/form-data'
//                         }
//                     }
//                 );
//             } else {
//                 // Use JSON for submission without new images
//                 await axios.put(
//                     `${base_url}/api/salesman/property/leads/${id}`,
//                     {
//                         propertyName: formData.propertyName,
//                         ownerName: formData.ownerName,
//                         ownerContact: formData.ownerContact,
//                         location: formData.location,
//                         // address: searchAddress
//                     },
//                     {
//                         headers: {
//                             Authorization: `Bearer ${user.token}`,
//                             'Content-Type': 'application/json'
//                         }
//                     }
//                 );
//             }

//             toast.success('Lead updated successfully!');
//             navigate(`/lead/${id}`);
//         } catch (err) {
//             console.error('Error updating lead:', err);
//             setError('Failed to update lead');
//             toast.error(err.response?.data?.msg || 'Failed to update lead');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     if (loading) return <LoadingSpinner text="Loading lead data..." />;
//     if (error) return <div className="text-red-600 p-4 text-center font-medium">{error}</div>;

//     return (
//         <div className="min-h-screen bg-gray-50">
//             <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//                     <div className="flex items-center justify-between">
//                         <div className="flex items-center">
//                             <MapPinIcon className="w-8 h-8 mr-3" />
//                             <h1 className="text-2xl md:text-3xl font-bold">Edit Property Lead</h1>
//                         </div>
//                         <button
//                             onClick={() => navigate(`/lead/${id}`)}
//                             className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium shadow-md hover:bg-blue-50 transition-colors"
//                         >
//                             Cancel
//                         </button>
//                     </div>
//                 </div>
//             </header>

//             <main className="max-w-4xl mx-auto px-4 py-8">
//                 <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md overflow-hidden">
//                     {/* Basic Information */}
//                     <div className="p-6 space-y-6">
//                         <h2 className="text-lg md:text-xl font-semibold text-gray-800 border-b pb-2">
//                             Property Information
//                         </h2>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Property Name
//                             </label>
//                             <input
//                                 type="text"
//                                 name="propertyName"
//                                 value={formData.propertyName}
//                                 onChange={handleChange}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 placeholder="E.g., Sunset Villa, Business Park Tower"
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Owner Name
//                             </label>
//                             <input
//                                 type="text"
//                                 name="ownerName"
//                                 value={formData.ownerName}
//                                 onChange={handleChange}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 placeholder="Enter owner's full name"
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Owner Contact
//                             </label>
//                             <input
//                                 type="text"
//                                 name="ownerContact"
//                                 value={formData.ownerContact}
//                                 onChange={handleChange}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 placeholder="Phone number or email"
//                             />
//                         </div>
//                     </div>

//                     {/* Location Section */}
//                     <div className="p-6 space-y-6 border-t border-gray-200">
//                         <h2 className="text-lg md:text-xl font-semibold text-gray-800 border-b pb-2">
//                             Property Location
//                         </h2>

//                         <LocationPicker
//                             initialLocation={formData.location}
//                             onLocationChange={handleLocationChange}
//                             onAddressChange={handleAddressChange}
//                         />
//                     </div>

//                     {/* Images Section */}
//                     <div className="p-6 space-y-6 border-t border-gray-200">
//                         <h2 className="text-lg md:text-xl font-semibold text-gray-800 border-b pb-2">
//                             Property Images
//                         </h2>

//                         <ImageUploader
//                             initialImages={imageData.existingImages}
//                             onImagesChange={handleImagesChange}
//                         />
//                     </div>

//                     {/* Submit Button */}
//                     <div className="px-6 py-4 bg-gray-50 border-t">
//                         <button
//                             type="submit"
//                             disabled={isSubmitting}
//                             className={`w-full py-3 rounded-lg font-medium text-white flex items-center justify-center
//                 ${isSubmitting
//                                     ? 'bg-gray-400 cursor-not-allowed'
//                                     : 'bg-blue-600 hover:bg-blue-700 transition-colors shadow-md'
//                                 }`}
//                         >
//                             {isSubmitting ? (
//                                 <>
//                                     <LoaderIcon className="animate-spin -ml-1 mr-3 h-5 w-5" />
//                                     Updating Lead...
//                                 </>
//                             ) : (
//                                 'Update Lead'
//                             )}
//                         </button>
//                     </div>
//                 </form>
//             </main>
//         </div>
//     );
// };

// export default EditLeadPage;


// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-hot-toast';
// import { MapPinIcon, LoaderIcon } from '../../components/SalesmanLeads/Icons';
// import LoadingSpinner from '../../components/SalesmanLeads/LoadingSpinner';
// import LocationPicker from '../../components/SalesmanLeads/LocationPicker';
// import ImageUploader from '../../components/SalesmanLeads/ImageUploader';
// import CameraCapture from '../../components/SalesmanLeads/CameraCapture';
// import { base_url } from '../../../utils/base_url';

// // Mock for router when no actual router is available
// const useParamsMock = () => {
//     return {
//         id: '123'
//     };
// };

// const useNavigateMock = () => {
//     return (path) => {
//         console.log(`Navigating to: ${path}`);
//         toast.success(`Navigating to: ${path}`);
//     };
// };

// const EditLeadPage = () => {

//     const { id } = useParams()
//     // console.log(id)
//     // Use actual router hooks if available, otherwise use mocks
//     // const { id } = window.location.pathname.includes('/lead/')
//     //     ? useParams()
//     //     : useParamsMock();

//     const navigate = typeof useNavigate === 'function'
//         ? useNavigate()
//         : useNavigateMock();

//     // States
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [formData, setFormData] = useState({
//         propertyName: '',
//         ownerName: '',
//         ownerContact: '',
//         location: {
//             latitude: 0,
//             longitude: 0
//         }
//     });

//     // Image state
//     const [imageData, setImageData] = useState({
//         files: [],
//         previews: [],
//         captions: ['', '', '', ''],
//         existingImages: []
//     });

//     // Camera state
//     const [showCamera, setShowCamera] = useState(false);

//     // Address state
//     const [searchAddress, setSearchAddress] = useState('');

//     // Fetch lead data
//     useEffect(() => {
//         const fetchLead = async () => {
//             try {
//                 const user = JSON.parse(localStorage.getItem('user')) || {};
//                 const response = await axios.get(`${base_url}/api/salesman/property/leads/${id}`, {
//                     headers: {
//                         Authorization: `Bearer ${user.token}`
//                     }
//                 });

//                 const leadData = response.data.data;

//                 setFormData({
//                     propertyName: leadData.propertyName || '',
//                     ownerName: leadData.ownerName || '',
//                     ownerContact: leadData.ownerContact || '',
//                     location: leadData.location || { latitude: 0, longitude: 0 }
//                 });

//                 // Set address if available
//                 if (leadData.address) {
//                     setSearchAddress(leadData.address);
//                 }

//                 // Set images if available
//                 if (leadData.images && leadData.images.length > 0) {
//                     setImageData({
//                         ...imageData,
//                         previews: leadData.images.map(img => img.url),
//                         captions: leadData.images.map(img => img.caption || ''),
//                         existingImages: leadData.images
//                     });
//                 }

//                 setLoading(false);
//             } catch (err) {
//                 console.error('Error fetching lead:', err);
//                 setError('Failed to load lead data');
//                 setLoading(false);
//                 toast.error('Failed to load lead data');
//             }
//         };

//         fetchLead();
//     }, [id]);

//     // Handle form field changes
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     // Handle location changes from LocationPicker
//     const handleLocationChange = (newLocation) => {
//         setFormData(prev => ({
//             ...prev,
//             location: newLocation
//         }));
//     };

//     // Handle address changes from LocationPicker
//     const handleAddressChange = (address) => {
//         setSearchAddress(address);
//     };

//     // Handle image changes from ImageUploader
//     const handleImagesChange = (imageInfo) => {
//         setImageData({
//             ...imageData,
//             files: imageInfo.files,
//             previews: imageInfo.previews,
//             captions: imageInfo.captions
//         });
//     };

//     // Handle camera capture
//     const handleCameraCapture = (imageFile) => {
//         // Check if we can add more images
//         const totalImages = imageData.files.length + imageData.existingImages.length;
//         if (totalImages >= 4) {
//             toast.error('Maximum 4 images allowed');
//             return;
//         }

//         // Add the captured image to the files array
//         const newFiles = [...imageData.files, imageFile];

//         // Generate preview for the new image
//         const newPreview = URL.createObjectURL(imageFile);
//         const newPreviews = [...imageData.previews, newPreview];

//         // Add empty caption for the new image
//         const newCaptions = [...imageData.captions];
//         const currentImageCount = imageData.files.length + imageData.existingImages.length;
//         newCaptions[currentImageCount] = '';

//         setImageData({
//             ...imageData,
//             files: newFiles,
//             previews: newPreviews,
//             captions: newCaptions
//         });

//         setShowCamera(false); // Close camera after capture
//         toast.success('Photo captured successfully!');
//     };

//     // Handle form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsSubmitting(true);

//         try {
//             const user = JSON.parse(localStorage.getItem('user')) || {};

//             // Create form data for multipart submission if we have images
//             const hasNewImages = imageData.files.length > 0;

//             if (hasNewImages) {
//                 // Use FormData for multipart submission
//                 const leadFormData = new FormData();

//                 // Add basic fields
//                 leadFormData.append('propertyName', formData.propertyName);
//                 leadFormData.append('ownerName', formData.ownerName);
//                 leadFormData.append('ownerContact', formData.ownerContact);

//                 // Add location
//                 leadFormData.append('location', JSON.stringify(formData.location));

//                 // Add address if available
//                 // if (searchAddress) {
//                 //     leadFormData.append('address', searchAddress);
//                 // }

//                 // Add images and captions
//                 imageData.files.forEach((image, index) => {
//                     leadFormData.append('images', image);
//                     if (imageData.captions[index]?.trim()) {
//                         leadFormData.append(`caption${index}`, imageData.captions[index]);
//                     }
//                 });

//                 // Send with multipart/form-data
//                 await axios.put(
//                     `${base_url}/api/salesman/property/leads/${id}`,
//                     leadFormData,
//                     {
//                         headers: {
//                             Authorization: `Bearer ${user.token}`,
//                             'Content-Type': 'multipart/form-data'
//                         }
//                     }
//                 );
//             } else {
//                 // Use JSON for submission without new images
//                 await axios.put(
//                     `${base_url}/api/salesman/property/leads/${id}`,
//                     {
//                         propertyName: formData.propertyName,
//                         ownerName: formData.ownerName,
//                         ownerContact: formData.ownerContact,
//                         location: formData.location,
//                         // address: searchAddress
//                     },
//                     {
//                         headers: {
//                             Authorization: `Bearer ${user.token}`,
//                             'Content-Type': 'application/json'
//                         }
//                     }
//                 );
//             }

//             toast.success('Lead updated successfully!');
//             navigate(`/lead/${id}`);
//         } catch (err) {
//             console.error('Error updating lead:', err);
//             setError('Failed to update lead');
//             toast.error(err.response?.data?.msg || 'Failed to update lead');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     if (loading) return <LoadingSpinner text="Loading lead data..." />;
//     if (error) return <div className="text-red-600 p-4 text-center font-medium">{error}</div>;

//     return (
//         <div className="min-h-screen bg-gray-50">
//             <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//                     <div className="flex items-center justify-between">
//                         <div className="flex items-center">
//                             <MapPinIcon className="w-8 h-8 mr-3" />
//                             <h1 className="text-2xl md:text-3xl font-bold">Edit Property Lead</h1>
//                         </div>
//                         <button
//                             onClick={() => navigate(`/lead/${id}`)}
//                             className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium shadow-md hover:bg-blue-50 transition-colors"
//                         >
//                             Cancel
//                         </button>
//                     </div>
//                 </div>
//             </header>

//             <main className="max-w-4xl mx-auto px-4 py-8">
//                 <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md overflow-hidden">
//                     {/* Basic Information */}
//                     <div className="p-6 space-y-6">
//                         <h2 className="text-lg md:text-xl font-semibold text-gray-800 border-b pb-2">
//                             Property Information
//                         </h2>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Property Name
//                             </label>
//                             <input
//                                 type="text"
//                                 name="propertyName"
//                                 value={formData.propertyName}
//                                 onChange={handleChange}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 placeholder="E.g., Sunset Villa, Business Park Tower"
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Owner Name
//                             </label>
//                             <input
//                                 type="text"
//                                 name="ownerName"
//                                 value={formData.ownerName}
//                                 onChange={handleChange}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 placeholder="Enter owner's full name"
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Owner Contact
//                             </label>
//                             <input
//                                 type="text"
//                                 name="ownerContact"
//                                 value={formData.ownerContact}
//                                 onChange={handleChange}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 placeholder="Phone number or email"
//                             />
//                         </div>
//                     </div>

//                     {/* Location Section */}
//                     <div className="p-6 space-y-6 border-t border-gray-200">
//                         <h2 className="text-lg md:text-xl font-semibold text-gray-800 border-b pb-2">
//                             Property Location
//                         </h2>

//                         <LocationPicker
//                             initialLocation={formData.location}
//                             onLocationChange={handleLocationChange}
//                             onAddressChange={handleAddressChange}
//                         />
//                     </div>

//                     {/* Images Section */}
//                     <div className="p-6 space-y-6 border-t border-gray-200">
//                         <h2 className="text-lg md:text-xl font-semibold text-gray-800 border-b pb-2">
//                             Property Images
//                         </h2>

//                         <ImageUploader
//                             initialImages={imageData.existingImages}
//                             onImagesChange={handleImagesChange}
//                         />

//                         {/* Camera Capture Button */}
//                         <div className="mt-4">
//                             <button
//                                 type="button"
//                                 onClick={() => setShowCamera(true)}
//                                 disabled={imageData.files.length + imageData.existingImages.length >= 4}
//                                 className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                             >
//                                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
//                                 </svg>
//                                 Take Photo with Camera
//                             </button>
//                         </div>
//                     </div>

//                     {/* Submit Button */}
//                     <div className="px-6 py-4 bg-gray-50 border-t">
//                         <button
//                             type="submit"
//                             disabled={isSubmitting}
//                             className={`w-full py-3 rounded-lg font-medium text-white flex items-center justify-center
//                 ${isSubmitting
//                                     ? 'bg-gray-400 cursor-not-allowed'
//                                     : 'bg-blue-600 hover:bg-blue-700 transition-colors shadow-md'
//                                 }`}
//                         >
//                             {isSubmitting ? (
//                                 <>
//                                     <LoaderIcon className="animate-spin -ml-1 mr-3 h-5 w-5" />
//                                     Updating Lead...
//                                 </>
//                             ) : (
//                                 'Update Lead'
//                             )}
//                         </button>
//                     </div>
//                 </form>
//             </main>

//             {/* Camera Capture Component */}
//             <CameraCapture
//                 isOpen={showCamera}
//                 onClose={() => setShowCamera(false)}
//                 onCapture={handleCameraCapture}
//             />
//         </div>
//     );
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
import CameraCapture from '../../components/SalesmanLeads/CameraCapture';
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
    const { id } = useParams()
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

    // Enhanced image state
    const [imageData, setImageData] = useState({
        files: [],
        previews: [],
        captions: ['', '', '', ''],
        existingImages: [],
        removedExistingImages: [] // Track removed existing images
    });

    // Camera state
    const [showCamera, setShowCamera] = useState(false);
    const [capturedImagePreview, setCapturedImagePreview] = useState(null);
    const [showCapturedPreview, setShowCapturedPreview] = useState(false);

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
                    setImageData(prev => ({
                        ...prev,
                        existingImages: leadData.images,
                        captions: [
                            ...leadData.images.map(img => img.caption || ''),
                            ...Array(4 - leadData.images.length).fill('')
                        ]
                    }));
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

    // Calculate total images count
    const getTotalImagesCount = () => {
        return imageData.existingImages.length + imageData.files.length - imageData.removedExistingImages.length;
    };

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
        setImageData(prev => ({
            ...prev,
            files: imageInfo.files,
            previews: imageInfo.previews,
            captions: imageInfo.captions
        }));
    };

    // Handle removing existing images
    const handleRemoveExistingImage = (imageIndex) => {
        const imageToRemove = imageData.existingImages[imageIndex];

        setImageData(prev => ({
            ...prev,
            existingImages: prev.existingImages.filter((_, index) => index !== imageIndex),
            removedExistingImages: [...prev.removedExistingImages, imageToRemove],
            captions: prev.captions.filter((_, index) => index !== imageIndex).concat([''])
        }));

        toast.success('Image removed');
    };

    // Handle removing new uploaded images
    const handleRemoveNewImage = (imageIndex) => {
        setImageData(prev => ({
            ...prev,
            files: prev.files.filter((_, index) => index !== imageIndex),
            previews: prev.previews.filter((_, index) => index !== imageIndex)
        }));

        toast.success('Image removed');
    };

    // Handle camera capture with preview
    const handleCameraCapture = (imageFile) => {
        // Check if we can add more images
        if (getTotalImagesCount() >= 4) {
            toast.error('Maximum 4 images allowed');
            return;
        }

        // Create preview URL for the captured image
        const previewUrl = URL.createObjectURL(imageFile);
        setCapturedImagePreview({ file: imageFile, preview: previewUrl });
        setShowCapturedPreview(true);
        setShowCamera(false);
    };

    // Confirm captured image
    const confirmCapturedImage = () => {
        if (!capturedImagePreview) return;

        // Add the captured image to the files array
        const newFiles = [...imageData.files, capturedImagePreview.file];
        const newPreviews = [...imageData.previews, capturedImagePreview.preview];

        // Add empty caption for the new image
        const newCaptions = [...imageData.captions];
        const currentImageCount = getTotalImagesCount();
        if (currentImageCount < 4) {
            newCaptions[currentImageCount] = '';
        }

        setImageData(prev => ({
            ...prev,
            files: newFiles,
            previews: newPreviews,
            captions: newCaptions
        }));

        // Reset preview state
        setCapturedImagePreview(null);
        setShowCapturedPreview(false);
        toast.success('Photo added successfully!');
    };

    // Discard captured image
    const discardCapturedImage = () => {
        if (capturedImagePreview?.preview) {
            URL.revokeObjectURL(capturedImagePreview.preview);
        }
        setCapturedImagePreview(null);
        setShowCapturedPreview(false);
    };

    // Retake photo
    const retakePhoto = () => {
        discardCapturedImage();
        setShowCamera(true);
    };

    // Handle caption changes
    const handleCaptionChange = (index, value) => {
        setImageData(prev => ({
            ...prev,
            captions: prev.captions.map((caption, i) => i === index ? value : caption)
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const user = JSON.parse(localStorage.getItem('user')) || {};

            // Create form data for multipart submission if we have images or removed images
            const hasNewImages = imageData.files.length > 0;
            const hasRemovedImages = imageData.removedExistingImages.length > 0;

            if (hasNewImages || hasRemovedImages) {
                // Use FormData for multipart submission
                const leadFormData = new FormData();

                // Add basic fields
                leadFormData.append('propertyName', formData.propertyName);
                leadFormData.append('ownerName', formData.ownerName);
                leadFormData.append('ownerContact', formData.ownerContact);

                // Add location
                leadFormData.append('location', JSON.stringify(formData.location));

                // Add new images and captions
                imageData.files.forEach((image, index) => {
                    leadFormData.append('images', image);
                    const captionIndex = imageData.existingImages.length + index;
                    if (imageData.captions[captionIndex]?.trim()) {
                        leadFormData.append(`caption${index}`, imageData.captions[captionIndex]);
                    }
                });

                // Add removed image IDs
                if (hasRemovedImages) {
                    leadFormData.append('removedImages', JSON.stringify(
                        imageData.removedExistingImages.map(img => img.id)
                    ));
                }

                // Add updated captions for existing images
                const existingCaptions = {};
                imageData.existingImages.forEach((img, index) => {
                    if (imageData.captions[index] !== img.caption) {
                        existingCaptions[img.id] = imageData.captions[index];
                    }
                });
                if (Object.keys(existingCaptions).length > 0) {
                    leadFormData.append('updatedCaptions', JSON.stringify(existingCaptions));
                }

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
                        location: formData.location
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
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg md:text-xl font-semibold text-gray-800 border-b pb-2">
                                Property Images
                            </h2>
                            <span className="text-sm text-gray-500">
                                {getTotalImagesCount()}/4 images
                            </span>
                        </div>

                        {/* Existing Images Display */}
                        {imageData.existingImages.length > 0 && (
                            <div>
                                <h3 className="text-md font-medium text-gray-700 mb-3">Current Images</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {imageData.existingImages.map((image, index) => (
                                        <div key={`existing-${index}`} className="relative group">
                                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                                <img
                                                    src={image.url}
                                                    alt={`Property ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveExistingImage(index)}
                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                                </svg>
                                            </button>
                                            <input
                                                type="text"
                                                placeholder="Add caption..."
                                                value={imageData.captions[index] || ''}
                                                onChange={(e) => handleCaptionChange(index, e.target.value)}
                                                className="mt-2 w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* New Images Display */}
                        {imageData.files.length > 0 && (
                            <div>
                                <h3 className="text-md font-medium text-gray-700 mb-3">New Images</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {imageData.files.map((file, index) => (
                                        <div key={`new-${index}`} className="relative group">
                                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                                <img
                                                    src={imageData.previews[index]}
                                                    alt={`New property ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveNewImage(index)}
                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                                </svg>
                                            </button>
                                            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                                New
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Add caption..."
                                                value={imageData.captions[imageData.existingImages.length + index] || ''}
                                                onChange={(e) => handleCaptionChange(imageData.existingImages.length + index, e.target.value)}
                                                className="mt-2 w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Image Upload Component */}
                        <ImageUploader
                            initialImages={[]}
                            onImagesChange={handleImagesChange}
                            maxImages={4 - getTotalImagesCount()}
                        />

                        {/* Camera Capture Button */}
                        <div className="flex space-x-4">
                            <button
                                type="button"
                                onClick={() => setShowCamera(true)}
                                disabled={getTotalImagesCount() >= 4}
                                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0118.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                                Take Photo with Camera
                            </button>
                        </div>
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

            {/* Camera Capture Component */}
            <CameraCapture
                isOpen={showCamera}
                onClose={() => setShowCamera(false)}
                onCapture={handleCameraCapture}
            />

            {/* Captured Image Preview Modal */}
            {showCapturedPreview && capturedImagePreview && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-lg w-full">
                        <div className="p-4 border-b">
                            <h3 className="text-lg font-semibold">Photo Preview</h3>
                        </div>

                        <div className="p-4">
                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                                <img
                                    src={capturedImagePreview.preview}
                                    alt="Captured preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <p className="text-sm text-gray-600 mb-4">
                                Do you want to add this photo to your property images?
                            </p>
                        </div>

                        <div className="flex space-x-3 p-4 border-t">
                            <button
                                onClick={discardCapturedImage}
                                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Discard
                            </button>
                            <button
                                onClick={retakePhoto}
                                className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                            >
                                Retake
                            </button>
                            <button
                                onClick={confirmCapturedImage}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Add Photo
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditLeadPage;