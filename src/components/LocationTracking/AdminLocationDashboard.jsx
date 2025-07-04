// // import React, { useState, useEffect, useCallback } from 'react';
// // import { GoogleMap, LoadScript, Marker, Polyline, InfoWindow } from '@react-google-maps/api';
// // import {
// //     MapPin,
// //     Users,
// //     Clock,
// //     Activity,
// //     Settings,
// //     RefreshCw,
// //     Eye,
// //     EyeOff,
// //     Navigation,
// //     Signal,
// //     Battery,
// //     Wifi,
// //     WifiOff
// // } from 'lucide-react';
// // import locationService from '../../services/locationService';
// // import socketService from '../../services/socketService';

// // const mapContainerStyle = {
// //     width: '100%',
// //     height: '500px'
// // };

// // const defaultCenter = {
// //     lat: 28.6139, // Delhi coordinates as default
// //     lng: 77.2090
// // };

// // const AdminLocationDashboard = () => {
// //     const [salesmen, setSalesmen] = useState([]);
// //     const [selectedSalesman, setSelectedSalesman] = useState(null);
// //     const [locationTrail, setLocationTrail] = useState([]);
// //     const [trailHours, setTrailHours] = useState(1);
// //     const [loading, setLoading] = useState(true);
// //     const [mapCenter, setMapCenter] = useState(defaultCenter);
// //     const [selectedMarker, setSelectedMarker] = useState(null);
// //     const [realTimeUpdates, setRealTimeUpdates] = useState({});
// //     const [isSocketConnected, setIsSocketConnected] = useState(false);
// //     const [statistics, setStatistics] = useState(null);

// //     // Load initial data
// //     useEffect(() => {
// //         loadSalesmenData();
// //         loadStatistics();
// //         initializeSocket();

// //         return () => {
// //             socketService.disconnect();
// //         };
// //     }, []);

// //     // Socket event listeners
// //     useEffect(() => {
// //         const handleLocationUpdate = (event) => {
// //             const data = event.detail;
// //             setRealTimeUpdates(prev => ({
// //                 ...prev,
// //                 [data.salesmanId]: {
// //                     ...data,
// //                     timestamp: new Date(data.location.timestamp)
// //                 }
// //             }));

// //             // Update salesmen data with real-time location
// //             setSalesmen(prev => prev.map(salesman =>
// //                 salesman.salesman.id === data.salesmanId
// //                     ? {
// //                         ...salesman,
// //                         location: data.location,
// //                         isOnline: true
// //                     }
// //                     : salesman
// //             ));
// //         };

// //         const handleSalesmanStatus = (event) => {
// //             const data = event.detail;
// //             setSalesmen(prev => prev.map(salesman =>
// //                 salesman.salesman.id === data.salesmanId
// //                     ? {
// //                         ...salesman,
// //                         isOnline: data.isActive,
// //                         battery: data.battery,
// //                         lastUpdate: data.timestamp
// //                     }
// //                     : salesman
// //             ));
// //         };

// //         const handleSalesmanDisconnected = (event) => {
// //             const data = event.detail;
// //             setSalesmen(prev => prev.map(salesman =>
// //                 salesman.salesman.id === data.salesmanId
// //                     ? { ...salesman, isOnline: false }
// //                     : salesman
// //             ));
// //         };

// //         window.addEventListener('locationUpdate', handleLocationUpdate);
// //         window.addEventListener('salesmanStatusUpdate', handleSalesmanStatus);
// //         window.addEventListener('salesmanDisconnected', handleSalesmanDisconnected);

// //         return () => {
// //             window.removeEventListener('locationUpdate', handleLocationUpdate);
// //             window.removeEventListener('salesmanStatusUpdate', handleSalesmanStatus);
// //             window.removeEventListener('salesmanDisconnected', handleSalesmanDisconnected);
// //         };
// //     }, []);

// //     const initializeSocket = async () => {
// //         try {
// //             const token = localStorage.getItem('token');
// //             const userRole = 'admin'; // You might want to get this from your auth context

// //             await socketService.connect(token, userRole);
// //             setIsSocketConnected(true);
// //         } catch (error) {
// //             console.error('Failed to connect to socket:', error);
// //             setIsSocketConnected(false);
// //         }
// //     };

// //     const loadSalesmenData = async () => {
// //         try {
// //             setLoading(true);
// //             const response = await locationService.getSalesmenTrackingStatus();
// //             setSalesmen(response.data);

// //             // Set map center to first salesman with location
// //             const salesmanWithLocation = response.data.find(s => s.location);
// //             if (salesmanWithLocation) {
// //                 setMapCenter({
// //                     lat: salesmanWithLocation.location.latitude,
// //                     lng: salesmanWithLocation.location.longitude
// //                 });
// //             }
// //         } catch (error) {
// //             console.error('Error loading salesmen data:', error);
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     const loadStatistics = async () => {
// //         try {
// //             const response = await locationService.getLocationStatistics('24h');
// //             setStatistics(response.data);
// //         } catch (error) {
// //             console.error('Error loading statistics:', error);
// //         }
// //     };

// //     const toggleTracking = async (salesmanId, currentStatus) => {
// //         try {
// //             const newStatus = !currentStatus;
// //             await locationService.toggleSalesmanTracking(salesmanId, newStatus);

// //             // Update local state
// //             setSalesmen(prev => prev.map(salesman =>
// //                 salesman.salesman.id === salesmanId
// //                     ? { ...salesman, tracking: { ...salesman.tracking, enabled: newStatus } }
// //                     : salesman
// //             ));

// //             // Send socket event
// //             socketService.toggleTracking(salesmanId, newStatus);

// //         } catch (error) {
// //             console.error('Error toggling tracking:', error);
// //         }
// //     };

// //     const loadLocationTrail = async (salesmanId, hours) => {
// //         try {
// //             const response = await locationService.getSalesmanLocationTrail(salesmanId, hours);
// //             setLocationTrail(response.data.trail);
// //             setSelectedSalesman(response.data.salesman);

// //             if (response.data.trail.length > 0) {
// //                 const lastLocation = response.data.trail[response.data.trail.length - 1];
// //                 setMapCenter({
// //                     lat: lastLocation.lat,
// //                     lng: lastLocation.lng
// //                 });
// //             }
// //         } catch (error) {
// //             console.error('Error loading location trail:', error);
// //         }
// //     };

// //     const handleSalesmanSelect = (salesman) => {
// //         if (salesman.tracking.enabled) {
// //             loadLocationTrail(salesman.salesman.id, trailHours);
// //         }
// //     };

// //     const getMarkerIcon = (salesman) => {
// //         const isOnline = salesman.isOnline;
// //         const hasRecentLocation = salesman.location &&
// //             locationService.isLocationRecent(salesman.location.timestamp);

// //         return {
// //             url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
// //                 <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
// //                     <circle cx="16" cy="16" r="12" fill="${isOnline && hasRecentLocation ? '#10B981' : '#6B7280'}" stroke="white" stroke-width="2"/>
// //                     <circle cx="16" cy="16" r="4" fill="white"/>
// //                     ${isOnline ? '<circle cx="24" cy="8" r="4" fill="#3B82F6"/>' : ''}
// //                 </svg>
// //             `)}`,
// //             scaledSize: new window.google.maps.Size(32, 32),
// //             anchor: new window.google.maps.Point(16, 16)
// //         };
// //     };

// //     const formatLastUpdate = (timestamp) => {
// //         if (!timestamp) return 'Never';

// //         const now = new Date();
// //         const updateTime = new Date(timestamp);
// //         const diffMinutes = Math.floor((now - updateTime) / (1000 * 60));

// //         if (diffMinutes < 1) return 'Just now';
// //         if (diffMinutes < 60) return `${diffMinutes}min ago`;

// //         const diffHours = Math.floor(diffMinutes / 60);
// //         if (diffHours < 24) return `${diffHours}h ago`;

// //         const diffDays = Math.floor(diffHours / 24);
// //         return `${diffDays}d ago`;
// //     };

// //     if (loading) {
// //         return (
// //             <div className="flex items-center justify-center h-96">
// //                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
// //             </div>
// //         );
// //     }

// //     return (
// //         <div className="p-6 bg-gray-50 min-h-screen">
// //             {/* Header */}
// //             <div className="mb-6">
// //                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
// //                     <div>
// //                         <h1 className="text-2xl font-bold text-gray-900">Location Tracking Dashboard</h1>
// //                         <p className="text-gray-600 mt-1">Monitor salesman locations in real-time</p>
// //                     </div>
// //                     <div className="flex items-center space-x-4 mt-4 sm:mt-0">
// //                         <div className="flex items-center space-x-2">
// //                             {isSocketConnected ? (
// //                                 <Wifi className="h-5 w-5 text-green-500" />
// //                             ) : (
// //                                 <WifiOff className="h-5 w-5 text-red-500" />
// //                             )}
// //                             <span className="text-sm text-gray-600">
// //                                 {isSocketConnected ? 'Connected' : 'Disconnected'}
// //                             </span>
// //                         </div>
// //                         <button
// //                             onClick={loadSalesmenData}
// //                             className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
// //                         >
// //                             <RefreshCw className="h-4 w-4" />
// //                             <span>Refresh</span>
// //                         </button>
// //                     </div>
// //                 </div>
// //             </div>

// //             {/* Statistics Cards */}
// //             {statistics && (
// //                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
// //                     <div className="bg-white p-6 rounded-lg shadow">
// //                         <div className="flex items-center">
// //                             <Users className="h-8 w-8 text-blue-600" />
// //                             <div className="ml-4">
// //                                 <p className="text-sm font-medium text-gray-600">Active Salesmen</p>
// //                                 <p className="text-2xl font-bold text-gray-900">
// //                                     {statistics.overall.uniqueSalesmenCount}
// //                                 </p>
// //                             </div>
// //                         </div>
// //                     </div>

// //                     <div className="bg-white p-6 rounded-lg shadow">
// //                         <div className="flex items-center">
// //                             <MapPin className="h-8 w-8 text-green-600" />
// //                             <div className="ml-4">
// //                                 <p className="text-sm font-medium text-gray-600">Location Updates</p>
// //                                 <p className="text-2xl font-bold text-gray-900">
// //                                     {statistics.overall.totalLocations}
// //                                 </p>
// //                             </div>
// //                         </div>
// //                     </div>

// //                     <div className="bg-white p-6 rounded-lg shadow">
// //                         <div className="flex items-center">
// //                             <Signal className="h-8 w-8 text-yellow-600" />
// //                             <div className="ml-4">
// //                                 <p className="text-sm font-medium text-gray-600">Avg Accuracy</p>
// //                                 <p className="text-2xl font-bold text-gray-900">
// //                                     {statistics.overall.avgAccuracy}m
// //                                 </p>
// //                             </div>
// //                         </div>
// //                     </div>

// //                     <div className="bg-white p-6 rounded-lg shadow">
// //                         <div className="flex items-center">
// //                             <Activity className="h-8 w-8 text-purple-600" />
// //                             <div className="ml-4">
// //                                 <p className="text-sm font-medium text-gray-600">Online Now</p>
// //                                 <p className="text-2xl font-bold text-gray-900">
// //                                     {salesmen.filter(s => s.isOnline).length}
// //                                 </p>
// //                             </div>
// //                         </div>
// //                     </div>
// //                 </div>
// //             )}

// //             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// //                 {/* Salesmen List */}
// //                 <div className="lg:col-span-1">
// //                     <div className="bg-white rounded-lg shadow">
// //                         <div className="p-4 border-b border-gray-200">
// //                             <h2 className="text-lg font-semibold text-gray-900">Salesmen</h2>
// //                         </div>
// //                         <div className="max-h-96 overflow-y-auto">
// //                             {salesmen.map((salesman) => (
// //                                 <div
// //                                     key={salesman.salesman.id}
// //                                     className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${selectedSalesman?.id === salesman.salesman.id ? 'bg-blue-50' : ''
// //                                         }`}
// //                                     onClick={() => handleSalesmanSelect(salesman)}
// //                                 >
// //                                     <div className="flex items-center justify-between">
// //                                         <div className="flex items-center space-x-3">
// //                                             <div className={`w-3 h-3 rounded-full ${salesman.isOnline ? 'bg-green-500' : 'bg-gray-400'
// //                                                 }`}></div>
// //                                             <div>
// //                                                 <p className="font-medium text-gray-900">
// //                                                     {salesman.salesman.name}
// //                                                 </p>
// //                                                 <p className="text-sm text-gray-600">
// //                                                     @{salesman.salesman.username}
// //                                                 </p>
// //                                             </div>
// //                                         </div>
// //                                         <button
// //                                             onClick={(e) => {
// //                                                 e.stopPropagation();
// //                                                 toggleTracking(salesman.salesman.id, salesman.tracking.enabled);
// //                                             }}
// //                                             className={`p-2 rounded-lg ${salesman.tracking.enabled
// //                                                     ? 'bg-green-100 text-green-600 hover:bg-green-200'
// //                                                     : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
// //                                                 }`}
// //                                         >
// //                                             {salesman.tracking.enabled ? (
// //                                                 <Eye className="h-4 w-4" />
// //                                             ) : (
// //                                                 <EyeOff className="h-4 w-4" />
// //                                             )}
// //                                         </button>
// //                                     </div>

// //                                     {salesman.location && (
// //                                         <div className="mt-2 text-sm text-gray-600">
// //                                             <div className="flex items-center space-x-2">
// //                                                 <MapPin className="h-4 w-4" />
// //                                                 <span>
// //                                                     Accuracy: {salesman.location.accuracy?.toFixed(0)}m
// //                                                 </span>
// //                                             </div>
// //                                             <div className="flex items-center space-x-2 mt-1">
// //                                                 <Clock className="h-4 w-4" />
// //                                                 <span>
// //                                                     {formatLastUpdate(salesman.location.timestamp)}
// //                                                 </span>
// //                                             </div>
// //                                         </div>
// //                                     )}
// //                                 </div>
// //                             ))}
// //                         </div>
// //                     </div>
// //                 </div>

// //                 {/* Map */}
// //                 <div className="lg:col-span-2">
// //                     <div className="bg-white rounded-lg shadow">
// //                         <div className="p-4 border-b border-gray-200">
// //                             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
// //                                 <h2 className="text-lg font-semibold text-gray-900">Live Map</h2>
// //                                 {selectedSalesman && (
// //                                     <div className="flex items-center space-x-4 mt-2 sm:mt-0">
// //                                         <span className="text-sm text-gray-600">Trail Duration:</span>
// //                                         <select
// //                                             value={trailHours}
// //                                             onChange={(e) => {
// //                                                 const hours = parseInt(e.target.value);
// //                                                 setTrailHours(hours);
// //                                                 if (selectedSalesman) {
// //                                                     loadLocationTrail(selectedSalesman.id, hours);
// //                                                 }
// //                                             }}
// //                                             className="px-3 py-1 border border-gray-300 rounded-md text-sm"
// //                                         >
// //                                             <option value={1}>1 Hour</option>
// //                                             <option value={2}>2 Hours</option>
// //                                             <option value={6}>6 Hours</option>
// //                                             <option value={12}>12 Hours</option>
// //                                             <option value={24}>24 Hours</option>
// //                                         </select>
// //                                     </div>
// //                                 )}
// //                             </div>
// //                         </div>

// //                         <div className="p-4">
// //                             <GoogleMap
// //                                 mapContainerStyle={mapContainerStyle}
// //                                 center={mapCenter}
// //                                 zoom={13}
// //                                 options={{
// //                                     zoomControl: true,
// //                                     streetViewControl: false,
// //                                     mapTypeControl: false,
// //                                     fullscreenControl: true,
// //                                 }}
// //                             >
// //                                 {/* Salesman markers */}
// //                                 {salesmen
// //                                     .filter(s => s.location && s.tracking.enabled)
// //                                     .map((salesman) => (
// //                                         <Marker
// //                                             key={salesman.salesman.id}
// //                                             position={{
// //                                                 lat: salesman.location.latitude,
// //                                                 lng: salesman.location.longitude
// //                                             }}
// //                                             icon={getMarkerIcon(salesman)}
// //                                             onClick={() => setSelectedMarker(salesman)}
// //                                         />
// //                                     ))}

// //                                 {/* Location trail */}
// //                                 {locationTrail.length > 1 && (
// //                                     <Polyline
// //                                         path={locationTrail}
// //                                         options={{
// //                                             strokeColor: '#3B82F6',
// //                                             strokeOpacity: 0.8,
// //                                             strokeWeight: 3,
// //                                             geodesic: true
// //                                         }}
// //                                     />
// //                                 )}

// //                                 {/* Info window */}
// //                                 {selectedMarker && (
// //                                     <InfoWindow
// //                                         position={{
// //                                             lat: selectedMarker.location.latitude,
// //                                             lng: selectedMarker.location.longitude
// //                                         }}
// //                                         onCloseClick={() => setSelectedMarker(null)}
// //                                     >
// //                                         <div className="p-2">
// //                                             <h3 className="font-semibold text-gray-900">
// //                                                 {selectedMarker.salesman.name}
// //                                             </h3>
// //                                             <p className="text-sm text-gray-600">
// //                                                 @{selectedMarker.salesman.username}
// //                                             </p>
// //                                             <div className="mt-2 space-y-1 text-sm">
// //                                                 <div className="flex items-center space-x-2">
// //                                                     <Signal className="h-4 w-4 text-gray-500" />
// //                                                     <span>Accuracy: {selectedMarker.location.accuracy?.toFixed(0)}m</span>
// //                                                 </div>
// //                                                 <div className="flex items-center space-x-2">
// //                                                     <Clock className="h-4 w-4 text-gray-500" />
// //                                                     <span>{formatLastUpdate(selectedMarker.location.timestamp)}</span>
// //                                                 </div>
// //                                                 {selectedMarker.location.speed > 0 && (
// //                                                     <div className="flex items-center space-x-2">
// //                                                         <Navigation className="h-4 w-4 text-gray-500" />
// //                                                         <span>{(selectedMarker.location.speed * 3.6).toFixed(1)} km/h</span>
// //                                                     </div>
// //                                                 )}
// //                                             </div>
// //                                         </div>
// //                                     </InfoWindow>
// //                                 )}
// //                             </GoogleMap>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };

// // export default AdminLocationDashboard;


// import React, { useState, useEffect, useCallback } from 'react';
// import { GoogleMap, LoadScript, Marker, Polyline, InfoWindow } from '@react-google-maps/api';
// import {
//     MapPin,
//     Users,
//     Clock,
//     Activity,
//     Settings,
//     RefreshCw,
//     Eye,
//     EyeOff,
//     Navigation,
//     Signal,
//     Battery,
//     Wifi,
//     WifiOff
// } from 'lucide-react';
// import locationService from '../../services/locationService';
// import socketService from '../../services/socketService';

// const mapContainerStyle = {
//     width: '100%',
//     height: '500px'
// };

// const defaultCenter = {
//     lat: 28.6139, // Delhi coordinates as default
//     lng: 77.2090
// };

// const AdminLocationDashboard = () => {
//     const [salesmen, setSalesmen] = useState([]);
//     const [selectedSalesman, setSelectedSalesman] = useState(null);
//     const [locationTrail, setLocationTrail] = useState([]);
//     const [trailHours, setTrailHours] = useState(1);
//     const [loading, setLoading] = useState(true);
//     const [mapCenter, setMapCenter] = useState(defaultCenter);
//     const [selectedMarker, setSelectedMarker] = useState(null);
//     const [realTimeUpdates, setRealTimeUpdates] = useState({});
//     const [isSocketConnected, setIsSocketConnected] = useState(false);
//     const [statistics, setStatistics] = useState(null);
//     const [mapKey, setMapKey] = useState(0); // Force map re-render

//     // Load initial data
//     useEffect(() => {
//         loadSalesmenData();
//         loadStatistics();
//         initializeSocket();

//         return () => {
//             socketService.disconnect();
//         };
//     }, []);

//     // Socket event listeners
//     useEffect(() => {
//         const handleLocationUpdate = (event) => {
//             const data = event.detail;
//             console.log('Received location update:', data);

//             setRealTimeUpdates(prev => ({
//                 ...prev,
//                 [data.salesmanId]: {
//                     ...data,
//                     timestamp: new Date(data.location.timestamp)
//                 }
//             }));

//             // Update salesmen data with real-time location
//             setSalesmen(prev => prev.map(salesman => {
//                 if (salesman.salesman._id === data.salesmanId || salesman.salesman.id === data.salesmanId) {
//                     return {
//                         ...salesman,
//                         location: {
//                             latitude: data.location.lat,
//                             longitude: data.location.lng,
//                             accuracy: data.location.accuracy,
//                             speed: data.location.speed || 0,
//                             timestamp: data.location.timestamp
//                         },
//                         isOnline: true,
//                         lastUpdate: data.location.timestamp
//                     };
//                 }
//                 return salesman;
//             }));

//             // Force map re-render
//             setMapKey(prev => prev + 1);
//         };

//         const handleSalesmanStatus = (event) => {
//             const data = event.detail;
//             console.log('Received status update:', data);

//             setSalesmen(prev => prev.map(salesman => {
//                 if (salesman.salesman._id === data.salesmanId || salesman.salesman.id === data.salesmanId) {
//                     return {
//                         ...salesman,
//                         isOnline: data.isActive,
//                         battery: data.battery,
//                         lastUpdate: data.timestamp
//                     };
//                 }
//                 return salesman;
//             }));
//         };

//         const handleSalesmanDisconnected = (event) => {
//             const data = event.detail;
//             console.log('Salesman disconnected:', data);

//             setSalesmen(prev => prev.map(salesman => {
//                 if (salesman.salesman._id === data.salesmanId || salesman.salesman.id === data.salesmanId) {
//                     return { ...salesman, isOnline: false };
//                 }
//                 return salesman;
//             }));
//         };

//         window.addEventListener('locationUpdate', handleLocationUpdate);
//         window.addEventListener('salesmanStatusUpdate', handleSalesmanStatus);
//         window.addEventListener('salesmanDisconnected', handleSalesmanDisconnected);

//         return () => {
//             window.removeEventListener('locationUpdate', handleLocationUpdate);
//             window.removeEventListener('salesmanStatusUpdate', handleSalesmanStatus);
//             window.removeEventListener('salesmanDisconnected', handleSalesmanDisconnected);
//         };
//     }, []);

//     const initializeSocket = async () => {
//         try {
//             const token = localStorage.getItem('token');
//             const userRole = 'admin';

//             await socketService.connect(token, userRole);
//             setIsSocketConnected(true);
//             console.log('Socket connected successfully');
//         } catch (error) {
//             console.error('Failed to connect to socket:', error);
//             setIsSocketConnected(false);
//         }
//     };

//     const loadSalesmenData = async () => {
//         try {
//             setLoading(true);
//             const response = await locationService.getSalesmenTrackingStatus();
//             console.log('Loaded salesmen data:', response);
//             setSalesmen(response.data || []);

//             // Set map center to first salesman with location
//             const salesmanWithLocation = (response.data || []).find(s => s.location);
//             if (salesmanWithLocation) {
//                 setMapCenter({
//                     lat: salesmanWithLocation.location.latitude,
//                     lng: salesmanWithLocation.location.longitude
//                 });
//             }
//         } catch (error) {
//             console.error('Error loading salesmen data:', error);
//             setSalesmen([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const loadStatistics = async () => {
//         try {
//             const response = await locationService.getLocationStatistics('24h');
//             setStatistics(response.data);
//         } catch (error) {
//             console.error('Error loading statistics:', error);
//         }
//     };

//     const toggleTracking = async (salesmanId, currentStatus) => {
//         try {
//             const newStatus = !currentStatus;
//             await locationService.toggleSalesmanTracking(salesmanId, newStatus);

//             // Update local state
//             setSalesmen(prev => prev.map(salesman => {
//                 const id = salesman.salesman._id || salesman.salesman.id;
//                 if (id === salesmanId) {
//                     return {
//                         ...salesman,
//                         tracking: { ...salesman.tracking, enabled: newStatus }
//                     };
//                 }
//                 return salesman;
//             }));

//             // Send socket event
//             socketService.toggleTracking(salesmanId, newStatus);

//         } catch (error) {
//             console.error('Error toggling tracking:', error);
//         }
//     };

//     const loadLocationTrail = async (salesmanId, hours) => {
//         try {
//             console.log('Loading location trail for:', salesmanId, 'hours:', hours);
//             const response = await locationService.getSalesmanLocationTrail(salesmanId, hours);
//             console.log('Location trail response:', response);

//             if (response.success && response.data.trail) {
//                 const formattedTrail = response.data.trail.map(point => ({
//                     lat: point.latitude,
//                     lng: point.longitude
//                 }));

//                 setLocationTrail(formattedTrail);
//                 setSelectedSalesman(response.data.salesman);

//                 if (formattedTrail.length > 0) {
//                     const lastLocation = formattedTrail[formattedTrail.length - 1];
//                     setMapCenter({
//                         lat: lastLocation.lat,
//                         lng: lastLocation.lng
//                     });
//                 }
//             } else {
//                 setLocationTrail([]);
//                 console.log('No trail data found');
//             }
//         } catch (error) {
//             console.error('Error loading location trail:', error);
//             setLocationTrail([]);
//         }
//     };

//     const handleSalesmanSelect = (salesman) => {
//         console.log('Selected salesman:', salesman);
//         if (salesman.tracking && salesman.tracking.enabled) {
//             const salesmanId = salesman.salesman._id || salesman.salesman.id;
//             loadLocationTrail(salesmanId, trailHours);
//         } else {
//             setLocationTrail([]);
//             setSelectedSalesman(null);
//         }
//     };

//     const getMarkerIcon = (salesman) => {
//         const isOnline = salesman.isOnline;
//         const hasRecentLocation = salesman.location &&
//             locationService.isLocationRecent(salesman.location.timestamp);

//         return {
//             url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
//                 <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
//                     <circle cx="16" cy="16" r="12" fill="${isOnline && hasRecentLocation ? '#10B981' : '#6B7280'}" stroke="white" stroke-width="2"/>
//                     <circle cx="16" cy="16" r="4" fill="white"/>
//                     ${isOnline ? '<circle cx="24" cy="8" r="4" fill="#3B82F6"/>' : ''}
//                 </svg>
//             `)}`,
//             scaledSize: typeof window !== 'undefined' && window.google ? new window.google.maps.Size(32, 32) : null,
//             anchor: typeof window !== 'undefined' && window.google ? new window.google.maps.Point(16, 16) : null
//         };
//     };

//     const formatLastUpdate = (timestamp) => {
//         if (!timestamp) return 'Never';

//         const now = new Date();
//         const updateTime = new Date(timestamp);
//         const diffMinutes = Math.floor((now - updateTime) / (1000 * 60));

//         if (diffMinutes < 1) return 'Just now';
//         if (diffMinutes < 60) return `${diffMinutes}min ago`;

//         const diffHours = Math.floor(diffMinutes / 60);
//         if (diffHours < 24) return `${diffHours}h ago`;

//         const diffDays = Math.floor(diffHours / 24);
//         return `${diffDays}d ago`;
//     };

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center h-96">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//             </div>
//         );
//     }

//     const activeSalesmen = salesmen.filter(s => s.location && s.tracking && s.tracking.enabled);

//     return (
//         <div className="p-6 bg-gray-50 min-h-screen">
//             {/* Header */}
//             <div className="mb-6">
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//                     <div>
//                         <h1 className="text-2xl font-bold text-gray-900">Location Tracking Dashboard</h1>
//                         <p className="text-gray-600 mt-1">Monitor salesman locations in real-time</p>
//                     </div>
//                     <div className="flex items-center space-x-4 mt-4 sm:mt-0">
//                         <div className="flex items-center space-x-2">
//                             {isSocketConnected ? (
//                                 <Wifi className="h-5 w-5 text-green-500" />
//                             ) : (
//                                 <WifiOff className="h-5 w-5 text-red-500" />
//                             )}
//                             <span className="text-sm text-gray-600">
//                                 {isSocketConnected ? 'Connected' : 'Disconnected'}
//                             </span>
//                         </div>
//                         <button
//                             onClick={loadSalesmenData}
//                             className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                         >
//                             <RefreshCw className="h-4 w-4" />
//                             <span>Refresh</span>
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Statistics Cards */}
//             {statistics && (
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
//                     <div className="bg-white p-6 rounded-lg shadow">
//                         <div className="flex items-center">
//                             <Users className="h-8 w-8 text-blue-600" />
//                             <div className="ml-4">
//                                 <p className="text-sm font-medium text-gray-600">Active Salesmen</p>
//                                 <p className="text-2xl font-bold text-gray-900">
//                                     {statistics.overall?.uniqueSalesmenCount || 0}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-white p-6 rounded-lg shadow">
//                         <div className="flex items-center">
//                             <MapPin className="h-8 w-8 text-green-600" />
//                             <div className="ml-4">
//                                 <p className="text-sm font-medium text-gray-600">Location Updates</p>
//                                 <p className="text-2xl font-bold text-gray-900">
//                                     {statistics.overall?.totalLocations || 0}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-white p-6 rounded-lg shadow">
//                         <div className="flex items-center">
//                             <Signal className="h-8 w-8 text-yellow-600" />
//                             <div className="ml-4">
//                                 <p className="text-sm font-medium text-gray-600">Avg Accuracy</p>
//                                 <p className="text-2xl font-bold text-gray-900">
//                                     {statistics.overall?.avgAccuracy || 0}m
//                                 </p>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-white p-6 rounded-lg shadow">
//                         <div className="flex items-center">
//                             <Activity className="h-8 w-8 text-purple-600" />
//                             <div className="ml-4">
//                                 <p className="text-sm font-medium text-gray-600">Online Now</p>
//                                 <p className="text-2xl font-bold text-gray-900">
//                                     {salesmen.filter(s => s.isOnline).length}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                 {/* Salesmen List */}
//                 <div className="lg:col-span-1">
//                     <div className="bg-white rounded-lg shadow">
//                         <div className="p-4 border-b border-gray-200">
//                             <h2 className="text-lg font-semibold text-gray-900">Salesmen ({salesmen.length})</h2>
//                         </div>
//                         <div className="max-h-96 overflow-y-auto">
//                             {salesmen.length === 0 ? (
//                                 <div className="p-4 text-center text-gray-500">
//                                     No salesmen found
//                                 </div>
//                             ) : (
//                                 salesmen.map((salesman) => {
//                                     const salesmanId = salesman.salesman._id || salesman.salesman.id;
//                                     const isSelected = selectedSalesman && (selectedSalesman._id === salesmanId || selectedSalesman.id === salesmanId);

//                                     return (
//                                         <div
//                                             key={salesmanId}
//                                             className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
//                                             onClick={() => handleSalesmanSelect(salesman)}
//                                         >
//                                             <div className="flex items-center justify-between">
//                                                 <div className="flex items-center space-x-3">
//                                                     <div className={`w-3 h-3 rounded-full ${salesman.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
//                                                     <div>
//                                                         <p className="font-medium text-gray-900">
//                                                             {salesman.salesman.name}
//                                                         </p>
//                                                         <p className="text-sm text-gray-600">
//                                                             @{salesman.salesman.username}
//                                                         </p>
//                                                     </div>
//                                                 </div>
//                                                 <button
//                                                     onClick={(e) => {
//                                                         e.stopPropagation();
//                                                         toggleTracking(salesmanId, salesman.tracking?.enabled || false);
//                                                     }}
//                                                     className={`p-2 rounded-lg ${(salesman.tracking?.enabled)
//                                                         ? 'bg-green-100 text-green-600 hover:bg-green-200'
//                                                         : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                                                         }`}
//                                                 >
//                                                     {(salesman.tracking?.enabled) ? (
//                                                         <Eye className="h-4 w-4" />
//                                                     ) : (
//                                                         <EyeOff className="h-4 w-4" />
//                                                     )}
//                                                 </button>
//                                             </div>

//                                             {salesman.location && (
//                                                 <div className="mt-2 text-sm text-gray-600">
//                                                     <div className="flex items-center space-x-2">
//                                                         <MapPin className="h-4 w-4" />
//                                                         <span>
//                                                             Accuracy: {salesman.location.accuracy?.toFixed(0) || 'N/A'}m
//                                                         </span>
//                                                     </div>
//                                                     <div className="flex items-center space-x-2 mt-1">
//                                                         <Clock className="h-4 w-4" />
//                                                         <span>
//                                                             {formatLastUpdate(salesman.location.timestamp)}
//                                                         </span>
//                                                     </div>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     );
//                                 })
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Map */}
//                 <div className="lg:col-span-2">
//                     <div className="bg-white rounded-lg shadow">
//                         <div className="p-4 border-b border-gray-200">
//                             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//                                 <h2 className="text-lg font-semibold text-gray-900">
//                                     Live Map ({activeSalesmen.length} active)
//                                 </h2>
//                                 {selectedSalesman && (
//                                     <div className="flex items-center space-x-4 mt-2 sm:mt-0">
//                                         <span className="text-sm text-gray-600">Trail Duration:</span>
//                                         <select
//                                             value={trailHours}
//                                             onChange={(e) => {
//                                                 const hours = parseInt(e.target.value);
//                                                 setTrailHours(hours);
//                                                 if (selectedSalesman) {
//                                                     const salesmanId = selectedSalesman._id || selectedSalesman.id;
//                                                     loadLocationTrail(salesmanId, hours);
//                                                 }
//                                             }}
//                                             className="px-3 py-1 border border-gray-300 rounded-md text-sm"
//                                         >
//                                             <option value={1}>1 Hour</option>
//                                             <option value={2}>2 Hours</option>
//                                             <option value={6}>6 Hours</option>
//                                             <option value={12}>12 Hours</option>
//                                             <option value={24}>24 Hours</option>
//                                         </select>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>

//                         <div className="p-4">
//                                 <GoogleMap
//                                     key={mapKey}
//                                     mapContainerStyle={mapContainerStyle}
//                                     center={mapCenter}
//                                     zoom={13}
//                                     options={{
//                                         zoomControl: true,
//                                         streetViewControl: false,
//                                         mapTypeControl: false,
//                                         fullscreenControl: true,
//                                     }}
//                                 >
//                                     {/* Salesman markers */}
//                                     {activeSalesmen.map((salesman) => {
//                                         const salesmanId = salesman.salesman._id || salesman.salesman.id;
//                                         return (
//                                             <Marker
//                                                 key={salesmanId}
//                                                 position={{
//                                                     lat: salesman.location.latitude,
//                                                     lng: salesman.location.longitude
//                                                 }}
//                                                 icon={getMarkerIcon(salesman)}
//                                                 onClick={() => setSelectedMarker(salesman)}
//                                             />
//                                         );
//                                     })}

//                                     {/* Location trail */}
//                                     {locationTrail.length > 1 && (
//                                         <Polyline
//                                             path={locationTrail}
//                                             options={{
//                                                 strokeColor: '#3B82F6',
//                                                 strokeOpacity: 0.8,
//                                                 strokeWeight: 3,
//                                                 geodesic: true
//                                             }}
//                                         />
//                                     )}

//                                     {/* Info window */}
//                                     {selectedMarker && (
//                                         <InfoWindow
//                                             position={{
//                                                 lat: selectedMarker.location.latitude,
//                                                 lng: selectedMarker.location.longitude
//                                             }}
//                                             onCloseClick={() => setSelectedMarker(null)}
//                                         >
//                                             <div className="p-2">
//                                                 <h3 className="font-semibold text-gray-900">
//                                                     {selectedMarker.salesman.name}
//                                                 </h3>
//                                                 <p className="text-sm text-gray-600">
//                                                     @{selectedMarker.salesman.username}
//                                                 </p>
//                                                 <div className="mt-2 space-y-1 text-sm">
//                                                     <div className="flex items-center space-x-2">
//                                                         <Signal className="h-4 w-4 text-gray-500" />
//                                                         <span>Accuracy: {selectedMarker.location.accuracy?.toFixed(0) || 'N/A'}m</span>
//                                                     </div>
//                                                     <div className="flex items-center space-x-2">
//                                                         <Clock className="h-4 w-4 text-gray-500" />
//                                                         <span>{formatLastUpdate(selectedMarker.location.timestamp)}</span>
//                                                     </div>
//                                                     {selectedMarker.location.speed > 0 && (
//                                                         <div className="flex items-center space-x-2">
//                                                             <Navigation className="h-4 w-4 text-gray-500" />
//                                                             <span>{(selectedMarker.location.speed * 3.6).toFixed(1)} km/h</span>
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </InfoWindow>
//                                     )}
//                                 </GoogleMap>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AdminLocationDashboard;

// import React, { useState, useEffect, useCallback } from 'react';
// import { GoogleMap, LoadScript, Marker, Polyline, InfoWindow } from '@react-google-maps/api';
// import {
//     MapPin,
//     Users,
//     Clock,
//     Activity,
//     Settings,
//     RefreshCw,
//     Eye,
//     EyeOff,
//     Navigation,
//     Signal,
//     Battery,
//     Wifi,
//     WifiOff
// } from 'lucide-react';
// import locationService from '../../services/locationService';
// import socketService from '../../services/socketService';

// const mapContainerStyle = {
//     width: '100%',
//     height: '500px'
// };

// const defaultCenter = {
//     lat: 28.6139, // Delhi coordinates as default
//     lng: 77.2090
// };

