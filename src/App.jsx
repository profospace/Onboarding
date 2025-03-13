// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// // Import components
// import LoginPage from './LoginPage';
// import DashboardPage from './DashboardPage';
// import RealEstateOnboarding from './RealEstateOnboarding';
// // import { authAPI, mockAPI } from './api-interfaces';

// // Use mock API for development
// // const api = process.env.REACT_APP_USE_MOCK_API === 'true' ? mockAPI : authAPI;

// function App() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Check for existing login
//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       try {
//         setUser(JSON.parse(storedUser));
//       } catch (error) {
//         console.error('Error parsing stored user data:', error);
//         localStorage.removeItem('user');
//       }
//     }
//     setLoading(false);
//   }, []);

//   // Handle login success
//   const handleLoginSuccess = (userData) => {
//     setUser(userData);
//   };

//   // Handle logout
//   const handleLogout = async () => {
//     try {
//       await api.logout();
//     } catch (error) {
//       console.error('Error during logout:', error);
//     }
//     setUser(null);
//   };

//   // Protected route component
//   const ProtectedRoute = ({ children }) => {
//     if (loading) {
//       return <div className="flex justify-center items-center h-screen">Loading...</div>;
//     }

//     if (!user) {
//       return <Navigate to="/login" />;
//     }

//     return children;
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 text-gray-900">
//       <Router>
//         <Routes>
//           <Route path="/login" element={
//             user ? <Navigate to="/dashboard" /> : <LoginPage onLoginSuccess={handleLoginSuccess} />
//           } />

//           <Route path="/dashboard" element={
//             // <ProtectedRoute>
//               <DashboardPage user={user} onLogout={handleLogout} />
//             // </ProtectedRoute>
//           } />

//           <Route path="/onboarding" element={
//             // <ProtectedRoute>
//               <RealEstateOnboarding user={user} />
//             // </ProtectedRoute>
//           } />

//           <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
//         </Routes>
//       </Router>
//     </div>
//   );
// }

// export default App;


// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// // Import components
// import LoginPage from './LoginPage';
// import DashboardPage from './DashboardPage';
// import RealEstateOnboarding from './RealEstateOnboarding';
// import SalesmanManagementPage from './SalesmanManagementPage';
// import PropertyManagementPage from './PropertyManagementPage';
// import AdminSignup from './AdminSignup';
// import SalesmanDashboard from './SalesmanDashboard';

// function App() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Check for existing login
//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       try {
//         setUser(JSON.parse(storedUser));
//       } catch (error) {
//         console.error('Error parsing stored user data:', error);
//         localStorage.removeItem('user');
//         localStorage.removeItem('token');
//       }
//     }
//     setLoading(false);
//   }, []);

//   // Handle login success
//   const handleLoginSuccess = (userData) => {
//     setUser(userData);
//   };

//   // Handle logout
//   const handleLogout = () => {
//     localStorage.removeItem('user');
//     localStorage.removeItem('token');
//     setUser(null);
//   };

//   // Protected route component
//   const ProtectedRoute = ({ children, allowedUserTypes }) => {
//     if (loading) {
//       return <div className="flex justify-center items-center h-screen">Loading...</div>;
//     }

//     if (!user) {
//       return <Navigate to="/login" />;
//     }

//     // Check if user has the right type to access this route
//     if (allowedUserTypes && !allowedUserTypes.includes(user.userType)) {
//       return <Navigate to="/dashboard" />;
//     }

//     return children;
//   };

//   // Admin-only route component
//   const AdminRoute = ({ children }) => {
//     if (loading) {
//       return <div className="flex justify-center items-center h-screen">Loading...</div>;
//     }

//     if (!user) {
//       return <Navigate to="/login" />;
//     }

//     // Check if user is an admin
//     if (user.userType !== 'salesman' || user.role !== 'admin') {
//       return <Navigate to="/dashboard" />;
//     }

//     return children;
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 text-gray-900">
//       <Router>
//         <Routes>
//           <Route path="/login" element={
//             user ? <Navigate to="/dashboard" /> : <LoginPage onLoginSuccess={handleLoginSuccess} />
//           } />

//           <Route path="/admin-signup" element={
//             // <AdminRoute>
//               <AdminSignup user={user} />
//             // </AdminRoute>
//           } />

//           <Route path="/salesman/dashboard" element={
//             // <AdminRoute>
//               <SalesmanDashboard user={user} />
//             // </AdminRoute>
//           } />

//           <Route path="/dashboard" element={
//             <ProtectedRoute allowedUserTypes={['user', 'salesman']}>
//               <DashboardPage user={user} onLogout={handleLogout} />
//             </ProtectedRoute>
//           } />

