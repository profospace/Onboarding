import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import propertiesService from './propertiesService';

// Initial state
const initialState = {
    properties: [],
    stats: {
        totalProperties: 0,
        pendingApproval: 0,
        approved: 0,
        totalViews: 0,
        thisMonth: 0,
        lastMonth: 0
    },
    filters: {
        searchQuery: '',
        filterType: 'all',
        filterStatus: 'all',
        sortBy: 'date_desc',
        page: 0,
        rowsPerPage: 10
    },
    selectedPropertyId: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
};

// Get properties
export const fetchProperties = createAsyncThunk(
    'properties/fetch',
    async (_, thunkAPI) => {
        try {
            const filters = thunkAPI.getState().properties.filters;
            return await propertiesService.getProperties(filters);
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Delete property
export const deleteProperty = createAsyncThunk(
    'properties/delete',
    async (propertyId, thunkAPI) => {
        try {
            await propertiesService.deleteProperty(propertyId);
            return propertyId;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get stats
export const fetchStats = createAsyncThunk(
    'properties/fetchStats',
    async (_, thunkAPI) => {
        try {
            return await propertiesService.getStats();
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Properties slice
export const propertiesSlice = createSlice({
    name: 'properties',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
        setSearchQuery: (state, action) => {
            state.filters.searchQuery = action.payload;
        },
        setFilterType: (state, action) => {
            state.filters.filterType = action.payload;
        },
        setFilterStatus: (state, action) => {
            state.filters.filterStatus = action.payload;
        },
        setSortBy: (state, action) => {
            state.filters.sortBy = action.payload;
        },
        setPage: (state, action) => {
            state.filters.page = action.payload;
        },
        setRowsPerPage: (state, action) => {
            state.filters.rowsPerPage = action.payload;
            state.filters.page = 0; // Reset to first page when changing rows per page
        },
        setSelectedPropertyId: (state, action) => {
            state.selectedPropertyId = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProperties.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchProperties.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.properties = action.payload.properties;
                state.stats = { ...state.stats, ...action.payload.stats };
            })
            .addCase(fetchProperties.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(deleteProperty.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteProperty.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.properties = state.properties.filter(
                    (property) => property.post_id !== action.payload
                );
                state.stats.totalProperties -= 1;
            })
            .addCase(deleteProperty.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(fetchStats.pending, (state) => {
                // We don't set isLoading here to avoid blocking the UI
            })
            .addCase(fetchStats.fulfilled, (state, action) => {
                state.stats = action.payload;
            })
            .addCase(fetchStats.rejected, (state) => {
                // We don't set error state here to avoid showing error messages
            });
    }
});

// Export actions
export const {
    reset,
    setSearchQuery,
    setFilterType,
    setFilterStatus,
    setSortBy,
    setPage,
    setRowsPerPage,
    setSelectedPropertyId
} = propertiesSlice.actions;

export default propertiesSlice.reducer;