// const AdminLocationDashboard = () => {
//     const [salesmen, setSalesmen] = useState([]);
//     const [selectedSalesman, setSelectedSalesman] = useState(null);
//     const [locationTrail, setLocationTrail] = useState([]);
//     const [trailHours, setTrailHours] = useState(1);
//     const [loading, setLoading] = useState(true);
//     const [mapCenter, setMapCenter] = useState(defaultCenter);
//     const [mapZoom, setMapZoom] = useState(15);
//     const [selectedMarker, setSelectedMarker] = useState(null);
//     const [realTimeUpdates, setRealTimeUpdates] = useState({});
//     const [isSocketConnected, setIsSocketConnected] = useState(false);
//     const [statistics, setStatistics] = useState(null);
//     const [mapKey, setMapKey] = useState(0); // Force map re-render
//     const [autoZoom, setAutoZoom] = useState(true); // Control auto-zoom behavior

//     // Load initial data
//     useEffect(() => {
//         loadSalesmenData();
//         loadStatistics();
//         initializeSocket();

//         return () => {
//             socketService.disconnect();
//         };
//     }, []);

//     // Socket event listeners
//     useEffect(() => {
//         const handleLocationUpdate = (event) => {
//             const data = event.detail;
//             console.log('Received location update:', data);

//             setRealTimeUpdates(prev => ({
//                 ...prev,
//                 [data.salesmanId]: {
//                     ...data,
//                     timestamp: new Date(data.location.timestamp)
//                 }
//             }));

//             // Update salesmen data with real-time location
//             setSalesmen(prev => prev.map(salesman => {
//                 const salesmanId = salesman.salesman._id || salesman.salesman.id;
//                 if (salesmanId === data.salesmanId) {
//                     const updatedSalesman = {
//                         ...salesman,
//                         location: {
//                             latitude: data.location.lat,
//                             longitude: data.location.lng,
//                             accuracy: data.location.accuracy,
//                             speed: data.location.speed || 0,
//                             timestamp: data.location.timestamp
//                         },
//                         isOnline: true,
//                         lastUpdate: data.location.timestamp
//                     };

//                     // Auto-zoom to the updated salesman if they're selected or if auto-zoom is enabled
//                     if (autoZoom || (selectedSalesman && (selectedSalesman._id === salesmanId || selectedSalesman.id === salesmanId))) {
//                         console.log('Auto-zooming to salesman location:', data.location);
//                         setMapCenter({
//                             lat: data.location.lat,
//                             lng: data.location.lng
//                         });
//                         setMapZoom(16); // Closer zoom for real-time tracking
//                         setMapKey(prev => prev + 1); // Force map re-render
//                     }

//                     return updatedSalesman;
//                 }
//                 return salesman;
//             }));
//         };

//         const handleSalesmanStatus = (event) => {
//             const data = event.detail;
//             console.log('Received status update:', data);

//             setSalesmen(prev => prev.map(salesman => {
//                 const salesmanId = salesman.salesman._id || salesman.salesman.id;
//                 if (salesmanId === data.salesmanId) {
//                     return {
//                         ...salesman,
//                         isOnline: data.isActive,
//                         battery: data.battery,
//                         lastUpdate: data.timestamp
//                     };
//                 }
//                 return salesman;
//             }));
//         };

//         const handleSalesmanDisconnected = (event) => {
//             const data = event.detail;
//             console.log('Salesman disconnected:', data);

//             setSalesmen(prev => prev.map(salesman => {
//                 const salesmanId = salesman.salesman._id || salesman.salesman.id;
//                 if (salesmanId === data.salesmanId) {
//                     return { ...salesman, isOnline: false };
//                 }
//                 return salesman;
//             }));
//         };

//         window.addEventListener('locationUpdate', handleLocationUpdate);
//         window.addEventListener('salesmanStatusUpdate', handleSalesmanStatus);
//         window.addEventListener('salesmanDisconnected', handleSalesmanDisconnected);

//         return () => {
//             window.removeEventListener('locationUpdate', handleLocationUpdate);
//             window.removeEventListener('salesmanStatusUpdate', handleSalesmanStatus);
//             window.removeEventListener('salesmanDisconnected', handleSalesmanDisconnected);
//         };
//     }, [selectedSalesman, autoZoom]);

//     const initializeSocket = async () => {
//         try {
//             const token = localStorage.getItem('token');
//             const userRole = 'admin';

//             await socketService.connect(token, userRole);
//             setIsSocketConnected(true);
//             console.log('Socket connected successfully');
//         } catch (error) {
//             console.error('Failed to connect to socket:', error);
//             setIsSocketConnected(false);
//         }
//     };

//     const loadSalesmenData = async () => {
//         try {
//             setLoading(true);
//             const response = await locationService.getSalesmenTrackingStatus();
//             console.log('Loaded salesmen data:', response);
//             setSalesmen(response.data || []);

//             // Set map center to first salesman with location
//             const salesmanWithLocation = (response.data || []).find(s => s.location);
//             if (salesmanWithLocation && autoZoom) {
//                 setMapCenter({
//                     lat: salesmanWithLocation.location.latitude,
//                     lng: salesmanWithLocation.location.longitude
//                 });
//                 setMapZoom(14);
//             }
//         } catch (error) {
//             console.error('Error loading salesmen data:', error);
//             setSalesmen([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const loadStatistics = async () => {
//         try {
//             const response = await locationService.getLocationStatistics('24h');
//             setStatistics(response.data);
//         } catch (error) {
//             console.error('Error loading statistics:', error);
//         }
//     };

//     const toggleTracking = async (salesmanId, currentStatus) => {
//         try {
//             const newStatus = !currentStatus;
//             await locationService.toggleSalesmanTracking(salesmanId, newStatus);

//             // Update local state
//             setSalesmen(prev => prev.map(salesman => {
//                 const id = salesman.salesman._id || salesman.salesman.id;
//                 if (id === salesmanId) {
//                     return {
//                         ...salesman,
//                         tracking: { ...salesman.tracking, enabled: newStatus }
//                     };
//                 }
//                 return salesman;
//             }));

//             // Send socket event
//             socketService.toggleTracking(salesmanId, newStatus);

//         } catch (error) {
//             console.error('Error toggling tracking:', error);
//         }
//     };

//     const loadLocationTrail = async (salesmanId, hours) => {
//         try {
//             console.log('Loading location trail for:', salesmanId, 'hours:', hours);
//             const response = await locationService.getSalesmanLocationTrail(salesmanId, hours);
//             console.log('Location trail response:', response);

//             if (response.success && response.data.trail) {
//                 const formattedTrail = response.data.trail.map(point => ({
//                     lat: point.latitude,
//                     lng: point.longitude
//                 }));

//                 setLocationTrail(formattedTrail);
//                 setSelectedSalesman(response.data.salesman);

//                 if (formattedTrail.length > 0) {
//                     const lastLocation = formattedTrail[formattedTrail.length - 1];
//                     setMapCenter({
//                         lat: lastLocation.lat,
//                         lng: lastLocation.lng
//                     });
//                     setMapZoom(15);
//                     setMapKey(prev => prev + 1);
//                 }
//             } else {
//                 setLocationTrail([]);
//                 console.log('No trail data found');
//             }
//         } catch (error) {
//             console.error('Error loading location trail:', error);
//             setLocationTrail([]);
//         }
//     };

//     const handleSalesmanSelect = (salesman) => {
//         console.log('Selected salesman:', salesman);
//         if (salesman.tracking && salesman.tracking.enabled) {
//             const salesmanId = salesman.salesman._id || salesman.salesman.id;
//             loadLocationTrail(salesmanId, trailHours);

//             // Zoom to salesman's current location if available
//             if (salesman.location) {
//                 setMapCenter({
//                     lat: salesman.location.latitude,
//                     lng: salesman.location.longitude
//                 });
//                 setMapZoom(16);
//                 setMapKey(prev => prev + 1);
//             }
//         } else {
//             setLocationTrail([]);
//             setSelectedSalesman(null);
//         }
//     };

//     const getMarkerIcon = (salesman) => {
//         const isOnline = salesman.isOnline;
//         const hasRecentLocation = salesman.location &&
//             locationService.isLocationRecent(salesman.location.timestamp);

//         return {
//             url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
//                 <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
//                     <circle cx="16" cy="16" r="12" fill="${isOnline && hasRecentLocation ? '#10B981' : '#6B7280'}" stroke="white" stroke-width="2"/>
//                     <circle cx="16" cy="16" r="4" fill="white"/>
//                     ${isOnline ? '<circle cx="24" cy="8" r="4" fill="#3B82F6"/>' : ''}
//                 </svg>
//             `)}`,
//             scaledSize: typeof window !== 'undefined' && window.google ? new window.google.maps.Size(32, 32) : null,
//             anchor: typeof window !== 'undefined' && window.google ? new window.google.maps.Point(16, 16) : null
//         };
//     };

//     const formatLastUpdate = (timestamp) => {
//         if (!timestamp) return 'Never';

//         const now = new Date();
//         const updateTime = new Date(timestamp);
//         const diffMinutes = Math.floor((now - updateTime) / (1000 * 60));

//         if (diffMinutes < 1) return 'Just now';
//         if (diffMinutes < 60) return `${diffMinutes}min ago`;

//         const diffHours = Math.floor(diffMinutes / 60);
//         if (diffHours < 24) return `${diffHours}h ago`;

//         const diffDays = Math.floor(diffHours / 24);
//         return `${diffDays}d ago`;
//     };

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center h-96">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//             </div>
//         );
//     }

//     const activeSalesmen = salesmen.filter(s => s.location && s.tracking && s.tracking.enabled);

//     return (
//         <div className="p-6 bg-gray-50 min-h-screen">
//             {/* Header */}
//             <div className="mb-6">
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//                     <div>
//                         <h1 className="text-2xl font-bold text-gray-900">Location Tracking Dashboard</h1>
//                         <p className="text-gray-600 mt-1">Monitor salesman locations in real-time</p>
//                     </div>
//                     <div className="flex items-center space-x-4 mt-4 sm:mt-0">
//                         <div className="flex items-center space-x-2">
//                             {isSocketConnected ? (
//                                 <Wifi className="h-5 w-5 text-green-500" />
//                             ) : (
//                                 <WifiOff className="h-5 w-5 text-red-500" />
//                             )}
//                             <span className="text-sm text-gray-600">
//                                 {isSocketConnected ? 'Connected' : 'Disconnected'}
//                             </span>
//                         </div>
//                         <button
//                             onClick={() => setAutoZoom(!autoZoom)}
//                             className={`px-3 py-1 text-sm rounded-lg ${autoZoom
//                                 ? 'bg-blue-100 text-blue-700'
//                                 : 'bg-gray-100 text-gray-700'
//                                 }`}
//                         >
//                             Auto-Zoom: {autoZoom ? 'ON' : 'OFF'}
//                         </button>
//                         <button
//                             onClick={loadSalesmenData}
//                             className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                         >
//                             <RefreshCw className="h-4 w-4" />
//                             <span>Refresh</span>
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Statistics Cards */}
//             {statistics && (
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
//                     <div className="bg-white p-6 rounded-lg shadow">
//                         <div className="flex items-center">
//                             <Users className="h-8 w-8 text-blue-600" />
//                             <div className="ml-4">
//                                 <p className="text-sm font-medium text-gray-600">Active Salesmen</p>
//                                 <p className="text-2xl font-bold text-gray-900">
//                                     {statistics.overall?.uniqueSalesmenCount || 0}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-white p-6 rounded-lg shadow">
//                         <div className="flex items-center">
//                             <MapPin className="h-8 w-8 text-green-600" />
//                             <div className="ml-4">
//                                 <p className="text-sm font-medium text-gray-600">Location Updates</p>
//                                 <p className="text-2xl font-bold text-gray-900">
//                                     {statistics.overall?.totalLocations || 0}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-white p-6 rounded-lg shadow">
//                         <div className="flex items-center">
//                             <Signal className="h-8 w-8 text-yellow-600" />
//                             <div className="ml-4">
//                                 <p className="text-sm font-medium text-gray-600">Avg Accuracy</p>
//                                 <p className="text-2xl font-bold text-gray-900">
//                                     {statistics.overall?.avgAccuracy || 0}m
//                                 </p>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-white p-6 rounded-lg shadow">
//                         <div className="flex items-center">
//                             <Activity className="h-8 w-8 text-purple-600" />
//                             <div className="ml-4">
//                                 <p className="text-sm font-medium text-gray-600">Online Now</p>
//                                 <p className="text-2xl font-bold text-gray-900">
//                                     {salesmen.filter(s => s.isOnline).length}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                 {/* Salesmen List */}
//                 <div className="lg:col-span-1">
//                     <div className="bg-white rounded-lg shadow">
//                         <div className="p-4 border-b border-gray-200">
//                             <h2 className="text-lg font-semibold text-gray-900">Salesmen ({salesmen.length})</h2>
//                         </div>
//                         <div className="max-h-96 overflow-y-auto">
//                             {salesmen.length === 0 ? (
//                                 <div className="p-4 text-center text-gray-500">
//                                     No salesmen found
//                                 </div>
//                             ) : (
//                                 salesmen.map((salesman) => {
//                                     const salesmanId = salesman.salesman._id || salesman.salesman.id;
//                                     const isSelected = selectedSalesman && (selectedSalesman._id === salesmanId || selectedSalesman.id === salesmanId);

