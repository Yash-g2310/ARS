import React, { useState } from 'react'

const SpaceSideBar = (compoentState, setComponentState) => {
    const dummyData = ['https://robohash.org/10.37.201.177.png', 'https://robohash.org/1037.201.177.png', 'https://robohash.org/103.201.177.png', 'https://robohash.org/103.37.201.png']
    const [hoverIndex, setHoverIndex] = useState(null)
    const [clickIndex, setClickIndex] = useState(Infinity)
    const handleClick = (i) => {
        setClickIndex(i)
    }

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
                {dummyData.map((obj, i) => {
                    return (
                        <li key={i}>
                            <div className='relative pr-2' >
                                <div className={`w-2 rounded-full bg-white ${hoverIndex === i ? 'h-4' : 'h-2'} absolute top-1/2 transform -translate-y-1/2 -left-1   ${clickIndex === i ? "h-4" : 'h-2'}`}></div>
                                <button
                                    onMouseEnter={() => setHoverIndex(i)}
                                    onMouseLeave={() => setHoverIndex(null)}
                                    onClick={() => { handleClick(i) }}
                                    className={`bg-darkslategray w-12 h-12 ml-2 transition-transform duration-300 ease-in-out hover:rounded-xl active:rounded-xl ${clickIndex === i ? "rounded-xl" : 'rounded-full'}`}>
                                    <img src={obj} alt="logo" className='w-full h-full object-cover rounded-full' />
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
