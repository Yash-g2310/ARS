import axiosInstance from "../utils/axiosInstance";

export const fetchUserData = async () => {
    const username = localStorage.getItem('username');

    try{
        const response = await axiosInstance.get(`/${username}/profile/`);
        if(response.status === 200){
            return response.data;
        }
    } catch(error){
        console.error('Error fetching data:', error);
    }
}
