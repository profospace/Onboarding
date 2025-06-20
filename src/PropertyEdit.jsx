import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import LocationPicker from './LocationPicker';
import { Steps } from 'antd';
import AutofillOptions from './AutofillOptions';
import { toast } from 'react-hot-toast';
import { base_url } from '../utils/base_url';

const PropertyEdit = ({ user }) => {
    const { propertyId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [fetchingProperty, setFetchingProperty] = useState(true);
    const [originalProperty, setOriginalProperty] = useState(null);

    // Helper function to get category name from ID
    const getCategoryNameFromId = (categoryId) => {
        const categoryMap = {
            1: 'Residential',
            2: 'Commercial',
            3: 'Industrial',
            4: 'Agricultural'
        };
        return categoryMap[categoryId] || '';
    };

    // Category ID mapping for API submission
    const categoryMap = {
        'Residential': 1,
        'Commercial': 2,
        'Industrial': 3,
        'Agricultural': 4
    };

    // Function to prepare property data for editing
    const preparePropertyDataForEdit = (property) => {
        console.log("Preparing property for edit:", property);

        return {
            propertyType: property.type_name || '',
            propertyCategory: getCategoryNameFromId(property.category) || '',
            bedrooms: property.bedrooms || '',
            bathrooms: property.bathrooms || '',
            balconies: property.balconies || '',
            furnishingStatus: property.furnishStatus || property.furnishing || '',
            propertyAge: property.propertyAge || property.property_age || '',
            floorNumber: property.floorNumber || property.floor || '',
            totalFloors: property.totalFloors || '',
            facingDirection: property.facing || '',
            address: property.address || '',
            city: property.city || '',
            locality: property.locality || '',
            pincode: property.pincode || '',
            title: property.post_title || '',
            description: property.post_description || '',
            price: property.price || '',
            priceUnit: property.priceUnit || 'lakh',
            area: property.area || '',
            areaUnit: property.areaUnit || 'sqft',
            amenities: property.amenities || [],
            // Store original image URLs for reference
            originalPostImages: property.post_images || (property.post_image ? [{ url: property.post_image }] : []),
            originalFloorPlanImages: property.floor_plan_images || (property.floor_plan_image ? [{ url: property.floor_plan_image }] : []),
            originalGalleryImages: property.galleryList || [],
            // New images that user will upload
            newPostImages: [],
            newFloorPlanImages: [],
            newGalleryImages: [],
            // Images to keep from originals
            keepPostImages: property.post_images?.map((_, index) => index) || (property.post_image ? [0] : []),
            keepFloorPlanImages: property.floor_plan_images?.map((_, index) => index) || (property.floor_plan_image ? [0] : []),
            keepGalleryImages: property.galleryList?.map((_, index) => index) || [],
            latitude: property.location?.coordinates ? property.location.coordinates[1] : property.latitude || '',
            longitude: property.location?.coordinates ? property.location.coordinates[0] : property.longitude || '',
            purpose: property.purpose || 'buy',
            usp: property.usp || [],
            ownerName: property.ownerName || '',
            contactList: property.contactList || [],
            superBuiltupArea: property.superBuiltupArea || '',
            carpetArea: property.carpetArea || '',
            pricePerSqFt: property.pricePerSqFt || '',
            estimatedEMI: property.estimatedEMI || '',
            reraStatus: property.reraStatus || '',
            reraRegistrationNumber: property.reraRegistrationNumber || '',
            reraWebsite: property.reraWebsite || '',
            configuration: property.configuration || '',
            overlookingAmenities: property.overlookingAmenities || [],
            possessionDate: property.possessionDate ? new Date(property.possessionDate).toISOString().split('T')[0] : '',
            transactionType: property.transactionType || '',
            propertyOwnership: property.propertyOwnership || '',
            flooring: property.flooring || '',
            parking: property.parking || '',
            propertyCode: property.propertyCode || property.post_id || '',
            widthOfFacingRoad: property.widthOfFacingRoad || '',
            gatedCommunity: property.gatedCommunity || false,
            waterSource: property.waterSource || [],
            powerBackup: property.powerBackup || '',
            petFriendly: property.petFriendly || false,
            agreement: property.agreement || '',
            priceOnRequest: property.priceOnRequest || false,
            verified: property.verified || false,
            anyConstraint: property.anyConstraint || [],
            propertyTypes: property.propertyTypes || [],
            propertyFeatures: property.propertyFeatures || [],
            viewTypes: property.viewTypes || [],
            propertyConditions: property.propertyConditions || [],
            legalStatuses: property.legalStatuses || [],
            constructionStatuses: property.constructionStatuses || [],
            ownershipTypes: property.ownershipTypes || [],
            financingOptions: property.financingOptions || [],
            environmentalCertifications: property.environmentalCertifications || [],
            propertyManagementServices: property.propertyManagementServices || [],
            investmentStrategies: property.investmentStrategies || [],
            tags: property.tags || [],
            facilities: property.facilities || [],
            location_advantage: property.location_advantage || [],
            construction_status: property.construction_status || '',
            possession: property.possession || '',
            region: property.region || '',
            broker_status: property.broker_status || '',
            whatsappAlerts: property.whatsappAlerts || false,
            whatsappContact: property.whatsappContact || '',
            profoProxyAllowed: property.profoProxyAllowed || false,
            religiousNearby: property.religiousNearby || [],
            inProximity: property.inProximity || [],
            vastuCompliance: property.vastuCompliance || [],
            loanApprovalStatus: property.loanApprovalStatus || [],
            builderReputation: property.builderReputation || [],
            legalClearance: property.legalClearance || [],
            environmentalFactors: property.environmentalFactors || [],
            kitchenType: property.kitchenType || [],
            bathroomFeatures: property.bathroomFeatures || [],
            specialCategories: property.specialCategories || [],
            flooringType: property.flooringType || [],
            socialInfrastructure: property.socialInfrastructure || [],
            maintenanceCharges: property.maintenanceCharges || {
                minPrice: '',
                maxPrice: '',
                priceUnit: '',
                areaUnit: ''
            },
        };
    };

    // Form state initialization
    const [formData, setFormData] = useState({});

    // Fetch property data
    useEffect(() => {
        const fetchPropertyData = async () => {
            try {
                setFetchingProperty(true);

                // Check if property data is passed via navigation state
                if (location.state?.property) {
                    const property = location.state.property;
                    setOriginalProperty(property);
                    setFormData(preparePropertyDataForEdit(property));
                    setFetchingProperty(false);
                    return;
                }

                // Otherwise fetch from API
                if (propertyId) {
                    const details = JSON.parse(localStorage.getItem('user'));
                    const response = await fetch(`${base_url}/api/details/${propertyId}`, {
                        headers: {
                            'Authorization': `Bearer ${details?.token}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch property data');
                    }

                    const property = await response.json();
                    setOriginalProperty(property);
                    setFormData(preparePropertyDataForEdit(property));
                } else {
                    toast.error('Property ID not found');
                    navigate('/property-management');
                }
            } catch (error) {
                console.error('Error fetching property data:', error);
                toast.error('Failed to load property data');
                navigate('/property-management');
            } finally {
                setFetchingProperty(false);
            }
        };

        fetchPropertyData();
    }, [propertyId, location.state, navigate]);

    // Available options for select fields
    const propertyTypes = ['Apartment', 'House', 'Shops', 'Warehouses', 'Halls', 'Land'];
    const propertyCategories = ['Residential', 'Commercial', 'Industrial', 'Agricultural'];
    const furnishingOptions = ['Unfurnished', 'Semi-Furnished', 'Fully-Furnished', 'Modular-Kitchen', 'Wardrobes-Included', 'Air-Conditioners-Included', 'Premium-Furnishings'];
    const directionOptions = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'];
    const amenitiesOptions = [
        'Parking', 'Lift', 'Power Backup', 'Gas Pipeline', 'Swimming Pool', 'Gym',
        'Club House', 'Children\'s Play Area', 'Garden', 'Security', 'CCTV',
        'Intercom', 'Fire Safety', 'Rain Water Harvesting'
    ];
    const purposeOptions = ['sale', 'rent', 'buy'];
    const transactionTypeOptions = ['New Property', 'Resale'];
    const ownershipOptions = ['Freehold', 'Leasehold', 'Power of Attorney', 'Co-operative Society'];
    const reraStatusOptions = ['Registered', 'Applied', 'Not Applicable'];
    const waterSourceOptions = ['24/7 Municipal Supply', 'Timed Municipal Supply', 'Borewell', 'Tanker', 'Well', 'Rainwater Harvesting', 'Water Treatment Plant'];
    const powerBackupOptions = ['None', 'Partial', 'Full'];
    const flooringOptions = ['Marble', 'Vitrified', 'Wooden', 'Ceramic Tiles', 'Cement', 'Granite', 'Stone'];
    const parkingOptions = ['Open Parking', 'Covered Parking', 'None', 'No Parking', 'Single Covered Parking', 'Multiple Covered Parking', 'Stilt Parking', 'Basement Parking', 'Mechanical Parking'];
    const constructionStatusOptions = ['Under Construction', 'Ready to Move', 'New Launch'];
    const configurationOptions = ['1RK', '1BHK', '2BHK', '3BHK', '4BHK', '4+ BHK', 'Studio Apartment'];
    const religiousNearbyOptions = ['Near Temple', 'Near Gurudwara', 'Near Church', 'Near Mosque', 'Pilgrimage Society Proximity'];
    const inProximityOptions = ['Airport', 'Near Office Hub', 'Hospital Vicinity', 'Railway Station', 'Highway Access', 'Market Area', 'Near School', 'Near College'];
    const vastuCompliance = ['Vastu Friendly Layout', 'East Facing', 'North East Facing', 'North Facing', 'South East Facing', 'West Facing', 'Proper Room Placement', 'Vastu Compliant Kitchen', 'Vastu Compliant Main Door'];
    const loanApprovalStatus = ['Bank Approved Project', 'Pre-Approved Loans', 'Government Subsidy Eligible', 'PMAY Eligible', 'Home Loan Available', 'No Loan Available'];
    const builderReputation = ['Premium/Luxury Developer', 'Mid-Tier Developer', 'Budget Developer', 'Government Housing', 'Award-Winning Developer', 'Timely Delivery Track Record'];
    const legalClearance = ['Clear Title', 'RERA Registered', 'Occupancy Certificate', 'Completion Certificate', 'NOC from Authorities', 'Approved Building Plan'];
    const environmentalFactors = ['Green Building Certified', 'Solar Power Installation', 'Waste Management System', 'EV Charging Points', 'Low Pollution Area', 'Green Belt Proximity'];
    const kitchenType = ['Modular Kitchen', 'Semi-Modular Kitchen', 'Open Kitchen', 'Closed Kitchen', 'Kitchen with Utility Area', 'Kitchen Garden Access'];
    const bathroomFeatures = ['Standard Bathroom', 'Premium Fittings', 'Western Toilet', 'Bathtub', 'Shower Enclosure', 'Master Bath', 'Common Bath'];
    const specialCategories = ['Senior Citizen Friendly', 'Gated Community', 'Farm House', 'Weekend Home', 'Investment Property', 'Rental Income Property', 'NRI Preferred'];
    const flooringType = ['Vitrified Tiles', 'Marble Flooring', 'Wooden Flooring', 'Granite Flooring', 'Ceramic Tiles', 'Italian Marble', 'Anti-Skid Tiles'];
    const socialInfrastructure = ['School Proximity', 'College Vicinity', 'Hospital Access', 'Shopping Mall Proximity', 'Restaurant/Food Hub Nearby', 'Entertainment Zone Access'];
    const financingOptionsArray = ["Conventional Mortgage", "FHA Loan", "VA Loan", "Cash Only"];

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            if (checked) {
                setFormData({
                    ...formData,
                    amenities: [...(formData.amenities || []), value]
                });
            } else {
                setFormData({
                    ...formData,
                    amenities: (formData.amenities || []).filter(item => item !== value)
                });
            }
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    // Image handling functions
    const handleNewPostImagesUpload = (e) => {
        const files = Array.from(e.target.files);
        setFormData({
            ...formData,
            newPostImages: [...(formData.newPostImages || []), ...files]
        });
    };

    const handleNewFloorPlanImagesUpload = (e) => {
        const files = Array.from(e.target.files);
        setFormData({
            ...formData,
            newFloorPlanImages: [...(formData.newFloorPlanImages || []), ...files]
        });
    };

    const handleNewGalleryImagesUpload = (e) => {
        const files = Array.from(e.target.files);
        setFormData({
            ...formData,
            newGalleryImages: [...(formData.newGalleryImages || []), ...files]
        });
    };

    const removeNewPostImage = (index) => {
        const newImages = [...(formData.newPostImages || [])];
        newImages.splice(index, 1);
        setFormData({
            ...formData,
            newPostImages: newImages
        });
    };

    const removeNewFloorPlanImage = (index) => {
        const newImages = [...(formData.newFloorPlanImages || [])];
        newImages.splice(index, 1);
        setFormData({
            ...formData,
            newFloorPlanImages: newImages
        });
    };

    const removeNewGalleryImage = (index) => {
        const newImages = [...(formData.newGalleryImages || [])];
        newImages.splice(index, 1);
        setFormData({
            ...formData,
            newGalleryImages: newImages
        });
    };

    const toggleKeepPostImage = (index) => {
        const keepImages = [...(formData.keepPostImages || [])];
        const indexInKeep = keepImages.indexOf(index);

        if (indexInKeep > -1) {
            keepImages.splice(indexInKeep, 1);
        } else {
            keepImages.push(index);
        }

        setFormData({
            ...formData,
            keepPostImages: keepImages
        });
    };

    const toggleKeepFloorPlanImage = (index) => {
        const keepImages = [...(formData.keepFloorPlanImages || [])];
        const indexInKeep = keepImages.indexOf(index);

        if (indexInKeep > -1) {
            keepImages.splice(indexInKeep, 1);
        } else {
            keepImages.push(index);
        }

        setFormData({
            ...formData,
            keepFloorPlanImages: keepImages
        });
    };

    const toggleKeepGalleryImage = (index) => {
        const keepImages = [...(formData.keepGalleryImages || [])];
        const indexInKeep = keepImages.indexOf(index);

        if (indexInKeep > -1) {
            keepImages.splice(indexInKeep, 1);
        } else {
            keepImages.push(index);
        }

        setFormData({
            ...formData,
            keepGalleryImages: keepImages
        });
    };

    // Add a function to handle location selection from the map
    const handleLocationSelect = (position) => {
        setFormData({
            ...formData,
            latitude: position.lat,
            longitude: position.lng
        });
    };

    // Add function to handle manual lat/lng input
    const handleLatLngChange = (field, value) => {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
            setFormData({
                ...formData,
                [field]: numValue
            });
        } else {
            setFormData({
                ...formData,
                [field]: value
            });
        }
    };

    // Navigation
    // const navigateToStep = (stepIndex) => {
    //     if (stepIndex < currentStep || stepIndex === currentStep) {
    //         setCurrentStep(stepIndex);
    //         window.scrollTo(0, 0);
    //     }
    // };
    const navigateToStep = (stepIndex) => {
        setCurrentStep(stepIndex);
        window.scrollTo(0, 0);
    };


    const nextStep = () => {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
        window.scrollTo(0, 0);
    };

    // Generic function to add custom option to any checkbox array
    const addCustomOption = (fieldName, customValue, inputId) => {
        if (customValue && !(formData[fieldName] || []).includes(customValue)) {
            setFormData({
                ...formData,
                [fieldName]: [...(formData[fieldName] || []), customValue]
            });
            document.getElementById(inputId).value = '';
        }
    };

    // Generic function to render checkbox section with custom input
    const renderCheckboxSection = (title, options, fieldName, description = '') => (
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {title}
            </label>
            {description && (
                <p className="text-xs text-gray-500 mb-2">{description}</p>
            )}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {options.map((option) => (
                    <div key={option} className="flex items-start">
                        <div className="flex items-center h-5">
                            <input
                                id={`${fieldName}-${option}`}
                                name={fieldName}
                                type="checkbox"
                                value={option}
                                checked={(formData[fieldName] || []).includes(option)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setFormData({
                                            ...formData,
                                            [fieldName]: [...(formData[fieldName] || []), option]
                                        });
                                    } else {
                                        setFormData({
                                            ...formData,
                                            [fieldName]: (formData[fieldName] || []).filter(item => item !== option)
                                        });
                                    }
                                }}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                        </div>
                        <div className="ml-2 text-sm">
                            <label htmlFor={`${fieldName}-${option}`} className="text-gray-700">
                                {option}
                            </label>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add custom option input */}
            <div className="mt-3">
                <label htmlFor={`custom-${fieldName}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Add Custom {title.replace(/s$/, '')}
                </label>
                <div className="flex">
                    <input
                        type="text"
                        id={`custom-${fieldName}`}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`E.g. Custom ${title.toLowerCase().replace(/s$/, '')}`}
                    />
                    <button
                        type="button"
                        onClick={() => {
                            const customValue = document.getElementById(`custom-${fieldName}`).value.trim();
                            addCustomOption(fieldName, customValue, `custom-${fieldName}`);
                        }}
                        className="px-3 py-2 border-y border-r border-gray-300 rounded-r-md bg-gray-50 text-gray-700 hover:bg-gray-100"
                    >
                        Add
                    </button>
                </div>
            </div>

            {/* Display selected options */}
            {formData[fieldName] && formData[fieldName].length > 0 && (
                <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Selected {title}:</label>
                    <div className="flex flex-wrap gap-2">
                        {formData[fieldName].map((item, index) => (
                            <div key={index} className="bg-blue-100 px-3 py-1 rounded-full flex items-center">
                                <span className="text-sm text-blue-800">{item}</span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData({
                                            ...formData,
                                            [fieldName]: formData[fieldName].filter((_, i) => i !== index)
                                        });
                                    }}
                                    className="ml-1 text-blue-800 hover:text-blue-900"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    // Submit the form
    const handleSubmit = async () => {
        setLoading(true);

        try {
            // Prepare form data for API submission
            const propertyData = new FormData();

            // Create main data object for the property
            const mainData = {
                type_name: formData.propertyType,
                post_title: formData.title,
                post_description: formData.description,
                price: formData.price,
                priceUnit: formData.priceUnit,
                area: formData.area,
                areaUnit: formData.areaUnit,
                bedrooms: formData.bedrooms,
                bathrooms: formData.bathrooms,
                balconies: formData.balconies,
                furnishStatus: formData.furnishingStatus,
                propertyAge: formData.propertyAge,
                floorNumber: formData.floorNumber,
                totalFloors: formData.totalFloors,
                facing: formData.facingDirection,
                address: formData.address,
                city: formData.city,
                locality: formData.locality,
                pincode: formData.pincode,
                amenities: formData.amenities,
                latitude: formData.latitude,
                longitude: formData.longitude,
                purpose: formData.purpose,
                usp: formData.usp,
                ownerName: formData.ownerName,
                contactList: formData.contactList,
                superBuiltupArea: formData.superBuiltupArea,
                carpetArea: formData.carpetArea,
                pricePerSqFt: formData.pricePerSqFt,
                estimatedEMI: formData.estimatedEMI,
                reraStatus: formData.reraStatus,
                reraRegistrationNumber: formData.reraRegistrationNumber,
                reraWebsite: formData.reraWebsite,
                configuration: formData.configuration,
                overlookingAmenities: formData.overlookingAmenities,
                possessionDate: formData.possessionDate ? new Date(formData.possessionDate) : undefined,
                transactionType: formData.transactionType,
                propertyOwnership: formData.propertyOwnership,
                flooring: formData.flooring,
                parking: formData.parking,
                propertyCode: formData.propertyCode,
                widthOfFacingRoad: formData.widthOfFacingRoad,
                gatedCommunity: formData.gatedCommunity,
                waterSource: formData.waterSource,
                powerBackup: formData.powerBackup,
                petFriendly: formData.petFriendly,
                agreement: formData.agreement,
                priceOnRequest: formData.priceOnRequest,
                tags: formData.tags,
                facilities: formData.facilities,
                location_advantage: formData.location_advantage,
                construction_status: formData.construction_status,
                possession: formData.possession,
                region: formData.region,
                category: categoryMap[formData.propertyCategory] || 0,
                broker_status: formData.broker_status,
                propertyTypes: [formData.propertyType],
                propertyFeatures: formData.propertyFeatures,
                viewTypes: formData.viewTypes,
                propertyConditions: formData.propertyConditions,
                legalStatuses: formData.legalStatuses,
                constructionStatuses: [formData.construction_status].filter(Boolean),
                ownershipTypes: [formData.propertyOwnership].filter(Boolean),
                financingOptions: formData.financingOptions || [],
                environmentalCertifications: formData.environmentalCertifications,
                propertyManagementServices: formData.propertyManagementServices,
                investmentStrategies: formData.investmentStrategies,
                whatsappAlerts: formData.whatsappAlerts || false,
                whatsappContact: formData.whatsappContact || '',
                profoProxyAllowed: formData.profoProxyAllowed || false,
                religiousNearby: formData.religiousNearby || [],
                inProximity: formData.inProximity || [],
                vastuCompliance: formData.vastuCompliance || [],
                loanApprovalStatus: formData.loanApprovalStatus || [],
                builderReputation: formData.builderReputation || [],
                legalClearance: formData.legalClearance || [],
                environmentalFactors: formData.environmentalFactors || [],
                kitchenType: formData.kitchenType || [],
                bathroomFeatures: formData.bathroomFeatures || [],
                specialCategories: formData.specialCategories || [],
                flooringType: formData.flooringType || [],
                socialInfrastructure: formData.socialInfrastructure || [],
                maintenanceCharges: formData.maintenanceCharges || {
                    minPrice: '',
                    maxPrice: '',
                    priceUnit: '',
                    areaUnit: ''
                },
                // Add which original images to keep
                keepPostImages: formData.keepPostImages || [],
                keepFloorPlanImages: formData.keepFloorPlanImages || [],
                keepGalleryImages: formData.keepGalleryImages || [],
            };

            // Add user information
            if (user && user.id) {
                mainData.user_id = user.id;
            }

            // Append the main data as a JSON string
            propertyData.append('data', JSON.stringify(mainData));

            // Add new images
            if (formData.newPostImages && formData.newPostImages.length > 0) {
                formData.newPostImages.forEach(image => {
                    propertyData.append('post_images', image);
                });
            }

            if (formData.newFloorPlanImages && formData.newFloorPlanImages.length > 0) {
                formData.newFloorPlanImages.forEach(image => {
                    propertyData.append('floor_plan_images', image);
                });
            }

            if (formData.newGalleryImages && formData.newGalleryImages.length > 0) {
                formData.newGalleryImages.forEach(image => {
                    propertyData.append('galleryList', image);
                });
            }

            // Get auth token
            const details = JSON.parse(localStorage.getItem('user'));

            // Submit to API
            const response = await fetch(`${base_url}/properties/${propertyId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${details?.token}`
                },
                body: propertyData,
            });

            const data = await response.json();
            console.log("API Response:", data);

            if (data?.success === true) {
                toast.success('Property updated successfully!');
                navigate('/property-management');
            } else {
                toast.error(`Update failed: ${data.message || 'Unknown error'}`);
                if (data.error) {
                    toast.error(`${data.error}`);
                }
                console.error('Error updating property:', data);
            }
        } catch (error) {
            console.error('Error updating property:', error);
            toast.error(`Failed to update property: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (fetchingProperty) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Loading property data...</p>
            </div>
        );
    }

    return (
        <div className="">
            {/* Progress Steps */}
            <div className="mx-auto">
                {/* <div className="mx-auto">
                    <AutofillOptions
                        onSelect={(data) => {
                            setFormData({
                                ...formData,
                                ...data
                            });
                        }}
                    />
                </div> */}
                {/* Navigation buttons */}
                <div className="flex justify-between my-2">
                    {currentStep > 1 ? (
                        <button
                            type="button"
                            onClick={prevStep}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <svg className="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            Previous
                        </button>
                    ) : (
                        <div></div>
                    )}

                    {currentStep < 7 ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Next
                            <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    ) : (
                        <div className='flex gap-2'>
                            <button
                                type="button"
                                onClick={() => navigate('/property-management')}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading}
                                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                                            <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        Update Property
                                        <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
                <Steps
                    // current={currentStep - 1}
                    // percent={((currentStep - 1) / 6) * 100}
                    // onChange={(current) => navigateToStep(current + 1)}
                    current={currentStep - 1}
                    percent={((currentStep - 1) / 6) * 100}
                    onChange={(current) => navigateToStep(current + 1)}
                    items={[
                        {
                            title: 'Basic Details',
                            description: currentStep === 1 ? 'Current step' : '',
                        },
                        {
                            title: 'Location',
                            description: currentStep === 2 ? 'Current step' : '',
                        },
                        {
                            title: 'Property Details',
                            description: currentStep === 3 ? 'Current step' : '',
                        },
                        {
                            title: 'Photos & Amenities',
                            description: currentStep === 4 ? 'Current step' : '',
                        },
                        {
                            title: 'Ownership & Legal',
                            description: currentStep === 5 ? 'Current step' : '',
                        },
                        {
                            title: 'Additional Features',
                            description: currentStep === 6 ? 'Current step' : '',
                        },
                        {
                            title: 'USP & Tags',
                            description: currentStep === 7 ? 'Current step' : '',
                        }
                    ]}
                />
            </div>

            {/* Form content */}
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-2">
                <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                    {/* Title */}
                    <h1 className="text-xl font-bold text-gray-900 mb-4">
                        Edit Property: {formData.title || formData.propertyCode}
                    </h1>

                    <div className="bg-blue-50 p-4 rounded-md mb-6">
                        <p className="text-sm text-blue-700">
                            You are editing property <strong>{formData.propertyCode}</strong>.
                            For images: uncheck boxes to remove existing images, or upload new ones to add them.
                        </p>
                    </div>

                    {/* Step 1: Basic Details */}
                    {currentStep === 1 && (
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-6">Basic Details</h2>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">
                                        Property Type*
                                    </label>
                                    <select
                                        id="propertyType"
                                        name="propertyType"
                                        value={formData.propertyType || ''}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select Property Type</option>
                                        {propertyTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="propertyCategory" className="block text-sm font-medium text-gray-700 mb-1">
                                        Property Category*
                                    </label>
                                    <select
                                        id="propertyCategory"
                                        name="propertyCategory"
                                        value={formData.propertyCategory || ''}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select Category</option>
                                        {propertyCategories.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
                                        Bedrooms
                                    </label>
                                    <select
                                        id="bedrooms"
                                        name="bedrooms"
                                        value={formData.bedrooms || ''}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select</option>
                                        {[1, 2, 3, 4, 5, '5+'].map(num => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
                                        Bathrooms
                                    </label>
                                    <select
                                        id="bathrooms"
                                        name="bathrooms"
                                        value={formData.bathrooms || ''}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select</option>
                                        {[1, 2, 3, 4, 5, '5+'].map(num => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="balconies" className="block text-sm font-medium text-gray-700 mb-1">
                                        Balconies
                                    </label>
                                    <select
                                        id="balconies"
                                        name="balconies"
                                        value={formData.balconies || ''}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select</option>
                                        {[0, 1, 2, 3, 4, '4+'].map(num => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="furnishingStatus" className="block text-sm font-medium text-gray-700 mb-1">
                                        Furnishing Status
                                    </label>
                                    <select
                                        id="furnishingStatus"
                                        name="furnishingStatus"
                                        value={formData.furnishingStatus || ''}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select</option>
                                        {furnishingOptions.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
                                        Purpose*
                                    </label>
                                    <select
                                        id="purpose"
                                        name="purpose"
                                        value={formData.purpose || ''}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        {purposeOptions.map(option => (
                                            <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="configuration" className="block text-sm font-medium text-gray-700 mb-1">
                                        Configuration
                                    </label>
                                    <select
                                        id="configuration"
                                        name="configuration"
                                        value={formData.configuration || ''}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select</option>
                                        {configurationOptions.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Location Details */}
                    {currentStep === 2 && (
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-6">Location Details</h2>

                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                        Address*
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={formData.address || ''}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Street address"
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                            City*
                                        </label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={formData.city || ''}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="City"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="locality" className="block text-sm font-medium text-gray-700 mb-1">
                                            Locality/Area*
                                        </label>
                                        <input
                                            type="text"
                                            id="locality"
                                            name="locality"
                                            value={formData.locality || ''}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Locality"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                                            PIN Code*
                                        </label>
                                        <input
                                            type="text"
                                            id="pincode"
                                            name="pincode"
                                            value={formData.pincode || ''}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="PIN Code"
                                            pattern="[0-9]*"
                                            maxLength="6"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="facingDirection" className="block text-sm font-medium text-gray-700 mb-1">
                                            Facing Direction
                                        </label>
                                        <select
                                            id="facingDirection"
                                            name="facingDirection"
                                            value={formData.facingDirection || ''}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Select</option>
                                            {directionOptions.map(direction => (
                                                <option key={direction} value={direction}>{direction}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Manual Lat/Lng Input Fields */}
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
                                            Latitude (Manual Entry)
                                        </label>
                                        <input
                                            type="number"
                                            id="latitude"
                                            name="latitude"
                                            value={formData.latitude || ''}
                                            onChange={(e) => handleLatLngChange('latitude', e.target.value)}
                                            step="any"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="e.g. 28.6139"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">
                                            Longitude (Manual Entry)
                                        </label>
                                        <input
                                            type="number"
                                            id="longitude"
                                            name="longitude"
                                            value={formData.longitude || ''}
                                            onChange={(e) => handleLatLngChange('longitude', e.target.value)}
                                            step="any"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="e.g. 77.2090"
                                        />
                                    </div>
                                </div>

                                {/* Google Maps Location Picker Integration */}
                                <LocationPicker
                                    address={formData.address}
                                    city={formData.city}
                                    latitude={formData.latitude}
                                    longitude={formData.longitude}
                                    onLocationSelect={handleLocationSelect}
                                />

                                {/* Display selected coordinates */}
                                {formData.latitude && formData.longitude && (
                                    <div className="text-sm text-gray-700">
                                        <p>Selected location coordinates: {parseFloat(formData.latitude).toFixed(6)}, {parseFloat(formData.longitude).toFixed(6)}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            These coordinates will be used to show your property's location on maps.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Property Details */}
                    {currentStep === 3 && (
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-6">Property Details</h2>

                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                        Property Title*
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={formData.title || ''}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="e.g. 3BHK Apartment in Civil Lines"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                        Description*
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description || ''}
                                        onChange={handleChange}
                                        rows="4"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Describe your property..."
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                            Price*
                                        </label>
                                        <input
                                            type="number"
                                            id="price"
                                            name="price"
                                            value={formData.price || ''}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Amount"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                                            Area*
                                        </label>
                                        <div className="flex">
                                            <input
                                                type="number"
                                                id="area"
                                                name="area"
                                                value={formData.area || ''}
                                                onChange={handleChange}
                                                required
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Area"
                                            />
                                            <select
                                                name="areaUnit"
                                                value={formData.areaUnit || 'sqft'}
                                                onChange={handleChange}
                                                className="w-24 border-y border-r border-gray-300 rounded-r-md bg-gray-50 px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="sqft">sq.ft</option>
                                                <option value="sqm">sq.m</option>
                                                <option value="acres">acres</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="propertyAge" className="block text-sm font-medium text-gray-700 mb-1">
                                            Property Age
                                        </label>
                                        <input
                                            type="number"
                                            id="propertyAge"
                                            name="propertyAge"
                                            value={formData.propertyAge || ''}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Property Age"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="floorNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                                Floor Number
                                            </label>
                                            <input
                                                type="number"
                                                id="floorNumber"
                                                name="floorNumber"
                                                value={formData.floorNumber || ''}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Floor"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="totalFloors" className="block text-sm font-medium text-gray-700 mb-1">
                                                Total Floors
                                            </label>
                                            <input
                                                type="number"
                                                id="totalFloors"
                                                name="totalFloors"
                                                value={formData.totalFloors || ''}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Total Floors"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Photos & Amenities */}
                    {currentStep === 4 && (
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-6">Photos & Amenities</h2>

                            {/* Existing Post Images */}
                            {formData.originalPostImages && formData.originalPostImages.length > 0 && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Current Main Property Images
                                    </label>
                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 mb-4">
                                        {formData.originalPostImages.map((image, index) => (
                                            <div key={index} className="relative rounded-lg overflow-hidden h-24">
                                                <img
                                                    src={image.url || image}
                                                    alt={`Main property image ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute top-1 right-1">
                                                    <input
                                                        type="checkbox"
                                                        checked={(formData.keepPostImages || []).includes(index)}
                                                        onChange={() => toggleKeepPostImage(index)}
                                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div className="absolute bottom-1 left-1 text-xs text-white bg-black bg-opacity-50 px-1 rounded">
                                                    Keep
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500">Uncheck images you want to remove</p>
                                </div>
                            )}

                            {/* New Post Images */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Add New Main Property Images
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                    {formData.newPostImages && formData.newPostImages.length > 0 && (
                                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 mb-4">
                                            {formData.newPostImages.map((image, index) => (
                                                <div key={index} className="relative rounded-lg overflow-hidden h-24">
                                                    <img
                                                        src={URL.createObjectURL(image)}
                                                        alt={`New main property image ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeNewPostImage(index)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div>
                                        <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Upload new main property images
                                        </p>
                                        <div className="mt-4">
                                            <label htmlFor="new-post-images-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                                <svg className="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                Upload New Main Images
                                            </label>
                                            <input
                                                id="new-post-images-upload"
                                                name="new-post-images-upload"
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleNewPostImagesUpload}
                                                className="sr-only"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Existing Floor Plan Images */}
                            {formData.originalFloorPlanImages && formData.originalFloorPlanImages.length > 0 && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Current Floor Plan Images
                                    </label>
                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 mb-4">
                                        {formData.originalFloorPlanImages.map((image, index) => (
                                            <div key={index} className="relative rounded-lg overflow-hidden h-24">
                                                <img
                                                    src={image.url || image}
                                                    alt={`Floor plan ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute top-1 right-1">
                                                    <input
                                                        type="checkbox"
                                                        checked={(formData.keepFloorPlanImages || []).includes(index)}
                                                        onChange={() => toggleKeepFloorPlanImage(index)}
                                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div className="absolute bottom-1 left-1 text-xs text-white bg-black bg-opacity-50 px-1 rounded">
                                                    Keep
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500">Uncheck images you want to remove</p>
                                </div>
                            )}

                            {/* New Floor Plan Images */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Add New Floor Plan Images
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                    {formData.newFloorPlanImages && formData.newFloorPlanImages.length > 0 && (
                                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 mb-4">
                                            {formData.newFloorPlanImages.map((image, index) => (
                                                <div key={index} className="relative rounded-lg overflow-hidden h-24">
                                                    <img
                                                        src={URL.createObjectURL(image)}
                                                        alt={`New floor plan ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeNewFloorPlanImage(index)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div>
                                        <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                        </svg>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Upload new floor plan images
                                        </p>
                                        <div className="mt-4">
                                            <label htmlFor="new-floor-plan-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                                <svg className="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                Upload New Floor Plans
                                            </label>
                                            <input
                                                id="new-floor-plan-upload"
                                                name="new-floor-plan-upload"
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleNewFloorPlanImagesUpload}
                                                className="sr-only"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Existing Gallery Images */}
                            {formData.originalGalleryImages && formData.originalGalleryImages.length > 0 && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Current Gallery Images
                                    </label>
                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 mb-4">
                                        {formData.originalGalleryImages.map((imageUrl, index) => (
                                            <div key={index} className="relative rounded-lg overflow-hidden h-24">
                                                <img
                                                    src={imageUrl}
                                                    alt={`Gallery image ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute top-1 right-1">
                                                    <input
                                                        type="checkbox"
                                                        checked={(formData.keepGalleryImages || []).includes(index)}
                                                        onChange={() => toggleKeepGalleryImage(index)}
                                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div className="absolute bottom-1 left-1 text-xs text-white bg-black bg-opacity-50 px-1 rounded">
                                                    Keep
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500">Uncheck images you want to remove</p>
                                </div>
                            )}

                            {/* New Gallery Images */}
                            <div className="mb-8">
                                <div className="mb-2 flex justify-between items-center">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Add New Gallery Images
                                    </label>
                                    <span className="text-xs text-gray-500">
                                        {(formData?.newGalleryImages?.length || 0)} new images
                                    </span>
                                </div>

                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    {formData.newGalleryImages && formData.newGalleryImages.length > 0 && (
                                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 mb-4">
                                            {formData?.newGalleryImages?.map((image, index) => (
                                                <div key={index} className="relative rounded-lg overflow-hidden h-24">
                                                    <img
                                                        src={URL.createObjectURL(image)}
                                                        alt={`New gallery image ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeNewGalleryImage(index)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div>
                                        <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Upload new gallery photos
                                        </p>
                                        <div className="mt-4">
                                            <label htmlFor="new-gallery-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                                <svg className="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                Upload New Gallery Photos
                                            </label>
                                            <input
                                                id="new-gallery-upload"
                                                name="new-gallery-upload"
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleNewGalleryImagesUpload}
                                                className="sr-only"
                                            />
                                        </div>
                                        <p className="mt-2 text-xs text-gray-500">
                                            PNG, JPG, GIF up to 5MB each
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Amenities section with custom input */}
                            {renderCheckboxSection('Amenities', amenitiesOptions, 'amenities')}
                        </div>
                    )}

                    {/* Step 5: Ownership & Legal Details */}
                    {currentStep === 5 && (
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-6">Ownership & Legal Details</h2>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Property Owner's Name"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="propertyOwnership" className="block text-sm font-medium text-gray-700 mb-1">
                                        Property Ownership
                                    </label>
                                    <select
                                        id="propertyOwnership"
                                        name="propertyOwnership"
                                        value={formData.propertyOwnership || ''}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select</option>
                                        {ownershipOptions.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select</option>
                                        {transactionTypeOptions.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="reraStatus" className="block text-sm font-medium text-gray-700 mb-1">
                                        RERA Status
                                    </label>
                                    <select
                                        id="reraStatus"
                                        name="reraStatus"
                                        value={formData.reraStatus || ''}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select</option>
                                        {reraStatusOptions.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>

                                {formData.reraStatus === 'Registered' && (
                                    <div>
                                        <label htmlFor="reraRegistrationNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                            RERA Registration Number
                                        </label>
                                        <input
                                            type="text"
                                            id="reraRegistrationNumber"
                                            name="reraRegistrationNumber"
                                            value={formData.reraRegistrationNumber || ''}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="RERA Registration Number"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="reraWebsite" className="block text-sm font-medium text-gray-700 mb-1">
                                        Rera Website
                                    </label>
                                    <input
                                        type="text"
                                        id="reraWebsite"
                                        name="reraWebsite"
                                        value={formData.reraWebsite || ''}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Rera Website URL"
                                    />
                                </div>

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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="construction_status" className="block text-sm font-medium text-gray-700 mb-1">
                                        Construction Status
                                    </label>
                                    <select
                                        id="construction_status"
                                        name="construction_status"
                                        value={formData.construction_status || ''}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select</option>
                                        {constructionStatusOptions.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mt-6">
                                <div className="flex items-center">
                                    <input
                                        id="priceOnRequest"
                                        name="priceOnRequest"
                                        type="checkbox"
                                        checked={formData.priceOnRequest || false}
                                        onChange={(e) => setFormData({ ...formData, priceOnRequest: e.target.checked })}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="priceOnRequest" className="ml-2 block text-sm text-gray-700">
                                        Price on Request (Hide actual price)
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 6: Additional Property Features */}
                    {currentStep === 6 && (
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-6">Additional Property Features</h2>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="carpetArea" className="block text-sm font-medium text-gray-700 mb-1">
                                        Carpet Area
                                    </label>
                                    <input
                                        type="number"
                                        id="carpetArea"
                                        name="carpetArea"
                                        value={formData.carpetArea || ''}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Carpet Area"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="superBuiltupArea" className="block text-sm font-medium text-gray-700 mb-1">
                                        Super Built-up Area
                                    </label>
                                    <input
                                        type="number"
                                        id="superBuiltupArea"
                                        name="superBuiltupArea"
                                        value={formData.superBuiltupArea || ''}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Super Built-up Area"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="flooring" className="block text-sm font-medium text-gray-700 mb-1">
                                        Flooring
                                    </label>
                                    <select
                                        id="flooring"
                                        name="flooring"
                                        value={formData.flooring || ''}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select</option>
                                        {flooringOptions.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="parking" className="block text-sm font-medium text-gray-700 mb-1">
                                        Parking
                                    </label>
                                    <select
                                        id="parking"
                                        name="parking"
                                        value={formData.parking || ''}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select</option>
                                        {parkingOptions.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="powerBackup" className="block text-sm font-medium text-gray-700 mb-1">
                                        Power Backup
                                    </label>
                                    <select
                                        id="powerBackup"
                                        name="powerBackup"
                                        value={formData.powerBackup || ''}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select</option>
                                        {powerBackupOptions.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>

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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Road Width"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                                {/* Water Sources with custom input */}
                                {renderCheckboxSection('Water Sources', waterSourceOptions, 'waterSource')}

                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <input
                                            id="gatedCommunity"
                                            name="gatedCommunity"
                                            type="checkbox"
                                            checked={formData.gatedCommunity || false}
                                            onChange={(e) => setFormData({ ...formData, gatedCommunity: e.target.checked })}
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor="gatedCommunity" className="ml-2 block text-sm text-gray-700">
                                            Gated Community
                                        </label>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            id="petFriendly"
                                            name="petFriendly"
                                            type="checkbox"
                                            checked={formData.petFriendly || false}
                                            onChange={(e) => setFormData({ ...formData, petFriendly: e.target.checked })}
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor="petFriendly" className="ml-2 block text-sm text-gray-700">
                                            Pet Friendly
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 7: USP and Tags */}
                    {currentStep === 7 && (
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-6">Unique Selling Points & Tags</h2>

                            {/* Religious Nearby Section with custom input */}
                            {renderCheckboxSection('Religious Places Nearby', religiousNearbyOptions, 'religiousNearby')}

                            {/* In Proximity Section with custom input */}
                            {renderCheckboxSection('In Proximity', inProximityOptions, 'inProximity')}

                            {/* USP Section with custom input */}
                            {renderCheckboxSection('Unique Selling Points', ['Close to metro', 'Spacious rooms', '24x7 security', 'Clubhouse access', 'Corner property', 'Garden view'], 'usp')}

                            {/* Tags Section with custom input */}
                            {renderCheckboxSection('Tags', ['Spacious', 'Corner unit', 'Garden view', 'Well ventilated', 'Vastu compliant', 'Luxury', 'Investment'], 'tags')}

                            {/* Overlooking Amenities with custom input */}
                            {renderCheckboxSection('Overlooking Amenities', ['Pool', 'Garden', 'Park', 'Main Road', 'Lake', 'Sea', 'Mountain'], 'overlookingAmenities')}

                            {/* Location Advantages with custom input */}
                            {renderCheckboxSection('Location Advantages', ['Near School', 'Shopping Mall', 'Hospital', 'Metro Station', 'Bus Stop', 'Airport', 'Railway Station'], 'location_advantage')}

                            {/* Contact Numbers */}
                            <div className="mb-6">
                                <label htmlFor="contactList" className="block text-sm font-medium text-gray-700 mb-1">
                                    Contact Numbers
                                </label>
                                <div className="mb-2">
                                    <input
                                        type="tel"
                                        id="contactNumber"
                                        placeholder="Enter contact number"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        pattern="[0-9]{10}"
                                        maxLength="10"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Enter a 10-digit mobile number
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const contactNumberInput = document.getElementById('contactNumber');
                                        const contactNumber = contactNumberInput.value.trim();
                                        if (contactNumber && contactNumber.length === 10 && !isNaN(contactNumber)) {
                                            const contactListArray = formData.contactList || [];
                                            if (!contactListArray.includes(Number(contactNumber))) {
                                                setFormData({
                                                    ...formData,
                                                    contactList: [...contactListArray, Number(contactNumber)]
                                                });
                                                contactNumberInput.value = '';
                                            }
                                        }
                                    }}
                                    className="mb-4 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Add Contact Number
                                </button>

                                {(formData.contactList || []).length > 0 && (
                                    <div className="mt-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Added Contact Numbers:</label>
                                        <div className="flex flex-wrap gap-2">
                                            {(formData.contactList || []).map((number, index) => (
                                                <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                                                    <span className="text-sm text-gray-800">{number}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setFormData({
                                                                ...formData,
                                                                contactList: (formData.contactList || []).filter((_, i) => i !== index)
                                                            });
                                                        }}
                                                        className="ml-1 text-gray-600 hover:text-gray-900"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 border-t pt-6">
                                <h3 className="text-md font-medium text-gray-800 mb-4">Advanced Property Details</h3>

                                {/* All the advanced sections with custom inputs */}
                                {renderCheckboxSection('Vastu Compliance', vastuCompliance, 'vastuCompliance')}
                                {renderCheckboxSection('Loan Approval Status', loanApprovalStatus, 'loanApprovalStatus')}
                                {renderCheckboxSection('Builder Reputation', builderReputation, 'builderReputation')}
                                {renderCheckboxSection('Legal Clearance', legalClearance, 'legalClearance')}

                                {/* Maintenance Charges */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Maintenance Charges
                                    </label>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">
                                                Minimum Price
                                            </label>
                                            <input
                                                type="text"
                                                id="minPrice"
                                                value={formData.maintenanceCharges?.minPrice || ''}
                                                onChange={(e) => {
                                                    setFormData({
                                                        ...formData,
                                                        maintenanceCharges: {
                                                            ...(formData.maintenanceCharges || {}),
                                                            minPrice: e.target.value
                                                        }
                                                    });
                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Min Price"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
                                                Maximum Price
                                            </label>
                                            <input
                                                type="text"
                                                id="maxPrice"
                                                value={formData.maintenanceCharges?.maxPrice || ''}
                                                onChange={(e) => {
                                                    setFormData({
                                                        ...formData,
                                                        maintenanceCharges: {
                                                            ...(formData.maintenanceCharges || {}),
                                                            maxPrice: e.target.value
                                                        }
                                                    });
                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Max Price"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="maintPriceUnit" className="block text-sm font-medium text-gray-700 mb-1">
                                                Price Unit
                                            </label>
                                            <select
                                                id="maintPriceUnit"
                                                value={formData.maintenanceCharges?.priceUnit || ''}
                                                onChange={(e) => {
                                                    setFormData({
                                                        ...formData,
                                                        maintenanceCharges: {
                                                            ...(formData.maintenanceCharges || {}),
                                                            priceUnit: e.target.value
                                                        }
                                                    });
                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="">Select Unit</option>
                                                <option value="₹">₹ (Rupees)</option>
                                                <option value="$">$ (Dollars)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="maintAreaUnit" className="block text-sm font-medium text-gray-700 mb-1">
                                                Area Unit
                                            </label>
                                            <select
                                                id="maintAreaUnit"
                                                value={formData.maintenanceCharges?.areaUnit || ''}
                                                onChange={(e) => {
                                                    setFormData({
                                                        ...formData,
                                                        maintenanceCharges: {
                                                            ...(formData.maintenanceCharges || {}),
                                                            areaUnit: e.target.value
                                                        }
                                                    });
                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="">Select Unit</option>
                                                <option value="sqft">sq.ft</option>
                                                <option value="sqm">sq.m</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {renderCheckboxSection('Environmental Factors', environmentalFactors, 'environmentalFactors')}
                                {renderCheckboxSection('Kitchen Type', kitchenType, 'kitchenType')}
                                {renderCheckboxSection('Bathroom Features', bathroomFeatures, 'bathroomFeatures')}
                                {renderCheckboxSection('Special Categories', specialCategories, 'specialCategories')}
                                {renderCheckboxSection('Flooring Type', flooringType, 'flooringType')}
                                {renderCheckboxSection('Social Infrastructure', socialInfrastructure, 'socialInfrastructure')}
                            </div>

                            {/* Financing Options with custom input */}
                            {renderCheckboxSection('Financing Options', financingOptionsArray, 'financingOptions')}

                            {/* WhatsApp and ProxiPro Options */}
                            <div className="mt-6 border-t pt-6">
                                <h3 className="text-md font-medium text-gray-800 mb-4">Communication Preferences</h3>

                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <input
                                            id="whatsappAlerts"
                                            name="whatsappAlerts"
                                            type="checkbox"
                                            checked={formData.whatsappAlerts || false}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                whatsappAlerts: e.target.checked
                                            })}
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor="whatsappAlerts" className="ml-2 block text-sm text-gray-700">
                                            Enable WhatsApp alerts for property inquiries
                                        </label>
                                    </div>

                                    {formData.whatsappAlerts && (
                                        <div>
                                            <label htmlFor="whatsappContact" className="block text-sm font-medium text-gray-700 mb-1">
                                                WhatsApp Contact Number
                                            </label>
                                            <input
                                                type="tel"
                                                id="whatsappContact"
                                                name="whatsappContact"
                                                value={formData.whatsappContact || ''}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter WhatsApp number"
                                                pattern="[0-9]{10}"
                                                maxLength="10"
                                            />
                                            <p className="mt-1 text-xs text-gray-500">
                                                Enter a 10-digit WhatsApp number where you want to receive alerts
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex items-center">
                                        <input
                                            id="profoProxyAllowed"
                                            name="profoProxyAllowed"
                                            type="checkbox"
                                            checked={formData.profoProxyAllowed || false}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                profoProxyAllowed: e.target.checked
                                            })}
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor="profoProxyAllowed" className="ml-2 block text-sm text-gray-700">
                                            Allow ProxiPro agents to represent this property
                                        </label>
                                        <span className="ml-1 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                            Recommended
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 ml-6">
                                        When enabled, certified ProxiPro agents can represent your property to potential buyers/tenants, increasing your chances of a successful deal.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation buttons */}
                    <div className="flex justify-between mt-8">
                        {currentStep > 1 ? (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <svg className="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                                Previous
                            </button>
                        ) : (
                            <div></div>
                        )}

                        {currentStep < 7 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Next
                                <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        ) : (
                            <div className='flex gap-2'>
                                <button
                                    type="button"
                                    onClick={() => navigate('/property-management')}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                                                <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            Update Property
                                            <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyEdit;