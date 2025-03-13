// import React from 'react';
// import {
//     BarChart,
//     Bar,
//     XAxis,
//     YAxis,
//     CartesianGrid,
//     Tooltip,
//     ResponsiveContainer
// } from 'recharts';
// import { TrendingUp, TrendingDown, Eye, Home, Clock, CheckCircle } from 'lucide-react';

// const SalesmanDashboard = () => {
//     // Sample data based on the API response format
//     const [stats, setStats] = React.useState({
//         totalProperties: 45,
//         pendingApproval: 12,
//         approved: 33,
//         totalViews: 2478,
//         thisMonth: 8,
//         lastMonth: 5
//     });

//     // For monthly comparison chart
//     const monthlyData = [
//         { name: 'Last Month', properties: stats.lastMonth },
//         { name: 'This Month', properties: stats.thisMonth }
//     ];

//     // Calculate month-over-month change percentage
//     const monthlyChange = stats.lastMonth !== 0
//         ? Math.round(((stats.thisMonth - stats.lastMonth) / stats.lastMonth) * 100)
//         : 100;

//     // Status cards data
//     const statusCards = [
//         {
//             title: 'Total Properties',
//             value: stats.totalProperties,
//             icon: <Home className="h-6 w-6 text-blue-500" />,
//             bgColor: 'bg-blue-50',
//             textColor: 'text-blue-700'
//         },
//         {
//             title: 'Pending Approval',
//             value: stats.pendingApproval,
//             icon: <Clock className="h-6 w-6 text-amber-500" />,
//             bgColor: 'bg-amber-50',
//             textColor: 'text-amber-700'
//         },
//         {
//             title: 'Approved Listings',
//             value: stats.approved,
//             icon: <CheckCircle className="h-6 w-6 text-green-500" />,
//             bgColor: 'bg-green-50',
//             textColor: 'text-green-700'
//         },
//         {
//             title: 'Total Views',
//             value: stats.totalViews.toLocaleString(),
//             icon: <Eye className="h-6 w-6 text-purple-500" />,
//             bgColor: 'bg-purple-50',
//             textColor: 'text-purple-700'
//         }
//     ];

//     return (
//         <div className="p-6 bg-gray-50 min-h-screen">
//             <h1 className="text-2xl font-bold text-gray-800 mb-6">Salesman Dashboard</h1>

//             {/* Stats Overview Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//                 {statusCards.map((card, index) => (
//                     <div
//                         key={index}
//                         className={`${card.bgColor} p-6 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md`}
//                     >
//                         <div className="flex justify-between items-start">
//                             <div>
//                                 <p className="text-gray-500 text-sm font-medium">{card.title}</p>
//                                 <h3 className={`${card.textColor} text-2xl font-bold mt-1`}>{card.value}</h3>
//                             </div>
//                             <div className="p-2 rounded-full bg-white bg-opacity-70">{card.icon}</div>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* Monthly Comparison Section */}
//             <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
//                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//                     <h2 className="text-lg font-semibold text-gray-800">Monthly Performance</h2>
//                     <div className="mt-2 md:mt-0 flex items-center">
//                         <span className="font-medium">Month-over-Month: </span>
//                         <div className={`ml-2 flex items-center ${monthlyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
//                             {monthlyChange >= 0 ? (
//                                 <TrendingUp className="h-5 w-5 mr-1" />
//                             ) : (
//                                 <TrendingDown className="h-5 w-5 mr-1" />
//                             )}
//                             <span className="font-bold">{monthlyChange}%</span>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="h-64">
//                     <ResponsiveContainer width="100%" height="100%">
//                         <BarChart
//                             data={monthlyData}
//                             margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//                         >
//                             <CartesianGrid strokeDasharray="3 3" />
//                             <XAxis dataKey="name" />
//                             <YAxis />
//                             <Tooltip />
//                             <Bar dataKey="properties" fill="#4F46E5" barSize={60} />
//                         </BarChart>
//                     </ResponsiveContainer>
//                 </div>
//             </div>

//             {/* Property Status Section */}
//             <div className="bg-white p-6 rounded-lg shadow-sm">
//                 <h2 className="text-lg font-semibold text-gray-800 mb-6">Property Status Distribution</h2>
//                 <div className="h-64">
//                     <ResponsiveContainer width="100%" height="100%">
//                         <BarChart
//                             data={[
//                                 { name: 'Pending', value: stats.pendingApproval },
//                                 { name: 'Approved', value: stats.approved }
//                             ]}
//                             margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//                         >
//                             <CartesianGrid strokeDasharray="3 3" />
//                             <XAxis dataKey="name" />
//                             <YAxis />
//                             <Tooltip />
//                             <Bar dataKey="value" fill="#F59E0B" barSize={60} />
//                         </BarChart>
//                     </ResponsiveContainer>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SalesmanDashboard;


import React, { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { TrendingUp, TrendingDown, Eye, Home, Clock, CheckCircle, RefreshCw } from 'lucide-react';

const SalesmanDashboard = () => {
    const [stats, setStats] = useState({
        totalProperties: 0,
        pendingApproval: 0,
        approved: 0,
        totalViews: 0,
        thisMonth: 0,
        lastMonth: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch dashboard statistics from API
    const fetchDashboardStats = async () => {
        setLoading(true);
        try {
            // Get the salesman ID from localStorage, context, or props
            const details = JSON.parse(localStorage.getItem('user')) || ''; // Replace with your actual user ID storage method
            // console.log("details", details)

            const response = await fetch(`http://localhost:5053/api/salesmen/${details?._id}/dashboard`, {
                headers: {
                    'Authorization': `Bearer ${details?.token}` // Replace with your actual token storage method
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch dashboard data');
            }

            const result = await response.json();

            if (result.success) {
                setStats(result.data);
            } else {
                throw new Error(result.message || 'Error fetching dashboard data');
            }
        } catch (err) {
            setError(err.message);
            console.error('Dashboard data fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchDashboardStats();
    }, []);

    // For monthly comparison chart
    const monthlyData = [
        { name: 'Last Month', properties: stats.lastMonth },
        { name: 'This Month', properties: stats.thisMonth }
    ];

    // Calculate month-over-month change percentage
    const monthlyChange = stats.lastMonth !== 0
        ? Math.round(((stats.thisMonth - stats.lastMonth) / stats.lastMonth) * 100)
        : 100;

    // Status cards data
    const statusCards = [
        {
            title: 'Total Properties',
            value: stats.totalProperties,
            icon: <Home className="h-6 w-6 text-blue-500" />,
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-700'
        },
        {
            title: 'Pending Approval',
            value: stats.pendingApproval,
            icon: <Clock className="h-6 w-6 text-amber-500" />,
            bgColor: 'bg-amber-50',
            textColor: 'text-amber-700'
        },
        {
            title: 'Approved Listings',
            value: stats.approved,
            icon: <CheckCircle className="h-6 w-6 text-green-500" />,
            bgColor: 'bg-green-50',
            textColor: 'text-green-700'
        },
        {
            title: 'Total Views',
            value: stats.totalViews.toLocaleString(),
            icon: <Eye className="h-6 w-6 text-purple-500" />,
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-700'
        }
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Salesman Dashboard</h1>
                <button
                    onClick={fetchDashboardStats}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                </button>
            </div>

            {/* Loading and Error States */}
            {loading && (
                <div className="flex justify-center items-center p-8">
                    <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
                    <span className="ml-2 text-gray-600">Loading dashboard data...</span>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">
                                {error}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {!loading && !error && (
                <>
                    {/* Stats Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {statusCards.map((card, index) => (
                            <div
                                key={index}
                                className={`${card.bgColor} p-6 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium">{card.title}</p>
                                        <h3 className={`${card.textColor} text-2xl font-bold mt-1`}>{card.value}</h3>
                                    </div>
                                    <div className="p-2 rounded-full bg-white bg-opacity-70">{card.icon}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Monthly Comparison Section */}
                    <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                            <h2 className="text-lg font-semibold text-gray-800">Monthly Performance</h2>
                            <div className="mt-2 md:mt-0 flex items-center">
                                <span className="font-medium">Month-over-Month: </span>
                                <div className={`ml-2 flex items-center ${monthlyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {monthlyChange >= 0 ? (
                                        <TrendingUp className="h-5 w-5 mr-1" />
                                    ) : (
                                        <TrendingDown className="h-5 w-5 mr-1" />
                                    )}
                                    <span className="font-bold">{monthlyChange}%</span>
                                </div>
                            </div>
                        </div>

                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={monthlyData}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="properties" fill="#4F46E5" barSize={60} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Property Status Section */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-800 mb-6">Property Status Distribution</h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={[
                                        { name: 'Pending', value: stats.pendingApproval },
                                        { name: 'Approved', value: stats.approved }
                                    ]}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#F59E0B" barSize={60} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default SalesmanDashboard;