import React from 'react'

const UserProfile = ({userData}) => {
    return (
        <div className='bg-backg_1 flex flex-col px-2 '>
            <h1 className='font-roboto text-2xl tracking-wide text-white opacity-80'>My Account</h1>
            <div className='bg-backg_dark rounded-md'>
                <div className='bg-black rounded-t-md'>
                    <img src="./assets/user_profile_bg.png" className='w-full text-white rounded-t-md' alt="banner-image" />
                </div>
                <div className='flex flex-row justify-between px-8 items-center my-2'>
                    <div className='flex flex-row items-center gap-3'>
                        <div className='w-12 h-12'>
                            <img src="./assets/user_profile.png" alt="profile-image" className='w-full h-full' />
                        </div>
                        <h2 className='text-white font-roboto '>user123</h2>
                    </div>
                    <div>
                        <button className='bg-button_purple text-white px-3 py-2 rounded-md'>Edit User Profile</button>
                    </div>
                </div>
                <div className='text-white bg-backg_1 mx-3 my-2 px-3'>
                    <h3>USERNAME</h3>
                    <p>{userData.username}</p>
                    <h3>DESCRIPTION</h3>
                    <p>{userData.user_bio}</p>
                    <h3>EMAIL</h3>
                    <p>{userData.email}</p>
                    <h3>PHONE</h3>
                    <p>{userData.phone_number.substring(3)}</p>

                </div>
            </div>
        </div>
    )
}

export default UserProfile
