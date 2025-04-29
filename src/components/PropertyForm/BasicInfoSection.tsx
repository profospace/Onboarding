import React from 'react';

interface BasicInfoSectionProps {
    formData: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    handleMultiSelectChange: (name: string, values: string[]) => void;
    errors: any;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
    formData,
    handleChange,
    handleMultiSelectChange,
    errors
}) => {
    // Property types options
    const propertyTypes = [
        'Apartment',
        'House',
        'Villa',
        'Penthouse',
        'Builder Floor',
        'Shop',
        'Office Space',
        'Showroom',
        'Commercial Land',
        'Residential Land',
        'Industrial Land',
        'Agricultural Land',
        'Farm House',
        'Warehouse',
        'Industrial Building',
        'Hotel',
        'Guest House'
    ];

    // Purpose options
    const purposeOptions = [
        'Sell',
        'Rent',
        'Sale',
    ];

    // Handle tag input
    const [tagInput, setTagInput] = React.useState('');

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            if (tagInput.trim()) {
                const newTags = [...(formData.tags || []), tagInput.trim()];
                handleMultiSelectChange('tags', newTags);
                setTagInput('');
            }
        }
    };

    const removeTag = (tagToRemove: string) => {
        const newTags = (formData.tags || []).filter((tag: string) => tag !== tagToRemove);
        handleMultiSelectChange('tags', newTags);
    };

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden transition-all">
            <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
                <p className="mt-1 text-sm text-gray-500">
                    Add the essential details of the property.
                </p>
            </div>

            <div className="px-6 py-4 space-y-6">
                {/* Property Title */}
                <div>
                    <label htmlFor="post_title" className="block text-sm font-medium text-gray-700 mb-1">
                        Property Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="post_title"
                        name="post_title"
                        value={formData.post_title || ''}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.post_title ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Enter a descriptive title for your property"
                    />
                    {errors.post_title && (
                        <p className="mt-1 text-sm text-red-600">{errors.post_title}</p>
                    )}
                </div>

                {/* Property Description */}
                <div>
                    <label htmlFor="post_description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        id="post_description"
                        name="post_description"
                        value={formData.post_description || ''}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Describe your property in detail"
                    />
                </div>

                {/* Property Type & Purpose */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="type_name" className="block text-sm font-medium text-gray-700 mb-1">
                            Property Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="type_name"
                            name="type_name"
                            value={formData.type_name || ''}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border ${errors.type_name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        >
                            <option value="">Select property type</option>
                            {propertyTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        {errors.type_name && (
                            <p className="mt-1 text-sm text-red-600">{errors.type_name}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
                            Purpose <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="purpose"
                            name="purpose"
                            value={formData.purpose || ''}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border ${errors.purpose ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        >
                            <option value="">Select purpose</option>
                            {purposeOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                        {errors.purpose && (
                            <p className="mt-1 text-sm text-red-600">{errors.purpose}</p>
                        )}
                    </div>
                </div>

                {/* Bedrooms, Bathrooms, Area */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
                            Bedrooms <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            id="bedrooms"
                            name="bedrooms"
                            value={formData.bedrooms || ''}
                            onChange={handleChange}
                            min="0"
                            className={`w-full px-3 py-2 border ${errors.bedrooms ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {errors.bedrooms && (
                            <p className="mt-1 text-sm text-red-600">{errors.bedrooms}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
                            Bathrooms <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            id="bathrooms"
                            name="bathrooms"
                            value={formData.bathrooms || ''}
                            onChange={handleChange}
                            min="0"
                            className={`w-full px-3 py-2 border ${errors.bathrooms ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {errors.bathrooms && (
                            <p className="mt-1 text-sm text-red-600">{errors.bathrooms}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                            Area (sq ft) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="area"
                            name="area"
                            value={formData.area || ''}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border ${errors.area ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                            placeholder="e.g. 1200"
                        />
                        {errors.area && (
                            <p className="mt-1 text-sm text-red-600">{errors.area}</p>
                        )}
                    </div>
                </div>

                {/* Carpet & Super Built-up Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="carpetArea" className="block text-sm font-medium text-gray-700 mb-1">
                            Carpet Area (sq ft)
                        </label>
                        <input
                            type="text"
                            id="carpetArea"
                            name="carpetArea"
                            value={formData.carpetArea || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g. 1000"
                        />
                    </div>

                    <div>
                        <label htmlFor="superBuiltupArea" className="block text-sm font-medium text-gray-700 mb-1">
                            Super Built-up Area (sq ft)
                        </label>
                        <input
                            type="text"
                            id="superBuiltupArea"
                            name="superBuiltupArea"
                            value={formData.superBuiltupArea || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g. 1500"
                        />
                    </div>
                </div>

                {/* Furnishing Status */}
                <div>
                    <label htmlFor="furnishing" className="block text-sm font-medium text-gray-700 mb-1">
                        Furnishing Status
                    </label>
                    <select
                        id="furnishing"
                        name="furnishing"
                        value={formData.furnishing || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Select furnishing status</option>
                        <option value="Unfurnished">Unfurnished</option>
                        <option value="Semi-Furnished">Semi-Furnished</option>
                        <option value="Fully Furnished">Fully Furnished</option>
                    </select>
                </div>

                {/* Tags */}
                <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                        Tags
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                            type="text"
                            id="tags"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Add tags and press Enter (e.g. newly built, corner plot)"
                        />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                        Press Enter or comma to add a tag
                    </p>

                    {/* Display tags */}
                    {formData.tags && formData.tags.length > 0 && (
                        <div className="flex flex-wrap mt-2 gap-2">
                            {formData.tags.map((tag: string, index: number) => (
                                <div
                                    key={index}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-500 focus:text-white"
                                    >
                                        <span className="sr-only">Remove tag {tag}</span>
                                        <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                            <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BasicInfoSection;