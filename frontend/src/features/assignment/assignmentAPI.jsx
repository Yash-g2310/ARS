import axiosInstance from "../../utils/axiosInstance";

export const assignmentAPI = {
    // assignment list
    getAssignmentList : (username,spaceId,subSpaceId) => axiosInstance.get(`/${username}/${spaceId}/${subSpaceId}/`),

    // create assignment
    createAssignment : (username,spaceId,subSpaceId) => axiosInstance.get(`/${username}/${spaceId}/${subSpaceId}/create-assignment/`),

    // assignment details
    getAssignmentDetails : (username,spaceId,subSpaceId,assignmentId) => axiosInstance.get(`/${username}/${spaceId}/${subSpaceId}/${assignmentId}/details/`),

    // assignment members 
    getAssignmentMembers : (username,spaceId,subSpaceId,assignmentId) => axiosInstance.get(`/${username}/${spaceId}/${subSpaceId}/${assignmentId}/members/`),
}