// // import React, { useState, useEffect } from 'react';
// // import {
// //     MapPin,
// //     Settings,
// //     Activity,
// //     Battery,
// //     Signal,
// //     Clock,
// //     AlertCircle,
// //     CheckCircle,
// //     XCircle,
// //     Wifi,
// //     WifiOff
// // } from 'lucide-react';
// // import socketService from '../../services/socketService';
// // import locationService from '../../services/locationService';

// // const SalesmanLocationTracker = () => {
// //     const [trackingSettings, setTrackingSettings] = useState(null);
// //     const [locationPermission, setLocationPermission] = useState('prompt');
// //     const [isTracking, setIsTracking] = useState(false);
// //     const [currentLocation, setCurrentLocation] = useState(null);
// //     const [batteryLevel, setBatteryLevel] = useState(null);
// //     const [isSocketConnected, setIsSocketConnected] = useState(false);
// //     const [locationStats, setLocationStats] = useState({
// //         totalUpdates: 0,
// //         lastUpdate: null,
// //         accuracy: null
// //     });
// //     const [notifications, setNotifications] = useState([]);

// //     useEffect(() => {
// //         loadTrackingSettings();
// //         checkLocationPermission();
// //         initializeSocket();
// //         getBatteryInfo();

// //         // Listen for socket notifications
// //         const handleSocketNotification = (event) => {
// //             addNotification(event.detail.message, event.detail.type);
// //         };

// //         window.addEventListener('socketNotification', handleSocketNotification);

// //         return () => {
// //             socketService.disconnect();
// //             window.removeEventListener('socketNotification', handleSocketNotification);
// //         };
// //     }, []);

// //     const initializeSocket = async () => {
// //         try {
// //             const token = localStorage.getItem('token');
// //             const userRole = 'salesman'; // You might want to get this from your auth context

// //             await socketService.connect(token, userRole);
// //             setIsSocketConnected(true);
// //         } catch (error) {
// //             console.error('Failed to connect to socket:', error);
// //             setIsSocketConnected(false);
// //             addNotification('Failed to connect to real-time service', 'error');
// //         }
// //     };

// //     const loadTrackingSettings = async () => {
// //         try {
// //             const response = await locationService.getMyTrackingSettings();
// //             setTrackingSettings(response.data);
// //             setIsTracking(response.data.trackingEnabled);
// //         } catch (error) {
// //             console.error('Error loading tracking settings:', error);
// //             addNotification('Failed to load tracking settings', 'error');
// //         }
// //     };

// //     const checkLocationPermission = async () => {
// //         if (!navigator.geolocation) {
// //             setLocationPermission('unsupported');
// //             return;
// //         }

// //         try {
// //             const permission = await navigator.permissions.query({ name: 'geolocation' });
// //             setLocationPermission(permission.state);

// //             permission.addEventListener('change', () => {
// //                 setLocationPermission(permission.state);
// //             });
// //         } catch (error) {
// //             console.error('Error checking location permission:', error);
// //         }
// //     };

// //     const getBatteryInfo = async () => {
// //         try {
// //             if ('getBattery' in navigator) {
// //                 const battery = await navigator.getBattery();
// //                 setBatteryLevel(Math.round(battery.level * 100));

// //                 battery.addEventListener('levelchange', () => {
// //                     setBatteryLevel(Math.round(battery.level * 100));
// //                 });
// //             }
// //         } catch (error) {
// //             console.error('Error getting battery info:', error);
// //         }
// //     };

// //     const requestLocationPermission = async () => {
// //         if (!navigator.geolocation) {
// //             addNotification('Geolocation is not supported by this browser', 'error');
// //             return;
// //         }

// //         try {
// //             navigator.geolocation.getCurrentPosition(
// //                 (position) => {
// //                     setLocationPermission('granted');
// //                     setCurrentLocation({
// //                         latitude: position.coords.latitude,
// //                         longitude: position.coords.longitude,
// //                         accuracy: position.coords.accuracy
// //                     });
// //                     addNotification('Location permission granted', 'success');

// //                     // Update permissions on server
// //                     locationService.updateLocationPermissions({
// //                         locationGranted: true
// //                     });
// //                 },
// //                 (error) => {
// //                     setLocationPermission('denied');
// //                     addNotification('Location permission denied', 'error');

// //                     // Update permissions on server
// //                     locationService.updateLocationPermissions({
// //                         locationGranted: false
// //                     });
// //                 },
// //                 {
// //                     enableHighAccuracy: true,
// //                     timeout: 10000,
// //                     maximumAge: 60000
// //                 }
// //             );
// //         } catch (error) {
// //             console.error('Error requesting location permission:', error);
// //             addNotification('Error requesting location permission', 'error');
// //         }
// //     };

// //     const startLocationTracking = () => {
// //         if (locationPermission !== 'granted') {
// //             addNotification('Location permission required to start tracking', 'warning');
// //             return;
// //         }

// //         if (!isSocketConnected) {
// //             addNotification('Not connected to real-time service', 'error');
// //             return;
// //         }

// //         const frequency = trackingSettings?.trackingFrequency || 30;
// //         socketService.startLocationTracking(frequency);

// //         // Send status update
// //         socketService.sendStatusUpdate('tracking', batteryLevel, true);

// //         addNotification('Location tracking started', 'success');
// //     };

// //     const stopLocationTracking = () => {
// //         socketService.stopLocationTracking();
// //         socketService.sendStatusUpdate('idle', batteryLevel, false);
// //         addNotification('Location tracking stopped', 'info');
// //     };

// //     const addNotification = (message, type) => {
// //         const notification = {
// //             id: Date.now(),
// //             message,
// //             type,
// //             timestamp: new Date()
// //         };

// //         setNotifications(prev => [notification, ...prev.slice(0, 4)]);

// //         // Auto remove after 5 seconds
// //         setTimeout(() => {
// //             setNotifications(prev => prev.filter(n => n.id !== notification.id));
// //         }, 5000);
// //     };

// //     const getPermissionIcon = () => {
// //         switch (locationPermission) {
// //             case 'granted':
// //                 return <CheckCircle className="h-5 w-5 text-green-500" />;
// //             case 'denied':
// //                 return <XCircle className="h-5 w-5 text-red-500" />;
// //             case 'unsupported':
// //                 return <XCircle className="h-5 w-5 text-gray-500" />;
// //             default:
// //                 return <AlertCircle className="h-5 w-5 text-yellow-500" />;
// //         }
// //     };

// //     const getPermissionText = () => {
// //         switch (locationPermission) {
// //             case 'granted':
// //                 return 'Location access granted';
// //             case 'denied':
// //                 return 'Location access denied';
// //             case 'unsupported':
// //                 return 'Location not supported';
// //             default:
// //                 return 'Location permission required';
// //         }
// //     };

// //     const formatTimestamp = (timestamp) => {
// //         if (!timestamp) return 'Never';
// //         return new Date(timestamp).toLocaleString();
// //     };

// //     if (!trackingSettings) {
// //         return (
// //             <div className="flex items-center justify-center h-64">
// //                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
// //             </div>
// //         );
// //     }

// //     return (
// //         <div className="p-6 bg-gray-50 min-h-screen">
// //             {/* Header */}
// //             <div className="mb-6">
// //                 <h1 className="text-2xl font-bold text-gray-900">Location Tracking</h1>
// //                 <p className="text-gray-600 mt-1">Manage your location sharing settings</p>
// //             </div>

// //             {/* Notifications */}
// //             {notifications.length > 0 && (
// //                 <div className="mb-6 space-y-2">
// //                     {notifications.map((notification) => (
// //                         <div
// //                             key={notification.id}
// //                             className={`p-4 rounded-lg border-l-4 ${notification.type === 'success' ? 'bg-green-50 border-green-400 text-green-700' :
// //                                     notification.type === 'error' ? 'bg-red-50 border-red-400 text-red-700' :
// //                                         notification.type === 'warning' ? 'bg-yellow-50 border-yellow-400 text-yellow-700' :
// //                                             'bg-blue-50 border-blue-400 text-blue-700'
// //                                 }`}
// //                         >
// //                             <div className="flex items-center justify-between">
// //                                 <p className="text-sm font-medium">{notification.message}</p>
// //                                 <span className="text-xs opacity-75">
// //                                     {notification.timestamp.toLocaleTimeString()}
// //                                 </span>
// //                             </div>
// //                         </div>
// //                     ))}
// //                 </div>
// //             )}

// //             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// //                 {/* Status Card */}
// //                 <div className="bg-white rounded-lg shadow p-6">
// //                     <h2 className="text-lg font-semibold text-gray-900 mb-4">Tracking Status</h2>

// //                     <div className="space-y-4">
// //                         {/* Tracking Status */}
// //                         <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
// //                             <div className="flex items-center space-x-3">
// //                                 <Activity className={`h-6 w-6 ${trackingSettings.trackingEnabled ? 'text-green-500' : 'text-gray-400'
// //                                     }`} />
// //                                 <div>
// //                                     <p className="font-medium text-gray-900">Location Tracking</p>
// //                                     <p className="text-sm text-gray-600">
// //                                         {trackingSettings.trackingEnabled ? 'Active' : 'Inactive'}
// //                                     </p>
// //                                 </div>
// //                             </div>
// //                             <div className={`w-3 h-3 rounded-full ${trackingSettings.trackingEnabled ? 'bg-green-500' : 'bg-gray-400'
// //                                 }`}></div>
// //                         </div>

// //                         {/* Connection Status */}
// //                         <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
// //                             <div className="flex items-center space-x-3">
// //                                 {isSocketConnected ? (
// //                                     <Wifi className="h-6 w-6 text-green-500" />
// //                                 ) : (
// //                                     <WifiOff className="h-6 w-6 text-red-500" />
// //                                 )}
// //                                 <div>
// //                                     <p className="font-medium text-gray-900">Connection</p>
// //                                     <p className="text-sm text-gray-600">
// //                                         {isSocketConnected ? 'Connected' : 'Disconnected'}
// //                                     </p>
// //                                 </div>
// //                             </div>
// //                         </div>

// //                         {/* Location Permission */}
// //                         <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
// //                             <div className="flex items-center space-x-3">
// //                                 {getPermissionIcon()}
// //                                 <div>
// //                                     <p className="font-medium text-gray-900">Location Permission</p>
// //                                     <p className="text-sm text-gray-600">{getPermissionText()}</p>
// //                                 </div>
// //                             </div>
// //                             {locationPermission !== 'granted' && (
// //                                 <button
// //                                     onClick={requestLocationPermission}
// //                                     className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
// //                                 >
// //                                     Grant Access
// //                                 </button>
// //                             )}
// //                         </div>

// //                         {/* Battery Level */}
// //                         {batteryLevel !== null && (
// //                             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
// //                                 <div className="flex items-center space-x-3">
// //                                     <Battery className={`h-6 w-6 ${batteryLevel > 20 ? 'text-green-500' : 'text-red-500'
// //                                         }`} />
// //                                     <div>
// //                                         <p className="font-medium text-gray-900">Battery Level</p>
// //                                         <p className="text-sm text-gray-600">{batteryLevel}%</p>
// //                                     </div>
// //                                 </div>
// //                             </div>
// //                         )}
// //                     </div>

// //                     {/* Control Buttons */}
// //                     {trackingSettings.trackingEnabled && (
// //                         <div className="mt-6 flex space-x-4">
// //                             <button
// //                                 onClick={startLocationTracking}
// //                                 disabled={locationPermission !== 'granted' || !isSocketConnected}
// //                                 className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
// //                             >
// //                                 Start Tracking
// //                             </button>
// //                             <button
// //                                 onClick={stopLocationTracking}
// //                                 className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
// //                             >
// //                                 Stop Tracking
// //                             </button>
// //                         </div>
// //                     )}
// //                 </div>

// //                 {/* Settings Card */}
// //                 <div className="bg-white rounded-lg shadow p-6">
// //                     <h2 className="text-lg font-semibold text-gray-900 mb-4">Tracking Information</h2>

// //                     <div className="space-y-4">
// //                         {trackingSettings.enabledBy && (
// //                             <div>
// //                                 <p className="text-sm font-medium text-gray-700">Enabled by</p>
// //                                 <p className="text-gray-900">{trackingSettings.enabledBy.name}</p>
// //                                 <p className="text-sm text-gray-600">
// //                                     {formatTimestamp(trackingSettings.enabledAt)}
// //                                 </p>
// //                             </div>
// //                         )}

// //                         <div>
// //                             <p className="text-sm font-medium text-gray-700">Update Frequency</p>
// //                             <p className="text-gray-900">{trackingSettings.trackingFrequency} seconds</p>
// //                         </div>

// //                         <div>
// //                             <p className="text-sm font-medium text-gray-700">Last Location Update</p>
// //                             <p className="text-gray-900">
// //                                 {formatTimestamp(trackingSettings.lastLocationUpdate)}
// //                             </p>
// //                         </div>

// //                         <div>
// //                             <p className="text-sm font-medium text-gray-700">Total Locations Recorded</p>
// //                             <p className="text-gray-900">
// //                                 {trackingSettings.statistics.totalLocationsRecorded}
// //                             </p>
// //                         </div>

// //                         {trackingSettings.statistics.averageAccuracy > 0 && (
// //                             <div>
// //                                 <p className="text-sm font-medium text-gray-700">Average Accuracy</p>
// //                                 <p className="text-gray-900">
// //                                     {trackingSettings.statistics.averageAccuracy.toFixed(1)}m
// //                                 </p>
// //                             </div>
// //                         )}

// //                         {currentLocation && (
// //                             <div className="mt-6 p-4 bg-blue-50 rounded-lg">
// //                                 <h3 className="font-medium text-blue-900 mb-2">Current Location</h3>
// //                                 <div className="space-y-1 text-sm text-blue-800">
// //                                     <p>Latitude: {currentLocation.latitude.toFixed(6)}</p>
// //                                     <p>Longitude: {currentLocation.longitude.toFixed(6)}</p>
// //                                     <p>Accuracy: {currentLocation.accuracy?.toFixed(0)}m</p>
// //                                 </div>
// //                             </div>
// //                         )}
// //                     </div>
// //                 </div>
// //             </div>

// //             {/* Info Card */}
// //             <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
// //                 <div className="flex items-start space-x-3">
// //                     <AlertCircle className="h-6 w-6 text-blue-600 mt-0.5" />
// //                     <div>
// //                         <h3 className="font-medium text-blue-900">About Location Tracking</h3>
// //                         <div className="mt-2 text-sm text-blue-800 space-y-1">
// //                             <p>• Location tracking is controlled by your administrator</p>
// //                             <p>• Your location is only shared when tracking is enabled</p>
// //                             <p>• Location data is automatically deleted after 24 hours</p>
// //                             <p>• You can see when tracking is active in the status above</p>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };

// // export default SalesmanLocationTracker;

// import React, { useState, useEffect } from 'react';
// import {
//     MapPin,
//     Settings,
//     Activity,
//     Battery,
//     Signal,
//     Clock,
//     AlertCircle,
//     CheckCircle,
//     XCircle,
//     Wifi,
//     WifiOff
// } from 'lucide-react';
// import socketService from '../../services/socketService';
// import locationService from '../../services/locationService';

// const SalesmanLocationTracker = () => {
//     const [trackingSettings, setTrackingSettings] = useState(true);
//     const [locationPermission, setLocationPermission] = useState('prompt');
//     const [isTracking, setIsTracking] = useState(false);
//     const [currentLocation, setCurrentLocation] = useState(null);
//     const [batteryLevel, setBatteryLevel] = useState(null);
//     const [isSocketConnected, setIsSocketConnected] = useState(false);
//     const [locationStats, setLocationStats] = useState({
//         totalUpdates: 0,
//         lastUpdate: null,
//         accuracy: null
//     });
//     const [notifications, setNotifications] = useState([]);

//     useEffect(() => {
//         loadTrackingSettings();
//         checkLocationPermission();
//         initializeSocket();
//         getBatteryInfo();

//         // Listen for socket notifications
//         const handleSocketNotification = (event) => {
//             addNotification(event.detail.message, event.detail.type);
//         };

//         const handleTrackingToggled = (event) => {
//             const data = event.detail;
//             console.log('Tracking toggled by admin:', data);
//             loadTrackingSettings(); // Reload settings
//             if (data.enabled) {
//                 addNotification(`Location tracking enabled by ${data.adminName}`, 'success');
//                 startLocationTracking();
//             } else {
//                 addNotification('Location tracking disabled by admin', 'warning');
//                 stopLocationTracking();
//             }
//         };

//         window.addEventListener('socketNotification', handleSocketNotification);
//         window.addEventListener('trackingToggled', handleTrackingToggled);

//         return () => {
//             socketService.disconnect();
//             window.removeEventListener('socketNotification', handleSocketNotification);
//             window.removeEventListener('trackingToggled', handleTrackingToggled);
//         };
//     }, []);

//     const initializeSocket = async () => {
//         try {
//             const token = localStorage.getItem('token');
//             const userRole = 'salesman';

//             await socketService.connect(token, userRole);
//             setIsSocketConnected(true);
//             console.log('Salesman socket connected');

//             // If tracking is enabled, start tracking
//             if (trackingSettings?.trackingEnabled) {
//                 startLocationTracking();
//             }
//         } catch (error) {
//             console.error('Failed to connect to socket:', error);
//             setIsSocketConnected(false);
//             addNotification('Failed to connect to real-time service', 'error');
//         }
//     };

//     const loadTrackingSettings = async () => {
//         try {
//             const response = await locationService.getMyTrackingSettings();
//             console.log('Tracking settings:', response.data);
//             setTrackingSettings(response.data);
//             setIsTracking(response.data.trackingEnabled);
//         } catch (error) {
//             console.error('Error loading tracking settings:', error);
//             addNotification('Failed to load tracking settings', 'error');
//         }
//     };

//     const checkLocationPermission = async () => {
//         if (!navigator.geolocation) {
//             setLocationPermission('unsupported');
//             return;
//         }

//         try {
//             const permission = await navigator.permissions.query({ name: 'geolocation' });
//             setLocationPermission(permission.state);

//             permission.addEventListener('change', () => {
//                 setLocationPermission(permission.state);
//             });
//         } catch (error) {
//             console.error('Error checking location permission:', error);
//         }
//     };

//     const getBatteryInfo = async () => {
//         try {
//             if ('getBattery' in navigator) {
//                 const battery = await navigator.getBattery();
//                 setBatteryLevel(Math.round(battery.level * 100));

