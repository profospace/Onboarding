import React, { useEffect, useState } from 'react';

interface LocationSectionProps {
    formData: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    errors: any;
}

const LocationSection: React.FC<LocationSectionProps> = ({
    formData,
    handleChange,
    errors
}) => {
    // State for map display
    const [showMap, setShowMap] = useState(false);

    // Just for illustration - in a real app, you would use a map API
    const toggleMapDisplay = () => {
        setShowMap(!showMap);
    };

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden transition-all">
            <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-medium text-gray-900">Location</h2>
                <p className="mt-1 text-sm text-gray-500">
                    Provide the exact location details for your property.
                </p>
            </div>

            <div className="px-6 py-4 space-y-6">
                {/* Address */}
                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="address"
                        name="address"
                        value={formData.address || ''}
                        onChange={handleChange}
                        rows={2}
                        className={`w-full px-3 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Enter the complete address"
                    />
                    {errors.address && (
                        <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                    )}
                </div>

                {/* City & Locality */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                            City <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city || ''}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                            placeholder="e.g. Mumbai"
                        />
                        {errors.city && (
                            <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="locality" className="block text-sm font-medium text-gray-700 mb-1">
                            Locality/Area <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="locality"
                            name="locality"
                            value={formData.locality || ''}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border ${errors.locality ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                            placeholder="e.g. Bandra West"
                        />
                        {errors.locality && (
                            <p className="mt-1 text-sm text-red-600">{errors.locality}</p>
                        )}
                    </div>
                </div>

                {/* Latitude & Longitude */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
                            Latitude
                        </label>
                        <input
                            type="text"
                            id="latitude"
                            name="latitude"
                            value={formData.latitude || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g. 19.0760"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Decimal coordinates (e.g. 19.0760)
                        </p>
                    </div>

                    <div>
                        <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">
                            Longitude
                        </label>
                        <input
                            type="text"
                            id="longitude"
                            name="longitude"
                            value={formData.longitude || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g. 72.8777"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Decimal coordinates (e.g. 72.8777)
                        </p>
                    </div>
                </div>

                {/* Map Placeholder */}
                <div>
                    <button
                        type="button"
                        onClick={toggleMapDisplay}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {showMap ? 'Hide Map' : 'Show Map'}
                    </button>

                    {showMap && (
                        <div className="mt-4 border border-gray-300 rounded-lg overflow-hidden">
                            <div className="aspect-w-16 aspect-h-9 bg-gray-100 flex items-center justify-center">
                                <div className="text-center p-4">
                                    <p className="text-gray-500">Map would be displayed here using an external map service.</p>
                                    <p className="text-sm text-gray-400 mt-2">
                                        In a production app, this would integrate with Google Maps, Mapbox, or another mapping service.
                                    </p>
                                    {formData.latitude && formData.longitude && (
                                        <p className="text-sm font-medium text-blue-600 mt-2">
                                            Current coordinates: {formData.latitude}, {formData.longitude}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 border-t border-gray-200">
                                <p className="text-sm text-gray-600">
                                    You can click on the map to set the coordinates or enter them manually in the fields above.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Floor & Facing */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="floor" className="block text-sm font-medium text-gray-700 mb-1">
                            Floor Number
                        </label>
                        <input
                            type="number"
                            id="floor"
                            name="floor"
                            value={formData.floor || ''}
                            onChange={handleChange}
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            0 for Ground Floor
                        </p>
                    </div>

                    <div>
                        <label htmlFor="totalFloors" className="block text-sm font-medium text-gray-700 mb-1">
                            Total Floors in Building
                        </label>
                        <input
                            type="number"
                            id="totalFloors"
                            name="totalFloors"
                            value={formData.totalFloors || ''}
                            onChange={handleChange}
                            min="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="facing" className="block text-sm font-medium text-gray-700 mb-1">
                            Facing Direction
                        </label>
                        <select
                            id="facing"
                            name="facing"
                            value={formData.facing || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select facing</option>
                            <option value="North">North</option>
                            <option value="South">South</option>
                            <option value="East">East</option>
                            <option value="West">West</option>
                            <option value="North-East">North-East</option>
                            <option value="North-West">North-West</option>
                            <option value="South-East">South-East</option>
                            <option value="South-West">South-West</option>
                        </select>
                    </div>
                </div>

                {/* Road Width */}
                <div>
                    <label htmlFor="widthOfFacingRoad" className="block text-sm font-medium text-gray-700 mb-1">
                        Width of Facing Road (in feet)
                    </label>
                    <input
                        type="number"
                        id="widthOfFacingRoad"
                        name="widthOfFacingRoad"
                        value={formData.widthOfFacingRoad || ''}
                        onChange={handleChange}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g. 20"
                    />
                </div>

                {/* Additional Location Checkboxes */}
                <div>
                    <div className="flex items-center mb-4">
                        <input
                            type="checkbox"
                            id="gatedCommunity"
                            name="gatedCommunity"
                            checked={formData.gatedCommunity || false}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="gatedCommunity" className="ml-2 block text-sm text-gray-700">
                            Gated Community
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="petFriendly"
                            name="petFriendly"
                            checked={formData.petFriendly || false}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="petFriendly" className="ml-2 block text-sm text-gray-700">
                            Pet Friendly
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationSection;