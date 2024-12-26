import React from 'react'
import NotActive from '../common/NotActive'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { People, Group } from '@mui/icons-material';

const AssignmentMembers = () => {
    console.log('in AssignmentMembers')
    const { assignmentId } = useParams()
    const { assignmentMembers } = useSelector(state => state.assignment)
    const currentAssignmentMembers = assignmentMembers?.[assignmentId] || {};

    console.log(currentAssignmentMembers)

    return (
        <div className='flex flex-row h-[calc(100vh-3.5rem)] bg-backg_1'>
            <div className='bg-backg_1 grow overflow-auto h-full border-r border-gray-500'>
                <div className='bg-backg_1 flex flex-col p-2 w-lg h-full text-left overflow-auto'>
                    <div className='bg-backg_dark rounded-md overflow-auto [&::-webkit-scrollbar]:hidden mt-2 h-full'>
                        <div className='bg-gradient-to-br from-[#1A1B1E] to-[#2D2F34] p-[1px] rounded-lg mx-3 my-2'>
                            <div className='text-white bg-[#1A1B1E] px-4 py-3 rounded-lg'>
                                {/* Reviewers Section */}
                                <div className='mb-6'>
                                    <h3 className='flex items-center gap-3 mb-4'>
                                        <div className='relative'>
                                            <div className='absolute -inset-[1px] bg-gradient-to-r from-[#70B0FF] to-[#5A8FD9] rounded-full blur opacity-40'></div>
                                            <div className='relative bg-[#252428] p-2 rounded-full'>
                                                <People className='w-5 h-5 text-[#70B0FF]' />
                                            </div>
                                        </div>
                                        <span className='text-xl font-semibold tracking-wide text-light_white'>Reviewers</span>
                                    </h3>

                                    <div className='space-y-3 max-h-[calc(100vh-20rem)] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:bg-[#70B0FF]/20 hover:[&::-webkit-scrollbar-thumb]:bg-[#70B0FF]/40'>
                                        {currentAssignmentMembers.assignment_reviewers?.map((reviewer) => (
                                            <div key={reviewer?.id}
                                                className='group bg-gradient-to-r from-[#202225] to-[#2D2F34] p-[1px] rounded-lg hover:from-[#70B0FF] hover:to-[#5A8FD9] transition-all duration-300'>
                                                <div className='flex items-center justify-between p-3 rounded-lg bg-[#202225] hover:bg-[#202225]/95 transition-colors'>
                                                    <div className='flex items-center gap-4'>
                                                        {reviewer?.reviewer?.profile_photo ? (
                                                            <div className='relative'>
                                                                <div className='absolute -inset-[1px] bg-gradient-to-r from-[#70B0FF] to-[#5A8FD9] rounded-full blur opacity-40 group-hover:opacity-75 transition-opacity'></div>
                                                                <img src={`${import.meta.env.VITE_API_BASE_URL}/${reviewer?.reviewer?.profile_photo}`}
                                                                    alt={reviewer?.reviewer?.username}
                                                                    className='relative w-10 h-10 rounded-full object-cover ring-2 ring-[#70B0FF]/20 group-hover:ring-[#70B0FF]/40 transition-all'
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className='relative'>
                                                                <div className='absolute -inset-[1px] bg-gradient-to-r from-[#70B0FF] to-[#5A8FD9] rounded-full blur opacity-40 group-hover:opacity-75 transition-opacity'></div>
                                                                <div className='relative w-10 h-10 bg-gradient-to-br from-[#70B0FF] to-[#5A8FD9] rounded-full flex items-center justify-center ring-2 ring-[#70B0FF]/20 group-hover:ring-[#70B0FF]/40 transition-all'>
                                                                    <span className='text-white text-lg font-medium'>
                                                                        {reviewer?.reviewer?.username.charAt(0).toUpperCase()}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className='flex flex-col gap-1'>
                                                            <span className='text-light_white text-sm font-medium group-hover:text-white transition-colors'>
                                                                {reviewer?.reviewer?.username}
                                                            </span>
                                                            <span className='text-xs text-[#70B0FF]/60'>
                                                                Reviewer
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='bg-gradient-to-br from-[#1A1B1E] to-[#2D2F34] p-[1px] rounded-lg mx-3 my-2'>
                            <div className='text-white bg-[#1A1B1E] px-4 py-3 rounded-lg'>
                                {/* Reviewees Section */}
                                <div className='mb-6'>
                                    <h3 className='flex items-center gap-2 mb-4 text-light_white'>
                                        <div className='relative'>
                                            <div className='absolute -inset-[1px] bg-gradient-to-r from-[#70B0FF] to-[#5A8FD9] rounded-full blur opacity-40'></div>
                                            <div className='relative bg-[#252428] p-2 rounded-full'>
                                                <People className='w-5 h-5 text-[#70B0FF]' />
                                            </div>
                                        </div>
                                        <span className='text-xl font-semibold tracking-wide'>Reviewees</span>
                                    </h3>

                                    <div className='space-y-3 max-h-[calc(100vh-20rem)] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:bg-[#70B0FF]/20 hover:[&::-webkit-scrollbar-thumb]:bg-[#70B0FF]/40'>
                                        {currentAssignmentMembers.assignment_reviewees?.map((reviewee) => (
                                            <div key={reviewee?.id}
                                                className='group bg-gradient-to-r from-[#202225] to-[#2D2F34] p-[1px] rounded-lg  hover:from-[#70B0FF] hover:to-[#5A8FD9] transition-all duration-300'>
                                                <div className='flex items-center gap-4 p-3 rounded-lg bg-[#202225] 
                                                            hover:bg-[#202225]/95 transition-colors'>
                                                    {reviewee?.reviewee?.profile_photo ? (
                                                        <div className='relative'>
                                                            <div className='absolute -inset-[1px] bg-gradient-to-r from-[#70B0FF] to-[#5A8FD9] rounded-full blur opacity-40 group-hover:opacity-75 transition-opacity'></div>
                                                            <img src={`${import.meta.env.VITE_API_BASE_URL}/${reviewee?.reviewee?.profile_photo}`}
                                                                alt={reviewee?.reviewee?.username}
                                                                className='relative w-10 h-10 rounded-full object-cover ring-2 ring-[#70B0FF]/20 group-hover:ring-[#70B0FF]/40 transition-all' />
                                                        </div>
                                                    ) : (
                                                        <div className='relative'>
                                                            <div className='absolute -inset-[1px] bg-gradient-to-r from-[#70B0FF] to-[#5A8FD9] rounded-full blur opacity-40 group-hover:opacity-75 transition-opacity'></div>
                                                            <div className='relative w-10 h-10 bg-button_purple rounded-full flex items-center justify-center ring-2 ring-[#70B0FF]/20 group-hover:ring-[#70B0FF]/40 transition-all'>
                                                                <span className='text-white text-lg font-medium'>
                                                                    {reviewee?.reviewee?.username.charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className='flex flex-col gap-1'>
                                                        <span className='text-light_white text-sm font-medium group-hover:text-white transition-colors'>
                                                            {reviewee?.reviewee?.username}
                                                        </span>
                                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full w-fit flex items-center gap-1
                                                            ${reviewee.reviewee_status === 'completed'
                                                                ? 'bg-green-500/20 text-green-400'
                                                                : reviewee.reviewee_status === 'submitted'
                                                                    ? 'bg-[#70B0FF]/20 text-[#70B0FF]'
                                                                    : 'bg-yellow-500/20 text-yellow-400'
                                                            }`}
                                                        >
                                                            {/* Status Icon */}
                                                            {reviewee.reviewee_status === 'completed' ? (
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                            ) : reviewee.reviewee_status === 'submitted' ? (
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                </svg>
                                                            ) : (
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                            )}
                                                            {/* Status Text */}
                                                            {reviewee.reviewee_status === 'completed'
                                                                ? 'Completed'
                                                                : reviewee.reviewee_status === 'submitted'
                                                                    ? 'In Review'
                                                                    : 'Not Submitted'
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='text-white bg-backg_1 mx-3 my-2 px-3 py-2 rounded-md'>
                            {/* Teams Section */}
                            <div>
                                <h3 className='flex items-center gap-3 mb-4'>
                                    <div className='relative'>
                                        <div className='absolute -inset-[1px] bg-gradient-to-r from-[#70B0FF] to-[#5A8FD9] rounded-full blur opacity-40'></div>
                                        <div className='relative bg-[#252428] p-2 rounded-full'>
                                            <Group className='w-5 h-5 text-[#70B0FF]' />
                                        </div>
                                    </div>
                                    <span className='text-xl font-semibold tracking-wide text-light_white'>Teams</span>
                                </h3>

                                <div className='space-y-3 max-h-[calc(100vh-20rem)] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:bg-[#70B0FF]/20 hover:[&::-webkit-scrollbar-thumb]:bg-[#70B0FF]/40'>
                                    {currentAssignmentMembers.assignment_teams?.map((team) => (
                                        <div key={team.id}
                                            className='group bg-gradient-to-r from-[#202225] to-[#2D2F34] p-[1px] rounded-lg hover:from-[#70B0FF] hover:to-[#5A8FD9] transition-all duration-300'>
                                            <div className='flex flex-col gap-3 p-4 rounded-lg bg-[#202225] hover:bg-[#202225]/95 transition-colors'>
                                                <div className='flex justify-between items-center'>
                                                    <div className='flex items-center gap-2'>
                                                        <span className='text-light_white text-sm font-medium group-hover:text-white transition-colors'>
                                                            {team.team_name}
                                                        </span>
                                                        <span className='text-xs text-[#70B0FF]/60'>
                                                            ({team.members_list?.length || 0} members)
                                                        </span>
                                                    </div>
                                                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
                                                        ${team.team_status === 'completed'
                                                            ? 'bg-green-500/20 text-green-400'
                                                            : team.team_status === 'submitted'
                                                                ? 'bg-[#70B0FF]/20 text-[#70B0FF]'
                                                                : 'bg-yellow-500/20 text-yellow-400'
                                                        }`}
                                                    >
                                                        {/* Status Icon */}
                                                        {team.team_status === 'completed' ? (
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        ) : team.team_status === 'submitted' ? (
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                        ) : (
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        )}
                                                        {team.team_status === 'completed'
                                                            ? 'Completed'
                                                            : team.team_status === 'submitted'
                                                                ? 'In Review'
                                                                : 'Not Submitted'
                                                        }
                                                    </span>
                                                </div>

                                                <div className='pl-2 space-y-2'>
                                                    {team.members_list?.map((member) => (
                                                        <div key={member.id}
                                                            className='group/member flex items-center gap-3 p-2 rounded-md hover:bg-[#70B0FF]/5 transition-colors'>
                                                            {member?.member?.profile_photo ? (
                                                                <div className='relative'>
                                                                    <div className='absolute -inset-[1px] bg-gradient-to-r from-[#70B0FF] to-[#5A8FD9] rounded-full blur opacity-0 group-hover/member:opacity-40 transition-opacity'></div>
                                                                    <img src={`${import.meta.env.VITE_API_BASE_URL}/${member?.member?.profile_photo}`}
                                                                        alt={member?.member?.username}
                                                                        className='relative w-8 h-8 rounded-full object-cover ring-2 ring-[#70B0FF]/20 group-hover/member:ring-[#70B0FF]/40 transition-all' />
                                                                </div>
                                                            ) : (
                                                                <div className='relative'>
                                                                    <div className='absolute -inset-[1px] bg-gradient-to-r from-[#70B0FF] to-[#5A8FD9] rounded-full blur opacity-0 group-hover/member:opacity-40 transition-opacity'></div>
                                                                    <div className='relative w-8 h-8 bg-gradient-to-br from-[#70B0FF] to-[#5A8FD9] rounded-full flex items-center justify-center ring-2 ring-[#70B0FF]/20 group-hover/member:ring-[#70B0FF]/40 transition-all'>
                                                                        <span className='text-white text-sm font-medium'>
                                                                            {member?.member?.username.charAt(0).toUpperCase()}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            <span className='text-light_white text-sm group-hover/member:text-white transition-colors'>
                                                                {member?.member?.username}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-[calc(200%/5)] min-w-[calc(200%/5)] h-full overflow-auto [&::-webkit-scrollbar]:hidden">
                <NotActive />
            </div>
        </div>
    );
};

export default AssignmentMembers
