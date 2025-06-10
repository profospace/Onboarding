// import React, { useState, useRef, useEffect } from 'react';
// import { GoogleMap, Marker, StandaloneSearchBox } from '@react-google-maps/api';
// import axios from 'axios';
// import { toast } from 'react-hot-toast';
// import { base_url } from '../utils/base_url';

// // Map container style - full width
// const mapContainerStyle = {
//     width: '100%',
//     height: '500px', // Increased height for better visibility
// };

// // Default center (India)
// const defaultCenter = {
//     lat: 20.5937,
//     lng: 78.9629,
// };

// // Libraries to load for Google Maps
// const libraries = ['places'];

// function SalesmanLeads() {
//     // Form state
//     const [formData, setFormData] = useState({
//         propertyName: '',
//         ownerName: '',
//         ownerContact: '',
//     });

//     // Location state
//     const [location, setLocation] = useState({
//         latitude: defaultCenter.lat,
//         longitude: defaultCenter.lng,
//     });

//     // Map reference
//     const mapRef = useRef(null);
//     const searchBoxRef = useRef(null);

//     // Loading current location state
//     const [loadingLocation, setLoadingLocation] = useState(false);

//     // Search address state
//     const [searchAddress, setSearchAddress] = useState('');

//     // Images state
//     const [images, setImages] = useState([]);
//     const [imagePreviews, setImagePreviews] = useState([]);
//     const [captions, setCaptions] = useState(['', '', '', '']);

//     // Loading state
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     // Google Maps geocoder ref
//     const geocoderRef = useRef(null);

//     // Step tracking for mobile view
//     const [currentStep, setCurrentStep] = useState(1);
//     const totalSteps = 3;

//     // Initialize geocoder and try to get user's current location on component mount
//     useEffect(() => {
//         // Try to get user's current location when component mounts
//         getCurrentLocation();
//     }, []);

//     // Initialize geocoder when map is loaded
//     const onMapLoad = (map) => {
//         geocoderRef.current = new window.google.maps.Geocoder();
//         mapRef.current = map;
//     };

//     // Handle search box load
//     const onSearchBoxLoad = (searchBox) => {
//         searchBoxRef.current = searchBox;
//     };

//     // Handle search box place selection
//     const onPlacesChanged = () => {
//         if (searchBoxRef.current) {
//             const places = searchBoxRef.current.getPlaces();

//             if (places.length === 0) {
//                 return;
//             }

//             const place = places[0];

//             if (!place.geometry || !place.geometry.location) {
//                 toast.error('No location details available for this place');
//                 return;
//             }

//             // Update location state
//             const newLocation = {
//                 latitude: place.geometry.location.lat(),
//                 longitude: place.geometry.location.lng(),
//             };

//             setLocation(newLocation);

//             // Update search address
//             setSearchAddress(place.formatted_address || '');

//             // Pan map to new location
//             if (mapRef.current) {
//                 mapRef.current.panTo({
//                     lat: newLocation.latitude,
//                     lng: newLocation.longitude
//                 });
//                 mapRef.current.setZoom(16);
//             }

//             toast.success('Location updated');
//         }
//     };

//     // Geocode address manually
//     const handleAddressSearch = () => {
//         if (!searchAddress.trim() || !geocoderRef.current) {
//             toast.error('Please enter a valid address');
//             return;
//         }

//         geocoderRef.current.geocode({ address: searchAddress }, (results, status) => {
//             if (status === 'OK' && results[0]) {
//                 const newLocation = {
//                     latitude: results[0].geometry.location.lat(),
//                     longitude: results[0].geometry.location.lng(),
//                 };

//                 setLocation(newLocation);

//                 if (mapRef.current) {
//                     mapRef.current.panTo({
//                         lat: newLocation.latitude,
//                         lng: newLocation.longitude
//                     });
//                     mapRef.current.setZoom(16);
//                 }

//                 toast.success('Location found');
//             } else {
//                 toast.error('Could not find location. Please try a different search.');
//             }
//         });
//     };

//     // Function to get current location
//     const getCurrentLocation = () => {
//         setLoadingLocation(true);
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     const newLocation = {
//                         latitude: position.coords.latitude,
//                         longitude: position.coords.longitude,
//                     };
//                     setLocation(newLocation);

//                     // If map is loaded, pan to the new location
//                     if (mapRef.current) {
//                         mapRef.current.panTo({
//                             lat: newLocation.latitude,
//                             lng: newLocation.longitude
//                         });
//                         mapRef.current.setZoom(16);
//                     }

//                     // Try to get address for the current location
//                     if (geocoderRef.current) {
//                         geocoderRef.current.geocode(
//                             { location: { lat: newLocation.latitude, lng: newLocation.longitude } },
//                             (results, status) => {
//                                 if (status === 'OK' && results[0]) {
//                                     setSearchAddress(results[0].formatted_address);
//                                 }
//                             }
//                         );
//                     }

//                     setLoadingLocation(false);
//                     toast.success('Current location detected');
//                 },
//                 (error) => {
//                     console.error('Error getting location:', error);
//                     toast.error('Failed to get current location. Please input manually.');
//                     setLoadingLocation(false);
//                 },
//                 {
//                     enableHighAccuracy: true,
//                     timeout: 5000,
//                     maximumAge: 0,
//                 }
//             );
//         } else {
//             toast.error('Geolocation is not supported by this browser');
//             setLoadingLocation(false);
//         }
//     };

//     // Handle map click to set marker position
//     const handleMapClick = (event) => {
//         const newLocation = {
//             latitude: event.latLng.lat(),
//             longitude: event.latLng.lng(),
//         };
//         setLocation(newLocation);

//         // Update address for the new location
//         if (geocoderRef.current) {
//             geocoderRef.current.geocode(
//                 { location: { lat: newLocation.latitude, lng: newLocation.longitude } },
//                 (results, status) => {
//                     if (status === 'OK' && results[0]) {
//                         setSearchAddress(results[0].formatted_address);
//                     } else {
//                         setSearchAddress('');
//                     }
//                 }
//             );
//         }

//         toast.success('Marker placed');
//     };

//     // Handle marker drag to update position
//     const handleMarkerDragEnd = (event) => {
//         const newLocation = {
//             latitude: event.latLng.lat(),
//             longitude: event.latLng.lng(),
//         };
//         setLocation(newLocation);

//         // Update address for the new location
//         if (geocoderRef.current) {
//             geocoderRef.current.geocode(
//                 { location: { lat: newLocation.latitude, lng: newLocation.longitude } },
//                 (results, status) => {
//                     if (status === 'OK' && results[0]) {
//                         setSearchAddress(results[0].formatted_address);
//                     } else {
//                         setSearchAddress('');
//                     }
//                 }
//             );
//         }

//         toast.success('Location updated');
//     };

//     // Handle manual location input changes
//     const handleLocationInputChange = (e) => {
//         const { name, value } = e.target;

//         // Only update if value is a valid number
//         if (!isNaN(value)) {
//             const updatedLocation = {
//                 ...location,
//                 [name]: parseFloat(value) || 0, // Use 0 if parsed value is NaN
//             };

//             setLocation(updatedLocation);

//             // Update map position if both coordinates are valid
//             if (mapRef.current && updatedLocation.latitude && updatedLocation.longitude) {
//                 mapRef.current.panTo({
//                     lat: updatedLocation.latitude,
//                     lng: updatedLocation.longitude
//                 });
//             }
//         }
//     };

//     // Handle search address input changes
//     const handleSearchAddressChange = (e) => {
//         setSearchAddress(e.target.value);
//     };

//     // Handle form field changes
//     const handleChange = (e) => {
//         const { name, value } = e.target;

//         if (name === 'propertySizeValue') {
//             setFormData({
//                 ...formData,
//                 propertySize: { ...formData.propertySize, value: value },
//             });
//         } else if (name === 'propertySizeUnit') {
//             setFormData({
//                 ...formData,
//                 propertySize: { ...formData.propertySize, unit: value },
//             });
//         } else {
//             setFormData({
//                 ...formData,
//                 [name]: value,
//             });
//         }
//     };

//     // Handle image selection
//     const handleImageChange = (e) => {
//         const files = Array.from(e.target.files);
//         if (files.length + images.length > 4) {
//             toast.error('Maximum 4 images allowed');
//             return;
//         }

//         // Add new images
//         setImages((prevImages) => [...prevImages, ...files]);

//         // Generate image previews
//         const newPreviews = files.map((file) => URL.createObjectURL(file));
//         setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);

//         // Add empty captions for new images
//         setCaptions((prevCaptions) => [
//             ...prevCaptions.slice(0, images.length),
//             ...Array(files.length).fill(''),
//             ...prevCaptions.slice(images.length + files.length),
//         ]);
//     };

//     // Handle image removal
//     const removeImage = (index) => {
//         setImages((prevImages) => prevImages.filter((_, i) => i !== index));

//         // Revoke object URL to prevent memory leaks
//         URL.revokeObjectURL(imagePreviews[index]);
//         setImagePreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));

//         setCaptions((prevCaptions) => [
//             ...prevCaptions.slice(0, index),
//             ...prevCaptions.slice(index + 1),
//             '',
//         ]);
//     };

//     // Handle caption changes
//     const handleCaptionChange = (index, value) => {
//         setCaptions((prevCaptions) => [
//             ...prevCaptions.slice(0, index),
//             value,
//             ...prevCaptions.slice(index + 1),
//         ]);
//     };

//     // Form validation
//     const validateForm = () => {
//         if (images.length === 0) {
//             toast.error('At least one image is required');
//             return false;
//         }
//         return true;
//     };

//     // Handle form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!validateForm()) return;

//         setIsSubmitting(true);

//         try {
//             // Create form data
//             const leadFormData = new FormData();

//             // Add basic fields
//             leadFormData.append('propertyName', formData.propertyName);
//             leadFormData.append('ownerName', formData.ownerName);
//             leadFormData.append('ownerContact', formData.ownerContact);

//             // Add location
//             leadFormData.append('location', JSON.stringify(location));
//             // Add address if available
//             if (searchAddress) {
//                 leadFormData.append('address', searchAddress);
//             }

//             // Add images and captions
//             images.forEach((image, index) => {
//                 leadFormData.append('images', image);
//                 if (captions[index].trim()) {
//                     leadFormData.append(`caption${index}`, captions[index]);
//                 }
//             });

//             // Send API request
//             const details = JSON.parse(localStorage.getItem('user')) || '';
//             const response = await axios.post(`${base_url}/api/salesman/property/leads`, leadFormData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                     'Authorization': `Bearer ${details?.token}`
//                 },
//             });

//             toast.success('Lead created successfully!');

//             // Reset form
//             setFormData({
//                 propertyName: '',
//                 ownerName: '',
//                 ownerContact: '',
//                 propertySize: { value: '', unit: 'sqft' },
//             });
//             setLocation({
//                 latitude: defaultCenter.lat,
//                 longitude: defaultCenter.lng,
//             });
//             setSearchAddress('');
//             setImages([]);
//             setImagePreviews([]);
//             setCaptions(['', '', '', '']);
//             setCurrentStep(1);

//         } catch (error) {
//             console.error('Submit error:', error);
//             toast.error(error.response?.data?.msg || 'Failed to create lead');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     // Clean up image previews when component unmounts
//     useEffect(() => {
//         return () => {
//             imagePreviews.forEach(URL.revokeObjectURL);
//         };
//     }, [imagePreviews]);

//     // Next step in mobile view
//     const nextStep = () => {
//         setCurrentStep(prev => Math.min(prev + 1, totalSteps));
//     };

//     // Previous step in mobile view
//     const prevStep = () => {
//         setCurrentStep(prev => Math.max(prev - 1, 1));
//     };

//     // Render progress indicator for mobile views
//     const renderStepIndicator = () => {
//         return (
//             <div className="md:hidden flex justify-between items-center mb-6 px-2">
//                 {[1, 2, 3].map((step) => (
//                     <div key={step} className="flex flex-col items-center">
//                         <div
//                             className={`w-8 h-8 rounded-full flex items-center justify-center 
//                             ${currentStep === step
//                                     ? 'bg-blue-600 text-white'
//                                     : currentStep > step
//                                         ? 'bg-green-500 text-white'
//                                         : 'bg-gray-200 text-gray-600'}`}
//                         >
//                             {currentStep > step ? (
//                                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
//                                 </svg>
//                             ) : (
//                                 step
//                             )}
//                         </div>
//                         <span className="text-xs mt-1">
//                             {step === 1 ? 'Details' : step === 2 ? 'Location' : 'Images'}
//                         </span>
//                     </div>
//                 ))}
//                 <div className="absolute top-0 left-0 h-1 bg-blue-500" style={{
//                     width: `${(currentStep / totalSteps) * 100}%`,
//                     transition: 'width 0.3s ease'
//                 }}></div>
//             </div>
//         );
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-6 px-4">
//             <div className="max-w-7xl mx-auto">
//                 <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//                     {/* Header */}
//                     <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-6 relative">
//                         <h1 className="text-2xl md:text-3xl font-bold text-white">Create New Property Lead</h1>
//                         <p className="text-blue-100 mt-2 text-sm md:text-base">
//                             Enter property details and location to generate a new lead
//                         </p>
//                     </div>

//                     {/* Mobile Step Indicator */}
//                     {renderStepIndicator()}

//                     {/* Form */}
//                     <form onSubmit={handleSubmit} className="p-4 md:p-8">
//                         {/* Step 1: Property & Owner Details */}
//                         <div className={`${currentStep === 1 ? 'block' : 'hidden md:block'}`}>
//                             <div className="md:grid md:grid-cols-2 md:gap-8">
//                                 {/* Left Column */}
//                                 <div className="space-y-6 mb-8 md:mb-0">
//                                     <h2 className="text-lg md:text-xl font-semibold text-gray-800 border-b pb-2">
//                                         Property Information
//                                     </h2>

//                                     {/* Property Name */}
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                                             Property Name
//                                         </label>
//                                         <input
//                                             type="text"
//                                             name="propertyName"
//                                             value={formData.propertyName}
//                                             onChange={handleChange}
//                                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                                             placeholder="E.g., Sunset Villa, Business Park Tower"
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* Right Column */}
//                                 <div className="space-y-6">
//                                     <h2 className="text-lg md:text-xl font-semibold text-gray-800 border-b pb-2">
//                                         Owner Details
//                                     </h2>

//                                     {/* Owner Name */}
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                                             Owner Name
//                                         </label>
//                                         <input
//                                             type="text"
//                                             name="ownerName"
//                                             value={formData.ownerName}
//                                             onChange={handleChange}
//                                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                                             placeholder="Enter owner's full name"
//                                         />
//                                     </div>

//                                     {/* Owner Contact */}
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                                             Owner Contact
//                                         </label>
//                                         <input
//                                             type="text"
//                                             name="ownerContact"
//                                             value={formData.ownerContact}
//                                             onChange={handleChange}
//                                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                                             placeholder="Phone number or email"
//                                         />
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Mobile Navigation Buttons */}
//                             <div className="mt-8 md:hidden">
//                                 <button
//                                     type="button"
//                                     onClick={nextStep}
//                                     className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center"
//                                 >
//                                     Next: Location
//                                     <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
//                                     </svg>
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Step 2: Location */}
//                         <div className={`${currentStep === 2 ? 'block' : 'hidden md:block'} mt-8`}>
//                             <h2 className="text-lg md:text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
//                                 Property Location
//                             </h2>

//                             {/* Search Box */}
//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Search Location
//                                 </label>
//                                 <div className="flex space-x-1.5">
//                                     <StandaloneSearchBox
//                                         onLoad={onSearchBoxLoad}
//                                         onPlacesChanged={onPlacesChanged}
//                                     >
//                                         <input
//                                             type="text"
//                                             placeholder="Search for address, landmark, city..."
//                                             value={searchAddress}
//                                             onChange={handleSearchAddressChange}
//                                             className=" px-4 py-2 w-[70vw] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                                         />
//                                     </StandaloneSearchBox>
//                                     <button
//                                         type="button"
//                                         onClick={handleAddressSearch}
//                                         className="flex-shrink-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                                     >
//                                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
//                                         </svg>
//                                     </button>
//                                 </div>
//                                 <p className="text-xs text-gray-500 mt-1">
//                                     Enter address or drag marker to update location
//                                 </p>
//                             </div>

//                             {/* Google Map - Full Width */}
//                             <div className="border border-gray-300 rounded-lg overflow-hidden shadow-md mb-4">
//                                 <GoogleMap
//                                     mapContainerStyle={mapContainerStyle}
//                                     center={{ lat: location.latitude, lng: location.longitude }}
//                                     zoom={16}
//                                     onClick={handleMapClick}
//                                     onLoad={onMapLoad}
//                                     options={{
//                                         streetViewControl: false,
//                                         mapTypeControlOptions: {
//                                             position: window.google?.maps?.ControlPosition?.TOP_RIGHT
//                                         }
//                                     }}
//                                 >
//                                     <Marker
//                                         position={{ lat: location.latitude, lng: location.longitude }}
//                                         draggable={true}
//                                         onDragEnd={handleMarkerDragEnd}
//                                     />
//                                 </GoogleMap>
//                             </div>

//                             {/* Location Inputs and Button in a single row on larger screens */}
//                             <div className="md:flex md:space-x-4 space-y-4 md:space-y-0 mb-4">
//                                 {/* Coordinates */}
//                                 <div className="grid grid-cols-2 gap-3 md:w-2/3">
//                                     {/* Latitude input */}
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                                             Latitude *
//                                         </label>
//                                         <input
//                                             type="number"
//                                             name="latitude"
//                                             value={location.latitude}
//                                             onChange={handleLocationInputChange}
//                                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                                             placeholder="Latitude"
//                                             required
//                                         />
//                                     </div>

