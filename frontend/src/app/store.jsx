import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import createAuthMiddleware from '../features/auth/authMiddleware'

// import auth

export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
    middleware:(getDefaultMiddleware) => 
        getDefaultMiddleware().concat(createAuthMiddleware),
})