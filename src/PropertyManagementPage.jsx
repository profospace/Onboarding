// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { base_url } from '../utils/base_url';

// const API_BASE_URL = `${base_url}/api`;

// const PropertyManagementPage = ({ user, onLogout }) => {
//     // State for properties data
//     const [properties, setProperties] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');

//     // console.log("properties", properties)

//     // State for statistics
//     const [stats, setStats] = useState({
//         total: 0,
//         listed: 0,
//         unlisted: 0,
//         'payment-delay': 0,
//         suspicious: 0
//     });

//     // State for salesmen data (for reassignment)
//     const [salesmen, setSalesmen] = useState([]);

//     // State for filters and search
//     const [searchQuery, setSearchQuery] = useState('');
//     const [statusFilter, setStatusFilter] = useState('all');
//     const [typeFilter, setTypeFilter] = useState('all');
//     const [cityFilter, setCityFilter] = useState('');
//     const [priceMin, setPriceMin] = useState('');
//     const [priceMax, setPriceMax] = useState('');
//     const [dateFrom, setDateFrom] = useState('');
//     const [dateTo, setDateTo] = useState('');
//     const [salesmanFilter, setSalesmanFilter] = useState('');

//     // State for sorting
//     const [sortField, setSortField] = useState('createdAt');
//     const [sortOrder, setSortOrder] = useState('desc');

//     // State for pagination
//     const [page, setPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(1);
//     const [limit, setLimit] = useState(10);

//     // State for modals
//     const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//     const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
//     const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
//     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//     const [isBulkActionModalOpen, setIsBulkActionModalOpen] = useState(false);
//     const [selectedPropertyId, setSelectedPropertyId] = useState(null);
//     const [selectedProperty, setSelectedProperty] = useState(null);
//     const [selectedStatus, setSelectedStatus] = useState('');
//     const [adminNotes, setAdminNotes] = useState('');
//     const [selectedSalesmanId, setSelectedSalesmanId] = useState('');
//     const [reassignReason, setReassignReason] = useState('');

//     // State for bulk actions
//     const [selectedProperties, setSelectedProperties] = useState([]);
//     const [bulkAction, setBulkAction] = useState('');
//     const [selectAll, setSelectAll] = useState(false);


//     const navigate = useNavigate()

//     // Fetch properties with filters
//     const fetchProperties = async () => {
//         try {
//             setLoading(true);

//             // Build query parameters
//             const params = new URLSearchParams();

//             // Add pagination parameters
//             params.append('page', page);
//             params.append('limit', limit);

//             // Add sort parameters
//             params.append('sortField', sortField);
//             params.append('sortOrder', sortOrder);

//             // Add filters
//             if (statusFilter !== 'all') params.append('status', statusFilter);
//             if (typeFilter !== 'all') params.append('type_name', typeFilter);
//             if (cityFilter) params.append('city', cityFilter);
//             if (priceMin) params.append('priceMin', priceMin);
//             if (priceMax) params.append('priceMax', priceMax);
//             if (dateFrom) params.append('dateFrom', dateFrom);
//             if (dateTo) params.append('dateTo', dateTo);
//             if (salesmanFilter) params.append('salesman', salesmanFilter);
//             if (searchQuery) params.append('search', searchQuery);

//             // Get user token from localStorage
//             const details = JSON.parse(localStorage.getItem('user'));

//             // Make the API request
//             const response = await axios.get(`${API_BASE_URL}/adminSales/property?${params.toString()}`, {
//                 headers: { Authorization: `Bearer ${details?.token}` }
//             });

//             console.log("response", response)

//             // Update state with response data
//             setProperties(response.data.data.properties);
//             setStats(response.data.data.stats);
//             setTotalPages(response.data.data.pagination.pages);
//             setLoading(false);
//         } catch (err) {
//             console.error('Error fetching properties:', err);
//             setError('Failed to load properties. Please try again.');
//             setLoading(false);
//         }
//     };

//     // Fetch salesmen for reassignment
//     const fetchSalesmen = async () => {
//         try {
//             const details = JSON.parse(localStorage.getItem('user'));
//             const response = await axios.get(`${API_BASE_URL}/salesmen/all-salesman`, {
//                 headers: { Authorization: `Bearer ${details?.token}` }
//             });

//             setSalesmen(response.data.data.salesmen);
//         } catch (err) {
//             console.error('Error fetching salesmen:', err);
//             setError('Failed to load salesmen data. Please try again.');
//         }
//     };

//     // Fetch property details by ID
//     const fetchPropertyDetails = async (propertyId) => {
//         try {
//             const details = JSON.parse(localStorage.getItem('user'));
//             const response = await axios.get(`${API_BASE_URL}/adminSales/properties/${propertyId}`, {
//                 headers: { Authorization: `Bearer ${details?.token}` }
//             });

//             setSelectedProperty(response.data.data);
//         } catch (err) {
//             console.error('Error fetching property details:', err);
//             setError('Failed to load property details. Please try again.');
//         }
//     };

//     // Fetch data on mount and when filters change
//     useEffect(() => {
//         fetchProperties();
//     }, [
//         searchQuery,
//         statusFilter,
//         typeFilter,
//         cityFilter,
//         priceMin,
//         priceMax,
//         dateFrom,
//         dateTo,
//         salesmanFilter,
//         sortField,
//         sortOrder,
//         page,
//         limit
//     ]);

//     // Fetch salesmen on mount
//     useEffect(() => {
//         fetchSalesmen();
//     }, []);

//     // Handle status change
//     const handleStatusChange = async () => {
//         try {
//             const details = JSON.parse(localStorage.getItem('user'));

//             await axios.patch(
//                 `${API_BASE_URL}/adminSales/properties/${selectedPropertyId}/status`,
//                 { status: selectedStatus, adminNotes },
//                 { headers: { Authorization: `Bearer ${details?.token}` } }
//             );

//             setIsStatusModalOpen(false);
//             setAdminNotes('');
//             fetchProperties();
//         } catch (err) {
//             console.error('Error updating property status:', err);
//             setError('Failed to update property status. Please try again.');
//         }
//     };

//     // Handle property reassignment
//     const handleReassignProperty = async () => {
//         try {
//             const details = JSON.parse(localStorage.getItem('user'));

//             await axios.patch(
//                 `${API_BASE_URL}/adminSales/properties/${selectedPropertyId}/reassign`,
//                 { salesmanId: selectedSalesmanId, reason: reassignReason },
//                 { headers: { Authorization: `Bearer ${details?.token}` } }
//             );

//             setIsReassignModalOpen(false);
//             setReassignReason('');
//             setSelectedSalesmanId('');
//             fetchProperties();
//         } catch (err) {
//             console.error('Error reassigning property:', err);
//             setError('Failed to reassign property. Please try again.');
//         }
//     };

//     // Handle property deletion
//     const handleDeleteProperty = async () => {
//         try {
//             const details = JSON.parse(localStorage.getItem('user'));

//             await axios.delete(`${API_BASE_URL}/adminSales/properties/${selectedPropertyId}`, {
//                 headers: { Authorization: `Bearer ${details?.token}` }
//             });

//             setIsDeleteModalOpen(false);
//             fetchProperties();
//         } catch (err) {
//             console.error('Error deleting property:', err);
//             setError('Failed to delete property. Please try again.');
//         }
//     };

//     // Handle bulk status update
//     const handleBulkStatusUpdate = async () => {
//         try {
//             const details = JSON.parse(localStorage.getItem('user'));

//             await axios.post(
//                 `${API_BASE_URL}/adminSales/properties/bulk-update-status`,
//                 {
//                     propertyIds: selectedProperties,
//                     status: selectedStatus,
//                     adminNotes
//                 },
//                 { headers: { Authorization: `Bearer ${details?.token}` } }
//             );

//             setIsBulkActionModalOpen(false);
//             setSelectedProperties([]);
//             setSelectAll(false);
//             setAdminNotes('');
//             fetchProperties();
//         } catch (err) {
//             console.error('Error performing bulk update:', err);
//             setError('Failed to perform bulk update. Please try again.');
//         }
//     };

//     // Toggle select all properties
//     const toggleSelectAll = () => {
//         if (selectAll) {
//             setSelectedProperties([]);
//         } else {
//             setSelectedProperties(properties.map(property => property.post_id));
//         }
//         setSelectAll(!selectAll);
//     };

//     // Toggle select individual property
//     const toggleSelectProperty = (propertyId) => {
//         if (selectedProperties.includes(propertyId)) {
//             setSelectedProperties(selectedProperties.filter(id => id !== propertyId));
//         } else {
//             setSelectedProperties([...selectedProperties, propertyId]);
//         }
//     };

//     // Handle changing the sort
//     const handleSort = (field) => {
//         if (field === sortField) {
//             setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
//         } else {
//             setSortField(field);
//             setSortOrder('asc');
//         }
//     };

//     // Reset all filters
//     const resetFilters = () => {
//         setSearchQuery('');
//         setStatusFilter('all');
//         setTypeFilter('all');
//         setCityFilter('');
//         setPriceMin('');
//         setPriceMax('');
//         setDateFrom('');
//         setDateTo('');
//         setSalesmanFilter('');
//         setSortField('createdAt');
//         setSortOrder('desc');
//         setPage(1);
//     };

//     // Format date
//     const formatDate = (dateString) => {
//         if (!dateString) return 'N/A';
//         const options = { year: 'numeric', month: 'short', day: 'numeric' };
//         return new Date(dateString).toLocaleDateString(undefined, options);
//     };

//     // Format price
//     const formatPrice = (price) => {
//         if (!price) return 'N/A';
//         return new Intl.NumberFormat('en-IN', {
//             style: 'currency',
//             currency: 'INR',
//             maximumFractionDigits: 0
//         }).format(price);
//     };

//     // Open property details modal
//     const openPropertyDetails = (property) => {
//         setSelectedProperty(property);
//         setSelectedPropertyId(property.post_id);
//         setIsViewModalOpen(true);


//     };

//     // Open status change modal
//     const openStatusModal = (property) => {
//         setSelectedPropertyId(property.post_id);
//         setSelectedStatus(property.status);
//         setIsStatusModalOpen(true);
//     };

//     // Open reassign modal
//     const openReassignModal = (property) => {
//         setSelectedPropertyId(property.post_id);
//         setSelectedSalesmanId('');
//         setIsReassignModalOpen(true);
//     };

//     // Open delete confirmation modal
//     const openDeleteModal = (property) => {
//         setSelectedPropertyId(property.post_id);
//         setIsDeleteModalOpen(true);
//     };

//     // Handle pagination
//     const handlePageChange = (newPage) => {
//         setPage(newPage);
//     };

//     // Get status badge class
//     const getStatusBadgeClass = (status) => {
//         switch (status) {
//             case 'listed':
//                 return 'bg-green-100 text-green-800';
//             case 'unlisted':
//                 return 'bg-gray-100 text-gray-800';
//             case 'payment-delay':
//                 return 'bg-yellow-100 text-yellow-800';
//             case 'suspicious':
//                 return 'bg-red-100 text-red-800';
//             default:
//                 return 'bg-gray-100 text-gray-800';
//         }
//     };

//     return (
//         <div className="container mx-auto px-4 py-8">
//             {/* Header */}
//             {/* <div className="flex justify-between items-center mb-8">
//                 <div>
//                     <h1 className="text-3xl font-bold mb-2">Property Management</h1>
//                     <p className="text-gray-600">Manage and monitor all properties</p>
//                 </div>

//                 <div className="flex space-x-4">
//                     <button
//                         onClick={() => window.history.back()}
//                         className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                     >
//                         Back
//                     </button>
//                 </div>
//             </div> */}

//             {/* Error message */}
//             {error && (
//                 <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700">
//                     <p>{error}</p>
//                     <button
//                         onClick={() => setError('')}
//                         className="ml-2 text-sm text-red-500 hover:underline"
//                     >
//                         Dismiss
//                     </button>
//                 </div>
//             )}

//             {/* Status Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
//                 <div className="bg-white rounded-lg shadow p-4">
//                     <div className="flex justify-between items-center">
//                         <div>
//                             <p className="text-sm text-gray-500">Total Properties</p>
//                             <p className="text-2xl font-bold">{stats.total}</p>
//                         </div>
//                         <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                             </svg>
//                         </div>
//                     </div>
//                 </div>

//                 <div
//                     className="bg-white rounded-lg shadow p-4 cursor-pointer hover:bg-green-50"
//                     onClick={() => setStatusFilter('listed')}
//                 >
//                     <div className="flex justify-between items-center">
//                         <div>
//                             <p className="text-sm text-gray-500">Listed Properties</p>
//                             <p className="text-2xl font-bold">{stats.listed}</p>
//                         </div>
//                         <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                             </svg>
//                         </div>
//                     </div>
//                 </div>

//                 <div
//                     className="bg-white rounded-lg shadow p-4 cursor-pointer hover:bg-gray-50"
//                     onClick={() => setStatusFilter('unlisted')}
//                 >
//                     <div className="flex justify-between items-center">
//                         <div>
//                             <p className="text-sm text-gray-500">Unlisted Properties</p>
//                             <p className="text-2xl font-bold">{stats.unlisted}</p>
//                         </div>
//                         <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
//                             </svg>
//                         </div>
//                     </div>
//                 </div>

//                 <div
//                     className="bg-white rounded-lg shadow p-4 cursor-pointer hover:bg-yellow-50"
//                     onClick={() => setStatusFilter('payment-delay')}
//                 >
//                     <div className="flex justify-between items-center">
//                         <div>
//                             <p className="text-sm text-gray-500">Payment Delay</p>
//                             <p className="text-2xl font-bold">{stats['payment-delay']}</p>
//                         </div>
//                         <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                             </svg>
//                         </div>
//                     </div>
//                 </div>

//                 <div
//                     className="bg-white rounded-lg shadow p-4 cursor-pointer hover:bg-red-50"
//                     onClick={() => setStatusFilter('suspicious')}
//                 >
//                     <div className="flex justify-between items-center">
//                         <div>
//                             <p className="text-sm text-gray-500">Suspicious</p>
//                             <p className="text-2xl font-bold">{stats.suspicious}</p>
//                         </div>
//                         <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//                             </svg>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Filters Section */}
//             <div className="bg-white rounded-lg shadow mb-8">
//                 <div className="p-6">
//                     <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
//                         <h2 className="text-xl font-semibold">Property Filters</h2>
//                         <div className="relative">
//                             <input
//                                 type="text"
//                                 placeholder="Search properties..."
//                                 value={searchQuery}
//                                 onChange={(e) => setSearchQuery(e.target.value)}
//                                 className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             />
//                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                 <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                                     <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
//                                 </svg>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//                         {/* Status Filter */}
//                         <div>
//                             <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
//                                 Status
//                             </label>
//                             <select
//                                 id="statusFilter"
//                                 value={statusFilter}
//                                 onChange={(e) => setStatusFilter(e.target.value)}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                             >
//                                 <option value="all">All Statuses</option>
//                                 <option value="listed">Listed</option>
//                                 <option value="unlisted">Unlisted</option>
//                                 <option value="payment-delay">Payment Delay</option>
//                                 <option value="suspicious">Suspicious</option>
//                             </select>
//                         </div>

//                         {/* Property Type Filter */}
//                         <div>
//                             <label htmlFor="typeFilter" className="block text-sm font-medium text-gray-700 mb-1">
//                                 Property Type
//                             </label>
//                             <select
//                                 id="typeFilter"
//                                 value={typeFilter}
//                                 onChange={(e) => setTypeFilter(e.target.value)}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                             >
//                                 <option value="all">All Types</option>
//                                 <option value="Apartment">Apartment</option>
//                                 <option value="Villa">Villa</option>
//                                 <option value="House">House</option>
//                                 <option value="Plot">Plot</option>
//                                 <option value="Commercial">Commercial</option>
//                             </select>
//                         </div>

//                         {/* City Filter */}
//                         <div>
//                             <label htmlFor="cityFilter" className="block text-sm font-medium text-gray-700 mb-1">
//                                 City
//                             </label>
//                             <input
//                                 type="text"
//                                 id="cityFilter"
//                                 placeholder="Filter by city"
//                                 value={cityFilter}
//                                 onChange={(e) => setCityFilter(e.target.value)}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                             />
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
//                         {/* Price Range */}
//                         <div>
//                             <label htmlFor="priceMin" className="block text-sm font-medium text-gray-700 mb-1">
//                                 Price Minimum
//                             </label>
//                             <input
//                                 type="number"
//                                 id="priceMin"
//                                 placeholder="Min Price"
//                                 value={priceMin}
//                                 onChange={(e) => setPriceMin(e.target.value)}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                             />
//                         </div>

//                         <div>
//                             <label htmlFor="priceMax" className="block text-sm font-medium text-gray-700 mb-1">
//                                 Price Maximum
//                             </label>
//                             <input
//                                 type="number"
//                                 id="priceMax"
//                                 placeholder="Max Price"
//                                 value={priceMax}
//                                 onChange={(e) => setPriceMax(e.target.value)}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                             />
//                         </div>

//                         {/* Date Range */}
//                         <div>
//                             <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 mb-1">
//                                 From Date
//                             </label>
//                             <input
//                                 type="date"
//                                 id="dateFrom"
//                                 value={dateFrom}
//                                 onChange={(e) => setDateFrom(e.target.value)}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                             />
//                         </div>

//                         <div>
//                             <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 mb-1">
//                                 To Date
//                             </label>
//                             <input
//                                 type="date"
//                                 id="dateTo"
//                                 value={dateTo}
//                                 onChange={(e) => setDateTo(e.target.value)}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                             />
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                         {/* Salesman Filter */}
//                         <div>
//                             <label htmlFor="salesmanFilter" className="block text-sm font-medium text-gray-700 mb-1">
//                                 Salesman
//                             </label>
//                             <select
//                                 id="salesmanFilter"
//                                 value={salesmanFilter}
//                                 onChange={(e) => setSalesmanFilter(e.target.value)}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                             >
//                                 <option value="">All Salesmen</option>
//                                 {salesmen.map((salesman) => (
//                                     <option key={salesman._id} value={salesman._id}>
//                                         {salesman.name}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         {/* Sort Filter */}
//                         <div>
//                             <label htmlFor="sortFilter" className="block text-sm font-medium text-gray-700 mb-1">
//                                 Sort By
//                             </label>
//                             <div className="flex space-x-2">
//                                 <select
//                                     id="sortFilter"
//                                     value={sortField}
//                                     onChange={(e) => setSortField(e.target.value)}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                                 >
//                                     <option value="createdAt">Date Added</option>
//                                     <option value="price">Price</option>
//                                     <option value="post_title">Title</option>
//                                     <option value="city">City</option>
//                                     <option value="total_views">Views</option>
//                                 </select>
//                                 <button
//                                     onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
//                                     className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                                 >
//                                     {sortOrder === 'asc' ? (
//                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                                             <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
//                                         </svg>
//                                     ) : (
//                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                                             <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                                         </svg>
//                                     )}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Filter Actions */}
//                     <div className="flex justify-between mt-6">
//                         <button
//                             onClick={resetFilters}
//                             className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
//                             Reset Filters
//                         </button>
//                         <div className="flex space-x-2">
//                             <button
//                                 onClick={fetchProperties}
//                                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                             >
//                                 Apply Filters
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Bulk Actions */}
//             <div className="bg-white rounded-lg shadow p-4 mb-8">
//                 <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
//                     <div className="flex items-center space-x-2">
//                         <input
//                             type="checkbox"
//                             id="selectAll"
//                             checked={selectAll}
//                             onChange={toggleSelectAll}
//                             className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                         />
//                         <label htmlFor="selectAll" className="text-sm font-medium text-gray-700">
//                             Select All
//                         </label>
//                     </div>

