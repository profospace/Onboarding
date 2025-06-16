// import axios from 'axios';

// // const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5029';
// const API_BASE_URL = 'http://localhost:5029';

// class LocationService {
//     constructor() {
//         this.apiClient = axios.create({
//             baseURL: `${API_BASE_URL}/api/location`,
//             timeout: 10000
//         });

//         // Add auth token to requests
//         this.apiClient.interceptors.request.use((config) => {
//             const token = localStorage.getItem('token');
//             if (token) {
//                 config.headers.Authorization = `Bearer ${token}`;
//             }
//             return config;
//         });

//         // Handle response errors
//         this.apiClient.interceptors.response.use(
//             (response) => response,
//             (error) => {
//                 console.error('API Error:', error.response?.data || error.message);
//                 return Promise.reject(error);
//             }
//         );
//     }

//     // Admin APIs
//     async getSalesmenTrackingStatus() {
//         try {
//             const response = await this.apiClient.get('/admin/salesmen-tracking-status');
//             console.log("response", response)
//             return response.data;
//         } catch (error) {
//             throw new Error(error.response?.data?.message || 'Failed to fetch tracking status');
//         }
//     }

//     async toggleSalesmanTracking(salesmanId, enabled) {
//         try {
//             const response = await this.apiClient.post(`/admin/toggle-tracking/${salesmanId}`, {
//                 enabled
//             });
//             return response.data;
//         } catch (error) {
//             throw new Error(error.response?.data?.message || 'Failed to toggle tracking');
//         }
//     }

//     async getSalesmanLocationTrail(salesmanId, hours = 1) {
//         try {
//             const response = await this.apiClient.get(`/admin/location-trail/${salesmanId}`, {
//                 params: { hours }
//             });
//             console.log("responsetrail", response)
//             return response.data;
//         } catch (error) {
//             throw new Error(error.response?.data?.message || 'Failed to fetch location trail');
//         }
//     }

//     async getLocationStatistics(timeRange = '24h') {
//         try {
//             const response = await this.apiClient.get('/admin/location-statistics', {
//                 params: { timeRange }
//             });
//             return response.data;
//         } catch (error) {
//             throw new Error(error.response?.data?.message || 'Failed to fetch location statistics');
//         }
//     }

//     // Salesman APIs
//     async updateLocation(locationData) {
//         try {
//             const response = await this.apiClient.post('/update-location', locationData);
//             return response.data;
//         } catch (error) {
//             throw new Error(error.response?.data?.message || 'Failed to update location');
//         }
//     }

//     async getMyTrackingSettings() {
//         try {
//             const response = await this.apiClient.get('/my-tracking-settings');
//             return response.data;
//         } catch (error) {
//             throw new Error(error.response?.data?.message || 'Failed to fetch tracking settings');
//         }
//     }

//     async updateLocationPermissions(permissions) {
//         try {
//             const response = await this.apiClient.post('/update-permissions', permissions);
//             return response.data;
//         } catch (error) {
//             throw new Error(error.response?.data?.message || 'Failed to update permissions');
//         }
//     }

//     // Utility methods
//     calculateDistance(lat1, lon1, lat2, lon2) {
//         const R = 6371; // Radius of the Earth in kilometers
//         const dLat = this.deg2rad(lat2 - lat1);
//         const dLon = this.deg2rad(lon2 - lon1);
//         const a =
//             Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//             Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
//             Math.sin(dLon / 2) * Math.sin(dLon / 2);
//         const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//         const d = R * c; // Distance in kilometers
//         return d;
//     }

//     deg2rad(deg) {
//         return deg * (Math.PI / 180);
//     }

//     formatDistance(distanceKm) {
//         if (distanceKm < 1) {
//             return `${Math.round(distanceKm * 1000)}m`;
//         }
//         return `${distanceKm.toFixed(1)}km`;
//     }

//     formatDuration(minutes) {
//         if (minutes < 60) {
//             return `${Math.round(minutes)}min`;
//         }
//         const hours = Math.floor(minutes / 60);
//         const remainingMinutes = Math.round(minutes % 60);
//         return `${hours}h ${remainingMinutes}min`;
//     }

//     isLocationRecent(timestamp, thresholdMinutes = 5) {
//         const now = new Date();
//         const locationTime = new Date(timestamp);
//         const diffMinutes = (now - locationTime) / (1000 * 60);
//         return diffMinutes <= thresholdMinutes;
//     }

//     getLocationAccuracyLevel(accuracy) {
//         if (accuracy <= 5) return 'excellent';
//         if (accuracy <= 10) return 'good';
//         if (accuracy <= 20) return 'fair';
//         return 'poor';
//     }

//     getLocationAccuracyColor(accuracy) {
//         const level = this.getLocationAccuracyLevel(accuracy);
//         switch (level) {
//             case 'excellent': return '#10B981'; // green
//             case 'good': return '#3B82F6'; // blue
//             case 'fair': return '#F59E0B'; // yellow
//             case 'poor': return '#EF4444'; // red
//             default: return '#6B7280'; // gray
//         }
//     }
// }

// export default new LocationService();

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5029';

class LocationService {
    constructor() {
        this.apiClient = axios.create({
            baseURL: `${API_BASE_URL}/api/location`,
            timeout: 10000
        });

        // Add auth token to requests
        this.apiClient.interceptors.request.use((config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        // Handle response errors
        this.apiClient.interceptors.response.use(
            (response) => response,
            (error) => {
                console.error('API Error:', error.response?.data || error.message);
                return Promise.reject(error);
            }
        );
    }

    // Admin APIs
    async getSalesmenTrackingStatus() {
        try {
            const response = await this.apiClient.get('/admin/salesmen-tracking-status');
            console.log("Salesmen tracking status response:", response.data);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch tracking status');
        }
    }

    async toggleSalesmanTracking(salesmanId, enabled) {
        try {
            const response = await this.apiClient.post(`/admin/toggle-tracking/${salesmanId}`, {
                enabled
            });
            console.log("Toggle tracking response:", response.data);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to toggle tracking');
        }
    }

    async getSalesmanLocationTrail(salesmanId, hours = 1) {
        try {
            console.log("Requesting location trail for:", salesmanId, "hours:", hours);
            const response = await this.apiClient.get(`/admin/location-trail/${salesmanId}`, {
                params: { hours }
            });
            console.log("Location trail response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Location trail error:", error);
            throw new Error(error.response?.data?.message || 'Failed to fetch location trail');
        }
    }

    async getLocationStatistics(timeRange = '24h') {
        try {
            const response = await this.apiClient.get('/admin/location-statistics', {
                params: { timeRange }
            });
            console.log("Location statistics response:", response.data);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch location statistics');
        }
    }

    // Salesman APIs
    async updateLocation(locationData) {
        try {
            const response = await this.apiClient.post('/update-location', locationData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update location');
        }
    }

    async getMyTrackingSettings() {
        try {
            const response = await this.apiClient.get('/my-tracking-settings');
            console.log("My tracking settings response:", response.data);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch tracking settings');
        }
    }

    async updateLocationPermissions(permissions) {
        try {
            const response = await this.apiClient.post('/update-permissions', permissions);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update permissions');
        }
    }

    // Utility methods
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in kilometers
        return d;
    }

    deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    formatDistance(distanceKm) {
        if (distanceKm < 1) {
            return `${Math.round(distanceKm * 1000)}m`;
        }
        return `${distanceKm.toFixed(1)}km`;
    }

    formatDuration(minutes) {
        if (minutes < 60) {
            return `${Math.round(minutes)}min`;
        }
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = Math.round(minutes % 60);
        return `${hours}h ${remainingMinutes}min`;
    }

    isLocationRecent(timestamp, thresholdMinutes = 5) {
        if (!timestamp) return false;
        const now = new Date();
        const locationTime = new Date(timestamp);
        const diffMinutes = (now - locationTime) / (1000 * 60);
        return diffMinutes <= thresholdMinutes;
    }

    getLocationAccuracyLevel(accuracy) {
        if (accuracy <= 5) return 'excellent';
        if (accuracy <= 10) return 'good';
        if (accuracy <= 20) return 'fair';
        return 'poor';
    }

    getLocationAccuracyColor(accuracy) {
        const level = this.getLocationAccuracyLevel(accuracy);
        switch (level) {
            case 'excellent': return '#10B981'; // green
            case 'good': return '#3B82F6'; // blue
            case 'fair': return '#F59E0B'; // yellow
            case 'poor': return '#EF4444'; // red
            default: return '#6B7280'; // gray
        }
    }
}

export default new LocationService();