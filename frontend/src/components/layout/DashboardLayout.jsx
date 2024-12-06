import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import SideDrawer from './SideDrawer'
import NotActive from '../common/NotActive';
import { fetchUserData } from '../../services/api';

const DashboardLayout = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    useEffect(() => {
        try{
            setIsLoading(true)
            const getData = async() =>{
                const data = await fetchUserData()
                console.log(data)
            }
            getData()
        } catch(error){
            setError(error)
        } finally{
            setIsLoading(false)
        }
    }, [])

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;


    return (
        <div className='flex flex-row w-full '>
            <div className='w-1/6 bg-[#2f3133] border-r border-gray-500'>
                <SideDrawer />
            </div>
            <div className='flex flex-col w-full h-screen '>
                <div className='w-full h-10 min-h-10 border-b border-gray-500 bg-backg_1 text-light_gray text-left px-4 flex items-center '>
                    <div className='flex flex-row gap-2 items-center'>
                        <img src="/assets/svg/hashtag.svg" className='w-6 h-6' alt="" />
                        <h1 className='font-semibold text-2xl tracking-wide'>Dashboard</h1>
                    </div>
                </div>
                <div className='flex flex-row h-[calc(100vh-2.5rem)] bg-backg_1'>
                    <div className='bg-backg_1 grow overflow-y-auto h-full border-r border-gray-500 border-r[50%]'>
                        <Outlet />
                        {/* {componentState.viewProfile && <UserProfile userData={userData} className='overflow-y-auto' />} */}
                    </div>
                    <div className=" w-1/3 h-full overflow-y-auto">
                        <NotActive />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardLayout
