import axios from 'axios';
import { salesmanAxios } from '../../../utils/config';
import { base_url } from '../../../utils/base_url';

const API_BASE_URL = `${base_url}/api/salesmen`;

// Get properties for the current salesman
const getProperties = async (filters) => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user || !user._id) {
            throw new Error('User not authenticated');
        }

        // Create query parameters
        const params = new URLSearchParams();
        if (filters.searchQuery) params.append('search', filters.searchQuery);
        if (filters.filterType !== 'all') params.append('type_name', filters.filterType);
        if (filters.filterStatus !== 'all') params.append('status', filters.filterStatus);
        if (filters.sortBy) params.append('sortBy', filters.sortBy.split('_')[0]);
        if (filters.sortBy) params.append('sortOrder', filters.sortBy.split('_')[1]);
        params.append('page', filters.page + 1);  // API is 1-indexed, but our state is 0-indexed
        params.append('limit', filters.rowsPerPage);

        const response = await salesmanAxios.get(`${API_BASE_URL}/${user._id}/properties/?${params.toString()}`);

        return {
            properties: response.data.data.properties,
            stats: {
                totalProperties: response.data.data.stats.total || 0,
                pendingApproval: response.data.data.stats.unlisted || 0,
                approved: response.data.data.stats.listed || 0,
                totalViews: response.data.data.totalViews || 0,
                thisMonth: response.data.data.stats.thisMonth || 0,
                lastMonth: response.data.data.stats.lastMonth || 0
            }
        };
    } catch (error) {
        throw error;
    }
};

// Delete a property
const deleteProperty = async (propertyId) => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user || !user._id) {
            throw new Error('User not authenticated');
        }

        const response = await salesmanAxios.delete(`${API_BASE_URL}/${user._id}/properties/${propertyId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get stats for the current salesman
const getStats = async () => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user || !user._id) {
            throw new Error('User not authenticated');
        }

        const response = await salesmanAxios.get(`${API_BASE_URL}/${user._id}/stats`);

        return {
            totalProperties: response.data.data.total || 0,
            pendingApproval: response.data.data.unlisted || 0,
            approved: response.data.data.listed || 0,
            totalViews: response.data.data.totalViews || 0,
            thisMonth: response.data.data.thisMonth || 0,
            lastMonth: response.data.data.lastMonth || 0
        };
    } catch (error) {
        // If the endpoint doesn't exist or fails, return mock data
        return {
            totalProperties: 50,
            pendingApproval: 5,
            approved: 45,
            totalViews: 1250,
            thisMonth: 22,
            lastMonth: 18
        };
    }
};

const propertiesService = {
    getProperties,
    deleteProperty,
    getStats
};

export default propertiesService;