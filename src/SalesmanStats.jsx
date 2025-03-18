import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// Import the adminAxios instance from your config file
import { adminAxios, adminAPI } from '../utils/config';
// Import chart components
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

function SalesmanStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [salesman, setSalesman] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Use adminAxios instance with the correct endpoint from your configuration
        // Note: Using the endpoint based on your router.get('/:id/dashboard') route
        const response = await adminAxios.get(`${adminAPI.manageSalesmen}/${id}/dashboard`);
        if (response.data.success) {
          setStats(response.data.data);

          // Additionally fetch salesman details
          try {
            const salesmanResponse = await adminAxios.get(`${adminAPI.manageSalesmen}/${id}`);
            if (salesmanResponse.data.success) {
              setSalesman(salesmanResponse.data.data);
            }
          } catch (err) {
            console.error('Error fetching salesman details:', err);
          }
        } else {
          setError('Failed to fetch data');
        }
      } catch (err) {
        setError(err.message || 'Something went wrong');
        console.error('Error fetching salesman stats:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Failed to Load Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center p-8">
          <p className="text-lg font-medium text-gray-600">No stats available for this salesman</p>
        </div>
      </div>
    );
  }

  // Calculate growth percentage
  const calculateGrowth = () => {
    if (!stats.lastMonth) return 100;
    if (stats.lastMonth === 0) return stats.thisMonth > 0 ? 100 : 0;
    return ((stats.thisMonth - stats.lastMonth) / stats.lastMonth * 100).toFixed(1);
  };

  const growthPercentage = calculateGrowth();
  const isPositiveGrowth = growthPercentage >= 0;

  // Prepare data for charts
  const propertyStatusData = [
    { name: 'Listed', value: stats.approved },
    { name: 'Pending', value: stats.pendingApproval },
  ];

  const COLORS = ['#4ade80', '#f97316'];

  const monthlyComparisonData = [
    { name: 'Last Month', properties: stats.lastMonth },
    { name: 'This Month', properties: stats.thisMonth },
  ];

  // Mock data for the monthly trend chart - in a real application, you would fetch this from the API
  const monthlyTrendData = [
    { month: 'Jan', properties: 4 },
    { month: 'Feb', properties: 6 },
    { month: 'Mar', properties: 8 },
    { month: 'Apr', properties: 7 },
    { month: 'May', properties: 9 },
    { month: 'Jun', properties: 11 },
    { month: 'Jul', properties: 10 },
    { month: 'Aug', properties: 12 },
    { month: 'Sep', properties: stats.lastMonth },
    { month: 'Oct', properties: stats.thisMonth },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold">Salesman Dashboard</h1>
              {salesman && (
                <p className="mt-2 text-blue-100">
                  {salesman.name} • {salesman.email}
                </p>
              )}
            </div>
            <div className="mt-4 md:mt-0 flex items-center bg-white text-black bg-opacity-20 rounded-lg px-4 py-2">
              <div className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm">Last Updated</p>
                <p className="font-medium">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 -mt-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Properties */}
          <div className="bg-white rounded-xl shadow-md p-6 transition duration-300 hover:shadow-lg">
            <div className="flex items-start">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Properties</p>
                <h3 className="text-2xl font-bold text-gray-800">{stats.totalProperties}</h3>
              </div>
            </div>
          </div>

          {/* Listed Properties */}
          <div className="bg-white rounded-xl shadow-md p-6 transition duration-300 hover:shadow-lg">
            <div className="flex items-start">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Listed Properties</p>
                <h3 className="text-2xl font-bold text-gray-800">{stats.approved}</h3>
              </div>
            </div>
          </div>

          {/* Pending Properties */}
          <div className="bg-white rounded-xl shadow-md p-6 transition duration-300 hover:shadow-lg">
            <div className="flex items-start">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Approval</p>
                <h3 className="text-2xl font-bold text-gray-800">{stats.pendingApproval}</h3>
              </div>
            </div>
          </div>

          {/* Total Views */}
          <div className="bg-white rounded-xl shadow-md p-6 transition duration-300 hover:shadow-lg">
            <div className="flex items-start">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Views</p>
                <h3 className="text-2xl font-bold text-gray-800">{stats.totalViews}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Comparison */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Monthly Performance</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyComparisonData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} properties`, 'Count']} />
                  <Bar dataKey="properties" fill="#4f46e5" barSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Growth Rate</p>
                <p className={`text-xl font-bold ${isPositiveGrowth ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositiveGrowth ? '+' : ''}{growthPercentage}%
                </p>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-1 ${isPositiveGrowth ? 'text-green-600' : 'text-red-600'}`} viewBox="0 0 20 20" fill="currentColor">
                  {isPositiveGrowth ? (
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                  )}
                </svg>
                <span className={`text-sm font-medium ${isPositiveGrowth ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositiveGrowth ? 'Increased' : 'Decreased'} since last month
                </span>
              </div>
            </div>
          </div>

          {/* Property Status Distribution */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Property Status Distribution</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={propertyStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {propertyStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} properties`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Trend Chart */}
          <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Properties Trend (Year to Date)</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyTrendData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} properties`, 'Count']} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="properties"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    dot={{ r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Performance Insights</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Approval Rate */}
            <div className="p-4 border rounded-lg">
              <h3 className="text-md font-medium text-gray-600 mb-2">Approval Rate</h3>
              <p className="text-2xl font-bold text-gray-800">
                {stats.totalProperties > 0 ?
                  Math.round((stats.approved / stats.totalProperties) * 100) : 0}%
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${stats.totalProperties > 0 ? (stats.approved / stats.totalProperties) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* Pending Rate */}
            <div className="p-4 border rounded-lg">
              <h3 className="text-md font-medium text-gray-600 mb-2">Pending Rate</h3>
              <p className="text-2xl font-bold text-gray-800">
                {stats.totalProperties > 0 ?
                  Math.round((stats.pendingApproval / stats.totalProperties) * 100) : 0}%
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-yellow-500 h-2.5 rounded-full"
                  style={{ width: `${stats.totalProperties > 0 ? (stats.pendingApproval / stats.totalProperties) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* Average Views */}
            <div className="p-4 border rounded-lg">
              <h3 className="text-md font-medium text-gray-600 mb-2">Avg. Views Per Property</h3>
              <p className="text-2xl font-bold text-gray-800">
                {stats.totalProperties > 0 ?
                  Math.round(stats.totalViews / stats.totalProperties) : 0}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                {stats.totalViews} total views across {stats.totalProperties} properties
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalesmanStats;