import React from 'react'

const NotActive = () => {
    return (
        <div className='p-4 m-2 bg-backg_dark rounded-md'>
            <h2 className='font-sans text-light_white font-bold tracking-wider'>NOTHING TO SHOW</h2>
            <div className=' bg-backg_1 my-4 px-16 py-2 inline-block rounded-md max-w-lg'>
                <h3 className='text-light_white'>It's quiet for now....</h3>
                <p className='text-light_gray'>When you will open an assignment or profile we will show it here!!</p>
            </div>
        </div>
    )
}

export default NotActive
