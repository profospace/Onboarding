// import React from 'react';
// import {
//     Home,
//     MapPin,
//     ThumbsUp,
//     Image,
//     DollarSign,
//     Phone,
//     Check,
//     AlertCircle
// } from 'lucide-react';

// interface FormNavProps {
//     activeSection: string;
//     setActiveSection: (section: string) => void;
//     formData: any;
//     formErrors: any;
// }

// // Define sections with their validation rules
// const sections = [
//     {
//         id: 'basic',
//         label: 'Basic Information',
//         icon: Home,
//         requiredFields: ['post_title', 'type_name', 'purpose', 'bedrooms', 'bathrooms', 'area']
//     },
//     {
//         id: 'location',
//         label: 'Location',
//         icon: MapPin,
//         requiredFields: ['address', 'city', 'locality']
//     },
//     {
//         id: 'features',
//         label: 'Features & Amenities',
//         icon: ThumbsUp,
//         requiredFields: []
//     },
//     {
//         id: 'images',
//         label: 'Images & Gallery',
//         icon: Image,
//         requiredFields: []
//     },
//     {
//         id: 'pricing',
//         label: 'Pricing & Availability',
//         icon: DollarSign,
//         requiredFields: ['price']
//     },
//     {
//         id: 'contact',
//         label: 'Contact Details',
//         icon: Phone,
//         requiredFields: []
//     }
// ];

// const FormNav: React.FC<FormNavProps> = ({
//     activeSection,
//     setActiveSection,
//     formData,
//     formErrors
// }) => {
//     // Check if a section has errors
//     const hasErrors = (sectionId: string) => {
//         const section = sections.find(s => s.id === sectionId);
//         if (!section) return false;

//         return section.requiredFields.some(field => formErrors[field]);
//     };

//     // Check if a section is complete
//     const isComplete = (sectionId: string) => {
//         const section = sections.find(s => s.id === sectionId);
//         if (!section) return false;

//         // If there are no required fields, consider it complete
//         if (section.requiredFields.length === 0) return true;

//         // Check if all required fields have values
//         return section.requiredFields.every(field => {
//             if (Array.isArray(formData[field])) {
//                 return formData[field].length > 0;
//             }
//             return formData[field] !== '' && formData[field] !== null && formData[field] !== undefined;
//         });
//     };

//     return (
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//             <div className="p-4 border-b border-gray-200">
//                 <h2 className="font-medium text-gray-800">Form Sections</h2>
//             </div>
//             <nav className="p-2">
//                 <ul className="space-y-1">
//                     {sections.map(section => {
//                         const Icon = section.icon;
//                         const active = activeSection === section.id;
//                         const error = hasErrors(section.id);
//                         const complete = isComplete(section.id);

//                         return (
//                             <li key={section.id}>
//                                 <button
//                                     type="button"
//                                     onClick={() => setActiveSection(section.id)}
//                                     className={`flex items-center w-full px-3 py-2 text-left rounded-md ${active
//                                             ? 'bg-blue-50 text-blue-700'
//                                             : error
//                                                 ? 'text-red-600 hover:bg-red-50'
//                                                 : 'text-gray-700 hover:bg-gray-100'
//                                         }`}
//                                 >
//                                     <Icon className={`h-5 w-5 mr-3 ${active ? 'text-blue-500' : error ? 'text-red-500' : 'text-gray-400'}`} />
//                                     <span className="flex-1">{section.label}</span>
//                                     {error ? (
//                                         <AlertCircle className="h-5 w-5 text-red-500" />
//                                     ) : complete ? (
//                                         <Check className="h-5 w-5 text-green-500" />
//                                     ) : null}
//                                 </button>
//                             </li>
//                         );
//                     })}
//                 </ul>
//             </nav>
//             <div className="p-4 bg-gray-50 border-t border-gray-200">
//                 <div className="text-xs text-gray-500">
//                     <p className="flex items-center mb-1">
//                         <Check className="h-3 w-3 text-green-500 mr-1" />
//                         <span>Complete</span>
//                     </p>
//                     <p className="flex items-center">
//                         <AlertCircle className="h-3 w-3 text-red-500 mr-1" />
//                         <span>Required fields missing</span>
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default FormNav;

