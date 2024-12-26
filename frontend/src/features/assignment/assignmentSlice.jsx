import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { assignmentAPI } from './assignmentAPI'

//Thunks 
export const fetchAssignmentDetails = createAsyncThunk('assignment/fetchAssignmentDetails', async ({ username, spaceId, subSpaceId, assignmentId }, { rejectWithValue, }) => {
    try {
        const response = await assignmentAPI.getAssignmentDetails(username, spaceId, subSpaceId, assignmentId);
        console.log(response.data);
        return {
            assignmentId: assignmentId,
            data: response.data
        };
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

export const fetchAssignmentMembers = createAsyncThunk('assignment/fetchAssignmentMembers', async ({ username, spaceId, subSpaceId, assignmentId }, { rejectWithValue, }) => {
    try {
        const response = await assignmentAPI.getAssignmentMembers(username, spaceId, subSpaceId, assignmentId);
        console.log(response.data);
        return {
            assignmentId: assignmentId,
            data: response.data
        };
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})


const initialState = {
    isAssignmentLoading: false,
    isAssignmentError: false,
    assignmentErrorMessage: '',
    assignmentList: null,
    assignmentDetails: {},
    assignmentMembers: {},

    activeTab: 'details',
}

const assignmentSlice = createSlice({
    name: 'assignment',
    initialState,
    reducers: {
        clearAssignmentErrorMessage: (state) => {
            state.isAssignmentError = false;
            state.assignmentErrorMessage = '';
        },
        setActiveTab: (state, action) => {
            state.activeTab = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAssignmentDetails.pending, (state) => {
                state.isAssignmentLoading = true;
                state.isAssignmentError = false;
            })
            .addCase(fetchAssignmentDetails.fulfilled, (state, action) => {
                if (!state.assignmentDetails) {
                    state.assignmentDetails = {};
                }
                state.assignmentDetails = {
                    ...state.assignmentDetails,
                    [action.payload.assignmentId]: action.payload.data
                };
                state.isAssignmentError = false;
                state.assignmentErrorMessage = '';
                state.isAssignmentLoading = false;
            })
            .addCase(fetchAssignmentDetails.rejected, (state, action) => {
                state.isAssignmentError = true;
                state.assignmentErrorMessage = action.payload.error;
                state.isAssignmentLoading = false;
            })
            .addCase(fetchAssignmentMembers.pending, (state) => {
                state.isAssignmentLoading = true;
                state.isAssignmentError = false;
            })
            .addCase(fetchAssignmentMembers.fulfilled, (state, action) => {
                if (!state.assignmentMembers) {
                    state.assignmentMembers = {};
                }
                state.assignmentMembers = {
                    ...state.assignmentMembers,
                    [action.payload.assignmentId]: action.payload.data
                };
                state.isAssignmentError = false;
                state.assignmentErrorMessage = '';
                state.isAssignmentLoading = false;
            })
            .addCase(fetchAssignmentMembers.rejected, (state, action) => {
                state.isAssignmentError = true;
                state.assignmentErrorMessage = action.payload.error;
                state.isAssignmentLoading = false;
            })

    }
})

export const { clearAssignmentErrorMessage, setActiveTab } = assignmentSlice.actions

export default assignmentSlice.reducer