//                     <div className="flex items-center space-x-2">
//                         <span className="text-sm text-gray-500">
//                             {selectedProperties.length} properties selected
//                         </span>
//                         <select
//                             value={bulkAction}
//                             onChange={(e) => setBulkAction(e.target.value)}
//                             disabled={selectedProperties.length === 0}
//                             className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                         >
//                             <option value="">Bulk Actions</option>
//                             <option value="status">Change Status</option>
//                             <option value="reassign">Reassign Properties</option>
//                             <option value="delete">Delete Properties</option>
//                         </select>
//                         <button
//                             onClick={() => {
//                                 if (bulkAction === 'status') {
//                                     setIsBulkActionModalOpen(true);
//                                 }
//                                 // Add other bulk actions as needed
//                             }}
//                             disabled={!bulkAction || selectedProperties.length === 0}
//                             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                             Apply
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Properties Table */}
//             <div className="bg-white rounded-lg shadow mb-8 overflow-hidden">
//                 {loading ? (
//                     <div className="p-8 flex justify-center">
//                         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//                     </div>
//                 ) : properties.length === 0 ? (
//                     <div className="p-8 text-center">
//                         <p className="text-gray-500 text-lg">No properties found matching your filters.</p>
//                         <button
//                             onClick={resetFilters}
//                             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                         >
//                             Reset Filters
//                         </button>
//                     </div>
//                 ) : (
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-50">
//                                 <tr>
//                                     <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         <input
//                                             type="checkbox"
//                                             checked={selectAll}
//                                             onChange={toggleSelectAll}
//                                             className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                                         />
//                                     </th>
//                                     {/* <th
//                                         scope="col"
//                                         className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                                         onClick={() => handleSort('post_id')}
//                                     >
//                                         ID
//                                         {sortField === 'post_id' && (
//                                             <span className="ml-1">
//                                                 {sortOrder === 'asc' ? '↑' : '↓'}
//                                             </span>
//                                         )}
//                                     </th> */}
//                                     <th
//                                         scope="col"
//                                         className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                                         onClick={() => handleSort('post_title')}
//                                     >
//                                         Property
//                                         {sortField === 'post_title' && (
//                                             <span className="ml-1">
//                                                 {sortOrder === 'asc' ? '↑' : '↓'}
//                                             </span>
//                                         )}
//                                     </th>
//                                     <th
//                                         scope="col"
//                                         className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                                     // onClick={() => handleSort('post_title')}
//                                     >
//                                         Salesman
//                                         {/* {sortField === 'post_title' && (
//                                             <span className="ml-1">
//                                                 {sortOrder === 'asc' ? '↑' : '↓'}
//                                             </span>
//                                         )} */}
//                                     </th>

//                                     <th
//                                         scope="col"
//                                         className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                                         onClick={() => handleSort('type_name')}
//                                     >
//                                         Type
//                                         {sortField === 'type_name' && (
//                                             <span className="ml-1">
//                                                 {sortOrder === 'asc' ? '↑' : '↓'}
//                                             </span>
//                                         )}
//                                     </th>
//                                     <th
//                                         scope="col"
//                                         className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                                         onClick={() => handleSort('city')}
//                                     >
//                                         Location
//                                         {sortField === 'city' && (
//                                             <span className="ml-1">
//                                                 {sortOrder === 'asc' ? '↑' : '↓'}
//                                             </span>
//                                         )}
//                                     </th>
//                                     <th
//                                         scope="col"
//                                         className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                                         onClick={() => handleSort('price')}
//                                     >
//                                         Price
//                                         {sortField === 'price' && (
//                                             <span className="ml-1">
//                                                 {sortOrder === 'asc' ? '↑' : '↓'}
//                                             </span>
//                                         )}
//                                     </th>
//                                     <th
//                                         scope="col"
//                                         className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                                         onClick={() => handleSort('status')}
//                                     >
//                                         Status
//                                         {sortField === 'status' && (
//                                             <span className="ml-1">
//                                                 {sortOrder === 'asc' ? '↑' : '↓'}
//                                             </span>
//                                         )}
//                                     </th>
//                                     <th
//                                         scope="col"
//                                         className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                                         onClick={() => handleSort('createdAt')}
//                                     >
//                                         Date Added
//                                         {sortField === 'createdAt' && (
//                                             <span className="ml-1">
//                                                 {sortOrder === 'asc' ? '↑' : '↓'}
//                                             </span>
//                                         )}
//                                     </th>
//                                     <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Actions
//                                     </th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                                 {properties.map((property) => (
//                                     <tr key={property.post_id} className="hover:bg-gray-50">
//                                         <td className="px-4 py-4 whitespace-nowrap">
//                                             <input
//                                                 type="checkbox"
//                                                 checked={selectedProperties.includes(property.post_id)}
//                                                 onChange={() => toggleSelectProperty(property.post_id)}
//                                                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                                             />
//                                         </td>
//                                         {/* <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
//                                             {property.post_id}
//                                         </td> */}
//                                         <td className="px-4 py-4 ">
//                                             <div className="flex items-center">
//                                                 <div className="h-10 w-10 flex-shrink-0">
//                                                     <img
//                                                         className="h-10 w-10 rounded-md object-cover"
//                                                         src={
//                                                             property.post_images?.[0]?.url || property?.post_image ||
//                                                             'https://via.placeholder.com/150'
//                                                         }
//                                                         alt=""
//                                                     />
//                                                 </div>
//                                                 <div className="ml-4">
//                                                     <div className="text-sm font-medium text-gray-900">
//                                                         {property.post_title || 'Untitled Property'}
//                                                     </div>
//                                                     <div className="text-sm text-gray-500">
//                                                         {property.total_views || 0} views
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </td>
//                                         <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
//                                             <div>{property?.salesman?.name || 'N/A'}</div>
//                                             <div>{property?.salesman?.email || 'N/A'}</div>
//                                             <div>{property?.salesman?.phone || 'N/A'}</div>
//                                         </td>
//                                         <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
//                                             {property.type_name || 'N/A'}
//                                         </td>

//                                         <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
//                                             {property.city || 'N/A'}
//                                             {property.state && `, ${property.state}`}
//                                         </td>
//                                         <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
//                                             {formatPrice(property.price)}
//                                         </td>
//                                         <td className="px-4 py-4 whitespace-nowrap">
//                                             <span
//                                                 className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
//                                                     property.status
//                                                 )}`}
//                                             >
//                                                 {property.status}
//                                             </span>
//                                         </td>
//                                         <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
//                                             {formatDate(property.createdAt)}
//                                         </td>
//                                         <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
//                                             <div className="flex space-x-2">
//                                                 <button
//                                                     onClick={() => navigate(`/property-edit/${property?.post_id}`)}
//                                                     className="text-green-600 hover:text-blue-900"
//                                                 >
//                                                     Edit
//                                                 </button>
//                                                 <button
//                                                     onClick={() => navigate(`/salesman/profile/${property.salesman._id}`, { state: { salesman: property.salesman } })}
//                                                     className="text-red-600 hover:text-blue-900"
//                                                 >
//                                                     Profile
//                                                 </button>
//                                                 <button
//                                                     onClick={() => openPropertyDetails(property)}
//                                                     className="text-blue-600 hover:text-blue-900"
//                                                 >
//                                                     View
//                                                 </button>
//                                                 <button
//                                                     onClick={() => window.location.href = `${import.meta.env.VITE_REDIRECT_URL || 'http://localhost:5173'}/api/details/${property?.post_id}`}
//                                                     className="text-purple-600 hover:text-purple-900"
//                                                 >
//                                                     View on Web
//                                                 </button>
//                                                 <button
//                                                     onClick={() => openStatusModal(property)}
//                                                     className="text-yellow-600 hover:text-yellow-900"
//                                                 >
//                                                     Status
//                                                 </button>
//                                                 <button
//                                                     onClick={() => openReassignModal(property)}
//                                                     className="text-green-600 hover:text-green-900"
//                                                 >
//                                                     Reassign
//                                                 </button>
//                                                 <button
//                                                     onClick={() => openDeleteModal(property)}
//                                                     className="text-red-600 hover:text-red-900"
//                                                 >
//                                                     Delete
//                                                 </button>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}
//             </div>

//             {/* Pagination */}
//             {!loading && properties.length > 0 && (
//                 <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow">
//                     <div className="flex flex-1 justify-between sm:hidden">
//                         <button
//                             onClick={() => handlePageChange(page > 1 ? page - 1 : 1)}
//                             disabled={page === 1}
//                             className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                             Previous
//                         </button>
//                         <button
//                             onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
//                             disabled={page === totalPages}
//                             className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                             Next
//                         </button>
//                     </div>
//                     <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
//                         <div>
//                             <p className="text-sm text-gray-700">
//                                 Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
//                                 <span className="font-medium">
//                                     {Math.min(page * limit, properties.length + (page - 1) * limit)}
//                                 </span>{' '}
//                                 of <span className="font-medium">{stats.total}</span> results
//                             </p>
//                         </div>
//                         <div>
//                             <div className="isolate inline-flex -space-x-px rounded-md shadow-sm">
//                                 <button
//                                     onClick={() => handlePageChange(1)}
//                                     disabled={page === 1}
//                                     className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed"
//                                 >
//                                     <span className="sr-only">First</span>
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                                         <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
//                                     </svg>
//                                 </button>
//                                 <button
//                                     onClick={() => handlePageChange(page > 1 ? page - 1 : 1)}
//                                     disabled={page === 1}
//                                     className="relative inline-flex items-center border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed"
//                                 >
//                                     <span className="sr-only">Previous</span>
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                                         <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
//                                     </svg>
//                                 </button>

//                                 {/* Page Numbers */}
//                                 {[...Array(totalPages > 5 ? 5 : totalPages)].map((_, i) => {
//                                     let pageNum;
//                                     if (totalPages <= 5) {
//                                         pageNum = i + 1;
//                                     } else if (page <= 3) {
//                                         pageNum = i + 1;
//                                     } else if (page >= totalPages - 2) {
//                                         pageNum = totalPages - 4 + i;
//                                     } else {
//                                         pageNum = page - 2 + i;
//                                     }

//                                     return (
//                                         <button
//                                             key={pageNum}
//                                             onClick={() => handlePageChange(pageNum)}
//                                             className={`relative inline-flex items-center border border-gray-300 px-4 py-2 text-sm font-medium ${page === pageNum
//                                                 ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
//                                                 : 'bg-white text-gray-500 hover:bg-gray-50'
//                                                 } focus:z-20`}
//                                         >
//                                             {pageNum}
//                                         </button>
//                                     );
//                                 })}

//                                 <button
//                                     onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
//                                     disabled={page === totalPages}
//                                     className="relative inline-flex items-center border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed"
//                                 >
//                                     <span className="sr-only">Next</span>
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                                         <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
//                                     </svg>
//                                 </button>
//                                 <button
//                                     onClick={() => handlePageChange(totalPages)}
//                                     disabled={page === totalPages}
//                                     className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed"
//                                 >
//                                     <span className="sr-only">Last</span>
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                                         <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
//                                         <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
//                                     </svg>
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* View Property Modal */}
//             {isViewModalOpen && selectedProperty && (
//                 <div className="fixed inset-0 z-10 overflow-y-auto">
//                     <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//                         <div className="fixed inset-0 transition-opacity" aria-hidden="true">
//                             <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
//                         </div>

//                         <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

//                         <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
//                             <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//                                 <div className="sm:flex sm:items-start">
//                                     <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
//                                         <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
//                                             Property Details
//                                         </h3>

//                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                             <div>
//                                                 <img
//                                                     src={selectedProperty.post_images?.[0]?.url || 'https://via.placeholder.com/600x400'}
//                                                     alt={selectedProperty.post_title}
//                                                     className="w-full h-64 object-cover rounded-lg shadow"
//                                                 />

//                                                 <div className="mt-4">
//                                                     <h4 className="text-md font-semibold text-gray-800">Basic Information</h4>
//                                                     <div className="mt-2 grid grid-cols-2 gap-4">
//                                                         <div>
//                                                             <p className="text-sm text-gray-500">ID</p>
//                                                             <p className="text-sm font-medium">{selectedProperty.post_id}</p>
//                                                         </div>
//                                                         <div>
//                                                             <p className="text-sm text-gray-500">Type</p>
//                                                             <p className="text-sm font-medium">{selectedProperty.type_name || 'N/A'}</p>
//                                                         </div>
//                                                         <div>
//                                                             <p className="text-sm text-gray-500">Status</p>
//                                                             <p className="text-sm font-medium">
//                                                                 <span
//                                                                     className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
//                                                                         selectedProperty.status
//                                                                     )}`}
//                                                                 >
//                                                                     {selectedProperty.status}
//                                                                 </span>
//                                                             </p>
//                                                         </div>
//                                                         <div>
//                                                             <p className="text-sm text-gray-500">Date Added</p>
//                                                             <p className="text-sm font-medium">{formatDate(selectedProperty.createdAt)}</p>
//                                                         </div>
//                                                     </div>
//                                                 </div>

//                                                 <div className="mt-4">
//                                                     <h4 className="text-md font-semibold text-gray-800">Contact Information</h4>
//                                                     <div className="mt-2 grid grid-cols-1 gap-2">
//                                                         <div>
//                                                             <p className="text-sm text-gray-500">Owner</p>
//                                                             <p className="text-sm font-medium">{selectedProperty.owner_name || 'N/A'}</p>
//                                                         </div>
//                                                         <div>
//                                                             <p className="text-sm text-gray-500">Phone</p>
//                                                             <p className="text-sm font-medium">{selectedProperty.owner_phone || 'N/A'}</p>
//                                                         </div>
//                                                         <div>
//                                                             <p className="text-sm text-gray-500">Email</p>
//                                                             <p className="text-sm font-medium">{selectedProperty.owner_email || 'N/A'}</p>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                             <div>
//                                                 <h4 className="text-xl font-semibold text-gray-800">{selectedProperty.post_title}</h4>
//                                                 <p className="text-lg font-bold text-blue-600 mt-1">{formatPrice(selectedProperty.price)}</p>

//                                                 <div className="mt-2">
//                                                     <p className="text-gray-700">{selectedProperty.description || 'No description available.'}</p>
//                                                 </div>

//                                                 <div className="mt-4">
//                                                     <h4 className="text-md font-semibold text-gray-800">Location</h4>
//                                                     <div className="flex items-center mt-1">
//                                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
//                                                             <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
//                                                         </svg>
//                                                         <p className="ml-2 text-gray-700">
//                                                             {selectedProperty.address || 'N/A'}
//                                                             {selectedProperty.city && `, ${selectedProperty.city}`}
//                                                             {selectedProperty.state && `, ${selectedProperty.state}`}
//                                                             {selectedProperty.zipcode && ` - ${selectedProperty.zipcode}`}
//                                                         </p>
//                                                     </div>
//                                                 </div>

//                                                 <div className="mt-4">
//                                                     <h4 className="text-md font-semibold text-gray-800">Property Details</h4>
//                                                     <div className="mt-2 grid grid-cols-2 gap-2">
//                                                         <div>
//                                                             <p className="text-sm text-gray-500">Area</p>
//                                                             <p className="text-sm font-medium">
//                                                                 {selectedProperty.area
//                                                                     ? `${selectedProperty.area} sq ft`
//                                                                     : 'N/A'}
//                                                             </p>
//                                                         </div>
//                                                         <div>
//                                                             <p className="text-sm text-gray-500">Bedrooms</p>
//                                                             <p className="text-sm font-medium">{selectedProperty.bedrooms || 'N/A'}</p>
//                                                         </div>
//                                                         <div>
//                                                             <p className="text-sm text-gray-500">Bathrooms</p>
//                                                             <p className="text-sm font-medium">{selectedProperty.bathrooms || 'N/A'}</p>
//                                                         </div>
//                                                         <div>
//                                                             <p className="text-sm text-gray-500">Parking</p>
//                                                             <p className="text-sm font-medium">{selectedProperty.parking_spaces || 'N/A'}</p>
//                                                         </div>
//                                                     </div>
//                                                 </div>

//                                                 <div className="mt-4">
//                                                     <h4 className="text-md font-semibold text-gray-800">Salesman Information</h4>
//                                                     <div className="mt-2 grid grid-cols-1 gap-2">
//                                                         <div>
//                                                             <p className="text-sm text-gray-500">Assigned To</p>
//                                                             <p className="text-sm font-medium">{selectedProperty.salesman?.name || 'Unassigned'}</p>
//                                                         </div>
//                                                         <div>
//                                                             <p className="text-sm text-gray-500">Contact</p>
//                                                             <p className="text-sm font-medium">{selectedProperty.salesman?.phone || selectedProperty.salesman?.contact || 'N/A'}</p>
//                                                         </div>
//                                                         <div>
//                                                             <p className="text-sm text-gray-500">Email</p>
//                                                             <p className="text-sm font-medium">{selectedProperty.salesman?.email || 'N/A'}</p>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         <div className="mt-4">
//                                             <h4 className="text-md font-semibold text-gray-800">Admin Notes</h4>
//                                             <p className="text-sm mt-1">
//                                                 {selectedProperty.adminNotes || 'No admin notes available.'}
//                                             </p>
//                                         </div>

//                                         <div className="mt-4">
//                                             <h4 className="text-md font-semibold text-gray-800">Analytics</h4>
//                                             <div className="mt-2 grid grid-cols-3 gap-2">
//                                                 <div className="bg-blue-50 p-2 rounded-lg text-center">
//                                                     <p className="text-sm text-gray-600">Views</p>
//                                                     <p className="text-xl font-bold text-blue-600">{selectedProperty.total_views || 0}</p>
//                                                 </div>
//                                                 <div className="bg-green-50 p-2 rounded-lg text-center">
//                                                     <p className="text-sm text-gray-600">Inquiries</p>
//                                                     <p className="text-xl font-bold text-green-600">{selectedProperty.inquiries_count || 0}</p>
//                                                 </div>
//                                                 <div className="bg-purple-50 p-2 rounded-lg text-center">
//                                                     <p className="text-sm text-gray-600">Days Listed</p>
//                                                     <p className="text-xl font-bold text-purple-600">
//                                                         {selectedProperty.createdAt
//                                                             ? Math.ceil(
//                                                                 (new Date() - new Date(selectedProperty.createdAt)) /
//                                                                 (1000 * 60 * 60 * 24)
//                                                             )
//                                                             : 0
//                                                         }
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//                             <button
//                                 type="button"
//                                 onClick={() => setIsViewModalOpen(false)}
//                                 className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
//                             >
//                                 Close
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Status Change Modal */}
//             {isStatusModalOpen && (
//                 <div className="fixed inset-0 z-10 overflow-y-auto">
//                     <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//                         <div className="fixed inset-0 transition-opacity" aria-hidden="true">
//                             <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
//                         </div>

//                         <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

//                         <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
//                             <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//                                 <div className="sm:flex sm:items-start">
//                                     <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
//                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                                         </svg>
//                                     </div>
//                                     <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
//                                         <h3 className="text-lg leading-6 font-medium text-gray-900">
//                                             Change Property Status
//                                         </h3>
//                                         <div className="mt-4">
//                                             <label htmlFor="statusSelect" className="block text-sm font-medium text-gray-700">
//                                                 Status
//                                             </label>
//                                             <select
//                                                 id="statusSelect"
//                                                 value={selectedStatus}
//                                                 onChange={(e) => setSelectedStatus(e.target.value)}
//                                                 className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
//                                             >
//                                                 <option value="listed">Listed</option>
//                                                 <option value="unlisted">Unlisted</option>
//                                                 <option value="payment-delay">Payment Delay</option>
//                                                 <option value="suspicious">Suspicious</option>
//                                             </select>
//                                         </div>
//                                         <div className="mt-4">
//                                             <label htmlFor="adminNotes" className="block text-sm font-medium text-gray-700">
//                                                 Admin Notes
//                                             </label>
//                                             <textarea
//                                                 id="adminNotes"
//                                                 rows={3}
//                                                 value={adminNotes}
//                                                 onChange={(e) => setAdminNotes(e.target.value)}
//                                                 placeholder="Add notes about this status change"
//                                                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//                                 <button
//                                     type="button"
//                                     onClick={handleStatusChange}
//                                     className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
//                                 >
//                                     Update Status
//                                 </button>
//                                 <button
//                                     type="button"
//                                     onClick={() => setIsStatusModalOpen(false)}
//                                     className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
//                                 >
//                                     Cancel
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Reassign Property Modal */}
//             {isReassignModalOpen && (
//                 <div className="fixed inset-0 z-10 overflow-y-auto">
//                     <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//                         <div className="fixed inset-0 transition-opacity" aria-hidden="true">
//                             <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
//                         </div>

//                         <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

//                         <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
//                             <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//                                 <div className="sm:flex sm:items-start">
//                                     <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
//                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//                                         </svg>
//                                     </div>
//                                     <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
//                                         <h3 className="text-lg leading-6 font-medium text-gray-900">
//                                             Reassign Property
//                                         </h3>
//                                         <div className="mt-4">
//                                             <label htmlFor="salesmanSelect" className="block text-sm font-medium text-gray-700">
//                                                 Select Salesman
//                                             </label>
//                                             <select
//                                                 id="salesmanSelect"
//                                                 value={selectedSalesmanId}
//                                                 onChange={(e) => setSelectedSalesmanId(e.target.value)}
//                                                 className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
//                                             >
//                                                 <option value="">Select Salesman</option>
//                                                 {salesmen.map((salesman) => (
//                                                     <option key={salesman._id} value={salesman._id}>
//                                                         {salesman.name}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                         </div>
//                                         <div className="mt-4">
//                                             <label htmlFor="reassignReason" className="block text-sm font-medium text-gray-700">
//                                                 Reason for Reassignment
//                                             </label>
//                                             <textarea
//                                                 id="reassignReason"
//                                                 rows={3}
//                                                 value={reassignReason}
//                                                 onChange={(e) => setReassignReason(e.target.value)}
//                                                 placeholder="Provide reason for reassignment"
//                                                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//                                 <button
//                                     type="button"
//                                     onClick={handleReassignProperty}
//                                     disabled={!selectedSalesmanId}
//                                     className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//                                 >
//                                     Reassign
//                                 </button>
//                                 <button
//                                     type="button"
//                                     onClick={() => setIsReassignModalOpen(false)}
//                                     className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
//                                 >
//                                     Cancel
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Delete Confirmation Modal */}
//             {isDeleteModalOpen && (
//                 <div className="fixed inset-0 z-10 overflow-y-auto">
//                     <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//                         <div className="fixed inset-0 transition-opacity" aria-hidden="true">
//                             <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
//                         </div>

//                         <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

//                         <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
//                             <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//                                 <div className="sm:flex sm:items-start">
//                                     <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
//                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//                                         </svg>
//                                     </div>
//                                     <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
//                                         <h3 className="text-lg leading-6 font-medium text-gray-900">
//                                             Delete Property
//                                         </h3>
//                                         <div className="mt-2">
//                                             <p className="text-sm text-gray-500">
//                                                 Are you sure you want to delete this property? This action cannot be undone.
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//                                 <button
//                                     type="button"
//                                     onClick={handleDeleteProperty}
//                                     className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
//                                 >
//                                     Delete
//                                 </button>
//                                 <button
//                                     type="button"
//                                     onClick={() => setIsDeleteModalOpen(false)}
//                                     className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
//                                 >
//                                     Cancel
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Bulk Action Modal */}
//             {isBulkActionModalOpen && (
//                 <div className="fixed inset-0 z-10 overflow-y-auto">
//                     <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//                         <div className="fixed inset-0 transition-opacity" aria-hidden="true">
//                             <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
//                         </div>

//                         <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

//                         <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
//                             <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//                                 <div className="sm:flex sm:items-start">
//                                     <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
//                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
//                                         </svg>
//                                     </div>
//                                     <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
//                                         <h3 className="text-lg leading-6 font-medium text-gray-900">
//                                             Bulk Update Properties
//                                         </h3>
//                                         <div className="mt-2">
//                                             <p className="text-sm text-gray-500">
//                                                 Update status for {selectedProperties.length} selected properties.
//                                             </p>
//                                         </div>
//                                         <div className="mt-4">
//                                             <label htmlFor="bulkStatusSelect" className="block text-sm font-medium text-gray-700">
//                                                 New Status
//                                             </label>
//                                             <select
//                                                 id="bulkStatusSelect"
//                                                 value={selectedStatus}
//                                                 onChange={(e) => setSelectedStatus(e.target.value)}
//                                                 className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
//                                             >
//                                                 <option value="">Select Status</option>
//                                                 <option value="listed">Listed</option>
//                                                 <option value="unlisted">Unlisted</option>
//                                                 <option value="payment-delay">Payment Delay</option>
//                                                 <option value="suspicious">Suspicious</option>
//                                             </select>
//                                         </div>
//                                         <div className="mt-4">
//                                             <label htmlFor="bulkAdminNotes" className="block text-sm font-medium text-gray-700">
//                                                 Admin Notes
//                                             </label>
//                                             <textarea
//                                                 id="bulkAdminNotes"
//                                                 rows={3}
//                                                 value={adminNotes}
//                                                 onChange={(e) => setAdminNotes(e.target.value)}
//                                                 placeholder="Add notes about this bulk update"
//                                                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//                                 <button
//                                     type="button"
//                                     onClick={handleBulkStatusUpdate}
//                                     disabled={!selectedStatus}
//                                     className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//                                 >
//                                     Update All
//                                 </button>
//                                 <button
//                                     type="button"
//                                     onClick={() => setIsBulkActionModalOpen(false)}
//                                     className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
//                                 >
//                                     Cancel
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default PropertyManagementPage;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { base_url } from '../utils/base_url';
import { toast } from 'react-hot-toast';

const API_BASE_URL = `${base_url}/api`;

