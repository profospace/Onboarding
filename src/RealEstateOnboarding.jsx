import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LocationPicker from './LocationPicker';
import { Steps } from 'antd';
import AutofillOptions from './AutofillOptions';
import { toast } from 'react-hot-toast';
import { base_url } from '../utils/base_url';
import axios from 'axios';
import { Building, Upload, CheckCircle } from 'lucide-react';

import { Select, Form } from 'antd';
const { Option } = Select;


const RealEstateOnboarding = ({ user }) => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const location = useLocation();

    const [salesmanList, setSalesmanList] = useState([]);
    const [selectedSalesman ,setSelectedSalesman] = useState('')
    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState('property');
    const [builderResponse, setBuilderResponse] = useState(null);
    const [isBuilderUploadEnabled, setIsBuilderUploadEnabled] = useState(false);
    const [builderLoading, setBuilderLoading] = useState(false);
    const [builderData, setBuilderData] = useState({
        name: '',
        phoneNumber: ''
    });

    

    console.log("selectedSalesman", selectedSalesman)

    // Check if builder upload should be enabled
    useEffect(() => {
        const hasName = builderData.name && builderData.name.trim().length > 0;
        const hasPhone = builderData.phoneNumber && builderData.phoneNumber.trim().length >= 10;
        setIsBuilderUploadEnabled(hasName && hasPhone);
    }, [builderData.name, builderData.phoneNumber]);


    // Get user token from localStorage
    const details = JSON.parse(localStorage.getItem('user'));

    // get all salesman
    const getAllSalesman = async () => {
        try {
            const response = await axios.get(`${base_url}/api/adminSales/all-salesman-no-limit`, {
                headers: { Authorization: `Bearer ${details?.token}` }
            });
            setSalesmanList(response.data.data);
        } catch (error) {
            console.error("Error fetching salesman:", error);
        }
    };

    useEffect(() => {
        getAllSalesman();
    }, []);

    const handleFormSubmit = (values) => {
        console.log('Form values:', values);
        console.log('Selected salesman ID:', values.salesman);
    };



    // Modify the form initialization in the useEffect or where you initialize formData
    const [formData, setFormData] = useState(() => {
        // Check if we have draft data from navigation
        if (location.state && location.state.draftData) {
            const draftData = location.state.draftData;

            // Function to convert Base64 to File
            const base64ToFile = (base64String, fileName, mimeType) => {
                const byteString = atob(base64String.split(',')[1]);
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);

                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }

                return new File([ab], fileName, { type: mimeType || 'image/jpeg' });
            };

            // Process the draft data to restore images
            const processedDraftData = { ...draftData };

            // Restore main images if available
            if (processedDraftData.postImagesBase64) {
                try {
                    processedDraftData.postImages = processedDraftData.postImagesBase64.map((base64String, index) => {
                        const fileName = processedDraftData.postImageNames?.[index] || `main-image-${index}.jpg`;
                        return base64ToFile(base64String, fileName);
                    });
                    delete processedDraftData.postImagesBase64;
                } catch (e) {
                    console.error('Failed to restore main images:', e);
                }
            }

            // Restore floor plan images if available
            if (processedDraftData.floorPlanImagesBase64) {
                try {
                    processedDraftData.floorPlanImages = processedDraftData.floorPlanImagesBase64.map((base64String, index) => {
                        const fileName = processedDraftData.floorPlanImageNames?.[index] || `floor-plan-${index}.jpg`;
                        return base64ToFile(base64String, fileName);
                    });
                    delete processedDraftData.floorPlanImagesBase64;
                } catch (e) {
                    console.error('Failed to restore floor plan images:', e);
                }
            }

            // Restore gallery images if available
            if (processedDraftData.galleryImagesBase64 && Array.isArray(processedDraftData.galleryImagesBase64)) {
                const restoredGallery = [];

                processedDraftData.galleryImagesBase64.forEach((base64String, index) => {
                    try {
                        const fileName = processedDraftData.galleryImageNames?.[index] || `gallery-image-${index}.jpg`;
                        const file = base64ToFile(base64String, fileName);
                        restoredGallery.push(file);
                    } catch (e) {
                        console.error(`Failed to restore gallery image ${index}:`, e);
                    }
                });

                processedDraftData.galleryImages = restoredGallery;
                delete processedDraftData.galleryImagesBase64;
            }

            return processedDraftData;
        }

        // Otherwise use the default initial state
        return {
            propertyType: '',
            propertyCategory: '',
            bedrooms: '',
            bathrooms: '',
            balconies: '',
            furnishingStatus: '',
            propertyAge: '',
            floorNumber: '',
            totalFloors: '',
            facingDirection: '',
            address: '',
            city: '',
            locality: '',
            pincode: '',
            title: '',
            description: '',
            price: '',
            area: '',
            areaUnit: 'sqft',
            amenities: [],
            postImages: [],           // Changed to array for multiple main images
            floorPlanImages: [],      // Changed to array for multiple floor plan images
            galleryImages: [],         // Additional property images
            latitude: '',              // Added for Google Maps
            longitude: '',            // Added for Google Maps
            purpose: 'buy',
            usp: [],
            ownerName: '',
            contactList: [],
            superBuiltupArea: '',
            carpetArea: '',
            pricePerSqFt: '',
            estimatedEMI: '',
            reraStatus: '',
            reraRegistrationNumber: '',
            reraWebsite: '',
            configuration: '',
            facing: '',
            overlookingAmenities: [],
            possessionDate: '',
            transactionType: '',
            propertyOwnership: '',
            flooring: '',
            parking: '',
            propertyCode: '',
            widthOfFacingRoad: '',
            gatedCommunity: false,
            waterSource: [],
            powerBackup: '',
            petFriendly: false,
            agreement: '',
            priceOnRequest: false,
            verified: false,
            anyConstraint: [],
            propertyTypes: [],
            propertyFeatures: [],
            viewTypes: [],
            propertyConditions: [],
            legalStatuses: [],
            constructionStatuses: [],
            ownershipTypes: [],
            financingOptions: [],
            environmentalCertifications: [],
            propertyManagementServices: [],
            investmentStrategies: [],
            tags: [],
            facilities: [],
            location_advantage: [],
            construction_status: '',
            possession: '',
            region: '',
            category: '',
            broker_status: '',
            furnishStatus: '',
            whatsappAlerts: false,
            whatsappContact: '',
            profoProxyAllowed: false,
            religiousNearby: [],
            inProximity: [],
            vastuCompliance: [],
            loanApprovalStatus: [],
            builderReputation: [],
            legalClearance: [],
            environmentalFactors: [],
            kitchenType: [],
            bathroomFeatures: [],
            specialCategories: [],
            flooringType: [],
            socialInfrastructure: [],
            maintenanceCharges: {
                minPrice: '',
                maxPrice: '',
                priceUnit: '',
                areaUnit: ''
            },
        };
    });

    // Add this function to your PropertyAdd component
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


    const categoryMap = {
        'Residential': 1,
        'Commercial': 2,
        'Industrial': 3,
        'Agricultural': 4
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

    const vastuCompliance = ['Vastu Friendly Layout', 'East Facing', 'North East Facing', 'North Facing', 'South East Facing', 'West Facing', 'Proper Room Placement', 'Vastu Compliant Kitchen', 'Vastu Compliant Main Door']

    const loanApprovalStatus = ['Bank Approved Project', 'Pre-Approved Loans', 'Government Subsidy Eligible', 'PMAY Eligible', 'Home Loan Available', 'No Loan Available']

    const builderReputation = ['Premium/Luxury Developer', 'Mid-Tier Developer', 'Budget Developer', 'Government Housing', 'Award-Winning Developer', 'Timely Delivery Track Record']

    const legalClearance = ['Clear Title', 'RERA Registered', 'Occupancy Certificate', 'Completion Certificate', 'NOC from Authorities', 'Approved Building Plan']

    const environmentalFactors = ['Green Building Certified', 'Solar Power Installation', 'Waste Management System', 'EV Charging Points', 'Low Pollution Area', 'Green Belt Proximity']

    const kitchenType = ['Modular Kitchen', 'Semi-Modular Kitchen', 'Open Kitchen', 'Closed Kitchen', 'Kitchen with Utility Area', 'Kitchen Garden Access']

    const bathroomFeatures = ['Standard Bathroom',
        'Premium Fittings',
        'Western Toilet',
        'Bathtub',
        'Shower Enclosure',
        'Master Bath',
        'Common Bath']

    const specialCategories = [
        'Senior Citizen Friendly',
        'Gated Community',
        'Farm House',
        'Weekend Home',
        'Investment Property',
        'Rental Income Property',
        'NRI Preferred'
    ];

    const flooringType = [
        'Vitrified Tiles',
        'Marble Flooring',
        'Wooden Flooring',
        'Granite Flooring',
        'Ceramic Tiles',
        'Italian Marble',
        'Anti-Skid Tiles'
    ];

    const socialInfrastructure = [
        'School Proximity',
        'College Vicinity',
        'Hospital Access',
        'Shopping Mall Proximity',
        'Restaurant/Food Hub Nearby',
        'Entertainment Zone Access'
    ];

    const financingOptionsArray = ["Conventional Mortgage", "FHA Loan", "VA Loan", "Cash Only"];

    // Generic function to add custom option to any checkbox array
    const addCustomOption = (fieldName, customValue, inputId) => {
        if (customValue && !formData[fieldName].includes(customValue)) {
            setFormData({
                ...formData,
                [fieldName]: [...formData[fieldName], customValue]
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

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        console.log("NAME VALUE", name, value)
        if (type === 'checkbox') {
            // Handle amenities checkboxes
            if (checked) {
                setFormData({
                    ...formData,
                    amenities: [...formData.amenities, value]
                });
            } else {
                setFormData({
                    ...formData,
                    amenities: formData.amenities.filter(item => item !== value)
                });
            }
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    // Handle multiple post images upload
    const handlePostImagesUpload = (e) => {
        const files = Array.from(e.target.files);
        setFormData({
            ...formData,
            postImages: [...formData.postImages, ...files]
        });
    };

    // Handle multiple floor plan images upload
    const handleFloorPlanImagesUpload = (e) => {
        const files = Array.from(e.target.files);
        setFormData({
            ...formData,
            floorPlanImages: [...formData.floorPlanImages, ...files]
        });
    };

    // Handle gallery images upload
    const handleGalleryImagesUpload = (e) => {
        const files = Array.from(e.target.files);
        setFormData({
            ...formData,
            galleryImages: [...formData.galleryImages, ...files]
        });
    };

    // Remove post image
    const handleRemovePostImage = (index) => {
        const newPostImages = [...formData.postImages];
        newPostImages.splice(index, 1);
        setFormData({
            ...formData,
            postImages: newPostImages
        });
    };

    // Remove floor plan image
    const handleRemoveFloorPlanImage = (index) => {
        const newFloorPlanImages = [...formData.floorPlanImages];
        newFloorPlanImages.splice(index, 1);
        setFormData({
            ...formData,
            floorPlanImages: newFloorPlanImages
        });
    };

    // Remove gallery image
    const handleRemoveGalleryImage = (index) => {
        const newGalleryImages = [...formData.galleryImages];
        newGalleryImages.splice(index, 1);
        setFormData({
            ...formData,
            galleryImages: newGalleryImages
        });
    };

    // Go to next step
    const nextStep = () => {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
    };

    // Go to previous step
    const prevStep = () => {
        setCurrentStep(currentStep - 1);
        window.scrollTo(0, 0);
    };

    const saveDraft = () => {
        try {
            // Create a deep copy of the form data without the File objects
            const draftData = { ...formData };

            // Function to convert a File to Base64
            const fileToBase64 = (file) => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.readAsDataURL(file);
                });
            };

            // Since FileReader is async, we need to use Promise.all
            const prepareDataForStorage = async () => {
                // Handle main images
                if (draftData.postImages && draftData.postImages.length > 0) {
                    const postImagesBase64 = [];
                    const postImageNames = [];

                    for (const img of draftData.postImages) {
                        if (img instanceof File) {
                            postImagesBase64.push(await fileToBase64(img));
                            postImageNames.push(img.name);
                        }
                    }

                    draftData.postImagesBase64 = postImagesBase64;
                    draftData.postImageNames = postImageNames;
                    draftData.postImages = [];
                }

                // Handle floor plan images
                if (draftData.floorPlanImages && draftData.floorPlanImages.length > 0) {
                    const floorPlanImagesBase64 = [];
                    const floorPlanImageNames = [];

                    for (const img of draftData.floorPlanImages) {
                        if (img instanceof File) {
                            floorPlanImagesBase64.push(await fileToBase64(img));
                            floorPlanImageNames.push(img.name);
                        }
                    }

                    draftData.floorPlanImagesBase64 = floorPlanImagesBase64;
                    draftData.floorPlanImageNames = floorPlanImageNames;
                    draftData.floorPlanImages = [];
                }

                // Handle gallery images
                if (draftData.galleryImages && draftData.galleryImages.length > 0) {
                    const galleryBase64 = [];
                    const galleryNames = [];

                    for (const img of draftData.galleryImages) {
                        if (img instanceof File) {
                            galleryBase64.push(await fileToBase64(img));
                            galleryNames.push(img.name);
                        }
                    }

                    draftData.galleryImagesBase64 = galleryBase64;
                    draftData.galleryImageNames = galleryNames;
                    draftData.galleryImages = [];
                }

                // Add draft metadata
                draftData.draftId = `draft_${Date.now()}`;
                draftData.lastUpdated = new Date().toISOString();

                // Get existing drafts
                const existingDrafts = JSON.parse(localStorage.getItem('propertyDrafts') || '[]');

                // Add new draft
                localStorage.setItem('propertyDrafts', JSON.stringify([...existingDrafts, draftData]));

                console.log('Draft saved successfully');
                toast.success('Draft saved successfully');
            };

            prepareDataForStorage();
        } catch (error) {
            console.error('Error saving draft:', error);
            toast.error('Error saving draft: ' + error.message);
        }
    };

    // Submit the form
    const handleSubmit = async () => {
        setLoading(true);

        try {
            // Prepare form data for API submission
            const propertyData = new FormData();

            const mainData = {
                type_name: formData.propertyType,
                post_title: formData.title,
                post_description: formData.description,
                pincode: formData.pincode,
                price: formData.price,
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
                post_id: `PROP${Date.now()}`,
                builder: builderResponse?.builder?._id,


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
                // assignToSalesman : selectedSalesman
            };

            console.log("mainData", mainData)
            if (user && user.id) {
                mainData.user_id = user.id;
            }

            propertyData.append('data', JSON.stringify(mainData));

            // Add main property images
            if (formData.postImages && formData.postImages.length > 0) {
                formData.postImages.forEach(image => {
                    propertyData.append('post_images', image);
                });
            }

            // Add floor plan images
            if (formData.floorPlanImages && formData.floorPlanImages.length > 0) {
                formData.floorPlanImages.forEach(image => {
                    propertyData.append('floor_plan_images', image);
                });
            }

            // Add gallery images
            if (formData.galleryImages && formData.galleryImages.length > 0) {
                formData.galleryImages.forEach(image => {
                    propertyData.append('galleryList', image);
                });
            }

            const token = localStorage.getItem('token')
            const response = await fetch(`${base_url}/api/upload/property`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: propertyData,
            });

            const data = await response.json()
            console.log("data", data)
            if (data?.success == true) {
                toast.success('Property submitted successfully!');
                console.log('Property submitted successfully:', data);
                setFormData({})
                setBuilderResponse(null)
                setBuilderData({
                    name: '',
                    phoneNumber: ''
                })
                navigate('/onboarding');
            } else {
                // toast.error(`Submission failed: ${data.message || 'Unknown error'}`);
                // toast.error(`${data.error || 'Unknown error'}`);
                toast.error(`${data.message || 'Unknown error'}`);
                console.error('Error submitting property:', data);
            }

        } catch (error) {
            console.error('Error submitting property:', error);
            toast.error(`Failed to submit property: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Generate dynamic title
    const generateDynamicTitle = () => {
        const { configuration, propertyType, purpose, locality } = formData;

        if (!configuration || !propertyType || !purpose || !locality) {
            return '';
        }

        return `${configuration} ${propertyType} for ${purpose} in ${locality}`;
    };

    // Create a useEffect to update the title when relevant fields change
    useEffect(() => {
        if (!formData.titleModifiedByUser &&
            (formData.configuration && formData.propertyType &&
                formData.purpose && formData.locality)) {
            setFormData(prevData => ({
                ...prevData,
                title: generateDynamicTitle()
            }));
        }
    }, [formData.configuration, formData.propertyType, formData.purpose, formData.locality]);

    // Add a flag to track if the user has manually edited the title
    const handleTitleChange = (e) => {
        setFormData({
            ...formData,
            title: e.target.value,
            titleModifiedByUser: true
        });
    };

    // Handle builder form changes
    const handleBuilderChange = (field, value) => {
        setBuilderData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle builder upload
    const handleBuilderUpload = async () => {
        setBuilderLoading(true);
        try {
            const formData = new FormData();

            const builderDataForAPI = {
                name: builderData.name.trim(),
                contacts: [builderData.phoneNumber.trim()],
                isOwner: true,
                status: 'ACTIVE'
            };

            formData.append('data', JSON.stringify(builderDataForAPI));

            const response = await fetch(`${base_url}/builders`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${details?.token}`
                }
            });

            const result = await response.json();

            if (result.success) {
                setBuilderResponse(result);
                toast.success('Builder created successfully!');
                console.log('Builder created:', result.builder);
            } else {
                throw new Error(result.error || 'Builder creation failed');
            }

        } catch (error) {
            console.error('Builder upload error:', error);
            toast.error(`Builder creation failed: ${error.message}`);
        } finally {
            setBuilderLoading(false);
        }
    };

    console.log("BuilderRes" , builderResponse)
    // Reset builder form
    const resetBuilderForm = () => {
        setBuilderData({
            name: '',
            phoneNumber: ''
        });
        setBuilderResponse(null);
    };


    // Builder form component
    const renderBuilderForm = () => {
        if (builderResponse) {
            return (
                <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                    <div className="py-8">
                        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">
                            Builder Created Successfully!
                        </h3>
                        <div className="bg-green-50 p-4 rounded-lg mt-4 text-left">
                            <p className="text-sm text-green-800">
                                <strong>Builder ID:</strong> {builderResponse.builder?._id}
                            </p>
                            <p className="text-sm text-green-800">
                                <strong>Name:</strong> {builderResponse.builder?.name}
                            </p>
                            {builderResponse.builder?.username && (
                                <p className="text-sm text-green-800">
                                    <strong>Username:</strong> {builderResponse.builder.username}
                                </p>
                            )}
                            {builderResponse.builder?.password && (
                                <p className="text-sm text-green-800">
                                    <strong>Password:</strong> {builderResponse.builder.password}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={resetBuilderForm}
                            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Create Another Builder
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Building className="mr-2 h-5 w-5" />
                    Create New Builder
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Builder Name *
                        </label>
                        <input
                            type="text"
                            value={builderData.name}
                            onChange={(e) => handleBuilderChange('name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter builder/company name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number *
                        </label>
                        <input
                            type="tel"
                            value={builderData.phoneNumber}
                            onChange={(e) => handleBuilderChange('phoneNumber', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter phone number"
                            pattern="[0-9]{10}"
                            maxLength="10"
                        />
                        <p className="text-xs text-gray-500 mt-1">Enter a 10-digit mobile number</p>
                    </div>

                    <div className="pt-4">
                        <button
                            onClick={handleBuilderUpload}
                            disabled={!isBuilderUploadEnabled || builderLoading}
                            className={`w-full px-6 py-3 rounded-lg flex items-center justify-center ${!isBuilderUploadEnabled || builderLoading
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-green-600 text-white hover:bg-green-700'
                                }`}
                        >
                            {builderLoading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Creating Builder...
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Create Builder
                                </div>
                            )}
                        </button>

                        {!isBuilderUploadEnabled && (
                            <p className="text-sm text-orange-600 mt-2 text-center">
                                Please fill in both name and phone number to create builder
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="">
            {/* Tab Navigation */}
            <div className="mb-6">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('property')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'property'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Property Onboarding
                        </button>
                        <button
                            onClick={() => setActiveTab('builder')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'builder'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Builder Management
                        </button>
                    </nav>
                </div>
            </div>
            {
                activeTab === 'builder' ? 
                    <div className="max-w-2xl mx-auto">
                    {renderBuilderForm()}
                </div>: (

                    
            <>
                            <div className="mx-auto">
                                <div className="mx-auto ">
                                    <AutofillOptions
                                        onSelect={(data) => {
                                            setFormData({
                                                ...formData,
                                                ...data
                                            });
                                        }}
                                    />
                                </div>
                                {/* Navigation buttons */}
                                <div className="flex justify-between my-2 items-center">
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

                                    {
                                        details?.role === 'admin' && <Form.Item
                                            label="Select Salesman"
                                            name="salesman"
                                            rules={[{ message: 'Please select a salesman!' }]}
                                        >
                                            <Select
                                                showSearch
                                                placeholder="Search and select a salesman"
                                                onChange={(value) => {
                                                    setSelectedSalesman(value); // Save selected ID
                                                }}
                                                // filterOption={(input, option) =>
                                                //     option.children.toLowerCase().includes(input.toLowerCase())
                                                // }
                                                filterOption={(input, option) => {
                                                    const searchText = input.toLowerCase();
                                                    return (
                                                        option.key.toLowerCase().includes(searchText) ||
                                                        (option.email && option.email.toLowerCase().includes(searchText)) ||
                                                        (option.phone && option.phone.includes(input))
                                                    );
                                                }}
                                            >
                                                {salesmanList.map((salesman) => (
                                                    <Option key={salesman._id} value={salesman._id}>
                                                        {salesman.name} - {salesman.email}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    }

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
                                                onClick={() => saveDraft()}
                                                disabled={loading}
                                                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-700 hover:bg-yellow-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                            >
                                                Save As Draft
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleSubmit}
                                                disabled={loading}
                                                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                            >
                                                {loading ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Submitting...
                                                    </>
                                                ) : (
                                                    <>
                                                        Submit Property
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
                                    percent={((currentStep - 1) / 7) * 100}
                                    onChange={(current) => navigateToStep(current + 1)}
                                    // type="navigation" 
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
                                                        value={formData.propertyType}
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
                                                        value={formData.propertyCategory}
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
                                                        value={formData.bedrooms}
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
                                                        value={formData.bathrooms}
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
                                                        value={formData.balconies}
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
                                                        value={formData.furnishingStatus}
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
                                                        value={formData.purpose}
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
                                                        value={formData.configuration}
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
                                                        value={formData.address}
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
                                                            value={formData.city}
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
                                                            value={formData.locality}
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
                                                            value={formData.pincode}
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
                                                            value={formData.facingDirection}
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
                                                            value={formData.latitude}
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
                                                            value={formData.longitude}
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
                                                        value={formData.title}
                                                        onChange={handleTitleChange}
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
                                                        value={formData.description}
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
                                                            value={formData.price}
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
                                                                value={formData.area}
                                                                onChange={handleChange}
                                                                required
                                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                                placeholder="Area"
                                                            />
                                                            <select
                                                                name="areaUnit"
                                                                value={formData.areaUnit}
                                                                onChange={handleChange}
                                                                className="w-24 border-y border-r border-gray-300 rounded-r-md bg-gray-50 px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                            >
                                                                <option value="sqft">sq.ft</option>
                                                                <option value="sqm">sq.m</option>
                                                                <option value="acres">acres</option>
                                                            </select>
                                                        </div>

                                                        <div className='my-2'>
                                                            <label htmlFor="carpetArea" className="block text-sm font-medium text-gray-700 mb-1">
                                                                Carpet Area
                                                            </label>
                                                            <input
                                                                type="number"
                                                                id="carpetArea"
                                                                name="carpetArea"
                                                                value={formData.carpetArea}
                                                                onChange={handleChange}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                                placeholder="Carpet Area"
                                                            />
                                                        </div>

                                                        <div className='my-2'>
                                                            <label htmlFor="superBuiltupArea" className="block text-sm font-medium text-gray-700 mb-1">
                                                                Super Built-up Area
                                                            </label>
                                                            <input
                                                                type="number"
                                                                id="superBuiltupArea"
                                                                name="superBuiltupArea"
                                                                value={formData.superBuiltupArea}
                                                                onChange={handleChange}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                                placeholder="Super Built-up Area"
                                                            />
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
                                                            value={formData.propertyAge}
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
                                                                value={formData.floorNumber}
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
                                                                value={formData.totalFloors}
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

                                            {/* Multiple Main Property Images */}
                                            <div className="mb-6">
                                                <div className="mb-2 flex justify-between items-center">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Main Property Images*
                                                    </label>
                                                    <span className="text-xs text-gray-500">
                                                        {formData.postImages?.length || 0} images added
                                                    </span>
                                                </div>
                                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                                    {formData.postImages && formData.postImages.length > 0 ? (
                                                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 mb-4">
                                                            {formData.postImages.map((image, index) => (
                                                                <div key={index} className="relative rounded-lg overflow-hidden h-24">
                                                                    {typeof image === 'object' && image instanceof File ? (
                                                                        <img
                                                                            src={URL.createObjectURL(image)}
                                                                            alt={`Main property image ${index + 1}`}
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                                            <svg className="h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                            </svg>
                                                                        </div>
                                                                    )}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRemovePostImage(index)}
                                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : null}

                                                    <div>
                                                        <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <p className="mt-1 text-sm text-gray-500">
                                                            Upload main property images (required)
                                                        </p>
                                                        <div className="mt-4">
                                                            <label htmlFor="post-images-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                                                <svg className="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                                </svg>
                                                                Upload Main Images
                                                            </label>
                                                            <input
                                                                id="post-images-upload"
                                                                name="post-images-upload"
                                                                type="file"
                                                                accept="image/*"
                                                                multiple
                                                                onChange={handlePostImagesUpload}
                                                                className="sr-only"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Multiple Floor Plan Images */}
                                            <div className="mb-6">
                                                <div className="mb-2 flex justify-between items-center">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Floor Plan Images
                                                    </label>
                                                    <span className="text-xs text-gray-500">
                                                        {formData.floorPlanImages?.length || 0} images added
                                                    </span>
                                                </div>
                                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                                    {formData.floorPlanImages && formData.floorPlanImages.length > 0 ? (
                                                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 mb-4">
                                                            {formData.floorPlanImages.map((image, index) => (
                                                                <div key={index} className="relative rounded-lg overflow-hidden h-24">
                                                                    {typeof image === 'object' && image instanceof File ? (
                                                                        <img
                                                                            src={URL.createObjectURL(image)}
                                                                            alt={`Floor plan ${index + 1}`}
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                                            <svg className="h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                                                            </svg>
                                                                        </div>
                                                                    )}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRemoveFloorPlanImage(index)}
                                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : null}

                                                    <div>
                                                        <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                                        </svg>
                                                        <p className="mt-1 text-sm text-gray-500">
                                                            Upload your property's floor plans
                                                        </p>
                                                        <div className="mt-4">
                                                            <label htmlFor="floor-plan-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                                                <svg className="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                                </svg>
                                                                Upload Floor Plans
                                                            </label>
                                                            <input
                                                                id="floor-plan-upload"
                                                                name="floor-plan-upload"
                                                                type="file"
                                                                accept="image/*"
                                                                multiple
                                                                onChange={handleFloorPlanImagesUpload}
                                                                className="sr-only"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Gallery Images */}
                                            <div className="mb-8">
                                                <div className="mb-2 flex justify-between items-center">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Gallery Images
                                                    </label>
                                                    <span className="text-xs text-gray-500">
                                                        {formData?.galleryImages?.length} of 10 photos added
                                                    </span>
                                                </div>

                                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                                    {formData.galleryImages.length > 0 ? (
                                                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 mb-4">
                                                            {formData?.galleryImages?.map((image, index) => (
                                                                <div key={index} className="relative rounded-lg overflow-hidden h-24">
                                                                    {typeof image === 'object' && image instanceof File ? (
                                                                        <img
                                                                            src={URL.createObjectURL(image)}
                                                                            alt={`Gallery image ${index + 1}`}
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                                            <svg className="h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                            </svg>
                                                                        </div>
                                                                    )}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRemoveGalleryImage(index)}
                                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : null}

                                                    {formData.galleryImages.length < 10 && (
                                                        <div>
                                                            <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            <p className="mt-1 text-sm text-gray-500">
                                                                Upload up to 10 additional property photos
                                                            </p>
                                                            <div className="mt-4">
                                                                <label htmlFor="gallery-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                                                    <svg className="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                                    </svg>
                                                                    Upload Gallery Photos
                                                                </label>
                                                                <input
                                                                    id="gallery-upload"
                                                                    name="gallery-upload"
                                                                    type="file"
                                                                    accept="image/*"
                                                                    multiple
                                                                    onChange={handleGalleryImagesUpload}
                                                                    className="sr-only"
                                                                />
                                                            </div>
                                                            <p className="mt-2 text-xs text-gray-500">
                                                                PNG, JPG, GIF up to 5MB each
                                                            </p>
                                                        </div>
                                                    )}
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
                                                        value={formData.ownerName}
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
                                                        value={formData.propertyOwnership}
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
                                                        value={formData.transactionType}
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
                                                        value={formData.reraStatus}
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
                                                            value={formData.reraRegistrationNumber}
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
                                                        value={formData.reraWebsite}
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
                                                        value={formData.possessionDate}
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
                                                        value={formData.construction_status}
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
                                                        checked={formData.priceOnRequest}
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
                                                {/* <div>
                                    <label htmlFor="carpetArea" className="block text-sm font-medium text-gray-700 mb-1">
                                        Carpet Area
                                    </label>
                                    <input
                                        type="number"
                                        id="carpetArea"
                                        name="carpetArea"
                                        value={formData.carpetArea}
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
                                        value={formData.superBuiltupArea}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Super Built-up Area"
                                    />
                                </div> */}

                                                <div>
                                                    <label htmlFor="flooring" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Flooring
                                                    </label>
                                                    <select
                                                        id="flooring"
                                                        name="flooring"
                                                        value={formData.flooring}
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
                                                        value={formData.parking}
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
                                                        value={formData.powerBackup}
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
                                                        value={formData.widthOfFacingRoad}
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
                                                            checked={formData.gatedCommunity}
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
                                                            checked={formData.petFriendly}
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
                                                    onClick={() => saveDraft()}
                                                    disabled={loading}
                                                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-700 hover:bg-yellow-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                                >
                                                    Save As Draft
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleSubmit}
                                                    disabled={loading}
                                                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                                >
                                                    {loading ? (
                                                        <>
                                                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Submitting...
                                                        </>
                                                    ) : (
                                                        <>
                                                            Submit Property
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
            </>
                )
            }
        </div>
    );
};

export default RealEstateOnboarding;
