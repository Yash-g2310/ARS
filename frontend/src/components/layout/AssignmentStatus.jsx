import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const StatusBadge = ({ status, type }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'submitted': return 'bg-[#70B0FF]/20 text-[#70B0FF]';
            case 'completed': return 'bg-green-500/20 text-green-400';
            default: return 'bg-yellow-500/20 text-yellow-400';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'submitted':
                return (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                );
            case 'completed':
                return (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    return (
        <span
            className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1.5 ${getStatusColor(status)}`}
            title={`${status === 'submitted' ? 'Submitted for Review' : status === 'completed' ? 'Assignment Completed' : 'Not Submitted Yet'}`}
        >
            {getStatusIcon(status)}
            {status === 'submitted' ? 'In Review' : status === 'completed' ? 'Completed' : 'Not Submitted'}
        </span>
    );
};

const getBorderColors = (status) => {
    switch (status) {
        case 'submitted':
            return 'hover:from-[#70B0FF] hover:to-[#5A8FD9]';
        case 'completed':
            return 'hover:from-green-500 hover:to-green-400';
        default:
            return 'hover:from-yellow-500 hover:to-yellow-400';
    }
};

const AssignmentStatus = () => {
    const { assignmentId } = useParams();
    const { assignmentStatus } = useSelector(state => state.submission);
    const status = assignmentStatus?.[assignmentId] || {};
    console.log(status);

    return (
        <div className='bg-backg_dark rounded-md overflow-auto [&::-webkit-scrollbar]:hidden m-2'>
            <div className='text-white bg-backg_1 mx-3 my-2 px-3 py-2 rounded-md'>
                {/* Teams Section */}
                {status?.teams_status?.length > 0 && (
                    <div className='mb-6'>
                        <h3 className='text-[#70B0FF] text-sm font-medium mb-4 tracking-wide'>Teams Status</h3>
                        <div className='space-y-3'>
                            {status.teams_status.map((team, index) => (
                                <div key={index}
                                    className={`group bg-gradient-to-r from-[#202225] to-[#2D2F34] p-[1px] rounded-lg ${getBorderColors(team.team_status)} transition-all duration-300`}>
                                    <div className='bg-[#202225] p-3 rounded-lg'>
                                        <div className='flex flex-col gap-2'>
                                            {/* Team Header */}
                                            <div className='flex items-center justify-between'>
                                                <div className='flex items-center gap-2'>
                                                    <span className='text-light_white text-sm font-medium'>{team.team_name}</span>
                                                    <div className='relative group/tooltip'>
                                                        <svg className="w-4 h-4 text-[#70B0FF]/60 hover:text-[#70B0FF] transition-colors"
                                                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                        </svg>
                                                        {/* Dropdown/Tooltip */}
                                                        <div className='absolute left-0 top-full mt-2 w-48 bg-[#202225] rounded-lg p-2 
                                                                    invisible group-hover/tooltip:visible opacity-0 group-hover/tooltip:opacity-100 
                                                                    transition-all duration-300 z-10 shadow-xl border border-[#70B0FF]/20'>
                                                            <div className='text-xs font-medium text-[#70B0FF] mb-2 px-2'>Team Members</div>
                                                            {team.team_members.map((member, idx) => (
                                                                <div key={idx}
                                                                    className='flex items-center gap-2 p-2 rounded-md hover:bg-[#70B0FF]/10 transition-colors'>
                                                                    <div className='w-6 h-6 rounded-full bg-gradient-to-br from-[#70B0FF]/20 to-[#5A8FD9]/20 flex items-center justify-center'>
                                                                        <span className='text-[#70B0FF] text-xs font-medium'>
                                                                            {member.member_name[0].toUpperCase()}
                                                                        </span>
                                                                    </div>
                                                                    <span className='text-light_white/90 text-xs'>
                                                                        {member.member_name}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <StatusBadge status={team.team_status} type="team" />
                                            </div>

                                            {/* Member Count */}
                                            <div className='flex items-center gap-1 text-xs text-[#70B0FF]/60'>
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                </svg>
                                                <span>{team.team_members.length} members</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Individual Reviewees Section */}
                {status?.reviewees_status?.length > 0 && (
                    <div>
                        <h3 className='text-[#70B0FF] text-sm font-medium mb-4 tracking-wide'>Individual Status</h3>
                        <div className='space-y-3'>
                            {status.reviewees_status.map((reviewee, index) => (
                                <div key={index} className={`group bg-gradient-to-r from-[#202225] to-[#2D2F34] p-[1px] rounded-lg ${getBorderColors(reviewee.reviewee_status)} transition-all duration-300`}>
                                    <div className='bg-[#202225] p-3 rounded-lg'>
                                        <div className='flex items-center justify-between'>
                                            <div className='flex items-center gap-2'>
                                                <div className='w-8 h-8 rounded-full bg-gradient-to-br from-[#70B0FF] to-[#5A8FD9] flex items-center justify-center'>
                                                    <span className='text-white text-sm font-medium'>
                                                        {reviewee.assignment_reviewee[0].toUpperCase()}
                                                    </span>
                                                </div>
                                                <span className='text-light_white text-sm font-medium'>
                                                    {reviewee.assignment_reviewee}
                                                </span>
                                            </div>
                                            <StatusBadge status={reviewee.reviewee_status} type="reviewee" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {(!status?.teams_status?.length && !status?.reviewees_status?.length) && (
                    <div className='text-light_gray/70 text-sm text-center py-4'>
                        No status information available
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssignmentStatus;
