import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { dashboardAPI } from './dashBoardAPI';

//Thunks 
export const fetchAssignments = createAsyncThunk('dashboard/fetchAssignments', async (_,{rejectWithValue})=>{
    try{
        const username = localStorage.getItem('username');
        const responseReviewee = await dashboardAPI.getRevieweeAssignments(username);
        const responseReviewer = await dashboardAPI.getReviewerAssignments(username);
        return {revieweeAssignments: responseReviewee.data, reviewerAssignments: responseReviewer.data};
    } catch (error){
        return rejectWithValue(error.response.data);
    }
})

const initialState = {
    loadingAssignments: false,
    isAssignmentError: false,
    assignmentErrorMessage: null,
    revieweeAssignments: [],
    reviewerAssignments: [],
}

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAssignments.pending, (state, action) => {
                state.loadingAssignments = true;
            })
            .addCase(fetchAssignments.fulfilled, (state, action) => {
                state.loadingAssignments = false;
                state.revieweeAssignments = action.payload.revieweeAssignments;
                state.reviewerAssignments = action.payload.reviewerAssignments;
            })
            .addCase(fetchAssignments.rejected, (state, action) => {
                state.loadingAssignments = false;
                state.isAssignmentError = true;
                state.assignmentErrorMessage = action.payload;
            })    }
})

export const {  } = dashboardSlice.actions

export default dashboardSlice.reducer