import React from 'react';

interface FeaturesSectionProps {
    formData: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    handleMultiSelectChange: (name: string, values: string[]) => void;
    errors: any;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({
    formData,
    handleChange,
    handleMultiSelectChange,
    errors
}) => {
    // Common amenities
    const amenitiesOptions = [
        "Swimming Pool",
        "Gym",
        "Garden/Park",
        "Clubhouse",
        "Children's Play Area",
        "Security",
        "CCTV Surveillance",
        "Fire Safety",
        "Lift/Elevator",
        "Power Backup",
        "Indoor Games",
        "Outdoor Sports",
        "Community Hall",
        "Rainwater Harvesting",
        "Senior Citizen Area",
        "Jogging Track",
        "Meditation Area",
        "Yoga Deck",
        "Cafeteria",
        "Library",
        "Theatre",
        "Banquet Hall",
        "Lounge",
        "Terrace Garden",
        "Car Parking",
        "Visitor Parking",
        "Servant Quarter",
        "Solar Power",
        "Water Treatment",
        "Waste Disposal",
        "Intercom",
        "Internet/Wi-Fi Connectivity"
    ];

    // Water source options
    const waterSourceOptions = [
        "Municipal Corporation",
        "Borewell",
        "Water Tanker",
        "24x7 Water Supply",
        "Rainwater Harvesting"
    ];

    // Power backup options
    const powerBackupOptions = [
        "None",
        "Partial",
        "Full",
        "Inverter",
        "Generator"
    ];

    // Function to toggle amenities
    const toggleAmenity = (amenity: string) => {
        let updatedAmenities;

        if (formData.amenities?.includes(amenity)) {
            updatedAmenities = formData.amenities.filter((a: string) => a !== amenity);
        } else {
            updatedAmenities = [...(formData.amenities || []), amenity];
        }

        handleMultiSelectChange('amenities', updatedAmenities);
    };

    // Function to toggle water source
    const toggleWaterSource = (source: string) => {
        let updatedSources;

        if (formData.waterSource?.includes(source)) {
            updatedSources = formData.waterSource.filter((s: string) => s !== source);
        } else {
            updatedSources = [...(formData.waterSource || []), source];
        }

        handleMultiSelectChange('waterSource', updatedSources);
    };

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden transition-all">
            <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-medium text-gray-900">Features & Amenities</h2>
                <p className="mt-1 text-sm text-gray-500">
                    Select the features and amenities available with this property.
                </p>
            </div>

            <div className="px-6 py-4 space-y-6">
                {/* Amenities */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Amenities
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {amenitiesOptions.map(amenity => (
                            <div key={amenity} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`amenity-${amenity}`}
                                    checked={formData.amenities?.includes(amenity) || false}
                                    onChange={() => toggleAmenity(amenity)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor={`amenity-${amenity}`} className="ml-2 block text-sm text-gray-700">
                                    {amenity}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Water Source */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Water Source
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {waterSourceOptions.map(source => (
                            <div key={source} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`water-${source}`}
                                    checked={formData.waterSource?.includes(source) || false}
                                    onChange={() => toggleWaterSource(source)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor={`water-${source}`} className="ml-2 block text-sm text-gray-700">
                                    {source}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Power Backup */}
                <div>
                    <label htmlFor="powerBackup" className="block text-sm font-medium text-gray-700 mb-1">
                        Power Backup
                    </label>
                    <select
                        id="powerBackup"
                        name="powerBackup"
                        value={formData.powerBackup || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Select power backup option</option>
                        {powerBackupOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>

                {/* Possession Date */}
                <div>
                    <label htmlFor="possessionDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Possession Date
                    </label>
                    <input
                        type="date"
                        id="possessionDate"
                        name="possessionDate"
                        value={formData.possessionDate || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        For ready-to-move properties, you can select today's date
                    </p>
                </div>

                {/* Additional Features */}
                <div>
                    {/* <h3 className="text-sm font-medium text-gray-700 mb-3">
                        Additional Features
                    </h3> */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Status Dropdown */}
                        {/* <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                Property Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status || ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="listed">Listed</option>
                                <option value="unlisted">Unlisted</option>
                                <option value="payment-delay">Payment Delay</option>
                                <option value="suspicious">Suspicious</option>
                            </select>
                        </div> */}

                        {/* Available Checkbox */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="available"
                                name="available"
                                checked={formData.available || false}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="available" className="ml-2 block text-sm text-gray-700">
                                Available for possession
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeaturesSection;