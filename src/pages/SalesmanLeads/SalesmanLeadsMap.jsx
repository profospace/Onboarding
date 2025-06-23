import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Calendar,
    MapPin,
    User,
    Phone,
    Eye,
    ArrowLeft,
    TrendingUp,
    Clock,
    Filter,
    RefreshCw,
    X,
    Search,
    BarChart3,
    Map,
    List,
    DollarSign,
    Users,
    CheckCircle,
    XCircle,
    Activity,
    ChevronDown,
    ChevronUp,
    CalendarRange
} from 'lucide-react';
import { base_url } from '../../../utils/base_url';
import { useSelector } from 'react-redux';

const SalesmanLeadsMap = () => {
    const { salesmanId } = useParams();
    const navigate = useNavigate();
    const mapRef = useRef(null);
    const googleMapRef = useRef(null);
    const markersRef = useRef([]);
    const infoWindowRef = useRef(null);

    // State management
    const [leads, setLeads] = useState([]);
    const [filteredLeads, setFilteredLeads] = useState([]);
    const [salesman, setSalesman] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [showAllLeads, setShowAllLeads] = useState(false);

    // Date range states
    const [filterMode, setFilterMode] = useState('single'); // 'single', 'range', 'all'
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [summary, setSummary] = useState({
        totalLeads: 0,
        activeLeads: 0,
        crossedLeads: 0,
        withContact: 0,
        averageAskingPrice: 0,
        totalValue: 0
    });
    const [analytics, setAnalytics] = useState({
        hourlyDistribution: [],
        weeklyComparison: []
    });

    const { user } = useSelector((state) => state.auth);
    console.log("user sa" , user?.role)


    // Filter states
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.2090 });
    const [viewMode, setViewMode] = useState('map');
    const [showAnalytics, setShowAnalytics] = useState(false);

    // Fetch leads data
    const fetchLeads = async () => {
        try {
            setLoading(true);
            setError('');
            const details = JSON.parse(localStorage.getItem('user'));

            let url;
            const params = new URLSearchParams();

            if (filterMode === 'all') {
                // Fetch all leads for the salesman without date filter
                url = `${base_url}/api/salesman/property/leads/salesman/${salesmanId}?limit=2000`;
            } else if (filterMode === 'range' && startDate && endDate) {
                // Fetch leads for date range
                params.append('startDate', startDate);
                params.append('endDate', endDate);
                params.append('limit', '1000');
                url = `${base_url}/api/salesman/property/leads/salesman/${salesmanId}/by-date?${params.toString()}`;
            } else {
                // Fetch leads for specific single date
                params.append('date', selectedDate);
                params.append('limit', '1000');
                url = `${base_url}/api/salesman/property/leads/salesman/${salesmanId}/by-date?${params.toString()}`;
            }

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${details?.token}` }
            });

            const data = response.data.data;
            setLeads(data.leads);
            setFilteredLeads(data.leads);
            setSalesman(data.salesman);
            setSummary(data.summary);
            setAnalytics(data.analytics);

            // Update map center if leads exist
            if (data.leads.length > 0) {
                const leadWithLocation = data.leads.find(lead =>
                    lead.location && lead.location.latitude && lead.location.longitude
                );
                if (leadWithLocation) {
                    setMapCenter({
                        lat: leadWithLocation.location.latitude,
                        lng: leadWithLocation.location.longitude
                    });
                }
            }
        } catch (err) {
            console.error('Error fetching leads:', err);
            setError(err.response?.data?.msg || 'Failed to load leads data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    console.log("leads", leads)

    // Filter leads based on status and search query
    const applyFilters = () => {
        let filtered = [...leads];

        // Apply status filter
        if (statusFilter === 'active') {
            filtered = filtered.filter(lead => !lead.isCrossed);
        } else if (statusFilter === 'crossed') {
            filtered = filtered.filter(lead => lead.isCrossed);
        } else if (statusFilter === 'with-contact') {
            filtered = filtered.filter(lead => lead.ownerContact);
        }

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(lead =>
                (lead.propertyName && lead.propertyName.toLowerCase().includes(query)) ||
                (lead.ownerName && lead.ownerName.toLowerCase().includes(query)) ||
                (lead.ownerContact && lead.ownerContact.includes(query)) ||
                (lead.location?.address && lead.location.address.toLowerCase().includes(query))
            );
        }

        setFilteredLeads(filtered);
    };

    // Initialize Google Map
    const initializeMap = () => {
        if (!window.google || !mapRef.current) return;

        const map = new window.google.maps.Map(mapRef.current, {
            zoom: 12,
            center: mapCenter,
            mapTypeId: 'roadmap',
            styles: [
                {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [{ visibility: 'off' }]
                },
                {
                    featureType: 'administrative',
                    elementType: 'geometry',
                    stylers: [{ color: '#e0e0e0' }]
                },
                {
                    featureType: 'water',
                    elementType: 'geometry',
                    stylers: [{ color: '#a2daf2' }]
                }
            ]
        });

        googleMapRef.current = map;
        infoWindowRef.current = new window.google.maps.InfoWindow();
        addMarkersToMap();
    };

    // Add markers to map
    // const addMarkersToMap = () => {
    //     if (!googleMapRef.current || !filteredLeads.length) return;

    //     // Clear existing markers
    //     markersRef.current.forEach(marker => {
    //         marker.setMap(null);
    //     });
    //     markersRef.current = [];

    //     const bounds = new window.google.maps.LatLngBounds();
    //     let validMarkers = 0;

    //     // Helper function to check if ownerContact contains numbers
    //     const hasNumbers = (str) => {
    //         return /\d/.test(str);
    //     };

    //     filteredLeads.forEach((lead, index) => {
    //         if (lead.location && lead.location.latitude && lead.location.longitude) {
    //             const position = {
    //                 lat: lead.location.latitude,
    //                 lng: lead.location.longitude
    //             };

    //             // Determine marker color based on ownerContact availability and if it contains numbers
    //             let markerColor;
    //             if (lead.ownerContact &&
    //                 lead.ownerContact.trim() !== '' &&
    //                 hasNumbers(lead.ownerContact)) {
    //                 markerColor = '#22C55E'; // Green color when ownerContact has numbers
    //             } else {
    //                 markerColor = lead.isCrossed ? '#EF4444' : '#3B82F6'; // Original logic
    //             }

    //             // Create custom marker with number
    //             const markerIcon = {
    //                 path: `M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z`,
    //                 fillColor: markerColor,
    //                 fillOpacity: 0.8,
    //                 strokeColor: '#FFFFFF',
    //                 strokeWeight: 2,
    //                 scale: 1,
    //                 labelOrigin: new window.google.maps.Point(0, -25)
    //             };

    //             const marker = new window.google.maps.Marker({
    //                 position: position,
    //                 map: googleMapRef.current,
    //                 title: lead.propertyName || 'Property Lead',
    //                 icon: markerIcon,
    //                 label: {
    //                     text: (index + 1).toString(),
    //                     color: 'white',
    //                     fontSize: '12px',
    //                     fontWeight: 'bold'
    //                 },
    //                 animation: window.google.maps.Animation.DROP
    //             });

    //             // Add click listener to marker
    //             marker.addListener('click', () => {
    //                 const contentString = createInfoWindowContent(lead, index + 1);
    //                 infoWindowRef.current.setContent(contentString);
    //                 infoWindowRef.current.open(googleMapRef.current, marker);
    //             });

    //             markersRef.current.push(marker);
    //             bounds.extend(position);
    //             validMarkers++;
    //         }
    //     });

    //     // Fit map to show all markers
    //     if (validMarkers > 0) {
    //         if (validMarkers === 1) {
    //             googleMapRef.current.setCenter(bounds.getCenter());
    //             googleMapRef.current.setZoom(15);
    //         } else {
    //             googleMapRef.current.fitBounds(bounds);
    //         }
    //     }
    // };

    // const addMarkersToMap = () => {
    //     if (!googleMapRef.current || !filteredLeads.length) return;

    //     // Clear existing markers
    //     markersRef.current.forEach(marker => {
    //         marker.setMap(null);
    //     });
    //     markersRef.current = [];

    //     const bounds = new window.google.maps.LatLngBounds();
    //     let validMarkers = 0;

    //     // Helper function to check if ownerContact contains numbers
    //     const hasNumbers = (str) => {
    //         return /\d/.test(str);
    //     };

    //     filteredLeads.forEach((lead, index) => {
    //         if (lead.location && lead.location.latitude && lead.location.longitude) {
    //             const position = {
    //                 lat: lead.location.latitude,
    //                 lng: lead.location.longitude
    //             };

    //             // Determine marker color based on user role and ownerContact availability
    //             let markerColor;

    //             // If user is salesman, show default red marker
    //             if (user.role === 'salesman') {
    //                 markerColor = '#EF4444'; // Red color for salesman
    //             } else {
    //                 // Original logic for other roles
    //                 if (lead.ownerContact &&
    //                     lead.ownerContact.trim() !== '' &&
    //                     hasNumbers(lead.ownerContact)) {
    //                     markerColor = '#22C55E'; // Green color when ownerContact has numbers
    //                 } else {
    //                     markerColor = lead.isCrossed ? '#EF4444' : '#3B82F6'; // Original logic
    //                 }
    //             }

    //             // Create custom marker with number
    //             const markerIcon = {
    //                 path: `M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z`,
    //                 fillColor: markerColor,
    //                 fillOpacity: 0.8,
    //                 strokeColor: '#FFFFFF',
    //                 strokeWeight: 2,
    //                 scale: 1,
    //                 labelOrigin: new window.google.maps.Point(0, -25)
    //             };

    //             const marker = new window.google.maps.Marker({
    //                 position: position,
    //                 map: googleMapRef.current,
    //                 title: lead.propertyName || 'Property Lead',
    //                 icon: markerIcon,
    //                 label: {
    //                     text: (index + 1).toString(),
    //                     color: 'white',
    //                     fontSize: '12px',
    //                     fontWeight: 'bold'
    //                 },
    //                 animation: window.google.maps.Animation.DROP
    //             });

    //             // Add click listener to marker
    //             marker.addListener('click', () => {
    //                 const contentString = createInfoWindowContent(lead, index + 1);
    //                 infoWindowRef.current.setContent(contentString);
    //                 infoWindowRef.current.open(googleMapRef.current, marker);
    //             });

    //             markersRef.current.push(marker);
    //             bounds.extend(position);
    //             validMarkers++;
    //         }
    //     });

    //     // Fit map to show all markers
    //     if (validMarkers > 0) {
    //         if (validMarkers === 1) {
    //             googleMapRef.current.setCenter(bounds.getCenter());
    //             googleMapRef.current.setZoom(15);
    //         } else {
    //             googleMapRef.current.fitBounds(bounds);
    //         }
    //     }
    // };

    const addMarkersToMap = () => {
        if (!googleMapRef.current || !filteredLeads.length) return;

        // Clear existing markers
        markersRef.current.forEach(marker => {
            marker.setMap(null);
        });
        markersRef.current = [];

        const bounds = new window.google.maps.LatLngBounds();
        let validMarkers = 0;

        // Helper function to check if ownerContact contains numbers
        const hasNumbers = (str) => {
            return /\d/.test(str);
        };

        // Add salesman's current location marker if user is a salesman
        if (user?.role === 'salesman') {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const salesmanPosition = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };

                        // Create unique marker icon for salesman's location
                        const salesmanMarkerIcon = {
                            path: 'M12,2C8.13,2 5,5.13 5,9c0,5.25 7,13 7,13s7,-7.75 7,-13C19,5.13 15.87,2 12,2zM12,11.5c-1.38,0 -2.5,-1.12 -2.5,-2.5s1.12,-2.5 2.5,-2.5s2.5,1.12 2.5,2.5S13.38,11.5 12,11.5z',
                            fillColor: '#EA4335', // Google's red color
                            fillOpacity: 1,
                            strokeColor: '#FFFFFF',
                            strokeWeight: 1,
                            scale: 1.5,
                            anchor: new window.google.maps.Point(12, 24) // Anchor at the bottom point of the marker
                        };

                        const salesmanMarker = new window.google.maps.Marker({
                            position: salesmanPosition,
                            map: googleMapRef.current,
                            title: 'Your Current Location',
                            icon: salesmanMarkerIcon,
                            zIndex: 1000, // Higher z-index to appear on top
                            // animation: window.google.maps.Animation.BOUNCE
                        });

                        // Add click listener for salesman marker
                        // salesmanMarker.addListener('click', () => {
                        //     const salesmanInfoContent = `
                        //         <div style="padding: 10px; max-width: 200px;">
                        //             <h3 style="margin: 0 0 5px 0; color: #FF6B35;">📍 Your Location</h3>
                        //             <p style="margin: 0; font-size: 14px; color: #666;">
                        //                 Current Position<br>
                        //                 <small>Lat: ${salesmanPosition.lat.toFixed(6)}<br>
                        //                 Lng: ${salesmanPosition.lng.toFixed(6)}</small>
                        //             </p>
                        //         </div>
                        //     `;
                        //     infoWindowRef.current.setContent(salesmanInfoContent);
                        //     infoWindowRef.current.open(googleMapRef.current, salesmanMarker);
                        // });

                        salesmanMarker.addListener('click', () => {
                            const salesmanInfoContent = `
                                <div style="padding: 10px; max-width: 200px;">
                                    <h3 style="margin: 0 0 5px 0; color: #FF6B35;">📍 Your Location</h3>
                                    <p style="margin: 0; font-size: 14px; color: #666;">
                                        Current Position<br>
                                        <small>Lat: ${salesmanPosition.lat.toFixed(6)}<br>
                                        Lng: ${salesmanPosition.lng.toFixed(6)}</small>
                                    </p>
                                </div>
                            `;
                            infoWindowRef.current.setContent(salesmanInfoContent);
                            infoWindowRef.current.open(googleMapRef.current, salesmanMarker);

                            // Auto-zoom to salesman location
                            googleMapRef.current.setCenter(salesmanPosition);
                            googleMapRef.current.setZoom(16);
                        });

                        markersRef.current.push(salesmanMarker);
                        bounds.extend(salesmanPosition);
                        validMarkers++;

                        // Update map bounds after adding salesman marker
                        if (validMarkers > 0) {
                            if (validMarkers === 1) {
                                googleMapRef.current.setCenter(bounds.getCenter());
                                googleMapRef.current.setZoom(15);
                            } else {
                                googleMapRef.current.fitBounds(bounds);
                            }
                        }
                    },
                    (error) => {
                        console.error('Error getting salesman location:', error);
                        // Handle different error cases
                        switch (error.code) {
                            case error.PERMISSION_DENIED:
                                console.log("Location access denied by user");
                                break;
                            case error.POSITION_UNAVAILABLE:
                                console.log("Location information unavailable");
                                break;
                            case error.TIMEOUT:
                                console.log("Location request timed out");
                                break;
                        }
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 300000 // 5 minutes
                    }
                );
            } else {
                console.log("Geolocation is not supported by this browser");
            }
        }

        // Add property lead markers
        filteredLeads.forEach((lead, index) => {
            if (lead.location && lead.location.latitude && lead.location.longitude) {
                const position = {
                    lat: lead.location.latitude,
                    lng: lead.location.longitude
                };

                // Determine marker color based on ownerContact availability and if it contains numbers
                let markerColor;
                if (lead.ownerContact &&
                    lead.ownerContact.trim() !== '' &&
                    hasNumbers(lead.ownerContact)) {
                    markerColor = '#22C55E'; // Green color when ownerContact has numbers
                } else {
                    markerColor = lead.isCrossed ? '#EF4444' : '#3B82F6'; // Original logic
                }

                // Create custom marker with number
                const markerIcon = {
                    path: `M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z`,
                    fillColor: markerColor,
                    fillOpacity: 0.8,
                    strokeColor: '#FFFFFF',
                    strokeWeight: 2,
                    scale: 1,
                    labelOrigin: new window.google.maps.Point(0, -25)
                };

                const marker = new window.google.maps.Marker({
                    position: position,
                    map: googleMapRef.current,
                    title: lead.propertyName || 'Property Lead',
                    icon: markerIcon,
                    label: {
                        text: (index + 1).toString(),
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                    },
                    animation: window.google.maps.Animation.DROP
                });

                // Add click listener to marker
                // marker.addListener('click', () => {
                //     const contentString = createInfoWindowContent(lead, index + 1);
                //     infoWindowRef.current.setContent(contentString);
                //     infoWindowRef.current.open(googleMapRef.current, marker);
                // });

                marker.addListener('click', () => {
                    // Create and show info window
                    const contentString = createInfoWindowContent(lead, index + 1);
                    infoWindowRef.current.setContent(contentString);
                    infoWindowRef.current.open(googleMapRef.current, marker);

                    // Auto-zoom to marker location
                    googleMapRef.current.setCenter(position);
                    googleMapRef.current.setZoom(16); // Adjust zoom level as needed (higher = more zoomed in)

                // Optional: Smooth pan to location instead of instant center
                // googleMapRef.current.panTo(position);
                });

                markersRef.current.push(marker);
                bounds.extend(position);
                validMarkers++;
            }
        });

        // Fit map to show all markers (original logic)
        if (validMarkers > 0) {
            if (validMarkers === 1) {
                googleMapRef.current.setCenter(bounds.getCenter());
                googleMapRef.current.setZoom(15);
            } else {
                googleMapRef.current.fitBounds(bounds);
            }
        }
    };
    
    // Create info window content
    const createInfoWindowContent = (lead, index) => {
        const firstImage = lead.images && lead.images.length > 0 ? lead.images[0] : null;
        const hasContact = lead.ownerContact && lead.ownerContact.trim() !== '';

        return `
        <div style="max-width: 400px; padding: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            ${firstImage ? `
                <div style="margin-bottom: 12px; position: relative;">
                    <img 
                        src="${firstImage.url}" 
                        alt="${lead.propertyName || 'Property'}"
                        style="width: 100%; height: 160px; object-fit: cover; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"
                    />
                    <div style="position: absolute; top: 8px; left: 8px; background: rgba(0,0,0,0.7); color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">
                        #${index}
                    </div>
                </div>
            ` : `
                <div style="margin-bottom: 12px; height: 80px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: 600;">
                    #${index}
                </div>
            `}
            
            <div style="margin-bottom: 10px;">
                <h3 style="font-size: 12px; font-weight: 600; margin: 0; color: #1F2937; line-height: 1.3;">
                    ${lead.propertyName || 'Property Lead'}
                </h3>
                ${lead.askingPrice ? `
                    <div style="margin-top: 4px; font-size: 16px; font-weight: 600; color: #059669;">
                        ₹${lead.askingPrice.toLocaleString()}
                    </div>
                ` : ''}
            </div>
            
            <div style="margin-bottom: 6px; display: flex; align-items: flex-start; gap: 8px;">
                <svg width="16" height="16" fill="#6B7280" viewBox="0 0 24 24" style="margin-top: 2px; flex-shrink: 0;">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span style="font-size: 12px; color: #6B7280; line-height: 1.4;">
                    ${lead.location.address || `${lead.location.latitude.toFixed(4)}, ${lead.location.longitude.toFixed(4)}`}
                </span>
            </div>
            
            <div style="margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
                <svg width="16" height="16" fill="#6B7280" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                <span style="font-size: 14px; color: #6B7280;">
                    ${lead.ownerName || 'N/A'}
                </span>
            </div>
            
            <div style="margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
                <svg width="16" height="16" fill="${hasContact ? '#059669' : '#6B7280'}" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                <span style="font-size: 14px; color: ${hasContact ? '#059669' : '#6B7280'}; font-weight: ${hasContact ? '500' : '400'};">
                    ${hasContact ? lead.ownerContact : 'No contact available'}
                </span>
            </div>
            
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
                <span style="
                    font-size: 12px; 
                    padding: 4px 12px; 
                    border-radius: 16px; 
                    background-color: ${lead.isCrossed ? '#FEE2E2' : '#DBEAFE'}; 
                    color: ${lead.isCrossed ? '#DC2626' : '#2563EB'};
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                ">
                    ${lead.isCrossed ? 'Crossed' : 'Active'}
                </span>
                <span style="font-size: 12px; color: #9CA3AF; font-weight: 500;">
                    ${new Date(lead.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}
                </span>
            </div>
            
            <!-- Navigation Buttons -->
            <div style="display: flex; gap: 8px; margin-top: 16px;">
                <button 
                    onclick="window.open('https://www.google.com/maps?q=${lead.location.latitude},${lead.location.longitude}', '_blank')"
                    style="
                        flex: 1;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 6px;
                        padding: 10px 12px;
                        background: #4285F4;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        font-size: 13px;
                        font-weight: 500;
                        cursor: pointer;
                        transition: background-color 0.2s;
                        text-decoration: none;
                    "
                    onmouseover="this.style.backgroundColor='#3367D6'"
                    onmouseout="this.style.backgroundColor='#4285F4'"
                >
                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    Maps
                </button>
                
                <button 
                     onclick="window.open('/lead/${lead.id || lead._id}', '_blank')"
                    style="
                        flex: 1;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 6px;
                        padding: 10px 12px;
                        background: #059669;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        font-size: 13px;
                        font-weight: 500;
                        cursor: pointer;
                        transition: background-color 0.2s;
                        text-decoration: none;
                    "
                    onmouseover="this.style.backgroundColor='#047857'"
                    onmouseout="this.style.backgroundColor='#059669'"
                >
                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/>
                    </svg>
                    Details
                </button>
            </div>
        </div>
    `;
    };

    // Format date for display
    const formatDisplayDate = () => {
        if (filterMode === 'all') return 'All Time';

        if (filterMode === 'range' && startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
        }

        if (filterMode === 'single' && selectedDate) {
            const date = new Date(selectedDate);
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            if (date.toDateString() === today.toDateString()) {
                return 'Today';
            } else if (date.toDateString() === yesterday.toDateString()) {
                return 'Yesterday';
            } else {
                return date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            }
        }

        return 'Select Date';
    };

    // Get quick date options
    const getQuickDateOptions = () => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);

        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);

        return [
            { label: 'Today', action: () => { setFilterMode('single'); setSelectedDate(today.toISOString().split('T')[0]); } },
            { label: 'Yesterday', action: () => { setFilterMode('single'); setSelectedDate(yesterday.toISOString().split('T')[0]); } },
            { label: 'Last 7 Days', action: () => { setFilterMode('range'); setStartDate(weekAgo.toISOString().split('T')[0]); setEndDate(today.toISOString().split('T')[0]); } },
            { label: 'Last 30 Days', action: () => { setFilterMode('range'); setStartDate(monthAgo.toISOString().split('T')[0]); setEndDate(today.toISOString().split('T')[0]); } },
            { label: 'All Leads', action: () => { setFilterMode('all'); setStartDate(''); setEndDate(''); setSelectedDate(''); } }
        ];
    };

    // Handle filter mode change
    const handleFilterModeChange = (mode) => {
        setFilterMode(mode);
        if (mode === 'single') {
            setStartDate('');
            setEndDate('');
            if (!selectedDate) {
                setSelectedDate(new Date().toISOString().split('T')[0]);
            }
        } else if (mode === 'range') {
            setSelectedDate('');
        } else if (mode === 'all') {
            setSelectedDate('');
            setStartDate('');
            setEndDate('');
        }
    };

    // Validate date range
    const isDateRangeValid = () => {
        if (filterMode !== 'range') return true;
        if (!startDate || !endDate) return false;
        return new Date(startDate) <= new Date(endDate);
    };

    // Effects
    useEffect(() => {
        if (filterMode === 'range' && startDate && endDate && isDateRangeValid()) {
            fetchLeads();
        } else if (filterMode === 'single' && selectedDate) {
            fetchLeads();
        } else if (filterMode === 'all') {
            fetchLeads();
        }
    }, [salesmanId, selectedDate, startDate, endDate, filterMode]);

    useEffect(() => {
        applyFilters();
    }, [leads, statusFilter, searchQuery]);

    useEffect(() => {
        if (!loading && filteredLeads.length > 0) {
            const timer = setTimeout(() => {
                initializeMap();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [loading, filteredLeads, mapCenter]);

    useEffect(() => {
        if (googleMapRef.current) {
            addMarkersToMap();
        }
    }, [filteredLeads]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-6"></div>
                    <p className="text-gray-600 text-lg font-medium">Loading leads...</p>
                    <p className="text-gray-500 text-sm mt-2">Preparing your map view</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <div className="bg-white shadow-lg border-b-2 border-blue-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center space-x-6">
                            <button
                                onClick={() => navigate(-1)}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {salesman?.name}'s Leads Map
                                </h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    {formatDisplayDate()} • {filteredLeads.length} of {leads.length} leads
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Quick date buttons */}
                            <div className="hidden md:flex items-center space-x-2">
                                {getQuickDateOptions().map((option) => (
                                    <button
                                        key={option.label}
                                        onClick={option.action}
                                        className="px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>

                            {/* Refresh button */}
                            <button
                                onClick={fetchLeads}
                                className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                title="Refresh data"
                            >
                                <RefreshCw className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error message */}
            {error && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <XCircle className="h-5 w-5 text-red-500 mr-3" />
                            <p className="text-red-700">{error}</p>
                            <button
                                onClick={fetchLeads}
                                className="ml-auto text-red-600 hover:text-red-800 font-medium"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{summary.totalLeads}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-green-600 font-medium">
                                {summary.totalLeads > 0 ? '100%' : '0%'} of total
                            </span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Active Leads</p>
                                <p className="text-3xl font-bold text-green-600 mt-2">{summary.activeLeads}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <Activity className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-green-600 font-medium">
                                {summary.totalLeads > 0 ? Math.round((summary.activeLeads / summary.totalLeads) * 100) : 0}% active
                            </span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">With Contact</p>
                                <p className="text-3xl font-bold text-purple-600 mt-2">{summary.withContact}</p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-full">
                                <Phone className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <Phone className="h-4 w-4 text-purple-500 mr-1" />
                            <span className="text-purple-600 font-medium">
                                {summary.totalLeads > 0 ? Math.round((summary.withContact / summary.totalLeads) * 100) : 0}% contactable
                            </span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Value</p>
                                <p className="text-3xl font-bold text-indigo-600 mt-2">
                                    ₹{(summary.totalValue / 10000000).toFixed(1)}Cr
                                </p>
                            </div>
                            <div className="p-3 bg-indigo-100 rounded-full">
                                <DollarSign className="h-6 w-6 text-indigo-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <BarChart3 className="h-4 w-4 text-indigo-500 mr-1" />
                            <span className="text-indigo-600 font-medium">
                                Avg: ₹{(summary.averageAskingPrice / 100000).toFixed(1)}L
                            </span>
                        </div>
                    </div>
                </div>

                {/* Date Filter Controls */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
                    <div className="flex flex-col space-y-4">
                        {/* Filter Mode Selection */}
                        <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium text-gray-700">Filter by:</span>
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => handleFilterModeChange('single')}
                                    className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${filterMode === 'single'
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    <Calendar className="h-4 w-4 mr-1" />
                                    Single Date
                                </button>
                                <button
                                    onClick={() => handleFilterModeChange('range')}
                                    className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${filterMode === 'range'
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    <CalendarRange className="h-4 w-4 mr-1" />
                                    Date Range
                                </button>
                                <button
                                    onClick={() => handleFilterModeChange('all')}
                                    className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${filterMode === 'all'
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    <Clock className="h-4 w-4 mr-1" />
                                    All Time
                                </button>
                            </div>
                        </div>

                        {/* Date Inputs */}
                        <div className="flex items-center space-x-4">
                            {filterMode === 'single' && (
                                <div className="flex items-center space-x-2 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2">
                                    <Calendar className="h-5 w-5 text-gray-500" />
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="text-sm focus:outline-none bg-transparent"
                                    />
                                </div>
                            )}

                            {filterMode === 'range' && (
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2">
                                        <Calendar className="h-5 w-5 text-gray-500" />
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            placeholder="Start Date"
                                            className="text-sm focus:outline-none bg-transparent"
                                        />
                                    </div>
                                    <span className="text-gray-500">to</span>
                                    <div className="flex items-center space-x-2 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2">
                                        <Calendar className="h-5 w-5 text-gray-500" />
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            placeholder="End Date"
                                            className="text-sm focus:outline-none bg-transparent"
                                        />
                                    </div>
                                    {!isDateRangeValid() && startDate && endDate && (
                                        <span className="text-red-500 text-sm">Invalid date range</span>
                                    )}
                                </div>
                            )}

                            {filterMode === 'all' && (
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <Clock className="h-5 w-5" />
                                    <span className="text-sm font-medium">Showing all leads</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Controls Bar */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        {/* Search and Filters */}
                        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search leads..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                                />
                            </div>

                            {/* Status Filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active Only</option>
                                <option value="crossed">Crossed Only</option>
                                <option value="with-contact">With Contact</option>
                            </select>

                            {/* Advanced Filters Toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                            >
                                <Filter className="h-4 w-4 mr-2" />
                                Filters
                                {showFilters ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
                            </button>
                        </div>

                        {/* View Toggle and Analytics */}
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setShowAnalytics(!showAnalytics)}
                                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${showAnalytics
                                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                                    }`}
                            >
                                <BarChart3 className="h-4 w-4 mr-2" />
                                Analytics
                            </button>

                            <div className="flex bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('map')}
                                    className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${viewMode === 'map'
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    <Map className="h-4 w-4 mr-1" />
                                    Map
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${viewMode === 'list'
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    <List className="h-4 w-4 mr-1" />
                                    List
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Advanced Filters */}
                    {showFilters && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Price Range
                                    </label>
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        <option value="">All Prices</option>
                                        <option value="0-5000000">Under ₹50L</option>
                                        <option value="5000000-10000000">₹50L - ₹1Cr</option>
                                        <option value="10000000-50000000">₹1Cr - ₹5Cr</option>
                                        <option value="50000000+">Above ₹5Cr</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Filter by location..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Time Added
                                    </label>
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        <option value="">All Time</option>
                                        <option value="morning">Morning (6AM-12PM)</option>
                                        <option value="afternoon">Afternoon (12PM-6PM)</option>
                                        <option value="evening">Evening (6PM-12AM)</option>
                                        <option value="night">Night (12AM-6AM)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Analytics Panel */}
                {showAnalytics && (
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Analytics Overview</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Hourly Distribution */}
                            <div>
                                <h4 className="text-md font-medium text-gray-700 mb-4">Hourly Distribution</h4>
                                <div className="space-y-3">
                                    {analytics.hourlyDistribution.map((hour) => (
                                        <div key={hour._id} className="flex items-center">
                                            <span className="text-sm text-gray-600 w-16">
                                                {hour._id}:00
                                            </span>
                                            <div className="flex-1 mx-3">
                                                <div className="bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                                        style={{
                                                            width: `${(hour.count / Math.max(...analytics.hourlyDistribution.map(h => h.count))) * 100}%`
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <span className="text-sm font-medium text-gray-900 w-8">
                                                {hour.count}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Weekly Comparison */}
                            <div>
                                <h4 className="text-md font-medium text-gray-700 mb-4">Weekly Comparison</h4>
                                <div className="space-y-3">
                                    {analytics.weeklyComparison.map((day) => (
                                        <div key={day._id} className="flex items-center">
                                            <span className="text-sm text-gray-600 w-20">
                                                {new Date(day._id).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                            <div className="flex-1 mx-3">
                                                <div className="bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                                        style={{
                                                            width: `${(day.count / Math.max(...analytics.weeklyComparison.map(d => d.count))) * 100}%`
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <span className="text-sm font-medium text-gray-900 w-8">
                                                {day.count}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Map/List View */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                            {viewMode === 'map' ? (
                                <div className="relative">
                                    <div
                                        ref={mapRef}
                                        className="w-full h-96 lg:h-[600px]"
                                        style={{ minHeight: '400px' }}
                                    />
                                    {filteredLeads.length === 0 && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                                            <div className="text-center">
                                                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                                <p className="text-gray-600 font-medium">No leads to display</p>
                                                <p className="text-gray-500 text-sm mt-1">
                                                    Try adjusting your filters or date selection
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="p-6">
                                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                                        {filteredLeads.length > 0 ? (
                                            filteredLeads.map((lead, index) => (
                                                <div
                                                    key={lead._id}
                                                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center space-x-3 mb-2">
                                                                <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-500 text-white text-xs font-bold rounded-full">
                                                                    {index + 1}
                                                                </span>
                                                                <h3 className="text-lg font-semibold text-gray-900">
                                                                    {lead.propertyName || 'Property Lead'}
                                                                </h3>
                                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${lead.isCrossed
                                                                    ? 'bg-red-100 text-red-800'
                                                                    : 'bg-green-100 text-green-800'
                                                                    }`}>
                                                                    {lead.isCrossed ? 'Crossed' : 'Active'}
                                                                </span>
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                                                <div className="flex items-center">
                                                                    <User className="h-4 w-4 mr-2" />
                                                                    {lead.ownerName || 'N/A'}
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <Phone className={`h-4 w-4 mr-2 ${lead.ownerContact ? 'text-green-500' : 'text-gray-400'}`} />
                                                                    {lead.ownerContact || 'No contact'}
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <MapPin className="h-4 w-4 mr-2" />
                                                                    {lead.location?.address || 'Location not specified'}
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                                                                    {lead.askingPrice ? `₹${lead.askingPrice.toLocaleString()}` : 'Price not specified'}
                                                                </div>
                                                            </div>

                                                            <div className="mt-3 text-xs text-gray-500">
                                                                Added: {new Date(lead.createdAt).toLocaleString()}
                                                            </div>
                                                        </div>

                                                        {lead.images && lead.images.length > 0 && (
                                                            <div className="ml-4">
                                                                <img
                                                                    src={lead.images[0].url}
                                                                    alt={lead.propertyName}
                                                                    className="w-20 h-20 object-cover rounded-lg"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-12">
                                                <List className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                                <p className="text-gray-600 font-medium">No leads found</p>
                                                <p className="text-gray-500 text-sm mt-1">
                                                    Try adjusting your filters or date selection
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Stats</h3>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                    <div className="flex items-center">
                                        <Eye className="h-5 w-5 text-blue-500 mr-2" />
                                        <span className="text-sm font-medium text-gray-700">Viewing</span>
                                    </div>
                                    <span className="text-sm font-bold text-blue-600">
                                        {filteredLeads.length} leads
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                    <div className="flex items-center">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                        <span className="text-sm font-medium text-gray-700">Active</span>
                                    </div>
                                    <span className="text-sm font-bold text-green-600">
                                        {filteredLeads.filter(lead => !lead.isCrossed).length}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                    <div className="flex items-center">
                                        <Phone className="h-5 w-5 text-purple-500 mr-2" />
                                        <span className="text-sm font-medium text-gray-700">Contactable</span>
                                    </div>
                                    {/* <span className="text-sm font-bold text-purple-600">
                                        {filteredLeads.filter(lead => lead.ownerContact).length}
                                    </span> */}
                                    {/* <span className="text-sm font-bold text-purple-600">
                                        {
                                            filteredLeads.filter(
                                                lead =>
                                                    typeof lead.ownerContact === 'string' &&
                                                    /^[0-9]{10}$/.test(lead.ownerContact.trim())
                                            ).length
                                        }
                                    </span> */}
                                    <span className="text-sm font-bold text-purple-600">
                                        {
                                            filteredLeads.filter(lead => {
                                                const contact = lead.ownerContact || '';
                                                return /\b\d{10}\b/.test(contact); // at least one valid 10-digit number
                                            }).length
                                        }
                                    </span>



                                </div>

                                <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                                    <div className="flex items-center">
                                        <DollarSign className="h-5 w-5 text-indigo-500 mr-2" />
                                        <span className="text-sm font-medium text-gray-700">Avg Price</span>
                                    </div>
                                    <span className="text-sm font-bold text-indigo-600">
                                        ₹{filteredLeads.length > 0
                                            ? (filteredLeads.reduce((sum, lead) => sum + (lead.askingPrice || 0), 0) / filteredLeads.length / 100000).toFixed(1)
                                            : 0}L
                                    </span>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h4 className="text-md font-medium text-gray-700 mb-4">Recent Activity</h4>
                                <div className="space-y-3">
                                    {filteredLeads.slice(0, 3).map((lead, index) => (
                                        <div key={lead._id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {lead.propertyName || 'Property Lead'}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(lead.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesmanLeadsMap;