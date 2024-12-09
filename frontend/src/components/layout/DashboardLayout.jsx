import React, { useEffect, useState } from 'react'
// import { Outlet } from 'react-router-dom'
import SideDrawer from './SideDrawer'
import NotActive from '../common/NotActive';
import UserProfile from '../dashboard/UserProfile';
import { useSelector, useDispatch } from 'react-redux';
import DashboardAssignmentsLayout from '../dashboard/DashboardAssignmentsLayout';

const DashboardLayout = () => {
    const { user, revieweeAssignment, reviewerAssignment, isLoading, isError, errorMessage } = useSelector(state => state.auth);
    const dispatch = useDispatch();
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



    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {errorMessage}</div>;


    return (
        <div className='flex flex-row'>
            <div className='w-1/6 min-w-[calc(100%/6)] max-w-[calc(100%/6)] bg-[#2f3133] border-r border-gray-500 h-screen overflow-auto [&::-webkit-scrollbar]:hidden'>
                <SideDrawer userData={user} toggleComponentState={toggleComponentState} />
            </div>
            <div className='flex flex-col w-5/6 min-w-[calc(500%/6)] max-w-[calc(500%/6)] h-screen '>
                <div className='w-full h-10 min-h-10 border-b border-gray-500 bg-backg_1 text-light_gray text-left px-4 flex items-center '>
                    <div className='flex flex-row gap-2 items-center'>
                        <img src="/assets/svg/hashtag.svg" className='w-6 h-6' alt="" />
                        <h1 className='font-semibold text-2xl tracking-wide'>Dashboard</h1>
                    </div>
                </div>
                <div className='flex flex-row h-[calc(100vh-2.5rem)] bg-backg_1'>
                    <div className='bg-backg_1 grow overflow-auto h-full border-r border-gray-500 border-r[50%]'>

                        {componentState.showProfile ? (
                            <UserProfile userData={user} className='overflow-auto' />
                        ) : (
                            <NotActive />
                        )}
                    </div>
                    <div className="max-w-[calc(200%/5)] min-w-[calc(200%/5)] h-full overflow-auto [&::-webkit-scrollbar]:hidden">
                        {componentState.showDetails ? (
                            <DashboardAssignmentsLayout />
                        ) : (
                            <NotActive />
                        )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardLayout
