import { configureStore } from '@reduxjs/toolkit'
import authReducer from "../redux/features/auth/authSlice";
import propertiesReducer from '../redux/features/properties/propertiesSlice';
import usersReducer from '../redux/features/user/userSlice';


export const store = configureStore({
    reducer: {
        auth: authReducer,
        properties: propertiesReducer,
        users: usersReducer,

    },
});