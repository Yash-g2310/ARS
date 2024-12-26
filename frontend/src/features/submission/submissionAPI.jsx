import axiosInstance from "../../utils/axiosInstance";

export const submissionAPI = {
    // submission status
    getSubmissionStatus : (username,spaceId,subSpaceId,assignmentId) => axiosInstance.get(`/${username}/${spaceId}/${subSpaceId}/${assignmentId}/status/`),
}