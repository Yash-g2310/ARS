import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { spaceAPI } from './spaceAPI'
import { assignmentAPI } from '../assignment/assignmentAPI';

//Thunks 
export const fetchSpaceSideBarData = createAsyncThunk('space/fetchSpaceSideBarData', async (username, { rejectWithValue, }) => {
    try {
        const response = await spaceAPI.getSpaceSidebar(username);
        console.log(response.data);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

export const fetchSubspaceSideDrawer = createAsyncThunk('space/fetchSubspaceSideBar', async ({username, spaceId},{rejectWithValue,})=>{
    try{
        const response = await spaceAPI.getSubSpaceSideDrawer(username,spaceId);
        console.log(response.data);
        return {
            spaceId: spaceId,
            data:response.data
        };
    } catch (error){
        return rejectWithValue(error.response.data);
    }
})

export const fetchSpaceDetails = createAsyncThunk('space/fetchSpaceDetails', async ({username,spaceId},{rejectWithValue,})=>{
    try{
        const response = await spaceAPI.getSpaceDetails(username,spaceId);
        console.log(response.data);
        return {
            spaceId: spaceId,
            data:response.data,
        };
    } catch (error){
        return rejectWithValue(error.response.data);
    }
})

export const fetchAssignmentList = createAsyncThunk('space/fetchAssignmentList', async ({username,spaceId,subspaceId}, { rejectWithValue, }) => {
    console.log('inside actual defn of fetchAssignmentList');
    try {
        const response = await assignmentAPI.getAssignmentList(username,spaceId,subspaceId);
        console.log(response.data);
        return {
            subspaceId: subspaceId,
            data: response.data
        };
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

const initialState = {
    isLoading: false,
    isSubspaceLoading: false,
    isAssignmentLoading: false,
    isError: false,
    errorMessage: '',
    spaceSideBarData: null,
    subspaceSideDrawerData: {},
    spaceDetails: {},
    assignmentList: {},
    
}

const spaceSlice = createSlice({
    name: 'space',
    initialState,
    reducers: {
        clearErrorMessage: (state) => {
            state.isError = false;
            state.errorMessage = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSpaceSideBarData.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(fetchSpaceSideBarData.fulfilled, (state, action) => {
                console.log(action.payload);
                state.isLoading = false;
                state.spaceSideBarData = action.payload;
            })
            .addCase(fetchSpaceSideBarData.rejected, (state,action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMessage = action.payload.error;
            })
            .addCase(fetchSubspaceSideDrawer.pending, (state,action) => {
                state.isSubspaceLoading = true;
                state.isError = false;
            })
            .addCase(fetchSubspaceSideDrawer.fulfilled, (state,action) => {
                console.log(action)
                state.isSubspaceLoading = false;
                state.isError = false
                state.errorMessage = '';
                if (!state.subspaceSideDrawerData) {
                    state.subspaceSideDrawerData = {};
                }
                state.subspaceSideDrawerData = {
                    ...state.subspaceSideDrawerData,
                    [action.payload.spaceId]: action.payload.data
                };
            })
            .addCase(fetchSubspaceSideDrawer.rejected, (state,action) => {
                state.isSubspaceLoading = false;
                state.isError = true;
                state.errorMessage = action.payload.error;
            })
            .addCase(fetchSpaceDetails.pending, (state,action) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(fetchSpaceDetails.fulfilled, (state,action) => {
                state.isLoading = false;
                state.isError = false;
                state.errorMessage = '';
                if (!state.spaceDetails) {
                    state.spaceDetails = {};
                }
                state.spaceDetails = {
                    ...state.spaceDetails,
                    [action.payload.spaceId]: action.payload.data
                };
            })
            .addCase(fetchSpaceDetails.rejected, (state,action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMessage = action.payload.error;
            })
            .addCase(fetchAssignmentList.pending, (state) => {
                state.isAssignmentLoading = true;
                state.isError = false;
            })
            .addCase(fetchAssignmentList.fulfilled, (state, action) => {
                state.isAssignmentLoading = false;
                state.isError = false;
                state.errorMessage = '';
                if (!state.assignmentList) {
                    state.assignmentList = {};
                }
                state.assignmentList = {
                    ...state.assignmentList,
                    [action.payload.subspaceId]: action.payload.data
                };
            })
            .addCase(fetchAssignmentList.rejected, (state, action) => {
                state.isAssignmentLoading = false;
                state.isError = true;
                state.errorMessage = action.payload.error;
            })
    }
})

export const { clearErrorMessage } = spaceSlice.actions

export default spaceSlice.reducer