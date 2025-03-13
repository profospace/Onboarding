import { configureStore } from '@reduxjs/toolkit'
import authReducer from "../redux/features/auth/authSlice";
import propertiesReducer from '../redux/features/properties/propertiesSlice';


export const store = configureStore({
    reducer: {
        auth: authReducer,
        properties: propertiesReducer,

    },
});