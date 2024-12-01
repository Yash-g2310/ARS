import React, { useState, useEffect } from 'react'
import SpaceSideBar from '../components/SpaceSideBar'
import UserProfile from '../components/UserProfile'
import axios from 'axios'

const Dashboard = () => {
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        const fetchData = async () => {
            const username = localStorage.getItem('username')
            // console.log(`${import.meta.env.VITE_API_BASE_URL}/${username}/profile/`)
            // console.log(username)
            // console.log(getCookie('csrftoken'))
            if (username) {
                try {
                    setLoading(true)
                    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/${username}/profile/`, {
                        withCredentials: true,
                        headers: {
                            'X-CSRFToken': getCookie('csrftoken'),
                        },
                    })
                    setUserData(response.data)
                    console.log(response.data)
                } catch (error) {
                    console.error('Error fetching data:', error)
                } finally{
                    setLoading(false)
                }
            }
            else {
                console.log('No username found')
                console.log('redirecting to login page')
                // navigate('/')
            }

        }
        fetchData()
    }, [])

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className='flex flex-row'>
            <SpaceSideBar />
            <UserProfile userData = {userData}/>
        </div>
    )
}

function getCookie(name) {
    let cookieValue = null;
    const cookies = document.cookie.split(';');
    if (document.cookie && document.cookie !== '') {
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export default Dashboard
