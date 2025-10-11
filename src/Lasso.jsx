// // import React, { useState, useEffect, useRef } from 'react';
// // import {
// //     MapPin,
// //     Filter,
// //     Search,
// //     Target,
// //     TrendingUp,
// //     Building,
// //     Users,
// //     DollarSign,
// //     PieChart,
// //     Lightbulb,
// //     X,
// //     Eye,
// //     EyeOff,
// //     Layers,
// //     RefreshCw,
// //     AlertCircle,
// //     CheckCircle,
// //     Phone,
// //     User,
// //     Calendar,
// //     Loader
// // } from 'lucide-react';
// // import { base_url } from '../utils/base_url';

// // const API_BASE_URL = base_url

// // // Property type configuration
// // const PROPERTY_TYPES = [
// //     'Office', 'Retail', 'Industrial', 'Healthcare', 'Restaurant',
// //     'Hotel', 'Mixed-Use', 'Warehouse', 'Manufacturing', 'Education'
// // ];

// // const TYPE_COLORS = {
// //     'Office': '#3B82F6',
// //     'Retail': '#EF4444',
// //     'Industrial': '#F97316',
// //     'Healthcare': '#10B981',
// //     'Restaurant': '#8B5CF6',
// //     'Hotel': '#F59E0B',
// //     'Mixed-Use': '#6366F1',
// //     'Warehouse': '#84CC16',
// //     'Manufacturing': '#EC4899',
// //     'Education': '#14B8A6'
// // };

// // // Utility function for point-in-polygon calculation
// // const isPointInPolygon = (point, polygon) => {
// //     const x = point.latitude;
// //     const y = point.longitude;
// //     let inside = false;

// //     for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
// //         const xi = polygon[i].lat;
// //         const yi = polygon[i].lng;
// //         const xj = polygon[j].lat;
// //         const yj = polygon[j].lng;

// //         if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
// //             inside = !inside;
// //         }
// //     }

// //     return inside;
// // };

// // // Format currency
// // const formatCurrency = (amount) => {
// //     if (!amount) return 'N/A';
// //     return new Intl.NumberFormat('en-US', {
// //         style: 'currency',
// //         currency: 'USD',
// //         minimumFractionDigits: 0,
// //         maximumFractionDigits: 0,
// //     }).format(amount);
// // };

// // // Format date
// // const formatDate = (date) => {
// //     return new Date(date).toLocaleDateString('en-US', {
// //         year: 'numeric',
// //         month: 'short',
// //         day: 'numeric'
// //     });
// // };

// // function Lasso() {
// //     // State management
// //     const [leads, setLeads] = useState([]);
// //     const [filteredLeads, setFilteredLeads] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     const [error, setError] = useState(null);

// //     console.log("leads", leads)
// //     // Area selection state
// //     const [selectedArea, setSelectedArea] = useState(null);
// //     const [leadsInArea, setLeadsInArea] = useState([]);
// //     const [leadsOutsideArea, setLeadsOutsideArea] = useState([]);
// //     const [missingTypes, setMissingTypes] = useState([]);
// //     const [isDrawing, setIsDrawing] = useState(false);

// //     // UI state
// //     const [searchTerm, setSearchTerm] = useState('');
// //     const [selectedType, setSelectedType] = useState('');
// //     const [showAnalytics, setShowAnalytics] = useState(false);
// //     const [selectedLead, setSelectedLead] = useState(null);
// //     const [visibleTypes, setVisibleTypes] = useState(new Set(PROPERTY_TYPES));
// //     const [showOnlyActive, setShowOnlyActive] = useState(false);

// //     // Map references
// //     const mapRef = useRef(null);
// //     const mapInstance = useRef(null);
// //     const drawingManager = useRef(null);
// //     const markersRef = useRef([]);
// //     const infoWindow = useRef(null);

// //     // Fetch leads from API
// //     const fetchLeads = async () => {
// //         try {
// //             setLoading(true);
// //             setError(null);

// //             // Build headers conditionally
// //             const headers = {
// //                 'Content-Type': 'application/json'
// //             };

// //             // Add authorization header if token exists
// //             const token = localStorage.getItem('token');
// //             if (token) {
// //                 headers['Authorization'] = `Bearer ${token}`;
// //             }

// //             const response = await fetch(`${API_BASE_URL}/api/salesman/commercial/leads`, { headers });

// //             if (!response.ok) {
// //                 if (response.status === 401) {
// //                     throw new Error('Authentication required. Please log in.');
// //                 } else if (response.status === 403) {
// //                     throw new Error('Access denied. Insufficient permissions.');
// //                 } else {
// //                     throw new Error(`HTTP error! status: ${response.status}`);
// //                 }
// //             }

// //             const result = await response.json();

// //             // Handle different possible response structures
// //             if (result.success === 'true' || result.success === true) {
// //                 const leadsData = result.data?.leads || result.data || [];
// //                 setLeads(leadsData);
// //                 setFilteredLeads(leadsData);
// //             } else if (Array.isArray(result)) {
// //                 // Direct array response
// //                 setLeads(result);
// //                 setFilteredLeads(result);
// //             } else if (result.data && Array.isArray(result.data)) {
// //                 setLeads(result.data);
// //                 setFilteredLeads(result.data);
// //             } else {
// //                 throw new Error(result.msg || result.message || 'Failed to fetch leads');
// //             }
// //         } catch (err) {
// //             console.error('Error fetching leads:', err);
// //             setError(err.message);

// //             // Set empty arrays on error to prevent crashes
// //             setLeads([]);
// //             setFilteredLeads([]);
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     // Add a retry mechanism for map initialization
// //     const retryMapInitialization = () => {
// //         let retryCount = 0;
// //         const maxRetries = 10;

// //         const tryInit = () => {
// //             if (window.google && window.google.maps && window.google.maps.drawing) {
// //                 initializeMap();
// //             } else if (retryCount < maxRetries) {
// //                 retryCount++;
// //                 setTimeout(tryInit, 500);
// //             } else {
// //                 setError('Failed to initialize Google Maps. Please refresh the page.');
// //             }
// //         };

// //         tryInit();
// //     };

// //     // Update the useEffect to use retry mechanism
// //     useEffect(() => {
// //         // Wait a bit for Google Maps to be fully loaded
// //         setTimeout(() => {
// //             if (window.google && window.google.maps && window.google.maps.drawing) {
// //                 initializeMap();
// //             } else {
// //                 retryMapInitialization();
// //             }
// //         }, 100);

// //         // Initial data fetch
// //         fetchLeads();
// //     }, []);

// //     // Add effect to reinitialize map if it becomes available later
// //     useEffect(() => {
// //         const checkGoogleMaps = () => {
// //             if (window.google && window.google.maps && window.google.maps.drawing && !mapInstance.current) {
// //                 initializeMap();
// //             }
// //         };

// //         // Check periodically if Google Maps becomes available
// //         const interval = setInterval(checkGoogleMaps, 1000);

// //         // Clean up interval after 30 seconds
// //         setTimeout(() => clearInterval(interval), 30000);

// //         return () => clearInterval(interval);
// //     }, []);

// //     // Enhanced fetchLeads function with better error handling
// //     // const fetchLeads = async () => {
// //     //     try {
// //     //         setLoading(true);
// //     //         setError(null);

// //     //         // Build headers conditionally
// //     //         const headers = {
// //     //             'Content-Type': 'application/json'
// //     //         };

// //     //         // Add authorization header if token exists
// //     //         const token = localStorage.getItem('token');
// //     //         if (token) {
// //     //             headers['Authorization'] = `Bearer ${token}`;
// //     //         }

// //     //         const response = await fetch(`${API_BASE_URL}/leads`, { headers });

// //     //         if (!response.ok) {
// //     //             if (response.status === 401) {
// //     //                 throw new Error('Authentication required. Please log in.');
// //     //             } else if (response.status === 403) {
// //     //                 throw new Error('Access denied. Insufficient permissions.');
// //     //             } else {
// //     //                 throw new Error(`HTTP error! status: ${response.status}`);
// //     //             }
// //     //         }

// //     //         const result = await response.json();

// //     //         // Handle different possible response structures from your API
// //     //         if (result.success === 'true' || result.success === true) {
// //     //             setLeads(result.data.leads);
// //     //             setFilteredLeads(result.data.leads);
// //     //         } else if (Array.isArray(result)) {
// //     //             // Direct array response
// //     //             setLeads(result);
// //     //             setFilteredLeads(result);
// //     //         } else if (result.data && Array.isArray(result.data)) {
// //     //             setLeads(result.data);
// //     //             setFilteredLeads(result.data);
// //     //         } else {
// //     //             throw new Error(result.msg || result.message || 'Failed to fetch leads');
// //     //         }
// //     //     } catch (err) {
// //     //         console.error('Error fetching leads:', err);
// //     //         setError(err.message);

// //     //         // Set empty arrays on error to prevent crashes
// //     //         setLeads([]);
// //     //         setFilteredLeads([]);
// //     //     } finally {
// //     //         setLoading(false);
// //     //     }
// //     // };

// //     // Initialize Google Maps
// //     const initializeMap = () => {
// //         if (!window.google || !window.google.maps || !mapRef.current) {
// //             console.log('Google Maps not ready yet, retrying...');
// //             setTimeout(initializeMap, 100);
// //             return;
// //         }

// //         const map = new window.google.maps.Map(mapRef.current, {
// //             center: { lat: 26.4804247, lng: 80.29115589999999 }, // Default to NYC
// //             zoom: 12,
// //             mapTypeId: 'roadmap',
// //             styles: [
// //                 {
// //                     featureType: 'poi',
// //                     elementType: 'labels',
// //                     stylers: [{ visibility: 'off' }]
// //                 }
// //             ]
// //         });

// //         const drawing = new window.google.maps.drawing.DrawingManager({
// //             drawingMode: null,
// //             drawingControl: false,
// //             polygonOptions: {
// //                 fillColor: '#3B82F6',
// //                 fillOpacity: 0.2,
// //                 strokeColor: '#3B82F6',
// //                 strokeWeight: 2,
// //                 clickable: false,
// //                 editable: false
// //             }
// //         });

// //         drawing.setMap(map);

// //         // Handle polygon completion
// //         drawing.addListener('polygoncomplete', (polygon) => {
// //             const path = polygon.getPath();
// //             const coordinates = [];

// //             for (let i = 0; i < path.getLength(); i++) {
// //                 const point = path.getAt(i);
// //                 coordinates.push({
// //                     lat: point.lat(),
// //                     lng: point.lng()
// //                 });
// //             }

// //             setSelectedArea(coordinates);
// //             setIsDrawing(false);
// //             drawing.setDrawingMode(null);
// //         });

// //         // Create info window
// //         infoWindow.current = new window.google.maps.InfoWindow();

// //         mapInstance.current = map;
// //         drawingManager.current = drawing;
// //     };

// //     // Load Google Maps script
// //     useEffect(() => {
// //         // Since Google Maps is already loaded via LoadScript in parent component,
// //         // we just need to initialize when the component mounts
// //         initializeMap();

// //         // Initial data fetch
// //         fetchLeads();
// //     }, []);

// //     // Filter leads based on search and filters
// //     useEffect(() => {
// //         let filtered = leads.filter(lead => {
// //             const matchesSearch = !searchTerm ||
// //                 lead.propertyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //                 lead.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //                 lead.ownerContact?.includes(searchTerm);

// //             const matchesType = !selectedType || lead.type === selectedType;
// //             const matchesVisibility = visibleTypes.has(lead.type);
// //             const matchesActive = !showOnlyActive || !lead.isCrossed;

// //             // return matchesSearch && matchesType && matchesVisibility && matchesActive;
// //             return true
// //         });

// //         setFilteredLeads(filtered);
// //     }, [leads, searchTerm, selectedType, visibleTypes, showOnlyActive]);

// //     // Update map markers
// //     useEffect(() => {
// //         if (!mapInstance.current) return;

// //         // Clear existing markers
// //         markersRef.current.forEach(marker => marker.setMap(null));
// //         markersRef.current = [];

// //         // Create new markers
// //         filteredLeads.forEach(lead => {
// //             if (!lead.location?.latitude || !lead.location?.longitude) return;

// //             const marker = new window.google.maps.Marker({
// //                 position: {
// //                     lat: lead.location.latitude,
// //                     lng: lead.location.longitude
// //                 },
// //                 map: mapInstance.current,
// //                 title: lead.propertyName,
// //                 icon: {
// //                     path: window.google.maps.SymbolPath.CIRCLE,
// //                     scale: lead.isCrossed ? 6 : 8,
// //                     fillColor: TYPE_COLORS[lead.type] || '#6B7280',
// //                     fillOpacity: lead.isCrossed ? 0.4 : 0.9,
// //                     strokeColor: '#FFFFFF',
// //                     strokeWeight: 2
// //                 }
// //             });

// //             marker.addListener('click', () => {
// //                 setSelectedLead(lead);

// //                 const content = `
// //           <div class="p-3 max-w-sm">
// //             <h3 class="font-bold text-lg text-gray-900">${lead.propertyName}</h3>
// //             <p class="text-sm text-gray-600 mt-1">Type: ${lead.type}</p>
// //             ${lead.ownerName ? `<p class="text-sm text-gray-600">Owner: ${lead.ownerName}</p>` : ''}
// //             ${lead.askingPrice ? `<p class="text-sm font-semibold text-green-600 mt-2">${formatCurrency(lead.askingPrice)}</p>` : ''}
// //             <p class="text-xs text-gray-500 mt-2">Added: ${formatDate(lead.createdAt)}</p>
// //             ${lead.isCrossed ? '<span class="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded mt-2">Crossed</span>' : '<span class="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded mt-2">Active</span>'}
// //           </div>
// //         `;

// //                 infoWindow.current.setContent(content);
// //                 infoWindow.current.open(mapInstance.current, marker);
// //             });

// //             markersRef.current.push(marker);
// //         });
// //     }, [filteredLeads]);

// //     // Analyze selected area
// //     useEffect(() => {
// //         if (!selectedArea || selectedArea.length < 3) {
// //             setLeadsInArea([]);
// //             setLeadsOutsideArea([]);
// //             setMissingTypes([]);
// //             return;
// //         }

// //         const inside = [];
// //         const outside = [];

// //         leads.forEach(lead => {
// //             if (lead.location?.latitude && lead.location?.longitude) {
// //                 if (isPointInPolygon(lead.location, selectedArea)) {
// //                     inside.push(lead);
// //                 } else {
// //                     outside.push(lead);
// //                 }
// //             }
// //         });

// //         setLeadsInArea(inside);
// //         setLeadsOutsideArea(outside);

// //         // Find missing property types
// //         const typesInArea = new Set(inside.map(lead => lead.type));
// //         const missing = PROPERTY_TYPES.filter(type => !typesInArea.has(type));
// //         setMissingTypes(missing);

// //         if (inside.length > 0 || missing.length > 0) {
// //             setShowAnalytics(true);
// //         }
// //     }, [selectedArea, leads]);

// //     // Event handlers
// //     const startDrawing = () => {
// //         if (drawingManager.current && window.google && window.google.maps) {
// //             setIsDrawing(true);
// //             drawingManager.current.setDrawingMode(window.google.maps.drawing.OverlayType.POLYGON);
// //         } else {
// //             setError('Drawing tools not available. Please refresh the page.');
// //         }
// //     };

// //     const clearSelection = () => {
// //         setSelectedArea(null);
// //         setLeadsInArea([]);
// //         setLeadsOutsideArea([]);
// //         setMissingTypes([]);
// //         setShowAnalytics(false);
// //         setIsDrawing(false);

// //         if (drawingManager.current && mapInstance.current) {
// //             drawingManager.current.setMap(null);
// //             drawingManager.current.setMap(mapInstance.current);
// //         }
// //     };

// //     const toggleTypeVisibility = (type) => {
// //         const newVisibleTypes = new Set(visibleTypes);
// //         if (newVisibleTypes.has(type)) {
// //             newVisibleTypes.delete(type);
// //         } else {
// //             newVisibleTypes.add(type);
// //         }
// //         setVisibleTypes(newVisibleTypes);
// //     };

// //     // Get business suggestions for missing types
// //     const getBusinessSuggestions = (missingType) => {
// //         const suggestions = {
// //             'Office': ['WeWork', 'Regus', 'Tech Startups', 'Consulting Firms', 'Law Offices'],
// //             'Retail': ['Starbucks', 'Apple Store', 'Nike', 'Zara', 'Target', 'CVS Pharmacy'],
// //             'Restaurant': ['McDonald\'s', 'Subway', 'Chipotle', 'Local Cafes', 'Fine Dining'],
// //             'Healthcare': ['Urgent Care', 'Dental Clinics', 'Physical Therapy', 'Specialist Offices'],
// //             'Hotel': ['Marriott', 'Hilton', 'Boutique Hotels', 'Extended Stay'],
// //             'Industrial': ['Warehouses', 'Distribution Centers', 'Manufacturing'],
// //             'Education': ['Training Centers', 'Language Schools', 'Tutoring Centers'],
// //             'Mixed-Use': ['Residential/Retail', 'Office/Retail Combo']
// //         };

// //         return suggestions[missingType] || ['Various Business Types'];
// //     };

// //     if (loading) {
// //         return (
// //             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// //                 <div className="text-center">
// //                     <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
// //                     <p className="text-gray-600">Loading commercial leads...</p>
// //                 </div>
// //             </div>
// //         );
// //     }

// //     if (error) {
// //         return (
// //             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// //                 <div className="text-center">
// //                     <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
// //                     <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
// //                     <p className="text-gray-600 mb-4">{error}</p>
// //                     <button
// //                         onClick={fetchLeads}
// //                         className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
// //                     >
// //                         Try Again
// //                     </button>
// //                 </div>
// //             </div>
// //         );
// //     }

// //     return (
// //         <div className="h-screen bg-gray-50 flex flex-col">
// //             {/* Header */}
// //             <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
// //                 <div className="flex items-center justify-between">
// //                     <div className="flex items-center space-x-4">
// //                         <Building className="h-8 w-8 text-blue-600" />
// //                         <div>
// //                             <h1 className="text-2xl font-bold text-gray-900">Commercial Leads Analyzer</h1>
// //                             <p className="text-sm text-gray-600">Identify opportunities in selected areas</p>
// //                         </div>
// //                     </div>

// //                     <div className="flex items-center space-x-4">
// //                         <div className="text-sm text-gray-600">
// //                             <span className="font-semibold">{leads.length}</span> Total Leads
// //                         </div>
// //                         <button
// //                             onClick={fetchLeads}
// //                             className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
// //                             title="Refresh Data"
// //                         >
// //                             <RefreshCw className="h-5 w-5" />
// //                         </button>
// //                     </div>
// //                 </div>
// //             </header>

// //             <div className="flex-1 flex">
// //                 {/* Sidebar */}
// //                 <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
// //                     {/* Search and Filters */}
// //                     <div className="p-4 border-b border-gray-200">
// //                         <div className="relative mb-4">
// //                             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
// //                             <input
// //                                 type="text"
// //                                 placeholder="Search leads..."
// //                                 value={searchTerm}
// //                                 onChange={(e) => setSearchTerm(e.target.value)}
// //                                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                             />
// //                         </div>

// //                         <div className="grid grid-cols-1 gap-3">
// //                             <select
// //                                 value={selectedType}
// //                                 onChange={(e) => setSelectedType(e.target.value)}
// //                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                             >
// //                                 <option value="">All Property Types</option>
// //                                 {PROPERTY_TYPES.map(type => (
// //                                     <option key={type} value={type}>{type}</option>
// //                                 ))}
// //                             </select>

// //                             <label className="flex items-center">
// //                                 <input
// //                                     type="checkbox"
// //                                     checked={showOnlyActive}
// //                                     onChange={(e) => setShowOnlyActive(e.target.checked)}
// //                                     className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
// //                                 />
// //                                 <span className="ml-2 text-sm text-gray-700">Show only active leads</span>
// //                             </label>
// //                         </div>
// //                     </div>

// //                     {/* Area Selection Tools */}
// //                     <div className="p-4 border-b border-gray-200">
// //                         <h3 className="font-semibold text-gray-900 mb-3">Area Selection</h3>
// //                         <div className="grid grid-cols-2 gap-2">
// //                             <button
// //                                 onClick={startDrawing}
// //                                 disabled={isDrawing}
// //                                 className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isDrawing
// //                                         ? 'bg-blue-100 text-blue-700 cursor-not-allowed'
// //                                         : 'bg-blue-600 text-white hover:bg-blue-700'
// //                                     }`}
// //                             >
// //                                 <Target className="h-4 w-4 inline mr-1" />
// //                                 {isDrawing ? 'Drawing...' : 'Draw Area'}
// //                             </button>

// //                             <button
// //                                 onClick={clearSelection}
// //                                 disabled={!selectedArea}
// //                                 className="px-3 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
// //                             >
// //                                 <X className="h-4 w-4 inline mr-1" />
// //                                 Clear
// //                             </button>
// //                         </div>

// //                         {isDrawing && (
// //                             <p className="mt-2 text-xs text-blue-600">
// //                                 Click on the map to draw a polygon around your target area
// //                             </p>
// //                         )}
// //                     </div>

// //                     {/* Property Type Legend */}
// //                     <div className="p-4 border-b border-gray-200">
// //                         <h3 className="font-semibold text-gray-900 mb-3">Property Types</h3>
// //                         <div className="space-y-2 max-h-40 overflow-y-auto">
// //                             {PROPERTY_TYPES.map(type => {
// //                                 const count = leads.filter(lead => lead.type === type).length;
// //                                 const isVisible = visibleTypes.has(type);

// //                                 return (
// //                                     <div key={type} className="flex items-center justify-between">
// //                                         <button
// //                                             onClick={() => toggleTypeVisibility(type)}
// //                                             className="flex items-center flex-1 text-left"
// //                                         >
// //                                             <div
// //                                                 className="w-3 h-3 rounded-full mr-2"
// //                                                 style={{ backgroundColor: TYPE_COLORS[type] }}
// //                                             />
// //                                             <span className={`text-sm ${isVisible ? 'text-gray-900' : 'text-gray-400'}`}>
// //                                                 {type}
// //                                             </span>
// //                                             {isVisible ? (
// //                                                 <Eye className="h-3 w-3 ml-1 text-gray-400" />
// //                                             ) : (
// //                                                 <EyeOff className="h-3 w-3 ml-1 text-gray-400" />
// //                                             )}
// //                                         </button>
// //                                         <span className="text-xs text-gray-500">{count}</span>
// //                                     </div>
// //                                 );
// //                             })}
// //                         </div>
// //                     </div>

// //                     {/* Quick Stats */}
// //                     <div className="p-4">
// //                         <h3 className="font-semibold text-gray-900 mb-3">Quick Stats</h3>
// //                         <div className="space-y-3">
// //                             <div className="flex justify-between">
// //                                 <span className="text-sm text-gray-600">Total Leads</span>
// //                                 <span className="text-sm font-semibold">{leads.length}</span>
// //                             </div>
// //                             <div className="flex justify-between">
// //                                 <span className="text-sm text-gray-600">Active Leads</span>
// //                                 <span className="text-sm font-semibold text-green-600">
// //                                     {leads.filter(lead => !lead.isCrossed).length}
// //                                 </span>
// //                             </div>
// //                             <div className="flex justify-between">
// //                                 <span className="text-sm text-gray-600">Crossed Leads</span>
// //                                 <span className="text-sm font-semibold text-red-600">
// //                                     {leads.filter(lead => lead.isCrossed).length}
// //                                 </span>
// //                             </div>
// //                             <div className="flex justify-between">
// //                                 <span className="text-sm text-gray-600">Avg. Price</span>
// //                                 <span className="text-sm font-semibold">
// //                                     {formatCurrency(
// //                                         leads.reduce((sum, lead) => sum + (lead.askingPrice || 0), 0) / leads.length
// //                                     )}
// //                                 </span>
// //                             </div>
// //                         </div>
// //                     </div>
// //                 </div>

// //                 {/* Main Content */}
// //                 <div className="flex-1 relative">
// //                     {/* Map */}
// //                     <div ref={mapRef} className="absolute inset-0" />

// //                     {/* Map Loading Indicator */}
// //                     {!mapInstance.current && (
// //                         <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
// //                             <div className="text-center">
// //                                 <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
// //                                 <p className="text-gray-600">Loading Google Maps...</p>
// //                             </div>
// //                         </div>
// //                     )}

// //                     {/* Analytics Panel */}
// //                     {showAnalytics && (
// //                         <div className="absolute top-4 right-4 w-96 bg-white rounded-lg shadow-lg max-h-[calc(100vh-200px)] overflow-hidden">
// //                             <div className="p-4 border-b border-gray-200">
// //                                 <div className="flex items-center justify-between">
// //                                     <h3 className="font-semibold text-gray-900 flex items-center">
// //                                         <PieChart className="h-5 w-5 mr-2 text-blue-600" />
// //                                         Area Analysis
// //                                     </h3>
// //                                     <button
// //                                         onClick={() => setShowAnalytics(false)}
// //                                         className="text-gray-400 hover:text-gray-600"
// //                                     >
// //                                         <X className="h-5 w-5" />
// //                                     </button>
// //                                 </div>
// //                             </div>

// //                             <div className="p-4 overflow-y-auto max-h-96">
// //                                 {/* Leads in Area */}
// //                                 <div className="mb-6">
// //                                     <h4 className="font-medium text-gray-900 mb-3 flex items-center">
// //                                         <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
// //                                         Leads in Selected Area ({leadsInArea.length})
// //                                     </h4>

// //                                     {leadsInArea.length > 0 ? (
// //                                         <div className="space-y-2 max-h-40 overflow-y-auto">
// //                                             {leadsInArea.map(lead => (
// //                                                 <div key={lead._id} className="p-2 bg-green-50 rounded border-l-4 border-green-400">
// //                                                     <div className="flex justify-between items-start">
// //                                                         <div className="flex-1">
// //                                                             <p className="font-medium text-sm text-gray-900">{lead.propertyName}</p>
// //                                                             <p className="text-xs text-gray-600">{lead.type}</p>
// //                                                             {lead.ownerName && (
// //                                                                 <p className="text-xs text-gray-600 flex items-center mt-1">
// //                                                                     <User className="h-3 w-3 mr-1" />
// //                                                                     {lead.ownerName}
// //                                                                 </p>
// //                                                             )}
// //                                                             {lead.ownerContact && (
// //                                                                 <p className="text-xs text-gray-600 flex items-center">
// //                                                                     <Phone className="h-3 w-3 mr-1" />
// //                                                                     {lead.ownerContact}
// //                                                                 </p>
// //                                                             )}
// //                                                         </div>
// //                                                         <div className="text-right">
// //                                                             {lead.askingPrice && (
// //                                                                 <p className="text-xs font-semibold text-green-600">
// //                                                                     {formatCurrency(lead.askingPrice)}
// //                                                                 </p>
// //                                                             )}
// //                                                             <p className="text-xs text-gray-500">
// //                                                                 {formatDate(lead.createdAt)}
// //                                                             </p>
// //                                                         </div>
// //                                                     </div>
// //                                                 </div>
// //                                             ))}
// //                                         </div>
// //                                     ) : (
// //                                         <p className="text-sm text-gray-500">No leads found in selected area</p>
// //                                     )}
// //                                 </div>

// //                                 {/* Missing Opportunities */}
// //                                 <div className="mb-6">
// //                                     <h4 className="font-medium text-gray-900 mb-3 flex items-center">
// //                                         <Lightbulb className="h-4 w-4 mr-2 text-yellow-600" />
// //                                         Missing Opportunities ({missingTypes.length})
// //                                     </h4>

// //                                     {missingTypes.length > 0 ? (
// //                                         <div className="space-y-3">
// //                                             {missingTypes.map(type => (
// //                                                 <div key={type} className="p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
// //                                                     <div className="flex items-center mb-2">
// //                                                         <div
// //                                                             className="w-3 h-3 rounded-full mr-2"
// //                                                             style={{ backgroundColor: TYPE_COLORS[type] }}
// //                                                         />
// //                                                         <span className="font-medium text-sm text-gray-900">{type}</span>
// //                                                     </div>
// //                                                     <p className="text-xs text-gray-600 mb-2">Potential businesses:</p>
// //                                                     <div className="flex flex-wrap gap-1">
// //                                                         {getBusinessSuggestions(type).slice(0, 3).map(suggestion => (
// //                                                             <span
// //                                                                 key={suggestion}
// //                                                                 className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded"
// //                                                             >
// //                                                                 {suggestion}
// //                                                             </span>
// //                                                         ))}
// //                                                     </div>
// //                                                 </div>
// //                                             ))}
// //                                         </div>
// //                                     ) : (
// //                                         <p className="text-sm text-gray-500">All property types are represented in this area</p>
// //                                     )}
// //                                 </div>

// //                                 {/* Area Summary */}
// //                                 <div className="pt-4 border-t border-gray-200">
// //                                     <h4 className="font-medium text-gray-900 mb-3 flex items-center">
// //                                         <TrendingUp className="h-4 w-4 mr-2 text-blue-600" />
// //                                         Area Summary
// //                                     </h4>

// //                                     <div className="grid grid-cols-2 gap-4 text-sm">
// //                                         <div>
// //                                             <p className="text-gray-600">Total Properties</p>
// //                                             <p className="font-semibold">{leadsInArea.length}</p>
// //                                         </div>
// //                                         <div>
// //                                             <p className="text-gray-600">Property Types</p>
// //                                             <p className="font-semibold">{new Set(leadsInArea.map(l => l.type)).size}</p>
// //                                         </div>
// //                                         <div>
// //                                             <p className="text-gray-600">Active Leads</p>
// //                                             <p className="font-semibold text-green-600">
// //                                                 {leadsInArea.filter(l => !l.isCrossed).length}
// //                                             </p>
// //                                         </div>
// //                                         <div>
// //                                             <p className="text-gray-600">Avg. Price</p>
// //                                             <p className="font-semibold">
// //                                                 {formatCurrency(
// //                                                     leadsInArea.reduce((sum, lead) => sum + (lead.askingPrice || 0), 0) / leadsInArea.length
// //                                                 )}
// //                                             </p>
// //                                         </div>
// //                                     </div>
// //                                 </div>
// //                             </div>
// //                         </div>
// //                     )}

