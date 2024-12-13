import React, { useState } from 'react';

const SubspaceSideDrawer = ({ subspaces, spaceDetail }) => {
  const [expandedSubspace, setExpandedSubspace] = useState(null);
  if (!spaceDetail) {
    return <div className="p-4 text-light_white">Loading space data...</div>;
  }
  console.log(subspaces)
  console.log(spaceDetail)

  const handleAssignmentClick = (subspace) => {
    setExpandedSubspace(expandedSubspace === subspace.id ? null : subspace.id)
  };

  return (
    <div className='text-light_white flex flex-col gap-3 pt-4'>
      <div className=''>
        <div className='bg-black rounded-t-md max-h-16 overflow-hidden h-full relative'>
          <div className='absolute inset-0 bg-black/20 z-10'></div>
          <img
            src={spaceDetail?.space_background || '/default-bg.png'}
            alt=""
            className='w-fit rounded-t-lg relative z-0'
          />
        </div>
        <div className='flex flex-col text-center justify-between items-center px-2 gap-2 mt-2'>
          <div className='py-2'>
            <h2 className='text-light_white font-roboto'>{spaceDetail?.space_name}</h2>
          </div>
          <button
            className="group flex items-center gap-2 bg-gradient-to-r from-button_purple/90 to-button_purple  hover:from-button_purple hover:to-button_purple/90 px-5 py-2 rounded-lg text-light_white/95 hover:text-light_white text-sm font-medium transition-all duration-300 ease-in-out  shadow-[0_4px_12px_rgba(71,82,196,0.25)]  hover:shadow-[0_6px_20px_rgba(71,82,196,0.35)] backdrop-blur-sm border border-white/10 hover:border-white/20 mb-2"
          >
            <span className="translate-y-[1px]">View Details</span>
          </button>
        </div>
      </div>
      <div className='h-0.5 bg-[#4E5058] rounded-full mx-2'></div>

      <div className='flex flex-col gap-2 p-2 pt-0'>
        <div className='flex flex-row gap-2'>
          <img src="../assets/svg/browse_space.svg" alt="" />
          <h3 className='text-light_gray font-medium px-2'>Subspaces</h3>

        </div>
        {subspaces && subspaces.length > 0 ? (
          subspaces.map((subspace) => (
            <div key={subspace.id} className="flex flex-col">
              {console.log(subspace)}
              {console.log(subspace.is_member)}
              <div className="flex items-center justify-between 
                    bg-[#4E5058]/50 hover:bg-[#4E5058]/70 
                    p-2.5 rounded-md
                    transition-all duration-200 ease-in-out 
                    border border-gray-600/30 hover:border-gray-500/50">
                <button
                  onClick={()=>{handleAssignmentClick(subspace)}}
                  className='flex-1 text-left text-light_white/90 hover:text-light_white 
                    focus:outline-none'
                >
                  <div className="flex items-center gap-2 max-w-32 overflow-hidden">
                    <svg
                      className={`w-4 h-4 flex-shrink-0 transform transition-transform ${expandedSubspace === subspace.id ? 'rotate-90' : ''
                        }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M6 6L14 10L6 14V6Z" />
                    </svg>
                    <span className="truncate" title={subspace.sub_space_name}>
                      {subspace.sub_space_name}
                    </span>
                  </div>
                </button>

                <button
                  className="p-1 hover:bg-[#4E5058] rounded-full transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle menu open
                  }}
                >
                  <svg className="w-5 h-5 text-light_gray hover:text-light_white" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>

              {/* Assignments List */}
              <div className={`overflow-hidden transition-all duration-300 ${expandedSubspace === subspace.id ? 'max-h-96' : 'max-h-0'
                }`}>
                <div className="pl-8 py-2 space-y-2">
                  {subspace.assignments?.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="flex items-center gap-2 p-2 rounded-md bg-[#4E5058]/30 hover:bg-[#4E5058]/50 text-sm text-light_gray hover:text-light_white transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                      </svg>
                      {assignment.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className='text-light_gray/70 text-sm px-2'>No subspaces available</div>
        )}
      </div>
    </div>
  );
};

export default SubspaceSideDrawer;