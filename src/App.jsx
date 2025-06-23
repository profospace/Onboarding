import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import { LoadScript } from '@react-google-maps/api';

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
import SalesmanStats from './SalesmanStats';
import { Toaster } from 'react-hot-toast';
import SalesmanProfile from './SalesmanProfile';
import Draft from './Draft';
import UsersManagement from "./UsersManagement"
import EditPropertyPage from './EditPropertyPage';
import SalesmanLeads from './SalesmanLeads';
import LocationAccessStatus from './components/LocationAccess/FloatingLocationButton';
import FloatingLocationButton from './components/LocationAccess/FloatingLocationButton';
import LeadsPage from './pages/SalesmanLeads/LeadsPage';
import LeadDetailPage from './pages/SalesmanLeads/LeadDetailPage';
import EditLeadPage from './pages/SalesmanLeads/EditLeadPage';
import SalesmanLeadsMap from './pages/SalesmanLeads/SalesmanLeadsMap';
import AdminLocationDashboard from './components/LocationTracking/AdminLocationDashboard';
import SalesmanLocationTracker from './components/LocationTracking/SalesmanLocationTracker';
import useGlobalLocationTracking from './hooks/useGlobalLocationTracking';
import PropertyEdit from './PropertyEdit';

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
  // Initialize global location tracking
  const trackingState = useGlobalLocationTracking();
  
  return (
    <>
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_API_KEY} libraries={["places"]} >

        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#1677FF',
              borderRadius: 6,
            },
          }}
        >
          <Toaster position="top-center" />
          <FloatingLocationButton />

          {/* Global tracking status indicator (only for salesman) */}
          {
            trackingState.isInitialized && (
              <div className="fixed bottom-4 left-4 z-50">
                <div className={`px-3 py-2 rounded-full text-xs font-medium ${trackingState.isTracking
                  ? 'bg-green-100 text-green-800'
                  : trackingState.trackingSettings?.trackingEnabled
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                  }`}>
                  {trackingState.isTracking ? (
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      {/* Tracking Active */}
                    </span>
                  ) : trackingState.trackingSettings?.trackingEnabled ? (
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      {/* Tracking Ready */}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      {/* Tracking Disabled */}
                    </span>
                  )}
                </div>
              </div>
            )
          }

          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />

              {/* Admin routes */}
              <Route path="/admin-signup" element={<AdminRouteWithLayout element={<AdminSignup />} />} />
              <Route path="/salesman-management" element={<AdminRouteWithLayout element={<SalesmanManagementPage />} />} />
              <Route path="/property-management" element={<AdminRouteWithLayout element={<PropertyManagementPage />} />} />
              <Route path="/salesman/stats/:id" element={<AdminRouteWithLayout element={<SalesmanStats />} />} />
              <Route path="/salesman/profile/:id" element={<AdminRouteWithLayout element={<SalesmanProfile />} />} />
              <Route path="/users-management" element={<AdminRouteWithLayout element={<UsersManagement />} />} />
              <Route path="/users-management" element={<AdminRouteWithLayout element={<UsersManagement />} />} />
              <Route path="/location-dashboard" element={<AdminRouteWithLayout element={<AdminLocationDashboard />} />} />

              {/* <Route path="/leads-map-new/:salesmanId" element={<AdminRouteWithLayout element={<SalesmanLeadsMap />}/> } /> */}
              


              {/* Salesman routes */}
              <Route path="/salesman/dashboard" element={<SalesmanRouteWithLayout element={<SalesmanDashboard />} />} />
              <Route path="/dashboard" element={<SalesmanRouteWithLayout element={<DashboardPage />} />} />
              {/* <Route path="/onboarding" element={<SalesmanRouteWithLayout element={<RealEstateOnboarding />} />} /> */}
              <Route path="/location-tracker" element={<SalesmanRouteWithLayout element={<SalesmanLocationTracker />} />} />


              {/* Protected routes (both admin and salesman) */}
              <Route path="/property-edit/:propertyId" element={<ProtectedRouteWithLayout element={<PropertyEdit />} />} />

              <Route path="/sales-leads" element={<ProtectedRouteWithLayout element={<SalesmanLeads />} />} />
              <Route path="/edit/:id" element={<ProtectedRouteWithLayout element={<EditPropertyPage />} />} />
              <Route path="/onboarding" element={<ProtectedRouteWithLayout element={<RealEstateOnboarding />} />} />
              <Route path="/draft" element={<ProtectedRouteWithLayout element={<Draft />} />} />
              <Route path="/settings" element={<ProtectedRouteWithLayout element={<SettingsPage />} />} />

              <Route path="/leads" element={<ProtectedRouteWithLayout element={<LeadsPage />} />} />
              <Route path="/lead/:id" element={<ProtectedRouteWithLayout element={<LeadDetailPage />} />} />
              <Route path="/edit-lead/:id" element={<ProtectedRouteWithLayout element={<EditLeadPage />} />} />

              <Route path="/leads-map-new/:salesmanId" element={<SalesmanLeadsMap />} />



              {/* Redirect to appropriate default page */}
              <Route path="/" element={<Navigate to="/login" />} />


            </Routes>
          </Router>
        </ConfigProvider>
      </LoadScript>

    </>
  );
}

export default App;

