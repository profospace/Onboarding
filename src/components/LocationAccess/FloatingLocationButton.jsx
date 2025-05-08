// import React, { useState, useEffect } from 'react';

// const FloatingLocationButton = ({ position = 'bottom-right' }) => {
//     const [locationStatus, setLocationStatus] = useState('checking'); // checking, granted, denied, unavailable, timeout
//     const [loading, setLoading] = useState(false);
//     const [isExpanded, setIsExpanded] = useState(true);

//     // Function to request location permission
//     const requestLocationAccess = () => {
//         setLoading(true);

//         if (!navigator.geolocation) {
//             setLocationStatus('unavailable');
//             setLoading(false);
//             return;
//         }

//         // Setup timeout for geolocation request
//         const timeoutId = setTimeout(() => {
//             setLocationStatus('timeout');
//             setLoading(false);
//         }, 10000); // 10 second timeout

//         // This will trigger the browser's permission dialog if permission is not already granted
//         navigator.geolocation.getCurrentPosition(
//             (position) => {
//                 clearTimeout(timeoutId);
//                 setLocationStatus('granted');
//                 setLoading(false);
//             },
//             (error) => {
//                 clearTimeout(timeoutId);
//                 switch (error.code) {
//                     case error.PERMISSION_DENIED:
//                         setLocationStatus('denied');
//                         break;
//                     case error.POSITION_UNAVAILABLE:
//                         setLocationStatus('unavailable');
//                         break;
//                     case error.TIMEOUT:
//                         setLocationStatus('timeout');
//                         break;
//                     default:
//                         setLocationStatus('denied');
//                 }
//                 setLoading(false);
//             },
//             { enableHighAccuracy: true, timeout: 9000, maximumAge: 0 }
//         );
//     };

//     // Check location permission status on component mount
//     useEffect(() => {
//         if (!navigator.geolocation) {
//             setLocationStatus('unavailable');
//             return;
//         }

//         // Try to get the location to determine permission status
//         if (navigator.permissions && navigator.permissions.query) {
//             navigator.permissions.query({ name: 'geolocation' })
//                 .then((permissionStatus) => {
//                     setLocationStatus(permissionStatus.state === 'granted' ? 'granted' :
//                         permissionStatus.state === 'denied' ? 'denied' : 'checking');

//                     // Listen for permission changes
//                     permissionStatus.onchange = () => {
//                         setLocationStatus(permissionStatus.state === 'granted' ? 'granted' :
//                             permissionStatus.state === 'denied' ? 'denied' : 'checking');
//                     };
//                 })
//                 .catch(() => {
//                     // If permissions API is not available, try to get location directly
//                     requestLocationAccess();
//                 });
//         } else {
//             // For browsers that don't support the permissions API
//             navigator.geolocation.getCurrentPosition(
//                 () => setLocationStatus('granted'),
//                 (error) => {
//                     if (error.code === error.PERMISSION_DENIED) {
//                         setLocationStatus('denied');
//                     } else if (error.code === error.POSITION_UNAVAILABLE) {
//                         setLocationStatus('unavailable');
//                     } else {
//                         setLocationStatus('denied');
//                     }
//                 },
//                 { timeout: 5000 }
//             );
//         }
//     }, []);

//     // Get position styles based on the position prop
//     const getPositionStyles = () => {
//         const positions = {
//             'top-left': 'top-4 left-4',
//             'top-right': 'top-4 right-4',
//             'top': 'top-4 left-1/2 transform -translate-x-1/2',
//             'bottom-left': 'bottom-4 left-4',
//             'bottom-right': 'bottom-4 right-4',
//             'bottom': 'bottom-4 left-1/2 transform -translate-x-1/2',
//             'left': 'left-4 top-1/2 transform -translate-y-1/2',
//             'right': 'right-4 top-1/2 transform -translate-y-1/2'
//         };

//         return positions[position] || positions['bottom-right'];
//     };

