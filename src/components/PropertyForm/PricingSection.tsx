import React from 'react';

interface PricingSectionProps {
    formData: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    errors: any;
}

const formatCurrency = (value: string | number) => {
    if (!value) return '';

    // Convert to number and check if valid
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return '';

    // Format based on value
    if (numValue >= 10000000) {
        return `₹${(numValue / 10000000).toFixed(2)} Cr`;
    } else if (numValue >= 100000) {
        return `₹${(numValue / 100000).toFixed(2)} Lac`;
    } else {
        return `₹${numValue.toLocaleString()}`;
    }
};

const PricingSection: React.FC<PricingSectionProps> = ({
    formData,
    handleChange,
    errors
}) => {
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden transition-all">
            <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-medium text-gray-900">Pricing & Availability</h2>
                <p className="mt-1 text-sm text-gray-500">
                    Set the pricing details and availability for your property.
                </p>
            </div>

            <div className="px-6 py-4 space-y-6">
                {/* Price or Price on Request */}
                <div>
                    <div className="flex items-center mb-4">
                        <input
                            type="checkbox"
                            id="priceOnRequest"
                            name="priceOnRequest"
                            checked={formData.priceOnRequest || false}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="priceOnRequest" className="ml-2 block text-sm text-gray-700">
                            Price on Request
                        </label>
                    </div>

                    {!formData.priceOnRequest && (
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                Price <span className="text-red-500">*</span>
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">₹</span>
                                </div>
                                <input
                                    type="text"
                                    id="price"
                                    name="price"
                                    value={formData.price || ''}
                                    onChange={handleChange}
                                    className={`w-full pl-7 pr-12 py-2 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                    placeholder="0.00"
                                    aria-describedby="price-currency"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm" id="price-currency">
                                        INR
                                    </span>
                                </div>
                            </div>
                            {errors.price && (
                                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                            )}

                            {formData.price && !isNaN(parseFloat(formData.price)) && (
                                <p className="mt-1 text-sm text-gray-600">
                                    Formatted: {formatCurrency(formData.price)}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Price Per Square Foot */}
                <div>
                    <label htmlFor="pricePerSqFt" className="block text-sm font-medium text-gray-700 mb-1">
                        Price Per Square Foot
                    </label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">₹</span>
                        </div>
                        <input
                            type="text"
                            id="pricePerSqFt"
                            name="pricePerSqFt"
                            value={formData.pricePerSqFt || ''}
                            onChange={handleChange}
                            className="w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="0.00"
                            aria-describedby="price-per-sqft"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm" id="price-per-sqft">
                                /sq.ft
                            </span>
                        </div>
                    </div>

                    {/* Auto-calculate suggestion */}
                    {formData.price && formData.area && !formData.pricePerSqFt && !isNaN(parseFloat(formData.price)) && !isNaN(parseFloat(formData.area)) && (
                        <p className="mt-1 text-sm text-blue-600">
                            Suggested: ₹{(parseFloat(formData.price) / parseFloat(formData.area)).toFixed(2)}/sq.ft
                        </p>
                    )}
                </div>

                {/* Estimated EMI */}
                <div>
                    <label htmlFor="estimatedEMI" className="block text-sm font-medium text-gray-700 mb-1">
                        Estimated Monthly EMI
                    </label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">₹</span>
                        </div>
                        <input
                            type="text"
                            id="estimatedEMI"
                            name="estimatedEMI"
                            value={formData.estimatedEMI || ''}
                            onChange={handleChange}
                            className="w-full pl-7 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="0.00"
                        />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                        Approximate monthly payment based on current interest rates
                    </p>

                    {/* Auto-calculate suggestion */}
                    {formData.price && !formData.estimatedEMI && !isNaN(parseFloat(formData.price)) && (
                        <p className="mt-1 text-sm text-blue-600">
                            Suggested: ₹{(parseFloat(formData.price) * 0.008).toFixed(2)}/month
                            <span className="text-xs text-gray-500 ml-1">(based on 20-year loan at 8.5% interest)</span>
                        </p>
                    )}
                </div>

                {/* Maintenance Charges */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Maintenance Charges
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="maintenanceMin" className="block text-sm text-gray-700 mb-1">
                                Minimum Price
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">₹</span>
                                </div>
                                <input
                                    type="text"
                                    id="maintenanceMin"
                                    name="maintenanceMinPrice"
                                    value={formData.maintenanceCharges?.minPrice || ''}
                                    onChange={handleChange}
                                    className="w-full pl-7 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="maintenanceMax" className="block text-sm text-gray-700 mb-1">
                                Maximum Price
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">₹</span>
                                </div>
                                <input
                                    type="text"
                                    id="maintenanceMax"
                                    name="maintenanceMaxPrice"
                                    value={formData.maintenanceCharges?.maxPrice || ''}
                                    onChange={handleChange}
                                    className="w-full pl-7 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label htmlFor="maintenancePriceUnit" className="block text-sm text-gray-700 mb-1">
                                Price Unit
                            </label>
                            <select
                                id="maintenancePriceUnit"
                                name="maintenancePriceUnit"
                                value={formData.maintenanceCharges?.priceUnit || ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select price unit</option>
                                <option value="per_sqft">Per Sq.Ft</option>
                                <option value="per_month">Per Month</option>
                                <option value="per_year">Per Year</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="maintenanceAreaUnit" className="block text-sm text-gray-700 mb-1">
                                Area Unit
                            </label>
                            <select
                                id="maintenanceAreaUnit"
                                name="maintenanceAreaUnit"
                                value={formData.maintenanceCharges?.areaUnit || ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select area unit</option>
                                <option value="sqft">Sq.Ft</option>
                                <option value="sqm">Sq.M</option>
                                <option value="sqyd">Sq.Yd</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* RERA Status */}
                <div>
                    <label htmlFor="reraStatus" className="block text-sm font-medium text-gray-700 mb-1">
                        RERA Status
                    </label>
                    <select
                        id="reraStatus"
                        name="reraStatus"
                        value={formData.reraStatus || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Select RERA status</option>
                        <option value="Registered">Registered</option>
                        <option value="Applied">Applied</option>
                        <option value="Exempt">Exempt</option>
                        <option value="Not Applicable">Not Applicable</option>
                    </select>

                    {formData.reraStatus === 'Registered' && (
                        <div className="mt-4">
                            <label htmlFor="reraRegistrationNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                RERA Registration Number
                            </label>
                            <input
                                type="text"
                                id="reraRegistrationNumber"
                                name="reraRegistrationNumber"
                                value={formData.reraRegistrationNumber || ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g. P12345678"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PricingSection;