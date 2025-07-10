import axios from 'axios';
import { base_url } from '../../utils/base_url';

// Base URL from environment variable
const BASE_URL = `${base_url}/api/salesman/commercial/leads`;

// Helper to get auth token
const getToken = () => {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    return user.token || '';
};

// Fetch all leads with enhanced filtering and search
export const fetchLeads = async (page = 1, search = '', filters = {}) => {
    try {
        const queryParams = new URLSearchParams({
            page,
            limit: 12, // Adjust as needed
            ...(search && { search }),
            // Add all filter parameters, filtering out empty values
            ...Object.fromEntries(
                Object.entries(filters).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
            )
        });

        const response = await axios.get(`${BASE_URL}?${queryParams}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching leads:', error);
        throw error;
    }
};

// Fetch a single lead by ID
export const fetchLeadById = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });

        return response.data;
    } catch (error) {
        console.error(`Error fetching lead with ID ${id}:`, error);
        throw error;
    }
};

// Delete a lead
export const deleteLead = async (id) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });

        return response.data;
    } catch (error) {
        console.error(`Error deleting lead with ID ${id}:`, error);
        throw error;
    }
};

// Update lead cross status
export const updateLeadCrossStatus = async (id, isCrossed) => {
    try {
        const response = await axios.patch(`${BASE_URL}/${id}/cross-status`, {
            isCrossed
        }, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });

        return response.data;
    } catch (error) {
        console.error(`Error updating lead cross status for ID ${id}:`, error);
        throw error;
    }
};

// Advanced search with multiple criteria
export const searchLeads = async (searchCriteria) => {
    try {
        const {
            propertyName,
            ownerName,
            ownerContact,
            salesmanName,
            location,
            dateRange,
            isCrossed,
            page = 1,
            limit = 12
        } = searchCriteria;

        const queryParams = new URLSearchParams({
            page,
            limit,
            ...(propertyName && { propertyName }),
            ...(ownerName && { ownerName }),
            ...(ownerContact && { ownerContact }),
            ...(salesmanName && { salesman: salesmanName }),
            ...(isCrossed !== undefined && { isCrossed: isCrossed.toString() }),
            ...(dateRange?.from && { dateFrom: dateRange.from }),
            ...(dateRange?.to && { dateTo: dateRange.to }),
            ...(location?.latitude && { latitude: location.latitude.toString() }),
            ...(location?.longitude && { longitude: location.longitude.toString() }),
            ...(location?.radius && { radius: location.radius.toString() })
        });

        const response = await axios.get(`${BASE_URL}?${queryParams}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error in advanced search:', error);
        throw error;
    }
};

// Get leads by salesman
export const getLeadsBySalesman = async (salesmanId, options = {}) => {
    try {
        const {
            page = 1,
            limit = 12,
            isCrossed,
            dateFrom,
            dateTo
        } = options;

        const queryParams = new URLSearchParams({
            page,
            limit,
            salesman: salesmanId,
            ...(isCrossed !== undefined && { isCrossed: isCrossed.toString() }),
            ...(dateFrom && { dateFrom }),
            ...(dateTo && { dateTo })
        });

        const response = await axios.get(`${BASE_URL}?${queryParams}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });

        return response.data;
    } catch (error) {
        console.error(`Error fetching leads for salesman ${salesmanId}:`, error);
        throw error;
    }
};

// Get leads within geographic area
export const getLeadsInArea = async (latitude, longitude, radiusKm, options = {}) => {
    try {
        const {
            page = 1,
            limit = 12,
            isCrossed,
            propertyName,
            ownerName
        } = options;

        const queryParams = new URLSearchParams({
            page,
            limit,
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            radius: radiusKm.toString(),
            ...(isCrossed !== undefined && { isCrossed: isCrossed.toString() }),
            ...(propertyName && { propertyName }),
            ...(ownerName && { ownerName })
        });

        const response = await axios.get(`${BASE_URL}?${queryParams}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching leads in geographic area:', error);
        throw error;
    }
};

// Export summary functions for dashboard use
export const getLeadsSummary = async () => {
    try {
        // Get basic counts
        const [totalLeads, crossedLeads, activeLeads] = await Promise.all([
            fetchLeads(1, '', {}),
            fetchLeads(1, '', { isCrossed: 'true' }),
            fetchLeads(1, '', { isCrossed: 'false' })
        ]);

        return {
            total: totalLeads.data.pagination.total,
            crossed: crossedLeads.data.pagination.total,
            active: activeLeads.data.pagination.total
        };
    } catch (error) {
        console.error('Error fetching leads summary:', error);
        throw error;
    }
};

// Utility function to format filter parameters for API
export const formatFiltersForAPI = (filters) => {
    const formattedFilters = {};

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
            // Special handling for specific filter types
            switch (key) {
                case 'isCrossed':
                    formattedFilters[key] = value;
                    break;
                case 'latitude':
                case 'longitude':
                case 'radius':
                    // Ensure numeric values are properly formatted
                    const numValue = parseFloat(value);
                    if (!isNaN(numValue)) {
                        formattedFilters[key] = numValue.toString();
                    }
                    break;
                default:
                    formattedFilters[key] = value;
            }
        }
    });

    return formattedFilters;
};