import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../user/userService';

const initialState = {
    users: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

// Register user
export const getAllSalesman = createAsyncThunk(
    'user/getAllSalesman',
    async (_, thunkAPI) => {
        try {
            return await userService.getAllSalesman();
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

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllSalesman.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllSalesman.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.users = action.payload?.data;
            })
            .addCase(getAllSalesman.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.users = null;
            })
    },
});

export const { } = userSlice.actions;
export default userSlice.reducer;