//                 battery.addEventListener('levelchange', () => {
//                     setBatteryLevel(Math.round(battery.level * 100));
//                 });
//             }
//         } catch (error) {
//             console.error('Error getting battery info:', error);
//         }
//     };

//     const requestLocationPermission = async () => {
//         if (!navigator.geolocation) {
//             addNotification('Geolocation is not supported by this browser', 'error');
//             return;
//         }

//         try {
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     setLocationPermission('granted');
//                     setCurrentLocation({
//                         latitude: position.coords.latitude,
//                         longitude: position.coords.longitude,
//                         accuracy: position.coords.accuracy
//                     });
//                     addNotification('Location permission granted', 'success');

//                     // Update permissions on server
//                     locationService.updateLocationPermissions({
//                         locationGranted: true
//                     });

//                     // Start tracking if enabled
//                     if (trackingSettings?.trackingEnabled) {
//                         startLocationTracking();
//                     }
//                 },
//                 (error) => {
//                     setLocationPermission('denied');
//                     addNotification('Location permission denied', 'error');

//                     // Update permissions on server
//                     locationService.updateLocationPermissions({
//                         locationGranted: false
//                     });
//                 },
//                 {
//                     enableHighAccuracy: true,
//                     timeout: 10000,
//                     maximumAge: 60000
//                 }
//             );
//         } catch (error) {
//             console.error('Error requesting location permission:', error);
//             addNotification('Error requesting location permission', 'error');
//         }
//     };

//     const startLocationTracking = () => {
//         if (locationPermission !== 'granted') {
//             addNotification('Location permission required to start tracking', 'warning');
//             requestLocationPermission();
//             return;
//         }

//         if (!isSocketConnected) {
//             addNotification('Not connected to real-time service', 'error');
//             return;
//         }

//         if (!trackingSettings?.trackingEnabled) {
//             addNotification('Location tracking is disabled by admin', 'warning');
//             return;
//         }

//         const frequency = trackingSettings?.trackingFrequency || 30;
//         console.log('Starting location tracking with frequency:', frequency);

//         socketService.startLocationTracking(frequency);
//         setIsTracking(true);

//         // Send status update
//         socketService.sendStatusUpdate('tracking', batteryLevel, true);

//         addNotification('Location tracking started', 'success');
//     };

//     const stopLocationTracking = () => {
//         console.log('Stopping location tracking');
//         socketService.stopLocationTracking();
//         setIsTracking(false);
//         socketService.sendStatusUpdate('idle', batteryLevel, false);
//         addNotification('Location tracking stopped', 'info');
//     };

//     const addNotification = (message, type) => {
//         const notification = {
//             id: Date.now(),
//             message,
//             type,
//             timestamp: new Date()
//         };

//         setNotifications(prev => [notification, ...prev.slice(0, 4)]);

//         // Auto remove after 5 seconds
//         setTimeout(() => {
//             setNotifications(prev => prev.filter(n => n.id !== notification.id));
//         }, 5000);
//     };

//     const getPermissionIcon = () => {
//         switch (locationPermission) {
//             case 'granted':
//                 return <CheckCircle className="h-5 w-5 text-green-500" />;
//             case 'denied':
//                 return <XCircle className="h-5 w-5 text-red-500" />;
//             case 'unsupported':
//                 return <XCircle className="h-5 w-5 text-gray-500" />;
//             default:
//                 return <AlertCircle className="h-5 w-5 text-yellow-500" />;
//         }
//     };

//     const getPermissionText = () => {
//         switch (locationPermission) {
//             case 'granted':
//                 return 'Location access granted';
//             case 'denied':
//                 return 'Location access denied';
//             case 'unsupported':
//                 return 'Location not supported';
//             default:
//                 return 'Location permission required';
//         }
//     };

//     const formatTimestamp = (timestamp) => {
//         if (!timestamp) return 'Never';
//         return new Date(timestamp).toLocaleString();
//     };

//     if (!trackingSettings) {
//         return (
//             <div className="flex items-center justify-center h-64">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//             </div>
//         );
//     }

//     return (
//         <div className="p-6 bg-gray-50 min-h-screen">
//             {/* Header */}
//             <div className="mb-6">
//                 <h1 className="text-2xl font-bold text-gray-900">Location Tracking</h1>
//                 <p className="text-gray-600 mt-1">Manage your location sharing settings</p>
//             </div>

//             {/* Notifications */}
//             {notifications.length > 0 && (
//                 <div className="mb-6 space-y-2">
//                     {notifications.map((notification) => (
//                         <div
//                             key={notification.id}
//                             className={`p-4 rounded-lg border-l-4 ${notification.type === 'success' ? 'bg-green-50 border-green-400 text-green-700' :
//                                 notification.type === 'error' ? 'bg-red-50 border-red-400 text-red-700' :
//                                     notification.type === 'warning' ? 'bg-yellow-50 border-yellow-400 text-yellow-700' :
//                                         'bg-blue-50 border-blue-400 text-blue-700'
//                                 }`}
//                         >
//                             <div className="flex items-center justify-between">
//                                 <p className="text-sm font-medium">{notification.message}</p>
//                                 <span className="text-xs opacity-75">
//                                     {notification.timestamp.toLocaleTimeString()}
//                                 </span>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {/* Status Card */}
//                 <div className="bg-white rounded-lg shadow p-6">
//                     <h2 className="text-lg font-semibold text-gray-900 mb-4">Tracking Status</h2>

//                     <div className="space-y-4">
//                         {/* Admin Tracking Control */}
//                         <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                             <div className="flex items-center space-x-3">
//                                 <Activity className={`h-6 w-6 ${trackingSettings.trackingEnabled ? 'text-green-500' : 'text-gray-400'
//                                     }`} />
//                                 <div>
//                                     <p className="font-medium text-gray-900">Admin Control</p>
//                                     <p className="text-sm text-gray-600">
//                                         {trackingSettings.trackingEnabled ? 'Tracking Enabled' : 'Tracking Disabled'}
//                                     </p>
//                                 </div>
//                             </div>
//                             <div className={`w-3 h-3 rounded-full ${trackingSettings.trackingEnabled ? 'bg-green-500' : 'bg-gray-400'
//                                 }`}></div>
//                         </div>

//                         {/* Active Tracking Status */}
//                         <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                             <div className="flex items-center space-x-3">
//                                 <MapPin className={`h-6 w-6 ${isTracking ? 'text-blue-500' : 'text-gray-400'
//                                     }`} />
//                                 <div>
//                                     <p className="font-medium text-gray-900">Active Tracking</p>
//                                     <p className="text-sm text-gray-600">
//                                         {isTracking ? 'Currently Sending Location' : 'Not Sending Location'}
//                                     </p>
//                                 </div>
//                             </div>
//                             <div className={`w-3 h-3 rounded-full ${isTracking ? 'bg-blue-500' : 'bg-gray-400'
//                                 }`}></div>
//                         </div>

//                         {/* Connection Status */}
//                         <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                             <div className="flex items-center space-x-3">
//                                 {isSocketConnected ? (
//                                     <Wifi className="h-6 w-6 text-green-500" />
//                                 ) : (
//                                     <WifiOff className="h-6 w-6 text-red-500" />
//                                 )}
//                                 <div>
//                                     <p className="font-medium text-gray-900">Connection</p>
//                                     <p className="text-sm text-gray-600">
//                                         {isSocketConnected ? 'Connected' : 'Disconnected'}
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Location Permission */}
//                         <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                             <div className="flex items-center space-x-3">
//                                 {getPermissionIcon()}
//                                 <div>
//                                     <p className="font-medium text-gray-900">Location Permission</p>
//                                     <p className="text-sm text-gray-600">{getPermissionText()}</p>
//                                 </div>
//                             </div>
//                             {locationPermission !== 'granted' && (
//                                 <button
//                                     onClick={requestLocationPermission}
//                                     className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
//                                 >
//                                     Grant Access
//                                 </button>
//                             )}
//                         </div>

//                         {/* Battery Level */}
//                         {batteryLevel !== null && (
//                             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                                 <div className="flex items-center space-x-3">
//                                     <Battery className={`h-6 w-6 ${batteryLevel > 20 ? 'text-green-500' : 'text-red-500'
//                                         }`} />
//                                     <div>
//                                         <p className="font-medium text-gray-900">Battery Level</p>
//                                         <p className="text-sm text-gray-600">{batteryLevel}%</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>

//                     {/* Control Buttons */}
//                     {trackingSettings.trackingEnabled && (
//                         <div className="mt-6 flex space-x-4">
//                             <button
//                                 onClick={startLocationTracking}
//                                 disabled={locationPermission !== 'granted' || !isSocketConnected || isTracking}
//                                 className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
//                             >
//                                 {isTracking ? 'Tracking Active' : 'Start Tracking'}
//                             </button>
//                             <button
//                                 onClick={stopLocationTracking}
//                                 disabled={!isTracking}
//                                 className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
//                             >
//                                 Stop Tracking
//                             </button>
//                         </div>
//                     )}

//                     {!trackingSettings.trackingEnabled && (
//                         <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
//                             <p className="text-sm text-yellow-800">
//                                 Location tracking is currently disabled by your administrator.
//                                 Contact your admin to enable tracking.
//                             </p>
//                         </div>
//                     )}
//                 </div>

//                 {/* Settings Card */}
//                 <div className="bg-white rounded-lg shadow p-6">
//                     <h2 className="text-lg font-semibold text-gray-900 mb-4">Tracking Information</h2>

//                     <div className="space-y-4">
//                         {trackingSettings.enabledBy && (
//                             <div>
//                                 <p className="text-sm font-medium text-gray-700">Enabled by</p>
//                                 <p className="text-gray-900">{trackingSettings.enabledBy.name}</p>
//                                 <p className="text-sm text-gray-600">
//                                     {formatTimestamp(trackingSettings.enabledAt)}
//                                 </p>
//                             </div>
//                         )}

//                         <div>
//                             <p className="text-sm font-medium text-gray-700">Update Frequency</p>
//                             <p className="text-gray-900">{trackingSettings.trackingFrequency} seconds</p>
//                         </div>

//                         <div>
//                             <p className="text-sm font-medium text-gray-700">Last Location Update</p>
//                             <p className="text-gray-900">
//                                 {formatTimestamp(trackingSettings.lastLocationUpdate)}
//                             </p>
//                         </div>

//                         <div>
//                             <p className="text-sm font-medium text-gray-700">Total Locations Recorded</p>
//                             <p className="text-gray-900">
//                                 {trackingSettings.statistics?.totalLocationsRecorded || 0}
//                             </p>
//                         </div>

//                         {trackingSettings.statistics?.averageAccuracy > 0 && (
//                             <div>
//                                 <p className="text-sm font-medium text-gray-700">Average Accuracy</p>
//                                 <p className="text-gray-900">
//                                     {trackingSettings.statistics.averageAccuracy.toFixed(1)}m
//                                 </p>
//                             </div>
//                         )}

//                         {currentLocation && (
//                             <div className="mt-6 p-4 bg-blue-50 rounded-lg">
//                                 <h3 className="font-medium text-blue-900 mb-2">Current Location</h3>
//                                 <div className="space-y-1 text-sm text-blue-800">
//                                     <p>Latitude: {currentLocation.latitude.toFixed(6)}</p>
//                                     <p>Longitude: {currentLocation.longitude.toFixed(6)}</p>
//                                     <p>Accuracy: {currentLocation.accuracy?.toFixed(0)}m</p>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* Info Card */}
//             <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
//                 <div className="flex items-start space-x-3">
//                     <AlertCircle className="h-6 w-6 text-blue-600 mt-0.5" />
//                     <div>
//                         <h3 className="font-medium text-blue-900">About Location Tracking</h3>
//                         <div className="mt-2 text-sm text-blue-800 space-y-1">
//                             <p>• Location tracking is controlled by your administrator</p>
//                             <p>• Your location is only shared when tracking is enabled</p>
//                             <p>• Location data is automatically deleted after 24 hours</p>
//                             <p>• You can see when tracking is active in the status above</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SalesmanLocationTracker;


import React, { useState, useEffect } from 'react';
import {
    MapPin,
    Activity,
    Battery,
    Signal,
    Clock,
    AlertCircle,
    CheckCircle,
    XCircle,
    Wifi,
    WifiOff
} from 'lucide-react';
import locationService from '../../services/locationService';

