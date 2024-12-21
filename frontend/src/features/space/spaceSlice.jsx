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

export const fetchAssignmentList = createAsyncThunk('space/fetchAssignmentList', async ({ username, spaceId, subspaceId }, { rejectWithValue, }) => {
    console.log('inside actual defn of fetchAssignmentList');
    try {
        const response = await assignmentAPI.getAssignmentList(username, spaceId, subspaceId);
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
    isSpaceLoading: false,
    isSubspaceLoading: false,
    isAssignmentLoading: false,
    isSpaceError: false,
    spaceErrorMessage: '',
    spaceSideBarData: null,
    subspaceSideDrawerData: {},
    spaceDetails: {},
    assignmentList: {},

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
                state.isSubspaceLoading = true;
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
                state.isSubspaceLoading = false;
            })
            .addCase(fetchSubspaceSideDrawer.rejected, (state, action) => {
                state.isSpaceError = true;
                state.spaceErrorMessage = action.payload.error;
                state.isSubspaceLoading = false;
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
                state.isSpaceError = false;
            })
            .addCase(fetchAssignmentList.fulfilled, (state, action) => {
                if (!state.assignmentList) {
                    state.assignmentList = {};
                }
                state.assignmentList = {
                    ...state.assignmentList,
                    [action.payload.subspaceId]: action.payload.data
                };
                state.isSpaceError = false;
                state.spaceErrorMessage = '';
                state.isAssignmentLoading = false;
            })
            .addCase(fetchAssignmentList.rejected, (state, action) => {
                state.isSpaceError = true;
                state.spaceErrorMessage = action.payload.error;
                state.isAssignmentLoading = false;
            })
    }
})

export const { clearSpaceErrorMessage } = spaceSlice.actions

export default spaceSlice.reducer