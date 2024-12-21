import React, { useEffect } from 'react'
import { Outlet } from "react-router-dom";
import SpaceSideBar from "./SpaceSideBar";
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../../features/auth/authSlice';
import { fetchSpaceSideBarData } from '../../features/space/spaceSlice';


const MainLayout = () => {
    const dispatch = useDispatch()
    const { user, isLoading, isError, errorMessage } = useSelector(state => state.auth)
    const { spaceSideBarData, isSpaceLoading, isSpaceError, spaceErrorMessage } = useSelector(state => state.space)
    useEffect(() => {
        // console.log('checking user profile');
        if (user === null) {
            // console.log('fetching user profile');
            const fetchUserProfileData = async () => {
                // console.log('inside fetchUserProfileData');
                try {
                    await dispatch(fetchUserProfile()).unwrap();
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                }
            }
            fetchUserProfileData();
            // console.log('user profile fetched');
        }
    }, [dispatch])
    console.log('in MainLayout')

    useEffect(() => {
        // console.log('checking space sidebar data');
        const getSpaceSidebarData = async () => {
            // console.log('inside getSpaceSidebarData ie data is fetching');
            try {
                const username = localStorage.getItem('username')
                await dispatch(fetchSpaceSideBarData(username)).unwrap()
                // console.log('space sidebar data fetched')
            } catch (error) {
                console.error('Error fetching space sidebar data:', error)
            }
        }
        if (spaceSideBarData === null)
            getSpaceSidebarData()
    }, [dispatch])

    if (isLoading || isSpaceLoading) return <div>Loading...</div>
    if (isError) return <div>error: {errorMessage}</div>
    if (isSpaceError) return <div>space error: {spaceErrorMessage}</div>
    return (
        <div className='flex flex-row w-screen h-screen' >
            <div className="w-16 h-auto border-r border-gray-600">
                <SpaceSideBar />
            </div>
            <div className="grow h-full overflow-auto">
                <Outlet />
            </div>
        </div>
    )
}

export default MainLayout