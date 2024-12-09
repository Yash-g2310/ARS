import React from 'react'
import { Outlet } from "react-router-dom";
import SpaceSideBar from "./SpaceSideBar";

const MainLayout = () => {
    return (
        <div className='flex flex-row w-screen h-screen' >
            <div className="w-16 h-auto border-r border-gray-600">
                <SpaceSideBar />
            </div>
            <div className="grow h-full overflow-auto">
                <Outlet />
            </div>
        </div>
    )
}

export default MainLayout