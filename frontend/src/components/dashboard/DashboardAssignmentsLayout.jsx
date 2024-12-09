import React from 'react'
import DashboardRevieweeAssignments from './DashboardRevieweeAssignments'
import DashboardReviewerAssignments from './DashboardReviewerAssignments'
import { useSelector } from 'react-redux'

const DashboardAssignmentsLayout = () => {
    const { reviewerAssignments,revieweeAssignments } = useSelector(state => state.auth)
    console.log(reviewerAssignments)
    console.log(revieweeAssignments)


    return (
        <>
            {revieweeAssignments.length!==0 && <div className='bg-backg_dark m-2 text-light_white p-4 rounded-md w-fit min-w-full mb-4'>
                <p className='py-2'>Reviewee Roles</p>
                <DashboardRevieweeAssignments />
            </div>}
            {reviewerAssignments.length!==0 &&<div className='bg-backg_dark m-2 text-light_white p-4 rounded-md w-fit min-w-full'>
                <p className='py-2'>Reviewer Roles</p>
                <DashboardReviewerAssignments />
            </div>}
        </>
    )
}

export default DashboardAssignmentsLayout
