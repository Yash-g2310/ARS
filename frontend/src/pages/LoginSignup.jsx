import React, { useState, useEffect } from 'react'
import Login from '../components/loginSignUp/Login'
import SignUp from '../components/loginSignUp/SignUp'
import LoginSignupHeader from '../components/common/LoginSignupHeader'
import { useDispatch, useSelector } from 'react-redux'
import { checkSession, fetchUserProfile, clearError } from '../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'

const LoginSignup = () => {
    const [isLogin, setIsLogin] = useState(true)
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { isAuthenticated, user, isError, errorMessage } = useSelector(state => state.auth);

    useEffect(() => {
        // console.log('checking session');
        const verifySession = async () => {
            // console.log('verify session ran');
            try {
                await dispatch(checkSession()).unwrap();
            } catch (error) {
                console.error('Error checking session:', error);
            }
        }
        verifySession();
        // console.log('session checked');
    }, [dispatch])

    useEffect(() => {
        // console.log('authentication changed', isAuthenticated);
        if(isAuthenticated){
            dispatch(clearError())
            navigate('/dashboard');
        }
    }, [isAuthenticated, dispatch])
    console.log('LoginSignup')

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
