import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext,useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'

const ChanneliCallback = () => {
    const navigate = useNavigate()
    const { isAuthenticated, setIsAuthenticated, login } = useContext(AuthContext)

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const username = params.get('username');
        const status = params.get('status')
        if(status=='success' && username){
            localStorage.setItem('username',username)
            // console.log("in callback------------------")
            // console.log(isAuthenticated)
            setIsAuthenticated(true);
            // console.log(isAuthenticated)
            login();
            // console.log(isAuthenticated)
            // console.log("exit callback------------------")
            // navigate('/dashboard')
        } else{
            navigate('/');
        }
    }, [])
    useEffect(() => {
        if(isAuthenticated) {
            // console.log("in callback------------------")
            // console.log('Auth state updated:', isAuthenticated);
            navigate('/dashboard');
        }
    }, [isAuthenticated])


    return (
        <div>Completing Login...</div>
    )
}

export default ChanneliCallback
