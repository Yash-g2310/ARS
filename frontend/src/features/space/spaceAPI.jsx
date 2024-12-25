import axiosInstance from '../../utils/axiosInstance';

export const spaceAPI = {
    // dashboard space icons
    getSpaceSidebar: (username) => axiosInstance.get(`/${username}/`),

    // get subspace dashboard
    getSubSpaceSideDrawer: (username,spaceId)=> {
        if(username && spaceId)
            return axiosInstance.get(`/${username}/${spaceId}/`)
    },
    
    // get space details
    getSpaceDetails: (username,spaceId)=> {
        if(username && spaceId)
            return axiosInstance.get(`/${username}/${spaceId}/details/`)
    },

    // create space
    createSpace: (username,spaceData) => axiosInstance.post(`/${username}/create-space/`,spaceData),

    // invite others
    inviteOthers: (username,spaceId,data) => axiosInstance.post(`/${username}/${spaceId}/invite-others/`,data),

    // request list
    getRequestList: (username,spaceId) => axiosInstance.get(`/${username}/${spaceId}/requests/`),
    //manage request

    // subspaces
    createSubspace: (username, spaceId, subspaceData) => axiosInstance.post(`/${username}/${spaceId}/create-subspace/`, subspaceData),

    getSubSpaceDetails: (username, spaceId, subSpaceId) => axiosInstance.get(`/${username}/${spaceId}/${subSpaceId}/details/`),
    
    getSubspaceMembers: (username, spaceId, subSpaceId) => axiosInstance.get(`/${username}/${spaceId}/${subSpaceId}/members/`),



}