// //                     {/* Lead Details Modal */}
// //                     {selectedLead && (
// //                         <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
// //                             <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
// //                                 <div className="p-4 border-b border-gray-200">
// //                                     <div className="flex items-center justify-between">
// //                                         <h3 className="font-semibold text-lg text-gray-900">{selectedLead.propertyName}</h3>
// //                                         <button
// //                                             onClick={() => setSelectedLead(null)}
// //                                             className="text-gray-400 hover:text-gray-600"
// //                                         >
// //                                             <X className="h-6 w-6" />
// //                                         </button>
// //                                     </div>
// //                                 </div>

// //                                 <div className="p-4 overflow-y-auto max-h-96">
// //                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                                         <div>
// //                                             <h4 className="font-medium text-gray-900 mb-2">Property Details</h4>
// //                                             <div className="space-y-2 text-sm">
// //                                                 <div className="flex justify-between">
// //                                                     <span className="text-gray-600">Type:</span>
// //                                                     <span className="font-medium">{selectedLead.type}</span>
// //                                                 </div>
// //                                                 <div className="flex justify-between">
// //                                                     <span className="text-gray-600">Status:</span>
// //                                                     <span className={`font-medium ${selectedLead.isCrossed ? 'text-red-600' : 'text-green-600'}`}>
// //                                                         {selectedLead.isCrossed ? 'Crossed' : 'Active'}
// //                                                     </span>
// //                                                 </div>
// //                                                 {selectedLead.askingPrice && (
// //                                                     <div className="flex justify-between">
// //                                                         <span className="text-gray-600">Price:</span>
// //                                                         <span className="font-semibold text-green-600">
// //                                                             {formatCurrency(selectedLead.askingPrice)}
// //                                                         </span>
// //                                                     </div>
// //                                                 )}
// //                                                 <div className="flex justify-between">
// //                                                     <span className="text-gray-600">Added:</span>
// //                                                     <span className="font-medium">{formatDate(selectedLead.createdAt)}</span>
// //                                                 </div>
// //                                             </div>
// //                                         </div>

// //                                         <div>
// //                                             <h4 className="font-medium text-gray-900 mb-2">Owner Information</h4>
// //                                             <div className="space-y-2 text-sm">
// //                                                 {selectedLead.ownerName && (
// //                                                     <div className="flex items-center">
// //                                                         <User className="h-4 w-4 mr-2 text-gray-400" />
// //                                                         <span>{selectedLead.ownerName}</span>
// //                                                     </div>
// //                                                 )}
// //                                                 {selectedLead.ownerContact && (
// //                                                     <div className="flex items-center">
// //                                                         <Phone className="h-4 w-4 mr-2 text-gray-400" />
// //                                                         <span>{selectedLead.ownerContact}</span>
// //                                                     </div>
// //                                                 )}
// //                                                 {selectedLead.salesman && (
// //                                                     <div className="mt-3">
// //                                                         <p className="text-gray-600 text-xs mb-1">Salesman:</p>
// //                                                         <p className="font-medium">{selectedLead.salesman.name}</p>
// //                                                         <p className="text-xs text-gray-500">{selectedLead.salesman.email}</p>
// //                                                     </div>
// //                                                 )}
// //                                             </div>
// //                                         </div>
// //                                     </div>

// //                                     {selectedLead.images && selectedLead.images.length > 0 && (
// //                                         <div className="mt-6">
// //                                             <h4 className="font-medium text-gray-900 mb-2">Images</h4>
// //                                             <div className="grid grid-cols-2 gap-2">
// //                                                 {selectedLead.images.slice(0, 4).map((image, index) => (
// //                                                     <img
// //                                                         key={index}
// //                                                         src={image.url}
// //                                                         alt={image.caption || `Property image ${index + 1}`}
// //                                                         className="w-full h-24 object-cover rounded"
// //                                                     />
// //                                                 ))}
// //                                             </div>
// //                                         </div>
// //                                     )}
// //                                 </div>
// //                             </div>
// //                         </div>
// //                     )}
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }

// // export default Lasso;


// import React, { useState, useEffect, useRef } from 'react';
// import {
//     MapPin,
//     Filter,
//     Search,
//     Target,
//     TrendingUp,
//     Building,
//     Users,
//     DollarSign,
//     PieChart,
//     Lightbulb,
//     X,
//     Eye,
//     EyeOff,
//     Layers,
//     RefreshCw,
//     AlertCircle,
//     CheckCircle,
//     Phone,
//     User,
//     Calendar,
//     Loader
// } from 'lucide-react';
// import { base_url } from '../utils/base_url';

// const API_BASE_URL = base_url;

// // Default property types (will be updated with actual data from API)
// const DEFAULT_PROPERTY_TYPES = [
//     'Office', 'Retail', 'Industrial', 'Healthcare', 'Restaurant',
//     'Hotel', 'Mixed-Use', 'Warehouse', 'Manufacturing', 'Education'
// ];

// const TYPE_COLORS = {
//     'Office': '#3B82F6',
//     'Retail': '#EF4444',
//     'Industrial': '#F97316',
//     'Healthcare': '#10B981',
//     'Restaurant': '#8B5CF6',
//     'Hotel': '#F59E0B',
//     'Mixed-Use': '#6366F1',
//     'Warehouse': '#84CC16',
//     'Manufacturing': '#EC4899',
//     'Education': '#14B8A6',
//     'Supermarket': '#059669',
//     'Shopping Mall': '#DC2626',
//     'Medical': '#047857',
//     'Entertainment': '#7C3AED',
//     'Sports': '#C2410C',
//     'Financial': '#1E40AF',
//     'Technology': '#0F766E',
//     'Automotive': '#92400E',
//     'Food Court': '#BE185D',
//     'Pharmacy': '#166534'
// };

// // Utility function for point-in-polygon calculation
// const isPointInPolygon = (point, polygon) => {
//     const x = point.latitude;
//     const y = point.longitude;
//     let inside = false;

//     for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
//         const xi = polygon[i].lat;
//         const yi = polygon[i].lng;
//         const xj = polygon[j].lat;
//         const yj = polygon[j].lng;

//         if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
//             inside = !inside;
//         }
//     }

//     return inside;
// };

// // Format currency
// const formatCurrency = (amount) => {
//     if (!amount) return 'N/A';
//     return new Intl.NumberFormat('en-US', {
//         style: 'currency',
//         currency: 'USD',
//         minimumFractionDigits: 0,
//         maximumFractionDigits: 0,
//     }).format(amount);
// };

// // Format date
// const formatDate = (date) => {
//     return new Date(date).toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//     });
// };

// function Lasso() {
//     // State management
//     const [leads, setLeads] = useState([]);
//     const [filteredLeads, setFilteredLeads] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [propertyTypes, setPropertyTypes] = useState(DEFAULT_PROPERTY_TYPES);

//     console.log("leads", leads);

//     // Area selection state
//     const [selectedArea, setSelectedArea] = useState(null);
//     const [leadsInArea, setLeadsInArea] = useState([]);
//     const [leadsOutsideArea, setLeadsOutsideArea] = useState([]);
//     const [missingTypes, setMissingTypes] = useState([]);
//     const [isDrawing, setIsDrawing] = useState(false);

//     // UI state
//     const [searchTerm, setSearchTerm] = useState('');
//     const [selectedType, setSelectedType] = useState('');
//     const [showAnalytics, setShowAnalytics] = useState(false);
//     const [selectedLead, setSelectedLead] = useState(null);
//     const [visibleTypes, setVisibleTypes] = useState(new Set(DEFAULT_PROPERTY_TYPES));
//     const [showOnlyActive, setShowOnlyActive] = useState(false);

//     // Map references
//     const mapRef = useRef(null);
//     const mapInstance = useRef(null);
//     const drawingManager = useRef(null);
//     const markersRef = useRef([]);
//     const infoWindow = useRef(null);

//     // Extract unique property types from leads data
//     const updatePropertyTypes = (leadsData) => {
//         const uniqueTypes = [...new Set(leadsData.map(lead => lead.type).filter(Boolean))];
//         const sortedTypes = uniqueTypes.sort();
//         setPropertyTypes(sortedTypes);
//         setVisibleTypes(new Set(sortedTypes));

//         // Update TYPE_COLORS for new types
//         sortedTypes.forEach((type, index) => {
//             if (!TYPE_COLORS[type]) {
//                 const colors = ['#3B82F6', '#EF4444', '#F97316', '#10B981', '#8B5CF6', '#F59E0B', '#6366F1', '#84CC16', '#EC4899', '#14B8A6'];
//                 TYPE_COLORS[type] = colors[index % colors.length];
//             }
//         });
//     };

//     // Fetch leads from API
//     const fetchLeads = async () => {
//         try {
//             setLoading(true);
//             setError(null);

//             // Build headers conditionally
//             const headers = {
//                 'Content-Type': 'application/json'
//             };

//             // Add authorization header if token exists
//             const token = localStorage.getItem('token');
//             if (token) {
//                 headers['Authorization'] = `Bearer ${token}`;
//             }

//             const response = await fetch(`${API_BASE_URL}/api/salesman/commercial/leads`, { headers });

//             if (!response.ok) {
//                 if (response.status === 401) {
//                     throw new Error('Authentication required. Please log in.');
//                 } else if (response.status === 403) {
//                     throw new Error('Access denied. Insufficient permissions.');
//                 } else {
//                     throw new Error(`HTTP error! status: ${response.status}`);
//                 }
//             }

//             const result = await response.json();

//             // Handle different possible response structures
//             if (result.success === 'true' || result.success === true) {
//                 const leadsData = result.data?.leads || result.data || [];
//                 setLeads(leadsData);
//                 setFilteredLeads(leadsData);
//                 updatePropertyTypes(leadsData);
//             } else if (Array.isArray(result)) {
//                 // Direct array response
//                 setLeads(result);
//                 setFilteredLeads(result);
//                 updatePropertyTypes(result);
//             } else if (result.data && Array.isArray(result.data)) {
//                 setLeads(result.data);
//                 setFilteredLeads(result.data);
//                 updatePropertyTypes(result.data);
//             } else {
//                 throw new Error(result.msg || result.message || 'Failed to fetch leads');
//             }
//         } catch (err) {
//             console.error('Error fetching leads:', err);
//             setError(err.message);

//             // Set empty arrays on error to prevent crashes
//             setLeads([]);
//             setFilteredLeads([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Add a retry mechanism for map initialization
//     const retryMapInitialization = () => {
//         let retryCount = 0;
//         const maxRetries = 10;

//         const tryInit = () => {
//             if (window.google && window.google.maps && window.google.maps.drawing) {
//                 initializeMap();
//             } else if (retryCount < maxRetries) {
//                 retryCount++;
//                 setTimeout(tryInit, 500);
//             } else {
//                 setError('Failed to initialize Google Maps. Please refresh the page.');
//             }
//         };

//         tryInit();
//     };

//     // Update the useEffect to use retry mechanism
//     useEffect(() => {
//         // Wait a bit for Google Maps to be fully loaded
//         setTimeout(() => {
//             if (window.google && window.google.maps && window.google.maps.drawing) {
//                 initializeMap();
//             } else {
//                 retryMapInitialization();
//             }
//         }, 100);

//         // Initial data fetch
//         fetchLeads();
//     }, []);

//     // Add effect to reinitialize map if it becomes available later
//     useEffect(() => {
//         const checkGoogleMaps = () => {
//             if (window.google && window.google.maps && window.google.maps.drawing && !mapInstance.current) {
//                 initializeMap();
//             }
//         };

//         // Check periodically if Google Maps becomes available
//         const interval = setInterval(checkGoogleMaps, 1000);

//         // Clean up interval after 30 seconds
//         setTimeout(() => clearInterval(interval), 30000);

//         return () => clearInterval(interval);
//     }, []);

//     // Initialize Google Maps
//     const initializeMap = () => {
//         if (!window.google || !window.google.maps || !mapRef.current) {
//             console.log('Google Maps not ready yet, retrying...');
//             setTimeout(initializeMap, 100);
//             return;
//         }

//         const map = new window.google.maps.Map(mapRef.current, {
//             center: { lat: 26.4804247, lng: 80.29115589999999 }, // Default to NYC
//             zoom: 12,
//             mapTypeId: 'roadmap',
//             styles: [
//                 {
//                     featureType: 'poi',
//                     elementType: 'labels',
//                     stylers: [{ visibility: 'off' }]
//                 }
//             ]
//         });

//         const drawing = new window.google.maps.drawing.DrawingManager({
//             drawingMode: null,
//             drawingControl: false,
//             polygonOptions: {
//                 fillColor: '#3B82F6',
//                 fillOpacity: 0.2,
//                 strokeColor: '#3B82F6',
//                 strokeWeight: 2,
//                 clickable: false,
//                 editable: false
//             }
//         });

//         drawing.setMap(map);

//         // Handle polygon completion
//         drawing.addListener('polygoncomplete', (polygon) => {
//             const path = polygon.getPath();
//             const coordinates = [];

//             for (let i = 0; i < path.getLength(); i++) {
//                 const point = path.getAt(i);
//                 coordinates.push({
//                     lat: point.lat(),
//                     lng: point.lng()
//                 });
//             }

//             setSelectedArea(coordinates);
//             setIsDrawing(false);
//             drawing.setDrawingMode(null);
//         });

//         // Create info window
//         infoWindow.current = new window.google.maps.InfoWindow();

//         mapInstance.current = map;
//         drawingManager.current = drawing;
//     };

//     // Filter leads based on search and filters
//     useEffect(() => {
//         let filtered = leads.filter(lead => {
//             const matchesSearch = !searchTerm ||
//                 lead.propertyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 lead.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 lead.ownerContact?.includes(searchTerm);

//             const matchesType = !selectedType || lead.type === selectedType;
//             const matchesVisibility = visibleTypes.has(lead.type);
//             const matchesActive = !showOnlyActive || !lead.isCrossed;

//             return matchesSearch && matchesType && matchesVisibility && matchesActive;
//         });

//         setFilteredLeads(filtered);
//     }, [leads, searchTerm, selectedType, visibleTypes, showOnlyActive]);

//     // Update map markers
//     useEffect(() => {
//         if (!mapInstance.current) return;

//         // Clear existing markers
//         markersRef.current.forEach(marker => marker.setMap(null));
//         markersRef.current = [];

//         // Create new markers
//         filteredLeads.forEach(lead => {
//             if (!lead.location?.latitude || !lead.location?.longitude) return;

//             const marker = new window.google.maps.Marker({
//                 position: {
//                     lat: lead.location.latitude,
//                     lng: lead.location.longitude
//                 },
//                 map: mapInstance.current,
//                 title: lead.propertyName,
//                 icon: {
//                     path: window.google.maps.SymbolPath.CIRCLE,
//                     scale: lead.isCrossed ? 6 : 8,
//                     fillColor: TYPE_COLORS[lead.type] || '#6B7280',
//                     fillOpacity: lead.isCrossed ? 0.4 : 0.9,
//                     strokeColor: '#FFFFFF',
//                     strokeWeight: 2
//                 }
//             });

//             marker.addListener('click', () => {
//                 setSelectedLead(lead);

//                 const content = `
//           <div class="p-3 max-w-sm">
//             <h3 class="font-bold text-lg text-gray-900">${lead.propertyName}</h3>
//             <p class="text-sm text-gray-600 mt-1">Type: ${lead.type}</p>
//             ${lead.ownerName ? `<p class="text-sm text-gray-600">Owner: ${lead.ownerName}</p>` : ''}
//             ${lead.askingPrice ? `<p class="text-sm font-semibold text-green-600 mt-2">${formatCurrency(lead.askingPrice)}</p>` : ''}
//             <p class="text-xs text-gray-500 mt-2">Added: ${formatDate(lead.createdAt)}</p>
//             ${lead.isCrossed ? '<span class="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded mt-2">Crossed</span>' : '<span class="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded mt-2">Active</span>'}
//           </div>
//         `;

//                 infoWindow.current.setContent(content);
//                 infoWindow.current.open(mapInstance.current, marker);
//             });

//             markersRef.current.push(marker);
//         });
//     }, [filteredLeads]);

//     // Analyze selected area
//     useEffect(() => {
//         if (!selectedArea || selectedArea.length < 3) {
//             setLeadsInArea([]);
//             setLeadsOutsideArea([]);
//             setMissingTypes([]);
//             return;
//         }

//         const inside = [];
//         const outside = [];

//         leads.forEach(lead => {
//             if (lead.location?.latitude && lead.location?.longitude) {
//                 if (isPointInPolygon(lead.location, selectedArea)) {
//                     inside.push(lead);
//                 } else {
//                     outside.push(lead);
//                 }
//             }
//         });

//         setLeadsInArea(inside);
//         setLeadsOutsideArea(outside);

//         // Find missing property types based on actual data
//         const typesInArea = new Set(inside.map(lead => lead.type));
//         const missing = propertyTypes.filter(type => !typesInArea.has(type));
//         setMissingTypes(missing);

//         if (inside.length > 0 || missing.length > 0) {
//             setShowAnalytics(true);
//         }
//     }, [selectedArea, leads, propertyTypes]);

//     // Event handlers
//     const startDrawing = () => {
//         if (drawingManager.current && window.google && window.google.maps) {
//             setIsDrawing(true);
//             drawingManager.current.setDrawingMode(window.google.maps.drawing.OverlayType.POLYGON);
//         } else {
//             setError('Drawing tools not available. Please refresh the page.');
//         }
//     };

//     const clearSelection = () => {
//         setSelectedArea(null);
//         setLeadsInArea([]);
//         setLeadsOutsideArea([]);
//         setMissingTypes([]);
//         setShowAnalytics(false);
//         setIsDrawing(false);

//         if (drawingManager.current && mapInstance.current) {
//             drawingManager.current.setMap(null);
//             drawingManager.current.setMap(mapInstance.current);
//         }
//     };

//     const toggleTypeVisibility = (type) => {
//         const newVisibleTypes = new Set(visibleTypes);
//         if (newVisibleTypes.has(type)) {
//             newVisibleTypes.delete(type);
//         } else {
//             newVisibleTypes.add(type);
//         }
//         setVisibleTypes(newVisibleTypes);
//     };

//     // Get leads of missing types from outside the area
//     const getMissingTypeLeads = (missingType) => {
//         return leadsOutsideArea.filter(lead => lead.type === missingType);
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="text-center">
//                     <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
//                     <p className="text-gray-600">Loading commercial leads...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="text-center">
//                     <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
//                     <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
//                     <p className="text-gray-600 mb-4">{error}</p>
//                     <button
//                         onClick={fetchLeads}
//                         className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                     >
//                         Try Again
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="h-screen bg-gray-50 flex flex-col">
//             {/* Header */}
//             <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
//                 <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-4">
//                         <Building className="h-8 w-8 text-blue-600" />
//                         <div>
//                             <h1 className="text-2xl font-bold text-gray-900">Commercial Leads Analyzer</h1>
//                             <p className="text-sm text-gray-600">Identify opportunities in selected areas</p>
//                         </div>
//                     </div>

//                     <div className="flex items-center space-x-4">
//                         <div className="text-sm text-gray-600">
//                             <span className="font-semibold">{leads.length}</span> Total Leads
//                         </div>
//                         <button
//                             onClick={fetchLeads}
//                             className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
//                             title="Refresh Data"
//                         >
//                             <RefreshCw className="h-5 w-5" />
//                         </button>
//                     </div>
//                 </div>
//             </header>

//             <div className="flex-1 flex">
//                 {/* Sidebar */}
//                 <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
//                     {/* Search and Filters */}
//                     <div className="p-4 border-b border-gray-200">
//                         <div className="relative mb-4">
//                             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//                             <input
//                                 type="text"
//                                 placeholder="Search leads..."
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             />
//                         </div>

//                         <div className="grid grid-cols-1 gap-3">
//                             <select
//                                 value={selectedType}
//                                 onChange={(e) => setSelectedType(e.target.value)}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             >
//                                 <option value="">All Property Types</option>
//                                 {propertyTypes.map(type => (
//                                     <option key={type} value={type}>{type}</option>
//                                 ))}
//                             </select>

//                             <label className="flex items-center">
//                                 <input
//                                     type="checkbox"
//                                     checked={showOnlyActive}
//                                     onChange={(e) => setShowOnlyActive(e.target.checked)}
//                                     className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                                 />
//                                 <span className="ml-2 text-sm text-gray-700">Show only active leads</span>
//                             </label>
//                         </div>
//                     </div>

//                     {/* Area Selection Tools */}
//                     <div className="p-4 border-b border-gray-200">
//                         <h3 className="font-semibold text-gray-900 mb-3">Area Selection</h3>
//                         <div className="grid grid-cols-2 gap-2">
//                             <button
//                                 onClick={startDrawing}
//                                 disabled={isDrawing}
//                                 className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isDrawing
//                                     ? 'bg-blue-100 text-blue-700 cursor-not-allowed'
//                                     : 'bg-blue-600 text-white hover:bg-blue-700'
//                                     }`}
//                             >
//                                 <Target className="h-4 w-4 inline mr-1" />
//                                 {isDrawing ? 'Drawing...' : 'Draw Area'}
//                             </button>

//                             <button
//                                 onClick={clearSelection}
//                                 disabled={!selectedArea}
//                                 className="px-3 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
//                             >
//                                 <X className="h-4 w-4 inline mr-1" />
//                                 Clear
//                             </button>
//                         </div>

//                         {isDrawing && (
//                             <p className="mt-2 text-xs text-blue-600">
//                                 Click on the map to draw a polygon around your target area
//                             </p>
//                         )}
//                     </div>

//                     {/* Property Type Legend */}
//                     <div className="p-4 border-b border-gray-200">
//                         <h3 className="font-semibold text-gray-900 mb-3">Property Types</h3>
//                         <div className="space-y-2 max-h-40 overflow-y-auto">
//                             {propertyTypes.map(type => {
//                                 const count = leads.filter(lead => lead.type === type).length;
//                                 const isVisible = visibleTypes.has(type);

//                                 return (
//                                     <div key={type} className="flex items-center justify-between">
//                                         <button
//                                             onClick={() => toggleTypeVisibility(type)}
//                                             className="flex items-center flex-1 text-left"
//                                         >
//                                             <div
//                                                 className="w-3 h-3 rounded-full mr-2"
//                                                 style={{ backgroundColor: TYPE_COLORS[type] }}
//                                             />
//                                             <span className={`text-sm ${isVisible ? 'text-gray-900' : 'text-gray-400'}`}>
//                                                 {type}
//                                             </span>
//                                             {isVisible ? (
//                                                 <Eye className="h-3 w-3 ml-1 text-gray-400" />
//                                             ) : (
//                                                 <EyeOff className="h-3 w-3 ml-1 text-gray-400" />
//                                             )}
//                                         </button>
//                                         <span className="text-xs text-gray-500">{count}</span>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     </div>

//                     {/* Quick Stats */}
//                     <div className="p-4">
//                         <h3 className="font-semibold text-gray-900 mb-3">Quick Stats</h3>
//                         <div className="space-y-3">
//                             <div className="flex justify-between">
//                                 <span className="text-sm text-gray-600">Total Leads</span>
//                                 <span className="text-sm font-semibold">{leads.length}</span>
//                             </div>
//                             <div className="flex justify-between">
//                                 <span className="text-sm text-gray-600">Active Leads</span>
//                                 <span className="text-sm font-semibold text-green-600">
//                                     {leads.filter(lead => !lead.isCrossed).length}
//                                 </span>
//                             </div>
//                             <div className="flex justify-between">
//                                 <span className="text-sm text-gray-600">Crossed Leads</span>
//                                 <span className="text-sm font-semibold text-red-600">
//                                     {leads.filter(lead => lead.isCrossed).length}
//                                 </span>
//                             </div>
//                             <div className="flex justify-between">
//                                 <span className="text-sm text-gray-600">Property Types</span>
//                                 <span className="text-sm font-semibold">
//                                     {propertyTypes.length}
//                                 </span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Main Content */}
//                 <div className="flex-1 relative">
//                     {/* Map */}
//                     <div ref={mapRef} className="absolute inset-0" />

//                     {/* Map Loading Indicator */}
//                     {!mapInstance.current && (
//                         <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
//                             <div className="text-center">
//                                 <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
//                                 <p className="text-gray-600">Loading Google Maps...</p>
//                             </div>
//                         </div>
//                     )}

//                     {/* Analytics Panel */}
//                     {showAnalytics && (
//                         <div className="absolute top-4 right-4 w-96 bg-white rounded-lg shadow-lg max-h-[calc(100vh-200px)] overflow-hidden">
//                             <div className="p-4 border-b border-gray-200">
//                                 <div className="flex items-center justify-between">
//                                     <h3 className="font-semibold text-gray-900 flex items-center">
//                                         <PieChart className="h-5 w-5 mr-2 text-blue-600" />
//                                         Area Analysis
//                                     </h3>
//                                     <button
//                                         onClick={() => setShowAnalytics(false)}
//                                         className="text-gray-400 hover:text-gray-600"
//                                     >
//                                         <X className="h-5 w-5" />
//                                     </button>
//                                 </div>
//                             </div>

//                             <div className="p-4 overflow-y-auto max-h-96">
//                                 {/* Leads in Area */}
//                                 <div className="mb-6">
//                                     <h4 className="font-medium text-gray-900 mb-3 flex items-center">
//                                         <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
//                                         Leads in Selected Area ({leadsInArea.length})
//                                     </h4>

//                                     {leadsInArea.length > 0 ? (
//                                         <div className="space-y-2 max-h-40 overflow-y-auto">
//                                             {leadsInArea.map(lead => (
//                                                 <div key={lead._id} className="p-2 bg-green-50 rounded border-l-4 border-green-400">
//                                                     <div className="flex justify-between items-start">
//                                                         <div className="flex-1">
//                                                             <p className="font-medium text-sm text-gray-900">{lead.propertyName}</p>
//                                                             <p className="text-xs text-gray-600">{lead.type}</p>
//                                                             {lead.ownerName && (
//                                                                 <p className="text-xs text-gray-600 flex items-center mt-1">
//                                                                     <User className="h-3 w-3 mr-1" />
//                                                                     {lead.ownerName}
//                                                                 </p>
//                                                             )}
//                                                             {lead.ownerContact && (
//                                                                 <p className="text-xs text-gray-600 flex items-center">
//                                                                     <Phone className="h-3 w-3 mr-1" />
//                                                                     {lead.ownerContact}
//                                                                 </p>
//                                                             )}
//                                                         </div>
//                                                         <div className="text-right">
//                                                             {lead.askingPrice && (
//                                                                 <p className="text-xs font-semibold text-green-600">
//                                                                     {formatCurrency(lead.askingPrice)}
//                                                                 </p>
//                                                             )}
//                                                             <p className="text-xs text-gray-500">
//                                                                 {formatDate(lead.createdAt)}
//                                                             </p>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     ) : (
//                                         <p className="text-sm text-gray-500">No leads found in selected area</p>
//                                     )}
//                                 </div>

//                                 {/* Missing Opportunities */}
//                                 <div className="mb-6">
//                                     <h4 className="font-medium text-gray-900 mb-3 flex items-center">
//                                         <Lightbulb className="h-4 w-4 mr-2 text-yellow-600" />
//                                         Missing Opportunities ({missingTypes.length})
//                                     </h4>

//                                     {missingTypes.length > 0 ? (
//                                         <div className="space-y-3">
//                                             {missingTypes.map(type => {
//                                                 const availableLeads = getMissingTypeLeads(type);
//                                                 return (
//                                                     <div key={type} className="p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
//                                                         <div className="flex items-center mb-2">
//                                                             <div
//                                                                 className="w-3 h-3 rounded-full mr-2"
//                                                                 style={{ backgroundColor: TYPE_COLORS[type] }}
//                                                             />
//                                                             <span className="font-medium text-sm text-gray-900">{type}</span>
//                                                         </div>
//                                                         <p className="text-xs text-gray-600 mb-2">
//                                                             Available leads outside area: {availableLeads.length}
//                                                         </p>
//                                                         {availableLeads.length > 0 && (
//                                                             <div className="space-y-1">
//                                                                 {availableLeads.slice(0, 2).map(lead => (
//                                                                     <div key={lead._id} className="text-xs text-gray-700 bg-yellow-100 p-1 rounded">
//                                                                         {lead.propertyName}
//                                                                         {lead.askingPrice && ` - ${formatCurrency(lead.askingPrice)}`}
//                                                                     </div>
//                                                                 ))}
//                                                                 {availableLeads.length > 2 && (
//                                                                     <p className="text-xs text-gray-600">
//                                                                         +{availableLeads.length - 2} more available
//                                                                     </p>
//                                                                 )}
//                                                             </div>
//                                                         )}
//                                                     </div>
//                                                 );
//                                             })}
//                                         </div>
//                                     ) : (
//                                         <p className="text-sm text-gray-500">All property types are represented in this area</p>
//                                     )}
//                                 </div>

//                                 {/* Area Summary */}
//                                 <div className="pt-4 border-t border-gray-200">
//                                     <h4 className="font-medium text-gray-900 mb-3 flex items-center">
//                                         <TrendingUp className="h-4 w-4 mr-2 text-blue-600" />
//                                         Area Summary
//                                     </h4>

//                                     <div className="grid grid-cols-2 gap-4 text-sm">
//                                         <div>
//                                             <p className="text-gray-600">Total Properties</p>
//                                             <p className="font-semibold">{leadsInArea.length}</p>
//                                         </div>
//                                         <div>
//                                             <p className="text-gray-600">Property Types</p>
//                                             <p className="font-semibold">{new Set(leadsInArea.map(l => l.type)).size}</p>
//                                         </div>
//                                         <div>
//                                             <p className="text-gray-600">Active Leads</p>
//                                             <p className="font-semibold text-green-600">
//                                                 {leadsInArea.filter(l => !l.isCrossed).length}
//                                             </p>
//                                         </div>
//                                         <div>
//                                             <p className="text-gray-600">Avg. Price</p>
//                                             <p className="font-semibold">
//                                                 {formatCurrency(
//                                                     leadsInArea.reduce((sum, lead) => sum + (lead.askingPrice || 0), 0) / leadsInArea.length
//                                                 )}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {/* Lead Details Modal */}
//                     {selectedLead && (
//                         <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//                             <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
//                                 <div className="p-4 border-b border-gray-200">
//                                     <div className="flex items-center justify-between">
//                                         <h3 className="font-semibold text-lg text-gray-900">{selectedLead.propertyName}</h3>
//                                         <button
//                                             onClick={() => setSelectedLead(null)}
//                                             className="text-gray-400 hover:text-gray-600"
//                                         >
//                                             <X className="h-6 w-6" />
//                                         </button>
//                                     </div>
//                                 </div>

//                                 <div className="p-4 overflow-y-auto max-h-96">
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                         <div>
//                                             <h4 className="font-medium text-gray-900 mb-2">Property Details</h4>
//                                             <div className="space-y-2 text-sm">
//                                                 <div className="flex justify-between">
//                                                     <span className="text-gray-600">Type:</span>
//                                                     <span className="font-medium">{selectedLead.type}</span>
//                                                 </div>
//                                                 <div className="flex justify-between">
//                                                     <span className="text-gray-600">Status:</span>
//                                                     <span className={`font-medium ${selectedLead.isCrossed ? 'text-red-600' : 'text-green-600'}`}>
//                                                         {selectedLead.isCrossed ? 'Crossed' : 'Active'}
//                                                     </span>
//                                                 </div>
//                                                 {selectedLead.askingPrice && (
//                                                     <div className="flex justify-between">
//                                                         <span className="text-gray-600">Price:</span>
//                                                         <span className="font-semibold text-green-600">
//                                                             {formatCurrency(selectedLead.askingPrice)}
//                                                         </span>
//                                                     </div>
//                                                 )}
//                                                 <div className="flex justify-between">
//                                                     <span className="text-gray-600">Added:</span>
//                                                     <span className="font-medium">{formatDate(selectedLead.createdAt)}</span>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         <div>
//                                             <h4 className="font-medium text-gray-900 mb-2">Owner Information</h4>
//                                             <div className="space-y-2 text-sm">
//                                                 {selectedLead.ownerName && (
//                                                     <div className="flex items-center">
//                                                         <User className="h-4 w-4 mr-2 text-gray-400" />
//                                                         <span>{selectedLead.ownerName}</span>
//                                                     </div>
//                                                 )}
//                                                 {selectedLead.ownerContact && (
//                                                     <div className="flex items-center">
//                                                         <Phone className="h-4 w-4 mr-2 text-gray-400" />
//                                                         <span>{selectedLead.ownerContact}</span>
//                                                     </div>
//                                                 )}
//                                                 {selectedLead.salesman && (
//                                                     <div className="mt-3">
//                                                         <p className="text-gray-600 text-xs mb-1">Salesman:</p>
//                                                         <p className="font-medium">{selectedLead.salesman.name}</p>
//                                                         <p className="text-xs text-gray-500">{selectedLead.salesman.email}</p>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {selectedLead.images && selectedLead.images.length > 0 && (
//                                         <div className="mt-6">
//                                             <h4 className="font-medium text-gray-900 mb-2">Images</h4>
//                                             <div className="grid grid-cols-2 gap-2">
//                                                 {selectedLead.images.slice(0, 4).map((image, index) => (
//                                                     <img
//                                                         key={index}
//                                                         src={image.url}
//                                                         alt={image.caption || `Property image ${index + 1}`}
//                                                         className="w-full h-24 object-cover rounded"
//                                                     />
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Lasso;

/* 07/08 updated */
import React, { useState, useEffect, useRef } from 'react';
import {
    MapPin,
    Filter,
    Search,
    Target,
    TrendingUp,
    Building,
    Users,
    DollarSign,
    PieChart,
    Lightbulb,
    X,
    Eye,
    EyeOff,
    Layers,
    RefreshCw,
    AlertCircle,
    CheckCircle,
    Phone,
    User,
    Calendar,
    Loader
} from 'lucide-react';
import { base_url } from '../utils/base_url';

const API_BASE_URL = base_url;

// Property colors will be populated dynamically
const PROPERTY_COLORS = {};

// Utility function for point-in-polygon calculation
const isPointInPolygon = (point, polygon) => {
    const x = point.latitude;
    const y = point.longitude;
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].lat;
        const yi = polygon[i].lng;
        const xj = polygon[j].lat;
        const yj = polygon[j].lng;

        if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
            inside = !inside;
        }
    }

    return inside;
};

// Format currency
const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

// Format date
const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

function Lasso() {
    // State management
    const [leads, setLeads] = useState([]);
    const [filteredLeads, setFilteredLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [propertyNames, setPropertyNames] = useState([]);
    const [propertyNamesLoaded, setPropertyNamesLoaded] = useState(false);

    console.log("leads", leads);

    // Area selection state
    const [selectedArea, setSelectedArea] = useState(null);
    const [leadsInArea, setLeadsInArea] = useState([]);
    const [leadsOutsideArea, setLeadsOutsideArea] = useState([]);
    const [missingProperties, setMissingProperties] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);

    // UI state
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProperty, setSelectedProperty] = useState('');
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const [visibleProperties, setVisibleProperties] = useState(new Set());
    const [showOnlyActive, setShowOnlyActive] = useState(false);

    // Map references
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const drawingManager = useRef(null);
    const markersRef = useRef([]);
    const infoWindow = useRef(null);

    // Extract unique property names from leads data
    const updatePropertyNames = (leadsData) => {
        const uniquePropertyNames = [...new Set(leadsData.map(lead => lead.propertyName).filter(Boolean))];
        const sortedPropertyNames = uniquePropertyNames.sort();
        setPropertyNames(sortedPropertyNames);
        setVisibleProperties(new Set(sortedPropertyNames));
        setPropertyNamesLoaded(true);

        // Update PROPERTY_COLORS for new property names
        sortedPropertyNames.forEach((propertyName, index) => {
            if (!PROPERTY_COLORS[propertyName]) {
                const colors = ['#3B82F6', '#EF4444', '#F97316', '#10B981', '#8B5CF6', '#F59E0B', '#6366F1', '#84CC16', '#EC4899', '#14B8A6'];
                PROPERTY_COLORS[propertyName] = colors[index % colors.length];
            }
        });
    };

    // Fetch leads from API
    const fetchLeads = async () => {
        try {
            setLoading(true);
            setError(null);

            // Build headers conditionally
            const headers = {
                'Content-Type': 'application/json'
            };

            // Add authorization header if token exists
            const token = localStorage.getItem('token');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_BASE_URL}/api/salesman/commercial/leads`, { headers });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Authentication required. Please log in.');
                } else if (response.status === 403) {
                    throw new Error('Access denied. Insufficient permissions.');
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            }

            const result = await response.json();

            // Handle different possible response structures
            if (result.success === 'true' || result.success === true) {
                const leadsData = result.data?.leads || result.data || [];
                setLeads(leadsData);
                setFilteredLeads(leadsData);
                updatePropertyNames(leadsData);
            } else if (Array.isArray(result)) {
                // Direct array response
                setLeads(result);
                setFilteredLeads(result);
                updatePropertyNames(result);
            } else if (result.data && Array.isArray(result.data)) {
                setLeads(result.data);
                setFilteredLeads(result.data);
                updatePropertyNames(result.data);
            } else {
                throw new Error(result.msg || result.message || 'Failed to fetch leads');
            }
        } catch (err) {
            console.error('Error fetching leads:', err);
            setError(err.message);

            // Set empty arrays on error to prevent crashes
            setLeads([]);
            setFilteredLeads([]);
        } finally {
            setLoading(false);
        }
    };

    // Add a retry mechanism for map initialization
    const retryMapInitialization = () => {
        let retryCount = 0;
        const maxRetries = 10;

        const tryInit = () => {
            if (window.google && window.google.maps && window.google.maps.drawing) {
                initializeMap();
            } else if (retryCount < maxRetries) {
                retryCount++;
                setTimeout(tryInit, 500);
            } else {
                setError('Failed to initialize Google Maps. Please refresh the page.');
            }
        };

        tryInit();
    };

    // Update the useEffect to use retry mechanism
    useEffect(() => {
        // Wait a bit for Google Maps to be fully loaded
        setTimeout(() => {
            if (window.google && window.google.maps && window.google.maps.drawing) {
                initializeMap();
            } else {
                retryMapInitialization();
            }
        }, 100);

        // Initial data fetch
        fetchLeads();
    }, []);

    // Add effect to reinitialize map if it becomes available later
    useEffect(() => {
        const checkGoogleMaps = () => {
            if (window.google && window.google.maps && window.google.maps.drawing && !mapInstance.current) {
                initializeMap();
            }
        };

        // Check periodically if Google Maps becomes available
        const interval = setInterval(checkGoogleMaps, 1000);

        // Clean up interval after 30 seconds
        setTimeout(() => clearInterval(interval), 30000);

        return () => clearInterval(interval);
    }, []);

    // Initialize Google Maps
    const initializeMap = () => {
        if (!window.google || !window.google.maps || !mapRef.current) {
            console.log('Google Maps not ready yet, retrying...');
            setTimeout(initializeMap, 100);
            return;
        }

        const map = new window.google.maps.Map(mapRef.current, {
            center: { lat: 26.4804247, lng: 80.29115589999999 }, // Default to NYC
            zoom: 12,
            mapTypeId: 'roadmap',
            styles: [
                {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [{ visibility: 'off' }]
                }
            ]
        });

        const drawing = new window.google.maps.drawing.DrawingManager({
            drawingMode: null,
            drawingControl: false,
            polygonOptions: {
                fillColor: '#3B82F6',
                fillOpacity: 0.2,
                strokeColor: '#3B82F6',
                strokeWeight: 2,
                clickable: false,
                editable: false
            }
        });

        drawing.setMap(map);

        // Handle polygon completion
        drawing.addListener('polygoncomplete', (polygon) => {
            const path = polygon.getPath();
            const coordinates = [];

            for (let i = 0; i < path.getLength(); i++) {
                const point = path.getAt(i);
                coordinates.push({
                    lat: point.lat(),
                    lng: point.lng()
                });
            }

            setSelectedArea(coordinates);
            setIsDrawing(false);
            drawing.setDrawingMode(null);
        });

        // Create info window
        infoWindow.current = new window.google.maps.InfoWindow();

        mapInstance.current = map;
        drawingManager.current = drawing;
    };

    // Filter leads based on search and filters
    useEffect(() => {
        let filtered = leads.filter(lead => {
            const matchesSearch = !searchTerm ||
                lead.propertyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lead.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lead.ownerContact?.includes(searchTerm);

            const matchesProperty = !selectedProperty || lead.propertyName === selectedProperty;
            const matchesVisibility = visibleProperties.has(lead.propertyName);
            const matchesActive = !showOnlyActive || !lead.isCrossed;

            return matchesSearch && matchesProperty && matchesVisibility && matchesActive;
        });

        setFilteredLeads(filtered);
    }, [leads, searchTerm, selectedProperty, visibleProperties, showOnlyActive]);

    // Update map markers
    useEffect(() => {
        if (!mapInstance.current) return;

        // Clear existing markers
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        // Create new markers
        filteredLeads.forEach(lead => {
            if (!lead.location?.latitude || !lead.location?.longitude) return;

            const marker = new window.google.maps.Marker({
                position: {
                    lat: lead.location.latitude,
                    lng: lead.location.longitude
                },
                map: mapInstance.current,
                title: lead.propertyName,
                icon: {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: lead.isCrossed ? 6 : 8,
                    fillColor: PROPERTY_COLORS[lead.propertyName] || '#6B7280',
                    fillOpacity: lead.isCrossed ? 0.4 : 0.9,
                    strokeColor: '#FFFFFF',
                    strokeWeight: 2
                }
            });

            marker.addListener('click', () => {
                setSelectedLead(lead);

                const content = `
          <div class="p-3 max-w-sm">
            <h3 class="font-bold text-lg text-gray-900">${lead.propertyName}</h3>
            <p class="text-sm text-gray-600 mt-1">Property: ${lead.propertyName}</p>
            ${lead.ownerName ? `<p class="text-sm text-gray-600">Owner: ${lead.ownerName}</p>` : ''}
            ${lead.askingPrice ? `<p class="text-sm font-semibold text-green-600 mt-2">${formatCurrency(lead.askingPrice)}</p>` : ''}
            <p class="text-xs text-gray-500 mt-2">Added: ${formatDate(lead.createdAt)}</p>
            ${lead.isCrossed ? '<span class="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded mt-2">Crossed</span>' : '<span class="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded mt-2">Active</span>'}
          </div>
        `;

                infoWindow.current.setContent(content);
                infoWindow.current.open(mapInstance.current, marker);
            });

            markersRef.current.push(marker);
        });
    }, [filteredLeads]);

    // Analyze selected area
    useEffect(() => {
        if (!selectedArea || selectedArea.length < 3) {
            setLeadsInArea([]);
            setLeadsOutsideArea([]);
            setMissingProperties([]);
            return;
        }

        const inside = [];
        const outside = [];

        leads.forEach(lead => {
            if (lead.location?.latitude && lead.location?.longitude) {
                if (isPointInPolygon(lead.location, selectedArea)) {
                    inside.push(lead);
                } else {
                    outside.push(lead);
                }
            }
        });

        setLeadsInArea(inside);
        setLeadsOutsideArea(outside);

        // Find missing property names based on actual data
        const propertiesInArea = new Set(inside.map(lead => lead.propertyName));
        const missing = propertyNames.filter(propertyName => !propertiesInArea.has(propertyName));
        setMissingProperties(missing);

        if (inside.length > 0 || missing.length > 0) {
            setShowAnalytics(true);
        }
    }, [selectedArea, leads, propertyNames]);

    // Event handlers
    const startDrawing = () => {
        if (drawingManager.current && window.google && window.google.maps) {
            setIsDrawing(true);
            drawingManager.current.setDrawingMode(window.google.maps.drawing.OverlayType.POLYGON);
        } else {
            setError('Drawing tools not available. Please refresh the page.');
        }
    };

    const clearSelection = () => {
        setSelectedArea(null);
        setLeadsInArea([]);
        setLeadsOutsideArea([]);
        setMissingProperties([]);
        setShowAnalytics(false);
        setIsDrawing(false);

        if (drawingManager.current && mapInstance.current) {
            drawingManager.current.setMap(null);
            drawingManager.current.setMap(mapInstance.current);
        }
    };

    const togglePropertyVisibility = (propertyName) => {
        const newVisibleProperties = new Set(visibleProperties);
        if (newVisibleProperties.has(propertyName)) {
            newVisibleProperties.delete(propertyName);
        } else {
            newVisibleProperties.add(propertyName);
        }
        setVisibleProperties(newVisibleProperties);
    };

    // Get leads of missing properties from outside the area
    const getMissingPropertyLeads = (missingPropertyName) => {
        return leadsOutsideArea.filter(lead => lead.propertyName === missingPropertyName);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading commercial leads...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={fetchLeads}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Building className="h-8 w-8 text-blue-600" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Commercial Leads Analyzer</h1>
                            <p className="text-sm text-gray-600">Identify opportunities in selected areas</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-600">
                            <span className="font-semibold">{leads.length}</span> Total Leads
                        </div>
                        <button
                            onClick={fetchLeads}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            title="Refresh Data"
                        >
                            <RefreshCw className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex">
                {/* Sidebar */}
                <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                    {/* Search and Filters */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Search leads..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            <select
                                value={selectedProperty}
                                onChange={(e) => setSelectedProperty(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={!propertyNamesLoaded}
                            >
                                <option value="">
                                    {propertyNamesLoaded ? 'All Property Names' : 'Loading properties...'}
                                </option>
                                {propertyNames.map(propertyName => (
                                    <option key={propertyName} value={propertyName}>{propertyName}</option>
                                ))}
                            </select>

                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={showOnlyActive}
                                    onChange={(e) => setShowOnlyActive(e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">Show only active leads</span>
                            </label>
                        </div>
                    </div>

                    {/* Area Selection Tools */}
                    <div className="p-4 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-3">Area Selection</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={startDrawing}
                                disabled={isDrawing}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isDrawing
                                    ? 'bg-blue-100 text-blue-700 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                            >
                                <Target className="h-4 w-4 inline mr-1" />
                                {isDrawing ? 'Drawing...' : 'Draw Area'}
                            </button>

                            <button
                                onClick={clearSelection}
                                disabled={!selectedArea}
                                className="px-3 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                <X className="h-4 w-4 inline mr-1" />
                                Clear
                            </button>
                        </div>

                        {isDrawing && (
                            <p className="mt-2 text-xs text-blue-600">
                                Click on the map to draw a polygon around your target area
                            </p>
                        )}
                    </div>

                    {/* Property Names Legend */}
                    <div className="p-4 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-3">Property Names</h3>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {propertyNames.length > 0 ? (
                                propertyNames.map(propertyName => {
                                    const count = leads.filter(lead => lead.propertyName === propertyName).length;
                                    const isVisible = visibleProperties.has(propertyName);

                                    return (
                                        <div key={propertyName} className="flex items-center justify-between">
                                            <button
                                                onClick={() => togglePropertyVisibility(propertyName)}
                                                className="flex items-center flex-1 text-left"
                                            >
                                                <div
                                                    className="w-3 h-3 rounded-full mr-2"
                                                    style={{ backgroundColor: PROPERTY_COLORS[propertyName] }}
                                                />
                                                <span className={`text-sm ${isVisible ? 'text-gray-900' : 'text-gray-400'}`}>
                                                    {propertyName}
                                                </span>
                                                {isVisible ? (
                                                    <Eye className="h-3 w-3 ml-1 text-gray-400" />
                                                ) : (
                                                    <EyeOff className="h-3 w-3 ml-1 text-gray-400" />
                                                )}
                                            </button>
                                            <span className="text-xs text-gray-500">{count}</span>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-sm text-gray-500 text-center py-2">
                                    {propertyNamesLoaded ? 'No properties found' : 'Loading...'}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Quick Stats</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Total Leads</span>
                                <span className="text-sm font-semibold">{leads.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Active Leads</span>
                                <span className="text-sm font-semibold text-green-600">
                                    {leads.filter(lead => !lead.isCrossed).length}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Crossed Leads</span>
                                <span className="text-sm font-semibold text-red-600">
                                    {leads.filter(lead => lead.isCrossed).length}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Property Names</span>
                                <span className="text-sm font-semibold">
                                    {propertyNames.length}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 relative">
                    {/* Map */}
                    <div ref={mapRef} className="absolute inset-0" />

                    {/* Map Loading Indicator */}
                    {!mapInstance.current && (
                        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                            <div className="text-center">
                                <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                                <p className="text-gray-600">Loading Google Maps...</p>
                            </div>
                        </div>
                    )}

                    {/* Analytics Panel */}
                    {showAnalytics && (
                        <div className="absolute top-4 right-4 w-96 bg-white rounded-lg shadow-lg max-h-[calc(100vh-200px)] overflow-hidden">
                            <div className="p-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-gray-900 flex items-center">
                                        <PieChart className="h-5 w-5 mr-2 text-blue-600" />
                                        Area Analysis
                                    </h3>
                                    <button
                                        onClick={() => setShowAnalytics(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 overflow-y-auto max-h-96">
                                {/* Leads in Area */}
                                <div className="mb-6">
                                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                        Leads in Selected Area ({leadsInArea.length})
                                    </h4>

                                    {leadsInArea.length > 0 ? (
                                        <div className="space-y-2 max-h-40 overflow-y-auto">
                                            {leadsInArea.map(lead => (
                                                <div key={lead._id} className="p-2 bg-green-50 rounded border-l-4 border-green-400">
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <p className="font-medium text-sm text-gray-900">{lead.propertyName}</p>
                                                            <p className="text-xs text-gray-600">{lead.propertyName}</p>
                                                            {lead.ownerName && (
                                                                <p className="text-xs text-gray-600 flex items-center mt-1">
                                                                    <User className="h-3 w-3 mr-1" />
                                                                    {lead.ownerName}
                                                                </p>
                                                            )}
                                                            {lead.ownerContact && (
                                                                <p className="text-xs text-gray-600 flex items-center">
                                                                    <Phone className="h-3 w-3 mr-1" />
                                                                    {lead.ownerContact}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="text-right">
                                                            {lead.askingPrice && (
                                                                <p className="text-xs font-semibold text-green-600">
                                                                    {formatCurrency(lead.askingPrice)}
                                                                </p>
                                                            )}
                                                            <p className="text-xs text-gray-500">
                                                                {formatDate(lead.createdAt)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500">No leads found in selected area</p>
                                    )}
                                </div>

                                {/* Missing Opportunities */}
                                <div className="mb-6">
                                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                                        <Lightbulb className="h-4 w-4 mr-2 text-yellow-600" />
                                        Missing Opportunities ({missingProperties.length})
                                    </h4>

                                    {missingProperties.length > 0 ? (
                                        <div className="space-y-3">
                                            {missingProperties.map(propertyName => {
                                                const availableLeads = getMissingPropertyLeads(propertyName);
                                                return (
                                                    <div key={propertyName} className="p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
                                                        <div className="flex items-center mb-2">
                                                            <div
                                                                className="w-3 h-3 rounded-full mr-2"
                                                                style={{ backgroundColor: PROPERTY_COLORS[propertyName] }}
                                                            />
                                                            <span className="font-medium text-sm text-gray-900">{propertyName}</span>
                                                        </div>
                                                        <p className="text-xs text-gray-600 mb-2">
                                                            Available leads outside area: {availableLeads.length}
                                                        </p>
                                                        {availableLeads.length > 0 && (
                                                            <div className="space-y-1">
                                                                {availableLeads.slice(0, 2).map(lead => (
                                                                    <div key={lead._id} className="text-xs text-gray-700 bg-yellow-100 p-1 rounded">
                                                                        {lead.propertyName}
                                                                        {lead.askingPrice && ` - ${formatCurrency(lead.askingPrice)}`}
                                                                    </div>
                                                                ))}
                                                                {availableLeads.length > 2 && (
                                                                    <p className="text-xs text-gray-600">
                                                                        +{availableLeads.length - 2} more available
                                                                    </p>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500">All property names are represented in this area</p>
                                    )}
                                </div>

                                {/* Area Summary */}
                                <div className="pt-4 border-t border-gray-200">
                                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                                        <TrendingUp className="h-4 w-4 mr-2 text-blue-600" />
                                        Area Summary
                                    </h4>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-600">Total Properties</p>
                                            <p className="font-semibold">{leadsInArea.length}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Property Names</p>
                                            <p className="font-semibold">{new Set(leadsInArea.map(l => l.propertyName)).size}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Active Leads</p>
                                            <p className="font-semibold text-green-600">
                                                {leadsInArea.filter(l => !l.isCrossed).length}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Avg. Price</p>
                                            <p className="font-semibold">
                                                {formatCurrency(
                                                    leadsInArea.reduce((sum, lead) => sum + (lead.askingPrice || 0), 0) / leadsInArea.length
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Lead Details Modal */}
                    {selectedLead && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
                                <div className="p-4 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-lg text-gray-900">{selectedLead.propertyName}</h3>
                                        <button
                                            onClick={() => setSelectedLead(null)}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <X className="h-6 w-6" />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4 overflow-y-auto max-h-96">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-2">Property Details</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Property Name:</span>
                                                    <span className="font-medium">{selectedLead.propertyName}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Status:</span>
                                                    <span className={`font-medium ${selectedLead.isCrossed ? 'text-red-600' : 'text-green-600'}`}>
                                                        {selectedLead.isCrossed ? 'Crossed' : 'Active'}
                                                    </span>
                                                </div>
                                                {selectedLead.askingPrice && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Price:</span>
                                                        <span className="font-semibold text-green-600">
                                                            {formatCurrency(selectedLead.askingPrice)}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Added:</span>
                                                    <span className="font-medium">{formatDate(selectedLead.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-2">Owner Information</h4>
                                            <div className="space-y-2 text-sm">
                                                {selectedLead.ownerName && (
                                                    <div className="flex items-center">
                                                        <User className="h-4 w-4 mr-2 text-gray-400" />
                                                        <span>{selectedLead.ownerName}</span>
                                                    </div>
                                                )}
                                                {selectedLead.ownerContact && (
                                                    <div className="flex items-center">
                                                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                                        <span>{selectedLead.ownerContact}</span>
                                                    </div>
                                                )}
                                                {selectedLead.salesman && (
                                                    <div className="mt-3">
                                                        <p className="text-gray-600 text-xs mb-1">Salesman:</p>
                                                        <p className="font-medium">{selectedLead.salesman.name}</p>
                                                        <p className="text-xs text-gray-500">{selectedLead.salesman.email}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {selectedLead.images && selectedLead.images.length > 0 && (
                                        <div className="mt-6">
                                            <h4 className="font-medium text-gray-900 mb-2">Images</h4>
                                            <div className="grid grid-cols-2 gap-2">
                                                {selectedLead.images.slice(0, 4).map((image, index) => (
                                                    <img
                                                        key={index}
                                                        src={image.url}
                                                        alt={image.caption || `Property image ${index + 1}`}
                                                        className="w-full h-24 object-cover rounded"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Lasso;



/* 08/08 updated */
// import React, { useState, useEffect, useRef } from 'react';
// import {
//     MapPin,
//     Filter,
//     Search,
//     Target,
//     TrendingUp,
//     Building,
//     Users,
//     DollarSign,
//     PieChart,
//     Lightbulb,
//     X,
//     Eye,
//     EyeOff,
//     Layers,
//     RefreshCw,
//     AlertCircle,
//     CheckCircle,
//     Phone,
//     User,
//     Calendar,
//     Loader
// } from 'lucide-react';
// import { base_url } from '../utils/base_url';

// const API_BASE_URL = base_url;

// // Property colors will be populated dynamically
// const PROPERTY_COLORS = {};

// // Utility function for point-in-polygon calculation
// const isPointInPolygon = (point, polygon) => {
//     const x = point.latitude;
//     const y = point.longitude;
//     let inside = false;

//     for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
//         const xi = polygon[i].lat;
//         const yi = polygon[i].lng;
//         const xj = polygon[j].lat;
//         const yj = polygon[j].lng;

//         if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
//             inside = !inside;
//         }
//     }

//     return inside;
// };

// // Function to remove loops and ensure proper polygon
// const processLassoPath = (points) => {
//     if (points.length < 3) return points;

//     // Remove consecutive duplicate points
//     const cleanedPoints = [];
//     for (let i = 0; i < points.length; i++) {
//         const current = points[i];
//         const next = points[(i + 1) % points.length];

//         // Check if points are significantly different (avoid micro-movements)
//         const distance = Math.sqrt(
//             Math.pow(current.lat - next.lat, 2) + Math.pow(current.lng - next.lng, 2)
//         );

//         if (distance > 0.0001 || i === points.length - 1) { // ~11 meters threshold
//             cleanedPoints.push(current);
//         }
//     }

//     // Remove self-intersections to prevent loops
//     const processedPoints = removeSelfIntersections(cleanedPoints);

//     return processedPoints.length >= 3 ? processedPoints : cleanedPoints;
// };

// // Function to detect and remove self-intersections
// const removeSelfIntersections = (points) => {
//     if (points.length < 4) return points;

//     const result = [...points];

//     for (let i = 0; i < result.length - 2; i++) {
//         for (let j = i + 2; j < result.length; j++) {
//             // Don't check adjacent segments or the closing segment
//             if (j === result.length - 1 && i === 0) continue;

//             const intersection = getLineIntersection(
//                 result[i], result[(i + 1) % result.length],
//                 result[j], result[(j + 1) % result.length]
//             );

//             if (intersection) {
//                 // Remove the loop by keeping the outer path
//                 const segment1Length = i + 1;
//                 const segment2Length = result.length - j;

//                 if (segment1Length < segment2Length) {
//                     // Keep the longer segment
//                     result.splice(i + 1, j - i);
//                 } else {
//                     // Keep the first segment and continue from intersection
//                     result.splice(i + 1, j - i);
//                 }

//                 // Restart the process with modified array
//                 return removeSelfIntersections(result);
//             }
//         }
//     }

//     return result;
// };

// // Function to find intersection between two line segments
// const getLineIntersection = (p1, p2, p3, p4) => {
//     const denom = (p1.lat - p2.lat) * (p3.lng - p4.lng) - (p1.lng - p2.lng) * (p3.lat - p4.lat);

//     if (Math.abs(denom) < 1e-10) return null; // Lines are parallel

//     const t = ((p1.lat - p3.lat) * (p3.lng - p4.lng) - (p1.lng - p3.lng) * (p3.lat - p4.lat)) / denom;
//     const u = -((p1.lat - p2.lat) * (p1.lng - p3.lng) - (p1.lng - p2.lng) * (p1.lat - p3.lat)) / denom;

//     if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
//         return {
//             lat: p1.lat + t * (p2.lat - p1.lat),
//             lng: p1.lng + t * (p2.lng - p1.lng)
//         };
//     }

//     return null;
// };

// // Format currency
// const formatCurrency = (amount) => {
//     if (!amount) return 'N/A';
//     return new Intl.NumberFormat('en-US', {
//         style: 'currency',
//         currency: 'USD',
//         minimumFractionDigits: 0,
//         maximumFractionDigits: 0,
//     }).format(amount);
// };

// // Format date
// const formatDate = (date) => {
//     return new Date(date).toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//     });
// };

// function Lasso() {
//     // State management
//     const [leads, setLeads] = useState([]);
//     const [filteredLeads, setFilteredLeads] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [propertyNames, setPropertyNames] = useState([]);
//     const [propertyNamesLoaded, setPropertyNamesLoaded] = useState(false);

//     console.log("leads", leads);

//     // Area selection state
//     const [selectedArea, setSelectedArea] = useState(null);
//     const [leadsInArea, setLeadsInArea] = useState([]);
//     const [leadsOutsideArea, setLeadsOutsideArea] = useState([]);
//     const [missingProperties, setMissingProperties] = useState([]);
//     const [isDrawing, setIsDrawing] = useState(false);

//     // UI state
//     const [searchTerm, setSearchTerm] = useState('');
//     const [selectedProperty, setSelectedProperty] = useState('');
//     const [showAnalytics, setShowAnalytics] = useState(false);
//     const [selectedLead, setSelectedLead] = useState(null);
//     const [visibleProperties, setVisibleProperties] = useState(new Set());
//     const [showOnlyActive, setShowOnlyActive] = useState(false);

//     // Map references
//     const mapRef = useRef(null);
//     const mapInstance = useRef(null);
//     const drawingManager = useRef(null);
//     const markersRef = useRef([]);
//     const infoWindow = useRef(null);

//     // Lasso drawing state
//     const currentPath = useRef([]);
//     const currentPolygon = useRef(null);
//     const isMouseDown = useRef(false);

//     // Extract unique property names from leads data
//     const updatePropertyNames = (leadsData) => {
//         const uniquePropertyNames = [...new Set(leadsData.map(lead => lead.propertyName).filter(Boolean))];
//         const sortedPropertyNames = uniquePropertyNames.sort();
//         setPropertyNames(sortedPropertyNames);
//         setVisibleProperties(new Set(sortedPropertyNames));
//         setPropertyNamesLoaded(true);

//         // Update PROPERTY_COLORS for new property names
//         sortedPropertyNames.forEach((propertyName, index) => {
//             if (!PROPERTY_COLORS[propertyName]) {
//                 const colors = ['#3B82F6', '#EF4444', '#F97316', '#10B981', '#8B5CF6', '#F59E0B', '#6366F1', '#84CC16', '#EC4899', '#14B8A6'];
//                 PROPERTY_COLORS[propertyName] = colors[index % colors.length];
//             }
//         });
//     };

//     // Fetch leads from API
//     const fetchLeads = async () => {
//         try {
//             setLoading(true);
//             setError(null);

//             // Build headers conditionally
//             const headers = {
//                 'Content-Type': 'application/json'
//             };

//             // Add authorization header if token exists
//             const token = localStorage.getItem('token');
//             if (token) {
//                 headers['Authorization'] = `Bearer ${token}`;
//             }

//             const response = await fetch(`${API_BASE_URL}/api/salesman/commercial/leads`, { headers });

//             if (!response.ok) {
//                 if (response.status === 401) {
//                     throw new Error('Authentication required. Please log in.');
//                 } else if (response.status === 403) {
//                     throw new Error('Access denied. Insufficient permissions.');
//                 } else {
//                     throw new Error(`HTTP error! status: ${response.status}`);
//                 }
//             }

//             const result = await response.json();

//             // Handle different possible response structures
//             if (result.success === 'true' || result.success === true) {
//                 const leadsData = result.data?.leads || result.data || [];
//                 setLeads(leadsData);
//                 setFilteredLeads(leadsData);
//                 updatePropertyNames(leadsData);
//             } else if (Array.isArray(result)) {
//                 // Direct array response
//                 setLeads(result);
//                 setFilteredLeads(result);
//                 updatePropertyNames(result);
//             } else if (result.data && Array.isArray(result.data)) {
//                 setLeads(result.data);
//                 setFilteredLeads(result.data);
//                 updatePropertyNames(result.data);
//             } else {
//                 throw new Error(result.msg || result.message || 'Failed to fetch leads');
//             }
//         } catch (err) {
//             console.error('Error fetching leads:', err);
//             setError(err.message);

//             // Set empty arrays on error to prevent crashes
//             setLeads([]);
//             setFilteredLeads([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Add a retry mechanism for map initialization
//     const retryMapInitialization = () => {
//         let retryCount = 0;
//         const maxRetries = 10;

//         const tryInit = () => {
//             if (window.google && window.google.maps && window.google.maps.drawing) {
//                 initializeMap();
//             } else if (retryCount < maxRetries) {
//                 retryCount++;
//                 setTimeout(tryInit, 500);
//             } else {
//                 setError('Failed to initialize Google Maps. Please refresh the page.');
//             }
//         };

//         tryInit();
//     };

//     // Update the useEffect to use retry mechanism
//     useEffect(() => {
//         // Wait a bit for Google Maps to be fully loaded
//         setTimeout(() => {
//             if (window.google && window.google.maps && window.google.maps.drawing) {
//                 initializeMap();
//             } else {
//                 retryMapInitialization();
//             }
//         }, 100);

//         // Initial data fetch
//         fetchLeads();
//     }, []);

//     // Add effect to reinitialize map if it becomes available later
//     useEffect(() => {
//         const checkGoogleMaps = () => {
//             if (window.google && window.google.maps && window.google.maps.drawing && !mapInstance.current) {
//                 initializeMap();
//             }
//         };

//         // Check periodically if Google Maps becomes available
//         const interval = setInterval(checkGoogleMaps, 1000);

//         // Clean up interval after 30 seconds
//         setTimeout(() => clearInterval(interval), 30000);

//         return () => clearInterval(interval);
//     }, []);

//     // Initialize Google Maps with custom lasso functionality
//     const initializeMap = () => {
//         if (!window.google || !window.google.maps || !mapRef.current) {
//             console.log('Google Maps not ready yet, retrying...');
//             setTimeout(initializeMap, 100);
//             return;
//         }

//         const map = new window.google.maps.Map(mapRef.current, {
//             center: { lat: 26.4804247, lng: 80.29115589999999 },
//             zoom: 12,
//             mapTypeId: 'roadmap',
//             styles: [
//                 {
//                     featureType: 'poi',
//                     elementType: 'labels',
//                     stylers: [{ visibility: 'off' }]
//                 }
//             ]
//         });

//         // Set up custom lasso drawing
//         setupLassoDrawing(map);

//         // Create info window
//         infoWindow.current = new window.google.maps.InfoWindow();

//         mapInstance.current = map;
//     };

//     // Setup custom lasso drawing functionality
//     const setupLassoDrawing = (map) => {
//         let isLassoMode = false;

//         // Mouse down event - start drawing
//         const handleMouseDown = (e) => {
//             if (!isLassoMode) return;

//             isMouseDown.current = true;
//             currentPath.current = [];

//             const point = {
//                 lat: e.latLng.lat(),
//                 lng: e.latLng.lng()
//             };

//             currentPath.current.push(point);
//             setIsDrawing(true);

//             // Remove existing polygon if any
//             if (currentPolygon.current) {
//                 currentPolygon.current.setMap(null);
//                 currentPolygon.current = null;
//             }
//         };

//         // Mouse move event - continue drawing
//         const handleMouseMove = (e) => {
//             if (!isLassoMode || !isMouseDown.current) return;

//             const point = {
//                 lat: e.latLng.lat(),
//                 lng: e.latLng.lng()
//             };

//             currentPath.current.push(point);

//             // Create/update temporary polygon for visual feedback
//             if (currentPolygon.current) {
//                 currentPolygon.current.setMap(null);
//             }

//             if (currentPath.current.length > 2) {
//                 // Close the polygon by connecting to start point for preview
//                 const previewPath = [...currentPath.current, currentPath.current[0]];

//                 currentPolygon.current = new window.google.maps.Polygon({
//                     paths: previewPath,
//                     fillColor: '#3B82F6',
//                     fillOpacity: 0.2,
//                     strokeColor: '#3B82F6',
//                     strokeWeight: 2,
//                     strokeOpacity: 0.8
//                 });

//                 currentPolygon.current.setMap(map);
//             }
//         };

//         // Mouse up event - finish drawing
//         const handleMouseUp = (e) => {
//             if (!isLassoMode || !isMouseDown.current) return;

//             isMouseDown.current = false;
//             setIsDrawing(false);

//             if (currentPath.current.length < 3) {
//                 // Not enough points for a polygon
//                 if (currentPolygon.current) {
//                     currentPolygon.current.setMap(null);
//                     currentPolygon.current = null;
//                 }
//                 currentPath.current = [];
//                 return;
//             }

//             // Process the lasso path to remove loops and ensure proper polygon
//             const processedPath = processLassoPath(currentPath.current);

//             // Create final polygon
//             if (currentPolygon.current) {
//                 currentPolygon.current.setMap(null);
//             }

//             currentPolygon.current = new window.google.maps.Polygon({
//                 paths: processedPath,
//                 fillColor: '#3B82F6',
//                 fillOpacity: 0.2,
//                 strokeColor: '#3B82F6',
//                 strokeWeight: 2,
//                 clickable: false,
//                 editable: false
//             });

//             currentPolygon.current.setMap(map);

//             // Set selected area
//             setSelectedArea(processedPath);

//             // Exit lasso mode
//             isLassoMode = false;
//             map.setOptions({ draggable: true });
//         };

//         // Add event listeners
//         map.addListener('mousedown', handleMouseDown);
//         map.addListener('mousemove', handleMouseMove);
//         map.addListener('mouseup', handleMouseUp);

//         // Store the lasso mode toggle function
//         map.toggleLassoMode = () => {
//             isLassoMode = !isLassoMode;
//             if (isLassoMode) {
//                 map.setOptions({
//                     draggable: false,
//                     scrollwheel: false,
//                     disableDoubleClickZoom: true
//                 });
//                 mapRef.current.style.cursor = 'crosshair';
//             } else {
//                 map.setOptions({
//                     draggable: true,
//                     scrollwheel: true,
//                     disableDoubleClickZoom: false
//                 });
//                 mapRef.current.style.cursor = 'default';
//             }
//             return isLassoMode;
//         };
//     };

//     // Filter leads based on search and filters
//     useEffect(() => {
//         let filtered = leads.filter(lead => {
//             const matchesSearch = !searchTerm ||
//                 lead.propertyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 lead.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 lead.ownerContact?.includes(searchTerm);

//             const matchesProperty = !selectedProperty || lead.propertyName === selectedProperty;
//             const matchesVisibility = visibleProperties.has(lead.propertyName);
//             const matchesActive = !showOnlyActive || !lead.isCrossed;

//             return matchesSearch && matchesProperty && matchesVisibility && matchesActive;
//         });

//         setFilteredLeads(filtered);
//     }, [leads, searchTerm, selectedProperty, visibleProperties, showOnlyActive]);

//     // Update map markers
//     useEffect(() => {
//         if (!mapInstance.current) return;

//         // Clear existing markers
//         markersRef.current.forEach(marker => marker.setMap(null));
//         markersRef.current = [];

//         // Create new markers
//         filteredLeads.forEach(lead => {
//             if (!lead.location?.latitude || !lead.location?.longitude) return;

//             const marker = new window.google.maps.Marker({
//                 position: {
//                     lat: lead.location.latitude,
//                     lng: lead.location.longitude
//                 },
//                 map: mapInstance.current,
//                 title: lead.propertyName,
//                 icon: {
//                     path: window.google.maps.SymbolPath.CIRCLE,
//                     scale: lead.isCrossed ? 6 : 8,
//                     fillColor: PROPERTY_COLORS[lead.propertyName] || '#6B7280',
//                     fillOpacity: lead.isCrossed ? 0.4 : 0.9,
//                     strokeColor: '#FFFFFF',
//                     strokeWeight: 2
//                 }
//             });

//             marker.addListener('click', () => {
//                 setSelectedLead(lead);

//                 const content = `
//           <div class="p-3 max-w-sm">
//             <h3 class="font-bold text-lg text-gray-900">${lead.propertyName}</h3>
//             <p class="text-sm text-gray-600 mt-1">Property: ${lead.propertyName}</p>
//             ${lead.ownerName ? `<p class="text-sm text-gray-600">Owner: ${lead.ownerName}</p>` : ''}
//             ${lead.askingPrice ? `<p class="text-sm font-semibold text-green-600 mt-2">${formatCurrency(lead.askingPrice)}</p>` : ''}
//             <p class="text-xs text-gray-500 mt-2">Added: ${formatDate(lead.createdAt)}</p>
//             ${lead.isCrossed ? '<span class="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded mt-2">Crossed</span>' : '<span class="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded mt-2">Active</span>'}
//           </div>
//         `;

//                 infoWindow.current.setContent(content);
//                 infoWindow.current.open(mapInstance.current, marker);
//             });

//             markersRef.current.push(marker);
//         });
//     }, [filteredLeads]);

//     // Analyze selected area
//     useEffect(() => {
//         if (!selectedArea || selectedArea.length < 3) {
//             setLeadsInArea([]);
//             setLeadsOutsideArea([]);
//             setMissingProperties([]);
//             return;
//         }

//         const inside = [];
//         const outside = [];

//         leads.forEach(lead => {
//             if (lead.location?.latitude && lead.location?.longitude) {
//                 if (isPointInPolygon(lead.location, selectedArea)) {
//                     inside.push(lead);
//                 } else {
//                     outside.push(lead);
//                 }
//             }
//         });

//         setLeadsInArea(inside);
//         setLeadsOutsideArea(outside);

//         // Find missing property names based on actual data
//         const propertiesInArea = new Set(inside.map(lead => lead.propertyName));
//         const missing = propertyNames.filter(propertyName => !propertiesInArea.has(propertyName));
//         setMissingProperties(missing);

//         if (inside.length > 0 || missing.length > 0) {
//             setShowAnalytics(true);
//         }
//     }, [selectedArea, leads, propertyNames]);

//     // Event handlers
//     const startDrawing = () => {
//         if (mapInstance.current && mapInstance.current.toggleLassoMode) {
//             const isLassoActive = mapInstance.current.toggleLassoMode();
//             if (isLassoActive) {
//                 setError('Click and drag to draw a lasso selection area');
//                 setTimeout(() => setError(null), 3000);
//             }
//         } else {
//             setError('Lasso tool not available. Please refresh the page.');
//         }
//     };

//     const clearSelection = () => {
//         setSelectedArea(null);
//         setLeadsInArea([]);
//         setLeadsOutsideArea([]);
//         setMissingProperties([]);
//         setShowAnalytics(false);
//         setIsDrawing(false);

//         if (currentPolygon.current) {
//             currentPolygon.current.setMap(null);
//             currentPolygon.current = null;
//         }

//         if (mapInstance.current && mapRef.current) {
//             mapInstance.current.setOptions({
//                 draggable: true,
//                 scrollwheel: true,
//                 disableDoubleClickZoom: false
//             });
//             mapRef.current.style.cursor = 'default';
//         }
//     };

//     const togglePropertyVisibility = (propertyName) => {
//         const newVisibleProperties = new Set(visibleProperties);
//         if (newVisibleProperties.has(propertyName)) {
//             newVisibleProperties.delete(propertyName);
//         } else {
//             newVisibleProperties.add(propertyName);
//         }
//         setVisibleProperties(newVisibleProperties);
//     };

//     // Get leads of missing properties from outside the area
//     const getMissingPropertyLeads = (missingPropertyName) => {
//         return leadsOutsideArea.filter(lead => lead.propertyName === missingPropertyName);
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="text-center">
//                     <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
//                     <p className="text-gray-600">Loading commercial leads...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (error && !mapInstance.current) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="text-center">
//                     <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
//                     <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
//                     <p className="text-gray-600 mb-4">{error}</p>
//                     <button
//                         onClick={fetchLeads}
//                         className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                     >
//                         Try Again
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="h-screen bg-gray-50 flex flex-col">
//             {/* Header */}
//             <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
//                 <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-4">
//                         <Building className="h-8 w-8 text-blue-600" />
//                         <div>
//                             <h1 className="text-2xl font-bold text-gray-900">Commercial Leads Analyzer</h1>
//                             <p className="text-sm text-gray-600">Identify opportunities in selected areas</p>
//                         </div>
//                     </div>

//                     <div className="flex items-center space-x-4">
//                         <div className="text-sm text-gray-600">
//                             <span className="font-semibold">{leads.length}</span> Total Leads
//                         </div>
//                         <button
//                             onClick={fetchLeads}
//                             className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
//                             title="Refresh Data"
//                         >
//                             <RefreshCw className="h-5 w-5" />
//                         </button>
//                     </div>
//                 </div>
//             </header>

//             {error && mapInstance.current && (
//                 <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-3 text-sm">
//                     {error}
//                 </div>
//             )}

//             <div className="flex-1 flex">
//                 {/* Sidebar */}
//                 <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
//                     {/* Search and Filters */}
//                     <div className="p-4 border-b border-gray-200">
//                         <div className="relative mb-4">
//                             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//                             <input
//                                 type="text"
//                                 placeholder="Search leads..."
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             />
//                         </div>

//                         <div className="grid grid-cols-1 gap-3">
//                             <select
//                                 value={selectedProperty}
//                                 onChange={(e) => setSelectedProperty(e.target.value)}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 disabled={!propertyNamesLoaded}
//                             >
//                                 <option value="">
//                                     {propertyNamesLoaded ? 'All Property Names' : 'Loading properties...'}
//                                 </option>
//                                 {propertyNames.map(propertyName => (
//                                     <option key={propertyName} value={propertyName}>{propertyName}</option>
//                                 ))}
//                             </select>

//                             <label className="flex items-center">
//                                 <input
//                                     type="checkbox"
//                                     checked={showOnlyActive}
//                                     onChange={(e) => setShowOnlyActive(e.target.checked)}
//                                     className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                                 />
//                                 <span className="ml-2 text-sm text-gray-700">Show only active leads</span>
//                             </label>
//                         </div>
//                     </div>

//                     {/* Area Selection Tools */}
//                     <div className="p-4 border-b border-gray-200">
//                         <h3 className="font-semibold text-gray-900 mb-3">Lasso Selection</h3>
//                         <div className="grid grid-cols-2 gap-2">
//                             <button
//                                 onClick={startDrawing}
//                                 disabled={isDrawing}
//                                 className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isDrawing
//                                     ? 'bg-blue-100 text-blue-700 cursor-not-allowed'
//                                     : 'bg-blue-600 text-white hover:bg-blue-700'
//                                     }`}
//                             >
//                                 <Target className="h-4 w-4 inline mr-1" />
//                                 {isDrawing ? 'Drawing...' : 'Draw Lasso'}
//                             </button>

//                             <button
//                                 onClick={clearSelection}
//                                 disabled={!selectedArea}
//                                 className="px-3 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
//                             >
//                                 <X className="h-4 w-4 inline mr-1" />
//                                 Clear
//                             </button>
//                         </div>

//                         <p className="mt-2 text-xs text-gray-600">
//                             Click "Draw Lasso" then click and drag on the map to create a free-form selection area
//                         </p>
//                     </div>

//                     {/* Property Names Legend */}
//                     <div className="p-4 border-b border-gray-200">
//                         <h3 className="font-semibold text-gray-900 mb-3">Property Names</h3>
//                         <div className="space-y-2 max-h-40 overflow-y-auto">
//                             {propertyNames.length > 0 ? (
//                                 propertyNames.map(propertyName => {
//                                     const count = leads.filter(lead => lead.propertyName === propertyName).length;
//                                     const isVisible = visibleProperties.has(propertyName);

//                                     return (
//                                         <div key={propertyName} className="flex items-center justify-between">
//                                             <button
//                                                 onClick={() => togglePropertyVisibility(propertyName)}
//                                                 className="flex items-center flex-1 text-left"
//                                             >
//                                                 <div
//                                                     className="w-3 h-3 rounded-full mr-2"
//                                                     style={{ backgroundColor: PROPERTY_COLORS[propertyName] }}
//                                                 />
//                                                 <span className={`text-sm ${isVisible ? 'text-gray-900' : 'text-gray-400'}`}>
//                                                     {propertyName}
//                                                 </span>
//                                                 {isVisible ? (
//                                                     <Eye className="h-3 w-3 ml-1 text-gray-400" />
//                                                 ) : (
//                                                     <EyeOff className="h-3 w-3 ml-1 text-gray-400" />
//                                                 )}
//                                             </button>
//                                             <span className="text-xs text-gray-500">{count}</span>
//                                         </div>
//                                     );
//                                 })
//                             ) : (
//                                 <div className="text-sm text-gray-500 text-center py-2">
//                                     {propertyNamesLoaded ? 'No properties found' : 'Loading...'}
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     {/* Quick Stats */}
//                     <div className="p-4">
//                         <h3 className="font-semibold text-gray-900 mb-3">Quick Stats</h3>
//                         <div className="space-y-3">
//                             <div className="flex justify-between">
//                                 <span className="text-sm text-gray-600">Total Leads</span>
//                                 <span className="text-sm font-semibold">{leads.length}</span>
//                             </div>
//                             <div className="flex justify-between">
//                                 <span className="text-sm text-gray-600">Active Leads</span>
//                                 <span className="text-sm font-semibold text-green-600">
//                                     {leads.filter(lead => !lead.isCrossed).length}
//                                 </span>
//                             </div>
//                             <div className="flex justify-between">
//                                 <span className="text-sm text-gray-600">Crossed Leads</span>
//                                 <span className="text-sm font-semibold text-red-600">
//                                     {leads.filter(lead => lead.isCrossed).length}
//                                 </span>
//                             </div>
//                             <div className="flex justify-between">
//                                 <span className="text-sm text-gray-600">Property Names</span>
//                                 <span className="text-sm font-semibold">
//                                     {propertyNames.length}
//                                 </span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Main Content */}
//                 <div className="flex-1 relative">
//                     {/* Map */}
//                     <div ref={mapRef} className="absolute inset-0" />

//                     {/* Map Loading Indicator */}
//                     {!mapInstance.current && (
//                         <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
//                             <div className="text-center">
//                                 <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
//                                 <p className="text-gray-600">Loading Google Maps...</p>
//                             </div>
//                         </div>
//                     )}

//                     {/* Analytics Panel */}
//                     {showAnalytics && (
//                         <div className="absolute top-4 right-4 w-96 bg-white rounded-lg shadow-lg max-h-[calc(100vh-200px)] overflow-hidden">
//                             <div className="p-4 border-b border-gray-200">
//                                 <div className="flex items-center justify-between">
//                                     <h3 className="font-semibold text-gray-900 flex items-center">
//                                         <PieChart className="h-5 w-5 mr-2 text-blue-600" />
//                                         Area Analysis
//                                     </h3>
//                                     <button
//                                         onClick={() => setShowAnalytics(false)}
//                                         className="text-gray-400 hover:text-gray-600"
//                                     >
//                                         <X className="h-5 w-5" />
//                                     </button>
//                                 </div>
//                             </div>

//                             <div className="p-4 overflow-y-auto max-h-96">
//                                 {/* Leads in Area */}
//                                 <div className="mb-6">
//                                     <h4 className="font-medium text-gray-900 mb-3 flex items-center">
//                                         <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
//                                         Leads in Selected Area ({leadsInArea.length})
//                                     </h4>

//                                     {leadsInArea.length > 0 ? (
//                                         <div className="space-y-2 max-h-40 overflow-y-auto">
//                                             {leadsInArea.map(lead => (
//                                                 <div key={lead._id} className="p-2 bg-green-50 rounded border-l-4 border-green-400">
//                                                     <div className="flex justify-between items-start">
//                                                         <div className="flex-1">
//                                                             <p className="font-medium text-sm text-gray-900">{lead.propertyName}</p>
//                                                             <p className="text-xs text-gray-600">{lead.propertyName}</p>
//                                                             {lead.ownerName && (
//                                                                 <p className="text-xs text-gray-600 flex items-center mt-1">
//                                                                     <User className="h-3 w-3 mr-1" />
//                                                                     {lead.ownerName}
//                                                                 </p>
//                                                             )}
//                                                             {lead.ownerContact && (
//                                                                 <p className="text-xs text-gray-600 flex items-center">
//                                                                     <Phone className="h-3 w-3 mr-1" />
//                                                                     {lead.ownerContact}
//                                                                 </p>
//                                                             )}
//                                                         </div>
//                                                         <div className="text-right">
//                                                             {lead.askingPrice && (
//                                                                 <p className="text-xs font-semibold text-green-600">
//                                                                     {formatCurrency(lead.askingPrice)}
//                                                                 </p>
//                                                             )}
//                                                             <p className="text-xs text-gray-500">
//                                                                 {formatDate(lead.createdAt)}
//                                                             </p>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     ) : (
//                                         <p className="text-sm text-gray-500">No leads found in selected area</p>
//                                     )}
//                                 </div>

//                                 {/* Missing Opportunities */}
//                                 <div className="mb-6">
//                                     <h4 className="font-medium text-gray-900 mb-3 flex items-center">
//                                         <Lightbulb className="h-4 w-4 mr-2 text-yellow-600" />
//                                         Missing Opportunities ({missingProperties.length})
//                                     </h4>

//                                     {missingProperties.length > 0 ? (
//                                         <div className="space-y-3">
//                                             {missingProperties.map(propertyName => {
//                                                 const availableLeads = getMissingPropertyLeads(propertyName);
//                                                 return (
//                                                     <div key={propertyName} className="p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
//                                                         <div className="flex items-center mb-2">
//                                                             <div
//                                                                 className="w-3 h-3 rounded-full mr-2"
//                                                                 style={{ backgroundColor: PROPERTY_COLORS[propertyName] }}
//                                                             />
//                                                             <span className="font-medium text-sm text-gray-900">{propertyName}</span>
//                                                         </div>
//                                                         <p className="text-xs text-gray-600 mb-2">
//                                                             Available leads outside area: {availableLeads.length}
//                                                         </p>
//                                                         {availableLeads.length > 0 && (
//                                                             <div className="space-y-1">
//                                                                 {availableLeads.slice(0, 2).map(lead => (
//                                                                     <div key={lead._id} className="text-xs text-gray-700 bg-yellow-100 p-1 rounded">
//                                                                         {lead.propertyName}
//                                                                         {lead.askingPrice && ` - ${formatCurrency(lead.askingPrice)}`}
//                                                                     </div>
//                                                                 ))}
//                                                                 {availableLeads.length > 2 && (
//                                                                     <p className="text-xs text-gray-600">
//                                                                         +{availableLeads.length - 2} more available
//                                                                     </p>
//                                                                 )}
//                                                             </div>
//                                                         )}
//                                                     </div>
//                                                 );
//                                             })}
//                                         </div>
//                                     ) : (
//                                         <p className="text-sm text-gray-500">All property names are represented in this area</p>
//                                     )}
//                                 </div>

//                                 {/* Area Summary */}
//                                 <div className="pt-4 border-t border-gray-200">
//                                     <h4 className="font-medium text-gray-900 mb-3 flex items-center">
//                                         <TrendingUp className="h-4 w-4 mr-2 text-blue-600" />
//                                         Area Summary
//                                     </h4>

//                                     <div className="grid grid-cols-2 gap-4 text-sm">
//                                         <div>
//                                             <p className="text-gray-600">Total Properties</p>
//                                             <p className="font-semibold">{leadsInArea.length}</p>
//                                         </div>
//                                         <div>
//                                             <p className="text-gray-600">Property Names</p>
//                                             <p className="font-semibold">{new Set(leadsInArea.map(l => l.propertyName)).size}</p>
//                                         </div>
//                                         <div>
//                                             <p className="text-gray-600">Active Leads</p>
//                                             <p className="font-semibold text-green-600">
//                                                 {leadsInArea.filter(l => !l.isCrossed).length}
//                                             </p>
//                                         </div>
//                                         <div>
//                                             <p className="text-gray-600">Avg. Price</p>
//                                             <p className="font-semibold">
//                                                 {formatCurrency(
//                                                     leadsInArea.reduce((sum, lead) => sum + (lead.askingPrice || 0), 0) / leadsInArea.length
//                                                 )}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {/* Lead Details Modal */}
//                     {selectedLead && (
//                         <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//                             <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
//                                 <div className="p-4 border-b border-gray-200">
//                                     <div className="flex items-center justify-between">
//                                         <h3 className="font-semibold text-lg text-gray-900">{selectedLead.propertyName}</h3>
//                                         <button
//                                             onClick={() => setSelectedLead(null)}
//                                             className="text-gray-400 hover:text-gray-600"
//                                         >
//                                             <X className="h-6 w-6" />
//                                         </button>
//                                     </div>
//                                 </div>

//                                 <div className="p-4 overflow-y-auto max-h-96">
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                         <div>
//                                             <h4 className="font-medium text-gray-900 mb-2">Property Details</h4>
//                                             <div className="space-y-2 text-sm">
//                                                 <div className="flex justify-between">
//                                                     <span className="text-gray-600">Property Name:</span>
//                                                     <span className="font-medium">{selectedLead.propertyName}</span>
//                                                 </div>
//                                                 <div className="flex justify-between">
//                                                     <span className="text-gray-600">Status:</span>
//                                                     <span className={`font-medium ${selectedLead.isCrossed ? 'text-red-600' : 'text-green-600'}`}>
//                                                         {selectedLead.isCrossed ? 'Crossed' : 'Active'}
//                                                     </span>
//                                                 </div>
//                                                 {selectedLead.askingPrice && (
//                                                     <div className="flex justify-between">
//                                                         <span className="text-gray-600">Price:</span>
//                                                         <span className="font-semibold text-green-600">
//                                                             {formatCurrency(selectedLead.askingPrice)}
//                                                         </span>
//                                                     </div>
//                                                 )}
//                                                 <div className="flex justify-between">
//                                                     <span className="text-gray-600">Added:</span>
//                                                     <span className="font-medium">{formatDate(selectedLead.createdAt)}</span>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         <div>
//                                             <h4 className="font-medium text-gray-900 mb-2">Owner Information</h4>
//                                             <div className="space-y-2 text-sm">
//                                                 {selectedLead.ownerName && (
//                                                     <div className="flex items-center">
//                                                         <User className="h-4 w-4 mr-2 text-gray-400" />
//                                                         <span>{selectedLead.ownerName}</span>
//                                                     </div>
//                                                 )}
//                                                 {selectedLead.ownerContact && (
//                                                     <div className="flex items-center">
//                                                         <Phone className="h-4 w-4 mr-2 text-gray-400" />
//                                                         <span>{selectedLead.ownerContact}</span>
//                                                     </div>
//                                                 )}
//                                                 {selectedLead.salesman && (
//                                                     <div className="mt-3">
//                                                         <p className="text-gray-600 text-xs mb-1">Salesman:</p>
//                                                         <p className="font-medium">{selectedLead.salesman.name}</p>
//                                                         <p className="text-xs text-gray-500">{selectedLead.salesman.email}</p>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {selectedLead.images && selectedLead.images.length > 0 && (
//                                         <div className="mt-6">
//                                             <h4 className="font-medium text-gray-900 mb-2">Images</h4>
//                                             <div className="grid grid-cols-2 gap-2">
//                                                 {selectedLead.images.slice(0, 4).map((image, index) => (
//                                                     <img
//                                                         key={index}
//                                                         src={image.url}
//                                                         alt={image.caption || `Property image ${index + 1}`}
//                                                         className="w-full h-24 object-cover rounded"
//                                                     />
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Lasso;