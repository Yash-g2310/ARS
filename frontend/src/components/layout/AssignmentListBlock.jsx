import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAssignmentList } from '../../features/space/spaceSlice'

const AssignmentListBlock = ({ subspaceId, spaceId }) => {
    const dispatch = useDispatch();
    const {
        assignmentList,
        isAssignmentLoading,
        isError,
        errorMessage
    } = useSelector(state => state.space);

    useEffect(() => {
        const fetchAssignments = async () => {
            if (subspaceId && spaceId && !assignmentList?.[subspaceId]) {
                console.log('calling fetching assignments')
                try {
                    const username = localStorage.getItem('username');
                    await dispatch(fetchAssignmentList({ username, spaceId, subspaceId })).unwrap();
                } catch (error) {
                    console.error('Error fetching assignments:', error);
                }
            }
        };

        fetchAssignments();
    }, [dispatch, subspaceId, spaceId, assignmentList]);

    const currentAssignmentsList = assignmentList?.[subspaceId] || [];
    if (isAssignmentLoading) return (<div>Loading... </div>)
    if (isError) return (<div>{errorMessage}</div>)

    return (
        <div className="pl-2 py-2 space-y-1.5">
            {currentAssignmentsList?.map((assignment) => (
                <div
                    key={assignment.assignment_id}
                    className="flex items-center gap-2 p-1 rounded-md bg-[#4E5058]/30 hover:bg-[#4E5058]/50 text-sm text-light_gray hover:text-light_white transition-colors duration-200 "
                >
                    {console.log(assignment)}
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                    <button className="truncate max-w-[calc(100%-2rem)] flex-1" title={assignment.title}>
                        {assignment.title}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default AssignmentListBlock