import { configureStore,combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from '../features/auth/authSlice'
import spaceReducer from '../features/space/spaceSlice'
import assignmentReducer from '../features/assignment/assignmentSlice'
import submissionReducer from '../features/submission/submissionSlice'
import createAuthMiddleware from '../features/auth/authMiddleware'

const persistConfig ={
    key: 'root',
    storage,
    whitelist: ['auth','space','assignment','submission'],
}

const rootReducer = combineReducers({
    auth: authReducer,
    space: spaceReducer,
    assignment: assignmentReducer,
    submission: submissionReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE','persist/PURGE',]
            }
        }).concat(createAuthMiddleware),
    devTools: process.env.NODE_ENV !== 'production',
})

export const persistor = persistStore(store)
