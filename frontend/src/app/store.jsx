import { configureStore,combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from '../features/auth/authSlice'
import createAuthMiddleware from '../features/auth/authMiddleware'

const persistConfig ={
    key: 'root',
    storage,
    whitelist: ['auth',],
}

const rootReducer = combineReducers({
    auth: authReducer,
    // dashboard: dashboardReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
            }
        }).concat(createAuthMiddleware),
    devTools: process.env.NODE_ENV !== 'production',
})

export const persistor = persistStore(store)