//                                     {/* Longitude input */}
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                                             Longitude *
//                                         </label>
//                                         <input
//                                             type="number"
//                                             name="longitude"
//                                             value={location.longitude}
//                                             onChange={handleLocationInputChange}
//                                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                                             placeholder="Longitude"
//                                             required
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* Current location button */}
//                                 <div className="md:w-1/3 md:self-end">
//                                     <button
//                                         type="button"
//                                         onClick={getCurrentLocation}
//                                         disabled={loadingLocation}
//                                         className={`flex items-center justify-center px-4 py-2 rounded-lg text-white font-medium transition-all w-full h-11
//                                         ${loadingLocation
//                                                 ? 'bg-gray-400 cursor-not-allowed'
//                                                 : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
//                                             }`}
//                                     >
//                                         {loadingLocation ? (
//                                             <>
//                                                 <svg
//                                                     className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                                                     xmlns="http://www.w3.org/2000/svg"
//                                                     fill="none"
//                                                     viewBox="0 0 24 24"
//                                                 >
//                                                     <circle
//                                                         className="opacity-25"
//                                                         cx="12"
//                                                         cy="12"
//                                                         r="10"
//                                                         stroke="currentColor"
//                                                         strokeWidth="4"
//                                                     ></circle>
//                                                     <path
//                                                         className="opacity-75"
//                                                         fill="currentColor"
//                                                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                                                     ></path>
//                                                 </svg>
//                                                 Getting Location...
//                                             </>
//                                         ) : (
//                                             <>
//                                                 <svg
//                                                     className="w-4 h-4 mr-2"
//                                                     fill="none"
//                                                     stroke="currentColor"
//                                                     viewBox="0 0 24 24"
//                                                     xmlns="http://www.w3.org/2000/svg"
//                                                 >
//                                                     <path
//                                                         strokeLinecap="round"
//                                                         strokeLinejoin="round"
//                                                         strokeWidth="2"
//                                                         d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//                                                     ></path>
//                                                     <path
//                                                         strokeLinecap="round"
//                                                         strokeLinejoin="round"
//                                                         strokeWidth="2"
//                                                         d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//                                                     ></path>
//                                                 </svg>
//                                                 Use My Current Location
//                                             </>
//                                         )}
//                                     </button>
//                                 </div>
//                             </div>

//                             {/* Display selected address */}
//                             {searchAddress && (
//                                 <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//                                     <p className="text-sm text-gray-700">
//                                         <span className="font-medium">Selected Address:</span> {searchAddress}
//                                     </p>
//                                 </div>
//                             )}

//                             {/* Mobile Navigation Buttons */}
//                             <div className="mt-8 md:hidden flex space-x-3">
//                                 <button
//                                     type="button"
//                                     onClick={prevStep}
//                                     className="w-1/2 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center justify-center"
//                                 >
//                                     <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
//                                     </svg>
//                                     Back
//                                 </button>
//                                 <button
//                                     type="button"
//                                     onClick={nextStep}
//                                     className="w-1/2 py-3 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center"
//                                 >
//                                     Next: Images
//                                     <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
//                                     </svg>
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Step 3: Images */}
//                         <div className={`${currentStep === 3 ? 'block' : 'hidden md:block'} mt-8`}>
//                             <h2 className="text-lg md:text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
//                                 Property Images
//                             </h2>

//                             {/* Image Upload Section */}
//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Property Images (up to 4) *
//                                 </label>
//                                 <div className="flex items-center justify-center w-full">
//                                     <label
//                                         className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
//                                     >
//                                         <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                                             <svg
//                                                 className="w-8 h-8 mb-1 text-gray-500"
//                                                 fill="none"
//                                                 stroke="currentColor"
//                                                 viewBox="0 0 24 24"
//                                                 xmlns="http://www.w3.org/2000/svg"
//                                             >
//                                                 <path
//                                                     strokeLinecap="round"
//                                                     strokeLinejoin="round"
//                                                     strokeWidth="2"
//                                                     d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
//                                                 ></path>
//                                             </svg>
//                                             <p className="text-sm text-gray-500">
//                                                 <span className="font-medium">Click to upload</span> or drag and drop
//                                             </p>
//                                             <p className="text-xs text-gray-500">(PNG, JPG, JPEG up to 10MB)</p>
//                                         </div>
//                                         <input
//                                             type="file"
//                                             className="hidden"
//                                             accept="image/*"
//                                             multiple
//                                             onChange={handleImageChange}
//                                             disabled={images.length >= 4}
//                                         />
//                                     </label>
//                                 </div>
//                                 <p className="text-xs text-gray-500 mt-1">
//                                     {images.length}/4 images uploaded
//                                 </p>
//                             </div>

//                             {/* Image Previews with Captions */}
//                             {imagePreviews.length > 0 && (
//                                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//                                     {imagePreviews.map((preview, index) => (
//                                         <div
//                                             key={index}
//                                             className="relative border border-gray-200 rounded-lg overflow-hidden shadow-sm"
//                                         >
//                                             <img
//                                                 src={preview}
//                                                 alt={`Preview ${index + 1}`}
//                                                 className="w-full h-48 object-cover"
//                                             />
//                                             <button
//                                                 type="button"
//                                                 onClick={() => removeImage(index)}
//                                                 className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
//                                             >
//                                                 <svg
//                                                     className="w-4 h-4"
//                                                     fill="none"
//                                                     stroke="currentColor"
//                                                     viewBox="0 0 24 24"
//                                                     xmlns="http://www.w3.org/2000/svg"
//                                                 >
//                                                     <path
//                                                         strokeLinecap="round"
//                                                         strokeLinejoin="round"
//                                                         strokeWidth="2"
//                                                         d="M6 18L18 6M6 6l12 12"
//                                                     ></path>
//                                                 </svg>
//                                             </button>
//                                             <div className="p-3">
//                                                 <input
//                                                     type="text"
//                                                     placeholder="Add a caption (optional)"
//                                                     value={captions[index] || ''}
//                                                     onChange={(e) => handleCaptionChange(index, e.target.value)}
//                                                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                                 />
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}

//                             {/* Mobile Navigation Buttons */}
//                             <div className="mt-8 md:hidden flex space-x-3">
//                                 <button
//                                     type="button"
//                                     onClick={prevStep}
//                                     className="w-1/2 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center justify-center"
//                                 >
//                                     <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
//                                     </svg>
//                                     Back
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     disabled={isSubmitting}
//                                     className={`w-1/2 py-3 rounded-lg font-medium flex items-center justify-center
//                 ${isSubmitting
//                                             ? 'bg-gray-400 text-white cursor-not-allowed'
//                                             : 'bg-green-600 text-white shadow-md hover:bg-green-700 transition-colors'
//                                         }`}
//                                 >
//                                     {isSubmitting ? (
//                                         <>
//                                             <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                             </svg>
//                                             Submitting...
//                                         </>
//                                     ) : (
//                                         <>
//                                             Submit Lead
//                                             <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//                                             </svg>
//                                         </>
//                                     )}
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Desktop Submit Button - only shown on desktop view */}
//                         <div className="hidden md:block mt-8">
//                             <button
//                                 type="submit"
//                                 disabled={isSubmitting}
//                                 className={`w-full py-3 rounded-lg font-medium text-lg flex items-center justify-center
//             ${isSubmitting
//                                         ? 'bg-gray-400 text-white cursor-not-allowed'
//                                         : 'bg-green-600 text-white shadow-md hover:bg-green-700 transition-colors'
//                                     }`}
//                             >
//                                 {isSubmitting ? (
//                                     <>
//                                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                         </svg>
//                                         Creating Property Lead...
//                                     </>
//                                 ) : (
//                                     <>
//                                         Create Property Lead
//                                         <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//                                         </svg>
//                                     </>
//                                 )}
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default SalesmanLeads;

import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, Marker, StandaloneSearchBox } from '@react-google-maps/api';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { base_url } from '../utils/base_url';

// Map container style - full width
const mapContainerStyle = {
    width: '100%',
    height: '500px', // Increased height for better visibility
};

// Default center (India)
const defaultCenter = {
    lat: 20.5937,
    lng: 78.9629,
};

// Libraries to load for Google Maps
const libraries = ['places'];

function SalesmanLeads() {
    // Form state
    const [formData, setFormData] = useState({
        propertyName: '',
        ownerName: '',
        ownerContact: '',
    });

    // Location state
    const [location, setLocation] = useState({
        latitude: defaultCenter.lat,
        longitude: defaultCenter.lng,
    });

    // Map reference
    const mapRef = useRef(null);
    const searchBoxRef = useRef(null);

    // Loading current location state
    const [loadingLocation, setLoadingLocation] = useState(false);

    // Search address state
    const [searchAddress, setSearchAddress] = useState('');

    // Images state
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [captions, setCaptions] = useState(['', '', '', '']);

    // Loading state
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Google Maps geocoder ref
    const geocoderRef = useRef(null);

    // Step tracking for mobile view
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 3;

    // Camera states
    const [showCamera, setShowCamera] = useState(false);
    const [stream, setStream] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [capturedPhoto, setCapturedPhoto] = useState(null);
    const [isCameraActive, setIsCameraActive] = useState(false);

    // Initialize geocoder and try to get user's current location on component mount
    useEffect(() => {
        // Try to get user's current location when component mounts
        getCurrentLocation();
    }, []);

    // Clean up camera stream when component unmounts or camera is closed
    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    // Initialize geocoder when map is loaded
    const onMapLoad = (map) => {
        geocoderRef.current = new window.google.maps.Geocoder();
        mapRef.current = map;
    };

    // Handle search box load
    const onSearchBoxLoad = (searchBox) => {
        searchBoxRef.current = searchBox;
    };

    // Handle search box place selection
    const onPlacesChanged = () => {
        if (searchBoxRef.current) {
            const places = searchBoxRef.current.getPlaces();

            if (places.length === 0) {
                return;
            }

            const place = places[0];

            if (!place.geometry || !place.geometry.location) {
                toast.error('No location details available for this place');
                return;
            }

            // Update location state
            const newLocation = {
                latitude: place.geometry.location.lat(),
                longitude: place.geometry.location.lng(),
            };

            setLocation(newLocation);

            // Update search address
            setSearchAddress(place.formatted_address || '');

            // Pan map to new location
            if (mapRef.current) {
                mapRef.current.panTo({
                    lat: newLocation.latitude,
                    lng: newLocation.longitude
                });
                mapRef.current.setZoom(16);
            }

            toast.success('Location updated');
        }
    };

    // Geocode address manually
    const handleAddressSearch = () => {
        if (!searchAddress.trim() || !geocoderRef.current) {
            toast.error('Please enter a valid address');
            return;
        }

        geocoderRef.current.geocode({ address: searchAddress }, (results, status) => {
            if (status === 'OK' && results[0]) {
                const newLocation = {
                    latitude: results[0].geometry.location.lat(),
                    longitude: results[0].geometry.location.lng(),
                };

                setLocation(newLocation);

                if (mapRef.current) {
                    mapRef.current.panTo({
                        lat: newLocation.latitude,
                        lng: newLocation.longitude
                    });
                    mapRef.current.setZoom(16);
                }

                toast.success('Location found');
            } else {
                toast.error('Could not find location. Please try a different search.');
            }
        });
    };

    // Function to get current location
    const getCurrentLocation = () => {
        setLoadingLocation(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };
                    setLocation(newLocation);

                    // If map is loaded, pan to the new location
                    if (mapRef.current) {
                        mapRef.current.panTo({
                            lat: newLocation.latitude,
                            lng: newLocation.longitude
                        });
                        mapRef.current.setZoom(16);
                    }

                    // Try to get address for the current location
                    if (geocoderRef.current) {
                        geocoderRef.current.geocode(
                            { location: { lat: newLocation.latitude, lng: newLocation.longitude } },
                            (results, status) => {
                                if (status === 'OK' && results[0]) {
                                    setSearchAddress(results[0].formatted_address);
                                }
                            }
                        );
                    }

                    setLoadingLocation(false);
                    toast.success('Current location detected');
                },
                (error) => {
                    console.error('Error getting location:', error);
                    toast.error('Failed to get current location. Please input manually.');
                    setLoadingLocation(false);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0,
                }
            );
        } else {
            toast.error('Geolocation is not supported by this browser');
            setLoadingLocation(false);
        }
    };

    // Handle map click to set marker position
    const handleMapClick = (event) => {
        const newLocation = {
            latitude: event.latLng.lat(),
            longitude: event.latLng.lng(),
        };
        setLocation(newLocation);

        // Update address for the new location
        if (geocoderRef.current) {
            geocoderRef.current.geocode(
                { location: { lat: newLocation.latitude, lng: newLocation.longitude } },
                (results, status) => {
                    if (status === 'OK' && results[0]) {
                        setSearchAddress(results[0].formatted_address);
                    } else {
                        setSearchAddress('');
                    }
                }
            );
        }

        toast.success('Marker placed');
    };

    // Handle marker drag to update position
    const handleMarkerDragEnd = (event) => {
        const newLocation = {
            latitude: event.latLng.lat(),
            longitude: event.latLng.lng(),
        };
        setLocation(newLocation);

        // Update address for the new location
        if (geocoderRef.current) {
            geocoderRef.current.geocode(
                { location: { lat: newLocation.latitude, lng: newLocation.longitude } },
                (results, status) => {
                    if (status === 'OK' && results[0]) {
                        setSearchAddress(results[0].formatted_address);
                    } else {
                        setSearchAddress('');
                    }
                }
            );
        }

        toast.success('Location updated');
    };

    // Handle manual location input changes
    const handleLocationInputChange = (e) => {
        const { name, value } = e.target;

        // Only update if value is a valid number
        if (!isNaN(value)) {
            const updatedLocation = {
                ...location,
                [name]: parseFloat(value) || 0, // Use 0 if parsed value is NaN
            };

            setLocation(updatedLocation);

            // Update map position if both coordinates are valid
            if (mapRef.current && updatedLocation.latitude && updatedLocation.longitude) {
                mapRef.current.panTo({
                    lat: updatedLocation.latitude,
                    lng: updatedLocation.longitude
                });
            }
        }
    };

    // Handle search address input changes
    const handleSearchAddressChange = (e) => {
        setSearchAddress(e.target.value);
    };

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'propertySizeValue') {
            setFormData({
                ...formData,
                propertySize: { ...formData.propertySize, value: value },
            });
        } else if (name === 'propertySizeUnit') {
            setFormData({
                ...formData,
                propertySize: { ...formData.propertySize, unit: value },
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    // Camera Functions
    const startCamera = async () => {
        try {
            if (images.length >= 4) {
                toast.error('Maximum 4 images allowed');
                return;
            }

            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment', // Use back camera on mobile
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                }
            });

            setStream(mediaStream);
            setShowCamera(true);
            setIsCameraActive(true);
            setCapturedPhoto(null);

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
            toast.error('Unable to access camera. Please check permissions.');
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setShowCamera(false);
        setIsCameraActive(false);
        setCapturedPhoto(null);
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            // Set canvas dimensions to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Draw video frame to canvas
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert canvas to blob
            canvas.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], `camera-photo-${Date.now()}.jpg`, {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    });

                    const previewUrl = URL.createObjectURL(blob);
                    setCapturedPhoto(previewUrl);
                    setIsCameraActive(false);

                    // Stop camera stream
                    if (stream) {
                        stream.getTracks().forEach(track => track.stop());
                    }

                    toast.success('Photo captured! Review and confirm to add.');
                }
            }, 'image/jpeg', 0.9);
        }
    };

    const confirmCapturedPhoto = () => {
        if (capturedPhoto) {
            // Convert captured photo to file and add to images
            fetch(capturedPhoto)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], `camera-photo-${Date.now()}.jpg`, {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    });

                    // Add to images array
                    setImages(prevImages => [...prevImages, file]);
                    setImagePreviews(prevPreviews => [...prevPreviews, capturedPhoto]);

                    // Add empty caption
                    setCaptions(prevCaptions => [
                        ...prevCaptions.slice(0, images.length),
                        '',
                        ...prevCaptions.slice(images.length + 1),
                    ]);

                    // Close camera
                    setShowCamera(false);
                    setCapturedPhoto(null);
                    toast.success('Photo added successfully!');
                });
        }
    };

    const retakePhoto = () => {
        setCapturedPhoto(null);
        setIsCameraActive(true);
        startCamera();
    };

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
    };

    // Handle image replacement
    const replaceImage = (index) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                // Revoke old object URL
                URL.revokeObjectURL(imagePreviews[index]);

                // Update images array
                setImages(prevImages => {
                    const newImages = [...prevImages];
                    newImages[index] = file;
                    return newImages;
                });

                // Update previews array
                const newPreview = URL.createObjectURL(file);
                setImagePreviews(prevPreviews => {
                    const newPreviews = [...prevPreviews];
                    newPreviews[index] = newPreview;
                    return newPreviews;
                });

                toast.success('Image replaced successfully!');
            }
        };
        input.click();
    };

    // Handle caption changes
    const handleCaptionChange = (index, value) => {
        setCaptions((prevCaptions) => [
            ...prevCaptions.slice(0, index),
            value,
            ...prevCaptions.slice(index + 1),
        ]);
    };

    // Form validation
    const validateForm = () => {
        if (images.length === 0) {
            toast.error('At least one image is required');
            return false;
        }
        return true;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // Create form data
            const leadFormData = new FormData();

            // Add basic fields
            leadFormData.append('propertyName', formData.propertyName);
            leadFormData.append('ownerName', formData.ownerName);
            leadFormData.append('ownerContact', formData.ownerContact);

            // Add location
            leadFormData.append('location', JSON.stringify(location));
            // Add address if available
            if (searchAddress) {
                leadFormData.append('address', searchAddress);
            }

            // Add images and captions
            images.forEach((image, index) => {
                leadFormData.append('images', image);
                if (captions[index].trim()) {
                    leadFormData.append(`caption${index}`, captions[index]);
                }
            });

            // Send API request
            const details = JSON.parse(localStorage.getItem('user')) || '';
            const response = await axios.post(`${base_url}/api/salesman/property/leads`, leadFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${details?.token}`
                },
            });

            toast.success('Lead created successfully!');

            // Reset form
            setFormData({
                propertyName: '',
                ownerName: '',
                ownerContact: '',
                propertySize: { value: '', unit: 'sqft' },
            });
            setLocation({
                latitude: defaultCenter.lat,
                longitude: defaultCenter.lng,
            });
            setSearchAddress('');
            setImages([]);
            setImagePreviews([]);
            setCaptions(['', '', '', '']);
            setCurrentStep(1);

        } catch (error) {
            console.error('Submit error:', error);
            toast.error(error.response?.data?.msg || 'Failed to create lead');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Clean up image previews when component unmounts
    useEffect(() => {
        return () => {
            imagePreviews.forEach(URL.revokeObjectURL);
        };
    }, [imagePreviews]);

    // Next step in mobile view
    const nextStep = () => {
        setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    };

    // Previous step in mobile view
    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    // Render progress indicator for mobile views
    const renderStepIndicator = () => {
        return (
            <div className="md:hidden flex justify-between items-center mb-6 px-2">
                {[1, 2, 3].map((step) => (
                    <div key={step} className="flex flex-col items-center">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center 
                            ${currentStep === step
                                    ? 'bg-blue-600 text-white'
                                    : currentStep > step
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-200 text-gray-600'}`}
                        >
                            {currentStep > step ? (
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                </svg>
                            ) : (
                                step
                            )}
                        </div>
                        <span className="text-xs mt-1">
                            {step === 1 ? 'Details' : step === 2 ? 'Location' : 'Images'}
                        </span>
                    </div>
                ))}
                <div className="absolute top-0 left-0 h-1 bg-blue-500" style={{
                    width: `${(currentStep / totalSteps) * 100}%`,
                    transition: 'width 0.3s ease'
                }}></div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-6 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-6 relative">
                        <h1 className="text-2xl md:text-3xl font-bold text-white">Create New Property Lead</h1>
                        <p className="text-blue-100 mt-2 text-sm md:text-base">
                            Enter property details and location to generate a new lead
                        </p>
                    </div>

                    {/* Mobile Step Indicator */}
                    {renderStepIndicator()}

                    {/* Camera Modal */}
                    {showCamera && (
                        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg w-full max-w-lg">
                                <div className="p-4 border-b">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold">Camera</h3>
                                        <button
                                            onClick={stopCamera}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4">
                                    {isCameraActive ? (
                                        <div className="relative">
                                            <video
                                                ref={videoRef}
                                                autoPlay
                                                playsInline
                                                className="w-full h-64 object-cover rounded-lg bg-gray-200"
                                            />
                                            <div className="flex justify-center mt-4">
                                                <button
                                                    onClick={capturePhoto}
                                                    className="w-16 h-16 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white shadow-lg transition-colors"
                                                >
                                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ) : capturedPhoto ? (
                                        <div className="text-center">
                                            <img
                                                src={capturedPhoto}
                                                alt="Captured"
                                                className="w-full h-64 object-cover rounded-lg"
                                            />
                                            <div className="flex space-x-3 mt-4">
                                                <button
                                                    onClick={retakePhoto}
                                                    className="flex-1 py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                                                >
                                                    Retake
                                                </button>
                                                <button
                                                    onClick={confirmCapturedPhoto}
                                                    className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                                >
                                                    Use Photo
                                                </button>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                            <canvas ref={canvasRef} style={{ display: 'none' }} />
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-4 md:p-8">
                        {/* Step 1: Property & Owner Details */}
                        <div className={`${currentStep === 1 ? 'block' : 'hidden md:block'}`}>
                            <div className="md:grid md:grid-cols-2 md:gap-8">
                                {/* Left Column */}
                                <div className="space-y-6 mb-8 md:mb-0">
                                    <h2 className="text-lg md:text-xl font-semibold text-gray-800 border-b pb-2">
                                        Property Information
                                    </h2>

                                    {/* Property Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Property Name
                                        </label>
                                        <input
                                            type="text"
                                            name="propertyName"
                                            value={formData.propertyName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="E.g., Sunset Villa, Business Park Tower"
                                        />
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-6">
                                    <h2 className="text-lg md:text-xl font-semibold text-gray-800 border-b pb-2">
                                        Owner Details
                                    </h2>

                                    {/* Owner Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Owner Name
                                        </label>
                                        <input
                                            type="text"
                                            name="ownerName"
                                            value={formData.ownerName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="Enter owner's full name"
                                        />
                                    </div>

                                    {/* Owner Contact */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Owner Contact
                                        </label>
                                        <input
                                            type="text"
                                            name="ownerContact"
                                            value={formData.ownerContact}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="Phone number or email"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Navigation Buttons */}
                            <div className="mt-8 md:hidden">
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                                >
                                    Next: Location
                                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Step 2: Location */}
                        <div className={`${currentStep === 2 ? 'block' : 'hidden md:block'} mt-8`}>
                            <h2 className="text-lg md:text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
                                Property Location
                            </h2>

                            {/* Search Box */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Search Location
                                </label>
                                <div className="flex space-x-1.5">
                                    <StandaloneSearchBox
                                        onLoad={onSearchBoxLoad}
                                        onPlacesChanged={onPlacesChanged}
                                    >
                                        <input
                                            type="text"
                                            placeholder="Search for address, landmark, city..."
                                            value={searchAddress}
                                            onChange={handleSearchAddressChange}
                                            className=" px-4 py-2 w-[70vw] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </StandaloneSearchBox>
                                    <button
                                        type="button"
                                        onClick={handleAddressSearch}
                                        className="flex-shrink-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                        </svg>
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Enter address or drag marker to update location
                                </p>
                            </div>

                            {/* Google Map - Full Width */}
                            <div className="border border-gray-300 rounded-lg overflow-hidden shadow-md mb-4">
                                <GoogleMap
                                    mapContainerStyle={mapContainerStyle}
                                    center={{ lat: location.latitude, lng: location.longitude }}
                                    zoom={16}
                                    onClick={handleMapClick}
                                    onLoad={onMapLoad}
                                    options={{
                                        streetViewControl: false,
                                        mapTypeControlOptions: {
                                            position: window.google?.maps?.ControlPosition?.TOP_RIGHT
                                        }
                                    }}
                                >
                                    <Marker
                                        position={{ lat: location.latitude, lng: location.longitude }}
                                        draggable={true}
                                        onDragEnd={handleMarkerDragEnd}
                                    />
                                </GoogleMap>
                            </div>

                            {/* Location Inputs and Button in a single row on larger screens */}
                            <div className="md:flex md:space-x-4 space-y-4 md:space-y-0 mb-4">
                                {/* Coordinates */}
                                <div className="grid grid-cols-2 gap-3 md:w-2/3">
                                    {/* Latitude input */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Latitude *
                                        </label>
                                        <input
                                            type="number"
                                            name="latitude"
                                            value={location.latitude}
                                            onChange={handleLocationInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="Latitude"
                                            required
                                        />
                                    </div>

                                    {/* Longitude input */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Longitude *
                                        </label>
                                        <input
                                            type="number"
                                            name="longitude"
                                            value={location.longitude}
                                            onChange={handleLocationInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="Longitude"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Current location button */}
                                <div className="md:w-1/3 md:self-end">
                                    <button
                                        type="button"
                                        onClick={getCurrentLocation}
                                        disabled={loadingLocation}
                                        className={`flex items-center justify-center px-4 py-2 rounded-lg text-white font-medium transition-all w-full h-11
                                        ${loadingLocation
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                                            }`}
                                    >
                                        {loadingLocation ? (
                                            <>
                                                <svg
                                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                Getting Location...
                                            </>
                                        ) : (
                                            <>
                                                <svg
                                                    className="w-4 h-4 mr-2"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                    ></path>
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                    ></path>
                                                </svg>
                                                Use My Current Location
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Display selected address */}
                            {searchAddress && (
                                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-sm text-gray-700">
                                        <span className="font-medium">Selected Address:</span> {searchAddress}
                                    </p>
                                </div>
                            )}

                            {/* Mobile Navigation Buttons */}
                            <div className="mt-8 md:hidden flex space-x-3">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="w-1/2 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center justify-center"
                                >
                                    <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                    </svg>
                                    Back
                                </button>
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="w-1/2 py-3 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                                >
                                    Next: Images
                                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Step 3: Images */}
                        <div className={`${currentStep === 3 ? 'block' : 'hidden md:block'} mt-8`}>
                            <h2 className="text-lg md:text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
                                Property Images
                            </h2>

                            {/* Image Upload Section */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Property Images (up to 4) *
                                </label>

                                {/* Camera and Upload Options */}
                                <div className="flex space-x-3 mb-4">
                                    <button
                                        type="button"
                                        onClick={startCamera}
                                        disabled={images.length >= 4}
                                        className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors
                                            ${images.length >= 4
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                                            }`}
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        </svg>
                                        Take Photo
                                    </button>
                                    <label className={`flex items-center px-4 py-2 rounded-lg font-medium cursor-pointer transition-colors
                                        ${images.length >= 4
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-green-600 text-white hover:bg-green-700 shadow-md'
                                        }`}>
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                        </svg>
                                        Upload Files
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageChange}
                                            disabled={images.length >= 4}
                                        />
                                    </label>
                                </div>

                                <p className="text-xs text-gray-500">
                                    {images.length}/4 images uploaded • PNG, JPG, JPEG up to 10MB each
                                </p>
                            </div>

                            {/* Image Previews with Captions */}
                            {imagePreviews.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                    {imagePreviews.map((preview, index) => (
                                        <div
                                            key={index}
                                            className="relative border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                                        >
                                            <img
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-48 object-cover"
                                            />

                                            {/* Action buttons */}
                                            <div className="absolute top-2 right-2 flex space-x-1">
                                                <button
                                                    type="button"
                                                    onClick={() => replaceImage(index)}
                                                    className="bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600 transition-colors"
                                                    title="Replace Image"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                                    </svg>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                                    title="Remove Image"
                                                >
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M6 18L18 6M6 6l12 12"
                                                        ></path>
                                                    </svg>
                                                </button>
                                            </div>

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

                            {/* Mobile Navigation Buttons */}
                            <div className="mt-8 md:hidden flex space-x-3">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="w-1/2 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center justify-center"
                                >
                                    <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                    </svg>
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-1/2 py-3 rounded-lg font-medium flex items-center justify-center
                ${isSubmitting
                                            ? 'bg-gray-400 text-white cursor-not-allowed'
                                            : 'bg-green-600 text-white shadow-md hover:bg-green-700 transition-colors'
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            Submit Lead
                                            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Desktop Submit Button - only shown on desktop view */}
                        <div className="hidden md:block mt-8">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-3 rounded-lg font-medium text-lg flex items-center justify-center
            ${isSubmitting
                                        ? 'bg-gray-400 text-white cursor-not-allowed'
                                        : 'bg-green-600 text-white shadow-md hover:bg-green-700 transition-colors'
                                    }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating Property Lead...
                                    </>
                                ) : (
                                    <>
                                        Create Property Lead
                                        <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SalesmanLeads;