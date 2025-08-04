
import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '8px'
};

const defaultCenter = {
    lat: 28.6139, // Default to New Delhi, India
    lng: 77.2090
};

const LocationPicker = ({ address, city, latitude, longitude, onLocationSelect, preventAutoGeocode }) => {
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);
    const [center, setCenter] = useState(defaultCenter);
    const [isLoading, setIsLoading] = useState(false);
    const [locationError, setLocationError] = useState('');

    // Geocode the address when it changes
    // useEffect(() => {
    //     if (address && city && window.google && window.google.maps) {
    //         geocodeAddress(`${address}, ${city}`);
    //     }
    // }, [address, city]);

    // Update this useEffect to respect the preventAutoGeocode flag
    useEffect(() => {
        // CHANGE THIS CONDITION - add preventAutoGeocode check
        if (address && city && window.google && window.google.maps && !preventAutoGeocode) {
            geocodeAddress(`${address}, ${city}`);
        }
    }, [address, city, preventAutoGeocode]); // ADD preventAutoGeocode to dependencies

    // Function to geocode address to coordinates
    const geocodeAddress = useCallback((fullAddress) => {
        if (!fullAddress || !window.google) return;

        setIsLoading(true);
        const geocoder = new window.google.maps.Geocoder();

        geocoder.geocode({ address: fullAddress }, (results, status) => {
            setIsLoading(false);

            if (status === 'OK' && results[0]) {
                const position = {
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng()
                };

                setCenter(position);
                setMarker(position);

                if (onLocationSelect) {
                    onLocationSelect(position);
                }
            }
        });
    }, [onLocationSelect]);

    // Add this function after geocodeAddress function
    const reverseGeocode = useCallback((position) => {
        if (!window.google || !window.google.maps) return;

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: position }, (results, status) => {
            if (status === 'OK' && results[0]) {
                const result = results[0];
                const addressComponents = result.address_components;

                // Extract address components
                let street = '';
                let locality = '';
                let city = '';
                let pincode = '';

                addressComponents.forEach(component => {
                    const types = component.types;
                    if (types.includes('street_number') || types.includes('route')) {
                        street += component.long_name + ' ';
                    }
                    if (types.includes('sublocality') || types.includes('neighborhood')) {
                        locality = component.long_name;
                    }
                    if (types.includes('locality') || types.includes('administrative_area_level_2')) {
                        city = component.long_name;
                    }
                    if (types.includes('postal_code')) {
                        pincode = component.long_name;
                    }
                });

                // Call callback with extracted data
                if (onLocationSelect) {
                    onLocationSelect({
                        ...position,
                        address: street.trim() || result.formatted_address,
                        locality: locality,
                        city: city,
                        pincode: pincode
                    });
                }
            }
        });
    }, [onLocationSelect]);

    // Handle map click to set marker position
    // const handleMapClick = useCallback((event) => {
    //     const position = {
    //         lat: event.latLng.lat(),
    //         lng: event.latLng.lng()
    //     };

    //     setMarker(position);

    //     if (onLocationSelect) {
    //         onLocationSelect(position);
    //     }

    //     // Reverse geocode to get address (optional)
    //     if (window.google && window.google.maps) {
    //         const geocoder = new window.google.maps.Geocoder();
    //         geocoder.geocode({ location: position }, (results, status) => {
    //             if (status === 'OK' && results[0]) {
    //                 console.log('Address:', results[0].formatted_address);
    //             }
    //         });
    //     }
    // }, [onLocationSelect]);

    // Replace existing handleMapClick function
    const handleMapClick = useCallback((event) => {
        const position = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        };

        setMarker(position);

        // Reverse geocode to get address details
        reverseGeocode(position);
    }, [reverseGeocode]);

    // Add this useEffect after existing useEffects
    useEffect(() => {
        // Auto-fetch current location on component mount
        if (navigator.geolocation && !marker) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const currentPosition = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    setCenter(currentPosition);
                    setMarker(currentPosition);

                    // Reverse geocode to get address details
                    reverseGeocode(currentPosition);
                },
                (error) => {
                    console.log('Auto location fetch failed:', error);
                    // Silently fail, user can still use manual location
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 300000 // 5 minutes
                }
            );
        }
    }, []); // Empty dependency array to run only once on mount

    // Function to handle map load
    const onLoad = useCallback((map) => {
        setMap(map);
    }, []);

    // Function to handle map unmount
    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    // Function to get current location
    const getCurrentLocation = () => {
        setIsLoading(true);
        setLocationError('');

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const currentPosition = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    setCenter(currentPosition);
                    setMarker(currentPosition);

                    if (onLocationSelect) {
                        onLocationSelect(currentPosition);
                    }

                    setIsLoading(false);

                    // Optional: Reverse geocode to get address
                    if (window.google && window.google.maps) {
                        const geocoder = new window.google.maps.Geocoder();
                        geocoder.geocode({ location: currentPosition }, (results, status) => {
                            if (status === 'OK' && results[0]) {
                                console.log('Current location address:', results[0].formatted_address);
                            }
                        });
                    }
                },
                (error) => {
                    setIsLoading(false);
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            setLocationError("Location access was denied. Please enable location services.");
                            break;
                        case error.POSITION_UNAVAILABLE:
                            setLocationError("Location information is unavailable.");
                            break;
                        case error.TIMEOUT:
                            setLocationError("The request to get location timed out.");
                            break;
                        default:
                            setLocationError("An unknown error occurred while getting location.");
                            break;
                    }
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        } else {
            setIsLoading(false);
            setLocationError("Geolocation is not supported by this browser.");
        }
    };

    // ADD THIS NEW useEffect after the existing ones
    useEffect(() => {
        // Update map center and marker when coordinates are manually entered
        if (latitude && longitude && !isNaN(latitude) && !isNaN(longitude)) {
            const position = { lat: parseFloat(latitude), lng: parseFloat(longitude) };
            setCenter(position);
            setMarker(position);
        }
    }, [latitude, longitude]);

   

    return (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                    Property Location
                </label>
                <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Getting Location...
                        </>
                    ) : (
                        <>
                            <svg className="mr-1.5 -ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Get Current Location
                        </>
                    )}
                </button>
            </div>

            {isLoading && (
                <div className="text-sm text-gray-500 mb-2">Finding location on map...</div>
            )}

            {locationError && (
                <div className="text-sm text-red-500 mb-2">{locationError}</div>
            )}

            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={14}
                onClick={handleMapClick}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={{
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: true,
                }}
            >
                {/* {marker && <Marker position={marker} draggable={true} onDragEnd={(e) => {
                        const position = {
                            lat: e.latLng.lat(),
                            lng: e.latLng.lng()
                        };
                        setMarker(position);
                        onLocationSelect(position);
                    }} />} */}

                    // In the GoogleMap component, update the Marker component
                {marker && <Marker
                    position={marker}
                    draggable={true}
                    onDragEnd={(e) => {
                        const position = {
                            lat: e.latLng.lat(),
                            lng: e.latLng.lng()
                        };
                        setMarker(position);

                        // Reverse geocode to get address details when marker is dragged
                        reverseGeocode(position);
                    }}
                />}
            </GoogleMap>

            {marker && (
                <div className="mt-2 text-sm text-gray-500">
                    Selected coordinates: {marker.lat.toFixed(6)}, {marker.lng.toFixed(6)}
                </div>
            )}
            <div className="mt-2 text-xs text-gray-500">
                Click on the map to set your property's exact location or drag the marker to adjust.
            </div>
        </div>
    );
};

export default LocationPicker;

