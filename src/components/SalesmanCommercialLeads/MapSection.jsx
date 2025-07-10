import React from 'react';

const MapSection = ({ location }) => {
    if (!location) {
        return (
            <div className="bg-gray-100 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Location</h3>
                <div className="h-48 bg-gray-200 flex items-center justify-center rounded">
                    <p className="text-gray-500">No location data available</p>
                </div>
            </div>
        );
    }

    // Create Google Maps URL with the location coordinates
    const googleMapsUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}&z=15`;

    // Create a static map image URL
    const width = 400;
    const height = 300;
    const zoom = 15;
    const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${location.latitude},${location.longitude}&zoom=${zoom}&size=${width}x${height}&markers=color:red%7C${location.latitude},${location.longitude}&key=YOUR_API_KEY`;

    return (
        <div className="bg-gray-100 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Location</h3>
            <div className="rounded-lg overflow-hidden border border-gray-300 mb-3">
                {/* For a real implementation, you would use the Google Maps API with a valid key */}
                {/* For this demo, we'll show a placeholder with coordinates */}
                <div className="bg-blue-50 h-48 flex items-center justify-center">
                    <div className="text-center">
                        <svg className="w-10 h-10 text-blue-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <p className="text-sm text-blue-700">
                            Latitude: {location.latitude.toFixed(6)}<br />
                            Longitude: {location.longitude.toFixed(6)}
                        </p>
                    </div>
                </div>
            </div>
            <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
                View on Google Maps
            </a>
        </div>
    );
};

export default MapSection;