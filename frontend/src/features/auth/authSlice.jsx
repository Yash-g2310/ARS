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

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
    try {
        const response = await authAPI.login(data);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

export const channeliLogin = createAsyncThunk('auth/channeliLogin', async (_, rejectWithValue) => {
    try {
        console.log('channeliLogin');
        const response = await authAPI.channeliLogin();
        console.log(response);
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
        const response = await authAPI.getProfile(username);
        return response.data;
    } catch (error){
        return rejectWithValue(error.response.data);
    }
})

const initialState = {
    isAuthenticated: false,
    user: null,
    isLoading: false,
    loading: {
        login: false,
        register: false,
        session: false,
    },

    isError: false,
    errorMessage: '',
    error: {
        login: null,
        register: null,
        session: null,
    },
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
            console.log(action.payload);
            state.isAuthenticated = true;
            localStorage.setItem('username', action.payload.username);
        },
        loginError: (state, action) => {
            state.isError = true;
            state.error.login = action.payload;
            state.errorMessage = action.payload.error;
        },
        clearLoginError: (state, action) => {
            state.isError = false;
            state.error.login = null;
            state.errorMessage = '';
        },
        logout: () => initialState,
        setAuthError: (state, action) => {
            state.isError = true;
            state.errorMessage = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkSession.pending, (state, action) => {
                state.isLoading = true;
                state.loading.session = true;
            })
            .addCase(checkSession.fulfilled, (state, action) => {
                state.isAuthenticated = action.payload.session;
                state.isLoading = false;
                state.loading.session = false;
                state.isError = false;
                state.error.session = null;
                state.errorMessage = '';
            })
            .addCase(checkSession.rejected, (state, action) => {
                console.error('Error checking session:', action.payload);
                state.isLoading = false;
                state.loading.session = false;
                state.isAuthenticated = false;
                state.isError = true;
                state.error.session = action.payload;
                state.errorMessage = action.payload.error;
            })
            .addCase(login.pending, (state, action) => {
                state.isLoading = true;
                state.loading.login = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.loading.login = false;
                state.isAuthenticated = true;
                localStorage.setItem('username', action.payload.user['username']);
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.loading.login = false;
                state.isAuthenticated = false;
                state.isError = true;
                state.error.login = action.payload;
                state.errorMessage = action.payload.error;
            })
            .addCase(fetchUserProfile.pending, (state, action)=>{
                state.isLoading = true;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action)=>{
                console.log(action.payload);
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(fetchUserProfile.rejected, (state, action)=>{
                state.isLoading = false;
                state.isError = true;
                state.errorMessage = action.payload.error;
            })
    }
})

export const { channeliLoginCallBack, loginError, clearLoginError, logout, setAuthError } = authSlice.actions

export default authSlice.reducer