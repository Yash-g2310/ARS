import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { assignmentAPI } from './assignmentAPI'

//Thunks 


const initialState = {
    isAssignmentLoading: false,
    isAssignmentError: false,
    assignmentErrorMessage: '',
    assignmentList: null,
    assignmentDetails: {},
}

const assignmentSlice = createSlice({
    name: 'assignment',
    initialState,
    reducers: {
        clearAssignmentErrorMessage: (state) => {
            state.isAssignmentError = false;
            state.assignmentErrorMessage = '';
        }
    },
    extraReducers: (builder) => {
        builder
            
    }
})

export const { clearAssignmentErrorMessage } = assignmentSlice.actions

export default assignmentSlice.reducer