const PropertyManagementPage = ({ user, onLogout }) => {
    // State for properties data
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // console.log("properties", properties)

    // State for statistics
    const [stats, setStats] = useState({
        total: 0,
        listed: 0,
        unlisted: 0,
        'payment-delay': 0,
        suspicious: 0
    });

    // State for salesmen data (for reassignment)
    const [salesmen, setSalesmen] = useState([]);

    // State for filters and search
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [cityFilter, setCityFilter] = useState('');
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [salesmanFilter, setSalesmanFilter] = useState('');

    // State for sorting
    const [sortField, setSortField] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');

    // State for pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(10);

    // State for modals
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isBulkActionModalOpen, setIsBulkActionModalOpen] = useState(false);
    const [selectedPropertyId, setSelectedPropertyId] = useState(null);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [adminNotes, setAdminNotes] = useState('');
    const [selectedSalesmanId, setSelectedSalesmanId] = useState('');
    const [reassignReason, setReassignReason] = useState('');

    // State for bulk actions
    const [selectedProperties, setSelectedProperties] = useState([]);
    const [bulkAction, setBulkAction] = useState('');
    const [selectAll, setSelectAll] = useState(false);

    // State for duplicate loading
    const [duplicatingPropertyId, setDuplicatingPropertyId] = useState(null);

    const navigate = useNavigate()

    // Fetch properties with filters
    const fetchProperties = async () => {
        try {
            setLoading(true);

            // Build query parameters
            const params = new URLSearchParams();

            // Add pagination parameters
            params.append('page', page);
            params.append('limit', limit);

            // Add sort parameters
            params.append('sortField', sortField);
            params.append('sortOrder', sortOrder);

            // Add filters
            if (statusFilter !== 'all') params.append('status', statusFilter);
            if (typeFilter !== 'all') params.append('type_name', typeFilter);
            if (cityFilter) params.append('city', cityFilter);
            if (priceMin) params.append('priceMin', priceMin);
            if (priceMax) params.append('priceMax', priceMax);
            if (dateFrom) params.append('dateFrom', dateFrom);
            if (dateTo) params.append('dateTo', dateTo);
            if (salesmanFilter) params.append('salesman', salesmanFilter);
            if (searchQuery) params.append('search', searchQuery);

            // Get user token from localStorage
            const details = JSON.parse(localStorage.getItem('user'));

            // Make the API request
            const response = await axios.get(`${API_BASE_URL}/adminSales/property?${params.toString()}`, {
                headers: { Authorization: `Bearer ${details?.token}` }
            });

            console.log("response", response)

            // Update state with response data
            setProperties(response.data.data.properties);
            setStats(response.data.data.stats);
            setTotalPages(response.data.data.pagination.pages);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching properties:', err);
            setError('Failed to load properties. Please try again.');
            setLoading(false);
        }
    };

    // Fetch salesmen for reassignment
    const fetchSalesmen = async () => {
        try {
            const details = JSON.parse(localStorage.getItem('user'));
            const response = await axios.get(`${API_BASE_URL}/salesmen/all`, {
                headers: { Authorization: `Bearer ${details?.token}` }
            });

            setSalesmen(response.data.data.salesmen);
        } catch (err) {
            console.error('Error fetching salesmen:', err);
            setError('Failed to load salesmen data. Please try again.');
        }
    };

    // Fetch property details by ID
    const fetchPropertyDetails = async (propertyId) => {
        try {
            const details = JSON.parse(localStorage.getItem('user'));
            const response = await axios.get(`${API_BASE_URL}/adminSales/properties/${propertyId}`, {
                headers: { Authorization: `Bearer ${details?.token}` }
            });

            setSelectedProperty(response.data.data);
        } catch (err) {
            console.error('Error fetching property details:', err);
            setError('Failed to load property details. Please try again.');
        }
    };

    // Handle property duplication
    const handleDuplicateProperty = async (property) => {
        try {
            setDuplicatingPropertyId(property.post_id);

            const details = JSON.parse(localStorage.getItem('user'));

            // Fetch complete property details using the shared API
            const response = await axios.get(`${API_BASE_URL}/details/${property.post_id}`, {
                headers: { Authorization: `Bearer ${details?.token}` }
            });

            const propertyData = response.data;
            console.log('Fetched property data for duplication:', propertyData);

            // Transform property data to match form structure
            const transformedData = transformPropertyToFormData(propertyData);

            // Generate unique draft ID
            const draftId = `draft_${Date.now()}_duplicate_${property.post_id}`;

            // Add draft metadata
            transformedData.draftId = draftId;
            transformedData.lastUpdated = new Date().toISOString();
            transformedData.isDuplicate = true;
            transformedData.originalPropertyId = property.post_id;

            // Clear specific fields that should be unique for new property
            transformedData.post_id = '';
            transformedData.propertyCode = '';
            transformedData.title = transformedData.title ? `Copy of ${transformedData.title}` : '';

            // Get existing drafts
            const existingDrafts = JSON.parse(localStorage.getItem('propertyDrafts') || '[]');

            // Add new draft
            const updatedDrafts = [...existingDrafts, transformedData];
            localStorage.setItem('propertyDrafts', JSON.stringify(updatedDrafts));

            toast.success('Property duplicated and saved to drafts successfully!');

            // Navigate to drafts page to show the duplicated property
            navigate('/draft');

        } catch (error) {
            console.error('Error duplicating property:', error);
            toast.error(`Failed to duplicate property: ${error.message}`);
        } finally {
            setDuplicatingPropertyId(null);
        }
    };

    // Transform property data from API to form data structure
    const transformPropertyToFormData = (propertyData) => {
        // Helper function to safely extract array from string or array
        const safeParseArray = (value) => {
            if (Array.isArray(value)) return value;
            if (typeof value === 'string') {
                try {
                    return JSON.parse(value);
                } catch {
                    return value.split(',').map(item => item.trim()).filter(Boolean);
                }
            }
            return [];
        };

        // Helper function to convert image URLs to a format that can be displayed
        const processImages = (images) => {
            if (!images || !Array.isArray(images)) return [];
            return images.map((img, index) => ({
                url: typeof img === 'string' ? img : img.url,
                name: `image_${index + 1}.jpg`,
                isFromDuplicate: true
            }));
        };

        return {
            // Basic Details
            propertyType: propertyData.type_name || '',
            propertyCategory: propertyData.category === 1 ? 'Residential' :
                propertyData.category === 2 ? 'Commercial' :
                    propertyData.category === 3 ? 'Industrial' :
                        propertyData.category === 4 ? 'Agricultural' : '',
            bedrooms: propertyData.bedrooms || '',
            bathrooms: propertyData.bathrooms || '',
            balconies: propertyData.balconies || '',
            furnishingStatus: propertyData.furnishStatus || '',
            purpose: propertyData.purpose || 'sale',
            configuration: propertyData.configuration || '',

            // Location Details
            address: propertyData.address || '',
            city: propertyData.city || '',
            locality: propertyData.locality || '',
            pincode: propertyData.pincode || '',
            facingDirection: propertyData.facing || '',
            latitude: propertyData.latitude || '',
            longitude: propertyData.longitude || '',

            // Property Details
            title: propertyData.post_title || '',
            description: propertyData.post_description || '',
            price: propertyData.price || '',
            area: propertyData.area || '',
            areaUnit: propertyData.areaUnit || 'sqft',
            propertyAge: propertyData.propertyAge || '',
            floorNumber: propertyData.floorNumber || propertyData.floor || '',
            totalFloors: propertyData.totalFloors || '',

            // Additional Details
            carpetArea: propertyData.carpetArea || '',
            superBuiltupArea: propertyData.superBuiltupArea || '',
            flooring: propertyData.flooring || '',
            parking: propertyData.parking || '',
            powerBackup: propertyData.powerBackup || '',
            widthOfFacingRoad: propertyData.widthOfFacingRoad || '',
            gatedCommunity: propertyData.gatedCommunity || false,
            petFriendly: propertyData.petFriendly || false,

            // Legal Details
            ownerName: propertyData.ownerName || '',
            propertyOwnership: propertyData.propertyOwnership || '',
            transactionType: propertyData.transactionType || '',
            reraStatus: propertyData.reraStatus || '',
            reraRegistrationNumber: propertyData.reraRegistrationNumber || '',
            reraWebsite: propertyData.reraWebsite || '',
            possessionDate: propertyData.possessionDate ?
                new Date(propertyData.possessionDate).toISOString().split('T')[0] : '',
            construction_status: propertyData.construction_status || '',
            priceOnRequest: propertyData.priceOnRequest || false,

            // Arrays and Complex Data
            amenities: safeParseArray(propertyData.amenities),
            usp: safeParseArray(propertyData.usp),
            tags: safeParseArray(propertyData.tags),
            facilities: safeParseArray(propertyData.facilities),
            location_advantage: safeParseArray(propertyData.location_advantage),
            waterSource: safeParseArray(propertyData.waterSource),
            overlookingAmenities: safeParseArray(propertyData.overlookingAmenities),
            propertyFeatures: safeParseArray(propertyData.propertyFeatures),
            viewTypes: safeParseArray(propertyData.viewTypes),
            propertyConditions: safeParseArray(propertyData.propertyConditions),
            legalStatuses: safeParseArray(propertyData.legalStatuses),
            constructionStatuses: safeParseArray(propertyData.constructionStatuses),
            ownershipTypes: safeParseArray(propertyData.ownershipTypes),
            financingOptions: safeParseArray(propertyData.financingOptions),
            environmentalCertifications: safeParseArray(propertyData.environmentalCertifications),
            propertyManagementServices: safeParseArray(propertyData.propertyManagementServices),
            investmentStrategies: safeParseArray(propertyData.investmentStrategies),
            religiousNearby: safeParseArray(propertyData.religiousNearby),
            inProximity: safeParseArray(propertyData.inProximity),
            vastuCompliance: safeParseArray(propertyData.vastuCompliance),
            loanApprovalStatus: safeParseArray(propertyData.loanApprovalStatus),
            builderReputation: safeParseArray(propertyData.builderReputation),
            legalClearance: safeParseArray(propertyData.legalClearance),
            environmentalFactors: safeParseArray(propertyData.environmentalFactors),
            kitchenType: safeParseArray(propertyData.kitchenType),
            bathroomFeatures: safeParseArray(propertyData.bathroomFeatures),
            specialCategories: safeParseArray(propertyData.specialCategories),
            flooringType: safeParseArray(propertyData.flooringType),
            socialInfrastructure: safeParseArray(propertyData.socialInfrastructure),

            // Contact Information
            contactList: Array.isArray(propertyData.contactList) ? propertyData.contactList : [],

            // Communication Preferences
            whatsappAlerts: propertyData.whatsappAlerts || false,
            whatsappContact: propertyData.whatsappContact || '',
            profoProxyAllowed: propertyData.profoProxyAllowed || false,

            // Maintenance Charges
            maintenanceCharges: propertyData.maintenanceCharges || {
                minPrice: '',
                maxPrice: '',
                priceUnit: '',
                areaUnit: ''
            },

            // Images - Store as URLs with metadata
            postImages: processImages(propertyData.post_images),
            floorPlanImages: processImages(propertyData.floor_plan_images),
            galleryImages: processImages(propertyData.galleryList),

            // Additional fields
            propertyCode: '', // Clear this for new property
            region: propertyData.region || '',
            broker_status: propertyData.broker_status || '',
            agreement: propertyData.agreement || '',
            verified: false, // Reset verification status
            anyConstraint: safeParseArray(propertyData.anyConstraint),
            pricePerSqFt: propertyData.pricePerSqFt || '',
            estimatedEMI: propertyData.estimatedEMI || '',

            // Builder information (if available)
            builderInfo: propertyData.builder ? {
                id: propertyData.builder._id,
                name: propertyData.builder.name,
                contactInfo: propertyData.builder.contactInfo
            } : null,

            // Mark as duplicate for special handling
            isDuplicateProperty: true,
            originalPropertyData: propertyData
        };
    };

    // Fetch data on mount and when filters change
    useEffect(() => {
        fetchProperties();
    }, [
        searchQuery,
        statusFilter,
        typeFilter,
        cityFilter,
        priceMin,
        priceMax,
        dateFrom,
        dateTo,
        salesmanFilter,
        sortField,
        sortOrder,
        page,
        limit
    ]);

    // Fetch salesmen on mount
    useEffect(() => {
        fetchSalesmen();
    }, []);

    // Handle status change
    const handleStatusChange = async () => {
        try {
            const details = JSON.parse(localStorage.getItem('user'));

            await axios.patch(
                `${API_BASE_URL}/adminSales/properties/${selectedPropertyId}/status`,
                { status: selectedStatus, adminNotes },
                { headers: { Authorization: `Bearer ${details?.token}` } }
            );

            setIsStatusModalOpen(false);
            setAdminNotes('');
            fetchProperties();
        } catch (err) {
            console.error('Error updating property status:', err);
            setError('Failed to update property status. Please try again.');
        }
    };

    // Handle property reassignment
    const handleReassignProperty = async () => {
        try {
            const details = JSON.parse(localStorage.getItem('user'));

            await axios.patch(
                `${API_BASE_URL}/adminSales/properties/${selectedPropertyId}/reassign`,
                { salesmanId: selectedSalesmanId, reason: reassignReason },
                { headers: { Authorization: `Bearer ${details?.token}` } }
            );

            setIsReassignModalOpen(false);
            setReassignReason('');
            setSelectedSalesmanId('');
            fetchProperties();
        } catch (err) {
            console.error('Error reassigning property:', err);
            setError('Failed to reassign property. Please try again.');
        }
    };

    // Handle property deletion
    const handleDeleteProperty = async () => {
        try {
            const details = JSON.parse(localStorage.getItem('user'));

            await axios.delete(`${API_BASE_URL}/adminSales/properties/${selectedPropertyId}`, {
                headers: { Authorization: `Bearer ${details?.token}` }
            });

            setIsDeleteModalOpen(false);
            fetchProperties();
        } catch (err) {
            console.error('Error deleting property:', err);
            setError('Failed to delete property. Please try again.');
        }
    };

    // Handle bulk status update
    const handleBulkStatusUpdate = async () => {
        try {
            const details = JSON.parse(localStorage.getItem('user'));

            await axios.post(
                `${API_BASE_URL}/adminSales/properties/bulk-update-status`,
                {
                    propertyIds: selectedProperties,
                    status: selectedStatus,
                    adminNotes
                },
                { headers: { Authorization: `Bearer ${details?.token}` } }
            );

            setIsBulkActionModalOpen(false);
            setSelectedProperties([]);
            setSelectAll(false);
            setAdminNotes('');
            fetchProperties();
        } catch (err) {
            console.error('Error performing bulk update:', err);
            setError('Failed to perform bulk update. Please try again.');
        }
    };

    // Toggle select all properties
    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedProperties([]);
        } else {
            setSelectedProperties(properties.map(property => property.post_id));
        }
        setSelectAll(!selectAll);
    };

    // Toggle select individual property
    const toggleSelectProperty = (propertyId) => {
        if (selectedProperties.includes(propertyId)) {
            setSelectedProperties(selectedProperties.filter(id => id !== propertyId));
        } else {
            setSelectedProperties([...selectedProperties, propertyId]);
        }
    };

    // Handle changing the sort
    const handleSort = (field) => {
        if (field === sortField) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    // Reset all filters
    const resetFilters = () => {
        setSearchQuery('');
        setStatusFilter('all');
        setTypeFilter('all');
        setCityFilter('');
        setPriceMin('');
        setPriceMax('');
        setDateFrom('');
        setDateTo('');
        setSalesmanFilter('');
        setSortField('createdAt');
        setSortOrder('desc');
        setPage(1);
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Format price
    const formatPrice = (price) => {
        if (!price) return 'N/A';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    // Open property details modal
    const openPropertyDetails = (property) => {
        setSelectedProperty(property);
        setSelectedPropertyId(property.post_id);
        setIsViewModalOpen(true);


    };

    // Open status change modal
    const openStatusModal = (property) => {
        setSelectedPropertyId(property.post_id);
        setSelectedStatus(property.status);
        setIsStatusModalOpen(true);
    };

    // Open reassign modal
    const openReassignModal = (property) => {
        setSelectedPropertyId(property.post_id);
        setSelectedSalesmanId('');
        setIsReassignModalOpen(true);
    };

    // Open delete confirmation modal
    const openDeleteModal = (property) => {
        setSelectedPropertyId(property.post_id);
        setIsDeleteModalOpen(true);
    };

    // Handle pagination
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    // Get status badge class
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'listed':
                return 'bg-green-100 text-green-800';
            case 'unlisted':
                return 'bg-gray-100 text-gray-800';
            case 'payment-delay':
                return 'bg-yellow-100 text-yellow-800';
            case 'suspicious':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            {/* <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Property Management</h1>
                    <p className="text-gray-600">Manage and monitor all properties</p>
                </div>

                <div className="flex space-x-4">
                    <button
                        onClick={() => window.history.back()}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Back
                    </button>
                </div>
            </div> */}

            {/* Error message */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700">
                    <p>{error}</p>
                    <button
                        onClick={() => setError('')}
                        className="ml-2 text-sm text-red-500 hover:underline"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-500">Total Properties</p>
                            <p className="text-2xl font-bold">{stats.total}</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div
                    className="bg-white rounded-lg shadow p-4 cursor-pointer hover:bg-green-50"
                    onClick={() => setStatusFilter('listed')}
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-500">Listed Properties</p>
                            <p className="text-2xl font-bold">{stats.listed}</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div
                    className="bg-white rounded-lg shadow p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => setStatusFilter('unlisted')}
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-500">Unlisted Properties</p>
                            <p className="text-2xl font-bold">{stats.unlisted}</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div
                    className="bg-white rounded-lg shadow p-4 cursor-pointer hover:bg-yellow-50"
                    onClick={() => setStatusFilter('payment-delay')}
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-500">Payment Delay</p>
                            <p className="text-2xl font-bold">{stats['payment-delay']}</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div
                    className="bg-white rounded-lg shadow p-4 cursor-pointer hover:bg-red-50"
                    onClick={() => setStatusFilter('suspicious')}
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-500">Suspicious</p>
                            <p className="text-2xl font-bold">{stats.suspicious}</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white rounded-lg shadow mb-8">
                <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
                        <h2 className="text-xl font-semibold">Property Filters</h2>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search properties..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* Status Filter */}
                        <div>
                            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                id="statusFilter"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">All Statuses</option>
                                <option value="listed">Listed</option>
                                <option value="unlisted">Unlisted</option>
                                <option value="payment-delay">Payment Delay</option>
                                <option value="suspicious">Suspicious</option>
                            </select>
                        </div>

                        {/* Property Type Filter */}
                        <div>
                            <label htmlFor="typeFilter" className="block text-sm font-medium text-gray-700 mb-1">
                                Property Type
                            </label>
                            <select
                                id="typeFilter"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">All Types</option>
                                <option value="Apartment">Apartment</option>
                                <option value="Villa">Villa</option>
                                <option value="House">House</option>
                                <option value="Plot">Plot</option>
                                <option value="Commercial">Commercial</option>
                            </select>
                        </div>

                        {/* City Filter */}
                        <div>
                            <label htmlFor="cityFilter" className="block text-sm font-medium text-gray-700 mb-1">
                                City
                            </label>
                            <input
                                type="text"
                                id="cityFilter"
                                placeholder="Filter by city"
                                value={cityFilter}
                                onChange={(e) => setCityFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        {/* Price Range */}
                        <div>
                            <label htmlFor="priceMin" className="block text-sm font-medium text-gray-700 mb-1">
                                Price Minimum
                            </label>
                            <input
                                type="number"
                                id="priceMin"
                                placeholder="Min Price"
                                value={priceMin}
                                onChange={(e) => setPriceMin(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="priceMax" className="block text-sm font-medium text-gray-700 mb-1">
                                Price Maximum
                            </label>
                            <input
                                type="number"
                                id="priceMax"
                                placeholder="Max Price"
                                value={priceMax}
                                onChange={(e) => setPriceMax(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Date Range */}
                        <div>
                            <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 mb-1">
                                From Date
                            </label>
                            <input
                                type="date"
                                id="dateFrom"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 mb-1">
                                To Date
                            </label>
                            <input
                                type="date"
                                id="dateTo"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Salesman Filter */}
                        <div>
                            <label htmlFor="salesmanFilter" className="block text-sm font-medium text-gray-700 mb-1">
                                Salesman
                            </label>
                            <select
                                id="salesmanFilter"
                                value={salesmanFilter}
                                onChange={(e) => setSalesmanFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Salesmen</option>
                                {salesmen.map((salesman) => (
                                    <option key={salesman._id} value={salesman._id}>
                                        {salesman.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sort Filter */}
                        <div>
                            <label htmlFor="sortFilter" className="block text-sm font-medium text-gray-700 mb-1">
                                Sort By
                            </label>
                            <div className="flex space-x-2">
                                <select
                                    id="sortFilter"
                                    value={sortField}
                                    onChange={(e) => setSortField(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="createdAt">Date Added</option>
                                    <option value="price">Price</option>
                                    <option value="post_title">Title</option>
                                    <option value="city">City</option>
                                    <option value="total_views">Views</option>
                                </select>
                                <button
                                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {sortOrder === 'asc' ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Filter Actions */}
                    <div className="flex justify-between mt-6">
                        <button
                            onClick={resetFilters}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            Reset Filters
                        </button>
                        <div className="flex space-x-2">
                            <button
                                onClick={fetchProperties}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bulk Actions */}
            <div className="bg-white rounded-lg shadow p-4 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="selectAll"
                            checked={selectAll}
                            onChange={toggleSelectAll}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="selectAll" className="text-sm font-medium text-gray-700">
                            Select All
                        </label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                            {selectedProperties.length} properties selected
                        </span>
                        <select
                            value={bulkAction}
                            onChange={(e) => setBulkAction(e.target.value)}
                            disabled={selectedProperties.length === 0}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Bulk Actions</option>
                            <option value="status">Change Status</option>
                            <option value="reassign">Reassign Properties</option>
                            <option value="delete">Delete Properties</option>
                        </select>
                        <button
                            onClick={() => {
                                if (bulkAction === 'status') {
                                    setIsBulkActionModalOpen(true);
                                }
                                // Add other bulk actions as needed
                            }}
                            disabled={!bulkAction || selectedProperties.length === 0}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            </div>

            {/* Properties Table */}
            <div className="bg-white rounded-lg shadow mb-8 overflow-hidden">
                {loading ? (
                    <div className="p-8 flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : properties.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-gray-500 text-lg">No properties found matching your filters.</p>
                        <button
                            onClick={resetFilters}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <input
                                            type="checkbox"
                                            checked={selectAll}
                                            onChange={toggleSelectAll}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                    </th>
                                    {/* <th
                                        scope="col"
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort('post_id')}
                                    >
                                        ID
                                        {sortField === 'post_id' && (
                                            <span className="ml-1">
                                                {sortOrder === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </th> */}
                                    <th
                                        scope="col"
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort('post_title')}
                                    >
                                        Property
                                        {sortField === 'post_title' && (
                                            <span className="ml-1">
                                                {sortOrder === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    // onClick={() => handleSort('post_title')}
                                    >
                                        Salesman
                                        {/* {sortField === 'post_title' && (
                                            <span className="ml-1">
                                                {sortOrder === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )} */}
                                    </th>

                                    <th
                                        scope="col"
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort('type_name')}
                                    >
                                        Type
                                        {sortField === 'type_name' && (
                                            <span className="ml-1">
                                                {sortOrder === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort('city')}
                                    >
                                        Location
                                        {sortField === 'city' && (
                                            <span className="ml-1">
                                                {sortOrder === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort('price')}
                                    >
                                        Price
                                        {sortField === 'price' && (
                                            <span className="ml-1">
                                                {sortOrder === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort('status')}
                                    >
                                        Status
                                        {sortField === 'status' && (
                                            <span className="ml-1">
                                                {sortOrder === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort('createdAt')}
                                    >
                                        Date Added
                                        {sortField === 'createdAt' && (
                                            <span className="ml-1">
                                                {sortOrder === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {properties.map((property) => (
                                    <tr key={property.post_id} className="hover:bg-gray-50">
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                checked={selectedProperties.includes(property.post_id)}
                                                onChange={() => toggleSelectProperty(property.post_id)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                        </td>
                                        {/* <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {property.post_id}
                                        </td> */}
                                        <td className="px-4 py-4 ">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    <img
                                                        className="h-10 w-10 rounded-md object-cover"
                                                        src={
                                                            property.post_images?.[0]?.url || property?.post_image ||
                                                            'https://via.placeholder.com/150'
                                                        }
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {property.post_title || 'Untitled Property'}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {property.total_views || 0} views
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div>{property?.salesman?.name || 'N/A'}</div>
                                            <div>{property?.salesman?.email || 'N/A'}</div>
                                            <div>{property?.salesman?.phone || 'N/A'}</div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {property.type_name || 'N/A'}
                                        </td>

                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {property.city || 'N/A'}
                                            {property.state && `, ${property.state}`}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatPrice(property.price)}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                                                    property.status
                                                )}`}
                                            >
                                                {property.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(property.createdAt)}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex flex-wrap gap-1">
                                                <button
                                                    onClick={() => navigate(`/property-edit/${property?.post_id}`)}
                                                    className="text-green-600 hover:text-green-900 text-xs"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/salesman/profile/${property.salesman._id}`, { state: { salesman: property.salesman } })}
                                                    className="text-red-600 hover:text-red-900 text-xs"
                                                >
                                                    Profile
                                                </button>
                                                <button
                                                    onClick={() => openPropertyDetails(property)}
                                                    className="text-blue-600 hover:text-blue-900 text-xs"
                                                >
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => window.location.href = `${import.meta.env.VITE_REDIRECT_URL || 'http://localhost:5173'}/api/details/${property?.post_id}`}
                                                    className="text-purple-600 hover:text-purple-900 text-xs"
                                                >
                                                    View on Web
                                                </button>
                                                <button
                                                    onClick={() => openStatusModal(property)}
                                                    className="text-yellow-600 hover:text-yellow-900 text-xs"
                                                >
                                                    Status
                                                </button>
                                                <button
                                                    onClick={() => openReassignModal(property)}
                                                    className="text-green-600 hover:text-green-900 text-xs"
                                                >
                                                    Reassign
                                                </button>
                                                <button
                                                    onClick={() => handleDuplicateProperty(property)}
                                                    disabled={duplicatingPropertyId === property.post_id}
                                                    className="text-indigo-600 hover:text-indigo-900 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {duplicatingPropertyId === property.post_id ? (
                                                        <div className="flex items-center">
                                                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-indigo-600 mr-1"></div>
                                                            Duplicating...
                                                        </div>
                                                    ) : (
                                                        'Duplicate'
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(property)}
                                                    className="text-red-600 hover:text-red-900 text-xs"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {!loading && properties.length > 0 && (
                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow">
                    <div className="flex flex-1 justify-between sm:hidden">
                        <button
                            onClick={() => handlePageChange(page > 1 ? page - 1 : 1)}
                            disabled={page === 1}
                            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
                            disabled={page === totalPages}
                            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
                                <span className="font-medium">
                                    {Math.min(page * limit, properties.length + (page - 1) * limit)}
                                </span>{' '}
                                of <span className="font-medium">{stats.total}</span> results
                            </p>
                        </div>
                        <div>
                            <div className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                                <button
                                    onClick={() => handlePageChange(1)}
                                    disabled={page === 1}
                                    className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="sr-only">First</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => handlePageChange(page > 1 ? page - 1 : 1)}
                                    disabled={page === 1}
                                    className="relative inline-flex items-center border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="sr-only">Previous</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>

                                {/* Page Numbers */}
                                {[...Array(totalPages > 5 ? 5 : totalPages)].map((_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (page <= 3) {
                                        pageNum = i + 1;
                                    } else if (page >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = page - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`relative inline-flex items-center border border-gray-300 px-4 py-2 text-sm font-medium ${page === pageNum
                                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                : 'bg-white text-gray-500 hover:bg-gray-50'
                                                } focus:z-20`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
                                    disabled={page === totalPages}
                                    className="relative inline-flex items-center border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="sr-only">Next</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => handlePageChange(totalPages)}
                                    disabled={page === totalPages}
                                    className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="sr-only">Last</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* View Property Modal */}
            {isViewModalOpen && selectedProperty && (
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                            Property Details
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <img
                                                    src={selectedProperty.post_images?.[0]?.url || 'https://via.placeholder.com/600x400'}
                                                    alt={selectedProperty.post_title}
                                                    className="w-full h-64 object-cover rounded-lg shadow"
                                                />

                                                <div className="mt-4">
                                                    <h4 className="text-md font-semibold text-gray-800">Basic Information</h4>
                                                    <div className="mt-2 grid grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="text-sm text-gray-500">ID</p>
                                                            <p className="text-sm font-medium">{selectedProperty.post_id}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Type</p>
                                                            <p className="text-sm font-medium">{selectedProperty.type_name || 'N/A'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Status</p>
                                                            <p className="text-sm font-medium">
                                                                <span
                                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                                                                        selectedProperty.status
                                                                    )}`}
                                                                >
                                                                    {selectedProperty.status}
                                                                </span>
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Date Added</p>
                                                            <p className="text-sm font-medium">{formatDate(selectedProperty.createdAt)}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-4">
                                                    <h4 className="text-md font-semibold text-gray-800">Contact Information</h4>
                                                    <div className="mt-2 grid grid-cols-1 gap-2">
                                                        <div>
                                                            <p className="text-sm text-gray-500">Owner</p>
                                                            <p className="text-sm font-medium">{selectedProperty.owner_name || 'N/A'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Phone</p>
                                                            <p className="text-sm font-medium">{selectedProperty.owner_phone || 'N/A'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Email</p>
                                                            <p className="text-sm font-medium">{selectedProperty.owner_email || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-xl font-semibold text-gray-800">{selectedProperty.post_title}</h4>
                                                <p className="text-lg font-bold text-blue-600 mt-1">{formatPrice(selectedProperty.price)}</p>

                                                <div className="mt-2">
                                                    <p className="text-gray-700">{selectedProperty.description || 'No description available.'}</p>
                                                </div>

                                                <div className="mt-4">
                                                    <h4 className="text-md font-semibold text-gray-800">Location</h4>
                                                    <div className="flex items-center mt-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                        </svg>
                                                        <p className="ml-2 text-gray-700">
                                                            {selectedProperty.address || 'N/A'}
                                                            {selectedProperty.city && `, ${selectedProperty.city}`}
                                                            {selectedProperty.state && `, ${selectedProperty.state}`}
                                                            {selectedProperty.zipcode && ` - ${selectedProperty.zipcode}`}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mt-4">
                                                    <h4 className="text-md font-semibold text-gray-800">Property Details</h4>
                                                    <div className="mt-2 grid grid-cols-2 gap-2">
                                                        <div>
                                                            <p className="text-sm text-gray-500">Area</p>
                                                            <p className="text-sm font-medium">
                                                                {selectedProperty.area
                                                                    ? `${selectedProperty.area} sq ft`
                                                                    : 'N/A'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Bedrooms</p>
                                                            <p className="text-sm font-medium">{selectedProperty.bedrooms || 'N/A'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Bathrooms</p>
                                                            <p className="text-sm font-medium">{selectedProperty.bathrooms || 'N/A'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Parking</p>
                                                            <p className="text-sm font-medium">{selectedProperty.parking_spaces || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-4">
                                                    <h4 className="text-md font-semibold text-gray-800">Salesman Information</h4>
                                                    <div className="mt-2 grid grid-cols-1 gap-2">
                                                        <div>
                                                            <p className="text-sm text-gray-500">Assigned To</p>
                                                            <p className="text-sm font-medium">{selectedProperty.salesman?.name || 'Unassigned'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Contact</p>
                                                            <p className="text-sm font-medium">{selectedProperty.salesman?.phone || selectedProperty.salesman?.contact || 'N/A'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Email</p>
                                                            <p className="text-sm font-medium">{selectedProperty.salesman?.email || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <h4 className="text-md font-semibold text-gray-800">Admin Notes</h4>
                                            <p className="text-sm mt-1">
                                                {selectedProperty.adminNotes || 'No admin notes available.'}
                                            </p>
                                        </div>

                                        <div className="mt-4">
                                            <h4 className="text-md font-semibold text-gray-800">Analytics</h4>
                                            <div className="mt-2 grid grid-cols-3 gap-2">
                                                <div className="bg-blue-50 p-2 rounded-lg text-center">
                                                    <p className="text-sm text-gray-600">Views</p>
                                                    <p className="text-xl font-bold text-blue-600">{selectedProperty.total_views || 0}</p>
                                                </div>
                                                <div className="bg-green-50 p-2 rounded-lg text-center">
                                                    <p className="text-sm text-gray-600">Inquiries</p>
                                                    <p className="text-xl font-bold text-green-600">{selectedProperty.inquiries_count || 0}</p>
                                                </div>
                                                <div className="bg-purple-50 p-2 rounded-lg text-center">
                                                    <p className="text-sm text-gray-600">Days Listed</p>
                                                    <p className="text-xl font-bold text-purple-600">
                                                        {selectedProperty.createdAt
                                                            ? Math.ceil(
                                                                (new Date() - new Date(selectedProperty.createdAt)) /
                                                                (1000 * 60 * 60 * 24)
                                                            )
                                                            : 0
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                                type="button"
                                onClick={() => setIsViewModalOpen(false)}
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Status Change Modal */}
            {isStatusModalOpen && (
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            Change Property Status
                                        </h3>
                                        <div className="mt-4">
                                            <label htmlFor="statusSelect" className="block text-sm font-medium text-gray-700">
                                                Status
                                            </label>
                                            <select
                                                id="statusSelect"
                                                value={selectedStatus}
                                                onChange={(e) => setSelectedStatus(e.target.value)}
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                            >
                                                <option value="listed">Listed</option>
                                                <option value="unlisted">Unlisted</option>
                                                <option value="payment-delay">Payment Delay</option>
                                                <option value="suspicious">Suspicious</option>
                                            </select>
                                        </div>
                                        <div className="mt-4">
                                            <label htmlFor="adminNotes" className="block text-sm font-medium text-gray-700">
                                                Admin Notes
                                            </label>
                                            <textarea
                                                id="adminNotes"
                                                rows={3}
                                                value={adminNotes}
                                                onChange={(e) => setAdminNotes(e.target.value)}
                                                placeholder="Add notes about this status change"
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={handleStatusChange}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Update Status
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsStatusModalOpen(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Reassign Property Modal */}
            {isReassignModalOpen && (
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            Reassign Property
                                        </h3>
                                        <div className="mt-4">
                                            <label htmlFor="salesmanSelect" className="block text-sm font-medium text-gray-700">
                                                Select Salesman
                                            </label>
                                            <select
                                                id="salesmanSelect"
                                                value={selectedSalesmanId}
                                                onChange={(e) => setSelectedSalesmanId(e.target.value)}
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                            >
                                                <option value="">Select Salesman</option>
                                                {salesmen.map((salesman) => (
                                                    <option key={salesman._id} value={salesman._id}>
                                                        {salesman.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mt-4">
                                            <label htmlFor="reassignReason" className="block text-sm font-medium text-gray-700">
                                                Reason for Reassignment
                                            </label>
                                            <textarea
                                                id="reassignReason"
                                                rows={3}
                                                value={reassignReason}
                                                onChange={(e) => setReassignReason(e.target.value)}
                                                placeholder="Provide reason for reassignment"
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={handleReassignProperty}
                                    disabled={!selectedSalesmanId}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Reassign
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsReassignModalOpen(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            Delete Property
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Are you sure you want to delete this property? This action cannot be undone.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={handleDeleteProperty}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Delete
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk Action Modal */}
            {isBulkActionModalOpen && (
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            Bulk Update Properties
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Update status for {selectedProperties.length} selected properties.
                                            </p>
                                        </div>
                                        <div className="mt-4">
                                            <label htmlFor="bulkStatusSelect" className="block text-sm font-medium text-gray-700">
                                                New Status
                                            </label>
                                            <select
                                                id="bulkStatusSelect"
                                                value={selectedStatus}
                                                onChange={(e) => setSelectedStatus(e.target.value)}
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                            >
                                                <option value="">Select Status</option>
                                                <option value="listed">Listed</option>
                                                <option value="unlisted">Unlisted</option>
                                                <option value="payment-delay">Payment Delay</option>
                                                <option value="suspicious">Suspicious</option>
                                            </select>
                                        </div>
                                        <div className="mt-4">
                                            <label htmlFor="bulkAdminNotes" className="block text-sm font-medium text-gray-700">
                                                Admin Notes
                                            </label>
                                            <textarea
                                                id="bulkAdminNotes"
                                                rows={3}
                                                value={adminNotes}
                                                onChange={(e) => setAdminNotes(e.target.value)}
                                                placeholder="Add notes about this bulk update"
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={handleBulkStatusUpdate}
                                    disabled={!selectedStatus}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Update All
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsBulkActionModalOpen(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropertyManagementPage;