import React, { useEffect } from 'react';
import NotActive from '../common/NotActive';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchSubSpaceDetails, fetchAssignmentList } from '../../features/space/spaceSlice';

const SubSpaceDetailComponent = () => {
    console.log('in SubSpaceDetailComponent');
    const { spaceId, subSpaceId } = useParams();
    const dispatch = useDispatch();
    const { subSpaceDetails, isSubSpaceError, subSpaceErrorMessage, isSubSpaceLoading, spaceDetails, assignmentList, assignmentErrorMessage, isAssignmentLoading, isAssignmentError } = useSelector(state => state.space);
    const username = localStorage.getItem('username');

    useEffect(() => {
        if (spaceId && subSpaceId) {
            fetchSubSpaceDetailsData(spaceId, username, subSpaceId);
            fetchAssignments(username, spaceId, subSpaceId);
        }
    }, [dispatch, subSpaceId, spaceId, username]);

    const fetchSubSpaceDetailsData = async (spaceId, username, subSpaceId) => {
        try {
            if (spaceId && subSpaceId) {
                const hasData = subSpaceDetails && subSpaceDetails[subSpaceId];
                if (username && spaceId && subSpaceId && !hasData) {
                    await dispatch(fetchSubSpaceDetails({ username, spaceId, subSpaceId })).unwrap();
                }
            }
        } catch (error) {
            console.error('Failed to fetch space details:', error);
        }
    };

    const fetchAssignments = async (username, spaceId, subSpaceId) => {
        if (subSpaceId && spaceId && !assignmentList?.[subSpaceId]) {
            console.log('calling fetching assignments')
            try {
                await dispatch(fetchAssignmentList({ username, spaceId, subSpaceId })).unwrap();
            } catch (error) {
                console.error('Error fetching assignments:', error);
            }
        }
    };

    if (isSubSpaceLoading || isAssignmentLoading) return (<div> subspace details and assignment Loading... </div>);
    if (isSubSpaceError) return (<div>error while getting subspace details: {subSpaceErrorMessage}</div>);
    if (isAssignmentError) return (<div>error while getting assignments: {assignmentErrorMessage}</div>);

    const subSpaceDetail = subSpaceDetails?.[subSpaceId] || {};
    const spaceDetail = spaceDetails?.[spaceId] || {};
    const subSpaceAssignmentList = assignmentList?.[subSpaceId] || [];
    console.log(subSpaceDetail);
    console.log(subSpaceAssignmentList);

    return (
        <div className='flex flex-col w-5/6 min-w-[calc(500%/6)] max-w-[calc(500%/6)] h-screen '>
            <div className='w-full h-14 min-h-14 border-b border-gray-500 bg-backg_1 text-light_gray text-left px-4 flex items-center '>
                <div className='flex flex-row gap-2 items-center'>
                    <img src="/assets/svg/hashtag.svg" className='w-6 h-6 ' alt="" />
                    <h1 className='font-semibold text-2xl tracking-wide'>
                        Sub Space Detail
                    </h1>
                </div>
            </div>

            <div className='flex flex-row h-[calc(100vh-3.5rem)] bg-backg_1'>
                <div className='bg-backg_1 grow overflow-auto h-full border-r border-gray-500 border-r[50%]'>
                    <div className='bg-backg_1 flex flex-col p-2 w-lg h-full text-left overflow-auto'>
                        <div className='bg-backg_dark rounded-md overflow-auto [&::-webkit-scrollbar]:hidden mt-2 h-full'>
                            <div className='bg-black rounded-t-md max-h-28 overflow-hidden h-full'>
                                {spaceDetail?.space_background && <img src={`${spaceDetail?.space_background}`} className='w-full text-white rounded-t-md' alt="banner-image" />}
                            </div>
                            <div className='flex flex-row justify-between px-8 items-center my-2 '>
                                <div className='flex flex-row items-center gap-3'>
                                    <div className='w-14 h-14'>
                                        {spaceDetail?.space_profile === null ? (
                                            <div className='w-14 h-14 bg-button_purple rounded-full text-xl text-white flex items-center justify-center'>
                                                {spaceDetail?.space_name.charAt(0).toUpperCase()}
                                            </div>
                                        ) : (
                                            <img src={`${spaceDetail?.space_profile}`} alt="profile-image" className='w-full h-full rounded-full' />
                                        )}
                                    </div>
                                    <h2 className='text-white font-roboto tracking-wider font-semibold'>{spaceDetail?.space_name}</h2>
                                </div>
                            </div>
                            <div className='text-left p-2 mx-4 items-center px-2 gap-2 mt-2 text-light_white'>
                                <h2><span className='text-[#FAA61A] '>Sub Space Name:  </span> {subSpaceDetail?.sub_space_name}</h2>
                            </div>

                            <div className='text-white bg-backg_1 mx-3 my-2 px-3 pt-2 rounded-md'>
                                <h3 className='tracking-wider text-light_white bg-[#252428] px-2 rounded-md py-1'>Details</h3>
                                <div className='px-4 flex flex-row justify-between items-center '>
                                    <div className='my-2 min-w-[calc(100%/2)]'>
                                        <h3 className='text-light_gray text-left text-sm/4 tracking-wide'>Description</h3>
                                        <p className='text-light_white text-left  text-sm/2 tracking-wide font-light'>{subSpaceDetail?.sub_space_bio}</p>
                                    </div>
                                    <div className='bg-[#202225] p-2 rounded-md m-2 min-w-[calc(100%/2)] px-4'>
                                        <div className='flex flex-col justify-between items-start'>
                                            <div className='my-2'>
                                                <h3 className='text-[#FAA61A] text-left font-sans'>Created By</h3>
                                                <div className='flex flex-row gap-2 items-center'>
                                                    {spaceDetail?.owner_profile_pic === '' ? (
                                                        <div className='w-8 h-8 bg-button_purple rounded-full flex items-center justify-center'>
                                                            {spaceDetail?.owner_username.charAt(0).toUpperCase()}
                                                        </div>) : (
                                                        <img src={`${import.meta.env.VITE_API_BASE_URL}/${spaceDetail?.owner_profile_pic}`} alt="profile-image" className='w-8 h-8 rounded-full' />
                                                    )
                                                    }
                                                    <p className='text-light_white text-left font-light'>{spaceDetail?.owner_username}</p>
                                                </div>
                                            </div>
                                            <div className='my-2'>
                                                <h3 className='text-[#FAA61A] text-left font-sans'>Details</h3>
                                                <div className='flex flex-row gap-2 '>
                                                    <p className='text-light_white text-left font-light'>creation date: </p>
                                                    <p className='text-light_white text-left font-light'>{new Date(subSpaceDetail?.create_date).toLocaleDateString()}</p>
                                                </div>
                                                <div className='flex flex-row gap-2'>
                                                    <p className='text-light_white text-left font-light'>reviewer count: </p>
                                                    <p className='text-light_white text-left font-light'>{subSpaceDetail.reviewer_count}</p>
                                                </div>
                                                <div className='flex flex-row gap-2'>
                                                    <p className='text-light_white text-left font-light'>reviewee count: </p>
                                                    <p className='text-light_white text-left font-light'>{subSpaceDetail.reviewee_count}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='text-white bg-backg_1 mx-3 my-2 px-3 py-2 rounded-md '>
                                <div className='flex justify-between items-center mb-4 '>
                                    <h3 className='tracking-wider text-light_white bg-[#252428] px-2 rounded-md w-full py-1'>Reviewers ({subSpaceDetail.reviewer_count})</h3>
                                </div>
                                <div className='px-4 grid grid-cols-2 gap-4 max-h-52 overflow-y-auto [&::-webkit-scrollbar]:hidden'>
                                    {subSpaceDetail.reviewers_list?.map((reviewer) => (
                                        <div key={reviewer.space_member_id}
                                            className='flex items-center gap-3 p-2 rounded-md bg-[#202225] hover:bg-[#2f3136] transition-colors'>
                                            <div className='w-8 h-8 bg-button_purple rounded-full flex items-center justify-center'>
                                                {reviewer.username.charAt(0).toUpperCase()}
                                            </div>
                                            <span className='text-light_white text-sm'>{reviewer.username}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className='text-white bg-backg_1 mx-3 my-2 px-3 py-2 rounded-md'>
                                <div className='flex justify-between items-center mb-4'>
                                    <h3 className='tracking-wider text-light_white bg-[#252428] px-2 rounded-md w-full py-1'>Reviewees ({subSpaceDetail.reviewee_count})</h3>
                                </div>
                                <div className='px-4 grid grid-cols-2 gap-4 max-h-52 overflow-y-auto [&::-webkit-scrollbar]:hidden'>
                                    {subSpaceDetail.reviewees_list?.map((reviewee) => (
                                        <div key={reviewee.space_member_id}
                                            className='flex items-center gap-3 p-2 rounded-md bg-[#202225] hover:bg-[#2f3136] transition-colors'>
                                            <div className='w-8 h-8 bg-button_purple rounded-full flex items-center justify-center'>
                                                {reviewee.username.charAt(0).toUpperCase()}
                                            </div>
                                            <span className='text-light_white text-sm'>{reviewee.username}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="max-w-[calc(200%/5)] min-w-[calc(200%/5)] h-full overflow-auto [&::-webkit-scrollbar]:hidden">
                    <div className='bg-backg_dark rounded-md overflow-auto [&::-webkit-scrollbar]:hidden m-2 rounder-md '>
                        <div className='text-white bg-backg_1 mx-3 my-2 px-3 py-2 rounded-md'>
                            <div className='flex justify-between items-center mb-4'>
                                <h3 className='tracking-wider text-light_white bg-[#252428] px-2 rounded-md w-full py-1'>
                                    Assignments ({subSpaceAssignmentList.length})
                                </h3>
                            </div>
                            <div className='px-4 flex flex-col gap-4 overflow-y-auto [&::-webkit-scrollbar]:hidden'>
                                {subSpaceAssignmentList.map((assignment) => (
                                    <div className='pl-2 bg-purple-500/50 rounded-lg'>
                                        <div key={assignment.assignment_id}
                                            className='flex flex-col gap-2 p-3 rounded-md bg-[#202225] hover:bg-[#2f3136] transition-colors'>
                                            <div className='flex items-center justify-between'>
                                                <div className='max-w-full'>
                                                    <span
                                                        className='text-light_white text-sm font-medium truncate block'
                                                        title={assignment.title}
                                                    >
                                                        {assignment.title}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className='text-light_gray text-xs'>
                                                <span className='text-orange-400'>Upload Date: </span> {new Date(assignment.upload_date).toLocaleDateString()}
                                            </div>
                                            <div className='text-light_gray text-xs'>
                                                <span className='text-orange-400'>Role: </span> {assignment.role}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {subSpaceAssignmentList.length === 0 && (
                                    <div className='col-span-2 text-light_gray/70 text-sm text-center py-4'>
                                        No assignments available
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubSpaceDetailComponent;