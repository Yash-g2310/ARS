import React, { useState } from 'react'
import Login from '../components/login'
import SignUp from '../components/SignUp'
import LoginSignupHeader from '../components/LoginSignupHeader'
const LoginSignup = () => {
    const [isLogin, setIsLogin] = useState(true)
    return (
        <div className='flex flex-row w-1/2 justify-center items-center'>
            <div className='w-full'>
                <LoginSignupHeader />
                <div className='flex flex-row justify-center items-center p-6'>
                    <button
                        onClick={() => { setIsLogin(true) }}
                        className={`px-12 py-2 tracking-wide rounded-s-full border border-slate-400 hover:outline-none focus:outline-none transition-all duration-300 ${isLogin ? 'bg-blue-600 tracking-wide text-white' : 'bg-white hover:bg-gray-200'}`}>
                        Login
                    </button>
                    <button
                        onClick={() => { setIsLogin(false) }}
                        className={`px-12 py-2 rounded-e-full border border-slate-400 hover:outline-none focus:outline-none transition-all duration-300 ${!isLogin ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-200'}`}>
                        Sign Up
                    </button>
                </div>
                {isLogin ? <Login /> : <SignUp />}
            </div>
            <div className='hidden w-1/2  h-screen lg:block fixed right-0 top-0'>
                <img
                    src="/assets/front-image.jpg"
                    alt="front-image "
                    className='object-cover h-full w-full'
                />
            </div>
        </div>
    )
}

export default LoginSignup