//           <Route path="/onboarding" element={
//             <ProtectedRoute allowedUserTypes={['salesman']}>
//               <RealEstateOnboarding user={user} />
//             </ProtectedRoute>
//           } />

//           <Route path="/salesman-management" element={
//             // <AdminRoute>
//               <SalesmanManagementPage user={user} onLogout={handleLogout} />
//             // </AdminRoute>
//           } />

//           <Route path='/PropertyManagementPage'  element={
//             <PropertyManagementPage />
//           } />

//           <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
//         </Routes>
//       </Router>
//     </div>
//   );
// }

// export default App;


// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// // Import route protection components
// import { ProtectedRoute, AdminRoute, SalesmanRoute } from './routes/ProtectedRoutes';

// // Import components
// import LoginPage from './LoginPage';
// import DashboardPage from './DashboardPage';
// import RealEstateOnboarding from './RealEstateOnboarding';
// import SalesmanManagementPage from './SalesmanManagementPage';
// import PropertyManagementPage from './PropertyManagementPage';
// import AdminSignup from './AdminSignup';
// import SalesmanDashboard from './SalesmanDashboard';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Public routes */}
//         <Route path="/login" element={<LoginPage />} />

//         {/* Admin routes */}
//         <Route element={<AdminRoute />}>
//           <Route path="/admin-signup" element={<AdminSignup />} />
//           <Route path="/salesman-management" element={<SalesmanManagementPage />} />
//         </Route>

//         {/* Salesman routes */}
//         <Route element={<SalesmanRoute />}>
//           <Route path="/salesman/dashboard" element={<SalesmanDashboard />} />
//           <Route path="/onboarding" element={<RealEstateOnboarding />} />
//         </Route>

//         {/* Protected routes (both admin and salesman) */}
//         <Route element={<ProtectedRoute />}>
//           <Route path="/dashboard" element={<DashboardPage />} />
//           <Route path="/property-management" element={<PropertyManagementPage />} />
//         </Route>

//         {/* Redirect to appropriate default page */}
//         <Route path="/" element={<Navigate to="/login" />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';

// Import layout component
import AppLayout from './components/Layout/AppLayout';

// Import route protection components
import { ProtectedRoute, AdminRoute, SalesmanRoute } from './routes/ProtectedRoutes';

// Import components
import LoginPage from './LoginPage';
import DashboardPage from './DashboardPage';
import RealEstateOnboarding from './RealEstateOnboarding';
import SalesmanManagementPage from './SalesmanManagementPage';
import PropertyManagementPage from './PropertyManagementPage';
import AdminSignup from './AdminSignup';
import SalesmanDashboard from './SalesmanDashboard';
import SettingsPage from './SettingsPage';

// Route wrapper with layout
const ProtectedRouteWithLayout = ({ element }) => (
  <ProtectedRoute>
    <AppLayout>
      {element}
    </AppLayout>
  </ProtectedRoute>
);

// Admin route wrapper with layout
const AdminRouteWithLayout = ({ element }) => (
  <AdminRoute>
    <AppLayout>
      {element}
    </AppLayout>
  </AdminRoute>
);

// Salesman route wrapper with layout
const SalesmanRouteWithLayout = ({ element }) => (
  <SalesmanRoute>
    <AppLayout>
      {element}
    </AppLayout>
  </SalesmanRoute>
);

function App() {
  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#1677FF',
            borderRadius: 6,
          },
        }}
      >
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />

            {/* Admin routes */}
            <Route path="/admin-signup" element={<AdminRouteWithLayout element={<AdminSignup />} />} />
            <Route path="/salesman-management" element={<AdminRouteWithLayout element={<SalesmanManagementPage />} />} />
            <Route path="/property-management" element={<AdminRouteWithLayout element={<PropertyManagementPage />} />} />

            {/* Salesman routes */}
            <Route path="/salesman/dashboard" element={<SalesmanRouteWithLayout element={<SalesmanDashboard />} />} />
            <Route path="/dashboard" element={<SalesmanRouteWithLayout element={<DashboardPage />} />} />
            {/* <Route path="/onboarding" element={<SalesmanRouteWithLayout element={<RealEstateOnboarding />} />} /> */}

            {/* Protected routes (both admin and salesman) */}
            <Route path="/onboarding" element={<ProtectedRouteWithLayout element={<RealEstateOnboarding />} />} />
            <Route path="/settings" element={<ProtectedRouteWithLayout element={<SettingsPage />} />} />

            {/* Redirect to appropriate default page */}
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </ConfigProvider>
    </>
  );
}

export default App;

