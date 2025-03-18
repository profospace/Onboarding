// import React, { useState, useEffect, useMemo } from 'react';
// import axios from 'axios';
// import { Search, Filter, ChevronDown, ChevronUp, User, Mail, Phone, Calendar, RefreshCw, Download, MoreHorizontal, X, Check, Eye } from 'lucide-react';

// const UsersManagement = () => {
//   // State management
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [usersPerPage, setUsersPerPage] = useState(10);
//   const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
//   const [showFilters, setShowFilters] = useState(false);
//   const [filters, setFilters] = useState({
//     verificationStatus: {
//       email: null,
//       phone: null,
//       government: null
//     },
//     loginType: [],
//     dateRange: {
//       start: '',
//       end: ''
//     },
//     activityStatus: '',
//     showDetailedView: false,
//   });
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [selectAll, setSelectAll] = useState(false);
//   const [userDetailModal, setUserDetailModal] = useState({ isOpen: false, user: null });

//   // Fetch users data
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get('http://localhost:5053/api/get-all-user', {
//           params: {
//             page: currentPage,
//             limit: usersPerPage,
//             sort: `${sortConfig.key}:${sortConfig.direction}`,
//             search: searchTerm,
//             filters: JSON.stringify(filters)
//           }
//         });
//         // Extract users array from the response
//         setUsers(response.data.users || []);
//         setFilteredUsers(response.data.users || []);
//         setLoading(false);
//       } catch (err) {
//         setError('Failed to fetch users. Please try again later.');
//         setLoading(false);
//         console.error('Error fetching users:', err);
//       }
//     };

//     fetchUsers();
//   }, [currentPage, usersPerPage, sortConfig, searchTerm, filters]);

//   // Filter users based on search term
//   useEffect(() => {
//     if (searchTerm.trim() === '') {
//       setFilteredUsers(users);
//     } else {
//       const lowercasedFilter = searchTerm.toLowerCase();
//       const filtered = users.filter(user => {
//         return (
//           (user.name && user.name.toLowerCase().includes(lowercasedFilter)) ||
//           (user.email && user.email.toLowerCase().includes(lowercasedFilter)) ||
//           (user.phone && user.phone.includes(lowercasedFilter))
//         );
//       });
//       setFilteredUsers(filtered);
//       setCurrentPage(1);
//     }
//   }, [searchTerm, users]);

//   // Handle selection of all users
//   useEffect(() => {
//     if (selectAll) {
//       setSelectedUsers(filteredUsers.map(user => user._id));
//     } else {
//       setSelectedUsers([]);
//     }
//   }, [selectAll, filteredUsers]);

//   // Calculate pagination indexes for display purposes
//   const indexOfLastUser = currentPage * usersPerPage;
//   const indexOfFirstUser = indexOfLastUser - usersPerPage;

//   // Use client-side pagination only for search filtering
//   // When no search term is active, the API handles pagination
//   const currentUsers = searchTerm.trim() === '' ? filteredUsers :
//     filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

//   // Calculate total pages based on local filtering or API response
//   const totalPages = searchTerm.trim() === '' ?
//     Math.ceil(filteredUsers.length / usersPerPage) :
//     Math.ceil(filteredUsers.length / usersPerPage);

//   // Handle sorting
//   const requestSort = (key) => {
//     let direction = 'asc';
//     if (sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }
//     setSortConfig({ key, direction });
//   };

//   // Get sort direction icon
//   const getSortDirectionIcon = (name) => {
//     if (sortConfig.key === name) {
//       return sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
//     }
//     return <ChevronDown size={16} className="text-gray-400" />;
//   };

//   // Handle checkbox selection
//   const handleSelectUser = (userId) => {
//     setSelectedUsers(prev => {
//       if (prev.includes(userId)) {
//         return prev.filter(id => id !== userId);
//       } else {
//         return [...prev, userId];
//       }
//     });
//   };

//   // Reset filters
//   const handleResetFilters = () => {
//     setFilters({
//       verificationStatus: {
//         email: null,
//         phone: null,
//         government: null
//       },
//       loginType: [],
//       dateRange: {
//         start: '',
//         end: ''
//       },
//       activityStatus: '',
//       showDetailedView: false
//     });
//     setSearchTerm('');
//   };

//   // Export selected users
//   const handleExportSelected = () => {
//     const selectedData = users.filter(user => selectedUsers.includes(user._id));
//     const jsonString = JSON.stringify(selectedData, null, 2);
//     const blob = new Blob([jsonString], { type: 'application/json' });
//     const url = URL.createObjectURL(blob);

//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'selected_users.json';
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   };

//   // Format date for display
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   // View user details
//   const viewUserDetails = (user) => {
//     setUserDetailModal({ isOpen: true, user });
//   };

//   // Handle filter changes
//   const handleFilterChange = (category, value) => {
//     setFilters(prev => {
//       const newFilters = { ...prev };

//       if (category === 'loginType') {
//         if (newFilters.loginType.includes(value)) {
//           newFilters.loginType = newFilters.loginType.filter(type => type !== value);
//         } else {
//           newFilters.loginType = [...newFilters.loginType, value];
//         }
//       } else if (category === 'verificationStatus') {
//         newFilters.verificationStatus[value] =
//           newFilters.verificationStatus[value] === null ? true :
//             newFilters.verificationStatus[value] === true ? false : null;
//       } else if (category === 'dateRange') {
//         newFilters.dateRange = { ...newFilters.dateRange, ...value };
//       } else if (category === 'activityStatus') {
//         newFilters.activityStatus = value;
//       } else if (category === 'showDetailedView') {
//         newFilters.showDetailedView = value;
//       }

//       return newFilters;
//     });

//     // Reset to first page when filters change
//     setCurrentPage(1);
//   };

//   // Get verification status icon
//   const getVerificationIcon = (status) => {
//     if (status === true) return <Check size={16} className="text-green-500" />;
//     if (status === false) return <X size={16} className="text-red-500" />;
//     return <div className="w-4 h-4 rounded-full bg-gray-300"></div>;
//   };

//   return (
//     <div className="w-full bg-white rounded-lg shadow-md">
//       {/* Header section */}
//       <div className="p-6 border-b border-gray-200">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//           <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
//             >
//               <Filter size={16} />
//               {showFilters ? 'Hide Filters' : 'Show Filters'}
//             </button>
//             <button
//               onClick={handleResetFilters}
//               className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
//             >
//               <RefreshCw size={16} />
//               Reset
//             </button>
//             <button
//               onClick={handleExportSelected}
//               disabled={selectedUsers.length === 0}
//               className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-md ${selectedUsers.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
//             >
//               <Download size={16} />
//               Export Selected
//             </button>
//           </div>
//         </div>

//         {/* Search bar */}
//         <div className="relative w-full max-w-md mb-4">
//           <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//             <Search size={18} className="text-gray-400" />
//           </div>
//           <input
//             type="text"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             placeholder="Search users by name, email or phone..."
//             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* Filter section */}
//         {showFilters && (
//           <div className="bg-gray-50 p-4 rounded-md mb-4">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               {/* Verification Status */}
//               <div>
//                 <h3 className="text-sm font-medium text-gray-700 mb-2">Verification Status</h3>
//                 <div className="flex flex-col gap-2">
//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={() => handleFilterChange('verificationStatus', 'email')}
//                       className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${filters.verificationStatus.email === null ? 'bg-gray-200 text-gray-700' :
//                           filters.verificationStatus.email === true ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                         }`}
//                     >
//                       {getVerificationIcon(filters.verificationStatus.email)} Email
//                     </button>
//                     <button
//                       onClick={() => handleFilterChange('verificationStatus', 'phone')}
//                       className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${filters.verificationStatus.phone === null ? 'bg-gray-200 text-gray-700' :
//                           filters.verificationStatus.phone === true ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                         }`}
//                     >
//                       {getVerificationIcon(filters.verificationStatus.phone)} Phone
//                     </button>
//                     <button
//                       onClick={() => handleFilterChange('verificationStatus', 'government')}
//                       className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${filters.verificationStatus.government === null ? 'bg-gray-200 text-gray-700' :
//                           filters.verificationStatus.government === true ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                         }`}
//                     >
//                       {getVerificationIcon(filters.verificationStatus.government)} Government
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Login Type */}
//               <div>
//                 <h3 className="text-sm font-medium text-gray-700 mb-2">Login Type</h3>
//                 <div className="flex flex-wrap gap-2">
//                   {['EMAIL', 'GOOGLE', 'FACEBOOK', 'APPLE', 'PHONE'].map(type => (
//                     <button
//                       key={type}
//                       onClick={() => handleFilterChange('loginType', type)}
//                       className={`px-2 py-1 text-xs rounded-full ${filters.loginType.includes(type) ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-700'
//                         }`}
//                     >
//                       {type}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Date Range */}
//               <div>
//                 <h3 className="text-sm font-medium text-gray-700 mb-2">Registration Date</h3>
//                 <div className="grid grid-cols-2 gap-2">
//                   <div>
//                     <label className="text-xs text-gray-500">From</label>
//                     <input
//                       type="date"
//                       value={filters.dateRange.start}
//                       onChange={(e) => handleFilterChange('dateRange', { start: e.target.value })}
//                       className="w-full p-2 text-sm border border-gray-300 rounded-md"
//                     />
//                   </div>
//                   <div>
//                     <label className="text-xs text-gray-500">To</label>
//                     <input
//                       type="date"
//                       value={filters.dateRange.end}
//                       onChange={(e) => handleFilterChange('dateRange', { end: e.target.value })}
//                       className="w-full p-2 text-sm border border-gray-300 rounded-md"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Activity Status */}
//               <div>
//                 <h3 className="text-sm font-medium text-gray-700 mb-2">Activity Status</h3>
//                 <select
//                   value={filters.activityStatus}
//                   onChange={(e) => handleFilterChange('activityStatus', e.target.value)}
//                   className="w-full p-2 text-sm border border-gray-300 rounded-md"
//                 >
//                   <option value="">All</option>
//                   <option value="active">Active (Last 30 days)</option>
//                   <option value="inactive">Inactive (30+ days)</option>
//                 </select>
//               </div>

//               {/* View Type */}
//               <div>
//                 <h3 className="text-sm font-medium text-gray-700 mb-2">View Type</h3>
//                 <div className="flex items-center">
//                   <input
//                     id="detailedView"
//                     type="checkbox"
//                     checked={filters.showDetailedView}
//                     onChange={(e) => handleFilterChange('showDetailedView', e.target.checked)}
//                     className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                   />
//                   <label htmlFor="detailedView" className="ml-2 text-sm text-gray-700">
//                     Show detailed view
//                   </label>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Table section */}
//       <div className="overflow-x-auto">
//         {loading ? (
//           <div className="flex justify-center items-center p-10">
//             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
//           </div>
//         ) : error ? (
//           <div className="p-6 text-center text-red-500">{error}</div>
//         ) : filteredUsers.length === 0 ? (
//           <div className="p-6 text-center text-gray-500">No users found</div>
//         ) : (
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   <div className="flex items-center">
//                     <input
//                       type="checkbox"
//                       checked={selectAll}
//                       onChange={() => setSelectAll(!selectAll)}
//                       className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                     />
//                   </div>
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                   onClick={() => requestSort('name')}
//                 >
//                   <div className="flex items-center">
//                     User
//                     {getSortDirectionIcon('name')}
//                   </div>
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                   onClick={() => requestSort('loginType')}
//                 >
//                   <div className="flex items-center">
//                     Login Type
//                     {getSortDirectionIcon('loginType')}
//                   </div>
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                   onClick={() => requestSort('createdAt')}
//                 >
//                   <div className="flex items-center">
//                     Registered
//                     {getSortDirectionIcon('createdAt')}
//                   </div>
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                   onClick={() => requestSort('lastLogin')}
//                 >
//                   <div className="flex items-center">
//                     Last Activity
//                     {getSortDirectionIcon('lastLogin')}
//                   </div>
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Verification
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {currentUsers.map((user) => (
//                 <React.Fragment key={user._id}>
//                   <tr className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <input
//                         type="checkbox"
//                         checked={selectedUsers.includes(user._id)}
//                         onChange={() => handleSelectUser(user._id)}
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                       />
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="flex-shrink-0 h-10 w-10">
//                           {user.profile && user.profile.avatar ? (
//                             <img
//                               src={user.profile.avatar}
//                               alt={user.name}
//                               className="h-10 w-10 rounded-full"
//                             />
//                           ) : (
//                             <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
//                               <User size={20} className="text-gray-500" />
//                             </div>
//                           )}
//                         </div>
//                         <div className="ml-4">
//                           <div className="text-sm font-medium text-gray-900">{user.name || 'Unnamed User'}</div>
//                           <div className="text-sm text-gray-500">{user.email || 'No email'}</div>
//                           <div className="text-sm text-gray-500">{user.phone || 'No phone'}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
//                         ${user.loginType === 'EMAIL' ? 'bg-blue-100 text-blue-800' :
//                           user.loginType === 'GOOGLE' ? 'bg-red-100 text-red-800' :
//                             user.loginType === 'FACEBOOK' ? 'bg-indigo-100 text-indigo-800' :
//                               user.loginType === 'APPLE' ? 'bg-gray-100 text-gray-800' :
//                                 'bg-green-100 text-green-800'}`}
//                       >
//                         {user.loginType}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {formatDate(user.createdAt)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {formatDate(user.lastLogin)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center space-x-2">
//                         <span className="inline-flex items-center">
//                           <Mail size={14} className="mr-1" />
//                           {user.verificationStatus && user.verificationStatus.email ?
//                             <Check size={14} className="text-green-500" /> :
//                             <X size={14} className="text-red-500" />
//                           }
//                         </span>
//                         <span className="inline-flex items-center">
//                           <Phone size={14} className="mr-1" />
//                           {user.verificationStatus && user.verificationStatus.phone ?
//                             <Check size={14} className="text-green-500" /> :
//                             <X size={14} className="text-red-500" />
//                           }
//                         </span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                       <button
//                         onClick={() => viewUserDetails(user)}
//                         className="text-blue-600 hover:text-blue-900 mr-3"
//                       >
//                         <Eye size={18} />
//                       </button>
//                       <button className="text-gray-600 hover:text-gray-900">
//                         <MoreHorizontal size={18} />
//                       </button>
//                     </td>
//                   </tr>
//                   {filters.showDetailedView && (
//                     <tr className="bg-gray-50">
//                       <td colSpan={7} className="px-6 py-4">
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                           {/* Activity stats */}
//                           <div className="bg-white p-3 rounded shadow-sm">
//                             <h4 className="text-sm font-medium text-gray-700 mb-2">Activity</h4>
//                             <div className="grid grid-cols-2 gap-2 text-xs">
//                               <div>
//                                 <p className="text-gray-500">Properties Viewed:</p>
//                                 <p className="font-medium">{user.history?.viewedProperties?.length || 0}</p>
//                               </div>
//                               <div>
//                                 <p className="text-gray-500">Liked Properties:</p>
//                                 <p className="font-medium">{user.history?.likedProperties?.length || 0}</p>
//                               </div>
//                               <div>
//                                 <p className="text-gray-500">Search Count:</p>
//                                 <p className="font-medium">{user.history?.searchHistory?.length || 0}</p>
//                               </div>
//                               <div>
//                                 <p className="text-gray-500">Contacted Properties:</p>
//                                 <p className="font-medium">{user.history?.contactedProperties?.length || 0}</p>
//                               </div>
//                             </div>
//                           </div>

//                           {/* Preferences */}
//                           <div className="bg-white p-3 rounded shadow-sm">
//                             <h4 className="text-sm font-medium text-gray-700 mb-2">Preferences</h4>
//                             <div className="text-xs">
//                               <p className="text-gray-500">Property Types:</p>
//                               <p className="font-medium mb-1">
//                                 {user.profile?.preferences?.propertyTypes?.join(', ') || 'Not specified'}
//                               </p>
//                               <p className="text-gray-500">Price Range:</p>
//                               <p className="font-medium mb-1">
//                                 {user.profile?.preferences?.priceRange?.min ?
//                                   `${user.profile.preferences.priceRange.min} - ${user.profile.preferences.priceRange.max}` :
//                                   'Not specified'}
//                               </p>
//                               <p className="text-gray-500">Preferred Locations:</p>
//                               <p className="font-medium">
//                                 {user.profile?.preferences?.preferredLocations?.join(', ') || 'Not specified'}
//                               </p>
//                             </div>
//                           </div>

//                           {/* Recent Activity Log */}
//                           <div className="bg-white p-3 rounded shadow-sm">
//                             <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Activity</h4>
//                             <div className="text-xs max-h-24 overflow-y-auto">
//                               {user.activityLog && user.activityLog.length > 0 ? (
//                                 user.activityLog.slice(0, 3).map((activity, index) => (
//                                   <div key={index} className="mb-1 pb-1 border-b border-gray-100">
//                                     <p className="font-medium">{activity.action}</p>
//                                     <p className="text-gray-500">{formatDate(activity.timestamp)}</p>
//                                   </div>
//                                 ))
//                               ) : (
//                                 <p className="text-gray-500">No recent activity</p>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </td>
//                     </tr>
//                   )}
//                 </React.Fragment>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* Pagination */}
//       <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
//         <div className="flex-1 flex justify-between sm:hidden">
//           <button
//             onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//             className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
//               }`}
//           >
//             Previous
//           </button>
//           <button
//             onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//             disabled={currentPage === totalPages}
//             className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === totalPages || totalPages === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
//               }`}
//           >
//             Next
//           </button>
//         </div>
//         <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//           <div>
//             <p className="text-sm text-gray-700">
//               Showing <span className="font-medium">{filteredUsers.length > 0 ? indexOfFirstUser + 1 : 0}</span> to{' '}
//               <span className="font-medium">{Math.min(indexOfLastUser, filteredUsers.length)}</span> of{' '}
//               <span className="font-medium">{filteredUsers.length}</span> results
//             </p>
//           </div>
//           <div className="flex items-center space-x-2">
//             <span className="text-sm text-gray-700">Rows per page:</span>
//             <select
//               value={usersPerPage}
//               onChange={(e) => setUsersPerPage(Number(e.target.value))}
//               className="border border-gray-300 rounded-md text-sm"
//             >
//               <option value={5}>5</option>
//               <option value={10}>10</option>
//               <option value={25}>25</option>
//               <option value={50}>50</option>
//             </select>
//             <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//               <button
//                 onClick={() => setCurrentPage(1)}
//                 disabled={currentPage === 1}
//                 className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
//                   }`}
//               >
//                 <span className="sr-only">First</span>
//                 First
//               </button>
//               <button
//                 onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                 disabled={currentPage === 1}
//                 className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
//                   }`}
//               >
//                 <span className="sr-only">Previous</span>
//                 &laquo;
//               </button>

//               {/* Page Numbers */}
//               {[...Array(Math.min(5, totalPages)).keys()].map(i => {
//                 // Calculate page number logic for pagination display
//                 let pageNum;
//                 if (totalPages <= 5) {
//                   pageNum = i + 1;
//                 } else if (currentPage <= 3) {
//                   pageNum = i + 1;
//                 } else if (currentPage >= totalPages - 2) {
//                   pageNum = totalPages - 4 + i;
//                 } else {
//                   pageNum = currentPage - 2 + i;
//                 }

//                 // Only render if page number is valid
//                 return pageNum > 0 && pageNum <= totalPages ? (
//                   <button
//                     key={pageNum}
//                     onClick={() => setCurrentPage(pageNum)}
//                     className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === pageNum
//                         ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
//                         : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
//                       }`}
//                   >
//                     {pageNum}
//                   </button>
//                 ) : null;
//               })}

//               <button
//                 onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                 disabled={currentPage === totalPages || totalPages === 0}
//                 className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages || totalPages === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
//                   }`}
//               >
//                 <span className="sr-only">Next</span>
//                 &raquo;
//               </button>
//               <button
//                 onClick={() => setCurrentPage(totalPages)}
//                 disabled={currentPage === totalPages || totalPages === 0}
//                 className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages || totalPages === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
//                   }`}
//               >
//                 <span className="sr-only">Last</span>
//                 Last
//               </button>
//             </nav>
//           </div>
//         </div>
//       </div>

//       {/* User Detail Modal */}
//       {userDetailModal.isOpen && userDetailModal.user && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
//             <div className="flex justify-between items-center border-b border-gray-200 p-4">
//               <h2 className="text-xl font-semibold text-gray-800">User Details</h2>
//               <button
//                 onClick={() => setUserDetailModal({ isOpen: false, user: null })}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <X size={24} />
//               </button>
//             </div>
//             <div className="p-6">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 {/* User Profile Section */}
//                 <div className="col-span-1 bg-white p-4 rounded-lg border border-gray-200">
//                   <div className="flex flex-col items-center mb-4">
//                     {userDetailModal.user.profile && userDetailModal.user.profile.avatar ? (
//                       <img
//                         src={userDetailModal.user.profile.avatar}
//                         alt={userDetailModal.user.name}
//                         className="h-24 w-24 rounded-full mb-2"
//                       />
//                     ) : (
//                       <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center mb-2">
//                         <User size={48} className="text-gray-500" />
//                       </div>
//                     )}
//                     <h3 className="text-lg font-medium text-gray-900">{userDetailModal.user.name || 'Unnamed User'}</h3>
//                     <div className="flex items-center mt-1">
//                       <span className={`px-2 py-1 text-xs font-semibold rounded-full 
//                         ${userDetailModal.user.loginType === 'EMAIL' ? 'bg-blue-100 text-blue-800' :
//                           userDetailModal.user.loginType === 'GOOGLE' ? 'bg-red-100 text-red-800' :
//                             userDetailModal.user.loginType === 'FACEBOOK' ? 'bg-indigo-100 text-indigo-800' :
//                               userDetailModal.user.loginType === 'APPLE' ? 'bg-gray-100 text-gray-800' :
//                                 'bg-green-100 text-green-800'}`}
//                       >
//                         {userDetailModal.user.loginType}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="border-t border-gray-200 pt-4">
//                     <div className="flex items-center mb-2">
//                       <Mail size={16} className="text-gray-500 mr-2" />
//                       <p className="text-sm">{userDetailModal.user.email || 'No email'}</p>
//                     </div>
//                     <div className="flex items-center mb-2">
//                       <Phone size={16} className="text-gray-500 mr-2" />
//                       <p className="text-sm">{userDetailModal.user.phone || 'No phone'}</p>
//                     </div>
//                     <div className="flex items-center mb-2">
//                       <Calendar size={16} className="text-gray-500 mr-2" />
//                       <p className="text-sm">Registered: {formatDate(userDetailModal.user.createdAt)}</p>
//                     </div>
//                     <div className="flex items-center">
//                       <Calendar size={16} className="text-gray-500 mr-2" />
//                       <p className="text-sm">Last Login: {formatDate(userDetailModal.user.lastLogin)}</p>
//                     </div>
//                   </div>

//                   <div className="mt-4 border-t border-gray-200 pt-4">
//                     <h4 className="text-sm font-medium text-gray-700 mb-2">Verification Status</h4>
//                     <div className="grid grid-cols-2 gap-2">
//                       <div className="flex items-center text-sm">
//                         <span className="mr-2">Email:</span>
//                         {userDetailModal.user.verificationStatus && userDetailModal.user.verificationStatus.email ?
//                           <Check size={16} className="text-green-500" /> :
//                           <X size={16} className="text-red-500" />
//                         }
//                       </div>
//                       <div className="flex items-center text-sm">
//                         <span className="mr-2">Phone:</span>
//                         {userDetailModal.user.verificationStatus && userDetailModal.user.verificationStatus.phone ?
//                           <Check size={16} className="text-green-500" /> :
//                           <X size={16} className="text-red-500" />
//                         }
//                       </div>
//                       <div className="flex items-center text-sm">
//                         <span className="mr-2">Government:</span>
//                         {userDetailModal.user.verificationStatus && userDetailModal.user.verificationStatus.government ?
//                           <Check size={16} className="text-green-500" /> :
//                           <X size={16} className="text-red-500" />
//                         }
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* User Activity Section */}
//                 <div className="col-span-2 grid grid-cols-1 gap-4">
//                   {/* Preferences Section */}
//                   <div className="bg-white p-4 rounded-lg border border-gray-200">
//                     <h4 className="text-md font-medium text-gray-800 mb-3">User Preferences</h4>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <h5 className="text-sm font-medium text-gray-700 mb-1">Property Types</h5>
//                         <div className="flex flex-wrap gap-1">
//                           {userDetailModal.user.profile?.preferences?.propertyTypes?.length > 0 ?
//                             userDetailModal.user.profile.preferences.propertyTypes.map((type, idx) => (
//                               <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
//                                 {type}
//                               </span>
//                             )) :
//                             <span className="text-sm text-gray-500">Not specified</span>
//                           }
//                         </div>
//                       </div>

//                       <div>
//                         <h5 className="text-sm font-medium text-gray-700 mb-1">Price Range</h5>
//                         <p className="text-sm text-gray-800">
//                           {userDetailModal.user.profile?.preferences?.priceRange?.min ?
//                             `${userDetailModal.user.profile.preferences.priceRange.min} - ${userDetailModal.user.profile.preferences.priceRange.max}` :
//                             'Not specified'}
//                         </p>
//                       </div>

//                       <div>
//                         <h5 className="text-sm font-medium text-gray-700 mb-1">Preferred Locations</h5>
//                         <div className="flex flex-wrap gap-1">
//                           {userDetailModal.user.profile?.preferences?.preferredLocations?.length > 0 ?
//                             userDetailModal.user.profile.preferences.preferredLocations.map((location, idx) => (
//                               <span key={idx} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
//                                 {location}
//                               </span>
//                             )) :
//                             <span className="text-sm text-gray-500">Not specified</span>
//                           }
//                         </div>
//                       </div>

//                       <div>
//                         <h5 className="text-sm font-medium text-gray-700 mb-1">Amenities</h5>
//                         <div className="flex flex-wrap gap-1">
//                           {userDetailModal.user.profile?.preferences?.amenities?.length > 0 ?
//                             userDetailModal.user.profile.preferences.amenities.map((amenity, idx) => (
//                               <span key={idx} className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">
//                                 {amenity}
//                               </span>
//                             )) :
//                             <span className="text-sm text-gray-500">Not specified</span>
//                           }
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Activity Stats */}
//                   <div className="bg-white p-4 rounded-lg border border-gray-200">
//                     <h4 className="text-md font-medium text-gray-800 mb-3">Activity Summary</h4>
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                       <div className="bg-blue-50 p-3 rounded-lg text-center">
//                         <p className="text-sm text-blue-700 font-medium">Properties Viewed</p>
//                         <p className="text-2xl font-bold text-blue-800">
//                           {userDetailModal.user.history?.viewedProperties?.length || 0}
//                         </p>
//                       </div>
//                       <div className="bg-green-50 p-3 rounded-lg text-center">
//                         <p className="text-sm text-green-700 font-medium">Properties Liked</p>
//                         <p className="text-2xl font-bold text-green-800">
//                           {userDetailModal.user.history?.likedProperties?.length || 0}
//                         </p>
//                       </div>
//                       <div className="bg-purple-50 p-3 rounded-lg text-center">
//                         <p className="text-sm text-purple-700 font-medium">Search Count</p>
//                         <p className="text-2xl font-bold text-purple-800">
//                           {userDetailModal.user.history?.searchHistory?.length || 0}
//                         </p>
//                       </div>
//                       <div className="bg-yellow-50 p-3 rounded-lg text-center">
//                         <p className="text-sm text-yellow-700 font-medium">Contacts Made</p>
//                         <p className="text-2xl font-bold text-yellow-800">
//                           {userDetailModal.user.history?.contactedProperties?.length || 0}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* User Activity Log */}
//                   <div className="bg-white p-4 rounded-lg border border-gray-200">
//                     <h4 className="text-md font-medium text-gray-800 mb-3">Recent Activity Log</h4>
//                     {userDetailModal.user.activityLog && userDetailModal.user.activityLog.length > 0 ? (
//                       <div className="overflow-hidden overflow-y-auto max-h-64">
//                         <table className="min-w-full">
//                           <thead className="bg-gray-50">
//                             <tr>
//                               <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
//                               <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
//                               <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
//                             </tr>
//                           </thead>
//                           <tbody className="bg-white divide-y divide-gray-200">
//                             {userDetailModal.user.activityLog.map((activity, idx) => (
//                               <tr key={idx} className="hover:bg-gray-50">
//                                 <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{activity.action}</td>
//                                 <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{formatDate(activity.timestamp)}</td>
//                                 <td className="px-3 py-2 text-sm text-gray-500">
//                                   {activity.details && typeof activity.details === 'object' ? (
//                                     <div>
//                                       {Object.entries(activity.details).map(([key, value]) => {
//                                         // Skip nested objects in brief view
//                                         if (typeof value !== 'object') {
//                                           return (
//                                             <div key={key} className="text-xs">
//                                               <span className="font-medium">{key}:</span> {value}
//                                             </div>
//                                           );
//                                         }
//                                         return null;
//                                       })}
//                                     </div>
//                                   ) : (
//                                     <span>-</span>
//                                   )}
//                                 </td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     ) : (
//                       <p className="text-sm text-gray-500 p-2">No activity recorded</p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UsersManagement;



import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Search, Filter, ChevronDown, ChevronUp, User, Mail, Phone, Calendar, RefreshCw, Download, MoreHorizontal, X, Check, Eye } from 'lucide-react';
import { base_url } from '../utils/base_url';

const UsersManagement = () => {
  // State management
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    verificationStatus: {
      email: null,
      phone: null,
      government: null
    },
    loginType: [],
    dateRange: {
      start: '',
      end: ''
    },
    activityStatus: '',
    showDetailedView: false,
  });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [userDetailModal, setUserDetailModal] = useState({ isOpen: false, user: null });

  // Fetch users data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${base_url}/api/get-all-user`, {
          params: {
            page: currentPage,
            limit: usersPerPage,
            sort: `${sortConfig.key}:${sortConfig.direction}`,
            search: searchTerm,
            filters: JSON.stringify(filters)
          }
        });
        // Extract users array from the response
        setUsers(response.data.users || []);
        setFilteredUsers(response.data.users || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch users. Please try again later.');
        setLoading(false);
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, [currentPage, usersPerPage, sortConfig, searchTerm, filters]);

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const lowercasedFilter = searchTerm.toLowerCase();
      const filtered = users.filter(user => {
        return (
          (user.name && user.name.toLowerCase().includes(lowercasedFilter)) ||
          (user.email && user.email.toLowerCase().includes(lowercasedFilter)) ||
          (user.phone && user.phone.includes(lowercasedFilter))
        );
      });
      setFilteredUsers(filtered);
      setCurrentPage(1);
    }
  }, [searchTerm, users]);

  // Handle selection of all users
  useEffect(() => {
    if (selectAll) {
      setSelectedUsers(filteredUsers.map(user => user._id));
    } else {
      setSelectedUsers([]);
    }
  }, [selectAll, filteredUsers]);

  // Calculate pagination indexes for display purposes
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  // Use client-side pagination only for search filtering
  // When no search term is active, the API handles pagination
  const currentUsers = searchTerm.trim() === '' ? filteredUsers :
    filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Calculate total pages based on local filtering or API response
  const totalPages = searchTerm.trim() === '' ?
    Math.ceil(filteredUsers.length / usersPerPage) :
    Math.ceil(filteredUsers.length / usersPerPage);

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Get sort direction icon
  const getSortDirectionIcon = (name) => {
    if (sortConfig.key === name) {
      return sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
    }
    return <ChevronDown size={16} className="text-gray-400" />;
  };

  // Handle checkbox selection
  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      verificationStatus: {
        email: null,
        phone: null,
        government: null
      },
      loginType: [],
      dateRange: {
        start: '',
        end: ''
      },
      activityStatus: '',
      showDetailedView: false
    });
    setSearchTerm('');
  };

  // Export selected users
  const handleExportSelected = () => {
    const selectedData = users.filter(user => selectedUsers.includes(user._id));
    const jsonString = JSON.stringify(selectedData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'selected_users.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Format date and time for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true, // Set to false for 24-hour format
    });
  };


  // View user details
  const viewUserDetails = (user) => {
    setUserDetailModal({ isOpen: true, user });
  };

  // Handle filter changes
  const handleFilterChange = (category, value) => {
    setFilters(prev => {
      const newFilters = { ...prev };

      if (category === 'loginType') {
        if (newFilters.loginType.includes(value)) {
          newFilters.loginType = newFilters.loginType.filter(type => type !== value);
        } else {
          newFilters.loginType = [...newFilters.loginType, value];
        }
      } else if (category === 'verificationStatus') {
        newFilters.verificationStatus[value] =
          newFilters.verificationStatus[value] === null ? true :
            newFilters.verificationStatus[value] === true ? false : null;
      } else if (category === 'dateRange') {
        newFilters.dateRange = { ...newFilters.dateRange, ...value };
      } else if (category === 'activityStatus') {
        newFilters.activityStatus = value;
      } else if (category === 'showDetailedView') {
        newFilters.showDetailedView = value;
      }

      return newFilters;
    });

    // Reset to first page when filters change
    setCurrentPage(1);
  };

  // Get verification status icon
  const getVerificationIcon = (status) => {
    if (status === true) return <Check size={16} className="text-green-500" />;
    if (status === false) return <X size={16} className="text-red-500" />;
    return <div className="w-4 h-4 rounded-full bg-gray-300"></div>;
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md">
      {/* Header section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Filter size={16} />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <RefreshCw size={16} />
              Reset
            </button>
            <button
              onClick={handleExportSelected}
              disabled={selectedUsers.length === 0}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-md ${selectedUsers.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              <Download size={16} />
              Export Selected
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative w-full max-w-md mb-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users by name, email or phone..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter section */}
        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Verification Status */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Verification Status</h3>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleFilterChange('verificationStatus', 'email')}
                      className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${filters.verificationStatus.email === null ? 'bg-gray-200 text-gray-700' :
                          filters.verificationStatus.email === true ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                    >
                      {getVerificationIcon(filters.verificationStatus.email)} Email
                    </button>
                    <button
                      onClick={() => handleFilterChange('verificationStatus', 'phone')}
                      className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${filters.verificationStatus.phone === null ? 'bg-gray-200 text-gray-700' :
                          filters.verificationStatus.phone === true ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                    >
                      {getVerificationIcon(filters.verificationStatus.phone)} Phone
                    </button>
                    <button
                      onClick={() => handleFilterChange('verificationStatus', 'government')}
                      className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${filters.verificationStatus.government === null ? 'bg-gray-200 text-gray-700' :
                          filters.verificationStatus.government === true ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                    >
                      {getVerificationIcon(filters.verificationStatus.government)} Government
                    </button>
                  </div>
                </div>
              </div>

              {/* Login Type */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Login Type</h3>
                <div className="flex flex-wrap gap-2">
                  {['EMAIL', 'GOOGLE', 'FACEBOOK', 'APPLE', 'PHONE'].map(type => (
                    <button
                      key={type}
                      onClick={() => handleFilterChange('loginType', type)}
                      className={`px-2 py-1 text-xs rounded-full ${filters.loginType.includes(type) ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Registration Date</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-500">From</label>
                    <input
                      type="date"
                      value={filters.dateRange.start}
                      onChange={(e) => handleFilterChange('dateRange', { start: e.target.value })}
                      className="w-full p-2 text-sm border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">To</label>
                    <input
                      type="date"
                      value={filters.dateRange.end}
                      onChange={(e) => handleFilterChange('dateRange', { end: e.target.value })}
                      className="w-full p-2 text-sm border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              {/* Activity Status */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Activity Status</h3>
                <select
                  value={filters.activityStatus}
                  onChange={(e) => handleFilterChange('activityStatus', e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md"
                >
                  <option value="">All</option>
                  <option value="active">Active (Last 30 days)</option>
                  <option value="inactive">Inactive (30+ days)</option>
                </select>
              </div>

              {/* View Type */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">View Type</h3>
                <div className="flex items-center">
                  <input
                    id="detailedView"
                    type="checkbox"
                    checked={filters.showDetailedView}
                    onChange={(e) => handleFilterChange('showDetailedView', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="detailedView" className="ml-2 text-sm text-gray-700">
                    Show detailed view
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table section */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center p-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">{error}</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No users found</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={() => setSelectAll(!selectAll)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('name')}
                >
                  <div className="flex items-center">
                    User
                    {getSortDirectionIcon('name')}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('loginType')}
                >
                  <div className="flex items-center">
                    Login Type
                    {getSortDirectionIcon('loginType')}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('createdAt')}
                >
                  <div className="flex items-center">
                    Registered
                    {getSortDirectionIcon('createdAt')}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('lastLogin')}
                >
                  <div className="flex items-center">
                    Last Activity
                    {getSortDirectionIcon('lastLogin')}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Verification
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.map((user) => (
                <React.Fragment key={user._id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => handleSelectUser(user._id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.profile && user.profile.avatar ? (
                            <img
                              src={user.profile.avatar}
                              alt={user.name}
                              className="h-10 w-10 rounded-full"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <User size={20} className="text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name || 'Unnamed User'}</div>
                          <div className="text-sm text-gray-500">{user.email || 'No email'}</div>
                          <div className="text-sm text-gray-500">{user.phone || 'No phone'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.loginType === 'EMAIL' ? 'bg-blue-100 text-blue-800' :
                          user.loginType === 'GOOGLE' ? 'bg-red-100 text-red-800' :
                            user.loginType === 'FACEBOOK' ? 'bg-indigo-100 text-indigo-800' :
                              user.loginType === 'APPLE' ? 'bg-gray-100 text-gray-800' :
                                'bg-green-100 text-green-800'}`}
                      >
                        {user.loginType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.lastLogin)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center">
                          <Mail size={14} className="mr-1" />
                          {user.verificationStatus && user.verificationStatus.email ?
                            <Check size={14} className="text-green-500" /> :
                            <X size={14} className="text-red-500" />
                          }
                        </span>
                        <span className="inline-flex items-center">
                          <Phone size={14} className="mr-1" />
                          {user.verificationStatus && user.verificationStatus.phone ?
                            <Check size={14} className="text-green-500" /> :
                            <X size={14} className="text-red-500" />
                          }
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => viewUserDetails(user)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Eye size={18} />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                  {filters.showDetailedView && (
                    <tr className="bg-gray-50">
                      <td colSpan={7} className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Activity stats */}
                          <div className="bg-white p-3 rounded shadow-sm">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Activity</h4>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <p className="text-gray-500">Properties Viewed:</p>
                                <p className="font-medium">{user.history?.viewedProperties?.length || 0}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Liked Properties:</p>
                                <p className="font-medium">{user.history?.likedProperties?.length || 0}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Search Count:</p>
                                <p className="font-medium">{user.history?.searchHistory?.length || 0}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Contacted Properties:</p>
                                <p className="font-medium">{user.history?.contactedProperties?.length || 0}</p>
                              </div>
                            </div>
                          </div>

                          {/* Preferences */}
                          <div className="bg-white p-3 rounded shadow-sm">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Preferences</h4>
                            <div className="text-xs">
                              <p className="text-gray-500">Property Types:</p>
                              <p className="font-medium mb-1">
                                {user.profile?.preferences?.propertyTypes?.join(', ') || 'Not specified'}
                              </p>
                              <p className="text-gray-500">Price Range:</p>
                              <p className="font-medium mb-1">
                                {user.profile?.preferences?.priceRange?.min ?
                                  `${user.profile.preferences.priceRange.min} - ${user.profile.preferences.priceRange.max}` :
                                  'Not specified'}
                              </p>
                              <p className="text-gray-500">Preferred Locations:</p>
                              <p className="font-medium">
                                {user.profile?.preferences?.preferredLocations?.join(', ') || 'Not specified'}
                              </p>
                            </div>
                          </div>

                          {/* Recent Activity Log with Entity Details */}
                          <div className="bg-white p-3 rounded shadow-sm">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Activity</h4>
                            <div className="text-xs max-h-36 overflow-y-auto">
                              {user.activityLog && user.activityLog.length > 0 ? (
                                user.activityLog.slice(0, 3).map((activity, index) => (
                                  <div key={index} className="mb-2 pb-2 border-b border-gray-100">
                                    <div className="flex justify-between mb-1">
                                      <p className="font-medium">{activity.action}</p>
                                      <p className="text-gray-500 text-xs">{formatDate(activity.timestamp)}</p>
                                    </div>
                                    {activity.action === 'VIEW_PROPERTY' && activity.details?.property && (
                                      <div className="bg-blue-50 p-1 rounded">
                                        <p className="font-medium text-blue-700">{activity.details.property.post_title}</p>
                                        <p className="text-xs">{activity.details.property.city}, {activity.details.property.locality}</p>
                                        <p className="text-xs">₹{typeof activity.details.property.price === 'number' ?
                                          activity.details.property.price >= 100000 ?
                                            (activity.details.property.price / 100000).toFixed(2) + ' Lac' :
                                            activity.details.property.price.toLocaleString() :
                                          activity.details.property.price}</p>
                                      </div>
                                    )}
                                    {activity.action === 'VIEW_PROJECT' && activity.details?.project && (
                                      <div className="bg-green-50 p-1 rounded">
                                        <p className="font-medium text-green-700">{activity.details.project.name}</p>
                                        <p className="text-xs">{activity.details.project.location?.city || 'N/A'}, {activity.details.project.type}</p>
                                        <p className="text-xs">Status: {activity.details.project.status}</p>
                                      </div>
                                    )}
                                    {activity.action === 'VIEW_BUILDING' && activity.details?.building && (
                                      <div className="bg-purple-50 p-1 rounded">
                                        <p className="font-medium text-purple-700">{activity.details.building.name}</p>
                                        <p className="text-xs">Type: {activity.details.building.type}</p>
                                        <p className="text-xs">Properties: {activity.details.building.totalProperties || 'N/A'}</p>
                                      </div>
                                    )}
                                  </div>
                                ))
                              ) : (
                                <p className="text-gray-500">No recent activity</p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Recently Viewed Properties */}
                        {user.history?.viewedProperties?.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Recently Viewed Properties</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {user.history.viewedProperties.slice(0, 3).map((item, idx) => (
                                <div key={idx} className="bg-white p-2 rounded shadow-sm flex">
                                  <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden mr-2">
                                    {item.propertyId?.post_images?.length > 0 ? (
                                      <img
                                        src={item.propertyId.post_images[0].url}
                                        alt={item.propertyId.post_title}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : item.propertyId?.galleryList?.length > 0 ? (
                                      <img
                                        src={item.propertyId.galleryList[0]}
                                        alt={item.propertyId.post_title}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                        <span className="text-xs text-gray-500">No image</span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 text-xs">
                                    <p className="font-medium truncate">{item.propertyId?.post_title || 'Unnamed Property'}</p>
                                    <p className="text-gray-600 truncate">{item.propertyId?.city}, {item.propertyId?.locality}</p>
                                    <p className="text-gray-600">{item.propertyId?.bedrooms || '-'}BHK, {item.propertyId?.area || '-'} sq.ft</p>
                                    <p className="font-medium text-blue-600">
                                      ₹{typeof item.propertyId?.price === 'number' ?
                                        item.propertyId.price >= 100000 ?
                                          (item.propertyId.price / 100000).toFixed(2) + ' Lac' :
                                          item.propertyId.price.toLocaleString() :
                                        item.propertyId?.price || 'N/A'}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Liked Properties/Projects/Buildings */}
                        {user.history?.likedProperties?.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Liked Items</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {user.history.likedProperties.slice(0, 3).map((item, idx) => (
                                <div key={idx} className="bg-white p-2 rounded shadow-sm">
                                  <div className="flex items-center mb-1">
                                    <span className={`inline-block w-2 h-2 rounded-full mr-1 ${item.entityType === 'property' ? 'bg-blue-500' :
                                        item.entityType === 'project' ? 'bg-green-500' : 'bg-purple-500'
                                      }`}></span>
                                    <span className="text-xs text-gray-500 capitalize">{item.entityType}</span>
                                  </div>

                                  {item.entityType === 'property' && (
                                    <div className="text-xs">
                                      <p className="font-medium">{item.propertyId?.post_title || 'Unnamed Property'}</p>
                                      <p>{item.propertyId?.city}, {item.propertyId?.locality}</p>
                                      <p>{item.propertyId?.bedrooms || '-'}BHK, {item.propertyId?.area || '-'} sq.ft</p>
                                      <p className="font-medium text-blue-600">
                                        ₹{typeof item.propertyId?.price === 'number' ?
                                          item.propertyId.price >= 100000 ?
                                            (item.propertyId.price / 100000).toFixed(2) + ' Lac' :
                                            item.propertyId.price.toLocaleString() :
                                          item.propertyId?.price || 'N/A'}
                                      </p>
                                    </div>
                                  )}

                                  {item.entityType === 'project' && (
                                    <div className="text-xs">
                                      <p className="font-medium">{item.propertyId?.name || 'Unnamed Project'}</p>
                                      <p>{item.propertyId?.location?.city || 'N/A'}, {item.propertyId?.type}</p>
                                      <p>Units: {item.propertyId?.overview?.totalUnits || 'N/A'}</p>
                                      <p className="text-green-600">Status: {item.propertyId?.status || 'N/A'}</p>
                                    </div>
                                  )}

                                  {item.entityType === 'building' && (
                                    <div className="text-xs">
                                      <p className="font-medium">{item.propertyId?.name || 'Unnamed Building'}</p>
                                      <p>Type: {item.propertyId?.type || 'N/A'}</p>
                                      <p>Total Properties: {item.propertyId?.totalProperties || 'N/A'}</p>
                                    </div>
                                  )}

                                  <p className="text-xs text-gray-500 mt-1">Saved: {formatDate(item.savedAt)}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === totalPages || totalPages === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{filteredUsers.length > 0 ? indexOfFirstUser + 1 : 0}</span> to{' '}
              <span className="font-medium">{Math.min(indexOfLastUser, filteredUsers.length)}</span> of{' '}
              <span className="font-medium">{filteredUsers.length}</span> results
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Rows per page:</span>
            <select
              value={usersPerPage}
              onChange={(e) => setUsersPerPage(Number(e.target.value))}
              className="border border-gray-300 rounded-md text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                  }`}
              >
                <span className="sr-only">First</span>
                First
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                  }`}
              >
                <span className="sr-only">Previous</span>
                &laquo;
              </button>

              {/* Page Numbers */}
              {[...Array(Math.min(5, totalPages)).keys()].map(i => {
                // Calculate page number logic for pagination display
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                // Only render if page number is valid
                return pageNum > 0 && pageNum <= totalPages ? (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === pageNum
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                  >
                    {pageNum}
                  </button>
                ) : null;
              })}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages || totalPages === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                  }`}
              >
                <span className="sr-only">Next</span>
                &raquo;
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages || totalPages === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                  }`}
              >
                <span className="sr-only">Last</span>
                Last
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      {userDetailModal.isOpen && userDetailModal.user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white shadow-xl max-w-7xl w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-200 p-4">
              <h2 className="text-xl font-semibold text-gray-800">User Details</h2>
              <button
                onClick={() => setUserDetailModal({ isOpen: false, user: null })}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* User Profile Section */}
                <div className="col-span-1 bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex flex-col items-center mb-4">
                    {userDetailModal.user.profile && userDetailModal.user.profile.avatar ? (
                      <img
                        src={userDetailModal.user.profile.avatar}
                        alt={userDetailModal.user.name}
                        className="h-24 w-24 rounded-full mb-2"
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                        <User size={48} className="text-gray-500" />
                      </div>
                    )}
                    <h3 className="text-lg font-medium text-gray-900">{userDetailModal.user.name || 'Unnamed User'}</h3>
                    <div className="flex items-center mt-1">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                        ${userDetailModal.user.loginType === 'EMAIL' ? 'bg-blue-100 text-blue-800' :
                          userDetailModal.user.loginType === 'GOOGLE' ? 'bg-red-100 text-red-800' :
                            userDetailModal.user.loginType === 'FACEBOOK' ? 'bg-indigo-100 text-indigo-800' :
                              userDetailModal.user.loginType === 'APPLE' ? 'bg-gray-100 text-gray-800' :
                                'bg-green-100 text-green-800'}`}
                      >
                        {userDetailModal.user.loginType}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center mb-2">
                      <Mail size={16} className="text-gray-500 mr-2" />
                      <p className="text-sm">{userDetailModal.user.email || 'No email'}</p>
                    </div>
                    <div className="flex items-center mb-2">
                      <Phone size={16} className="text-gray-500 mr-2" />
                      <p className="text-sm">{userDetailModal.user.phone || 'No phone'}</p>
                    </div>
                    <div className="flex items-center mb-2">
                      <Calendar size={16} className="text-gray-500 mr-2" />
                      <p className="text-sm">Registered: {formatDate(userDetailModal.user.createdAt)}</p>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={16} className="text-gray-500 mr-2" />
                      <p className="text-sm">Last Login: {formatDate(userDetailModal.user.lastLogin)}</p>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Verification Status</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center text-sm">
                        <span className="mr-2">Email:</span>
                        {userDetailModal.user.verificationStatus && userDetailModal.user.verificationStatus.email ?
                          <Check size={16} className="text-green-500" /> :
                          <X size={16} className="text-red-500" />
                        }
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="mr-2">Phone:</span>
                        {userDetailModal.user.verificationStatus && userDetailModal.user.verificationStatus.phone ?
                          <Check size={16} className="text-green-500" /> :
                          <X size={16} className="text-red-500" />
                        }
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="mr-2">Government:</span>
                        {userDetailModal.user.verificationStatus && userDetailModal.user.verificationStatus.government ?
                          <Check size={16} className="text-green-500" /> :
                          <X size={16} className="text-red-500" />
                        }
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Activity Section */}
                <div className="col-span-2 grid grid-cols-1 gap-4">
                  {/* Preferences Section */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="text-md font-medium text-gray-800 mb-3">User Preferences</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-1">Property Types</h5>
                        <div className="flex flex-wrap gap-1">
                          {userDetailModal.user.profile?.preferences?.propertyTypes?.length > 0 ?
                            userDetailModal.user.profile.preferences.propertyTypes.map((type, idx) => (
                              <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                                {type}
                              </span>
                            )) :
                            <span className="text-sm text-gray-500">Not specified</span>
                          }
                        </div>
                      </div>

                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-1">Price Range</h5>
                        <p className="text-sm text-gray-800">
                          {userDetailModal.user.profile?.preferences?.priceRange?.min ?
                            `${userDetailModal.user.profile.preferences.priceRange.min} - ${userDetailModal.user.profile.preferences.priceRange.max}` :
                            'Not specified'}
                        </p>
                      </div>

                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-1">Preferred Locations</h5>
                        <div className="flex flex-wrap gap-1">
                          {userDetailModal.user.profile?.preferences?.preferredLocations?.length > 0 ?
                            userDetailModal.user.profile.preferences.preferredLocations.map((location, idx) => (
                              <span key={idx} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                                {location}
                              </span>
                            )) :
                            <span className="text-sm text-gray-500">Not specified</span>
                          }
                        </div>
                      </div>

                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-1">Amenities</h5>
                        <div className="flex flex-wrap gap-1">
                          {userDetailModal.user.profile?.preferences?.amenities?.length > 0 ?
                            userDetailModal.user.profile.preferences.amenities.map((amenity, idx) => (
                              <span key={idx} className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">
                                {amenity}
                              </span>
                            )) :
                            <span className="text-sm text-gray-500">Not specified</span>
                          }
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Activity Stats */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="text-md font-medium text-gray-800 mb-3">Activity Summary</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <p className="text-sm text-blue-700 font-medium">Properties Viewed</p>
                        <p className="text-2xl font-bold text-blue-800">
                          {userDetailModal.user.history?.viewedProperties?.length || 0}
                        </p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg text-center">
                        <p className="text-sm text-green-700 font-medium">Properties Liked</p>
                        <p className="text-2xl font-bold text-green-800">
                          {userDetailModal.user.history?.likedProperties?.length || 0}
                        </p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg text-center">
                        <p className="text-sm text-purple-700 font-medium">Search Count</p>
                        <p className="text-2xl font-bold text-purple-800">
                          {userDetailModal.user.history?.searchHistory?.length || 0}
                        </p>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded-lg text-center">
                        <p className="text-sm text-yellow-700 font-medium">Contacts Made</p>
                        <p className="text-2xl font-bold text-yellow-800">
                          {userDetailModal.user.history?.contactedProperties?.length || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* User Activity Log */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="text-md font-medium text-gray-800 mb-3">Recent Activity Log</h4>
                    {userDetailModal.user.activityLog && userDetailModal.user.activityLog.length > 0 ? (
                      <div className="overflow-hidden overflow-y-auto max-h-64">
                        <table className="min-w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {userDetailModal.user.activityLog.map((activity, idx) => (
                              <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{activity.action}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{formatDate(activity.timestamp)}</td>
                                <td className="px-3 py-2 text-sm text-gray-500">
                                  {activity.action === 'VIEW_PROPERTY' && activity.details?.property ? (
                                    <div className="bg-blue-50 p-2 rounded">
                                      <p className="font-medium text-blue-700">{activity.details.property.post_title}</p>
                                      <div className="flex text-xs mt-1">
                                        <div className="w-12 h-12 mr-2 bg-gray-100 rounded overflow-hidden">
                                          {activity.details.property.post_images?.length > 0 ? (
                                            <img
                                              src={activity.details.property.post_images[0].url}
                                              alt={activity.details.property.post_title}
                                              className="w-full h-full object-cover"
                                            />
                                          ) : activity.details.property.galleryList?.length > 0 ? (
                                            <img
                                              src={activity.details.property.galleryList[0]}
                                              alt={activity.details.property.post_title}
                                              className="w-full h-full object-cover"
                                            />
                                          ) : null}
                                        </div>
                                        <div>
                                          <p>{activity.details.property.city}, {activity.details.property.locality}</p>
                                          <p>{activity.details.property.bedrooms || '-'}BHK, {activity.details.property.area || '-'} sq.ft</p>
                                          <p className="font-medium">
                                            ₹{typeof activity.details.property.price === 'number' ?
                                              activity.details.property.price >= 100000 ?
                                                (activity.details.property.price / 100000).toFixed(2) + ' Lac' :
                                                activity.details.property.price.toLocaleString() :
                                              activity.details.property.price || 'N/A'}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  ) : activity.action === 'VIEW_PROJECT' && activity.details?.project ? (
                                    <div className="bg-green-50 p-2 rounded">
                                      <p className="font-medium text-green-700">{activity.details.project.name}</p>
                                      <div className="flex text-xs mt-1">
                                        <div className="w-12 h-12 mr-2 bg-gray-100 rounded overflow-hidden">
                                          {activity.details.project.gallery?.length > 0 && activity.details.project.gallery[0].images?.length > 0 ? (
                                            <img
                                              src={activity.details.project.gallery[0].images[0]}
                                              alt={activity.details.project.name}
                                              className="w-full h-full object-cover"
                                            />
                                          ) : null}
                                        </div>
                                        <div>
                                          <p>{activity.details.project.location?.city || 'N/A'}</p>
                                          <p>Type: {activity.details.project.type}</p>
                                          <p>Status: {activity.details.project.status}</p>
                                          <p>Units: {activity.details.project.overview?.totalUnits || 'N/A'}</p>
                                        </div>
                                      </div>
                                    </div>
                                  ) : activity.action === 'VIEW_BUILDING' && activity.details?.building ? (
                                    <div className="bg-purple-50 p-2 rounded">
                                      <p className="font-medium text-purple-700">{activity.details.building.name}</p>
                                      <div className="flex text-xs mt-1">
                                        <div className="w-12 h-12 mr-2 bg-gray-100 rounded overflow-hidden">
                                          {activity.details.building.galleryList?.length > 0 ? (
                                            <img
                                              src={activity.details.building.galleryList[0]}
                                              alt={activity.details.building.name}
                                              className="w-full h-full object-cover"
                                            />
                                          ) : null}
                                        </div>
                                        <div>
                                          <p>Type: {activity.details.building.type}</p>
                                          <p>Properties: {activity.details.building.totalProperties || 'N/A'}</p>
                                        </div>
                                      </div>
                                    </div>
                                  ) : activity.details && typeof activity.details === 'object' ? (
                                    <div>
                                      {Object.entries(activity.details).map(([key, value]) => {
                                        // Skip nested objects and property/project/building keys
                                        if (typeof value !== 'object' && key !== 'property' && key !== 'project' && key !== 'building') {
                                          return (
                                            <div key={key} className="text-xs">
                                              <span className="font-medium">{key}:</span> {value}
                                            </div>
                                          );
                                        }
                                        return null;
                                      })}
                                    </div>
                                  ) : (
                                    <span>-</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 p-2">No activity recorded</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;