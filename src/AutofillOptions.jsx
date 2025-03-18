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
    
    // Handle main property image
    if (data.postImageUrl) {
      const file = await urlToFile(data.postImageUrl, 'main-image.jpg', 'image/jpeg');
      if (file) data.postImage = file;
      delete data.postImageUrl;
    }
    
    // Handle floor plan image
    if (data.floorPlanImageUrl) {
      const file = await urlToFile(data.floorPlanImageUrl, 'floor-plan.png', 'image/png');
      if (file) data.floorPlanImage = file;
      delete data.floorPlanImageUrl;
    }
    
    // Handle gallery images
    if (data.galleryImageUrls && data.galleryImageUrls.length > 0) {
      const galleryFiles = [];
      for (let i = 0; i < data.galleryImageUrls.length; i++) {
        const file = await urlToFile(data.galleryImageUrls[i], `gallery-${i}.jpg`, 'image/jpeg');
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
      name: '3BHK Apartment (Complete)',
      data: {
        // Basic Details
        propertyType: 'Apartment',
        propertyCategory: 'Residential',
        bedrooms: '3',
        bathrooms: '2',
        balconies: '1',
        furnishingStatus: 'Semi-Furnished',
        propertyAge: '<5',
        floorNumber: '5',
        totalFloors: '10',
        facingDirection: 'East',
        purpose: 'sale',
        configuration: '3BHK',
        
        // Location Details
        address: '123 Green Apartments, Main Road',
        city: 'Mumbai',
        locality: 'Andheri West',
        pincode: '400053',
        latitude: 19.1136,
        longitude: 72.8697,
        
        // Property Details
        title: '3BHK Apartment in Andheri West',
        description: 'Spacious 3BHK apartment with modern amenities, good ventilation and natural light. Close to schools, markets and public transport.',
        price: '85',
        priceUnit: 'lakh',
        area: '1250',
        areaUnit: 'sqft',
        
        // Photos & Amenities
        amenities: ['Parking', 'Lift', 'Power Backup', 'Security', 'Gym', 'Swimming Pool'],
        postImageUrl: 'https://wityysaver.s3.ap-south-1.amazonaws.com/gallery_images/PROP1742202858454/34f30911-bfc3-4595-95b0-bcb40806a924_67777496d2deebfe7188efac_DSC02589-HDR.webp',
        floorPlanImageUrl: 'https://wityysaver.s3.ap-south-1.amazonaws.com/gallery_images/PROP1742202858454/54df7ae5-6c69-4cef-9bcc-b8e78aa0bd3d_761c8c51c6631174_1440.png',
        galleryImageUrls: [
          'https://wityysaver.s3.ap-south-1.amazonaws.com/projects/Passion%20Group/gallery/a822f871-ee30-4222-b825-11184fbca432original-4d2d4ee3c82cc526d5c7d00b5adc1627.png',
          'https://wityysaver.s3.ap-south-1.amazonaws.com/gallery_images/PROP1742202858454/34f30911-bfc3-4595-95b0-bcb40806a924_67777496d2deebfe7188efac_DSC02589-HDR.webp',
          'https://wityysaver.s3.ap-south-1.amazonaws.com/gallery_images/PROP1742202858454/6f0e42a2-7f7f-4eff-839183a07e019183df23221808_63219_172468_large.jpg'
        ],
        
        // Ownership & Legal
        ownerName: 'Rahul Sharma',
        propertyOwnership: 'Freehold',
        transactionType: 'Resale',
        reraStatus: 'Registered',
        reraRegistrationNumber: 'MH123456789',
        possessionDate: '2023-01-01',
        construction_status: 'Ready to Move',
        priceOnRequest: false,
        
        // Additional Property Features
        carpetArea: '1050',
        superBuiltupArea: '1250',
        flooring: 'Vitrified',
        parking: 'Covered',
        powerBackup: 'Full',
        widthOfFacingRoad: '40',
        waterSource: ['Municipal', 'Borewell'],
        gatedCommunity: true,
        petFriendly: true,
        
        // USP and Tags
        usp: ['Close to metro', 'Spacious rooms', '24x7 security', 'Garden view'],
        tags: ['Spacious', 'Corner unit', 'Vastu compliant', 'Investment'],
        overlookingAmenities: ['Garden', 'Park', 'Main Road'],
        location_advantage: ['Near School', 'Shopping Mall', 'Metro Station'],
        contactList: [9876543210, 9876543211],
        whatsappAlerts: true,
        whatsappContact: '9876543210',
        profoProxyAllowed: true
      }
    },
    {
      name: '2BHK Rental Flat (Complete)',
      data: {
        // Basic Details
        propertyType: 'Apartment',
        propertyCategory: 'Residential',
        bedrooms: '2',
        bathrooms: '2',
        balconies: '1',
        furnishingStatus: 'Fully Furnished',
        propertyAge: '5-10',
        floorNumber: '3',
        totalFloors: '5',
        facingDirection: 'North',
        purpose: 'rent',
        configuration: '2BHK',
        
        // Location Details
        address: '45 Blue Heights, Park Street',
        city: 'Bangalore',
        locality: 'Koramangala',
        pincode: '560034',
        latitude: 12.9352,
        longitude: 77.6245,
        
        // Property Details
        title: 'Furnished 2BHK in Koramangala',
        description: 'Well-maintained 2BHK apartment available for rent. Fully furnished with modern fittings, 24/7 security and power backup.',
        price: '35',
        priceUnit: 'thousand',
        area: '1000',
        areaUnit: 'sqft',
        
        // Photos & Amenities
        amenities: ['Parking', 'Lift', 'Power Backup', 'Swimming Pool', 'Gym', 'Club House'],
        postImageUrl: 'https://wityysaver.s3.ap-south-1.amazonaws.com/gallery_images/PROP1742202858454/34f30911-bfc3-4595-95b0-bcb40806a924_67777496d2deebfe7188efac_DSC02589-HDR.webp',
        floorPlanImageUrl: 'https://wityysaver.s3.ap-south-1.amazonaws.com/gallery_images/PROP1742202858454/54df7ae5-6c69-4cef-9bcc-b8e78aa0bd3d_761c8c51c6631174_1440.png',
        galleryImageUrls: [
          'https://wityysaver.s3.ap-south-1.amazonaws.com/projects/Passion%20Group/gallery/a822f871-ee30-4222-b825-11184fbca432original-4d2d4ee3c82cc526d5c7d00b5adc1627.png',
          'https://wityysaver.s3.ap-south-1.amazonaws.com/gallery_images/PROP1742202858454/34f30911-bfc3-4595-95b0-bcb40806a924_67777496d2deebfe7188efac_DSC02589-HDR.webp'
        ],
        
        // Ownership & Legal
        ownerName: 'Priya Verma',
        propertyOwnership: 'Leasehold',
        transactionType: 'New Property',
        reraStatus: 'Not Applicable',
        possessionDate: '2023-05-15',
        construction_status: 'Ready to Move',
        priceOnRequest: false,
        
        // Additional Property Features
        carpetArea: '850',
        superBuiltupArea: '1000',
        flooring: 'Wooden',
        parking: 'Open',
        powerBackup: 'Partial',
        widthOfFacingRoad: '30',
        waterSource: ['Municipal', 'Tanker'],
        gatedCommunity: true,
        petFriendly: false,
        
        // USP and Tags
        usp: ['24x7 security', 'Clubhouse access', 'Close to IT park'],
        tags: ['Well ventilated', 'Luxury', 'Corner unit'],
        overlookingAmenities: ['Pool', 'Garden'],
        location_advantage: ['Shopping Mall', 'Hospital', 'Bus Stop'],
        contactList: [8765432109, 8765432108],
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
        propertyAge: 'new',
        floorNumber: '0',
        totalFloors: '3',
        facingDirection: 'South',
        purpose: 'sale',
        
        // Location Details
        address: '78 Market Complex, Commercial Avenue',
        city: 'Delhi',
        locality: 'Connaught Place',
        pincode: '110001',
        latitude: 28.6289,
        longitude: 77.2090,
        
        // Property Details
        title: 'Prime Commercial Shop in Connaught Place',
        description: 'Prime commercial shop space available in high-footfall area. Perfect for retail, showroom or restaurant.',
        price: '2.5',
        priceUnit: 'crore',
        area: '800',
        areaUnit: 'sqft',
        
        // Photos & Amenities
        amenities: ['Power Backup', 'Security', 'CCTV', 'Fire Safety'],
        postImageUrl: 'https://wityysaver.s3.ap-south-1.amazonaws.com/gallery_images/PROP1742202858454/34f30911-bfc3-4595-95b0-bcb40806a924_67777496d2deebfe7188efac_DSC02589-HDR.webp',
        floorPlanImageUrl: 'https://wityysaver.s3.ap-south-1.amazonaws.com/gallery_images/PROP1742202858454/54df7ae5-6c69-4cef-9bcc-b8e78aa0bd3d_761c8c51c6631174_1440.png',
        galleryImageUrls: [
          'https://wityysaver.s3.ap-south-1.amazonaws.com/projects/Passion%20Group/gallery/a822f871-ee30-4222-b825-11184fbca432original-4d2d4ee3c82cc526d5c7d00b5adc1627.png'
        ],
        
        // Ownership & Legal
        ownerName: 'Vikram Singh',
        propertyOwnership: 'Freehold',
        transactionType: 'New Property',
        reraStatus: 'Registered',
        reraRegistrationNumber: 'DL987654321',
        possessionDate: '2023-06-01',
        construction_status: 'Ready to Move',
        priceOnRequest: false,
        
        // Additional Property Features
        carpetArea: '750',
        superBuiltupArea: '800',
        flooring: 'Granite',
        parking: 'Covered',
        powerBackup: 'Full',
        widthOfFacingRoad: '50',
        waterSource: ['Municipal'],
        gatedCommunity: false,
        petFriendly: false,
        
        // USP and Tags
        usp: ['High footfall area', 'Corner property', 'Main road facing'],
        tags: ['Investment', 'Prime location'],
        overlookingAmenities: ['Main Road'],
        location_advantage: ['Shopping Mall', 'Metro Station', 'Bus Stop'],
        contactList: [9876543212, 9876543213],
        whatsappAlerts: true,
        whatsappContact: '9876543212',
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