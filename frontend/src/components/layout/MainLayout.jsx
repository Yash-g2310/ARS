import React from 'react'
import { Outlet } from "react-router-dom";
import SpaceSideBar from "./SpaceSideBar";


const MainLayout = () => {
    return (
        <div className='flex flex-row '>
            <div className=" w-fit  h-auto border-r border-gray-600">
                <SpaceSideBar  />
                {/* componentState={componentState} setComponentState={setComponentState} */}
            </div>
            <Outlet/>
        </div>

    )
}

export default MainLayout