import React from 'react';
import {
    Home,
    MapPin,
    ThumbsUp,
    Image,
    DollarSign,
    Phone,
    ListPlus,
    Check,
    AlertCircle
} from 'lucide-react';

interface FormNavProps {
    activeSection: string;
    setActiveSection: (section: string) => void;
    formData: any;
    formErrors: any;
}

// Define sections with their validation rules
const sections = [
    {
        id: 'basic',
        label: 'Basic Information',
        icon: Home,
        requiredFields: ['post_title', 'type_name', 'purpose', 'bedrooms', 'bathrooms', 'area']
    },
    {
        id: 'location',
        label: 'Location',
        icon: MapPin,
        requiredFields: ['address', 'city', 'locality']
    },
    {
        id: 'features',
        label: 'Features & Amenities',
        icon: ThumbsUp,
        requiredFields: []
    },
    {
        id: 'images',
        label: 'Images & Gallery',
        icon: Image,
        requiredFields: []
    },
    {
        id: 'pricing',
        label: 'Pricing & Availability',
        icon: DollarSign,
        requiredFields: ['price']
    },
    {
        id: 'contact',
        label: 'Contact Details',
        icon: Phone,
        requiredFields: []
    },
    {
        id: 'additional',
        label: 'Additional Details',
        icon: ListPlus,
        requiredFields: []
    }
];

const FormNav: React.FC<FormNavProps> = ({
    activeSection,
    setActiveSection,
    formData,
    formErrors
}) => {
    // Check if a section has errors
    const hasErrors = (sectionId: string) => {
        const section = sections.find(s => s.id === sectionId);
        if (!section) return false;

        return section.requiredFields.some(field => formErrors[field]);
    };

    // Check if a section is complete
    const isComplete = (sectionId: string) => {
        const section = sections.find(s => s.id === sectionId);
        if (!section) return false;

        // If there are no required fields, consider it complete
        if (section.requiredFields.length === 0) return true;

        // Check if all required fields have values
        return section.requiredFields.every(field => {
            if (Array.isArray(formData[field])) {
                return formData[field].length > 0;
            }
            return formData[field] !== '' && formData[field] !== null && formData[field] !== undefined;
        });
    };

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200">
                <h2 className="font-medium text-gray-800">Form Sections</h2>
            </div>
            <nav className="p-2">
                <ul className="space-y-1">
                    {sections.map(section => {
                        const Icon = section.icon;
                        const active = activeSection === section.id;
                        const error = hasErrors(section.id);
                        const complete = isComplete(section.id);

                        return (
                            <li key={section.id}>
                                <button
                                    type="button"
                                    onClick={() => setActiveSection(section.id)}
                                    className={`flex items-center w-full px-3 py-2 text-left rounded-md ${active
                                            ? 'bg-blue-50 text-blue-700'
                                            : error
                                                ? 'text-red-600 hover:bg-red-50'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <Icon className={`h-5 w-5 mr-3 ${active ? 'text-blue-500' : error ? 'text-red-500' : 'text-gray-400'}`} />
                                    <span className="flex-1">{section.label}</span>
                                    {error ? (
                                        <AlertCircle className="h-5 w-5 text-red-500" />
                                    ) : complete ? (
                                        <Check className="h-5 w-5 text-green-500" />
                                    ) : null}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>
            <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                    <p className="flex items-center mb-1">
                        <Check className="h-3 w-3 text-green-500 mr-1" />
                        <span>Complete</span>
                    </p>
                    <p className="flex items-center">
                        <AlertCircle className="h-3 w-3 text-red-500 mr-1" />
                        <span>Required fields missing</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FormNav;