import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
    fetchProperties,
    fetchStats,
    deleteProperty,
    setSearchQuery,
    setFilterType,
    setFilterStatus,
    setSortBy,
    setPage,
    setRowsPerPage,
    setSelectedPropertyId,
    reset
} from '../redux/features/properties/propertiesSlice';
import { logout } from '../redux/features/auth/authSlice';

const DashboardPage = () => {
    // Get state from Redux
    const {
        properties,
        stats,
        filters,
        selectedPropertyId,
        isLoading,
        isError,
        message
    } = useSelector((state) => state.properties);

    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Local state
    const [activeMenu, setActiveMenu] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch properties and stats on component mount
    useEffect(() => {
        dispatch(fetchProperties());
        dispatch(fetchStats());

        // Cleanup on unmount
        return () => {
            dispatch(reset());
        };
    }, [dispatch, filters]);

    // Update error state when Redux state changes
    useEffect(() => {
        if (isError) {
            setError(message);
        } else {
            setError('');
        }
    }, [isError, message]);

    // Handle pagination change
    const handleChangePage = (newPage) => {
        dispatch(setPage(newPage));
    };

    const handleChangeRowsPerPage = (event) => {
        dispatch(setRowsPerPage(parseInt(event.target.value, 10)));
    };

    // Handle row actions menu
    const handleMenuToggle = (propertyId) => {
        if (activeMenu === propertyId) {
            setActiveMenu(null);
        } else {
            setActiveMenu(propertyId);
            dispatch(setSelectedPropertyId(propertyId));
        }
    };

    // Handle property edit
    const handleEditProperty = () => {
        // alert(`Edit property ${selectedPropertyId}`);
        navigate(`/property-edit/${selectedPropertyId}`)
        setActiveMenu(null);
    };

    // Handle property view
    const handleViewProperty = () => {
        alert(`View property ${selectedPropertyId}`);
        setActiveMenu(null);
    };

    // Handle property delete confirmation
    const handleDeleteConfirm = () => {
        setDeleteDialogOpen(true);
        setActiveMenu(null);
    };

    // Handle property delete
    const handleDeleteProperty = async () => {
        try {
            setDeleteLoading(true);
            await dispatch(deleteProperty(selectedPropertyId)).unwrap();
            setDeleteLoading(false);
            setDeleteDialogOpen(false);
        } catch (err) {
            console.error('Error deleting property:', err);
            setDeleteLoading(false);
            setDeleteDialogOpen(false);
            alert('Failed to delete property. Please try again.');
        }
    };

    // Handle logout
    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    // Apply filters and search to properties
    const getFilteredProperties = () => {
        return properties
            .filter(property => {
                // Filter by search query
                if (filters.searchQuery) {
                    const query = filters.searchQuery.toLowerCase();
                    return (
                        property.post_title?.toLowerCase().includes(query) ||
                        property.post_id?.toLowerCase().includes(query) ||
                        property.address?.toLowerCase().includes(query) ||
                        property.city?.toLowerCase().includes(query) ||
                        property.locality?.toLowerCase().includes(query)
                    );
                }
                return true;
            })
            .filter(property => {
                // Filter by property type
                if (filters.filterType !== 'all') {
                    return property.type_name === filters.filterType;
                }
                return true;
            })
            .filter(property => {
                // Filter by status
                if (filters.filterStatus !== 'all') {
                    return property.status === filters.filterStatus;
                }
                return true;
            })
            .sort((a, b) => {
                // Sort by selected criteria
                switch (filters.sortBy) {
                    case 'date_asc':
                        return new Date(a.createdAt) - new Date(b.createdAt);
                    case 'date_desc':
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    case 'price_asc':
                        return a.price - b.price;
                    case 'price_desc':
                        return b.price - a.price;
                    case 'views_desc':
                        return b.total_views - a.total_views;
                    default:
                        return new Date(b.createdAt) - new Date(a.createdAt);
                }
            });
    };

    // Format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Format price
    const formatPrice = (price) => {
        if (price >= 10000000) {
            return `₹${(price / 10000000).toFixed(2)} Cr`;
        } else if (price >= 100000) {
            return `₹${(price / 100000).toFixed(2)} Lac`;
        } else {
            return `₹${price.toLocaleString()}`;
        }
    };

    // Get status badge classes
    const getStatusClasses = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'draft':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Get status label
    const getStatusLabel = (status) => {
        switch (status) {
            case 'approved':
                return 'Approved';
            case 'pending':
                return 'Pending Approval';
            case 'rejected':
                return 'Rejected';
            case 'draft':
                return 'Draft';
            default:
                return status;
        }
    };

    // Calculate growth percentage
    const calculateGrowth = (current, previous) => {
        if (previous === 0) return 100;
        return ((current - previous) / previous) * 100;
    };

    const filteredProperties = getFilteredProperties();
    const paginatedProperties = filteredProperties.slice(
        filters.page * filters.rowsPerPage,
        filters.page * filters.rowsPerPage + filters.rowsPerPage
    );

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            {/* <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Properties Dashboard</h1>
                    <p className="text-gray-600">Welcome back, {user?.name || 'User'}!</p>
                </div>

                <div className="flex space-x-4">
                    <Link
                        to="/onboarding"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add New Property
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Logout
                    </button>
                </div>
            </div> */}

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700">
                    <p>{error}</p>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Views Card */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Total Property Views</p>
                            <h2 className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</h2>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center">
                        {calculateGrowth(stats.thisMonth, stats.lastMonth) > 0 ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                                </svg>
                                +{calculateGrowth(stats.thisMonth, stats.lastMonth).toFixed(1)}%
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M12 13a1 1 0 110 2H7a1 1 0 01-1-1V9a1 1 0 112 0v2.586l4.293-4.293a1 1 0 011.414 1.414L9.414 13H12z" clipRule="evenodd" />
                                </svg>
                                {calculateGrowth(stats.thisMonth, stats.lastMonth).toFixed(1)}%
                            </span>
                        )}
                        <span className="ml-2 text-sm text-gray-500">vs last month</span>
                    </div>
                </div>

                {/* Total Properties Card */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Total Properties</p>
                            <h2 className="text-2xl font-bold">{stats.totalProperties}</h2>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            +{stats.thisMonth} this month
                        </span>
                        <span className="ml-2 text-sm text-gray-500">vs {stats.lastMonth} last month</span>
                    </div>
                </div>

                {/* Pending Approval Card */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Pending Approval</p>
                            <h2 className="text-2xl font-bold">{stats.pendingApproval}</h2>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-yellow-500 h-2 rounded-full"
                                style={{ width: `${(stats.pendingApproval / stats.totalProperties) * 100}%` }}
                            ></div>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                            {Math.round((stats.pendingApproval / stats.totalProperties) * 100) || 0}% of total
                        </p>
                    </div>
                </div>

                {/* Approved Properties Card */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Approved Properties</p>
                            <h2 className="text-2xl font-bold">{stats.approved}</h2>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${(stats.approved / stats.totalProperties) * 100}%` }}
                            ></div>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                            {Math.round((stats.approved / stats.totalProperties) * 100) || 0}% of total
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white rounded-lg shadow mb-8">
                <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
                        <h2 className="text-xl font-semibold">Property Listings</h2>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search properties..."
                                value={filters.searchQuery}
                                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                                className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Property Type Filter */}
                        <div>
                            <label htmlFor="filterType" className="block text-sm font-medium text-gray-700 mb-1">
                                Property Type
                            </label>
                            <select
                                id="filterType"
                                value={filters.filterType}
                                onChange={(e) => dispatch(setFilterType(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">All Types</option>
                                <option value="Apartment">Apartment</option>
                                <option value="House">House</option>
                                <option value="Shops">Shops</option>
                                <option value="Warehouses">Warehouses</option>
                                <option value="Halls">Halls</option>
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label htmlFor="filterStatus" className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                id="filterStatus"
                                value={filters.filterStatus}
                                onChange={(e) => dispatch(setFilterStatus(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">All Statuses</option>
                                <option value="approved">Approved</option>
                                <option value="pending">Pending</option>
                                <option value="rejected">Rejected</option>
                                <option value="draft">Draft</option>
                            </select>
                        </div>

                        {/* Sort By */}
                        <div>
                            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                                Sort By
                            </label>
                            <select
                                id="sortBy"
                                value={filters.sortBy}
                                onChange={(e) => dispatch(setSortBy(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="date_desc">Newest First</option>
                                <option value="date_asc">Oldest First</option>
                                <option value="price_desc">Price (High to Low)</option>
                                <option value="price_asc">Price (Low to High)</option>
                                <option value="views_desc">Most Viewed</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Properties Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {isLoading ? (
                    <div className="p-8 flex justify-center items-center">
                        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 border-t-blue-500 animate-spin"></div>
                    </div>
                ) : filteredProperties.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-gray-500">No properties found matching your criteria.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Property
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Location
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Views
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date Added
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedProperties.map((property) => (
                                    <tr key={property.post_id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden">
                                                    <img className="h-10 w-10 object-cover" src={property.post_images?.[0]?.url} alt={property.post_title} />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{property.post_title}</div>
                                                    <div className="text-sm text-gray-500">{property.post_id}</div>
                                                    <div className="text-xs text-gray-500">
                                                        {property.area} sq.ft • {property.bedrooms} BHK • {property.bathrooms} Bath
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <div>
                                                    <div className="text-sm text-gray-900">{property.locality}</div>
                                                    <div className="text-xs text-gray-500">{property.city}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {formatPrice(property.price)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(property.status)}`}>
                                                {getStatusLabel(property.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                {property.total_views}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(property.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="relative">
                                                <button
                                                    onClick={() => handleMenuToggle(property.post_id)}
                                                    className="text-gray-400 hover:text-gray-700 focus:outline-none"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                    </svg>
                                                </button>

                                                {activeMenu === property.post_id && (
                                                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                                        <div className="py-1" role="menu" aria-orientation="vertical">
                                                            <button
                                                                onClick={handleViewProperty}
                                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                                role="menuitem"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                </svg>
                                                                View Details
                                                            </button>
                                                            <button
                                                                onClick={handleEditProperty}
                                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                                role="menuitem"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                                Edit Property
                                                            </button>
                                                            <button
                                                                onClick={handleDeleteConfirm}
                                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                                                                role="menuitem"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            onClick={() => handleChangePage(filters.page - 1)}
                            disabled={filters.page === 0}
                            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${filters.page === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => handleChangePage(filters.page + 1)}
                            disabled={filters.page >= Math.ceil(filteredProperties.length / filters.rowsPerPage) - 1}
                            className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${filters.page >= Math.ceil(filteredProperties.length / filters.rowsPerPage) - 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{filters.page * filters.rowsPerPage + 1}</span> to{' '}
                                <span className="font-medium">
                                    {Math.min((filters.page + 1) * filters.rowsPerPage, filteredProperties.length)}
                                </span>{' '}
                                of <span className="font-medium">{filteredProperties.length}</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => handleChangePage(filters.page - 1)}
                                    disabled={filters.page === 0}
                                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${filters.page === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                                        }`}
                                >
                                    <span className="sr-only">Previous</span>
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>

                                {/* Page numbers */}
                                {[...Array(Math.min(5, Math.ceil(filteredProperties.length / filters.rowsPerPage))).keys()].map((i) => {
                                    const pageNumber = i;
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => handleChangePage(pageNumber)}
                                            className={`relative inline-flex items-center px-4 py-2 border ${filters.page === pageNumber
                                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                } text-sm font-medium`}
                                        >
                                            {pageNumber + 1}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => handleChangePage(filters.page + 1)}
                                    disabled={filters.page >= Math.ceil(filteredProperties.length / filters.rowsPerPage) - 1}
                                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${filters.page >= Math.ceil(filteredProperties.length / filters.rowsPerPage) - 1
                                        ? 'text-gray-300 cursor-not-allowed'
                                        : 'text-gray-500 hover:bg-gray-50'
                                        }`}
                                >
                                    <span className="sr-only">Next</span>
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            {deleteDialogOpen && (
                <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
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
                                    disabled={deleteLoading}
                                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm ${deleteLoading ? 'opacity-75 cursor-not-allowed' : ''
                                        }`}
                                >
                                    {deleteLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        'Delete'
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDeleteDialogOpen(false)}
                                    disabled={deleteLoading}
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

export default DashboardPage;

