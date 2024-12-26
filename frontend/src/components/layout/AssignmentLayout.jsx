import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { use } from 'react'
import { fetchAssignmentDetails, setActiveTab } from '../../features/assignment/assignmentSlice'
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchAssignmentStatus } from '../../features/submission/submissionSlice'
import { Description, People, Assignment, Edit } from '@mui/icons-material';


const AssignmentLayout = () => {
    const { spaceId, subSpaceId, assignmentId } = useParams();
    const username = localStorage.getItem('username');
    const dispatch = useDispatch();
    const { assignmentDetails, isAssignmentLoading, isAssignmentError, assignmentErrorMessage, activeTab } = useSelector(state => state.assignment);
    const {assignmentStatus, isStatusLoading, isStatusError, statusErrorMessage} = useSelector(state => state.submission);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (username && spaceId && subSpaceId && assignmentId) {
            fetchAssignmentDetailsData(username, spaceId, subSpaceId, assignmentId);
            fetchAssignmentStatusData(username, spaceId, subSpaceId, assignmentId);
        }
    }, [dispatch, username, spaceId, subSpaceId, assignmentId])

    const fetchAssignmentDetailsData = async (username, spaceId, subSpaceId, assignmentId,) => {
        try {
            if (spaceId && subSpaceId && assignmentId) {
                const hasData = assignmentDetails && assignmentDetails[assignmentId];
                if (username && spaceId && subSpaceId && assignmentId && !hasData) {
                    await dispatch(fetchAssignmentDetails({ username, spaceId, subSpaceId, assignmentId })).unwrap();
                }
            }
        } catch (error) {
            console.error('Failed to fetch space details:', error);
        }
    };

    const fetchAssignmentStatusData = async (username, spaceId, subSpaceId, assignmentId,) => {
        try {
            if (spaceId && subSpaceId && assignmentId) {
                const hasData = assignmentStatus && assignmentStatus[assignmentId];
                if (username && spaceId && subSpaceId && assignmentId && !hasData) {
                    await dispatch(fetchAssignmentStatus({ username, spaceId, subSpaceId, assignmentId })).unwrap();
                }
            }
        } catch (error) {
            console.error('Failed to fetch space details:', error);
        }
    };

    const handleNavigation = (tab) => {
        dispatch(setActiveTab(tab));
        console.log(tab);
        // navigate(`/${spaceId}/${subSpaceId}/${assignmentId}/${tab}`);
    };

    const buttonClass = (tab) => `
        relative flex items-center gap-2 px-4 py-2 text-sm font-medium
        rounded-md backdrop-blur-sm
        ${activeTab === tab 
            ? `
                text-emerald-300
                bg-gradient-to-r from-emerald-950/50 to-emerald-900/50
                border border-emerald-500/20
                shadow-[0_0_15px_rgba(52,211,153,0.1)]
                before:absolute before:inset-0 
                before:bg-gradient-to-r before:from-emerald-500/10 before:to-transparent 
                before:rounded-md before:pointer-events-none
            ` 
            : `
                text-gray-400 
                hover:text-emerald-300
                hover:bg-gradient-to-r hover:from-emerald-950/30 hover:to-emerald-900/30
                hover:border hover:border-emerald-500/10
                border border-transparent
            `
        }
        transition-all duration-300 ease-in-out
        overflow-hidden
    `;

    if (isAssignmentLoading || isStatusLoading) return <div>Loading...</div>
    if (isAssignmentError) return <div>assignment error: {assignmentErrorMessage}</div>
    if (isStatusError) return <div>status error: {statusErrorMessage}</div>

    const assignmentDetail = assignmentDetails?.[assignmentId] || {};

    return (
        <div className='flex flex-col w-5/6 min-w-[calc(500%/6)] max-w-[calc(500%/6)] h-screen'>
            <div className='w-full h-14 min-h-14 border-b border-gray-500 bg-backg_1 text-light_gray px-4'>
                <div className='flex justify-between items-center h-full'>
                    <div className='flex items-center gap-2'>
                        <img src="/assets/svg/assignment_svg.svg" className='w-7 h-7' alt="" />
                        <h1 className='font-semibold text-2xl tracking-wide'>
                            {assignmentDetail.title}
                        </h1>
                    </div>
                    
                    <div className='flex items-center h-full'>
                        <button 
                            onClick={() => handleNavigation('details')}
                            className={buttonClass('details')}
                        >
                            <Description fontSize="small" />
                            Details
                        </button>

                        <button 
                            onClick={() => handleNavigation('members')}
                            className={buttonClass('members')}
                        >
                            <People fontSize="small" />
                            Members
                        </button>

                        {assignmentDetail?.current_user_role === 'reviewer' && (
                            <>
                                <button 
                                    onClick={() => handleNavigation('submissions')}
                                    className={buttonClass('submissions')}
                                >
                                    <Assignment fontSize="small" />
                                    Submissions
                                </button>

                                <button 
                                    onClick={() => handleNavigation('edit')}
                                    className={buttonClass('edit')}
                                >
                                    <Edit fontSize="small" />
                                    Edit
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <Outlet />
        </div>
    )
}

export default AssignmentLayout
