import React from 'react'
import { useSelector } from 'react-redux'

const DashboardReviewerAssignments = () => {
    const { reviewerAssignments } = useSelector(state => state.auth)
    console.log(reviewerAssignments)

    return (
        <div className='bg-backg_1 p-4 text-light_white '>
            <table className='min-w-full divide-y divide-gray-500'>
                <thead>
                    <tr className='text-light_gray'>
                        <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider'>Title</th>
                        <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider'>Reviewee</th>
                        <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider'>Space</th>
                        <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider'>Subspace</th>
                        <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider'>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {reviewerAssignments?.map((assignment) => (
                        <tr
                            key={assignment.id}
                            className='text-light_gray hover:bg-gray-700 transition-colors'
                        >
                            <td className='px-4 py-2.5 whitespace-nowrap text-sm'>{assignment.title}</td>
                            <td className='px-4 py-2.5 whitespace-nowrap text-sm'>{assignment.reviewee_name}</td>
                            <td className='px-4 py-2.5 whitespace-nowrap text-sm'>{assignment.space_name}</td>
                            <td className='px-4 py-2.5 whitespace-nowrap text-sm'>{assignment.sub_space_name}</td>
                            <td className='px-4 py-2.5 whitespace-nowrap text-sm'>
                                <span className={`px-2 py-1 text-sm flex items-center justify-center rounded-md ${
                                    assignment.status === 'in_progress'
                                        ? 'bg-yellow-700 text-yellow-200'
                                        : assignment.status === 'not_started'
                                        ? 'bg-blue-700 text-blue-200'
                                        : assignment.status === 'reviewed'
                                        ? 'bg-purple-700 text-purple-200'
                                        :'bg-green-900 text-green-200'
                                    }`}>
                                    {assignment.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default DashboardReviewerAssignments
