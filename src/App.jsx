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
import LeadsMap from './pages/SalesmanLeads/LeadsMap';
import SalesmanLeadsMap from './pages/SalesmanLeads/SalesmanLeadsMap';

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

              {/* Salesman routes */}
              <Route path="/salesman/dashboard" element={<SalesmanRouteWithLayout element={<SalesmanDashboard />} />} />
              <Route path="/dashboard" element={<SalesmanRouteWithLayout element={<DashboardPage />} />} />
              {/* <Route path="/onboarding" element={<SalesmanRouteWithLayout element={<RealEstateOnboarding />} />} /> */}

              {/* Protected routes (both admin and salesman) */}
              <Route path="/sales-leads" element={<ProtectedRouteWithLayout element={<SalesmanLeads />} />} />
              <Route path="/edit/:id" element={<ProtectedRouteWithLayout element={<EditPropertyPage />} />} />
              <Route path="/onboarding" element={<ProtectedRouteWithLayout element={<RealEstateOnboarding />} />} />
              <Route path="/draft" element={<ProtectedRouteWithLayout element={<Draft />} />} />
              <Route path="/settings" element={<ProtectedRouteWithLayout element={<SettingsPage />} />} />

              <Route path="/leads" element={<ProtectedRouteWithLayout element={<LeadsPage />} />} />
              <Route path="/lead/:id" element={<ProtectedRouteWithLayout element={<LeadDetailPage />} />} />
              <Route path="/edit-lead/:id" element={<ProtectedRouteWithLayout element={<EditLeadPage />} />} />


              <Route path="/leads-map" element={<LeadsMap />} />
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

