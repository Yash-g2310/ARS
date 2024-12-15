import React from 'react'
import { use } from 'react'
import { useOutletContext } from 'react-router-dom'

const SpaceDetailComponent = () => {
    const { spaceDetail } = useOutletContext()
    console.log(spaceDetail)
    const username = localStorage.getItem('username')

    return (
        <div className='bg-backg_1 flex flex-col p-2 w-lg h-full text-left overflow-auto'>
            <div className='bg-backg_dark rounded-md overflow-auto [&::-webkit-scrollbar]:hidden mt-2  h-full'>
                <div className='bg-black rounded-t-md max-h-28 overflow-hidden h-full'>
                    <img src={`${spaceDetail.space_background}`} className='w-full text-white rounded-t-md' alt="banner-image" />
                </div>
                <div className='flex flex-row justify-between px-8 items-center my-2 '>
                    <div className='flex flex-row items-center gap-3'>
                        <div className='w-14 h-14'>
                            <img src={`${spaceDetail.space_profile}`} alt="profile-image" className='w-full h-full rounded-full' />
                        </div>
                        <h2 className='text-white font-roboto tracking-wider font-semibold'>user123</h2>
                    </div>
                    <div>
                        {spaceDetail.owner_username === username &&
                            <button className='bg-button_purple text-white px-3 py-2 rounded-md'>Edit User Profile</button>
                        }
                    </div>
                </div>

                <div className='felxt flex-col gap-8'>
                    <div className='text-white bg-backg_1 mx-3 my-2 px-3 pt-2 rounded-md'>
                        <h3 className='tracking-wider text-light_white '>Details</h3>
                        <div className='px-4 flex flex-row justify-between items-center '>
                            <div className='my-2 min-w-[calc(100%/2)]'>
                                <h3 className='text-light_gray text-left text-sm/4 tracking-wide'>Description</h3>
                                <p className='text-light_white text-left  text-sm/2 tracking-wide font-light'>{spaceDetail.space_bio}</p>
                            </div>
                            <div className='bg-[#202225] p-2 rounded-md m-2 min-w-[calc(100%/2)] px-4'>
                                <div className='flex flex-col justify-between items-start'>
                                    <div className='my-2'>
                                        <h3 className='text-[#FAA61A] text-left font-sans'>Created By</h3>
                                        <p className='text-light_white text-left font-light'>{spaceDetail.owner_username}</p>
                                    </div>
                                    <div className='my-2'>
                                        <h3 className='text-[#FAA61A] text-left font-sans'>Details</h3>
                                        <div className='flex flex-row gap-2 '>
                                            <p className='text-light_white text-left font-light'>creation date: </p>
                                            <p className='text-light_white text-left font-light'>{spaceDetail.create_date.substr(0, 10)}</p>
                                        </div>
                                        <div className='flex flex-row gap-2'>
                                            <p className='text-light_white text-left font-light'>member count: </p>
                                            <p className='text-light_white text-left font-light'>{spaceDetail.member_count}</p>
                                        </div>
                                        <div className='flex flex-row gap-2'>
                                            <p className='text-light_white text-left font-light'>subspace count: </p>
                                            <p className='text-light_white text-left font-light'>{spaceDetail.sub_space_count}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='text-white bg-backg_1 mx-3 my-2 px-3 pt-2 rounded-md'>
                        <div className='flex justify-between items-center mb-4'>
                            <h3 className='tracking-wider text-light_white'>Members ({spaceDetail.member_count})</h3>
                            {spaceDetail.owner_username === username && (
                                <button className='bg-button_purple text-white px-3 py-1 rounded-md text-sm'>
                                    Invite Members
                                </button>
                            )}
                        </div>
                        <div className='px-4 grid grid-cols-2 gap-4 max-h-48 overflow-y-auto'>
                            {spaceDetail.space_members?.map((member) => (
                                <div key={member.space_member_id}
                                    className='flex items-center gap-3 p-2 rounded-md bg-[#202225] hover:bg-[#2f3136] transition-colors'>
                                    <div className='w-8 h-8 bg-button_purple rounded-full flex items-center justify-center'>
                                        {member.space_member_username.charAt(0).toUpperCase()}
                                    </div>
                                    <div className='flex flex-col'>
                                        <span className='text-light_white text-sm'>{member.space_member_username}</span>
                                        {member.space_member_username === spaceDetail.owner_username && (
                                            <span className='text-xs text-[#FAA61A]'>Owner</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Subspaces Section */}
                    <div className='text-white bg-backg_1 mx-3 my-2 px-3 pt-2 rounded-md'>
                        <div className='flex justify-between items-center mb-4'>
                            <h3 className='tracking-wider text-light_white'>Sub Spaces ({spaceDetail.sub_space_count})</h3>
                            {spaceDetail.owner_username === username && (
                                <button className='bg-button_purple text-white px-3 py-1 rounded-md text-sm'>
                                    Create Subspace
                                </button>
                            )}
                        </div>
                        <div className='px-4 space-y-2 max-h-48 overflow-y-auto'>
                            {spaceDetail.sub_spaces?.map((subspace) => (
                                <div key={subspace.subspace_id}
                                    className='flex items-center gap-3 p-3 rounded-md bg-[#202225] hover:bg-[#2f3136] transition-colors'>
                                    <svg className="w-4 h-4 text-light_gray" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z" clipRule="evenodd" />
                                        <path d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z" />
                                    </svg>
                                    <span className='text-light_white text-sm'>{subspace.subspace_name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SpaceDetailComponent
