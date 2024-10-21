import React from 'react'

const LoginButton = ({ alt, src, text }) => {
    return (
        <div className='pb-12'>
            <button className="flex items-center justify-center px-4 lg:px-8 py-2 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition duration-150 ease-in-out">
                <img src={src} alt={alt} className="h-5 w-5 mr-2" />
                <span className="text-gray-700 font-medium">{text}</span>
            </button>
        </div>
    )
}

export default LoginButton
