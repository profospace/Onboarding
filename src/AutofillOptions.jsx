// import React from 'react';

// const AutofillOptions = ({ onSelect }) => {
//   // Check if autofill is enabled from .env
//     const isAutofillEnabled = import.meta.env.VITE_AUTO_FILL === 'true';

//   if (!isAutofillEnabled) {
//     return null; // Don't render anything if autofill is not enabled
//   }

//   // Function to fetch image from URL and convert to File object
//   const urlToFile = async (url, filename, mimeType) => {
//     try {
//       const response = await fetch(url);
//       const blob = await response.blob();
//       return new File([blob], filename, { type: mimeType || blob.type });
//     } catch (error) {
//       console.error("Error converting URL to File:", error);
//       return null;
//     }
//   };

//   // Handle the selection of an autofill option
//   const handleSelectOption = async (optionData) => {
//     const data = { ...optionData };
    
//     // Handle main property image
//     if (data.postImageUrl) {
//       const file = await urlToFile(data.postImageUrl, 'main-image.jpg', 'image/jpeg');
//       if (file) data.postImage = file;
//       delete data.postImageUrl;
//     }
    
//     // Handle floor plan image
//     if (data.floorPlanImageUrl) {
//       const file = await urlToFile(data.floorPlanImageUrl, 'floor-plan.png', 'image/png');
//       if (file) data.floorPlanImage = file;
//       delete data.floorPlanImageUrl;
//     }
    
//     // Handle gallery images
//     if (data.galleryImageUrls && data.galleryImageUrls.length > 0) {
//       const galleryFiles = [];
//       for (let i = 0; i < data.galleryImageUrls.length; i++) {
//         const file = await urlToFile(data.galleryImageUrls[i], `gallery-${i}.jpg`, 'image/jpeg');
//         if (file) galleryFiles.push(file);
//       }
//       data.galleryImages = galleryFiles;
//       delete data.galleryImageUrls;
//     }
    
//     // Call the onSelect function with the prepared data
//     onSelect(data);
//   };

//   const autoFillOptions = [
//     {
//       name: '3BHK Apartment (Complete)',
//       data: {
//         // Basic Details
//         propertyType: 'Apartment',
//         propertyCategory: 'Residential',
//         bedrooms: '3',
//         bathrooms: '2',
//         balconies: '1',
//         furnishingStatus: 'Semi-Furnished',
//         propertyAge: 5,
//         floorNumber: '5',
//         totalFloors: '10',
//         facingDirection: 'East',
//         purpose: 'sale',
//         configuration: '3BHK',
        
//         // Location Details
//         address: '123 Green Apartments, Main Road',
//         city: 'Mumbai',
//         locality: 'Andheri West',
//         pincode: '400053',
//         latitude: 19.1136,
//         longitude: 72.8697,
        
//         // Property Details
//         title: '3BHK Apartment in Andheri West',
//         description: 'Spacious 3BHK apartment with modern amenities, good ventilation and natural light. Close to schools, markets and public transport.',
//         price: '85',
//         priceUnit: 'lakh',
//         area: '1250',
//         areaUnit: 'sqft',
        
//         // Photos & Amenities
//         amenities: ['Parking', 'Lift', 'Power Backup', 'Security', 'Gym', 'Swimming Pool'],
//         postImageUrl: 'https://wityysaver.s3.ap-south-1.amazonaws.com/gallery_images/PROP1742202858454/34f30911-bfc3-4595-95b0-bcb40806a924_67777496d2deebfe7188efac_DSC02589-HDR.webp',
//         floorPlanImageUrl: 'https://wityysaver.s3.ap-south-1.amazonaws.com/gallery_images/PROP1742202858454/54df7ae5-6c69-4cef-9bcc-b8e78aa0bd3d_761c8c51c6631174_1440.png',
//         galleryImageUrls: [
//           'https://wityysaver.s3.ap-south-1.amazonaws.com/projects/Passion%20Group/gallery/a822f871-ee30-4222-b825-11184fbca432original-4d2d4ee3c82cc526d5c7d00b5adc1627.png',
//           'https://wityysaver.s3.ap-south-1.amazonaws.com/gallery_images/PROP1742202858454/34f30911-bfc3-4595-95b0-bcb40806a924_67777496d2deebfe7188efac_DSC02589-HDR.webp',
//           'https://wityysaver.s3.ap-south-1.amazonaws.com/gallery_images/PROP1742202858454/6f0e42a2-7f7f-4eff-839183a07e019183df23221808_63219_172468_large.jpg'
//         ],
        
//         // Ownership & Legal
//         ownerName: 'Rahul Sharma',
//         propertyOwnership: 'Freehold',
//         transactionType: 'Resale',
//         reraStatus: 'Registered',
//         reraRegistrationNumber: 'MH123456789',
//         possessionDate: '2023-01-01',
//         construction_status: 'Ready to Move',
//         priceOnRequest: false,
        
//         // Additional Property Features
//         carpetArea: '1050',
//         superBuiltupArea: '1250',
//         flooring: 'Vitrified',
//         parking: 'Covered',
//         powerBackup: 'Full',
//         widthOfFacingRoad: '40',
//         waterSource: ['Municipal', 'Borewell'],
//         gatedCommunity: true,
//         petFriendly: true,
        
//         // USP and Tags
//         usp: ['Close to metro', 'Spacious rooms', '24x7 security', 'Garden view'],
//         tags: ['Spacious', 'Corner unit', 'Vastu compliant', 'Investment'],
//         overlookingAmenities: ['Garden', 'Park', 'Main Road'],
//         location_advantage: ['Near School', 'Shopping Mall', 'Metro Station'],
//         contactList: [9876543210, 9876543211],
//         whatsappAlerts: true,
//         whatsappContact: '9876543210',
//         profoProxyAllowed: true
//       }
//     },
//     {
//       name: '2BHK Rental Flat (Complete)',
//       data: {
//         // Basic Details
//         propertyType: 'Apartment',
//         propertyCategory: 'Residential',
//         bedrooms: '2',
//         bathrooms: '2',
//         balconies: '1',
//         furnishingStatus: 'Fully Furnished',
//         propertyAge: 10,
//         floorNumber: '3',
//         totalFloors: '5',
//         facingDirection: 'North',
//         purpose: 'rent',
//         configuration: '2BHK',
        
//         // Location Details
//         address: '45 Blue Heights, Park Street',
//         city: 'Bangalore',
//         locality: 'Koramangala',
//         pincode: '560034',
//         latitude: 12.9352,
//         longitude: 77.6245,
        
//         // Property Details
//         title: 'Furnished 2BHK in Koramangala',
//         description: 'Well-maintained 2BHK apartment available for rent. Fully furnished with modern fittings, 24/7 security and power backup.',
//         price: '35',
//         priceUnit: 'thousand',
//         area: '1000',
//         areaUnit: 'sqft',
        
//         // Photos & Amenities
//         amenities: ['Parking', 'Lift', 'Power Backup', 'Swimming Pool', 'Gym', 'Club House'],
//         postImageUrl: 'https://wityysaver.s3.ap-south-1.amazonaws.com/gallery_images/PROP1742202858454/34f30911-bfc3-4595-95b0-bcb40806a924_67777496d2deebfe7188efac_DSC02589-HDR.webp',
//         floorPlanImageUrl: 'https://wityysaver.s3.ap-south-1.amazonaws.com/gallery_images/PROP1742202858454/54df7ae5-6c69-4cef-9bcc-b8e78aa0bd3d_761c8c51c6631174_1440.png',
//         galleryImageUrls: [
//           'https://wityysaver.s3.ap-south-1.amazonaws.com/projects/Passion%20Group/gallery/a822f871-ee30-4222-b825-11184fbca432original-4d2d4ee3c82cc526d5c7d00b5adc1627.png',
//           'https://wityysaver.s3.ap-south-1.amazonaws.com/gallery_images/PROP1742202858454/34f30911-bfc3-4595-95b0-bcb40806a924_67777496d2deebfe7188efac_DSC02589-HDR.webp'
//         ],
        
//         // Ownership & Legal
//         ownerName: 'Priya Verma',
//         propertyOwnership: 'Leasehold',
//         transactionType: 'New Property',
//         reraStatus: 'Not Applicable',
//         possessionDate: '2023-05-15',
//         construction_status: 'Ready to Move',
//         priceOnRequest: false,
        
//         // Additional Property Features
//         carpetArea: '850',
//         superBuiltupArea: '1000',
//         flooring: 'Wooden',
//         parking: 'Open',
//         powerBackup: 'Partial',
//         widthOfFacingRoad: '30',
//         waterSource: ['Municipal', 'Tanker'],
//         gatedCommunity: true,
//         petFriendly: false,
        
//         // USP and Tags
//         usp: ['24x7 security', 'Clubhouse access', 'Close to IT park'],
//         tags: ['Well ventilated', 'Luxury', 'Corner unit'],
//         overlookingAmenities: ['Pool', 'Garden'],
//         location_advantage: ['Shopping Mall', 'Hospital', 'Bus Stop'],
//         contactList: [8765432109, 8765432108],
//         whatsappAlerts: true,
//         whatsappContact: '8765432109',
//         profoProxyAllowed: true
//       }
//     },
//     {
//       name: 'Commercial Shop (Complete)',
//       data: {
//         // Basic Details
//         propertyType: 'Shops',
//         propertyCategory: 'Commercial',
//         furnishingStatus: 'Unfurnished',
//         propertyAge: 12,
//         floorNumber: '0',
//         totalFloors: '3',
//         facingDirection: 'South',
//         purpose: 'sale',
        
//         // Location Details
//         address: '78 Market Complex, Commercial Avenue',
//         city: 'Delhi',
//         locality: 'Connaught Place',
//         pincode: '110001',
//         latitude: 28.6289,
//         longitude: 77.2090,
        
//         // Property Details
//         title: 'Prime Commercial Shop in Connaught Place',
//         description: 'Prime commercial shop space available in high-footfall area. Perfect for retail, showroom or restaurant.',
//         price: '2.5',
//         priceUnit: 'crore',
//         area: '800',
//         areaUnit: 'sqft',
        
//         // Photos & Amenities
//         amenities: ['Power Backup', 'Security', 'CCTV', 'Fire Safety'],
//         postImageUrl: 'https://wityysaver.s3.ap-south-1.amazonaws.com/gallery_images/PROP1742202858454/34f30911-bfc3-4595-95b0-bcb40806a924_67777496d2deebfe7188efac_DSC02589-HDR.webp',
//         floorPlanImageUrl: 'https://wityysaver.s3.ap-south-1.amazonaws.com/gallery_images/PROP1742202858454/54df7ae5-6c69-4cef-9bcc-b8e78aa0bd3d_761c8c51c6631174_1440.png',
//         galleryImageUrls: [
//           'https://wityysaver.s3.ap-south-1.amazonaws.com/projects/Passion%20Group/gallery/a822f871-ee30-4222-b825-11184fbca432original-4d2d4ee3c82cc526d5c7d00b5adc1627.png'
//         ],
        
//         // Ownership & Legal
//         ownerName: 'Vikram Singh',
//         propertyOwnership: 'Freehold',
//         transactionType: 'New Property',
//         reraStatus: 'Registered',
//         reraRegistrationNumber: 'DL987654321',
//         possessionDate: '2023-06-01',
//         construction_status: 'Ready to Move',
//         priceOnRequest: false,
        
//         // Additional Property Features
//         carpetArea: '750',
//         superBuiltupArea: '800',
//         flooring: 'Granite',
//         parking: 'Covered',
//         powerBackup: 'Full',
//         widthOfFacingRoad: '50',
//         waterSource: ['Municipal'],
//         gatedCommunity: false,
//         petFriendly: false,
        
//         // USP and Tags
//         usp: ['High footfall area', 'Corner property', 'Main road facing'],
//         tags: ['Investment', 'Prime location'],
//         overlookingAmenities: ['Main Road'],
//         location_advantage: ['Shopping Mall', 'Metro Station', 'Bus Stop'],
//         contactList: [9876543212, 9876543213],
//         whatsappAlerts: true,
//         whatsappContact: '9876543212',
//         profoProxyAllowed: true
//       }
//     }
//   ];

//   return (
//     <div className="mb-4 bg-blue-50 p-4 rounded-lg">
//       <label className="block text-sm font-medium text-blue-700 mb-2">
//         Autofill Options (Testing Only)
//       </label>
//       <select 
//         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//         onChange={(e) => {
//           const selectedOption = autoFillOptions.find(option => option.name === e.target.value);
//           if (selectedOption) {
//             handleSelectOption(selectedOption.data);
//           }
//         }}
//       >
//         <option value="">Select an option to autofill</option>
//         {autoFillOptions.map(option => (
//           <option key={option.name} value={option.name}>{option.name}</option>
//         ))}
//       </select>
//       <p className="mt-1 text-xs text-gray-500">
//         This is for testing purposes only and will be hidden in production.
//       </p>
//     </div>
//   );
// };

// export default AutofillOptions;




import React from 'react';

const AutofillOptions = ({ onSelect }) => {
  // Check if autofill is enabled from .env
  const isAutofillEnabled = import.meta.env.VITE_AUTO_FILL === 'true';

  if (!isAutofillEnabled) {
    return null; // Don't render anything if autofill is not enabled
  }

  // Function to fetch image from URL and convert to File object
  const urlToFile = async (url, filename, mimeType) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new File([blob], filename, { type: mimeType || blob.type });
    } catch (error) {
      console.error("Error converting URL to File:", error);
      return null;
    }
  };

  // Handle the selection of an autofill option
  const handleSelectOption = async (optionData) => {
    const data = { ...optionData };

    // Handle multiple main property images
    if (data.postImageUrls && data.postImageUrls.length > 0) {
      const postFiles = [];
      for (let i = 0; i < data.postImageUrls.length; i++) {
        const file = await urlToFile(data.postImageUrls[i], `main-image-${i + 1}.jpg`, 'image/jpeg');
        if (file) postFiles.push(file);
      }
      data.postImages = postFiles;
      delete data.postImageUrls;
    }

    // Handle multiple floor plan images
    if (data.floorPlanImageUrls && data.floorPlanImageUrls.length > 0) {
      const floorPlanFiles = [];
      for (let i = 0; i < data.floorPlanImageUrls.length; i++) {
        const file = await urlToFile(data.floorPlanImageUrls[i], `floor-plan-${i + 1}.png`, 'image/png');
        if (file) floorPlanFiles.push(file);
      }
      data.floorPlanImages = floorPlanFiles;
      delete data.floorPlanImageUrls;
    }

    // Handle gallery images
    if (data.galleryImageUrls && data.galleryImageUrls.length > 0) {
      const galleryFiles = [];
      for (let i = 0; i < data.galleryImageUrls.length; i++) {
        const file = await urlToFile(data.galleryImageUrls[i], `gallery-${i + 1}.jpg`, 'image/jpeg');
        if (file) galleryFiles.push(file);
      }
      data.galleryImages = galleryFiles;
      delete data.galleryImageUrls;
    }

    // Call the onSelect function with the prepared data
    onSelect(data);
  };

  const autoFillOptions = [
    {
      name: '3BHK Luxury Apartment (Complete)',
      data: {
        // Basic Details
        propertyType: 'Apartment',
        propertyCategory: 'Residential',
        bedrooms: '3',
        bathrooms: '3',
        balconies: '2',
        furnishingStatus: 'Fully-Furnished',
        propertyAge: 2,
        floorNumber: '8',
        totalFloors: '15',
        facingDirection: 'North-East',
        purpose: 'sale',
        configuration: '3BHK',

        // Location Details
        address: '123 Green Apartments, Sector 18, Main Road',
        city: 'Gurgaon',
        locality: 'Sector 18',
        pincode: '122015',
        latitude: 28.4595,
        longitude: 77.0266,

        // Property Details
        title: 'Luxury 3BHK Apartment in Sector 18 Gurgaon',
        description: 'Premium 3BHK apartment with world-class amenities, modern interiors, and excellent connectivity. Features include modular kitchen, premium fittings, and panoramic city views.',
        price: '10000000',
        area: '1850',
        areaUnit: 'sqft',

        // Photos & Amenities
        amenities: ['Parking', 'Lift', 'Power Backup', 'Security', 'Gym', 'Swimming Pool', 'Club House', 'Children\'s Play Area', 'Garden', 'CCTV'],
        postImageUrls: [
          'https://wityysaver.s3.ap-south-1.amazonaws.com/gallery_images/PROP1742202858454/34f30911-bfc3-4595-95b0-bcb40806a924_67777496d2deebfe7188efac_DSC02589-HDR.webp',
          'https://wityysaver.s3.ap-south-1.amazonaws.com/projects/Passion%20Group/gallery/a822f871-ee30-4222-b825-11184fbca432original-4d2d4ee3c82cc526d5c7d00b5adc1627.png'
        ],
        floorPlanImageUrls: [
          'https://wityysaver.s3.ap-south-1.amazonaws.com/1745050191639-IMG_0576.png',
          'https://wityysaver.s3.ap-south-1.amazonaws.com/gallery_images/PROP1742202858454/54df7ae5-6c69-4cef-9bcc-b8e78aa0bd3d_761c8c51c6631174_1440.png'
        ],
        galleryImageUrls: [
          'https://wityysaver.s3.ap-south-1.amazonaws.com/projects/Passion%20Group/gallery/a822f871-ee30-4222-b825-11184fbca432original-4d2d4ee3c82cc526d5c7d00b5adc1627.png',
          'https://wityysaver.s3.ap-south-1.amazonaws.com/gallery_images/PROP1742202858454/34f30911-bfc3-4595-95b0-bcb40806a924_67777496d2deebfe7188efac_DSC02589-HDR.webp'
        ],

        // Ownership & Legal
        ownerName: 'Rajesh Kumar Sharma',
        propertyOwnership: 'Freehold',
        transactionType: 'New Property',
        reraStatus: 'Registered',
        reraRegistrationNumber: 'HR-RERA-GGM-123-2023',
        reraWebsite: 'https://haryanarera.gov.in',
        possessionDate: '2024-03-15',
        construction_status: 'Ready to Move',
        priceOnRequest: false,

        // Additional Property Features
        carpetArea: '1650',
        superBuiltupArea: '1850',
        pricePerSqFt: '6486',
        estimatedEMI: '85000',
        flooring: 'Italian Marble',
        parking: 'Multiple Covered Parking',
        powerBackup: 'Full',
        widthOfFacingRoad: '60',
        waterSource: ['24/7 Municipal Supply', 'Borewell', 'Water Treatment Plant'],
        gatedCommunity: true,
        petFriendly: true,
        propertyCode: 'GRN-APT-3BHK-001',

        // Advanced Features
        religiousNearby: ['Near Temple', 'Near Gurudwara'],
        inProximity: ['Airport', 'Near Office Hub', 'Hospital Vicinity', 'Metro Station', 'Highway Access'],
        vastuCompliance: ['Vastu Friendly Layout', 'East Facing', 'Proper Room Placement', 'Vastu Compliant Kitchen'],
        loanApprovalStatus: ['Bank Approved Project', 'Pre-Approved Loans', 'PMAY Eligible'],
        builderReputation: ['Premium/Luxury Developer', 'Award-Winning Developer', 'Timely Delivery Track Record'],
        legalClearance: ['Clear Title', 'RERA Registered', 'Occupancy Certificate', 'NOC from Authorities'],
        environmentalFactors: ['Green Building Certified', 'Solar Power Installation', 'EV Charging Points', 'Low Pollution Area'],
        kitchenType: ['Modular Kitchen', 'Kitchen with Utility Area'],
        bathroomFeatures: ['Premium Fittings', 'Western Toilet', 'Master Bath'],
        specialCategories: ['Gated Community', 'Investment Property', 'NRI Preferred'],
        flooringType: ['Italian Marble', 'Wooden Flooring'],
        socialInfrastructure: ['School Proximity', 'Hospital Access', 'Shopping Mall Proximity'],

        // USP and Tags
        usp: ['Close to metro', 'Spacious rooms', '24x7 security', 'Garden view', 'Premium location', 'High-end amenities'],
        tags: ['Spacious', 'Corner unit', 'Vastu compliant', 'Investment', 'Luxury', 'Premium'],
        overlookingAmenities: ['Garden', 'Park', 'Swimming Pool', 'Main Road'],
        location_advantage: ['Near School', 'Shopping Mall', 'Metro Station', 'Hospital', 'Airport'],
        facilities: ['Gym', 'Swimming Pool', 'Club House', 'Spa', 'Business Center', 'Banquet Hall'],
        contactList: [9876543210, 9876543211, 8765432109],

        // Maintenance and Financing
        maintenanceCharges: {
          minPrice: '8',
          maxPrice: '12',
          priceUnit: '₹',
          areaUnit: 'sqft'
        },
        financingOptions: ['Conventional Mortgage', 'FHA Loan', 'Cash Only'],

        // Communication Preferences
        whatsappAlerts: true,
        whatsappContact: '9876543210',
        profoProxyAllowed: true
      }
    },
    {
      name: '2BHK Budget Apartment (Complete)',
      data: {
        // Basic Details
        propertyType: 'Apartment',
        propertyCategory: 'Residential',
        bedrooms: '2',
        bathrooms: '2',
        balconies: '1',
        furnishingStatus: 'Semi-Furnished',
        propertyAge: 8,
        floorNumber: '4',
        totalFloors: '8',
        facingDirection: 'South',
        purpose: 'rent',
        configuration: '2BHK',

        // Location Details
        address: '45 Blue Heights, Sector 62, Park Street',
        city: 'Noida',
        locality: 'Sector 62',
        pincode: '201309',
        latitude: 28.6139,
        longitude: 77.3648,

        // Property Details
        title: 'Affordable 2BHK in Sector 62 Noida',
        description: 'Well-maintained 2BHK apartment in a prime location with good connectivity. Perfect for small families and working professionals.',
        price: '2500000',
        area: '1100',
        areaUnit: 'sqft',

        // Photos & Amenities
        amenities: ['Parking', 'Lift', 'Power Backup', 'Security', 'Garden'],
        postImageUrls: [
          'https://wityysaver.s3.ap-south-1.amazonaws.com/gallery_images/PROP1742202858454/34f30911-bfc3-4595-95b0-bcb40806a924_67777496d2deebfe7188efac_DSC02589-HDR.webp'
        ],
        floorPlanImageUrls: [
          'https://wityysaver.s3.ap-south-1.amazonaws.com/gallery_images/PROP1742202858454/54df7ae5-6c69-4cef-9bcc-b8e78aa0bd3d_761c8c51c6631174_1440.png'
        ],
        galleryImageUrls: [
          'https://wityysaver.s3.ap-south-1.amazonaws.com/projects/Passion%20Group/gallery/a822f871-ee30-4222-b825-11184fbca432original-4d2d4ee3c82cc526d5c7d00b5adc1627.png'
        ],

        // Ownership & Legal
        ownerName: 'Priya Verma',
        propertyOwnership: 'Leasehold',
        transactionType: 'Resale',
        reraStatus: 'Not Applicable',
        possessionDate: '2024-01-01',
        construction_status: 'Ready to Move',
        priceOnRequest: false,

        // Additional Property Features
        carpetArea: '950',
        superBuiltupArea: '1100',
        pricePerSqFt: '2273',
        estimatedEMI: '18000',
        flooring: 'Vitrified Tiles',
        parking: 'Open Parking',
        powerBackup: 'Partial',
        widthOfFacingRoad: '30',
        waterSource: ['Timed Municipal Supply', 'Borewell'],
        gatedCommunity: true,
        petFriendly: false,
        propertyCode: 'BLU-APT-2BHK-002',

        // Advanced Features
        religiousNearby: ['Near Temple'],
        inProximity: ['Near School', 'Market Area', 'Bus Stop'],
        vastuCompliance: ['Vastu Friendly Layout'],
        loanApprovalStatus: ['Home Loan Available'],
        builderReputation: ['Mid-Tier Developer'],
        legalClearance: ['Clear Title', 'Approved Building Plan'],
        environmentalFactors: ['Low Pollution Area'],
        kitchenType: ['Semi-Modular Kitchen'],
        bathroomFeatures: ['Standard Bathroom', 'Western Toilet'],
        specialCategories: ['Gated Community'],
        flooringType: ['Vitrified Tiles'],
        socialInfrastructure: ['School Proximity', 'Shopping Mall Proximity'],

        // USP and Tags
        usp: ['Good connectivity', 'Affordable rent', 'Family friendly'],
        tags: ['Budget friendly', 'Well maintained', 'Good location'],
        overlookingAmenities: ['Garden', 'Park'],
        location_advantage: ['Near School', 'Market Area', 'Bus Stop'],
        facilities: ['Security', 'Parking', 'Garden'],
        contactList: [8765432109, 8765432108],

        // Maintenance and Financing
        maintenanceCharges: {
          minPrice: '3',
          maxPrice: '5',
          priceUnit: '₹',
          areaUnit: 'sqft'
        },
        financingOptions: ['Conventional Mortgage'],

        // Communication Preferences
        whatsappAlerts: true,
        whatsappContact: '8765432109',
        profoProxyAllowed: true
      }
    },
    {
      name: 'Commercial Shop (Complete)',
      data: {
        // Basic Details
        propertyType: 'Shops',
        propertyCategory: 'Commercial',
        furnishingStatus: 'Unfurnished',
        propertyAge: 5,
        floorNumber: '0',
        totalFloors: '4',
        facingDirection: 'East',
        purpose: 'sale',

        // Location Details
        address: '78 Market Complex, Commercial Avenue, Sector 14',
        city: 'Gurgaon',
        locality: 'Sector 14',
        pincode: '122001',
        latitude: 28.4595,
        longitude: 77.0266,

        // Property Details
        title: 'Prime Commercial Shop in Sector 14 Market',
        description: 'Strategically located commercial shop in high-footfall market area. Perfect for retail business, showroom, or restaurant. Excellent ROI potential.',
        price: '7500000',
        area: '600',
        areaUnit: 'sqft',

        // Photos & Amenities
        amenities: ['Power Backup', 'Security', 'CCTV', 'Fire Safety', 'Parking'],
        postImageUrls: [
          'https://wityysaver.s3.ap-south-1.amazonaws.com/gallery_images/PROP1742202858454/34f30911-bfc3-4595-95b0-bcb40806a924_67777496d2deebfe7188efac_DSC02589-HDR.webp'
        ],
        floorPlanImageUrls: [
          'https://wityysaver.s3.ap-south-1.amazonaws.com/gallery_images/PROP1742202858454/54df7ae5-6c69-4cef-9bcc-b8e78aa0bd3d_761c8c51c6631174_1440.png'
        ],
        galleryImageUrls: [
          'https://wityysaver.s3.ap-south-1.amazonaws.com/projects/Passion%20Group/gallery/a822f871-ee30-4222-b825-11184fbca432original-4d2d4ee3c82cc526d5c7d00b5adc1627.png'
        ],

        // Ownership & Legal
        ownerName: 'Vikram Singh Chauhan',
        propertyOwnership: 'Freehold',
        transactionType: 'New Property',
        reraStatus: 'Registered',
        reraRegistrationNumber: 'HR-RERA-COM-456-2023',
        reraWebsite: 'https://haryanarera.gov.in',
        possessionDate: '2024-02-01',
        construction_status: 'Ready to Move',
        priceOnRequest: false,

        // Additional Property Features
        carpetArea: '550',
        superBuiltupArea: '600',
        pricePerSqFt: '12500',
        flooring: 'Granite Flooring',
        parking: 'Dedicated Parking',
        powerBackup: 'Full',
        widthOfFacingRoad: '40',
        waterSource: ['24/7 Municipal Supply'],
        gatedCommunity: false,
        petFriendly: false,
        propertyCode: 'MKT-SHOP-COM-003',

        // Advanced Features
        religiousNearby: [],
        inProximity: ['Market Area', 'Bus Stop', 'Highway Access'],
        vastuCompliance: ['Vastu Compliant Main Door'],
        loanApprovalStatus: ['Bank Approved Project', 'Commercial Loan Available'],
        builderReputation: ['Premium/Luxury Developer'],
        legalClearance: ['Clear Title', 'RERA Registered', 'Trade License Ready'],
        environmentalFactors: ['Central Location'],
        kitchenType: [],
        bathroomFeatures: ['Standard Bathroom'],
        specialCategories: ['Investment Property', 'High ROI Potential'],
        flooringType: ['Granite Flooring'],
        socialInfrastructure: ['Market Area', 'Commercial Hub'],

        // USP and Tags
        usp: ['High footfall area', 'Corner property', 'Main road facing', 'Prime commercial location'],
        tags: ['Investment', 'Prime location', 'High ROI', 'Commercial'],
        overlookingAmenities: ['Main Road', 'Market'],
        location_advantage: ['Market Area', 'Bus Stop', 'Highway Access'],
        facilities: ['Security', 'Power Backup', 'Parking'],
        contactList: [9876543212, 9876543213],

        // Maintenance and Financing
        maintenanceCharges: {
          minPrice: '15',
          maxPrice: '20',
          priceUnit: '₹',
          areaUnit: 'sqft'
        },
        financingOptions: ['Commercial Loan', 'Cash Only'],

        // Communication Preferences
        whatsappAlerts: true,
        whatsappContact: '9876543212',
        profoProxyAllowed: true
      }
    },
    {
      name: 'Villa/House (Complete)',
      data: {
        // Basic Details
        propertyType: 'House',
        propertyCategory: 'Residential',
        bedrooms: '4',
        bathrooms: '4',
        balconies: '3',
        furnishingStatus: 'Modular-Kitchen',
        propertyAge: 1,
        floorNumber: '0',
        totalFloors: '3',
        facingDirection: 'North',
        purpose: 'sale',
        configuration: '4BHK',

        // Location Details
        address: '12 Green Valley Villas, Phase 2, Sector 57',
        city: 'Gurgaon',
        locality: 'Sector 57',
        pincode: '122003',
        latitude: 28.4211,
        longitude: 77.0800,

        // Property Details
        title: 'Luxury 4BHK Villa in Green Valley',
        description: 'Magnificent 4BHK independent villa with private garden, terrace, and modern amenities. Perfect for large families seeking luxury and privacy.',
        price: '300000',
        area: '3200',
        areaUnit: 'sqft',

        // Photos & Amenities
        amenities: ['Parking', 'Power Backup', 'Security', 'Garden', 'Swimming Pool', 'CCTV', 'Intercom'],
        postImageUrls: [
          'https://wityysaver.s3.ap-south-1.amazonaws.com/gallery_images/PROP1742202858454/34f30911-bfc3-4595-95b0-bcb40806a924_67777496d2deebfe7188efac_DSC02589-HDR.webp',
          'https://wityysaver.s3.ap-south-1.amazonaws.com/projects/Passion%20Group/gallery/a822f871-ee30-4222-b825-11184fbca432original-4d2d4ee3c82cc526d5c7d00b5adc1627.png'
        ],
        floorPlanImageUrls: [
          'https://wityysaver.s3.ap-south-1.amazonaws.com/1745050191639-IMG_0576.png',
          'https://wityysaver.s3.ap-south-1.amazonaws.com/gallery_images/PROP1742202858454/54df7ae5-6c69-4cef-9bcc-b8e78aa0bd3d_761c8c51c6631174_1440.png'
        ],
        galleryImageUrls: [
          'https://wityysaver.s3.ap-south-1.amazonaws.com/projects/Passion%20Group/gallery/a822f871-ee30-4222-b825-11184fbca432original-4d2d4ee3c82cc526d5c7d00b5adc1627.png',
          'https://wityysaver.s3.ap-south-1.amazonaws.com/gallery_images/PROP1742202858454/34f30911-bfc3-4595-95b0-bcb40806a924_67777496d2deebfe7188efac_DSC02589-HDR.webp'
        ],

        // Ownership & Legal
        ownerName: 'Amit Agarwal',
        propertyOwnership: 'Freehold',
        transactionType: 'New Property',
        reraStatus: 'Registered',
        reraRegistrationNumber: 'HR-RERA-VIL-789-2023',
        reraWebsite: 'https://haryanarera.gov.in',
        possessionDate: '2024-04-01',
        construction_status: 'Ready to Move',
        priceOnRequest: false,

        // Additional Property Features
        carpetArea: '2800',
        superBuiltupArea: '3200',
        pricePerSqFt: '10938',
        estimatedEMI: '250000',
        flooring: 'Marble Flooring',
        parking: 'Multiple Covered Parking',
        powerBackup: 'Full',
        widthOfFacingRoad: '80',
        waterSource: ['24/7 Municipal Supply', 'Borewell', 'Rainwater Harvesting'],
        gatedCommunity: true,
        petFriendly: true,
        propertyCode: 'GRV-VIL-4BHK-004',

        // Advanced Features
        religiousNearby: ['Near Temple', 'Near Church'],
        inProximity: ['Near School', 'Near College', 'Hospital Vicinity', 'Airport'],
        vastuCompliance: ['Vastu Friendly Layout', 'North Facing', 'Proper Room Placement', 'Vastu Compliant Kitchen', 'Vastu Compliant Main Door'],
        loanApprovalStatus: ['Bank Approved Project', 'Pre-Approved Loans', 'Government Subsidy Eligible'],
        builderReputation: ['Premium/Luxury Developer', 'Award-Winning Developer', 'Timely Delivery Track Record'],
        legalClearance: ['Clear Title', 'RERA Registered', 'Occupancy Certificate', 'Completion Certificate', 'NOC from Authorities'],
        environmentalFactors: ['Green Building Certified', 'Solar Power Installation', 'Waste Management System', 'EV Charging Points', 'Green Belt Proximity'],
        kitchenType: ['Modular Kitchen', 'Kitchen with Utility Area', 'Kitchen Garden Access'],
        bathroomFeatures: ['Premium Fittings', 'Western Toilet', 'Bathtub', 'Master Bath'],
        specialCategories: ['Senior Citizen Friendly', 'Gated Community', 'Weekend Home', 'Investment Property'],
        flooringType: ['Marble Flooring', 'Wooden Flooring', 'Italian Marble'],
        socialInfrastructure: ['School Proximity', 'College Vicinity', 'Hospital Access', 'Shopping Mall Proximity'],

        // USP and Tags
        usp: ['Private garden', 'Independent villa', 'Premium location', 'Spacious rooms', '24x7 security', 'Swimming pool'],
        tags: ['Luxury', 'Spacious', 'Independent', 'Premium', 'Investment', 'Vastu compliant'],
        overlookingAmenities: ['Garden', 'Swimming Pool', 'Green Belt'],
        location_advantage: ['Near School', 'Near College', 'Hospital', 'Airport', 'Shopping Mall'],
        facilities: ['Private Garden', 'Swimming Pool', 'Security', 'Power Backup', 'Parking'],
        contactList: [9876543214, 9876543215, 8765432110],

        // Maintenance and Financing
        maintenanceCharges: {
          minPrice: '15',
          maxPrice: '25',
          priceUnit: '₹',
          areaUnit: 'sqft'
        },
        financingOptions: ['Conventional Mortgage', 'FHA Loan', 'VA Loan'],

        // Communication Preferences
        whatsappAlerts: true,
        whatsappContact: '9876543214',
        profoProxyAllowed: true
      }
    }
  ];

  return (
    <div className="mb-4 bg-blue-50 p-4 rounded-lg">
      <label className="block text-sm font-medium text-blue-700 mb-2">
        Autofill Options (Testing Only)
      </label>
      <select
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        onChange={(e) => {
          const selectedOption = autoFillOptions.find(option => option.name === e.target.value);
          if (selectedOption) {
            handleSelectOption(selectedOption.data);
          }
        }}
      >
        <option value="">Select an option to autofill</option>
        {autoFillOptions.map(option => (
          <option key={option.name} value={option.name}>{option.name}</option>
        ))}
      </select>
      <p className="mt-1 text-xs text-gray-500">
        This is for testing purposes only and will be hidden in production.
      </p>
    </div>
  );
};

export default AutofillOptions;