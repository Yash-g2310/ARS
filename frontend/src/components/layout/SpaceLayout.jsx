import React, { useEffect, useState } from 'react'
import NotActive from '../common/NotActive';
import { Outlet, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSubspaceSideDrawer, fetchSpaceDetails } from '../../features/space/spaceSlice';
import SubspaceSideDrawer from './SubspaceSideDrawer';
import UserProfile from '../dashboard/UserProfile';
import { space } from 'postcss/lib/list';
import { useNavigate } from 'react-router-dom';


const SpaceLayout = () => {
    console.log('in SpaceLayout')
    const navigate = useNavigate();
    const [componentState, setComponentState] = useState({
        showSpaceDetails: false,
        // show
    });
    const { spaceId } = useParams();
    if (!spaceId) return <div>SpaceId not found</div>
    const username = localStorage.getItem('username');
    // console.log('spaceId', spaceId);
    const dispatch = useDispatch();
    const {
        subspaceSideDrawerData,
        isSubSpaceLoading,
        isError,
        errorMessage,
        isSpaceLoading,
        spaceDetails
    } = useSelector(state => state.space);

    useEffect(() => {
        if (spaceId) {
            fetchSubspaces(spaceId, username);
            fetchSpaceDetailsData(spaceId, username);
        }
    }, [dispatch, spaceId]);

    const fetchSubspaces = async (spaceId, username) => {
        try {
            if (spaceId) {
                const hasData = subspaceSideDrawerData && subspaceSideDrawerData[spaceId];
                if (username && spaceId && !hasData) {
                    await dispatch(fetchSubspaceSideDrawer({ username, spaceId })).unwrap();
                }
            }
        } catch (error) {
            console.error('Failed to fetch subspaces:', error);
        }
    };

    const fetchSpaceDetailsData = async (spaceId, username) => {
        try {
            if (spaceId) {
                const hasData = spaceDetails && spaceDetails[spaceId];
                if (username && spaceId && !hasData) {
                    await dispatch(fetchSpaceDetails({ username, spaceId })).unwrap();
                }
            }
        } catch (error) {
            console.error('Failed to fetch space details:', error);
        }
    };
    useEffect(() => {
        if (componentState.showSpaceDetails) {
            navigate(`/spaces/${spaceId}/details/`);
        }
        else {
            navigate(`/spaces/${spaceId}/`);
        }
    }, [componentState.showSpaceDetails])

    const subspaces = subspaceSideDrawerData?.[spaceId] || [];
    const spaceDetail = spaceDetails?.[spaceId] || {};

    if (isSubSpaceLoading || isSpaceLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {errorMessage}</div>;

    return (
        <div className='flex flex-row'>
            <div className='w-1/6 min-w-[calc(100%/6)] max-w-[calc(100%/6)] bg-[#2f3133] border-r border-gray-500 h-screen overflow-auto [&::-webkit-scrollbar]:hidden'>
                <SubspaceSideDrawer subspaces={subspaces} spaceDetail={spaceDetail} componentState={componentState} setComponentState={setComponentState} />
            </div>
            <Outlet context={{
                spaceDetail: spaceDetail,
            }} />
        </div>
    )
}

export default SpaceLayout
