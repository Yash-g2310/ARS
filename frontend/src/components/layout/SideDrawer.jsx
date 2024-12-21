import React from 'react'
import { useSelector } from 'react-redux';

const SideDrawer = ({ toggleComponentState }) => {
    console.log('in SideDrawer')
    const { user, isLoading, isError, errorMessage } = useSelector(state => state.auth);
    // console.log(toggleComponentState)
    // console.log(userData)
    // if (!userData) {
    //     return <div>Loading user data...</div>;
    // }
    // console.log(user)
    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {errorMessage}</div>;
    return (
        <div className='p-2 text-light_white flex flex-col gap-20 pt-6'>
            <div className='max-h-12 relative'>
                <div className='bg-black rounded-t-md max-h-16 overflow-hidden h-full'>
                    <img src={user?.background_image} alt="" className='w-fit rounded-t-lg' />
                </div>
                <div className='absolute top-full left-2'>
                    <div className='flex flex-row items-center gap-3'>
                        <div className='w-16 h-16 '>
                            {user?.profile_image === null ? (
                                <div className='w-full h-full bg-button_purple rounded-full text-xl text-white font-semibold flex items-center justify-center border-2 border-backg_mid_dark transition-all duration-200 hover:border-gray-600 shadow-lg hover:bg-[#2752C4]'>
                                    {user?.first_name.charAt(0).toUpperCase()}
                                </div>
                            ) : (
                                <img
                                    src={user?.profile_image}
                                    alt=""
                                    className='w-full h-full rounded-full border-4 border-backg_mid_dark bg-backg_dark transition-all duration-200 hover:border-gray-600 shadow-lg '
                                />
                            )}
                        </div>
                        <h2 className='text-white font-roboto'>{user?.username}</h2>
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-4'>
                <button className=' bg-[#4E5058]/50  hover:bg-[#4E5058]/70 p-2.5  rounded-md  text-left  pl-4 transition-all  duration-200  ease-in-out shadow-md hover:shadow-lg border border-gray-600/30 hover:border-gray-500/50 text-light_white/90 hover:text-light_white focus:outline-none  focus:ring-2  focus:ring-gray-500/50 active:transform  active:scale-95'
                    onClick={() => { toggleComponentState('showProfile') }}
                >
                    See user profile
                </button>
                <button className=' bg-[#4E5058]/50  hover:bg-[#4E5058]/70 p-2.5  rounded-md  text-left  pl-4 transition-all  duration-200  ease-in-out shadow-md hover:shadow-lg border border-gray-600/30 hover:border-gray-500/50 text-light_white/90 hover:text-light_white focus:outline-none  focus:ring-2  focus:ring-gray-500/50 active:transform  active:scale-95'
                    onClick={() => { toggleComponentState('showDetails') }}
                >
                    See other details
                </button>
            </div>
        </div>
    )
}

export default SideDrawer