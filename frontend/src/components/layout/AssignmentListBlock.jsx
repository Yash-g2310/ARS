import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAssignmentList } from '../../features/space/spaceSlice'

const AssignmentListBlock = ({ expandedSubspace, subspaceId, spaceId }) => {
    const dispatch = useDispatch();
    const {
        assignmentList={},
        isLoading,
        isError,
        errorMessage
    } = useSelector(state => state.space);

    useEffect(() => {
        const fetchAssignments = async () => {
            if (expandedSubspace === subspaceId && !assignmentList[subspaceId]) {
                try {
                    const username = localStorage.getItem('username');
                    await dispatch(fetchAssignmentList({
                        username,
                        spaceId,
                        subspaceId
                    })).unwrap();
                } catch (error) {
                    console.error('Error fetching assignments:', error);
                }
            }
        };

        fetchAssignments();
    }, [dispatch, expandedSubspace, subspaceId, spaceId, assignmentList]);

    // Fix: Only render if expandedSubspace matches subspaceId
    if (expandedSubspace !== subspaceId) return null;

    return (
        <div className="overflow-hidden transition-all duration-300 max-h-96">
            <div className="pl-8 py-2 space-y-2">
                {isLoading && <div className="text-light_gray">Loading assignments...</div>}
                {isError && <div className="text-red-400">{errorMessage}</div>}
                {!isLoading && !isError && assignmentList[subspaceId] && assignmentList[subspaceId].map((assignment) => (
                    <div
                        key={assignment.id}
                        className="flex items-center gap-2 p-2 rounded-md 
                       bg-[#4E5058]/30 hover:bg-[#4E5058]/50 
                       text-sm text-light_gray hover:text-light_white 
                       transition-colors duration-200"
                    >
                        {assignment.title || 'Untitled Assignment'}
                    </div>
                ))}
                {!isLoading && !isError && (!assignmentList[subspaceId] || assignmentList[subspaceId].length === 0) && (
                    <div className="text-light_gray">No assignments found</div>
                )}
            </div>
        </div>
    );
};

export default AssignmentListBlock