//     // Get icon and color based on location status
//     const getStatusInfo = () => {
//         switch (locationStatus) {
//             case 'checking':
//                 return {
//                     icon: (
//                         <svg className="w-6 h-6 text-blue-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//                         </svg>
//                     ),
//                     title: 'Checking location access...',
//                     description: 'Please wait while we check your location settings',
//                     bgColor: 'bg-blue-50',
//                     borderColor: 'border-blue-200',
//                     textColor: 'text-blue-700',
//                     iconBgColor: 'bg-blue-100'
//                 };
//             case 'granted':
//                 return {
//                     icon: (
//                         <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
//                         </svg>
//                     ),
//                     title: 'Location Access Granted',
//                     description: 'We can now show you properties near your location',
//                     bgColor: 'bg-green-50',
//                     borderColor: 'border-green-200',
//                     textColor: 'text-green-700',
//                     iconBgColor: 'bg-green-100'
//                 };
//             case 'denied':
//                 return {
//                     icon: (
//                         <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
//                         </svg>
//                     ),
//                     title: 'Location Access Blocked',
//                     description: 'Enable location access to see properties near you',
//                     bgColor: 'bg-red-50',
//                     borderColor: 'border-red-200',
//                     textColor: 'text-red-700',
//                     iconBgColor: 'bg-red-100'
//                 };
//             case 'unavailable':
//                 return {
//                     icon: (
//                         <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//                         </svg>
//                     ),
//                     title: 'Location Services Unavailable',
//                     description: 'Your device does not support location services',
//                     bgColor: 'bg-yellow-50',
//                     borderColor: 'border-yellow-200',
//                     textColor: 'text-yellow-700',
//                     iconBgColor: 'bg-yellow-100'
//                 };
//             case 'timeout':
//                 return {
//                     icon: (
//                         <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//                         </svg>
//                     ),
//                     title: 'Location Request Timed Out',
//                     description: 'Please try again when you have better connectivity',
//                     bgColor: 'bg-orange-50',
//                     borderColor: 'border-orange-200',
//                     textColor: 'text-orange-700',
//                     iconBgColor: 'bg-orange-100'
//                 };
//             default:
//                 return {
//                     icon: (
//                         <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//                         </svg>
//                     ),
//                     title: 'Location Status Unknown',
//                     description: 'There was an issue determining your location status',
//                     bgColor: 'bg-gray-50',
//                     borderColor: 'border-gray-200',
//                     textColor: 'text-gray-700',
//                     iconBgColor: 'bg-gray-100'
//                 };
//         }
//     };

//     const statusInfo = getStatusInfo();
//     const positionClasses = getPositionStyles();

//     return (
//         <div className={`fixed ${positionClasses} z-50 transition-all duration-300`}>
//             {isExpanded ? (
//                 <div className={`rounded-lg shadow-md border ${statusInfo.borderColor} ${statusInfo.bgColor} p-4 transition-all duration-300 max-w-md`}>
//                     <div className="flex items-start">
//                         <div className="flex-shrink-0 mt-1">
//                             {statusInfo.icon}
//                         </div>

//                         <div className="ml-3 flex-grow">
//                             <div className="flex justify-between items-center">
//                                 <h3 className={`text-sm font-medium ${statusInfo.textColor}`}>
//                                     {statusInfo.title}
//                                 </h3>
//                                 <button
//                                     onClick={() => setIsExpanded(false)}
//                                     className="text-gray-400 hover:text-gray-600 focus:outline-none"
//                                 >
//                                     <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
//                                     </svg>
//                                 </button>
//                             </div>
//                             <div className="mt-1 text-sm">
//                                 <p className={`${statusInfo.textColor} opacity-80`}>
//                                     {statusInfo.description}
//                                 </p>
//                             </div>

//                             {['denied', 'timeout'].includes(locationStatus) && (
//                                 <div className="mt-4">
//                                     <button
//                                         onClick={requestLocationAccess}
//                                         disabled={loading}
//                                         className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                                     >
//                                         {loading ? (
//                                             <>
//                                                 <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                                 </svg>
//                                                 Processing...
//                                             </>
//                                         ) : (
//                                             <>
//                                                 <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
//                                                 </svg>
//                                                 Enable Location Access
//                                             </>
//                                         )}
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             ) : (
//                 <button
//                     onClick={() => setIsExpanded(true)}
//                     className={`h-12 w-12 rounded-full shadow-lg flex items-center justify-center ${statusInfo.iconBgColor} hover:opacity-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
//                     title={statusInfo.title}
//                 >
//                     {statusInfo.icon}
//                 </button>
//             )}
//         </div>
//     );
// };

// export default FloatingLocationButton;


// import React, { useState, useEffect } from 'react';

// const FloatingLocationButton = ({ position = 'bottom-right' }) => {
//     const [locationStatus, setLocationStatus] = useState('checking'); // checking, granted, denied, unavailable, timeout
//     const [loading, setLoading] = useState(false);
//     const [isExpanded, setIsExpanded] = useState(true);

//     // Function to request location permission
//     const requestLocationAccess = () => {
//         setLoading(true);

//         if (!navigator.geolocation) {
//             setLocationStatus('unavailable');
//             setLoading(false);
//             return;
//         }

//         // Setup timeout for geolocation request
//         const timeoutId = setTimeout(() => {
//             setLocationStatus('timeout');
//             setLoading(false);
//         }, 10000); // 10 second timeout

//         // Force reopening the browser permission prompt by using specific options
//         const options = {
//             enableHighAccuracy: true,
//             timeout: 9000,
//             maximumAge: 0
//         };

//         // To handle browsers that cache permission decisions, we can try to make the request
//         // appear different to the browser by using a unique set of options
//         if (locationStatus === 'denied') {
//             // Some browsers may reopen the permission dialog if we change these params
//             // This is a widely used technique to trigger the permission dialog again
//             options.maximumAge = Math.floor(Math.random() * 100);
//         }

//         // This will trigger the browser's permission dialog if permission is not already granted
//         navigator.geolocation.getCurrentPosition(
//             (position) => {
//                 clearTimeout(timeoutId);
//                 setLocationStatus('granted');
//                 setLoading(false);
//             },
//             (error) => {
//                 clearTimeout(timeoutId);
//                 switch (error.code) {
//                     case error.PERMISSION_DENIED:
//                         setLocationStatus('denied');
//                         // If it's still denied, we should provide additional guidance
//                         if (locationStatus === 'denied') {
//                             // Could expose a helper function here to guide users to their browser settings
//                             console.log('User needs to enable location in browser settings');
//                         }
//                         break;
//                     case error.POSITION_UNAVAILABLE:
//                         setLocationStatus('unavailable');
//                         break;
//                     case error.TIMEOUT:
//                         setLocationStatus('timeout');
//                         break;
//                     default:
//                         setLocationStatus('denied');
//                 }
//                 setLoading(false);
//             },
//             options
//         );
//     };

//     // Check location permission status on component mount
//     useEffect(() => {
//         if (!navigator.geolocation) {
//             setLocationStatus('unavailable');
//             return;
//         }

//         // Try to get the location to determine permission status
//         if (navigator.permissions && navigator.permissions.query) {
//             navigator.permissions.query({ name: 'geolocation' })
//                 .then((permissionStatus) => {
//                     setLocationStatus(permissionStatus.state === 'granted' ? 'granted' :
//                         permissionStatus.state === 'denied' ? 'denied' : 'checking');

//                     // Listen for permission changes
//                     permissionStatus.onchange = () => {
//                         setLocationStatus(permissionStatus.state === 'granted' ? 'granted' :
//                             permissionStatus.state === 'denied' ? 'denied' : 'checking');
//                     };
//                 })
//                 .catch(() => {
//                     // If permissions API is not available, try to get location directly
//                     requestLocationAccess();
//                 });
//         } else {
//             // For browsers that don't support the permissions API
//             navigator.geolocation.getCurrentPosition(
//                 () => setLocationStatus('granted'),
//                 (error) => {
//                     if (error.code === error.PERMISSION_DENIED) {
//                         setLocationStatus('denied');
//                     } else if (error.code === error.POSITION_UNAVAILABLE) {
//                         setLocationStatus('unavailable');
//                     } else {
//                         setLocationStatus('denied');
//                     }
//                 },
//                 { timeout: 5000 }
//             );
//         }
//     }, []);

//     // Get position styles based on the position prop
//     const getPositionStyles = () => {
//         const positions = {
//             'top-left': 'top-4 left-4',
//             'top-right': 'top-4 right-4',
//             'top': 'top-4 left-1/2 transform -translate-x-1/2',
//             'bottom-left': 'bottom-4 left-4',
//             'bottom-right': 'bottom-4 right-4',
//             'bottom': 'bottom-4 left-1/2 transform -translate-x-1/2',
//             'left': 'left-4 top-1/2 transform -translate-y-1/2',
//             'right': 'right-4 top-1/2 transform -translate-y-1/2'
//         };

//         return positions[position] || positions['bottom-right'];
//     };

//     // Get icon and color based on location status
//     const getStatusInfo = () => {
//         switch (locationStatus) {
//             case 'checking':
//                 return {
//                     icon: (
//                         <svg className="w-6 h-6 text-blue-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//                         </svg>
//                     ),
//                     title: 'Checking location access...',
//                     description: 'Please wait while we check your location settings',
//                     bgColor: 'bg-blue-50',
//                     borderColor: 'border-blue-200',
//                     textColor: 'text-blue-700',
//                     iconBgColor: 'bg-blue-100'
//                 };
//             case 'granted':
//                 return {
//                     icon: (
//                         <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
//                         </svg>
//                     ),
//                     title: 'Location Access Granted',
//                     description: 'We can now show you properties near your location',
//                     bgColor: 'bg-green-50',
//                     borderColor: 'border-green-200',
//                     textColor: 'text-green-700',
//                     iconBgColor: 'bg-green-100'
//                 };
//             case 'denied':
//                 return {
//                     icon: (
//                         <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
//                         </svg>
//                     ),
//                     title: 'Location Access Blocked',
//                     description: 'Enable location access to see properties near you',
//                     bgColor: 'bg-red-50',
//                     borderColor: 'border-red-200',
//                     textColor: 'text-red-700',
//                     iconBgColor: 'bg-red-100'
//                 };
//             case 'unavailable':
//                 return {
//                     icon: (
//                         <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//                         </svg>
//                     ),
//                     title: 'Location Services Unavailable',
//                     description: 'Your device does not support location services',
//                     bgColor: 'bg-yellow-50',
//                     borderColor: 'border-yellow-200',
//                     textColor: 'text-yellow-700',
//                     iconBgColor: 'bg-yellow-100'
//                 };
//             case 'timeout':
//                 return {
//                     icon: (
//                         <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//                         </svg>
//                     ),
//                     title: 'Location Request Timed Out',
//                     description: 'Please try again when you have better connectivity',
//                     bgColor: 'bg-orange-50',
//                     borderColor: 'border-orange-200',
//                     textColor: 'text-orange-700',
//                     iconBgColor: 'bg-orange-100'
//                 };
//             default:
//                 return {
//                     icon: (
//                         <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//                         </svg>
//                     ),
//                     title: 'Location Status Unknown',
//                     description: 'There was an issue determining your location status',
//                     bgColor: 'bg-gray-50',
//                     borderColor: 'border-gray-200',
//                     textColor: 'text-gray-700',
//                     iconBgColor: 'bg-gray-100'
//                 };
//         }
//     };

//     const statusInfo = getStatusInfo();
//     const positionClasses = getPositionStyles();

//     return (
//         <div className={`fixed ${positionClasses} z-50 transition-all duration-300`}>
//             {isExpanded ? (
//                 <div className={`rounded-lg shadow-md border ${statusInfo.borderColor} ${statusInfo.bgColor} p-4 transition-all duration-300 max-w-md`}>
//                     <div className="flex items-start">
//                         <div className="flex-shrink-0 mt-1">
//                             {statusInfo.icon}
//                         </div>

//                         <div className="ml-3 flex-grow">
//                             <div className="flex justify-between items-center">
//                                 <h3 className={`text-sm font-medium ${statusInfo.textColor}`}>
//                                     {statusInfo.title}
//                                 </h3>
//                                 <button
//                                     onClick={() => setIsExpanded(false)}
//                                     className="text-gray-400 hover:text-gray-600 focus:outline-none"
//                                 >
//                                     <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
//                                     </svg>
//                                 </button>
//                             </div>
//                             <div className="mt-1 text-sm">
//                                 <p className={`${statusInfo.textColor} opacity-80`}>
//                                     {statusInfo.description}
//                                 </p>
//                             </div>

//                             {['denied', 'timeout'].includes(locationStatus) && (
//                                 <div className="mt-4">
//                                     <button
//                                         onClick={requestLocationAccess}
//                                         disabled={loading}
//                                         className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                                     >
//                                         {loading ? (
//                                             <>
//                                                 <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                                 </svg>
//                                                 Processing...
//                                             </>
//                                         ) : (
//                                             <>
//                                                 <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
//                                                 </svg>
//                                                 Enable Location Access
//                                             </>
//                                         )}
//                                     </button>

//                                     {locationStatus === 'denied' && (
//                                         <p className="mt-2 text-xs text-red-600">
//                                             If the permission dialog doesn't appear, you may need to
//                                             <button
//                                                 onClick={() => {
//                                                     // Open instructions modal or guide
//                                                     alert('To enable location access:\n\n• Chrome/Edge: Click the lock/info icon in address bar → Site Settings → Location → Allow\n\n• Safari: Go to Settings → Safari → Location → Enable\n\n• Firefox: Click the lock icon in address bar → Permission → Location → Allow');
//                                                 }}
//                                                 className="ml-1 underline text-red-700 hover:text-red-800"
//                                             >
//                                                 reset permissions in your browser settings
//                                             </button>
//                                         </p>
//                                     )}
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             ) : (
//                 <button
//                     onClick={() => setIsExpanded(true)}
//                     className={`h-12 w-12 rounded-full shadow-lg flex items-center justify-center ${statusInfo.iconBgColor} hover:opacity-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
//                     title={statusInfo.title}
//                 >
//                     {statusInfo.icon}
//                 </button>
//             )}
//         </div>
//     );
// };

// export default FloatingLocationButton;

import React, { useState, useEffect, useRef } from 'react';

const FloatingLocationButton = ({ position = 'bottom-right' }) => {
    const [locationStatus, setLocationStatus] = useState('checking'); // checking, granted, denied, unavailable, timeout
    const [loading, setLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    // Function to request location permission
    const requestLocationAccess = () => {
        setLoading(true);

        if (!navigator.geolocation) {
            setLocationStatus('unavailable');
            setLoading(false);
            return;
        }

        // For browsers that support the permissions API, we can try to request permission explicitly
        if (navigator.permissions && navigator.permissions.query) {
            navigator.permissions.query({ name: 'geolocation' })
                .then((permissionStatus) => {
                    // If permission is already denied, some browsers require clearing site data
                    // We'll try different approaches to prompt the permission dialog again
                    if (permissionStatus.state === 'denied') {
                        // Try to trigger the permission prompt by using a different context
                        // This is a common technique to force browsers to show the dialog again
                        forcePermissionDialogWithIframe();
                    } else {
                        // For prompt or granted states, we can just try to get the position
                        triggerLocationPrompt();
                    }
                })
                .catch(() => {
                    // If permissions API fails, fall back to direct request
                    triggerLocationPrompt();
                });
        } else {
            // For browsers without permissions API
            triggerLocationPrompt();
        }
    };

    // Function to specifically trigger the browser location prompt
    const triggerLocationPrompt = () => {
        // Setup timeout for geolocation request
        const timeoutId = setTimeout(() => {
            setLocationStatus('timeout');
            setLoading(false);
        }, 10000);

        // Create a unique request each time to maximize chances of showing the prompt
        const uniqueOptions = {
            enableHighAccuracy: true,
            timeout: 9000,
            // Generate a random value to make this request appear unique to the browser
            maximumAge: Math.floor(Math.random() * 100)
        };

        // Request position with unique options to try to force the permission dialog
        navigator.geolocation.getCurrentPosition(
            (position) => {
                clearTimeout(timeoutId);
                setLocationStatus('granted');
                setLoading(false);
            },
            (error) => {
                clearTimeout(timeoutId);
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setLocationStatus('denied');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setLocationStatus('unavailable');
                        break;
                    case error.TIMEOUT:
                        setLocationStatus('timeout');
                        break;
                    default:
                        setLocationStatus('denied');
                }
                setLoading(false);
            },
            uniqueOptions
        );
    };

    // Check location permission status on component mount
    useEffect(() => {
        if (!navigator.geolocation) {
            setLocationStatus('unavailable');
            return;
        }

        // Try to get the location to determine permission status
        if (navigator.permissions && navigator.permissions.query) {
            navigator.permissions.query({ name: 'geolocation' })
                .then((permissionStatus) => {
                    setLocationStatus(permissionStatus.state === 'granted' ? 'granted' :
                        permissionStatus.state === 'denied' ? 'denied' : 'checking');

                    // Listen for permission changes
                    permissionStatus.onchange = () => {
                        setLocationStatus(permissionStatus.state === 'granted' ? 'granted' :
                            permissionStatus.state === 'denied' ? 'denied' : 'checking');
                    };
                })
                .catch(() => {
                    // If permissions API is not available, try to get location directly
                    triggerLocationPrompt();
                });
        } else {
            // For browsers that don't support the permissions API
            navigator.geolocation.getCurrentPosition(
                () => setLocationStatus('granted'),
                (error) => {
                    if (error.code === error.PERMISSION_DENIED) {
                        setLocationStatus('denied');
                    } else if (error.code === error.POSITION_UNAVAILABLE) {
                        setLocationStatus('unavailable');
                    } else {
                        setLocationStatus('denied');
                    }
                },
                { timeout: 5000 }
            );
        }
    }, []);

    // Get position styles based on the position prop
    const getPositionStyles = () => {
        const positions = {
            'top-left': 'top-4 left-4',
            'top-right': 'top-4 right-4',
            'top': 'top-4 left-1/2 transform -translate-x-1/2',
            'bottom-left': 'bottom-4 left-4',
            'bottom-right': 'bottom-4 right-4',
            'bottom': 'bottom-4 left-1/2 transform -translate-x-1/2',
            'left': 'left-4 top-1/2 transform -translate-y-1/2',
            'right': 'right-4 top-1/2 transform -translate-y-1/2'
        };

        return positions[position] || positions['bottom-right'];
    };

    // Get icon and color based on location status
    const getStatusInfo = () => {
        switch (locationStatus) {
            case 'checking':
                return {
                    icon: (
                        <svg className="w-6 h-6 text-blue-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    ),
                    title: 'Checking location access...',
                    description: 'Please wait while we check your location settings',
                    bgColor: 'bg-blue-50',
                    borderColor: 'border-blue-200',
                    textColor: 'text-blue-700',
                    iconBgColor: 'bg-blue-100'
                };
            case 'granted':
                return {
                    icon: (
                        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                    ),
                    title: 'Location Access Granted',
                    description: 'We can now show you properties near your location',
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200',
                    textColor: 'text-green-700',
                    iconBgColor: 'bg-green-100'
                };
            case 'denied':
                return {
                    icon: (
                        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                    ),
                    title: 'Location Access Blocked',
                    description: 'Enable location access to see properties near you',
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-200',
                    textColor: 'text-red-700',
                    iconBgColor: 'bg-red-100'
                };
            case 'unavailable':
                return {
                    icon: (
                        <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    ),
                    title: 'Location Services Unavailable',
                    description: 'Your device does not support location services',
                    bgColor: 'bg-yellow-50',
                    borderColor: 'border-yellow-200',
                    textColor: 'text-yellow-700',
                    iconBgColor: 'bg-yellow-100'
                };
            case 'timeout':
                return {
                    icon: (
                        <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    ),
                    title: 'Location Request Timed Out',
                    description: 'Please try again when you have better connectivity',
                    bgColor: 'bg-orange-50',
                    borderColor: 'border-orange-200',
                    textColor: 'text-orange-700',
                    iconBgColor: 'bg-orange-100'
                };
            default:
                return {
                    icon: (
                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    ),
                    title: 'Location Status Unknown',
                    description: 'There was an issue determining your location status',
                    bgColor: 'bg-gray-50',
                    borderColor: 'border-gray-200',
                    textColor: 'text-gray-700',
                    iconBgColor: 'bg-gray-100'
                };
        }
    };

    const statusInfo = getStatusInfo();
    const positionClasses = getPositionStyles();

    return (
        <div className={`fixed ${positionClasses} z-50 transition-all duration-300`}>
            {isExpanded ? (
                <div className={`rounded-lg shadow-md border ${statusInfo.borderColor} ${statusInfo.bgColor} p-4 transition-all duration-300 max-w-md`}>
                    <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                            {statusInfo.icon}
                        </div>

                        <div className="ml-3 flex-grow">
                            <div className="flex justify-between items-center">
                                <h3 className={`text-sm font-medium ${statusInfo.textColor}`}>
                                    {statusInfo.title}
                                </h3>
                                <button
                                    onClick={() => setIsExpanded(false)}
                                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                            <div className="mt-1 text-sm">
                                <p className={`${statusInfo.textColor} opacity-80`}>
                                    {statusInfo.description}
                                </p>
                            </div>

                            {['denied', 'timeout'].includes(locationStatus) && (
                                <div className="mt-4">
                                    <button
                                        onClick={requestLocationAccess}
                                        disabled={loading}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                </svg>
                                                Enable Location Access
                                            </>
                                        )}
                                    </button>

                                    {locationStatus === 'denied' && (
                                        <div className="mt-2 text-xs text-red-600">
                                            <p>If the permission dialog doesn't appear:</p>
                                            <ul className="list-disc pl-5 mt-1 space-y-1">
                                                <li><strong>Chrome/Edge:</strong> Click the lock/info icon in address bar → Site Settings → Location → Allow</li>
                                                <li><strong>Safari:</strong> Go to Settings → Safari → Location → Enable</li>
                                                <li><strong>Firefox:</strong> Click the lock icon in address bar → Permission → Location → Allow</li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsExpanded(true)}
                    className={`h-12 w-12 rounded-full shadow-lg flex items-center justify-center ${statusInfo.iconBgColor} hover:opacity-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    title={statusInfo.title}
                >
                    {statusInfo.icon}
                </button>
            )}
        </div>
    );
};





export default FloatingLocationButton;