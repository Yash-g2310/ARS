import axiosInstance from "../../utils/axiosInstance";

export const assignmentAPI = {
    // assignment list
    getAssignmentList : (username,spaceId,subSpaceId) => axiosInstance.get(`/${username}/${spaceId}/${subSpaceId}/`),

    // create assignment

    createAssignment : (username,spaceId,subSpaceId) => axiosInstance.get(`/${username}/${spaceId}/${subSpaceId}/create-assignment/`)
}