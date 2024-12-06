import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import { responsiveFontSizes } from "@mui/material";


export const channeliLogin = async (data) => {
    
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/channeli/`, {
            withCredentials: true,
            headers: {
                'X-CSRFToken': data.csrfToken,
            },
        });
        console.log(response);
        data = response.data;
        console.log(data);
        if (response.status == 200){
            const authUrl = `${data.auth_url}?client_id=${data.client_id}&redirect_uri=${data.redirect_uri}`;
            window.location.href = authUrl
        }
    }
    catch(error){
        console.error('Error fetching data:', error);
        if(error.response && error.response.status === 400){
            setErrorMessage("Invalid credentials. Please try again.")
        }
    }
}