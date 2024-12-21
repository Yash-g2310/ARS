import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authAPI } from './authApi'
import { act } from 'react';
import { red } from '@mui/material/colors';

//Thunks 
export const checkSession = createAsyncThunk(
    'auth/checkSession', async (_, { rejectWithValue }) => {
        try {
            const response = await authAPI.checkSession();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const registerUser = createAsyncThunk('auth/registerUser',async (data,{rejectWithValue})=>{
    // console.log('inside register thunk');
    try{
        const response = await authAPI.register(data);
        // console.log('the register response',response);
        return response.data;
    } catch (error){
        return rejectWithValue(error.response.data);
    }
})

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
    try {
        const response = await authAPI.login(data);
        return response.data;
    } catch (error) {
        // console.log(error);
        return rejectWithValue(error.response.data);
    }
})

export const channeliLogin = createAsyncThunk('auth/channeliLogin', async (_, rejectWithValue) => {
    try {
        // console.log('channeliLogin');
        const response = await authAPI.channeliLogin();
        // console.log(response);
        const data = response.data;
        if (response.status === 200) {
            const authUrl =new URL(`${data.auth_url}?client_id=${data.client_id}&redirect_uri=${data.redirect_uri}`);
            const allowedDomains = ['channeli.in'];

            if(allowedDomains.includes(authUrl.hostname)){
                window.location.href = authUrl.toString();
            }
        }
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

export const fetchUserProfile = createAsyncThunk('auth/fetchUserProfile', async (_,{rejectWithValue})=>{
    try{
        const username = localStorage.getItem('username');
        const responseProfile = await authAPI.getProfile(username);
        const responseRevieweeAssignments = await authAPI.getRevieweeAssignments(username);
        const responseReviewerAssignments = await authAPI.getReviewerAssignments(username);
        const response = {
            profile: responseProfile.data,
            revieweeAssignments: responseRevieweeAssignments.data,
            reviewerAssignments: responseReviewerAssignments.data,
        }
        // console.log(response);
        return response;
    } catch (error){
        return rejectWithValue(error.response.data);
    }
})

const initialState = {
    isAuthenticated: false,
    user: null,
    revieweeAssignments: [],
    reviewerAssignments: [],
    
    isLoading: false,
    isError: false,
    isRegistered: false,
    isRegisteredError: false,
    registeredError: null,
    errorMessage: '',

    authModal: {
        show: false,
        type: null,
    }

}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        channeliLoginCallBack: (state, action) => {
            // console.log(action.payload);
            state.isAuthenticated = true;
            localStorage.setItem('username', action.payload.username);
        },
        loginError: (state, action) => {
            state.isError = true;
            state.errorMessage = action.payload.error;
        },
        clearError: (state, action) => {
            state.isError = false;
            state.errorMessage = '';
            state.isRegisteredError = false;
            state.registeredError = null;
            state.isRegistered = false;
        },
        logout: () => initialState,
        setAuthError: (state, action) => {
            state.isError = true;
            state.errorMessage = action.payload;
        },
        setRegisterError: (state, action) => {
            // console.log(action.payload);
            state.isRegisteredError = true;
            state.registeredError = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkSession.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(checkSession.fulfilled, (state, action) => {
                state.isAuthenticated = action.payload.session;
                state.isLoading = false;
                state.isError = false;
                state.errorMessage = '';
            })
            .addCase(checkSession.rejected, (state, action) => {
                console.error('Error checking session:', action.payload);
                state.isLoading = false;
                state.isAuthenticated = false;
                state.isError = true;
                state.errorMessage = action.payload.error;
            })
            .addCase(registerUser.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                // console.log(action.payload);
                state.isLoading = false;
                state.isRegistered = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                // console.log(action.payload);
                state.isLoading = false;
                state.isRegistered = false;
                state.isRegisteredError = true;
                state.registeredError = action.payload.error;
            })
            .addCase(login.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                localStorage.setItem('username', action.payload.user['username']);
            })
            .addCase(login.rejected, (state, action) => {
                // console.log(action.payload);
                state.isLoading = false;
                state.isAuthenticated = false;
                state.isError = true;
                state.errorMessage = action.payload.error;
            })
            .addCase(fetchUserProfile.pending, (state, action)=>{
                state.isLoading = true;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action)=>{
                // console.log(action.payload);
                state.isLoading = false;
                state.user = action.payload.profile;
                state.revieweeAssignments = action.payload.revieweeAssignments;
                state.reviewerAssignments = action.payload.reviewerAssignments;
            })
            .addCase(fetchUserProfile.rejected, (state, action)=>{
                state.isLoading = false;
                state.isError = true;
                state.errorMessage = action.payload.error;
            })
    }
})

export const { channeliLoginCallBack, loginError, clearError, logout, setAuthError, setRegisterError } = authSlice.actions

export default authSlice.reducer