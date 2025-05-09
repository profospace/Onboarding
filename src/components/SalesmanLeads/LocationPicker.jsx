import React, { useRef, useState, useEffect } from 'react';
import { GoogleMap, Marker, StandaloneSearchBox } from '@react-google-maps/api';
import { toast } from 'react-hot-toast';
import {
    MapMarkerIcon,
    SearchIcon,
    NavigationIcon,
    LoaderIcon
} from './Icons';

// Map container style
const mapContainerStyle = {
    width: '100%',
    height: '400px',
};

// Default center (India)
const defaultCenter = {
    lat: 20.5937,
    lng: 78.9629,
};

const libraries = ['places'];

const LocationPicker = ({ initialLocation, onLocationChange, onAddressChange }) => {
    // Map references
    const mapRef = useRef(null);
    const searchBoxRef = useRef(null);
    const geocoderRef = useRef(null);

    // State for location
    const [location, setLocation] = useState({
        latitude: initialLocation?.latitude || defaultCenter.lat,
        longitude: initialLocation?.longitude || defaultCenter.lng,
    });

    // State for search address
    const [searchAddress, setSearchAddress] = useState('');

    // Loading state
    const [loadingLocation, setLoadingLocation] = useState(false);

    // Update parent component when location changes
    useEffect(() => {
        onLocationChange(location);
    }, [location]);

    // Initialize geocoder and try to get address for current location on mount
    useEffect(() => {
        if (initialLocation?.latitude && initialLocation?.longitude && geocoderRef.current) {
            geocoderRef.current.geocode(
                {
                    location: {
                        lat: initialLocation.latitude,
                        lng: initialLocation.longitude
                    }
                },
                (results, status) => {
                    if (status === 'OK' && results && results[0]) {
                        setSearchAddress(results[0].formatted_address);
                        if (onAddressChange) {
                            onAddressChange(results[0].formatted_address);
                        }
                    }
                }
            );
        }
    }, [initialLocation, geocoderRef.current]);

    // Handle map load
    const onMapLoad = (map) => {
        geocoderRef.current = new window.google.maps.Geocoder();
        mapRef.current = map;
    };

    // Handle search box load
    const onSearchBoxLoad = (searchBox) => {
        searchBoxRef.current = searchBox;
    };

    // Handle places changed in search box
    const onPlacesChanged = () => {
        if (searchBoxRef.current) {
            const places = searchBoxRef.current.getPlaces();

            if (places && places.length === 0) {
                return;
            }

            const place = places?.[0];

            if (!place?.geometry || !place.geometry.location) {
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

            if (onAddressChange) {
                onAddressChange(place.formatted_address || '');
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
                                    if (onAddressChange) {
                                        onAddressChange(results[0].formatted_address);
                                    }
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
                        if (onAddressChange) {
                            onAddressChange(results[0].formatted_address);
                        }
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
                        if (onAddressChange) {
                            onAddressChange(results[0].formatted_address);
                        }
                    } else {
                        setSearchAddress('');
                    }
                }
            );
        }

        toast.success('Location updated');
    };

    // Handle search address input changes
    const handleSearchAddressChange = (e) => {
        setSearchAddress(e.target.value);
    };

    return (
        <div className="space-y-4">
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
                            className="flex-1 w-[60vw] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                    </StandaloneSearchBox>
                    <button
                        type="button"
                        onClick={handleAddressSearch}
                        className="flex-shrink-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <SearchIcon className="w-5 h-5" />
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    Enter address or drag marker to update location
                </p>
            </div>

            {/* Google Map */}
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
                    libraries={libraries}
                >
                    <Marker
                        position={{ lat: location.latitude, lng: location.longitude }}
                        draggable={true}
                        onDragEnd={handleMarkerDragEnd}
                    />
                </GoogleMap>
            </div>

            {/* Location Inputs and Button */}
            <div className="md:flex md:space-x-4 space-y-4 md:space-y-0 mb-4">
                {/* Coordinates */}
                <div className="grid grid-cols-2 gap-3 md:w-2/3">
                    {/* Latitude input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Latitude *
                        </label>
                        <input
                            type="text"
                            name="latitude"
                            value={location.latitude}
                            onChange={(e) => setLocation({
                                ...location,
                                latitude: parseFloat(e.target.value) || 0
                            })}
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
                            type="text"
                            name="longitude"
                            value={location.longitude}
                            onChange={(e) => setLocation({
                                ...location,
                                longitude: parseFloat(e.target.value) || 0
                            })}
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
                                <LoaderIcon className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                                Getting Location...
                            </>
                        ) : (
                            <>
                                <NavigationIcon className="w-4 h-4 mr-2" />
                                Use My Current Location
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Display selected address */}
            {searchAddress && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-gray-700">
                        <span className="font-medium">Selected Address:</span> {searchAddress}
                    </p>
                </div>
            )}
        </div>
    );
};

export default LocationPicker;