//                                     return (
//                                         <div
//                                             key={salesmanId}
//                                             className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
//                                             onClick={() => handleSalesmanSelect(salesman)}
//                                         >
//                                             <div className="flex items-center justify-between">
//                                                 <div className="flex items-center space-x-3">
//                                                     <div className={`w-3 h-3 rounded-full ${salesman.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
//                                                     <div>
//                                                         <p className="font-medium text-gray-900">
//                                                             {salesman.salesman.name}
//                                                         </p>
//                                                         <p className="text-sm text-gray-600">
//                                                             @{salesman.salesman.username}
//                                                         </p>
//                                                     </div>
//                                                 </div>
//                                                 <button
//                                                     onClick={(e) => {
//                                                         e.stopPropagation();
//                                                         toggleTracking(salesmanId, salesman.tracking?.enabled || false);
//                                                     }}
//                                                     className={`p-2 rounded-lg ${(salesman.tracking?.enabled)
//                                                         ? 'bg-green-100 text-green-600 hover:bg-green-200'
//                                                         : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                                                         }`}
//                                                 >
//                                                     {(salesman.tracking?.enabled) ? (
//                                                         <Eye className="h-4 w-4" />
//                                                     ) : (
//                                                         <EyeOff className="h-4 w-4" />
//                                                     )}
//                                                 </button>
//                                             </div>

//                                             {salesman.location && (
//                                                 <div className="mt-2 text-sm text-gray-600">
//                                                     <div className="flex items-center space-x-2">
//                                                         <MapPin className="h-4 w-4" />
//                                                         <span>
//                                                             Accuracy: {salesman.location.accuracy?.toFixed(0) || 'N/A'}m
//                                                         </span>
//                                                     </div>
//                                                     <div className="flex items-center space-x-2 mt-1">
//                                                         <Clock className="h-4 w-4" />
//                                                         <span>
//                                                             {formatLastUpdate(salesman.location.timestamp)}
//                                                         </span>
//                                                     </div>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     );
//                                 })
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Map */}
//                 <div className="lg:col-span-2">
//                     <div className="bg-white rounded-lg shadow">
//                         <div className="p-4 border-b border-gray-200">
//                             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//                                 <h2 className="text-lg font-semibold text-gray-900">
//                                     Live Map ({activeSalesmen.length} active)
//                                 </h2>
//                                 {selectedSalesman && (
//                                     <div className="flex items-center space-x-4 mt-2 sm:mt-0">
//                                         <span className="text-sm text-gray-600">Trail Duration:</span>
//                                         <select
//                                             value={trailHours}
//                                             onChange={(e) => {
//                                                 const hours = parseInt(e.target.value);
//                                                 setTrailHours(hours);
//                                                 if (selectedSalesman) {
//                                                     const salesmanId = selectedSalesman._id || selectedSalesman.id;
//                                                     loadLocationTrail(salesmanId, hours);
//                                                 }
//                                             }}
//                                             className="px-3 py-1 border border-gray-300 rounded-md text-sm"
//                                         >
//                                             <option value={1}>1 Hour</option>
//                                             <option value={2}>2 Hours</option>
//                                             <option value={6}>6 Hours</option>
//                                             <option value={12}>12 Hours</option>
//                                             <option value={24}>24 Hours</option>
//                                         </select>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>

//                         <div className="p-4">
//                                 <GoogleMap
//                                     key={mapKey}
//                                     mapContainerStyle={mapContainerStyle}
//                                     center={mapCenter}
//                                     zoom={mapZoom}
//                                     options={{
//                                         zoomControl: true,
//                                         streetViewControl: false,
//                                         mapTypeControl: false,
//                                         fullscreenControl: true,
//                                     }}
//                                 >
//                                     {/* Salesman markers */}
//                                     {activeSalesmen.map((salesman) => {
//                                         const salesmanId = salesman.salesman._id || salesman.salesman.id;
//                                         return (
//                                             <Marker
//                                                 key={salesmanId}
//                                                 position={{
//                                                     lat: salesman.location.latitude,
//                                                     lng: salesman.location.longitude
//                                                 }}
//                                                 icon={getMarkerIcon(salesman)}
//                                                 onClick={() => setSelectedMarker(salesman)}
//                                             />
//                                         );
//                                     })}

//                                     {/* Location trail */}
//                                     {locationTrail.length > 1 && (
//                                         <Polyline
//                                             path={locationTrail}
//                                             options={{
//                                                 strokeColor: '#3B82F6',
//                                                 strokeOpacity: 0.8,
//                                                 strokeWeight: 3,
//                                                 geodesic: true
//                                             }}
//                                         />
//                                     )}

//                                     {/* Info window */}
//                                     {selectedMarker && (
//                                         <InfoWindow
//                                             position={{
//                                                 lat: selectedMarker.location.latitude,
//                                                 lng: selectedMarker.location.longitude
//                                             }}
//                                             onCloseClick={() => setSelectedMarker(null)}
//                                         >
//                                             <div className="p-2">
//                                                 <h3 className="font-semibold text-gray-900">
//                                                     {selectedMarker.salesman.name}
//                                                 </h3>
//                                                 <p className="text-sm text-gray-600">
//                                                     @{selectedMarker.salesman.username}
//                                                 </p>
//                                                 <div className="mt-2 space-y-1 text-sm">
//                                                     <div className="flex items-center space-x-2">
//                                                         <Signal className="h-4 w-4 text-gray-500" />
//                                                         <span>Accuracy: {selectedMarker.location.accuracy?.toFixed(0) || 'N/A'}m</span>
//                                                     </div>
//                                                     <div className="flex items-center space-x-2">
//                                                         <Clock className="h-4 w-4 text-gray-500" />
//                                                         <span>{formatLastUpdate(selectedMarker.location.timestamp)}</span>
//                                                     </div>
//                                                     {selectedMarker.location.speed > 0 && (
//                                                         <div className="flex items-center space-x-2">
//                                                             <Navigation className="h-4 w-4 text-gray-500" />
//                                                             <span>{(selectedMarker.location.speed * 3.6).toFixed(1)} km/h</span>
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </InfoWindow>
//                                     )}
//                                 </GoogleMap>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AdminLocationDashboard;


// claude trail update code
// import React, { useState, useEffect, useCallback } from 'react';
// import { GoogleMap, LoadScript, Marker, Polyline, InfoWindow } from '@react-google-maps/api';
// import {
//     MapPin,
//     Users,
//     Clock,
//     Activity,
//     Settings,
//     RefreshCw,
//     Eye,
//     EyeOff,
//     Navigation,
//     Signal,
//     Battery,
//     Wifi,
//     WifiOff
// } from 'lucide-react';
// import locationService from '../../services/locationService';
// import socketService from '../../services/socketService';

// const mapContainerStyle = {
//     width: '100%',
//     height: '500px'
// };

// const defaultCenter = {
//     lat: 28.6139, // Delhi coordinates as default
//     lng: 77.2090
// };

// const AdminLocationDashboard = () => {
//     const [salesmen, setSalesmen] = useState([]);
//     const [selectedSalesman, setSelectedSalesman] = useState(null);
//     const [locationTrail, setLocationTrail] = useState([]);
//     const [trailHours, setTrailHours] = useState(1);
//     const [loading, setLoading] = useState(true);
//     const [mapCenter, setMapCenter] = useState(defaultCenter);
//     const [mapZoom, setMapZoom] = useState(15);
//     const [selectedMarker, setSelectedMarker] = useState(null);
//     const [realTimeUpdates, setRealTimeUpdates] = useState({});
//     const [isSocketConnected, setIsSocketConnected] = useState(false);
//     const [statistics, setStatistics] = useState(null);
//     const [mapKey, setMapKey] = useState(0); // Force map re-render
//     const [autoZoom, setAutoZoom] = useState(true); // Control auto-zoom behavior
//     const [trailLoading, setTrailLoading] = useState(false); // Trail loading state

//     // Load initial data
//     useEffect(() => {
//         loadSalesmenData();
//         loadStatistics();
//         initializeSocket();

//         return () => {
//             socketService.disconnect();
//         };
//     }, []);

//     // Socket event listeners
//     useEffect(() => {
//         const handleLocationUpdate = (event) => {
//             const data = event.detail;
//             console.log('Received location update:', data);

//             setRealTimeUpdates(prev => ({
//                 ...prev,
//                 [data.salesmanId]: {
//                     ...data,
//                     timestamp: new Date(data.location.timestamp)
//                 }
//             }));

//             // Update salesmen data with real-time location
//             setSalesmen(prev => prev.map(salesman => {
//                 const salesmanId = salesman.salesman._id || salesman.salesman.id;
//                 if (salesmanId === data.salesmanId) {
//                     const updatedSalesman = {
//                         ...salesman,
//                         location: {
//                             latitude: data.location.lat,
//                             longitude: data.location.lng,
//                             accuracy: data.location.accuracy,
//                             speed: data.location.speed || 0,
//                             timestamp: data.location.timestamp
//                         },
//                         isOnline: true,
//                         lastUpdate: data.location.timestamp
//                     };

//                     // Auto-zoom to the updated salesman if they're selected or if auto-zoom is enabled
//                     if (autoZoom || (selectedSalesman && (selectedSalesman._id === salesmanId || selectedSalesman.id === salesmanId))) {
//                         console.log('Auto-zooming to salesman location:', data.location);
//                         setMapCenter({
//                             lat: data.location.lat,
//                             lng: data.location.lng
//                         });
//                         setMapZoom(16); // Closer zoom for real-time tracking
//                         setMapKey(prev => prev + 1); // Force map re-render
//                     }

//                     // If this salesman is selected, update their trail with new location
//                     if (selectedSalesman && (selectedSalesman._id === salesmanId || selectedSalesman.id === salesmanId)) {
//                         setLocationTrail(prev => {
//                             const newPoint = {
//                                 lat: data.location.lat,
//                                 lng: data.location.lng
//                             };
//                             // Add new point to trail, limit to last 100 points to prevent memory issues
//                             const updatedTrail = [...prev, newPoint].slice(-100);
//                             console.log('Updated trail with new point:', updatedTrail);
//                             return updatedTrail;
//                         });
//                     }

//                     return updatedSalesman;
//                 }
//                 return salesman;
//             }));
//         };

//         const handleSalesmanStatus = (event) => {
//             const data = event.detail;
//             console.log('Received status update:', data);

//             setSalesmen(prev => prev.map(salesman => {
//                 const salesmanId = salesman.salesman._id || salesman.salesman.id;
//                 if (salesmanId === data.salesmanId) {
//                     return {
//                         ...salesman,
//                         isOnline: data.isActive,
//                         battery: data.battery,
//                         lastUpdate: data.timestamp
//                     };
//                 }
//                 return salesman;
//             }));
//         };

//         const handleSalesmanDisconnected = (event) => {
//             const data = event.detail;
//             console.log('Salesman disconnected:', data);

//             setSalesmen(prev => prev.map(salesman => {
//                 const salesmanId = salesman.salesman._id || salesman.salesman.id;
//                 if (salesmanId === data.salesmanId) {
//                     return { ...salesman, isOnline: false };
//                 }
//                 return salesman;
//             }));
//         };

//         window.addEventListener('locationUpdate', handleLocationUpdate);
//         window.addEventListener('salesmanStatusUpdate', handleSalesmanStatus);
//         window.addEventListener('salesmanDisconnected', handleSalesmanDisconnected);

//         return () => {
//             window.removeEventListener('locationUpdate', handleLocationUpdate);
//             window.removeEventListener('salesmanStatusUpdate', handleSalesmanStatus);
//             window.removeEventListener('salesmanDisconnected', handleSalesmanDisconnected);
//         };
//     }, [selectedSalesman, autoZoom]);

//     const initializeSocket = async () => {
//         try {
//             const token = localStorage.getItem('token');
//             const userRole = 'admin';

//             await socketService.connect(token, userRole);
//             setIsSocketConnected(true);
//             console.log('Socket connected successfully');
//         } catch (error) {
//             console.error('Failed to connect to socket:', error);
//             setIsSocketConnected(false);
//         }
//     };

//     const loadSalesmenData = async () => {
//         try {
//             setLoading(true);
//             const response = await locationService.getSalesmenTrackingStatus();
//             console.log('Loaded salesmen data:', response);
//             setSalesmen(response.data || []);

//             // Set map center to first salesman with location
//             const salesmanWithLocation = (response.data || []).find(s => s.location);
//             if (salesmanWithLocation && autoZoom) {
//                 setMapCenter({
//                     lat: salesmanWithLocation.location.latitude,
//                     lng: salesmanWithLocation.location.longitude
//                 });
//                 setMapZoom(14);
//             }
//         } catch (error) {
//             console.error('Error loading salesmen data:', error);
//             setSalesmen([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const loadStatistics = async () => {
//         try {
//             const response = await locationService.getLocationStatistics('24h');
//             setStatistics(response.data);
//         } catch (error) {
//             console.error('Error loading statistics:', error);
//         }
//     };

//     const toggleTracking = async (salesmanId, currentStatus) => {
//         try {
//             const newStatus = !currentStatus;
//             await locationService.toggleSalesmanTracking(salesmanId, newStatus);

//             // Update local state
//             setSalesmen(prev => prev.map(salesman => {
//                 const id = salesman.salesman._id || salesman.salesman.id;
//                 if (id === salesmanId) {
//                     return {
//                         ...salesman,
//                         tracking: { ...salesman.tracking, enabled: newStatus }
//                     };
//                 }
//                 return salesman;
//             }));

//             // Send socket event
//             socketService.toggleTracking(salesmanId, newStatus);

//         } catch (error) {
//             console.error('Error toggling tracking:', error);
//         }
//     };

//     const loadLocationTrail = async (salesmanId, hours) => {
//         try {
//             console.log('Loading location trail for:', salesmanId, 'hours:', hours);
//             setTrailLoading(true);

//             const response = await locationService.getSalesmanLocationTrail(salesmanId, hours);
//             console.log('Location trail response:', response);

//             if (response.success && response.data.trail && response.data.trail.length > 0) {
//                 // Remove duplicate consecutive points to clean up the trail
//                 const cleanedTrail = response.data.trail.reduce((acc, point, index) => {
//                     if (index === 0) {
//                         acc.push({
//                             lat: point.latitude,
//                             lng: point.longitude
//                         });
//                     } else {
//                         const prevPoint = response.data.trail[index - 1];
//                         // Only add point if it's different from the previous one (with small tolerance)
//                         const latDiff = Math.abs(point.latitude - prevPoint.latitude);
//                         const lngDiff = Math.abs(point.longitude - prevPoint.longitude);
//                         if (latDiff > 0.0001 || lngDiff > 0.0001) { // ~10 meter tolerance
//                             acc.push({
//                                 lat: point.latitude,
//                                 lng: point.longitude
//                             });
//                         }
//                     }
//                     return acc;
//                 }, []);

//                 console.log('Cleaned trail points:', cleanedTrail);
//                 setLocationTrail(cleanedTrail);
//                 setSelectedSalesman(response.data.salesman);

//                 if (cleanedTrail.length > 0) {
//                     const lastLocation = cleanedTrail[cleanedTrail.length - 1];
//                     setMapCenter({
//                         lat: lastLocation.lat,
//                         lng: lastLocation.lng
//                     });
//                     setMapZoom(15);
//                     // Force map re-render to show the trail
//                     setMapKey(prev => prev + 1);
//                 }
//             } else {
//                 console.log('No trail data found or empty trail');
//                 setLocationTrail([]);
//                 setSelectedSalesman(response.data?.salesman || null);
//             }
//         } catch (error) {
//             console.error('Error loading location trail:', error);
//             setLocationTrail([]);
//             setSelectedSalesman(null);
//         } finally {
//             setTrailLoading(false);
//         }
//     };

//     const handleSalesmanSelect = (salesman) => {
//         console.log('Selected salesman:', salesman);

//         // Clear previous trail first
//         setLocationTrail([]);
//         setSelectedSalesman(null);

//         if (salesman.tracking && salesman.tracking.enabled) {
//             const salesmanId = salesman.salesman._id || salesman.salesman.id;
//             loadLocationTrail(salesmanId, trailHours);

//             // Zoom to salesman's current location if available
//             if (salesman.location) {
//                 setMapCenter({
//                     lat: salesman.location.latitude,
//                     lng: salesman.location.longitude
//                 });
//                 setMapZoom(16);
//                 setMapKey(prev => prev + 1);
//             }
//         }
//     };

//     const getMarkerIcon = (salesman) => {
//         const isOnline = salesman.isOnline;
//         const hasRecentLocation = salesman.location &&
//             locationService.isLocationRecent(salesman.location.timestamp);

//         return {
//             url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
//                 <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
//                     <circle cx="16" cy="16" r="12" fill="${isOnline && hasRecentLocation ? '#10B981' : '#6B7280'}" stroke="white" stroke-width="2"/>
//                     <circle cx="16" cy="16" r="4" fill="white"/>
//                     ${isOnline ? '<circle cx="24" cy="8" r="4" fill="#3B82F6"/>' : ''}
//                 </svg>
//             `)}`,
//             scaledSize: typeof window !== 'undefined' && window.google ? new window.google.maps.Size(32, 32) : null,
//             anchor: typeof window !== 'undefined' && window.google ? new window.google.maps.Point(16, 16) : null
//         };
//     };

//     const formatLastUpdate = (timestamp) => {
//         if (!timestamp) return 'Never';

//         const now = new Date();
//         const updateTime = new Date(timestamp);
//         const diffMinutes = Math.floor((now - updateTime) / (1000 * 60));

//         if (diffMinutes < 1) return 'Just now';
//         if (diffMinutes < 60) return `${diffMinutes}min ago`;

//         const diffHours = Math.floor(diffMinutes / 60);
//         if (diffHours < 24) return `${diffHours}h ago`;

//         const diffDays = Math.floor(diffHours / 24);
//         return `${diffDays}d ago`;
//     };

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center h-96">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//             </div>
//         );
//     }

//     const activeSalesmen = salesmen.filter(s => s.location && s.tracking && s.tracking.enabled);

//     return (
//         <div className="p-6 bg-gray-50 min-h-screen">
//             {/* Header */}
//             <div className="mb-6">
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//                     <div>
//                         <h1 className="text-2xl font-bold text-gray-900">Location Tracking Dashboard</h1>
//                         <p className="text-gray-600 mt-1">Monitor salesman locations in real-time</p>
//                     </div>
//                     <div className="flex items-center space-x-4 mt-4 sm:mt-0">
//                         <div className="flex items-center space-x-2">
//                             {isSocketConnected ? (
//                                 <Wifi className="h-5 w-5 text-green-500" />
//                             ) : (
//                                 <WifiOff className="h-5 w-5 text-red-500" />
//                             )}
//                             <span className="text-sm text-gray-600">
//                                 {isSocketConnected ? 'Connected' : 'Disconnected'}
//                             </span>
//                         </div>
//                         <button
//                             onClick={() => setAutoZoom(!autoZoom)}
//                             className={`px-3 py-1 text-sm rounded-lg ${autoZoom
//                                 ? 'bg-blue-100 text-blue-700'
//                                 : 'bg-gray-100 text-gray-700'
//                                 }`}
//                         >
//                             Auto-Zoom: {autoZoom ? 'ON' : 'OFF'}
//                         </button>
//                         <button
//                             onClick={loadSalesmenData}
//                             className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                         >
//                             <RefreshCw className="h-4 w-4" />
//                             <span>Refresh</span>
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Statistics Cards */}
//             {statistics && (
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
//                     <div className="bg-white p-6 rounded-lg shadow">
//                         <div className="flex items-center">
//                             <Users className="h-8 w-8 text-blue-600" />
//                             <div className="ml-4">
//                                 <p className="text-sm font-medium text-gray-600">Active Salesmen</p>
//                                 <p className="text-2xl font-bold text-gray-900">
//                                     {statistics.overall?.uniqueSalesmenCount || 0}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-white p-6 rounded-lg shadow">
//                         <div className="flex items-center">
//                             <MapPin className="h-8 w-8 text-green-600" />
//                             <div className="ml-4">
//                                 <p className="text-sm font-medium text-gray-600">Location Updates</p>
//                                 <p className="text-2xl font-bold text-gray-900">
//                                     {statistics.overall?.totalLocations || 0}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-white p-6 rounded-lg shadow">
//                         <div className="flex items-center">
//                             <Signal className="h-8 w-8 text-yellow-600" />
//                             <div className="ml-4">
//                                 <p className="text-sm font-medium text-gray-600">Avg Accuracy</p>
//                                 <p className="text-2xl font-bold text-gray-900">
//                                     {statistics.overall?.avgAccuracy || 0}m
//                                 </p>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-white p-6 rounded-lg shadow">
//                         <div className="flex items-center">
//                             <Activity className="h-8 w-8 text-purple-600" />
//                             <div className="ml-4">
//                                 <p className="text-sm font-medium text-gray-600">Online Now</p>
//                                 <p className="text-2xl font-bold text-gray-900">
//                                     {salesmen.filter(s => s.isOnline).length}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                 {/* Salesmen List */}
//                 <div className="lg:col-span-1">
//                     <div className="bg-white rounded-lg shadow">
//                         <div className="p-4 border-b border-gray-200">
//                             <h2 className="text-lg font-semibold text-gray-900">Salesmen ({salesmen.length})</h2>
//                         </div>
//                         <div className="max-h-96 overflow-y-auto">
//                             {salesmen.length === 0 ? (
//                                 <div className="p-4 text-center text-gray-500">
//                                     No salesmen found
//                                 </div>
//                             ) : (
//                                 salesmen.map((salesman) => {
//                                     const salesmanId = salesman.salesman._id || salesman.salesman.id;
//                                     const isSelected = selectedSalesman && (selectedSalesman._id === salesmanId || selectedSalesman.id === salesmanId);

//                                     return (
//                                         <div
//                                             key={salesmanId}
//                                             className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
//                                             onClick={() => handleSalesmanSelect(salesman)}
//                                         >
//                                             <div className="flex items-center justify-between">
//                                                 <div className="flex items-center space-x-3">
//                                                     <div className={`w-3 h-3 rounded-full ${salesman.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
//                                                     <div>
//                                                         <p className="font-medium text-gray-900">
//                                                             {salesman.salesman.name}
//                                                         </p>
//                                                         <p className="text-sm text-gray-600">
//                                                             @{salesman.salesman.username}
//                                                         </p>
//                                                     </div>
//                                                 </div>
//                                                 <button
//                                                     onClick={(e) => {
//                                                         e.stopPropagation();
//                                                         toggleTracking(salesmanId, salesman.tracking?.enabled || false);
//                                                     }}
//                                                     className={`p-2 rounded-lg ${(salesman.tracking?.enabled)
//                                                         ? 'bg-green-100 text-green-600 hover:bg-green-200'
//                                                         : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                                                         }`}
//                                                 >
//                                                     {(salesman.tracking?.enabled) ? (
//                                                         <Eye className="h-4 w-4" />
//                                                     ) : (
//                                                         <EyeOff className="h-4 w-4" />
//                                                     )}
//                                                 </button>
//                                             </div>

//                                             {salesman.location && (
//                                                 <div className="mt-2 text-sm text-gray-600">
//                                                     <div className="flex items-center space-x-2">
//                                                         <MapPin className="h-4 w-4" />
//                                                         <span>
//                                                             Accuracy: {salesman.location.accuracy?.toFixed(0) || 'N/A'}m
//                                                         </span>
//                                                     </div>
//                                                     <div className="flex items-center space-x-2 mt-1">
//                                                         <Clock className="h-4 w-4" />
//                                                         <span>
//                                                             {formatLastUpdate(salesman.location.timestamp)}
//                                                         </span>
//                                                     </div>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     );
//                                 })
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Map */}
//                 <div className="lg:col-span-2">
//                     <div className="bg-white rounded-lg shadow">
//                         <div className="p-4 border-b border-gray-200">
//                             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//                                 <div className="flex items-center space-x-4">
//                                     <h2 className="text-lg font-semibold text-gray-900">
//                                         Live Map ({activeSalesmen.length} active)
//                                     </h2>
//                                     {trailLoading && (
//                                         <div className="flex items-center space-x-2">
//                                             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
//                                             <span className="text-sm text-gray-600">Loading trail...</span>
//                                         </div>
//                                     )}
//                                     {selectedSalesman && locationTrail.length > 0 && (
//                                         <span className="text-sm text-green-600 font-medium">
//                                             Trail: {locationTrail.length} points
//                                         </span>
//                                     )}
//                                 </div>
//                                 {selectedSalesman && (
//                                     <div className="flex items-center space-x-4 mt-2 sm:mt-0">
//                                         <span className="text-sm text-gray-600">Trail Duration:</span>
//                                         <select
//                                             value={trailHours}
//                                             onChange={(e) => {
//                                                 const hours = parseInt(e.target.value);
//                                                 setTrailHours(hours);
//                                                 if (selectedSalesman) {
//                                                     const salesmanId = selectedSalesman._id || selectedSalesman.id;
//                                                     loadLocationTrail(salesmanId, hours);
//                                                 }
//                                             }}
//                                             className="px-3 py-1 border border-gray-300 rounded-md text-sm"
//                                         >
//                                             <option value={1}>1 Hour</option>
//                                             <option value={2}>2 Hours</option>
//                                             <option value={6}>6 Hours</option>
//                                             <option value={12}>12 Hours</option>
//                                             <option value={24}>24 Hours</option>
//                                         </select>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>

//                         <div className="p-4">
//                             <GoogleMap
//                                 key={mapKey}
//                                 mapContainerStyle={mapContainerStyle}
//                                 center={mapCenter}
//                                 zoom={mapZoom}
//                                 options={{
//                                     zoomControl: true,
//                                     streetViewControl: false,
//                                     mapTypeControl: false,
//                                     fullscreenControl: true,
//                                 }}
//                             >
//                                 {/* Salesman markers */}
//                                 {activeSalesmen.map((salesman) => {
//                                     const salesmanId = salesman.salesman._id || salesman.salesman.id;
//                                     return (
//                                         <Marker
//                                             key={salesmanId}
//                                             position={{
//                                                 lat: salesman.location.latitude,
//                                                 lng: salesman.location.longitude
//                                             }}
//                                             icon={getMarkerIcon(salesman)}
//                                             onClick={() => setSelectedMarker(salesman)}
//                                         />
//                                     );
//                                 })}

//                                 {/* Location trail */}
//                                 {locationTrail.length > 1 && (
//                                     <Polyline
//                                         path={locationTrail}
//                                         options={{
//                                             strokeColor: '#3B82F6',
//                                             strokeOpacity: 0.8,
//                                             strokeWeight: 3,
//                                             geodesic: true
//                                         }}
//                                     />
//                                 )}

//                                 {/* Trail start marker */}
//                                 {locationTrail.length > 0 && (
//                                     <Marker
//                                         position={locationTrail[0]}
//                                         icon={{
//                                             url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
//                                                 <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                                     <circle cx="12" cy="12" r="8" fill="#10B981" stroke="white" stroke-width="2"/>
//                                                     <text x="12" y="16" text-anchor="middle" fill="white" font-size="10" font-weight="bold">S</text>
//                                                 </svg>
//                                             `)}`,
//                                             scaledSize: typeof window !== 'undefined' && window.google ? new window.google.maps.Size(24, 24) : null,
//                                             anchor: typeof window !== 'undefined' && window.google ? new window.google.maps.Point(12, 12) : null
//                                         }}
//                                         title="Trail Start"
//                                     />
//                                 )}

//                                 {/* Trail end marker */}
//                                 {locationTrail.length > 1 && (
//                                     <Marker
//                                         position={locationTrail[locationTrail.length - 1]}
//                                         icon={{
//                                             url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
//                                                 <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                                     <circle cx="12" cy="12" r="8" fill="#EF4444" stroke="white" stroke-width="2"/>
//                                                     <text x="12" y="16" text-anchor="middle" fill="white" font-size="10" font-weight="bold">E</text>
//                                                 </svg>
//                                             `)}`,
//                                             scaledSize: typeof window !== 'undefined' && window.google ? new window.google.maps.Size(24, 24) : null,
//                                             anchor: typeof window !== 'undefined' && window.google ? new window.google.maps.Point(12, 12) : null
//                                         }}
//                                         title="Trail End"
//                                     />
//                                 )}

//                                 {/* Info window */}
//                                 {selectedMarker && (
//                                     <InfoWindow
//                                         position={{
//                                             lat: selectedMarker.location.latitude,
//                                             lng: selectedMarker.location.longitude
//                                         }}
//                                         onCloseClick={() => setSelectedMarker(null)}
//                                     >
//                                         <div className="p-2">
//                                             <h3 className="font-semibold text-gray-900">
//                                                 {selectedMarker.salesman.name}
//                                             </h3>
//                                             <p className="text-sm text-gray-600">
//                                                 @{selectedMarker.salesman.username}
//                                             </p>
//                                             <div className="mt-2 space-y-1 text-sm">
//                                                 <div className="flex items-center space-x-2">
//                                                     <Signal className="h-4 w-4 text-gray-500" />
//                                                     <span>Accuracy: {selectedMarker.location.accuracy?.toFixed(0) || 'N/A'}m</span>
//                                                 </div>
//                                                 <div className="flex items-center space-x-2">
//                                                     <Clock className="h-4 w-4 text-gray-500" />
//                                                     <span>{formatLastUpdate(selectedMarker.location.timestamp)}</span>
//                                                 </div>
//                                                 {selectedMarker.location.speed > 0 && (
//                                                     <div className="flex items-center space-x-2">
//                                                         <Navigation className="h-4 w-4 text-gray-500" />
//                                                         <span>{(selectedMarker.location.speed * 3.6).toFixed(1)} km/h</span>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </InfoWindow>
//                                 )}
//                             </GoogleMap>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AdminLocationDashboard;


// bolt trail update code

import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline, InfoWindow } from '@react-google-maps/api';
import {
    MapPin,
    Users,
    Clock,
    Activity,
    Settings,
    RefreshCw,
    Eye,
    EyeOff,
    Navigation,
    Signal,
    Battery,
    Wifi,
    WifiOff
} from 'lucide-react';
import locationService from '../../services/locationService';
import socketService from '../../services/socketService';

const mapContainerStyle = {
    width: '100%',
    height: '500px'
};

const defaultCenter = {
    lat: 28.6139, // Delhi coordinates as default
    lng: 77.2090
};


const AdminLocationDashboard = () => {
    const [salesmen, setSalesmen] = useState([]);
    const [selectedSalesman, setSelectedSalesman] = useState(null);
    const [locationTrail, setLocationTrail] = useState([]);
    const [trailHours, setTrailHours] = useState(1);
    const [loading, setLoading] = useState(true);
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const [mapZoom, setMapZoom] = useState(20);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [realTimeUpdates, setRealTimeUpdates] = useState({});
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const [statistics, setStatistics] = useState(null);
    const [mapKey, setMapKey] = useState(0); // Force map re-render
    const [autoZoom, setAutoZoom] = useState(true); // Control auto-zoom behavior
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    // Load initial data
    useEffect(() => {
        loadSalesmenData();
        loadStatistics();
        initializeSocket();

        return () => {
            socketService.disconnect();
        };
    }, []);

    // Socket event listeners
    useEffect(() => {
        const handleLocationUpdate = (event) => {
            const data = event.detail;
            console.log('Received location update:', data);

            setRealTimeUpdates(prev => ({
                ...prev,
                [data.salesmanId]: {
                    ...data,
                    timestamp: new Date(data.location.timestamp)
                }
            }));

            // Update salesmen data with real-time location
            setSalesmen(prev => prev.map(salesman => {
                const salesmanId = salesman.salesman._id || salesman.salesman.id;
                if (salesmanId === data.salesmanId) {
                    const updatedSalesman = {
                        ...salesman,
                        location: {
                            latitude: data.location.lat,
                            longitude: data.location.lng,
                            accuracy: data.location.accuracy,
                            speed: data.location.speed || 0,
                            timestamp: data.location.timestamp
                        },
                        isOnline: true,
                        lastUpdate: data.location.timestamp
                    };

                    // Auto-zoom to the updated salesman if they're selected or if auto-zoom is enabled
                    if (autoZoom || (selectedSalesman && (selectedSalesman._id === salesmanId || selectedSalesman.id === salesmanId))) {
                        console.log('Auto-zooming to salesman location:', data.location);
                        setMapCenter({
                            lat: data.location.lat,
                            lng: data.location.lng
                        });
                        setMapZoom(18); // Higher zoom for real-time tracking
                        setMapKey(prev => prev + 1); // Force map re-render
                    }

                    return updatedSalesman;
                }
                return salesman;
            }));
        };

        const handleSalesmanStatus = (event) => {
            const data = event.detail;
            console.log('Received status update:', data);

            setSalesmen(prev => prev.map(salesman => {
                const salesmanId = salesman.salesman._id || salesman.salesman.id;
                if (salesmanId === data.salesmanId) {
                    return {
                        ...salesman,
                        isOnline: data.isActive,
                        battery: data.battery,
                        lastUpdate: data.timestamp
                    };
                }
                return salesman;
            }));
        };

        const handleSalesmanDisconnected = (event) => {
            const data = event.detail;
            console.log('Salesman disconnected:', data);

            setSalesmen(prev => prev.map(salesman => {
                const salesmanId = salesman.salesman._id || salesman.salesman.id;
                if (salesmanId === data.salesmanId) {
                    return { ...salesman, isOnline: false };
                }
                return salesman;
            }));
        };

        window.addEventListener('locationUpdate', handleLocationUpdate);
        window.addEventListener('salesmanStatusUpdate', handleSalesmanStatus);
        window.addEventListener('salesmanDisconnected', handleSalesmanDisconnected);

        return () => {
            window.removeEventListener('locationUpdate', handleLocationUpdate);
            window.removeEventListener('salesmanStatusUpdate', handleSalesmanStatus);
            window.removeEventListener('salesmanDisconnected', handleSalesmanDisconnected);
        };
    }, [selectedSalesman, autoZoom]);

    const initializeSocket = async () => {
        try {
            const token = localStorage.getItem('token');
            const userRole = 'admin';

            await socketService.connect(token, userRole);
            setIsSocketConnected(true);
            console.log('Socket connected successfully');
        } catch (error) {
            console.error('Failed to connect to socket:', error);
            setIsSocketConnected(false);
        }
    };

    const loadSalesmenData = async () => {
        try {
            setLoading(true);
            const response = await locationService.getSalesmenTrackingStatus();
            console.log('Loaded salesmen data:', response);
            setSalesmen(response.data || []);

            // Set map center to first salesman with location
            const salesmanWithLocation = (response.data || []).find(s => s.location);
            if (salesmanWithLocation && autoZoom) {
                setMapCenter({
                    lat: salesmanWithLocation.location.latitude,
                    lng: salesmanWithLocation.location.longitude
                });
                setMapZoom(14);
            }
        } catch (error) {
            console.error('Error loading salesmen data:', error);
            setSalesmen([]);
        } finally {
            setLoading(false);
        }
    };

    const loadStatistics = async () => {
        try {
            const response = await locationService.getLocationStatistics('24h');
            setStatistics(response.data);
        } catch (error) {
            console.error('Error loading statistics:', error);
        }
    };

    const toggleTracking = async (salesmanId, currentStatus) => {
        try {
            const newStatus = !currentStatus;
            await locationService.toggleSalesmanTracking(salesmanId, newStatus);

            // Update local state
            setSalesmen(prev => prev.map(salesman => {
                const id = salesman.salesman._id || salesman.salesman.id;
                if (id === salesmanId) {
                    return {
                        ...salesman,
                        tracking: { ...salesman.tracking, enabled: newStatus }
                    };
                }
                return salesman;
            }));

            // Send socket event
            socketService.toggleTracking(salesmanId, newStatus);

        } catch (error) {
            console.error('Error toggling tracking:', error);
        }
    };

    const loadLocationTrail = async (salesmanId, hours) => {
        try {
            console.log('Loading location trail for:', salesmanId, 'hours:', hours);
            const response = await locationService.getSalesmanLocationTrail(salesmanId, hours);
            console.log('Location trail response:', response);

            if (response.success && response.data.trail && response.data.trail.length > 0) {
                const formattedTrail = response.data.trail.map(point => ({
                    lat: point.latitude,
                    lng: point.longitude,
                    timestamp: point.timestamp,
                    accuracy: point.accuracy
                }));

                console.log('Formatted trail:', formattedTrail);
                setLocationTrail(formattedTrail);
                setSelectedSalesman(response.data.salesman);

                if (formattedTrail.length > 0) {
                    const lastLocation = formattedTrail[formattedTrail.length - 1];
                    console.log('Setting map center to:', lastLocation);

                    setMapCenter({
                        lat: lastLocation.lat,
                        lng: lastLocation.lng
                    });

                    // For very close points, use high zoom level
                    const hasVariation = formattedTrail.some(point =>
                        Math.abs(point.lat - formattedTrail[0].lat) > 0.0001 ||
                        Math.abs(point.lng - formattedTrail[0].lng) > 0.0001
                    );

                    setMapZoom(hasVariation ? 17 : 19); // Higher zoom for very close points
                    setMapKey(prev => prev + 1);
                }
            } else {
                setLocationTrail([]);
                console.log('No trail data found');
            }
        } catch (error) {
            console.error('Error loading location trail:', error);
            setLocationTrail([]);
        }
    };

    const handleSalesmanSelect = (salesman) => {
        console.log('Selected salesman:', salesman);
        if (salesman.tracking && salesman.tracking.enabled) {
            const salesmanId = salesman.salesman._id || salesman.salesman.id;
            loadLocationTrail(salesmanId, trailHours);

            // Zoom to salesman's current location if available
            if (salesman.location) {
                setMapCenter({
                    lat: salesman.location.latitude,
                    lng: salesman.location.longitude
                });
                setMapZoom(18);
                setMapKey(prev => prev + 1);
            }
        } else {
            setLocationTrail([]);
            setSelectedSalesman(null);
        }
    };

    const getMarkerIcon = (salesman) => {
        const isOnline = salesman.isOnline;
        const hasRecentLocation = salesman.location &&
            locationService.isLocationRecent(salesman.location.timestamp);

        return {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="12" fill="${isOnline && hasRecentLocation ? '#10B981' : '#6B7280'}" stroke="white" stroke-width="2"/>
                    <circle cx="16" cy="16" r="4" fill="white"/>
                    ${isOnline ? '<circle cx="24" cy="8" r="4" fill="#3B82F6"/>' : ''}
                </svg>
            `)}`,
            scaledSize: isMapLoaded ? new window.google.maps.Size(32, 32) : null,
            anchor: isMapLoaded ? new window.google.maps.Point(16, 16) : null
        };
    };

    const formatLastUpdate = (timestamp) => {
        if (!timestamp) return 'Never';

        const now = new Date();
        const updateTime = new Date(timestamp);
        const diffMinutes = Math.floor((now - updateTime) / (1000 * 60));

        if (diffMinutes < 1) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes}min ago`;

        const diffHours = Math.floor(diffMinutes / 60);
        if (diffHours < 24) return `${diffHours}h ago`;

        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d ago`;
    };

    const clearTrail = () => {
        setLocationTrail([]);
        setSelectedSalesman(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const activeSalesmen = salesmen.filter(s => s.location && s.tracking && s.tracking.enabled);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Location Tracking Dashboard</h1>
                        <p className="text-gray-600 mt-1">Monitor salesman locations in real-time</p>
                    </div>
                    <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                        <div className="flex items-center space-x-2">
                            {isSocketConnected ? (
                                <Wifi className="h-5 w-5 text-green-500" />
                            ) : (
                                <WifiOff className="h-5 w-5 text-red-500" />
                            )}
                            <span className="text-sm text-gray-600">
                                {isSocketConnected ? 'Connected' : 'Disconnected'}
                            </span>
                        </div>
                        <button
                            onClick={() => setAutoZoom(!autoZoom)}
                            className={`px-3 py-1 text-sm rounded-lg ${autoZoom
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700'
                                }`}
                        >
                            Auto-Zoom: {autoZoom ? 'ON' : 'OFF'}
                        </button>
                        <button
                            onClick={loadSalesmenData}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            <RefreshCw className="h-4 w-4" />
                            <span>Refresh</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            {statistics && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <Users className="h-8 w-8 text-blue-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Active Salesmen</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {statistics.overall?.uniqueSalesmenCount || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <MapPin className="h-8 w-8 text-green-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Location Updates</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {statistics.overall?.totalLocations || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <Signal className="h-8 w-8 text-yellow-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Avg Accuracy</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {statistics.overall?.avgAccuracy || 0}m
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <Activity className="h-8 w-8 text-purple-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Online Now</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {salesmen.filter(s => s.isOnline).length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Salesmen List */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Salesmen ({salesmen.length})</h2>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {salesmen.length === 0 ? (
                                <div className="p-4 text-center text-gray-500">
                                    No salesmen found
                                </div>
                            ) : (
                                salesmen.map((salesman) => {
                                    const salesmanId = salesman.salesman._id || salesman.salesman.id;
                                    const isSelected = selectedSalesman && (selectedSalesman._id === salesmanId || selectedSalesman.id === salesmanId);

                                    return (
                                        <div
                                            key={salesmanId}
                                            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
                                            onClick={() => handleSalesmanSelect(salesman)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`w-3 h-3 rounded-full ${salesman.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {salesman.salesman.name}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            @{salesman.salesman.username}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleTracking(salesmanId, salesman.tracking?.enabled || false);
                                                    }}
                                                    className={`p-2 rounded-lg ${(salesman.tracking?.enabled)
                                                        ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    {(salesman.tracking?.enabled) ? (
                                                        <Eye className="h-4 w-4" />
                                                    ) : (
                                                        <EyeOff className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>

                                            {salesman.location && (
                                                <div className="mt-2 text-sm text-gray-600">
                                                    <div className="flex items-center space-x-2">
                                                        <MapPin className="h-4 w-4" />
                                                        <span>
                                                            Accuracy: {salesman.location.accuracy?.toFixed(0) || 'N/A'}m
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        <Clock className="h-4 w-4" />
                                                        <span>
                                                            {formatLastUpdate(salesman.location.timestamp)}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* Map */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-4 border-b border-gray-200">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Live Map ({activeSalesmen.length} active)
                                    {locationTrail.length > 0 && (
                                        <span className="ml-2 text-sm text-blue-600">
                                            - Trail: {locationTrail.length} points
                                        </span>
                                    )}
                                </h2>
                                <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                                    {selectedSalesman && (
                                        <>
                                            <span className="text-sm text-gray-600">Trail Duration:</span>
                                            <select
                                                value={trailHours}
                                                onChange={(e) => {
                                                    const hours = parseInt(e.target.value);
                                                    setTrailHours(hours);
                                                    if (selectedSalesman) {
                                                        const salesmanId = selectedSalesman._id || selectedSalesman.id;
                                                        loadLocationTrail(salesmanId, hours);
                                                    }
                                                }}
                                                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                                            >
                                                <option value={1}>1 Hour</option>
                                                <option value={2}>2 Hours</option>
                                                <option value={6}>6 Hours</option>
                                                <option value={12}>12 Hours</option>
                                                <option value={24}>24 Hours</option>
                                            </select>
                                            <button
                                                onClick={clearTrail}
                                                className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
                                            >
                                                Clear Trail
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-4">
                           
                                <GoogleMap
                                    key={mapKey}
                                    mapContainerStyle={mapContainerStyle}
                                    center={mapCenter}
                                    zoom={mapZoom}
                                    options={{
                                        zoomControl: true,
                                        streetViewControl: false,
                                        mapTypeControl: true,
                                        fullscreenControl: true,
                                        gestureHandling: 'greedy'
                                    }}
                                    onLoad={() => {
                                        console.log('Map loaded successfully');
                                    }}
                                >
                                    {/* Salesman markers */}
                                    {activeSalesmen.map((salesman) => {
                                        const salesmanId = salesman.salesman._id || salesman.salesman.id;
                                        return (
                                            <Marker
                                                key={`marker-${salesmanId}`}
                                                position={{
                                                    lat: salesman.location.latitude,
                                                    lng: salesman.location.longitude
                                                }}
                                                icon={getMarkerIcon(salesman)}
                                                onClick={() => setSelectedMarker(salesman)}
                                            />
                                        );
                                    })}

                                    {/* Location trail polyline */}
                                    {locationTrail.length > 1 && (
                                        <Polyline
                                            key={`trail-${locationTrail.length}-${mapKey}`}
                                            path={locationTrail}
                                            options={{
                                                strokeColor: '#3B82F6',
                                                strokeOpacity: 0.8,
                                                strokeWeight: 4,
                                                geodesic: true,
                                                icons: [
                                                    {
                                                        icon: {
                                                            path: window.google?.maps?.SymbolPath?.FORWARD_CLOSED_ARROW || 0,
                                                            scale: 3,
                                                            strokeColor: '#1E40AF',
                                                            fillColor: '#1E40AF',
                                                            fillOpacity: 1
                                                        },
                                                        offset: '100%',
                                                        repeat: '20px'
                                                    }
                                                ]
                                            }}
                                        />
                                    )}

                                    {/* Trail start marker */}
                                    {locationTrail.length > 0 && (
                                        <Marker
                                            key={`trail-start-${mapKey}`}
                                            position={locationTrail[0]}
                                            icon={{
                                                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                                                    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                        <circle cx="10" cy="10" r="8" fill="#10B981" stroke="white" stroke-width="2"/>
                                                        <text x="10" y="14" text-anchor="middle" fill="white" font-size="12" font-weight="bold">S</text>
                                                    </svg>
                                                `)}`,
                                                scaledSize: isMapLoaded ? new window.google.maps.Size(20, 20) : null,
                                                anchor: isMapLoaded ? new window.google.maps.Point(10, 10) : null
                                            }}
                                        />
                                    )}

                                    {/* Trail end marker */}
                                    {locationTrail.length > 1 && (
                                        <Marker
                                            key={`trail-end-${mapKey}`}
                                            position={locationTrail[locationTrail.length - 1]}
                                            icon={{
                                                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                                                    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                        <circle cx="10" cy="10" r="8" fill="#EF4444" stroke="white" stroke-width="2"/>
                                                        <text x="10" y="14" text-anchor="middle" fill="white" font-size="12" font-weight="bold">E</text>
                                                    </svg>
                                                `)}`,
                                                scaledSize: isMapLoaded ? new window.google.maps.Size(20, 20) : null,
                                                anchor: isMapLoaded ? new window.google.maps.Point(10, 10) : null
                                            }}
                                        />
                                    )}

                                    {/* Info window */}
                                    {selectedMarker && (
                                        <InfoWindow
                                            position={{
                                                lat: selectedMarker.location.latitude,
                                                lng: selectedMarker.location.longitude
                                            }}
                                            onCloseClick={() => setSelectedMarker(null)}
                                        >
                                            <div className="p-2">
                                                <h3 className="font-semibold text-gray-900">
                                                    {selectedMarker.salesman.name}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    @{selectedMarker.salesman.username}
                                                </p>
                                                <div className="mt-2 space-y-1 text-sm">
                                                    <div className="flex items-center space-x-2">
                                                        <Signal className="h-4 w-4 text-gray-500" />
                                                        <span>Accuracy: {selectedMarker.location.accuracy?.toFixed(0) || 'N/A'}m</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Clock className="h-4 w-4 text-gray-500" />
                                                        <span>{formatLastUpdate(selectedMarker.location.timestamp)}</span>
                                                    </div>
                                                    {selectedMarker.location.speed > 0 && (
                                                        <div className="flex items-center space-x-2">
                                                            <Navigation className="h-4 w-4 text-gray-500" />
                                                            <span>{(selectedMarker.location.speed * 3.6).toFixed(1)} km/h</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </InfoWindow>
                                    )}
                                </GoogleMap>
                        </div>
                    </div>
                </div>
            </div>

            {/* Debug information */}
            {locationTrail.length > 0 && (
                <div className="mt-6 bg-white rounded-lg shadow p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Trail Debug Info</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p><strong>Trail Points:</strong> {locationTrail.length}</p>
                            <p><strong>Selected Salesman:</strong> {selectedSalesman?.name || 'None'}</p>
                        </div>
                        <div>
                            <p><strong>Map Center:</strong> {mapCenter.lat.toFixed(6)}, {mapCenter.lng.toFixed(6)}</p>
                            <p><strong>Map Zoom:</strong> {mapZoom}</p>
                        </div>
                    </div>
                    {locationTrail.length > 0 && (
                        <div className="mt-2">
                            <p className="text-xs text-gray-600">
                                <strong>First Point:</strong> {locationTrail[0].lat.toFixed(6)}, {locationTrail[0].lng.toFixed(6)} |
                                <strong> Last Point:</strong> {locationTrail[locationTrail.length - 1].lat.toFixed(6)}, {locationTrail[locationTrail.length - 1].lng.toFixed(6)}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminLocationDashboard;
