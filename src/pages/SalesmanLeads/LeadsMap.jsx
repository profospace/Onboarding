
import React, { useState, useEffect, useRef } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';
import { MapPin, User, Phone, Building, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { base_url } from '../../../utils/base_url';

const LeadsMap = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedLead, setSelectedLead] = useState(null);
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef([]);
    const infoWindowRef = useRef(null);
    const navigate = useNavigate();

    // Fetch leads data
    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${base_url}/api/salesman/property/leads/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch leads');
            }

            const data = await response.json();
            console.log("response", data)
            setLeads(data.data?.leads || []);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching leads:', err);
        } finally {
            setLoading(false);
        }
    };

    // Initialize Google Map
    const initMap = (map) => {
        mapInstanceRef.current = map;

        // Clear existing markers
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        if (leads.length === 0) return;

        // Create bounds to fit all markers
        const bounds = new window.google.maps.LatLngBounds();

        // Create markers for each lead
        leads.forEach(lead => {
            if (!lead.location?.latitude || !lead.location?.longitude) return;

            const position = {
                lat: lead.location.latitude,
                lng: lead.location.longitude
            };

            // Use default Google Maps marker (red pin)
            // For crossed leads, we'll use a different color
            const markerIcon = lead.isCrossed
                ? 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'  // Red for crossed
                : 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'; // Green for active

            const marker = new window.google.maps.Marker({
                position,
                map,
                title: lead.propertyName || 'Property Lead',
                icon: markerIcon,
                animation: window.google.maps.Animation.DROP
            });

            // Create info window content
            const infoWindowContent = `
        <div class="p-4 max-w-sm">
          <div class="flex items-start justify-between mb-3">
            <h3 class="font-semibold text-lg text-gray-800">${lead.propertyName || 'Property Lead'}</h3>
            ${lead.isCrossed ? '<span class="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Crossed</span>' : '<span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>'}
          </div>
          
          <div class="space-y-2 text-sm text-gray-600">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span>${lead.ownerName || 'No owner name'}</span>
            </div>
            
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              <span>${lead.ownerContact || 'No contact'}</span>
            </div>
            
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span>Lat: ${lead.location.latitude.toFixed(4)}, Lng: ${lead.location.longitude.toFixed(4)}</span>
            </div>
          </div>
          
          <div class="mt-4 pt-3 border-t border-gray-200">
            <button 
              onclick="window.viewLeadDetails('${lead._id}')"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
            >
              View Details
            </button>
          </div>
        </div>
      `;

            const infoWindow = new window.google.maps.InfoWindow({
                content: infoWindowContent,
                maxWidth: 300
            });

            // Add click listener to marker - tap to view details
            marker.addListener('click', () => {
                // Close any open info windows
                if (infoWindowRef.current) {
                    infoWindowRef.current.close();
                }

                infoWindow.open(map, marker);
                infoWindowRef.current = infoWindow;
                setSelectedLead(lead);
            });

            markersRef.current.push(marker);
            bounds.extend(position);
        });

        // Fit map to show all markers
        if (leads.length > 0) {
            map.fitBounds(bounds);

            // Ensure minimum zoom level
            const listener = window.google.maps.event.addListener(map, 'idle', () => {
                if (map.getZoom() > 15) map.setZoom(15);
                window.google.maps.event.removeListener(listener);
            });
        }
    };

    // Map component
    const MapComponent = ({ center, zoom }) => {
        useEffect(() => {
            if (mapRef.current && window.google) {
                const map = new window.google.maps.Map(mapRef.current, {
                    center,
                    zoom,
                    styles: [
                        {
                            featureType: 'poi',
                            elementType: 'labels',
                            stylers: [{ visibility: 'off' }]
                        },
                        {
                            featureType: 'transit.station',
                            elementType: 'labels',
                            stylers: [{ visibility: 'off' }]
                        }
                    ],
                    mapTypeControl: true,
                    streetViewControl: true,
                    fullscreenControl: true,
                    zoomControl: true,
                });

                initMap(map);
            }
        }, [center, zoom, leads]);

        return <div ref={mapRef} className="w-full h-full" />;
    };

    // Global function for info window buttons
    useEffect(() => {
        window.viewLeadDetails = (leadId) => {
            navigate(`/lead/${leadId}`);
        };

        return () => {
            delete window.viewLeadDetails;
        };
    }, [navigate]);

    const handleBackClick = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading leads map...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        Error: {error}
                    </div>
                    <button
                        onClick={fetchLeads}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleBackClick}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="hidden sm:inline">Back</span>
                    </button>
                    <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-6 h-6 text-blue-600" />
                        <h1 className="text-xl font-semibold text-gray-800">Leads Map</h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-600">
                        <span className="font-medium">{leads.length}</span> leads found
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-xs text-gray-600">Active</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span className="text-xs text-gray-600">Crossed</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Map Container */}
            <div className="flex-1 relative">
                {leads.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
                            <p className="text-gray-500">There are no leads with location data to display on the map.</p>
                        </div>
                    </div>
                ) : (
                    <Wrapper >
                        <MapComponent
                            center={{ lat: 28.6139, lng: 77.2090 }} // Default to Delhi
                            zoom={10}
                        />
                    </Wrapper>
                )}

                {/* Stats Overlay */}
                <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
                    <h3 className="font-semibold text-gray-800 mb-3">Quick Stats</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total Leads:</span>
                            <span className="font-medium">{leads.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Active:</span>
                            <span className="font-medium text-green-600">
                                {leads.filter(lead => !lead.isCrossed).length}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Crossed:</span>
                            <span className="font-medium text-red-600">
                                {leads.filter(lead => lead.isCrossed).length}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Mobile Responsive Info */}
                <div className="absolute bottom-4 left-4 right-4 sm:hidden">
                    <div className="bg-white rounded-lg shadow-lg p-3">
                        <p className="text-sm text-gray-600 text-center">
                            Tap markers to view lead details
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadsMap;