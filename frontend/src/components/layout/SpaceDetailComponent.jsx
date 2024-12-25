import React from 'react'
import { use } from 'react'
import { useOutletContext } from 'react-router-dom'
import NotActive from '../common/NotActive'

const SpaceDetailComponent = () => {
    console.log('in SpaceDetailComponent')
    const { spaceDetail } = useOutletContext()
    console.log(spaceDetail)
    const username = localStorage.getItem('username')

    return (
        <div className='flex flex-col w-5/6 min-w-[calc(500%/6)] max-w-[calc(500%/6)] h-screen '>
            <div className='w-full h-10 min-h-10 border-b border-gray-500 bg-backg_1 text-light_gray text-left px-4 flex items-center '>
                <div className='flex flex-row gap-2 items-center'>
                    <img src="/assets/svg/hashtag.svg" className='w-6 h-6 ' alt="" />
                    <h1 className='font-semibold text-2xl tracking-wide'>
                        Space Details
                    </h1>
                </div>
            </div>

            <div className='flex flex-row h-[calc(100vh-2.5rem)] bg-backg_1'>
                {/* {console.log('spaceDetail', spaceDetail)} */}
                <div className='bg-backg_1 grow overflow-auto h-full border-r border-gray-500 border-r[50%]'>
                    <div className='bg-backg_1 flex flex-col p-2 w-lg h-full text-left overflow-auto'>
                        <div className='bg-backg_dark rounded-md overflow-auto [&::-webkit-scrollbar]:hidden mt-2  h-full'>
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

                            <div className='felxt flex-col gap-8'>
                                <div className='text-white bg-backg_1 mx-3 my-2 px-3 pt-2 rounded-md'>
                                    <h3 className='tracking-wider text-light_white bg-[#252428] px-2 rounded-md py-1'>Details</h3>
                                    <div className='px-4 flex flex-row justify-between items-center '>
                                        <div className='my-2 min-w-[calc(100%/2)]'>
                                            <h3 className='text-light_gray text-left text-sm/4 tracking-wide'>Description</h3>
                                            <p className='text-light_white text-left  text-sm/2 tracking-wide font-light'>{spaceDetail?.space_bio}</p>
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
                                                        <p className='text-light_white text-left font-light'>{new Date(spaceDetail?.create_date).toLocaleDateString()}</p>
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

                                <div className='text-white bg-backg_1 mx-3 my-2 px-3 py-2 rounded-md '>
                                    <div className='flex justify-between items-center mb-4 '>
                                        <h3 className='tracking-wider text-light_white bg-[#252428] px-2 rounded-md w-full py-1'>Members ({spaceDetail.member_count})</h3>
                                    </div>
                                    <div className='px-4 grid grid-cols-2 gap-4 max-h-52 overflow-y-auto [&::-webkit-scrollbar]:hidden'>
                                        {spaceDetail.space_members?.map((member) => (
                                            <div key={member.space_member_id}
                                                className='flex items-center gap-3 p-2 rounded-md bg-[#202225] hover:bg-[#2f3136] transition-colors'>
                                                {member.space_member_profile_image === '' ? (
                                                    <div className='w-8 h-8 bg-button_purple rounded-full flex items-center justify-center'>
                                                        {member.space_member_username.charAt(0).toUpperCase()}
                                                    </div>) : (
                                                    <img src={`${import.meta.env.VITE_API_BASE_URL}/${member.space_member_profile_image}`} alt="profile-image" className='w-8 h-8 rounded-full' />
                                                )}
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

                                <div className='text-white bg-backg_1 mx-3 my-2 px-3 py-2 rounded-md'>
                                    <div className='flex justify-between items-center mb-4'>
                                        <h3 className='tracking-wider text-light_white bg-[#252428] px-2 rounded-md w-full py-1'>Sub Spaces ({spaceDetail.sub_space_count})</h3>
                                    </div>
                                    <div className='px-4 space-y-2 max-h-56 overflow-y-auto [&::-webkit-scrollbar]:hidden'>
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
                </div>
                <div className="max-w-[calc(200%/5)] min-w-[calc(200%/5)] h-full overflow-auto [&::-webkit-scrollbar]:hidden">
                    <NotActive />
                </div>

            </div>
        </div>
    )
}

export default SpaceDetailComponent
