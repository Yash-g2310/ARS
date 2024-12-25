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

export const fetchSubspaceSideDrawer = createAsyncThunk('space/fetchSubspaceSideBar', async ({ username, spaceId }, { rejectWithValue, }) => {
    try {
        if (!username || !spaceId) {
            throw new Error('Username and spaceId are required');
        }
        const response = await spaceAPI.getSubSpaceSideDrawer(username, spaceId);
        console.log(response.data);
        return {
            spaceId: spaceId,
            data: response.data
        };
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

export const fetchSpaceDetails = createAsyncThunk('space/fetchSpaceDetails', async ({ username, spaceId }, { rejectWithValue, }) => {
    try {
        if (!username || !spaceId) {
            throw new Error('Username and spaceId are required');
        }
        const response = await spaceAPI.getSpaceDetails(username, spaceId);
        console.log(response.data);
        return {
            spaceId: spaceId,
            data: response.data,
        };
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

export const fetchAssignmentList = createAsyncThunk('space/fetchAssignmentList', async ({ username, spaceId, subSpaceId }, { rejectWithValue, }) => {
    console.log('inside actual defn of fetchAssignmentList');
    try {
        const response = await assignmentAPI.getAssignmentList(username, spaceId, subSpaceId);
        console.log(response.data);
        return {
            subSpaceId: subSpaceId,
            data: response.data
        };
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

export const fetchSubSpaceDetails = createAsyncThunk('space/fetchSubSpaceDetails', async ({ username, spaceId, subSpaceId }, { rejectWithValue, }) => { 
    try {
        const response = await spaceAPI.getSubSpaceDetails(username, spaceId, subSpaceId);
        console.log(response.data);
        return {
            subSpaceId: subSpaceId,
            data: response.data
        };
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

const initialState = {
    isSpaceLoading: false,
    isSubSpaceLoading: false,
    isAssignmentLoading: false,
    isSpaceError: false,
    spaceErrorMessage: '',
    isSubSpaceError: false,
    subSpaceErrorMessage: '',
    isAssignmentError: false,
    assignmentErrorMessage: '',
    spaceSideBarData: null,
    subspaceSideDrawerData: {},
    spaceDetails: {},
    assignmentList: {},
    subSpaceDetails: {},

}

const spaceSlice = createSlice({
    name: 'space',
    initialState,
    reducers: {
        clearSpaceErrorMessage: (state) => {
            state.isSpaceError = false;
            state.spaceErrorMessage = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSpaceSideBarData.pending, (state) => {
                state.isSpaceLoading = true;
                state.isSpaceError = false;
            })
            .addCase(fetchSpaceSideBarData.fulfilled, (state, action) => {
                console.log(action.payload);
                state.spaceSideBarData = action.payload;
                state.isSpaceError = false;
                state.spaceErrorMessage = '';
                state.isSpaceLoading = false;
            })
            .addCase(fetchSpaceSideBarData.rejected, (state, action) => {
                state.isSpaceError = true;
                state.spaceErrorMessage = action.payload.error;
                state.isSpaceLoading = false;
            })
            .addCase(fetchSubspaceSideDrawer.pending, (state, action) => {
                state.isSubSpaceLoading = true;
                state.isSpaceError = false;
            })
            .addCase(fetchSubspaceSideDrawer.fulfilled, (state, action) => {
                console.log(action)
                if (!state.subspaceSideDrawerData) {
                    state.subspaceSideDrawerData = {};
                }
                state.subspaceSideDrawerData = {
                    ...state.subspaceSideDrawerData,
                    [action.payload.spaceId]: action.payload.data
                };
                state.isSpaceError = false
                state.spaceErrorMessage = '';
                state.isSubSpaceLoading = false;
            })
            .addCase(fetchSubspaceSideDrawer.rejected, (state, action) => {
                state.isSpaceError = true;
                state.spaceErrorMessage = action.payload.error;
                state.isSubSpaceLoading = false;
            })
            .addCase(fetchSpaceDetails.pending, (state, action) => {
                state.isSpaceLoading = true;
                state.isSpaceError = false;
            })
            .addCase(fetchSpaceDetails.fulfilled, (state, action) => {
                if (!state.spaceDetails) {
                    state.spaceDetails = {};
                }
                state.spaceDetails = {
                    ...state.spaceDetails,
                    [action.payload.spaceId]: action.payload.data
                };
                state.isSpaceError = false;
                state.spaceErrorMessage = '';
                state.isSpaceLoading = false;
            })
            .addCase(fetchSpaceDetails.rejected, (state, action) => {
                state.isSpaceError = true;
                state.spaceErrorMessage = action.payload.error;
                state.isSpaceLoading = false;
            })
            .addCase(fetchAssignmentList.pending, (state) => {
                state.isAssignmentLoading = true;
                state.isAssignmentError = false;
            })
            .addCase(fetchAssignmentList.fulfilled, (state, action) => {
                if (!state.assignmentList) {
                    state.assignmentList = {};
                }
                state.assignmentList = {
                    ...state.assignmentList,
                    [action.payload.subSpaceId]: action.payload.data
                };
                state.isAssignmentError = false;
                state.assignmentErrorMessage = '';
                state.isAssignmentLoading = false;
            })
            .addCase(fetchAssignmentList.rejected, (state, action) => {
                state.isAssignmentError = true;
                state.assignmentErrorMessage = action.payload.error;
                state.isAssignmentLoading = false;
            })
            .addCase(fetchSubSpaceDetails.pending, (state) => {
                state.isSubSpaceLoading = true;
                state.isSubSpaceError = false;
            })
            .addCase(fetchSubSpaceDetails.fulfilled, (state, action) => {
                if (!state.subSpaceDetails) {
                    state.subSpaceDetails = {};
                }
                state.subSpaceDetails = {
                    ...state.subSpaceDetails,
                    [action.payload.subSpaceId]: action.payload.data
                };
                state.isSubSpaceError = false;
                state.subSpaceErrorMessage = '';
                state.isSubSpaceLoading = false;
            })
            .addCase(fetchSubSpaceDetails.rejected, (state, action) => {
                state.isSubSpaceError = true;
                state.subSpaceErrorMessage = action.payload.error;
                state.isSubSpaceLoading = false;
            })
    }
})

export const { clearSpaceErrorMessage } = spaceSlice.actions

export default spaceSlice.reducer