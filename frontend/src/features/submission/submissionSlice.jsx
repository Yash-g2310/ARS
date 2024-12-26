import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { submissionAPI } from './submissionAPI';

//Thunks 
export const fetchAssignmentStatus = createAsyncThunk('submission/fetchAssignmentStatus', async ({ username, spaceId, subSpaceId, assignmentId }, { rejectWithValue, }) => {
    try {
        const response = await submissionAPI.getSubmissionStatus(username, spaceId, subSpaceId, assignmentId);
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
    isStatusLoading: false,
    isStatusError: false,
    statusErrorMessage: '',
    assignmentStatus: {},

    isSubmissionLoading: false,
    isSubmissionError: false,
    submissionErrorMessage: '',
}

const submissionSlice = createSlice({
    name: 'submission',
    initialState,
    reducers: {
        clearStatusErrorMessage: (state) => {
            state.isStatusError = false;
            state.statusErrorMessage = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAssignmentStatus.pending, (state) => {
                state.isStatusLoading = true;
                state.isStatusError = false;
            })
            .addCase(fetchAssignmentStatus.fulfilled, (state, action) => {
                if (!state.assignmentStatus) {
                    state.assignmentStatus = {};
                }
                state.assignmentStatus = {
                    ...state.assignmentStatus,
                    [action.payload.assignmentId]: action.payload.data
                };
                state.isStatusError = false;
                state.statusErrorMessage = '';
                state.isStatusLoading = false;
            })
            .addCase(fetchAssignmentStatus.rejected, (state, action) => {
                state.isStatusError = true;
                state.statusErrorMessage = action.payload.error;
                state.isStatusLoading = false;
            })

    }
})

export const { clearStatusErrorMessage } = submissionSlice.actions

export default submissionSlice.reducer