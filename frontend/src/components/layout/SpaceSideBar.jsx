import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchSpaceSideBarData } from '../../features/space/spaceSlice'
import { use } from 'react'

const SpaceSideBar = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { spaceSideBarData, isLoading, isError } = useSelector(state => state.space)
    const [hoverIndex, setHoverIndex] = useState(null)
    const [clickIndex, setClickIndex] = useState(null)
    const dummyData = ['https://robohash.org/10.37.201.177.png', 'https://robohash.org/1037.201.177.png', 'https://robohash.org/103.201.177.png', 'https://robohash.org/103.37.201.png']

    useEffect(() => {
        const getSpaceSidebarData = async () => {
            try {
                const username = localStorage.getItem('username')
                await dispatch(fetchSpaceSideBarData(username)).unwrap()
            } catch (error) {
                console.error('Error fetching space sidebar data:', error)
            }
        }
        if (spaceSideBarData === null)
            getSpaceSidebarData()
    }, [dispatch])

    const handleClick = (spaceId) => {
        setClickIndex(spaceId)
        if (spaceId === Infinity) navigate('/dashboard')
        else navigate(`spaces/${spaceId}`)
    }

    if (isLoading && spaceSideBarData === null) return <div>Loading...</div>
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
