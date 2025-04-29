import React, { useEffect, useRef, useState } from 'react';

interface GoogleMapProps {
    latitude: string;
    longitude: string;
    onPositionChange: (lat: string, lng: string) => void;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
    latitude,
    longitude,
    onPositionChange
}) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [marker, setMarker] = useState<google.maps.Marker | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load Google Maps API
    useEffect(() => {
        // Check if Google Maps API is already loaded
        if (window.google && window.google.maps) {
            setIsLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => setIsLoaded(true);

        document.head.appendChild(script);

        return () => {
            // Cleanup if component unmounts before script loads
            document.head.removeChild(script);
        };
    }, []);

    // Initialize map when the API is loaded
    useEffect(() => {
        if (!isLoaded || !mapRef.current) return;

        // Parse coordinates, fallback to default if invalid
        const lat = parseFloat(latitude) || 19.0760;
        const lng = parseFloat(longitude) || 72.8777;
        const position = { lat, lng };

        // Create map instance
        const mapOptions: google.maps.MapOptions = {
            zoom: 15,
            center: position,
            mapTypeControl: true,
            streetViewControl: false,
            fullscreenControl: true,
            zoomControl: true,
        };

        const newMap = new google.maps.Map(mapRef.current, mapOptions);
        setMap(newMap);

        // Create marker
        const newMarker = new google.maps.Marker({
            position,
            map: newMap,
            draggable: true,
            animation: google.maps.Animation.DROP,
        });
        setMarker(newMarker);

        // Add event listener for marker drag
        newMarker.addListener('dragend', () => {
            const position = newMarker.getPosition();
            if (position) {
                onPositionChange(
                    position.lat().toFixed(6),
                    position.lng().toFixed(6)
                );
            }
        });

        // Add event listener for map click
        newMap.addListener('click', (e: google.maps.MapMouseEvent) => {
            if (e.latLng && newMarker) {
                newMarker.setPosition(e.latLng);
                onPositionChange(
                    e.latLng.lat().toFixed(6),
                    e.latLng.lng().toFixed(6)
                );
            }
        });

    }, [isLoaded, latitude, longitude, onPositionChange]);

    // Update marker position when lat/lng inputs change
    useEffect(() => {
        if (!map || !marker || !isLoaded) return;

        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);

        // Only update if we have valid coordinates
        if (!isNaN(lat) && !isNaN(lng)) {
            const newPosition = new google.maps.LatLng(lat, lng);
            marker.setPosition(newPosition);
            map.panTo(newPosition);
        }
    }, [latitude, longitude, map, marker, isLoaded]);

    return (
        <div className="relative">
            <div
                ref={mapRef}
                className="w-full h-80 rounded-lg shadow-md"
            >
                {!isLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                        <div className="text-gray-500">Loading map...</div>
                    </div>
                )}
            </div>
            {!window.google && (
                <div className="mt-2 text-sm text-yellow-600">
                    Note: You will need to add your Google Maps API key to the environment variables.
                </div>
            )}
        </div>
    );
};

export default GoogleMap;