import React, { useState } from 'react';

const FilterBar = ({ filters, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [localFilters, setLocalFilters] = useState(filters);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalFilters(prev => ({ ...prev, [name]: value }));
    };

    const applyFilters = () => {
        onChange(localFilters);
        setIsOpen(false);
    };

    const clearFilters = () => {
        const emptyFilters = {
            status: '',
            propertyType: '',
            city: '',
            minPrice: '',
            maxPrice: '',
        };
        setLocalFilters(emptyFilters);
        onChange(emptyFilters);
        setIsOpen(false);
    };

    // Check if any filters are active
    const hasActiveFilters = Object.values(filters).some(value => value !== '');

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center px-4 py-2.5 rounded-lg transition-colors ${hasActiveFilters
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                    }`}
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                </svg>
                <span>{hasActiveFilters ? 'Filters Applied' : 'Filter'}</span>
                {hasActiveFilters && (
                    <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">
                        {Object.values(filters).filter(v => v !== '').length}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg z-10 border border-gray-200 p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Filter Leads</h3>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                name="status"
                                value={localFilters.status}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            >
                                <option value="">All Statuses</option>
                                <option value="active">Active</option>
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                            <select
                                name="propertyType"
                                value={localFilters.propertyType}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            >
                                <option value="">All Types</option>
                                <option value="residential">Residential</option>
                                <option value="commercial">Commercial</option>
                                <option value="land">Land</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input
                                type="text"
                                name="city"
                                value={localFilters.city}
                                onChange={handleChange}
                                placeholder="Enter city name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                                <input
                                    type="number"
                                    name="minPrice"
                                    value={localFilters.minPrice}
                                    onChange={handleChange}
                                    placeholder="Min"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                                <input
                                    type="number"
                                    name="maxPrice"
                                    value={localFilters.maxPrice}
                                    onChange={handleChange}
                                    placeholder="Max"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-between">
                        <button
                            onClick={clearFilters}
                            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            Clear All
                        </button>
                        <button
                            onClick={applyFilters}
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterBar;