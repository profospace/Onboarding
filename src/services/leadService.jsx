import axios from 'axios';
import { base_url } from '../../utils/base_url';
// Base URL from environment variable or hardcoded for development
const BASE_URL = `${base_url}/api/salesman/property/leads`;

// Helper to get auth token
const getToken = () => {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    return user.token || '';
};

// Fetch all leads with optional filtering
export const fetchLeads = async (page = 1, search = '', filters = {}) => {
    try {
        const queryParams = new URLSearchParams({
            page,
            limit: 12, // Adjust as needed
            ...(search && { search }),
            ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''))
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

// Create a new lead - handled by the existing form in the SalesmanLeads component

// Update a lead - also handled by the existing form with prefilled data