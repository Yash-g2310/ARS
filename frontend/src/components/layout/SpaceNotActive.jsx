import React from 'react'
import NotActive from '../common/NotActive'
import { useOutletContext } from 'react-router-dom'


const SpaceNotActive = () => {

    const { spaceDetail } = useOutletContext()
    return (
        <div className='flex flex-col w-5/6 min-w-[calc(500%/6)] max-w-[calc(500%/6)] h-screen '>
            <div className='w-full h-14 min-h-14 border-b border-gray-500 bg-backg_1 text-light_gray text-left px-4 flex items-center '>
                <div className='flex flex-row gap-2 items-center'>
                    <img src="/assets/svg/hashtag.svg" className='w-6 h-6 ' alt="" />
                    <h1 className='font-semibold text-2xl tracking-wide'>
                        {spaceDetail.space_name || 'Space Name'}
                    </h1>
                </div>
            </div>
            <div className='flex flex-row h-[calc(100vh-3.5rem)] bg-backg_1'>
                <div className='bg-backg_1 grow overflow-auto h-full border-r border-gray-500 border-r[50%]'>
                    <NotActive />
                </div>
                <div className="max-w-[calc(200%/5)] min-w-[calc(200%/5)] h-full overflow-auto [&::-webkit-scrollbar]:hidden">
                    <NotActive />
                </div>
            </div>
        </div>
    )
}

export default SpaceNotActive