const SalesmanLocationTracker = () => {
    const [trackingSettings, setTrackingSettings] = useState(null);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        loadTrackingSettings();

        // Listen for global notifications
        const handleGlobalNotification = (event) => {
            addNotification(event.detail.message, event.detail.type);
        };

        window.addEventListener('globalNotification', handleGlobalNotification);

        return () => {
            window.removeEventListener('globalNotification', handleGlobalNotification);
        };
    }, []);

    const loadTrackingSettings = async () => {
        try {
            const response = await locationService.getMyTrackingSettings();
            setTrackingSettings(response.data);
        } catch (error) {
            console.error('Error loading tracking settings:', error);
            addNotification('Failed to load tracking settings', 'error');
        }
    };

    const addNotification = (message, type) => {
        const notification = {
            id: Date.now(),
            message,
            type,
            timestamp: new Date()
        };

        setNotifications(prev => [notification, ...prev.slice(0, 4)]);

        // Auto remove after 5 seconds
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== notification.id));
        }, 5000);
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'Never';
        return new Date(timestamp).toLocaleString();
    };

    if (!trackingSettings) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Location Tracking Dashboard</h1>
                <p className="text-gray-600 mt-1">
                    Location tracking is now managed automatically across your entire session
                </p>
            </div>

            {/* Auto-tracking Notice */}
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                    <AlertCircle className="h-6 w-6 text-blue-600 mt-0.5" />
                    <div>
                        <h3 className="font-medium text-blue-900">Automatic Location Tracking</h3>
                        <div className="mt-2 text-sm text-blue-800 space-y-1">
                            <p>• Location tracking now starts automatically when you log in</p>
                            <p>• Tracking continues even when you navigate between pages</p>
                            <p>• Background tracking is maintained when the browser tab is not active</p>
                            <p>• Your location is only shared when enabled by your administrator</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notifications */}
            {notifications.length > 0 && (
                <div className="mb-6 space-y-2">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`p-4 rounded-lg border-l-4 ${notification.type === 'success' ? 'bg-green-50 border-green-400 text-green-700' :
                                    notification.type === 'error' ? 'bg-red-50 border-red-400 text-red-700' :
                                        notification.type === 'warning' ? 'bg-yellow-50 border-yellow-400 text-yellow-700' :
                                            'bg-blue-50 border-blue-400 text-blue-700'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">{notification.message}</p>
                                <span className="text-xs opacity-75">
                                    {notification.timestamp.toLocaleTimeString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status Information Card */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Tracking Status</h2>

                    <div className="space-y-4">
                        {/* Global Status */}
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center space-x-3">
                                <CheckCircle className="h-6 w-6 text-green-500" />
                                <div>
                                    <p className="font-medium text-green-900">Global Tracking Active</p>
                                    <p className="text-sm text-green-700">
                                        Location tracking is managed automatically by the application
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Admin Control Status */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <Activity className={`h-6 w-6 ${trackingSettings.trackingEnabled ? 'text-green-500' : 'text-gray-400'
                                    }`} />
                                <div>
                                    <p className="font-medium text-gray-900">Admin Control</p>
                                    <p className="text-sm text-gray-600">
                                        {trackingSettings.trackingEnabled ? 'Tracking Enabled' : 'Tracking Disabled'}
                                    </p>
                                </div>
                            </div>
                            <div className={`w-3 h-3 rounded-full ${trackingSettings.trackingEnabled ? 'bg-green-500' : 'bg-gray-400'
                                }`}></div>
                        </div>
                    </div>

                    {!trackingSettings.trackingEnabled && (
                        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                            <p className="text-sm text-yellow-800">
                                Location tracking is currently disabled by your administrator.
                                Contact your admin to enable tracking.
                            </p>
                        </div>
                    )}
                </div>

                {/* Settings Information Card */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Tracking Information</h2>

                    <div className="space-y-4">
                        {trackingSettings.enabledBy && (
                            <div>
                                <p className="text-sm font-medium text-gray-700">Enabled by</p>
                                <p className="text-gray-900">{trackingSettings.enabledBy.name}</p>
                                <p className="text-sm text-gray-600">
                                    {formatTimestamp(trackingSettings.enabledAt)}
                                </p>
                            </div>
                        )}

                        <div>
                            <p className="text-sm font-medium text-gray-700">Update Frequency</p>
                            <p className="text-gray-900">{trackingSettings.trackingFrequency} seconds</p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-700">Last Location Update</p>
                            <p className="text-gray-900">
                                {formatTimestamp(trackingSettings.lastLocationUpdate)}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-700">Total Locations Recorded</p>
                            <p className="text-gray-900">
                                {trackingSettings.statistics?.totalLocationsRecorded || 0}
                            </p>
                        </div>

                        {trackingSettings.statistics?.averageAccuracy > 0 && (
                            <div>
                                <p className="text-sm font-medium text-gray-700">Average Accuracy</p>
                                <p className="text-gray-900">
                                    {trackingSettings.statistics.averageAccuracy.toFixed(1)}m
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* How it Works Card */}
            <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                    <MapPin className="h-6 w-6 text-gray-600 mt-0.5" />
                    <div>
                        <h3 className="font-medium text-gray-900">How Automatic Tracking Works</h3>
                        <div className="mt-2 text-sm text-gray-700 space-y-2">
                            <p><strong>1. Automatic Start:</strong> When you log in as a salesman, location tracking initializes automatically</p>
                            <p><strong>2. Permission Request:</strong> If needed, the system will ask for location permission once</p>
                            <p><strong>3. Background Operation:</strong> Tracking continues even when you're on different pages</p>
                            <p><strong>4. Admin Control:</strong> Your administrator can enable/disable tracking remotely</p>
                            <p><strong>5. Smart Management:</strong> The system handles reconnections and errors automatically</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Technical Details Card */}
            <div className="mt-6 bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Technical Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="font-medium text-gray-700 mb-1">Features:</p>
                        <ul className="text-gray-600 space-y-1">
                            <li>• Real-time location updates</li>
                            <li>• Battery level monitoring</li>
                            <li>• Connection status tracking</li>
                            <li>• Automatic error recovery</li>
                        </ul>
                    </div>
                    <div>
                        <p className="font-medium text-gray-700 mb-1">Privacy & Security:</p>
                        <ul className="text-gray-600 space-y-1">
                            <li>• Location data encrypted in transit</li>
                            <li>• Automatic data deletion (24 hours)</li>
                            <li>• Permission-based access only</li>
                            <li>• Admin-controlled activation</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesmanLocationTracker;