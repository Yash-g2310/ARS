import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SpaceSideBar from '../components/layout/SpaceSideBar'
import UserProfile from '../components/dashboard/UserProfile'
import NotActive from '../components/common/NotActive'
import SideDrawer from '../components/layout/SideDrawer'
import axios from 'axios'

const Dashboard = () => {
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [userSpaceData, setUserSpaceData] = useState()
    const [componentState, setComponentState] = useState({
        viewProfile: true,
    })
    const navigate = useNavigate()

    useEffect(() => {

        const fetchData = async () => {
            const username = localStorage.getItem('username')
            const csrfToken = getCookie('csrftoken')
            console.log(username)
            console.log(csrfToken)
            try {
                const sessionResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/session/`, {
                    withCredentials: true,
                    headers: {
                        'X-CSRFToken': csrfToken,
                    },
                })
                if (!sessionResponse.data.session) {
                    console.log('No session found');
                    navigate('/');
                    return;
                }

                if (!username) {
                    console.log('No username found')
                    navigate('/')
                    return
                }

                setLoading(true)
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/${username}/profile/`, {
                    withCredentials: true,
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken'),
                    },
                })
                setUserData(response.data)

                const spaceResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/${username}/`, {
                    withCredentials: true,
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken'),
                    },
                })
                setUserSpaceData(spaceResponse.data)
                console.log(spaceResponse.data)
            } catch (error) {
                console.error('Error fetching data:', error)
                if (error.response && error.response.status === 403) {
                    console.log('CSRF token expired or session expired')
                    navigate('/')
                }
            } finally {
                setLoading(false)
            }


        }
        fetchData()
        setComponentState({ ...componentState, viewProfile: true })
    }, [navigate])

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className='flex flex-row'>
            <div className=" w-fit  h-auto border-r border-gray-600">
                <SpaceSideBar componentState={componentState} setComponentState={setComponentState} />
            </div>
            <div className='w-1/6 bg-[#2f3133] border-r border-gray-500'>
                <SideDrawer/>
            </div>
            <div className='flex flex-col w-full h-screen '>
                <div className='w-full h-10 min-h-10 border-b border-gray-500 bg-backg_1 text-light_gray text-left px-4 flex items-center '>
                    <div className='flex flex-row gap-2 items-center'>
                        <img src="/assets/svg/hashtag.svg" className='w-6 h-6' alt="" />
                        <h1 className='font-semibold text-2xl tracking-wide'>Dashboard</h1>
                    </div>
                </div>
                <div className='flex flex-row h-[calc(100vh-2.5rem)] '>
                    <div className='bg-backg_1 grow overflow-y-auto h-full border-r border-gray-500 border-r[50%]'>
                        <NotActive />
                    </div>
                    <div className=" w-1/3 h-full overflow-y-auto">
                        {componentState.viewProfile && <UserProfile userData={userData} className='overflow-y-auto' />}
                    </div>
                </div>
            </div>
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
