import React, { useEffect, useState } from 'react'
import NotActive from '../common/NotActive';
import { Outlet, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSubspaceSideDrawer, fetchSpaceDetails } from '../../features/space/spaceSlice';
import SubspaceSideDrawer from './SubspaceSideDrawer';
import UserProfile from '../dashboard/UserProfile';


const SpaceLayout = () => {
    const [componentState, setComponentState] = useState({
        showSpaceDetails: false,
        // show
    });
    const { spaceId } = useParams();
    const dispatch = useDispatch();
    const {
        subspaceSideDrawerData,
        isSubspaceLoading,
        isError,
        errorMessage,
        isLoading,
        spaceDetails
    } = useSelector(state => state.space);

    useEffect(() => {
        const fetchSubspaces = async () => {
            try {
                const username = localStorage.getItem('username');
                const hasData = subspaceSideDrawerData && subspaceSideDrawerData[spaceId];
                if (username && spaceId && !hasData) {
                    await dispatch(fetchSubspaceSideDrawer({ username, spaceId })).unwrap();
                }
            } catch (error) {
                console.error('Failed to fetch subspaces:', error);
            }
        };

        fetchSubspaces();
    }, [dispatch, spaceId]);

    useEffect(() => {
        const fetchSpaceDetailsData = async () => {
            try {
                const username = localStorage.getItem('username');
                const hasData = spaceDetails && spaceDetails[spaceId];
                if (username && spaceId && !hasData) {
                    await dispatch(fetchSpaceDetails({ username, spaceId })).unwrap();
                }
            } catch (error) {
                console.error('Failed to fetch space details:', error);
            }
        };

        fetchSpaceDetailsData();
    }, [dispatch, spaceId]);

    if (isSubspaceLoading || isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>{errorMessage}</div>;
    }

    const subspaces = subspaceSideDrawerData?.[spaceId] || [];
    const spaceDetail = spaceDetails?.[spaceId] || {};

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {errorMessage}</div>;
    
    return (
        <div className='flex flex-row'>
            <div className='w-1/6 min-w-[calc(100%/6)] max-w-[calc(100%/6)] bg-[#2f3133] border-r border-gray-500 h-screen overflow-auto [&::-webkit-scrollbar]:hidden'>
                <SubspaceSideDrawer subspaces ={subspaces} spaceDetail={spaceDetail} componentState={componentState} setComponentState={setComponentState}/>
            </div>
            <div className='flex flex-col w-5/6 min-w-[calc(500%/6)] max-w-[calc(500%/6)] h-screen '>
                <div className='w-full h-10 min-h-10 border-b border-gray-500 bg-backg_1 text-light_gray text-left px-4 flex items-center '>
                    <div className='flex flex-row gap-2 items-center'>
                        <img src="/assets/svg/hashtag.svg" className='w-6 h-6 ' alt="" />
                        <h1 className='font-semibold text-2xl tracking-wide'>
                            {componentState.showSpaceDetails ? 'Space Details' : spaceDetail.space_name || 'Space Name'}
                        </h1>
                    </div>
                </div>
                <div className='flex flex-row h-[calc(100vh-2.5rem)] bg-backg_1'>
                    {console.log('spaceDetail', spaceDetail)}
                    <div className='bg-backg_1 grow overflow-auto h-full border-r border-gray-500 border-r[50%]'>
                            <Outlet context={{
                                spaceDetail: spaceDetail,
                            }}/>
                    </div>
                    <div className="max-w-[calc(200%/5)] min-w-[calc(200%/5)] h-full overflow-auto [&::-webkit-scrollbar]:hidden">
                            <NotActive />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SpaceLayout
