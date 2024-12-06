import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import SideDrawer from './SideDrawer'
import NotActive from '../common/NotActive';
import { fetchUserData } from '../../services/api';
import UserProfile from '../UserProfile';

const DashboardLayout = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [userData, setUserData] = useState(null)
    const [componentState, setComponentState] = useState({
        showProfile: false,
        showDetails: false,
    })

    const toggleComponentState = (component) => {
        setComponentState(prev => ({
            ...prev,
            [component]: !prev[component]
        }));
    };

    useEffect(() => {
        let mounted = true;

        const getData = async () => {
            try {
                const response = await fetchUserData();
                if (mounted && response) {
                    setUserData(response);
                }
            } catch (error) {
                if (mounted) {
                    setError(error);
                }
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        };

        getData();

        return () => {
            mounted = false;
        };
    }, []);


    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;


    return (
        <div className='flex flex-row w-full'>
            <div className='w-1/6 bg-[#2f3133] border-r border-gray-500 h-screen overflow-auto [&::-webkit-scrollbar]:hidden'>
                <SideDrawer userData={userData} toggleComponentState={toggleComponentState} />
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

                        {componentState.showProfile ? (
                            <UserProfile userData={userData} className='overflow-y-auto' />
                        ) : (
                            <NotActive />
                        )}
                    </div>
                    <div className=" w-1/3 min-w-[calc(200%/5)] h-full overflow-y-auto [&::-webkit-scrollbar]:hidden">
                        <NotActive />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardLayout
