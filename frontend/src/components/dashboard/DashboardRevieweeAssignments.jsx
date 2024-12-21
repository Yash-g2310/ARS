import React from 'react'
import { useSelector } from 'react-redux'

const DashboardRevieweeAssignments = () => {
    console.log('in DashboardRevieweeAssignments')
    const { revieweeAssignments } = useSelector(state => state.auth)
    console.log(revieweeAssignments)

    return (
        <div className='bg-backg_1 p-4 text-light_white '>
            <table className='min-w-full divide-y divide-gray-500'>
                <thead>
                    <tr className='text-light_gray'>
                        <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider'>Title</th>
                        <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider'>Space</th>
                        <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider'>Subspace</th>
                        <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider'>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {revieweeAssignments?.map((assignment) => (
                        <tr
                            key={assignment.id}
                            className='text-light_gray hover:bg-gray-700 transition-colors'
                        >
                            <td className='px-4 py-2.5 whitespace-nowrap text-sm'>{assignment.title}</td>
                            <td className='px-4 py-2.5 whitespace-nowrap text-sm'>{assignment.space_name}</td>
                            <td className='px-4 py-2.5 whitespace-nowrap text-sm'>{assignment.sub_space_name}</td>
                            <td className='px-4 py-2.5 whitespace-nowrap text-sm'>
                                <span className={`px-2 py-1 text-sm flex items-center justify-center rounded-md ${
                                    assignment.reviewee_status === 'not_submitted'
                                        ? 'bg-red-700 text-red-200'
                                        : assignment.reviewee_status === 'submitted'
                                        ? 'bg-purple-700 text-purple-200'
                                        :'bg-green-900 text-green-200'
                                    }`}>
                                    {assignment.reviewee_status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default DashboardRevieweeAssignments
