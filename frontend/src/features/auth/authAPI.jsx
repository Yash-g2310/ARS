import { get } from "react-hook-form"
import axiosInstance from "../../utils/axiosInstance"

export const authAPI = {
    //session
    checkSession: () => axiosInstance.get('/session/'),
    //auth
    login: (credentials) => axiosInstance.post('/auth/login/', credentials),
    register: (userData) => axiosInstance.post('/auth/register/', userData),
    logout: () => axiosInstance.post('/auth/logout/'),
    //channeli auth
    channeliLogin: () => axiosInstance.get('/auth/channeli/'),
    //profile
    getProfile: (username) => axiosInstance.get(`/auth/${username}/profile/`),
    updateProfile: (username, data) => axiosInstance.put(`/auth/${username}/profile/`, data),
    //password
    changePassword: (username, password) => axiosInstance.put(`/auth/${username}/password/`, password),
    //username
    changeUsername: (username, newUsername) => axiosInstance.put(`/auth/${username}/username/`, newUsername),
    //assignments
    getRevieweeAssignments: (username) => axiosInstance.get(`/auth/${username}/assignments/reviewee/`),
    getReviewerAssignments: (username) => axiosInstance.get(`/auth/${username}/assignments/reviewer/`),
    //deleteUser
    deleteUser: (username) => axiosInstance.delete(`/auth/${username}/delete/`),
}