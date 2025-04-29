
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BasicInfoSection from './components/PropertyForm/BasicInfoSection';
import LocationSection from './components/PropertyForm/LocationSection';
import FeaturesSection from './components/PropertyForm/FeaturesSection';
import ImagesSection from './components/PropertyForm/ImagesSection';
import PricingSection from './components/PropertyForm/PricingSection';
import AdditionalDetailsSection from './components/PropertyForm/AdditionalDetailsSection';
import FormNav from './components/PropertyForm/FormNav';
import { ChevronLeft } from 'lucide-react';
import { base_url } from '../utils/base_url';

const EditPropertyPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [activeSection, setActiveSection] = useState('basic');
    const [property, setProperty] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState<any>({});
    const [formErrors, setFormErrors] = useState<any>({});
    const [formTouched, setFormTouched] = useState(false);

    // Fetch property data
    useEffect(() => {
        const fetchPropertyData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${base_url}/api/details/${id}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch property data');
                }

                const data = await response.json();
                setProperty(data);

                // Initialize form data with property data
                setFormData({
                    post_title: data.post_title || '',
                    post_description: data.post_description || '',
                    price: data.price || '',
                    priceOnRequest: data.priceOnRequest || false,
                    type_name: data.type_name || '',
                    purpose: data.purpose || '',
                    bedrooms: data.bedrooms || '',
                    bathrooms: data.bathrooms || '',
                    area: data.area || '',
                    carpetArea: data.carpetArea || '',
                    superBuiltupArea: data.superBuiltupArea || '',
                    furnishing: data.furnishing || '',
                    address: data.address || '',
                    city: data.city || '',
                    locality: data.locality || '',
                    latitude: data.latitude || '',
                    longitude: data.longitude || '',
                    floor: data.floor || '',
                    floorNumber: data.floorNumber || '',
                    totalFloors: data.totalFloors || '',
                    facing: data.facing || '',
                    amenities: data.amenities || [],
                    facilities: data.facilities || [],
                    tags: data.tags || [],
                    status: data.status || 'pending',
                    available: data.available !== undefined ? data.available : true,
                    gatedCommunity: data.gatedCommunity || false,
                    petFriendly: data.petFriendly || false,
                    waterSource: data.waterSource || [],
                    powerBackup: data.powerBackup || '',
                    possessionDate: data.possessionDate ? new Date(data.possessionDate).toISOString().split('T')[0] : '',
                    ownerName: data.ownerName || '',
                    contactList: data.contactList || [],
                    whatsappAlerts: data.whatsappAlerts || false,
                    whatsappContact: data.whatsappContact || '',
                    // Images
                    post_images: data.post_images || [],
                    galleryList: data.galleryList || [],
                    floor_plan_images: data.floor_plan_images || [],
                    // Add more fields as needed
                });

            } catch (err: any) {
                console.error('Error fetching property:', err);
                setError(err.message || 'Failed to fetch property data');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPropertyData();
        }
    }, [id]);

    // Handle form field changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });

        // Clear error for this field if it exists
        if (formErrors[name]) {
            setFormErrors({
                ...formErrors,
                [name]: ''
            });
        }

        setFormTouched(true);
    };

    // Handle multi-select changes (for arrays)
    const handleMultiSelectChange = (name: string, values: string[]) => {
        setFormData({
            ...formData,
            [name]: values
        });
        setFormTouched(true);
    };

    // Handle contact list changes
    const handleContactListChange = (contacts: string[]) => {
        setFormData({
            ...formData,
            contactList: contacts.map(c => c.trim()).filter(Boolean)
        });
        setFormTouched(true);
    };

    // Handle image upload
    const handleImageUpload = (field: string, files: FileList) => {
        // In a real implementation, we would upload these to a server
        // For now, we'll just update the form data with the file objects
        const fileArray = Array.from(files);

        setFormData({
            ...formData,
            [field + 'Files']: fileArray
        });

        setFormTouched(true);
    };

    // Validate form
    const validateForm = () => {
        const errors: any = {};

        // Required fields
        if (!formData.post_title) errors.post_title = 'Title is required';
        if (!formData.price && !formData.priceOnRequest) errors.price = 'Price is required or mark as Price on Request';
        if (!formData.type_name) errors.type_name = 'Property type is required';
        if (!formData.purpose) errors.purpose = 'Purpose is required';
        if (!formData.area) errors.area = 'Area is required';
        if (!formData.city) errors.city = 'City is required';
        if (!formData.locality) errors.locality = 'Locality is required';

        // Numeric validation
        if (formData.price && isNaN(Number(formData.price))) errors.price = 'Price must be a number';
        if (formData.area && isNaN(Number(formData.area))) errors.area = 'Area must be a number';
        if (formData.bedrooms && isNaN(Number(formData.bedrooms))) errors.bedrooms = 'Bedrooms must be a number';
        if (formData.bathrooms && isNaN(Number(formData.bathrooms))) errors.bathrooms = 'Bathrooms must be a number';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            // Scroll to the first error
            const firstErrorField = Object.keys(formErrors)[0];
            const element = document.querySelector(`[name="${firstErrorField}"]`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        try {
            setSaving(true);

            // Create FormData object for file uploads
            const formDataObj = new FormData();

            // Append all form data
            Object.entries(formData).forEach(([key, value]) => {
                if (key.endsWith('Files') && Array.isArray(value)) {
                    // Handle file uploads
                    Array.from(value as File[]).forEach((file: File, index) => {
                        formDataObj.append(`${key.replace('Files', '')}`, file);
                    });
                } else if (Array.isArray(value)) {
                    // Handle arrays
                    formDataObj.append(key, JSON.stringify(value));
                } else if (value !== null && value !== undefined) {
                    // Handle all other fields
                    formDataObj.append(key, value as string);
                }
            });

            // Add the data as a JSON string
            formDataObj.append('data', JSON.stringify(formData));

            const response = await fetch(`${base_url}/api/properties/${id}`, {
                method: 'PUT',
                body: formDataObj,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update property');
            }

            // Success! Navigate back to the dashboard
            navigate('/dashboard');

        } catch (err: any) {
            console.error('Error updating property:', err);
            setError(err.message || 'Failed to update property');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="p-4 max-w-md w-full bg-white rounded-lg shadow text-center">
                    <div className="animate-spin mb-4 h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-lg font-medium text-gray-700">Loading property data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="p-6 max-w-md w-full bg-white rounded-lg shadow text-center">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <div className="flex space-x-3 justify-center">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                        >
                            Back to Dashboard
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="p-2 rounded-full hover:bg-gray-100"
                            >
                                <ChevronLeft className="h-5 w-5 text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">Edit Property</h1>
                                <div className="flex items-center text-sm text-gray-500">
                                    <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate('/dashboard')}>Dashboard</span>
                                    <span className="mx-2">/</span>
                                    <span className="text-gray-700">Edit</span>
                                    <span className="mx-2">/</span>
                                    <span className="font-medium text-gray-900 truncate max-w-[200px]">{property?.post_title || 'Property'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={saving || !formTouched}
                                className={`px-4 py-2 rounded-md text-white ${saving ? 'bg-blue-400 cursor-not-allowed' :
                                        !formTouched ? 'bg-blue-400 cursor-not-allowed' :
                                            'bg-blue-600 hover:bg-blue-700 transition-colors'
                                    }`}
                            >
                                {saving ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </span>
                                ) : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1">
                        <FormNav
                            activeSection={activeSection}
                            setActiveSection={setActiveSection}
                            formData={formData}
                            formErrors={formErrors}
                        />
                    </div>

                    {/* Form Sections */}
                    <div className="lg:col-span-3">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Sections */}
                            <div className={`${activeSection === 'basic' ? 'block' : 'hidden'}`}>
                                <BasicInfoSection
                                    formData={formData}
                                    handleChange={handleChange}
                                    handleMultiSelectChange={handleMultiSelectChange}
                                    errors={formErrors}
                                />
                            </div>

                            <div className={`${activeSection === 'location' ? 'block' : 'hidden'}`}>
                                <LocationSection
                                    formData={formData}
                                    handleChange={handleChange}
                                    errors={formErrors}
                                />
                            </div>

                            <div className={`${activeSection === 'features' ? 'block' : 'hidden'}`}>
                                <FeaturesSection
                                    formData={formData}
                                    handleChange={handleChange}
                                    handleMultiSelectChange={handleMultiSelectChange}
                                    errors={formErrors}
                                />
                            </div>

                            <div className={`${activeSection === 'images' ? 'block' : 'hidden'}`}>
                                <ImagesSection
                                    formData={formData}
                                    handleImageUpload={handleImageUpload}
                                    errors={formErrors}
                                />
                            </div>

                            <div className={`${activeSection === 'pricing' ? 'block' : 'hidden'}`}>
                                <PricingSection
                                    formData={formData}
                                    handleChange={handleChange}
                                    errors={formErrors}
                                />
                            </div>

                            <div className={`${activeSection === 'additional' ? 'block' : 'hidden'}`}>
                                <AdditionalDetailsSection
                                    formData={formData}
                                    handleChange={handleChange}
                                    handleMultiSelectChange={handleMultiSelectChange}
                                    errors={formErrors}
                                />
                            </div>

                            <div className={`${activeSection === 'contact' ? 'block' : 'hidden'}`}>
                                <div className="bg-white rounded-lg shadow p-6">
                                    <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Owner Name
                                                </label>
                                                <input
                                                    type="text"
                                                    id="ownerName"
                                                    name="ownerName"
                                                    value={formData.ownerName || ''}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Contact Numbers (comma separated)
                                            </label>
                                            <textarea
                                                id="contactNumbers"
                                                name="contactNumbers"
                                                value={formData.contactList?.join(', ') || ''}
                                                onChange={(e) => handleContactListChange(e.target.value.split(','))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                rows={2}
                                                placeholder="e.g. 9876543210, 9876543211"
                                            />
                                            <p className="mt-1 text-sm text-gray-500">Enter multiple numbers separated by commas</p>
                                        </div>

                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="whatsappAlerts"
                                                name="whatsappAlerts"
                                                checked={formData.whatsappAlerts || false}
                                                onChange={handleChange}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="whatsappAlerts" className="ml-2 block text-sm text-gray-700">
                                                Enable WhatsApp Alerts
                                            </label>
                                        </div>

                                        {formData.whatsappAlerts && (
                                            <div>
                                                <label htmlFor="whatsappContact" className="block text-sm font-medium text-gray-700 mb-1">
                                                    WhatsApp Contact Number
                                                </label>
                                                <input
                                                    type="text"
                                                    id="whatsappContact"
                                                    name="whatsappContact"
                                                    value={formData.whatsappContact || ''}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="e.g. 9876543210"
                                                />
                                            </div>
                                        )}

                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="profoProxyAllowed"
                                                name="profoProxyAllowed"
                                                checked={formData.profoProxyAllowed || false}
                                                onChange={handleChange}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="profoProxyAllowed" className="ml-2 block text-sm text-gray-700">
                                                Allow Proxy Contact (system handles initial contact)
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button - Visible on all tabs */}
                            <div className="bg-white rounded-lg shadow p-6 flex flex-col sm:flex-row sm:justify-between items-center space-y-4 sm:space-y-0">
                                <div className="text-sm text-gray-500">
                                    {formTouched ? (
                                        <span className="text-amber-600">You have unsaved changes</span>
                                    ) : (
                                        <span>No changes to save</span>
                                    )}
                                </div>
                                <div className="flex items-center space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/dashboard')}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving || !formTouched}
                                        className={`px-6 py-2 rounded-md text-white ${saving ? 'bg-blue-400 cursor-not-allowed' :
                                                !formTouched ? 'bg-blue-400 cursor-not-allowed' :
                                                    'bg-blue-600 hover:bg-blue-700 transition-colors'
                                            }`}
                                    >
                                        {saving ? (
                                            <span className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Saving...
                                            </span>
                                        ) : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditPropertyPage;