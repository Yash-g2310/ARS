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

    getSubspaceDetails: (username, spaceId, subspaceId) => axiosInstance.get(`/${username}/${spaceId}/${subspaceId}/details/`),
    
    getSubspaceMembers: (username, spaceId, subspaceId) => axiosInstance.get(`/${username}/${spaceId}/${subspaceId}/members/`),



}