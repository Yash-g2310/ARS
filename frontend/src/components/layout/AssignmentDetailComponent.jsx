import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import AssignmentStatus from './AssignmentStatus'

const AssignmentDetailComponent = () => {
    const { assignmentId } = useParams()
    const spaceDetail = {}
    const subSpaceDetail = {}
    const subSpaceAssignmentList = []
    const { assignmentDetails } = useSelector(state => state.assignment)
    const { assignmentStatus } = useSelector(state => state.submission)
    const assignmentDetail = assignmentDetails?.[assignmentId] || {};
    const status = assignmentStatus?.[assignmentId] || {};
    // console.log(status)
    // console.log(assignmentDetail)

    const formatDate = (dateString) => {
        return new Intl.DateTimeFormat('en-IN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(new Date(dateString));
    }

    const formatTime = (dateString) => {
        return new Intl.DateTimeFormat('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).format(new Date(dateString));
    }

    return (
        <div className='flex flex-row h-[calc(100vh-3.5rem)] bg-backg_1 '>
            <div className='bg-backg_1 grow overflow-auto h-full border-r border-gray-500 border-r[50%] '>
                <div className='bg-backg_1 flex flex-col p-2 w-lg h-full text-left overflow-auto'>
                    <div className='bg-gradient-to-r from-[#1A1B1E]/95 to-[#2D2F34]/95 backdrop-blur-md rounded-lg mx-3 my-2 p-[1px]'>
                        <div className='bg-[#1A1B1E]/90 rounded-lg p-6'>
                            <div className='flex justify-between items-start gap-8'>
                                <div className='flex items-center gap-4'>
                                    <div className='relative group'>
                                        <div className='absolute -inset-1 bg-gradient-to-r from-[#70B0FF] to-[#5A8FD9] rounded-full blur opacity-40 group-hover:opacity-75 transition-opacity'></div>
                                        <div className='relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-[#70B0FF]/20 group-hover:ring-[#70B0FF]/40 transition-all'>
                                            {assignmentDetail?.uploader?.profile_photo ? (
                                                <img
                                                    src={`${import.meta.env.VITE_API_BASE_URL}/${assignmentDetail?.uploader?.profile_photo}`}
                                                    alt={assignmentDetail?.uploader?.username}
                                                    className='w-full h-full object-cover'
                                                />
                                            ) : (
                                                <div className='w-full h-full bg-gradient-to-br from-[#70B0FF] to-[#5A8FD9] flex items-center justify-center'>
                                                    <span className='text-white text-lg font-medium'>
                                                        {assignmentDetail?.uploader?.username?.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className='flex flex-col'>
                                        <span className='text-[#C3B473] text-xs font-medium tracking-wider uppercase'>Created By</span>
                                        <span className='text-light_white text-base font-medium'>
                                            {assignmentDetail?.uploader?.username}
                                        </span>
                                    </div>
                                </div>

                                <div className='flex gap-6'>
                                    <div className='flex flex-col items-end'>
                                        <div className='flex items-center gap-2 text-[#C3B473] mb-1'>
                                            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                                            </svg>
                                            <span className='text-xs font-medium tracking-wider uppercase'>Upload Date</span>
                                        </div>
                                        <span className='text-light_white/90 text-sm font-medium'>
                                            {assignmentDetail?.upload_date &&
                                                `${formatDate(assignmentDetail.upload_date)} at ${formatTime(assignmentDetail.upload_date)}`
                                            }
                                        </span>
                                    </div>

                                    <div className='flex flex-col items-end'>
                                        <div className='flex items-center gap-2 text-[#70B0FF] mb-1'>
                                            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                                            </svg>
                                            <span className='text-xs font-medium tracking-wider uppercase'>Last Updated</span>
                                        </div>
                                        <span className='text-light_white/90 text-sm font-medium'>
                                            {assignmentDetail?.updated_at &&
                                                `${formatDate(assignmentDetail.updated_at)} at ${formatTime(assignmentDetail.updated_at)}`
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='bg-backg_dark flex flex-col gap-0 rounded-md overflow-auto [&::-webkit-scrollbar]:hidden mt-2 h-full'>
                        <div className='group bg-gradient-to-br from-[#1A1B1E] to-[#2D2F34] mx-3 my-2 rounded-lg p-[1px] hover:from-[#70B0FF] hover:to-[#5A8FD9] transition-all duration-300'>
                            <div className='bg-backg_1 rounded-lg p-3'>
                                <h3 className='flex items-center gap-3 mb-4 group-hover:translate-x-1 transition-transform'>
                                    <div className='relative'>
                                        <div className='absolute -inset-1 bg-gradient-to-r from-[#70B0FF] to-[#5A8FD9] rounded-full blur opacity-40 group-hover:opacity-75 transition-opacity'></div>
                                        <div className='relative bg-[#252428] p-2 rounded-full group-hover:bg-[#2A2D32] transition-colors'>
                                            <img
                                                src="/assets/svg/smallHashtag.svg"
                                                alt=""
                                                className='w-5 h-5 group-hover:rotate-12 transition-transform'
                                            />
                                        </div>
                                    </div>
                                    <span className='text-xl font-semibold text-light_white tracking-wide'>Details</span>
                                </h3>

                                <div className='space-y-4 pl-4'>
                                    <div className='bg-[#202225]/50 rounded-lg p-4 hover:bg-[#202225] transition-colors'>
                                        <h4 className='text-[#70B0FF] text-sm font-medium mb-2 tracking-wide'>Description</h4>
                                        <p className='text-light_white/90 text-sm leading-relaxed'>{assignmentDetail?.description}</p>
                                    </div>

                                    <div className='grid grid-cols-2 gap-4'>
                                        <div className='group/date bg-gradient-to-br from-[#70B0FF]/20 to-[#5A8FD9]/20 rounded-lg p-4 hover:from-[#70B0FF]/30 hover:to-[#5A8FD9]/30 transition-all'>
                                            <div className='flex items-center gap-2 mb-2'>
                                                <svg className='w-4 h-4 text-[#70B0FF]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                                                </svg>
                                                <h4 className='text-[#70B0FF] text-sm font-medium'>Iteration Date</h4>
                                            </div>
                                            <p className='text-light_white/90 text-sm'>
                                                {assignmentDetail?.iteration_date
                                                    ? `${formatDate(assignmentDetail.iteration_date)} at ${formatTime(assignmentDetail.iteration_date)}`
                                                    : 'Not set'}
                                            </p>
                                        </div>

                                        {/* Deadline */}
                                        <div className='group/date bg-gradient-to-br from-[#F23F42]/20 to-[#FF5B5E]/20 rounded-lg p-4 hover:from-[#F23F42]/30 hover:to-[#FF5B5E]/30 transition-all'>
                                            <div className='flex items-center gap-2 mb-2'>
                                                <svg className='w-4 h-4 text-[#F23F42]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                                                </svg>
                                                <h4 className='text-[#F23F42] text-sm font-medium'>Deadline</h4>
                                            </div>
                                            <p className='text-light_white/90 text-sm'>
                                                {assignmentDetail?.due_date
                                                    ? `${formatDate(assignmentDetail.due_date)} at ${formatTime(assignmentDetail.due_date)}`
                                                    : 'No deadline'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {assignmentDetail?.assignment_detail_list?.map((detail) => (
                            <div key={detail?.id}
                                // className='group text-white bg-backg_1 mx-3 my-2 px-3 py-2 rounded-md '
                                className='group bg-gradient-to-br from-[#1A1B1E] to-[#2D2F34] mx-3 my-2 rounded-lg p-[1px] hover:from-[#70B0FF] hover:to-[#5A8FD9] transition-all duration-300'
                            >
                                {/* {console.log(detail)} */}
                                <div className='bg-backg_1 rounded-lg p-3 py-4'>
                                    <h3 className='flex items-center gap-3 mb-4 group-hover:translate-x-1 transition-transform'>
                                        <div className='relative'>
                                            <div className='absolute -inset-1 bg-gradient-to-r from-[#70B0FF] to-[#5A8FD9] rounded-full blur opacity-40 group-hover:opacity-75 transition-opacity'></div>
                                            <div className='relative bg-[#252428] p-2 rounded-full group-hover:bg-[#2A2D32] transition-colors'>
                                                <img
                                                    src="/assets/svg/smallHashtag.svg"
                                                    alt=""
                                                    className='w-5 h-5 group-hover:rotate-12 transition-transform'
                                                />
                                            </div>
                                        </div>
                                        <span className='text-xl font-semibold text-light_white tracking-wide'>{detail?.title}</span>
                                    </h3>

                                    <div className='pl-12'>
                                        <p className='text-[#949BA4] text-sm leading-relaxed font-light max-h-52 overflow-y-auto [&::-webkit-scrollbar]:hidden'>
                                            {detail.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className='group bg-gradient-to-br from-[#1A1B1E] to-[#2D2F34] mx-3 my-2 rounded-lg p-[1px] hover:from-[#70B0FF] hover:to-[#5A8FD9] transition-all duration-300'>

                            <div className='group text-white bg-backg_1 px-3 py-2 rounded-lg'>
                                <h3 className='flex items-center gap-3 mb-4 group-hover:translate-x-1 transition-transform duration-300'>
                                    <div className='relative'>
                                        <div className='absolute -inset-1 bg-gradient-to-r from-[#70B0FF] to-[#5A8FD9] rounded-full blur opacity-40 group-hover:opacity-75 transition-opacity duration-300'></div>
                                        <div className='relative bg-[#252428] p-2 rounded-full group-hover:bg-[#2A2D32] transition-colors duration-300'>
                                            <img
                                                src="/assets/svg/smallHashtag.svg"
                                                alt=""
                                                className='w-5 h-5 group-hover:rotate-12 transition-transform duration-300'
                                            />
                                        </div>
                                    </div>
                                    <span className='text-xl font-semibold text-light_white tracking-wide'>Subtasks</span>
                                </h3>
                                <div className='px-4 flex flex-col gap-4 '>
                                    {assignmentDetail?.subtask_list?.map((subtask) => (
                                        <div key={subtask?.id}
                                            className='rounded-lg pl-1 bg-gradient-to-r from-[#70B0FF] to-[#5A8FD9] hover:from-[#82BAFF] hover:to-[#6A9FE9] transition-all duration-300'>
                                            <div className='bg-backg_dark rounded-md p-3 hover:bg-opacity-95 transition-all'>
                                                <div className='flex justify-between items-center mb-2'>
                                                    <h4 className='text-[#E4E6EA] font-medium text-lg'>
                                                        {subtask?.title}
                                                    </h4>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${subtask?.tag === 'compulsory' ? 'bg-red-500/20 text-red-400' :
                                                        subtask?.tag === 'optional' ? 'bg-blue-500/20 text-blue-400' :
                                                            'bg-green-500/20 text-green-400'}`}>
                                                        {subtask?.tag}
                                                    </span>
                                                </div>
                                                {subtask?.description && (
                                                    <p className='text-[#949BA4] text-sm leading-relaxed'>
                                                        {subtask?.description}
                                                    </p>
                                                )}
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
                <AssignmentStatus/>
            </div>
        </div>
    )
}

export default AssignmentDetailComponent
