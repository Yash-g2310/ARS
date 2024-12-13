import axiosInstance from "../../utils/axiosInstance";

export const assignmentAPI = {
    // assignment list
    getAssignmentList : (username,spaceId,subspaceId) => axiosInstance.get(`/${username}/${spaceId}/${subspaceId}/`),

    // create assignment

    createAssignment : (username,spaceId,subspaceId) => axiosInstance.get(`/${username}/${spaceId}/${subspaceId}/create-assignment/`)
}