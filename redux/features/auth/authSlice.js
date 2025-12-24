import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../auth/authServices';

// Get user from localStorage
const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
    user: user ? user : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

// Register user
export const register = createAsyncThunk(
    'auth/register',
    async (user, thunkAPI) => {
        try {
            return await authService.register(user);
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

// Login user
// export const login = createAsyncThunk(
//     'auth/login',
//     async (user, thunkAPI) => {
//         try {
//             return await authService.login(user);
//         } catch (error) {
//             const message =
//                 (error.response &&
//                     error.response.data &&
//                     error.response.data.message) ||
//                 error.message ||
//                 error.toString();
//             return thunkAPI.rejectWithValue(message);
//         }
//     }
// );


export const login = createAsyncThunk(
  'auth/login',
  async (user, thunkAPI) => {
    try {
      return await authService.login(user);
    } catch (error) {
      // 🔑 MUST return this
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// export const login = createAsyncThunk(
//   'auth/login',
//   async (user, thunkAPI) => {
//     try {
//       return await authService.login(user);
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error);
//     }
//   }
// );

// Logout user
export const logout = createAsyncThunk('auth/logout', async () => {
    authService.logout();
});

export const authSlice = createSlice({
    name: 'auth',
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
        .addCase(register.pending, (state) => {
            console.log('[REDUCER] register.pending');
            state.isLoading = true;
        })
        .addCase(register.fulfilled, (state, action) => {
            console.log('[REDUCER] register.fulfilled payload:', action.payload);
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload;
        })
        .addCase(login.pending, (state) => {
            console.log('[REDUCER] login.pending');
            state.isLoading = true;
        })
        .addCase(login.fulfilled, (state, action) => {
            console.log('[REDUCER] login.fulfilled payload:', action.payload);
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.user = action.payload;
        })
        .addCase(login.rejected, (state, action) => {
            console.log('[REDUCER] login.rejected payload:', action.payload);
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.user = null;
            state.message = action.payload;
        })
        .addCase(logout.fulfilled, (state) => {
            console.log('[REDUCER] logout.fulfilled');
            state.user = null;
        });
}
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;