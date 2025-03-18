import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const SalesmanProfile = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const salesman = location.state?.salesman || {
        name: "Deadpool Sales",
        email: "deadpool278@gmail.com",
        phone: "07878756560",
        username: "deadpool4204",
        role: "salesman",
        status: "active",
        joinDate: "2025-03-17T10:21:34.699Z",
        assignedAreas: [
            {
                city: "Kanpur",
                localities: ["rawatpur"]
            }
        ],
        performanceMetrics: {
            propertiesUploaded: 1,
            activeListings: 1,
            totalSales: 0,
            revenue: 0
        },
        activityLog: [
            {
                action: "ACCOUNT_CREATED",
                timestamp: "2025-03-17T10:21:34.703Z"
            },
            {
                action: "PROPERTY_UPLOAD",
                details: {
                    propertyId: "67d7f7d2d0d956cfbb1cba8c"
                },
                timestamp: "2025-03-17T10:22:10.820Z"
            }
        ],
        properties: ["67d7f7d2d0d956cfbb1cba8c"]
    };

    console.log("salesman", salesman)


    const [activeTab, setActiveTab] = useState("overview");

    // Format date to readable format
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Format timestamp to readable format with time
    const formatTimestamp = (timestamp) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(timestamp).toLocaleString(undefined, options);
    };

    // Get user initials for avatar
    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase();
    };

    // Handle tab change
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    // Get appropriate badge color based on status
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'inactive':
                return 'bg-red-100 text-red-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Get action icon for activity log
    const getActionIcon = (action) => {
        switch (action) {
            case 'ACCOUNT_CREATED':
                return (
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                    </div>
                );
            case 'PROPERTY_UPLOAD':
                return (
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                    </div>
                );
            default:
                return (
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                );
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-600 hover:text-gray-900"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">Salesman Profile</h1>
                    <div className="flex space-x-2">
                        <button className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            Edit
                        </button>
                        <button className="px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            More
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="p-6 border-b border-gray-200 flex flex-col items-center">
                                <div className="h-24 w-24 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold mb-4">
                                    {getInitials(salesman.name)}
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900">{salesman.name}</h2>
                                <span className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(salesman.status)}`}>
                                    {salesman.status.charAt(0).toUpperCase() + salesman.status.slice(1)}
                                </span>
                                <p className="mt-1 text-sm text-gray-500">{salesman.role.charAt(0).toUpperCase() + salesman.role.slice(1)}</p>
                            </div>
                            <div className="p-6">
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Contact Information</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Email</p>
                                            <p className="text-sm text-gray-500 break-all">{salesman.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                        </svg>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Phone</p>
                                            <p className="text-sm text-gray-500">{salesman.phone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Username</p>
                                            <p className="text-sm text-gray-500">{salesman.username}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                        </svg>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Join Date</p>
                                            <p className="text-sm text-gray-500">{formatDate(salesman.joinDate)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-t border-gray-200">
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Assigned Areas</h3>
                                {salesman.assignedAreas && salesman.assignedAreas.length > 0 ? (
                                    <div className="space-y-3">
                                        {salesman.assignedAreas.map((area, index) => (
                                            <div key={index} className="bg-blue-50 rounded-lg p-3">
                                                <p className="text-sm font-medium text-gray-900">{area.city}</p>
                                                <div className="mt-1 flex flex-wrap gap-1">
                                                    {area.localities.map((locality, idx) => (
                                                        <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                            {locality}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">No areas assigned yet.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Tabs */}
                        <div className="bg-white shadow rounded-lg mb-6">
                            <div className="border-b border-gray-200">
                                <nav className="flex -mb-px">
                                    <button
                                        className={`px-6 py-4 text-sm font-medium ${activeTab === 'overview' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                        onClick={() => handleTabChange('overview')}
                                    >
                                        Overview
                                    </button>
                                    <button
                                        className={`px-6 py-4 text-sm font-medium ${activeTab === 'activity' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                        onClick={() => handleTabChange('activity')}
                                    >
                                        Activity Log
                                    </button>
                                    <button
                                        className={`px-6 py-4 text-sm font-medium ${activeTab === 'properties' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                        onClick={() => handleTabChange('properties')}
                                    >
                                        Properties
                                    </button>
                                </nav>
                            </div>
                        </div>

                        {/* Tab Content */}
                        {activeTab === 'overview' && (
                            <div className="bg-white shadow rounded-lg overflow-hidden">
                                <div className="p-6">
                                    <h2 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-indigo-50 rounded-lg p-4">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-indigo-600 font-medium">Properties Uploaded</p>
                                                    <p className="text-xl font-bold text-gray-900">{salesman.performanceMetrics.propertiesUploaded}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-green-50 rounded-lg p-4">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-green-600 font-medium">Active Listings</p>
                                                    <p className="text-xl font-bold text-gray-900">{salesman.performanceMetrics.activeListings}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-purple-50 rounded-lg p-4">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-purple-600 font-medium">Total Sales</p>
                                                    <p className="text-xl font-bold text-gray-900">{salesman.performanceMetrics.totalSales}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-blue-50 rounded-lg p-4">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-blue-600 font-medium">Revenue</p>
                                                    <p className="text-xl font-bold text-gray-900">₹{salesman.performanceMetrics.revenue.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'activity' && (
                            <div className="bg-white shadow rounded-lg overflow-hidden">
                                <div className="p-6">
                                    <h2 className="text-lg font-medium text-gray-900 mb-4">Activity Log</h2>
                                    <div className="flow-root">
                                        <ul className="-mb-8">
                                            {salesman.activityLog && salesman.activityLog.length > 0 ? (
                                                salesman.activityLog.map((activity, index) => (
                                                    <li key={index}>
                                                        <div className="relative pb-8">
                                                            {index !== salesman.activityLog.length - 1 ? (
                                                                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                                                            ) : null}
                                                            <div className="relative flex space-x-3">
                                                                <div>
                                                                    {getActionIcon(activity.action)}
                                                                </div>
                                                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                                                    <div>
                                                                        <p className="text-sm text-gray-900">
                                                                            {activity.action.split('_').join(' ')}
                                                                            {activity.details && activity.details.propertyId && (
                                                                                <span className="ml-1 font-medium text-blue-600">
                                                                                    ({activity.details.propertyId})
                                                                                </span>
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                    <div className="text-sm text-gray-500 whitespace-nowrap">
                                                                        {formatTimestamp(activity.timestamp)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))
                                            ) : (
                                                <p className="text-sm text-gray-500">No activity recorded yet.</p>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'properties' && (
                            <div className="bg-white shadow rounded-lg overflow-hidden">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-lg font-medium text-gray-900">Properties</h2>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {salesman.properties ? salesman.properties.length : 0} Total
                                        </span>
                                    </div>
                                    {salesman.properties && salesman.properties.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-4">
                                            {salesman.properties.map((propertyId, index) => (
                                                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">Property ID: {propertyId}</p>
                                                            <p className="mt-1 text-sm text-gray-500">Added on {formatDate(salesman.activityLog.find(log => log.action === "PROPERTY_UPLOAD" && log.details?.propertyId === propertyId)?.timestamp)}</p>
                                                        </div>
                                                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                                            View Details
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500">No properties listed yet.</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesmanProfile;