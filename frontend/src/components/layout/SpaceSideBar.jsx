import React, { useState } from 'react'
import { useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom'

const SpaceSideBar = () => {
    const navigate = useNavigate()
    const { spaceSideBarData, } = useSelector(state => state.space)
    const [hoverIndex, setHoverIndex] = useState(null)
    const [clickIndex, setClickIndex] = useState(null)

    const handleClick = (spaceId) => {
        setClickIndex(spaceId)
        if (spaceId === Infinity) navigate('/dashboard')
        else navigate(`spaces/${spaceId}`)
    }
    console.log('in SpaceSideBar')
    // console.log(spaceSideBarData)

    return (
        <div className='inline-flex flex-col bg-backg_dark h-screen text-white overflow-auto [&::-webkit-scrollbar]:hidden'>
            <ul className='inline-flex flex-col gap-4 pt-2'>
                <li>
                    <div className='relative pr-2' >
                        <div className={`w-2 rounded-full bg-white ${hoverIndex === Infinity ? 'h-4' : 'h-2'} absolute top-1/2 transform -translate-y-1/2 -left-1   ${clickIndex === Infinity ? "h-4" : 'h-2'}`}></div>
                        <button
                            onMouseEnter={() => setHoverIndex(Infinity)}
                            onMouseLeave={() => setHoverIndex(null)}
                            onClick={() => { handleClick(Infinity) }}
                            className={`bg-darkslategray w-12 h-12 ml-2 transition-transform duration-1000 ease-in-out hover:rounded-xl active:rounded-xl ${clickIndex === Infinity ? "rounded-xl" : 'rounded-full'}`}>
                            <img src="/assets/Yellow_and_Black_Modern_Media_Logo-removebg-preview.png" alt="logo" className='w-full h-full object-cover rounded-full' />
                        </button>
                    </div>
                    <div className='pt-2 px-4 '>
                        <div className='bg-darkslategray w-full h-0.5 rounded-full'></div>
                    </div>
                </li>
                {spaceSideBarData?.map((obj) => {
                    return (
                        <li key={obj?.id}>
                            <div className='relative pr-2' >
                                <div className={`w-2 rounded-full bg-white ${hoverIndex === obj.id ? 'h-4' : 'h-2'} absolute top-1/2 transform -translate-y-1/2 -left-1   ${clickIndex === obj?.id ? "h-4" : 'h-2'}`}></div>
                                <button
                                    onMouseEnter={() => setHoverIndex(obj?.id)}
                                    onMouseLeave={() => setHoverIndex(null)}
                                    onClick={() => { handleClick(obj?.id) }}
                                    className={`bg-darkslategray w-12 h-12 ml-2 transition-transform duration-300 ease-in-out hover:rounded-xl active:rounded-xl ${clickIndex === obj.id ? "rounded-xl" : 'rounded-full'}`}>
                                    {obj?.space_profile ? (
                                        <img
                                            src={obj.space_profile}
                                            alt="logo"
                                            className='w-full h-full object-cover rounded-full'
                                        />
                                    ) : (
                                        <div
                                            className='w-full h-full rounded-full flex items-center justify-center text-white font-bold '
                                        >
                                        </div>
                                    )}
                                </button>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default SpaceSideBar
