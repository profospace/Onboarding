import React from 'react';

interface AdditionalDetailsSectionProps {
    formData: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    handleMultiSelectChange: (name: string, values: string[]) => void;
    errors: any;
}

const AdditionalDetailsSection: React.FC<AdditionalDetailsSectionProps> = ({
    formData,
    handleChange,
    handleMultiSelectChange,
    errors
}) => {
    // Arrays for multi-select options
    const vastuComplianceOptions = [
        'North-East Entry',
        'South-East Kitchen',
        'North-East Master Bedroom',
        'South-West Storage',
        'West-facing Study'
    ];

    const loanApprovalStatusOptions = [
        'Pre-Approved',
        'Bank Approved',
        'Multiple Bank Approvals',
        'Under Process',
        'Not Applied'
    ];

    const builderReputationOptions = [
        'Excellent',
        'Very Good',
        'Good',
        'Average',
        'New Builder'
    ];

    const locationFactorsOptions = [
        'Prime Location',
        'Near Metro',
        'Near Market',
        'Near Schools',
        'Near Hospital',
        'Near Park',
        'Near Highway'
    ];

    const overlookingAmenitiesOptions = [
        'Garden/Park',
        'Swimming Pool',
        'Club House',
        'Main Road',
        'Lake/Water Body'
    ];

    const religiousNearbyOptions = [
        'Temple',
        'Mosque',
        'Church',
        'Gurudwara'
    ];

    const inProximityOptions = [
        'School',
        'College',
        'Hospital',
        'Shopping Mall',
        'Metro Station',
        'Bus Stop',
        'Railway Station',
        'Airport'
    ];

    const propertyTypesOptions = [
        'Independent House',
        'Apartment',
        'Villa',
        'Plot',
        'Commercial Space'
    ];

    const propertyFeaturesOptions = [
        'Corner Property',
        'Park Facing',
        'Private Garden',
        'Private Pool',
        'Terrace'
    ];

    const viewTypesOptions = [
        'City View',
        'Garden View',
        'Pool View',
        'Mountain View',
        'Lake View',
        'Sea View'
    ];

    const legalClearanceOptions = [
        'Clear Title',
        'No Litigation',
        'All Approvals',
        'Under Verification'
    ];

    const propertyConditionsOptions = [
        'Brand New',
        'Well Maintained',
        'Newly Renovated',
        'Needs Renovation',
        'Under Construction'
    ];

    const legalStatusesOptions = [
        'Freehold',
        'Leasehold',
        'Power of Attorney',
        'Co-operative Society'
    ];

    const environmentalFactorsOptions = [
        'Green Building',
        'Solar Powered',
        'Rainwater Harvesting',
        'Waste Management',
        'Organic Garden'
    ];

    const kitchenTypeOptions = [
        'Modular',
        'Semi-Modular',
        'Open Kitchen',
        'Closed Kitchen',
        'Parallel Kitchen'
    ];

    const bathroomFeaturesOptions = [
        'Bathtub',
        'Shower Enclosure',
        'Premium Fittings',
        'Hot Water System',
        'Western Toilet'
    ];

    const specialCategoriesOptions = [
        'Senior Living',
        'Student Housing',
        'Luxury Property',
        'Vacation Home',
        'Investment Property'
    ];

    const flooringTypeOptions = [
        'Marble',
        'Vitrified',
        'Wooden',
        'Granite',
        'Ceramic Tiles'
    ];

    const socialInfrastructureOptions = [
        'Schools Nearby',
        'Hospitals Nearby',
        'Shopping Centers',
        'Entertainment Hubs',
        'Sports Facilities'
    ];

    const constructionStatusesOptions = [
        'Ready to Move',
        'Under Construction',
        'Newly Launched',
        'Partially Complete'
    ];

    const ownershipTypesOptions = [
        'Freehold',
        'Leasehold',
        'Co-operative Society',
        'Power of Attorney'
    ];

    const financingOptionsOptions = [
        'Bank Loan Available',
        'Pre-Approved Loan',
        'Self Finance',
        'Loan Against Property'
    ];

    const propertyTaxClassesOptions = [
        'Residential',
        'Commercial',
        'Agricultural',
        'Industrial'
    ];

    const environmentalCertificationsOptions = [
        'LEED Certified',
        'GRIHA Rated',
        'Energy Star',
        'Green Building'
    ];

    const propertyManagementServicesOptions = [
        '24/7 Security',
        'Housekeeping',
        'Maintenance Staff',
        'Facility Management'
    ];

    const investmentStrategiesOptions = [
        'Long Term Investment',
        'Rental Income',
        'Quick Returns',
        'Value Appreciation'
    ];

    // Function to toggle multi-select options
    const toggleOption = (field: string, value: string) => {
        const currentValues = formData[field] || [];
        let updatedValues;

        if (currentValues.includes(value)) {
            updatedValues = currentValues.filter((v: string) => v !== value);
        } else {
            updatedValues = [...currentValues, value];
        }

        handleMultiSelectChange(field, updatedValues);
    };

    // Helper function to render checkbox groups
    const renderCheckboxGroup = (title: string, field: string, options: string[]) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {title}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {options.map(option => (
                    <div key={option} className="flex items-center">
                        <input
                            type="checkbox"
                            id={`${field}-${option}`}
                            checked={formData[field]?.includes(option) || false}
                            onChange={() => toggleOption(field, option)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`${field}-${option}`} className="ml-2 block text-sm text-gray-700">
                            {option}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden transition-all">
            <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-medium text-gray-900">Additional Details</h2>
                <p className="mt-1 text-sm text-gray-500">
                    Provide additional property details and specifications.
                </p>
            </div>

            <div className="px-6 py-4 space-y-6">
                {/* Construction & Property Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="construction_status" className="block text-sm font-medium text-gray-700 mb-1">
                            Construction Status
                        </label>
                        <select
                            id="construction_status"
                            name="construction_status"
                            value={formData.construction_status || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select status</option>
                            {constructionStatusesOptions.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="propertyAge" className="block text-sm font-medium text-gray-700 mb-1">
                            Property Age (in years)
                        </label>
                        <input
                            type="number"
                            id="propertyAge"
                            name="propertyAge"
                            value={formData.propertyAge || ''}
                            onChange={handleChange}
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Project Details */}
                <div>
                    <label htmlFor="project_details" className="block text-sm font-medium text-gray-700 mb-1">
                        Project Details
                    </label>
                    <textarea
                        id="project_details"
                        name="project_details"
                        value={formData.project_details || ''}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Describe the project details..."
                    />
                </div>

                {/* Builder Reputation & Broker Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="builderReputation" className="block text-sm font-medium text-gray-700 mb-1">
                            Builder Reputation
                        </label>
                        <select
                            id="builderReputation"
                            name="builderReputation"
                            value={formData.builderReputation || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select reputation</option>
                            {builderReputationOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="broker_status" className="block text-sm font-medium text-gray-700 mb-1">
                            Broker Status
                        </label>
                        <select
                            id="broker_status"
                            name="broker_status"
                            value={formData.broker_status || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select status</option>
                            <option value="Exclusive">Exclusive</option>
                            <option value="Open">Open</option>
                            <option value="Co-Broker">Co-Broker</option>
                            <option value="No Broker">No Broker</option>
                        </select>
                    </div>
                </div>

                {/* Property Code & Transaction Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="propertyCode" className="block text-sm font-medium text-gray-700 mb-1">
                            Property Code
                        </label>
                        <input
                            type="text"
                            id="propertyCode"
                            name="propertyCode"
                            value={formData.propertyCode || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g. PROP123"
                        />
                    </div>

                    <div>
                        <label htmlFor="transactionType" className="block text-sm font-medium text-gray-700 mb-1">
                            Transaction Type
                        </label>
                        <select
                            id="transactionType"
                            name="transactionType"
                            value={formData.transactionType || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select type</option>
                            <option value="New">New</option>
                            <option value="Resale">Resale</option>
                            <option value="Rental">Rental</option>
                            <option value="Lease">Lease</option>
                        </select>
                    </div>
                </div>

                {/* Vastu Compliance */}
                {renderCheckboxGroup('Vastu Compliance', 'vastuCompliance', vastuComplianceOptions)}

                {/* Loan Approval Status */}
                {renderCheckboxGroup('Loan Approval Status', 'loanApprovalStatus', loanApprovalStatusOptions)}

                {/* Location Factors */}
                {renderCheckboxGroup('Location Factors', 'locationFactors', locationFactorsOptions)}

                {/* Overlooking Amenities */}
                {renderCheckboxGroup('Overlooking Amenities', 'overlookingAmenities', overlookingAmenitiesOptions)}

                {/* Religious Places Nearby */}
                {renderCheckboxGroup('Religious Places Nearby', 'religiousNearby', religiousNearbyOptions)}

                {/* Places in Proximity */}
                {renderCheckboxGroup('Places in Proximity', 'inProximity', inProximityOptions)}

                {/* Property Types */}
                {renderCheckboxGroup('Property Types', 'propertyTypes', propertyTypesOptions)}

                {/* Property Features */}
                {renderCheckboxGroup('Property Features', 'propertyFeatures', propertyFeaturesOptions)}

                {/* View Types */}
                {renderCheckboxGroup('View Types', 'viewTypes', viewTypesOptions)}

                {/* Legal Clearance */}
                {renderCheckboxGroup('Legal Clearance', 'legalClearance', legalClearanceOptions)}

                {/* Property Condition */}
                {renderCheckboxGroup('Property Condition', 'propertyConditions', propertyConditionsOptions)}

                {/* Legal Status */}
                {renderCheckboxGroup('Legal Status', 'legalStatuses', legalStatusesOptions)}

                {/* Environmental Factors */}
                {renderCheckboxGroup('Environmental Factors', 'environmentalFactors', environmentalFactorsOptions)}

                {/* Kitchen Type */}
                {renderCheckboxGroup('Kitchen Type', 'kitchenType', kitchenTypeOptions)}

                {/* Bathroom Features */}
                {renderCheckboxGroup('Bathroom Features', 'bathroomFeatures', bathroomFeaturesOptions)}

                {/* Special Categories */}
                {renderCheckboxGroup('Special Categories', 'specialCategories', specialCategoriesOptions)}

                {/* Flooring Type */}
                {renderCheckboxGroup('Flooring Type', 'flooringType', flooringTypeOptions)}

                {/* Social Infrastructure */}
                {renderCheckboxGroup('Social Infrastructure', 'socialInfrastructure', socialInfrastructureOptions)}

                {/* Property Tax Classes */}
                {renderCheckboxGroup('Property Tax Classes', 'propertyTaxClasses', propertyTaxClassesOptions)}

                {/* Environmental Certifications */}
                {renderCheckboxGroup('Environmental Certifications', 'environmentalCertifications', environmentalCertificationsOptions)}

                {/* Property Management Services */}
                {renderCheckboxGroup('Property Management Services', 'propertyManagementServices', propertyManagementServicesOptions)}

                {/* Investment Strategies */}
                {renderCheckboxGroup('Investment Strategies', 'investmentStrategies', investmentStrategiesOptions)}

                {/* Official Brochure Link */}
                <div>
                    <label htmlFor="official_brochure" className="block text-sm font-medium text-gray-700 mb-1">
                        Official Brochure URL
                    </label>
                    <input
                        type="url"
                        id="official_brochure"
                        name="official_brochure"
                        value={formData.official_brochure || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://example.com/brochure.pdf"
                    />
                </div>
            </div>
        </div>
    );
};

export default AdditionalDetailsSection;