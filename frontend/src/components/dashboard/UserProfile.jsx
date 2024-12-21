import React from 'react'

const UserProfile = ({ userData }) => {
    const [isEditing, setIsEditing] = React.useState(false);

    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };

    return (
        <div className='bg-backg_1 flex flex-col p-2 w-lg h-full text-left overflow-auto'> 
            <h1 className='font-roboto text-2xl tracking-wide text-white opacity-80'>My Account</h1>
            <div className='bg-backg_dark rounded-md overflow-auto [&::-webkit-scrollbar]:hidden mt-2 h-full'>
                <div className='bg-black rounded-t-md max-h-28 overflow-hidden h-full'>
                    <img src={`${userData.background_image}`} className='w-full text-white rounded-t-md' alt="banner-image" />
                </div>
                <div className='flex flex-row justify-between px-8 items-center my-4 '>
                    <div className='flex flex-row items-center gap-3'>
                        <div className='w-16 h-16'>
                            <img src={`${userData.profile_image}`} alt="profile-image" className='w-full h-full rounded-full' />
                        </div>
                        <h2 className='text-white font-roboto '>{userData.username}</h2>
                    </div>
                    <div>
                        <button onClick={handleEditClick} className='bg-button_purple text-white px-3 py-2 rounded-md'>Edit User Profile</button>
                    </div>
                </div>
                <div className='text-white bg-backg_1 mx-3 my-2 px-3'>
                    <div className='flex justify-start items-start'>
                        <div className='my-2'>
                            <h3 className='text-light_gray text-left text-sm/4 tracking-wide'>USERNAME</h3>
                            <p className='text-light_white text-left  text-sm/2 tracking-wide'>{userData.username}</p>
                        </div>
                        {isEditing && <button className='bg-button_purple text-white px-3 py-2 rounded-md'>Edit</button>}
                    </div>
                    <div className='flex justify-between items-start'>
                        <div className='my-2'>
                            <h3 className='text-light_gray text-left font-sans'>DESCRIPTION</h3>
                            <p className='text-light_white text-left'>{userData.user_bio}</p>
                        </div>
                        {isEditing && <button className='bg-button_purple text-white px-3 py-2 rounded-md'>Edit</button>}
                    </div>
                    <div className='flex justify-between items-start'>
                        <div className='my-2'>
                            <h3 className='text-light_gray text-left'>EMAIL</h3>
                            <p className='text-light_white text-left'>{userData.email}</p>
                        </div>
                        {isEditing && <button className='bg-button_purple text-white px-3 py-2 rounded-md'>Edit</button>}
                    </div>
                    <div className='flex justify-between items-start'>
                        <div className='my-2'>
                            <h3 className='text-light_gray text-left'>PHONE</h3>
                            <p className='text-light_white text-left'>{userData.phone_number?.substring(3)}</p>
                        </div>
                        {isEditing && <button className='bg-button_purple text-white px-3 py-2 rounded-md'>Edit</button>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfile
